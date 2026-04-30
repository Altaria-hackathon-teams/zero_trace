import os
import pandas as pd
import numpy as np
from flask import Flask, render_template, request, flash, redirect, url_for
from werkzeug.utils import secure_filename
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
app.secret_key = 'super_secret_key'  # Needed for flash messages
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ─────────────────────────────────────────────
# FEATURE ENGINEERING TRANSFORMER
# ─────────────────────────────────────────────
class GigFeatureEngineer(BaseEstimator, TransformerMixin):
    """Transforms raw aggregated gig data into rich ML features."""

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        df = X.copy()

        # --- Income Features ---
        df["income_cv"] = df["income_std"] / (df["avg_income"] + 1)  # Coefficient of variation
        df["income_per_order"] = df["avg_income"] / (df["avg_orders"] + 1)
        df["income_per_active_day"] = df["avg_income"] / (df["avg_active_days"] + 1)

        # --- Stability Features ---
        df["stability_index"] = df["avg_income"] / (df["income_std"] + 1)
        df["volatility_penalty"] = np.where(df["income_cv"] > 0.5, df["income_cv"] - 0.5, 0)

        # --- Engagement / Behavioral Features ---
        df["engagement_rate"] = df["avg_active_days"] / 30.0
        df["engagement_rate"] = df["engagement_rate"].clip(0, 1)
        df["order_density"] = df["avg_orders"] / (df["avg_active_days"] + 1)  # orders per active day

        # --- Efficiency Features ---
        df["efficiency_score"] = 1 / (df["avg_delivery_time"] + 1)  # lower time = better

        # --- Tenure proxy (using active days as signal) ---
        df["tenure_category"] = pd.cut(
            df["avg_active_days"],
            bins=[0, 5, 15, 22, 30],
            labels=[0, 1, 2, 3]
        ).astype(float).fillna(0)

        # --- Composite Risk Signal ---
        df["risk_signal"] = (
            (df["income_cv"] > 0.6).astype(int) +
            (df["engagement_rate"] < 0.3).astype(int) +
            (df["avg_orders"] < 2).astype(int)
        )

        feature_cols = [
            "avg_income", "income_std", "income_cv",
            "income_per_order", "income_per_active_day",
            "stability_index", "volatility_penalty",
            "engagement_rate", "order_density",
            "efficiency_score", "tenure_category",
            "avg_orders", "avg_active_days", "avg_delivery_time",
            "risk_signal"
        ]
        return df[feature_cols].fillna(0)


# ─────────────────────────────────────────────
# SYNTHETIC TRAINING DATA GENERATOR
# ─────────────────────────────────────────────
def generate_training_data(n=3000, seed=42):
    """
    Generates synthetic but realistic gig worker training data.
    Ground truth GigScore is hand-crafted with domain knowledge,
    then used to supervise the ML ensemble.
    """
    rng = np.random.default_rng(seed)

    # Simulate 3 worker archetypes
    archetypes = rng.choice(["power", "regular", "struggling"], size=n, p=[0.2, 0.5, 0.3])

    rows = []
    for archetype in archetypes:
        if archetype == "power":
            income = rng.normal(1800, 300)
            income_std = rng.uniform(100, 400)
            orders = rng.normal(8, 1.5)
            active_days = rng.uniform(22, 30)
            delivery_time = rng.normal(28, 5)
        elif archetype == "regular":
            income = rng.normal(1000, 250)
            income_std = rng.uniform(200, 600)
            orders = rng.normal(5, 1.5)
            active_days = rng.uniform(12, 22)
            delivery_time = rng.normal(35, 8)
        else:  # struggling
            income = rng.normal(500, 200)
            income_std = rng.uniform(300, 800)
            orders = rng.normal(2.5, 1)
            active_days = rng.uniform(3, 12)
            delivery_time = rng.normal(45, 10)

        rows.append({
            "avg_income": max(100, income),
            "income_std": max(0, income_std),
            "avg_orders": max(0.5, orders),
            "avg_active_days": max(1, active_days),
            "avg_delivery_time": max(10, delivery_time),
        })

    df = pd.DataFrame(rows)

    # Domain-expert ground truth score (used to train the model)
    df["true_score"] = (
        0.35 * MinMaxScaler().fit_transform(df[["avg_income"]]).flatten() +
        0.25 * (df["avg_income"] / (df["income_std"] + 1) / 10).clip(0, 1) +
        0.20 * (df["avg_active_days"] / 30).clip(0, 1) +
        0.10 * MinMaxScaler().fit_transform(df[["avg_orders"]]).flatten() +
        0.10 * (1 - MinMaxScaler().fit_transform(df[["avg_delivery_time"]]).flatten())
    )
    df["true_score"] += rng.normal(0, 0.03, size=n)  # add noise
    df["true_score"] = df["true_score"].clip(0, 1)

    return df


# ─────────────────────────────────────────────
# ENSEMBLE MODEL
# ─────────────────────────────────────────────
class GigScoreEnsemble:
    def __init__(self):
        self.feature_engineer = GigFeatureEngineer()
        self.scaler = MinMaxScaler()

        self.gb_model = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=4,
            subsample=0.8,
            random_state=42
        )
        self.rf_model = RandomForestRegressor(
            n_estimators=150,
            max_depth=6,
            min_samples_leaf=5,
            random_state=42
        )
        self.gb_weight = 0.6
        self.rf_weight = 0.4
        self._trained = False

    def train(self):
        train_df = generate_training_data(n=3000)
        X = train_df.drop(columns=["true_score"])
        y = train_df["true_score"]

        X_feat = self.feature_engineer.transform(X)
        X_scaled = self.scaler.fit_transform(X_feat)

        self.gb_model.fit(X_scaled, y)
        self.rf_model.fit(X_scaled, y)
        self._trained = True
        return self

    def predict_raw(self, X_feat_scaled):
        gb_pred = self.gb_model.predict(X_feat_scaled)
        rf_pred = self.rf_model.predict(X_feat_scaled)
        return self.gb_weight * gb_pred + self.rf_weight * rf_pred

    def get_feature_importance(self, feature_names):
        """Blend feature importances from both models."""
        gb_imp = self.gb_model.feature_importances_
        rf_imp = self.rf_model.feature_importances_
        blended = self.gb_weight * gb_imp + self.rf_weight * rf_imp
        return dict(zip(feature_names, blended))


# ─────────────────────────────────────────────
# EXPLAINABILITY: SHAP-LITE APPROXIMATION
# ─────────────────────────────────────────────
def compute_shap_lite(row_features, feature_names, importances, baseline=0.5):
    """
    Lightweight SHAP-style contribution approximation.
    Decomposes the score delta from baseline by feature importance × feature value.
    """
    contributions = {}
    total_importance = sum(importances.values())
    for feat in feature_names:
        val = row_features.get(feat, 0)
        imp = importances.get(feat, 0)
        # Contribution = importance-weighted deviation from 0.5 midpoint
        contributions[feat] = round(float((val - 0.5) * imp / total_importance * 100), 2)
    return contributions


# ─────────────────────────────────────────────
# CREDIT TIER + RISK FLAGS
# ─────────────────────────────────────────────
def assign_tier(score):
    if score >= 800:
        return "Platinum", "🏆"
    elif score >= 700:
        return "Gold", "🥇"
    elif score >= 580:
        return "Silver", "🥈"
    elif score >= 450:
        return "Bronze", "🥉"
    else:
        return "Unrated", "🔴"


def detect_risk_flags(row):
    flags = []
    if row.get("income_cv", 0) > 0.6:
        flags.append("High income volatility")
    if row.get("engagement_rate", 1) < 0.3:
        flags.append("Low platform engagement")
    if row.get("avg_orders", 10) < 2:
        flags.append("Very low order volume")
    if row.get("avg_delivery_time", 30) > 50:
        flags.append("Efficiency concerns")
    return flags


def suggest_loan(score):
    if score >= 800:
        return {"limit": "₹2,00,000", "rate": "10.5%", "tenure": "36 months"}
    elif score >= 700:
        return {"limit": "₹1,00,000", "rate": "13%", "tenure": "24 months"}
    elif score >= 580:
        return {"limit": "₹50,000", "rate": "16%", "tenure": "18 months"}
    elif score >= 450:
        return {"limit": "₹20,000", "rate": "20%", "tenure": "12 months"}
    else:
        return None


# ─────────────────────────────────────────────
# MAIN PIPELINE
# ─────────────────────────────────────────────
_ensemble = None

def get_ensemble():
    global _ensemble
    if _ensemble is None:
        _ensemble = GigScoreEnsemble().train()
    return _ensemble


def generate_gig_scores(csv_path):
    df = pd.read_csv(csv_path)

    # Aggregate per worker
    features = df.groupby("worker_id").agg({
        "earnings_inr": ["mean", "std"],
        "order_count": "mean",
        "active_days": "mean",
        "avg_delivery_time_mins": "mean"
    }).reset_index()

    features.columns = [
        "worker_id", "avg_income", "income_std",
        "avg_orders", "avg_active_days", "avg_delivery_time"
    ]
    features["income_std"] = features["income_std"].fillna(0)

    # Get trained ensemble
    ensemble = get_ensemble()

    # Engineer features
    raw_input = features.drop(columns=["worker_id"])
    engineered = ensemble.feature_engineer.transform(raw_input)
    feature_names = list(engineered.columns)
    X_scaled = ensemble.scaler.transform(engineered)

    # Predict
    raw_scores = ensemble.predict_raw(X_scaled).clip(0, 1)
    features["GigScore"] = (300 + raw_scores * 600).astype(int)

    # Feature importances for explainability
    importances = ensemble.get_feature_importance(feature_names)

    # Per-worker enrichment
    records = []
    for i, row in features.iterrows():
        tier, tier_icon = assign_tier(row["GigScore"])
        
        # SHAP-lite contributions
        feat_row = dict(zip(feature_names, X_scaled[i]))
        contributions = compute_shap_lite(feat_row, feature_names, importances)
        top_drivers = sorted(contributions.items(), key=lambda x: abs(x[1]), reverse=True)[:4]

        # Risk flags
        eng_row = dict(zip(feature_names, engineered.iloc[i]))
        flags = detect_risk_flags(eng_row)

        # Loan suggestion
        loan = suggest_loan(row["GigScore"])

        records.append({
            "worker_id": row["worker_id"],
            "GigScore": int(row["GigScore"]),
            "tier": tier,
            "tier_icon": tier_icon,
            "avg_income": round(float(row["avg_income"]), 2),
            "income_std": round(float(row["income_std"]), 2),
            "avg_orders": round(float(row["avg_orders"]), 2),
            "avg_active_days": round(float(row["avg_active_days"]), 2),
            "avg_delivery_time": round(float(row["avg_delivery_time"]), 2),
            "income_cv": round(float(eng_row.get("income_cv", 0)), 3),
            "engagement_rate": round(float(eng_row.get("engagement_rate", 0)), 3),
            "stability_index": round(float(eng_row.get("stability_index", 0)), 2),
            "top_drivers": top_drivers,
            "risk_flags": flags,
            "loan_offer": loan,
        })

    return records

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            try:
                # Process the file
                records = generate_gig_scores(filepath)
                os.remove(filepath)
                return render_template('index.html', records=records, show_results=True)
            except Exception as e:
                flash(f"Error processing file: {str(e)}", "error")
                return redirect(request.url)
        else:
            flash('Invalid file type. Please upload a CSV.', 'error')
            return redirect(request.url)

    return render_template('index.html', show_results=False)

if __name__ == '__main__':
    app.run(debug=True)
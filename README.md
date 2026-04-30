# Zero_trace

## Folder Structure

```bash

gigcredit/ (monorepo)
├── frontend/ (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # hero, 150M stat, CTA
│   │   │   ├── Upload.jsx           # PDF + CSV drop zones
│   │   │   ├── Score.jsx            # GigScore card + breakdown
│   │   │   ├── Proof.jsx            # ZK hash + chain confirm
│   │   │   └── Verify.jsx           # bank verifier portal
│   │   ├── components/
│   │   │   ├── ScoreCard.jsx        # score + factor bars
│   │   │   ├── LoanCard.jsx         # 48% vs 14% savings
│   │   │   └── UploadZone.jsx       # drag-drop + fallback
│   │   ├── store/
│   │   │   └── useWorkerStore.js    # Zustand global state
│   │   └── utils/
│   │       └── gigId.js             # GIG-BLR-SWG-XXXXX
│   └── public/
│       └── mock/
│           └── workers.json         # 5 demo profiles
├── backend/ (Node.js + Express + Multer)
│   ├── routes/
│   │   ├── score.js                 # POST /api/score
│   │   ├── proof.js                 # POST /api/proof
│   │   └── verify.js                # GET /api/verify/:proofId
│   ├── services/
│   │   ├── pdfParser.js             # UPI credit line extractor
│   │   ├── csvParser.js             # validates + parses rows
│   │   ├── normalizer.js            # merges PDF + CSV → JSON
│   │   ├── zkProof.js               # mock ZK attestation
│   │   └── contract.js              # Polygon write + read
│   └── middleware/
│       └── upload.js                # Multer, 10MB limit
├── ml-engine/ (Python + FastAPI)
│   ├── main.py                      # FastAPI app, POST /score
│   ├── features.py                  # CV, tenure, active days
│   ├── scorer.py                    # weighted formula → 0–850
│   ├── schema.py                    # Pydantic input validation
│   ├── mock_data/                   # 5 worker JSONs for demo
│   └── tests/
│       └── test_scorer.py           # edge cases + bad profile
├── blockchain/ (Hardhat + Solidity)
│   ├── contracts/
│   │   └── GigScore.sol             # store + isValid(proofId)
│   ├── scripts/
│   │   └── deploy.js                # Polygon Mumbai testnet
│   └── artifacts/
│       └── GigScore.json            # ABI for backend import
└── shared/
    └── workerSchema.js              # canonical JSON contract

```
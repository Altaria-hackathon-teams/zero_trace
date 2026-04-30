# Zero_trace

## Problem Statement 

Problem: Over 150 million gig workers in India (Swiggy, Zomato, Ola drivers) earn real, consistent income but have zero formal credit history no payslips, no CIBIL score. Banks reject 90% of their loan applications, pushing them toward oppresive moneylenders charging 36–60% interest.

Solution: GigCredit converts existing platform activity (order history, earnings, tenure, activity frequency) into a portable, worker-owned credit score. The data is processed through a ZK-proof engine that generates a cryptographic attestation of creditworthiness without ever exposing the raw income data. This attestation is secured on a blockchain smart contract, making it tamper-proof and instantly verifiable by any bank or NBFC.

How it uses AI & Blockchain: An AI scoring engine analyzes behavioral and earnings patterns to compute the GigScore.

Impact: A verified GigScore could replace a 48% informal loan with a 14% bank loan. Reaching just 1% of the workforce means 1.5 million people get their first formal financial identity unlocking housing loans, insurance, and generational financial stability.

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

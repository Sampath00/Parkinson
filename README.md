# Parkinson Detection

## Description

**Parkinson Detection** is a machine learning-based application that analyzes **voice recordings** and **hand-drawn images** (spiral tests) to predict the probability of Parkinson’s disease. It generates a report based on the analysis.

## Tech Stack

- **Frontend:** React (Vite + TypeScript)
- **Backend:** FastAPI (Python)
- **Machine Learning Models:** TensorFlow (for image analysis), Scikit-learn (for voice analysis)
- **Database:** Local storage (for user session data)
- **API Communication:** Axios (for frontend-backend interaction)
- **Development Tools:** Concurrently (to run frontend and backend simultaneously)

## Installation

### Prerequisites

- **Node.js** (Recommended: v16+)
- **Python** (Recommended: 3.8+)
- **pip** (Python package manager)
- **npm** (Node.js package manager)

### 1⃣ Install Frontend & Backend Dependencies

Run the following command from the **project root** to install dependencies for both frontend and backend:

```sh
npm run install:frontend-backend
```

This will:

- Install **frontend dependencies** using `npm install`
- Install **backend dependencies** using `pip install -r backend/requirements.txt`

### 2⃣ Start the Application

Use the following command to **start both frontend and backend** concurrently:

```sh
npm run start:frontend-backend
```

This will:

- Start the **frontend** (`Vite development server`) at **http://localhost:5173/**
- Start the **backend** (`FastAPI server`) at **http://localhost:8000/**

---

## Project Structure

```
parkinson-detection/
│── backend/             # Backend (FastAPI) with ML models
│   ├── main.py          # FastAPI entry point
│   ├── models/          # Pretrained models (H5, Pickle files)
│   ├── routes/          # API routes
│   ├── requirements.txt # Backend dependencies
│── frontend/            # Frontend (React + Vite + TypeScript)
│   ├── src/             # React components and pages
│   ├── assets/          # Static images/icons
│   ├── vite.config.ts   # Vite configuration
│── package.json         # Scripts to run frontend & backend
│── README.md            # Project documentation
```

---

## API Endpoints

| Method | Endpoint         | Description                                             |
| ------ | ---------------- | ------------------------------------------------------- |
| POST   | `/predict/voice` | Uploads a **voice file** and predicts Parkinson's       |
| POST   | `/predict/image` | Uploads a **hand-drawn image** and predicts Parkinson's |
| GET    | `/health`        | Health check for the backend service                    |

#### Example API Call

```sh
curl -X POST "http://localhost:8000/predict/image" -F "file=@spiral_test.png"
```

---

## Environment Variables (Optional)

If your application requires environment variables, create a `.env` file in the **backend** directory:

```
PORT=8000
FRONTEND_URL=http://localhost:5173
```

---

## Troubleshooting

### **CORS Issues**

If you get a **CORS error**, ensure your backend allows requests from `http://localhost:5173`.  
Modify the **FastAPI CORS settings** in `backend/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Backend Not Running?**

If `uvicorn` fails, try running it manually:

```sh
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import librosa
import cv2
import uvicorn
import joblib
import os
from PIL import Image
import io
from typing import List, Dict, Any
from pydantic import BaseModel

# Create FastAPI app
app = FastAPI(title="Parkinson's Disease Detection API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models (in a real application, you would train these models separately)
# For demonstration, we'll create placeholders and load them if they exist
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

VOICE_MODEL_PATH = os.path.join(MODEL_DIR, "voice_model.pkl")
IMAGE_MODEL_PATH = os.path.join(MODEL_DIR, "image_model.pkl")

# Load models if they exist, otherwise initialize placeholders
try:
    voice_model = joblib.load(VOICE_MODEL_PATH)
    print("Voice model loaded successfully")
except:
    print("Voice model not found, initializing placeholder")
    # Placeholder for actual model training
    # In production, you would train a proper model with appropriate features
    from sklearn.ensemble import RandomForestClassifier
    voice_model = RandomForestClassifier(random_state=42)

try:
    image_model = joblib.load(IMAGE_MODEL_PATH)
    print("Image model loaded successfully")
except:
    print("Image model not found, initializing placeholder")
    # Placeholder for actual model training
    from sklearn.ensemble import RandomForestClassifier
    image_model = RandomForestClassifier(random_state=42)

# Response models
class PredictionResult(BaseModel):
    prediction: bool
    probability: float
    features: Dict[str, float]

# Voice analysis functions
def extract_voice_features(audio_bytes):
    """Extract features from voice recording."""
    try:
        # Load audio file from bytes
        y, sr = librosa.load(io.BytesIO(audio_bytes), sr=22050)
        
        # Extract features (MFCC, spectral features, etc.)
        # These are common features for Parkinson's detection from voice
        
        # MFCCs (Mel-frequency cepstral coefficients)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfccs, axis=1)
        
        # Spectral features
        spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
        spectral_rolloff = np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr))
        
        # Zero crossing rate
        zcr = np.mean(librosa.feature.zero_crossing_rate(y))
        
        # Jitter and Shimmer approximations
        # (simplified - in a real app you'd use more sophisticated methods)
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=75, fmax=600)
        f0 = f0[~np.isnan(f0)]
        if len(f0) > 1:
            jitter = np.mean(np.abs(np.diff(f0)))
        else:
            jitter = 0
            
        # Amplitude variations as shimmer approximation
        shimmer = np.std(np.abs(y)) / np.mean(np.abs(y)) if np.mean(np.abs(y)) > 0 else 0
        
        # HNR (Harmonics-to-Noise Ratio) approximation
        hnr = 0  # placeholder - would require more complex calculation
        
        # Format features as a dictionary
        features = {
            "mfcc1": float(mfcc_mean[0]),
            "mfcc2": float(mfcc_mean[1]),
            "mfcc3": float(mfcc_mean[2]),
            "mfcc4": float(mfcc_mean[3]),
            "spectral_centroid": float(spectral_centroid),
            "spectral_rolloff": float(spectral_rolloff),
            "zcr": float(zcr),
            "jitter": float(jitter),
            "shimmer": float(shimmer),
            "hnr": float(hnr)
        }
        
        # Convert to format expected by model
        features_array = np.array([[
            features["mfcc1"], features["mfcc2"], features["mfcc3"], features["mfcc4"],
            features["spectral_centroid"], features["spectral_rolloff"], features["zcr"],
            features["jitter"], features["shimmer"], features["hnr"]
        ]])
        
        return features_array, features
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")

# Image analysis functions
def extract_image_features(image_bytes):
    """Extract features from hand drawing image."""
    try:
        # Load image from bytes
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply preprocessing
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # Extract features
        # For spiral or wave drawings in Parkinson's detection, common features include:
        
        # 1. Contour properties
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            raise HTTPException(status_code=400, detail="No contours found in image")
        
        main_contour = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(main_contour)
        perimeter = cv2.arcLength(main_contour, True)
        
        # 2. Shape features
        circularity = (4 * np.pi * area) / (perimeter * perimeter) if perimeter > 0 else 0
        
        # 3. Histogram features
        hist = cv2.calcHist([gray], [0], None, [8], [0, 256])
        hist_features = hist.flatten() / hist.sum()
        
        # 4. Intensity variations
        std_intensity = np.std(gray)
        
        # 5. Edge features
        edges = cv2.Canny(gray, 100, 200)
        edge_count = np.count_nonzero(edges)
        
        # Format features
        features = {
            "area": float(area),
            "perimeter": float(perimeter),
            "circularity": float(circularity),
            "std_intensity": float(std_intensity),
            "edge_density": float(edge_count / (img.shape[0] * img.shape[1])),
            "hist_bin1": float(hist_features[0]),
            "hist_bin2": float(hist_features[1]),
            "hist_bin3": float(hist_features[2]),
            "hist_bin4": float(hist_features[3])
        }
        
        # Convert to format expected by model
        features_array = np.array([[
            features["area"], features["perimeter"], features["circularity"],
            features["std_intensity"], features["edge_density"],
            features["hist_bin1"], features["hist_bin2"], features["hist_bin3"], features["hist_bin4"]
        ]])
        
        return features_array, features
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# Endpoints
@app.post("/predict/voice", response_model=PredictionResult)
async def predict_voice(file: UploadFile = File(...)):
    """Analyze voice recording for Parkinson's disease indicators."""
    if not file.filename.endswith(('.wav', '.mp3', '.ogg')):
        raise HTTPException(status_code=400, detail="Invalid audio format. Please upload WAV, MP3, or OGG file")
    
    # Read file
    contents = await file.read()
    
    # Extract features
    features_array, features_dict = extract_voice_features(contents)
    
    # Make prediction
    # In a real app, you would use a properly trained model
    try:
        # For demonstration, we'll use a placeholder prediction
        # probability = voice_model.predict_proba(features_array)[0][1]
        # is_parkinsons = probability > 0.5
        
        # Since we're using a placeholder model, simulate a prediction
        # This should be replaced with actual model inference in production
        probability = 0.3  # Sample probability 
        is_parkinsons = probability > 0.5
        
        return PredictionResult(
            prediction=is_parkinsons,
            probability=float(probability),
            features=features_dict
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/image", response_model=PredictionResult)
async def predict_image(file: UploadFile = File(...)):
    """Analyze hand drawing image for Parkinson's disease indicators."""
    if not file.filename.endswith(('.jpg', '.jpeg', '.png')):
        raise HTTPException(status_code=400, detail="Invalid image format. Please upload JPG or PNG file")
    
    # Read file
    contents = await file.read()
    
    # Extract features
    features_array, features_dict = extract_image_features(contents)
    
    # Make prediction
    # In a real app, you would use a properly trained model
    try:
        # For demonstration, we'll use a placeholder prediction
        # probability = image_model.predict_proba(features_array)[0][1]
        # is_parkinsons = probability > 0.5
        
        # Since we're using a placeholder model, simulate a prediction
        # This should be replaced with actual model inference in production
        probability = 0.7  # Sample probability
        is_parkinsons = probability > 0.5
        
        return PredictionResult(
            prediction=is_parkinsons,
            probability=float(probability),
            features=features_dict
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Parkinson's Disease Detection API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

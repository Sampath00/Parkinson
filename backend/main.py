from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import librosa
import cv2
from typing import List
import io
import tensorflow as tf  # For .h5 model
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from scipy.stats import skew

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGE_MODEL_PATH = "backend/models/parkinson_disease_detection.h5"

# Initialize models as None and load them during startup
voice_model = None
image_model = None
scaler = None

@app.on_event("startup")
async def startup_event():
    global voice_model, image_model, scaler
    try:
        voice_model, scaler = train_model(load_training_data())
        image_model = tf.keras.models.load_model(IMAGE_MODEL_PATH)
        print("Models loaded successfully")
        
        # Print model info for debugging
        if image_model is not None:
            print("Image model input shape:", image_model.inputs[0].shape)
            print("Image model summary:")
            image_model.summary()
    except Exception as e:
        print(f"Warning: Model loading failed: {str(e)}")
        # Still allow the app to start, but endpoints will return errors if models aren't loaded

def load_training_data():
    """Load or create a dataset for Parkinson's disease detection based on voice characteristics."""
    n_parkinsons = 100
    n_healthy = 100

    healthy_data = {
        'jitter_percent': np.random.normal(0.5, 0.1, n_healthy),
        'jitter_abs': np.random.normal(25, 5, n_healthy),
        'shimmer_percent': np.random.normal(2.0, 0.4, n_healthy),
        'shimmer_abs': np.random.normal(0.2, 0.04, n_healthy),
        'nhr': np.random.normal(0.015, 0.003, n_healthy),
        'hnr': np.random.normal(20, 2, n_healthy),
        'f0_mean': np.random.normal(120, 10, n_healthy),
        'f0_std': np.random.normal(2.5, 0.5, n_healthy),
        'f0_max': np.random.normal(130, 10, n_healthy),
        'f0_min': np.random.normal(110, 10, n_healthy),
        'ppe': np.random.normal(0.1, 0.02, n_healthy),
        'dfa': np.random.normal(0.6, 0.05, n_healthy),
        'spread1': np.random.normal(0.2, 0.04, n_healthy),
        'spread2': np.random.normal(0.2, 0.04, n_healthy),
        'd2': np.random.normal(2.5, 0.3, n_healthy),
        'status': np.zeros(n_healthy)
    }

    parkinsons_data = {
        'jitter_percent': np.random.normal(1.0, 0.2, n_parkinsons),
        'jitter_abs': np.random.normal(60, 15, n_parkinsons),
        'shimmer_percent': np.random.normal(4.0, 0.8, n_parkinsons),
        'shimmer_abs': np.random.normal(0.4, 0.08, n_parkinsons),
        'nhr': np.random.normal(0.03, 0.005, n_parkinsons),
        'hnr': np.random.normal(15, 3, n_parkinsons),
        'f0_mean': np.random.normal(110, 15, n_parkinsons),
        'f0_std': np.random.normal(5.0, 1.0, n_parkinsons),
        'f0_max': np.random.normal(125, 15, n_parkinsons),
        'f0_min': np.random.normal(95, 15, n_parkinsons),
        'ppe': np.random.normal(0.2, 0.04, n_parkinsons),
        'dfa': np.random.normal(0.7, 0.07, n_parkinsons),
        'spread1': np.random.normal(0.3, 0.05, n_parkinsons),
        'spread2': np.random.normal(0.3, 0.05, n_parkinsons),
        'd2': np.random.normal(2.0, 0.4, n_parkinsons),
        'status': np.ones(n_parkinsons)
    }

    df_healthy = pd.DataFrame(healthy_data)
    df_parkinsons = pd.DataFrame(parkinsons_data)
    df = pd.concat([df_healthy, df_parkinsons], ignore_index=True)

    df['f0_range'] = df['f0_max'] - df['f0_min']
    df['jitter_shimmer_ratio'] = df['jitter_percent'] / df['shimmer_percent']

    return df

def train_model(_df):
    """Train a machine learning model on the dataset."""
    X = _df.drop('status', axis=1)
    y = _df['status']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=5,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    model.fit(X_train, y_train)

    train_accuracy = model.score(X_train, y_train)
    test_accuracy = model.score(X_test, y_test)
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    y_pred = model.predict(X_test)
    classification_result = classification_report(y_test, y_pred, output_dict=True)

    return model, scaler

def make_prediction(features, model, scaler):
    """Make prediction using the trained model."""
    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)[0]
    probability = model.predict_proba(scaled_features)[0][1]

    return {
        'prediction': int(prediction),
        'probability': float(probability),
        'message': "Parkinson's disease indicators detected" if prediction == 1 else "No Parkinson's disease indicators detected",
        'confidence': f"{probability * 100:.2f}%"
    }

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Process spiral drawing image for model input based on model requirements"""
    image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    
    # This is likely a CNN model, so we'll keep the 2D structure
    # Start with a standard CNN input size
    image = cv2.resize(image, (128, 128))
    
    # Convert to grayscale
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Normalize pixel values
    image = image / 255.0
    
    # Add channel dimension (for grayscale - 1 channel)
    image = np.expand_dims(image, axis=-1)
    
    # Add batch dimension
    image = np.expand_dims(image, axis=0)
    
    return image


@app.post("/predict/voice")
async def predict_voice(file: UploadFile = File(...)):
    if voice_model is None or scaler is None:
        raise HTTPException(503, "Voice model not loaded. Check server logs.")
        
    try:
        # Process audio
        audio_data, sr = librosa.load(io.BytesIO(await file.read()), sr=22050)
        if len(audio_data) < sr * 1:  # Minimum 1-second audio
            raise HTTPException(400, "Audio too short (<1s)")
        
        features_df = extract_voice_features(audio_data, sr)
        prediction_result = make_prediction(features_df, voice_model, scaler)
        return {"type": "voice", "prediction": prediction_result}
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(500, f"Audio processing failed: {str(e)}")

def extract_voice_features(audio_data: np.ndarray, sr: int) -> pd.DataFrame:
    """Extract clinically relevant voice features for Parkinson's detection."""
    try:
        f0, voiced_flag, voiced_probs = librosa.pyin(audio_data, fmin=60, fmax=400, sr=sr, frame_length=2048, hop_length=512)
        f0_voiced = f0[voiced_flag]

        if len(f0_voiced) > 2:
            period = 1.0 / f0_voiced
            jitter_abs = np.mean(np.abs(np.diff(period))) * 1000
            jitter_percent = (jitter_abs / np.mean(period)) * 100
        else:
            jitter_abs = 0
            jitter_percent = 0

        rms = librosa.feature.rms(y=audio_data)[0]
        shimmer_abs = np.mean(np.abs(np.diff(rms)))
        shimmer_percent = (shimmer_abs / np.mean(rms)) * 100 if np.mean(rms) > 0 else 0

        harmonic = librosa.effects.harmonic(audio_data)
        noise = audio_data - harmonic
        hnr = 10 * np.log10(np.sum(harmonic**2) / np.sum(noise**2)) if np.sum(noise**2) > 0 else 20
        nhr = np.sum(noise**2) / np.sum(harmonic**2) if np.sum(harmonic**2) > 0 else 0.03

        f0_mean = np.mean(f0_voiced) if len(f0_voiced) > 0 else 0
        f0_std = np.std(f0_voiced) if len(f0_voiced) > 0 else 0
        f0_max = np.max(f0_voiced) if len(f0_voiced) > 0 else 0
        f0_min = np.min(f0_voiced) if len(f0_voiced) > 0 else 0
        f0_range = f0_max - f0_min

        mfccs = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=13)
        dfa = np.mean(np.std(mfccs, axis=1))
        ppe = np.log(np.std(f0_voiced) / np.mean(f0_voiced)) if len(f0_voiced) > 0 and np.mean(f0_voiced) > 0 else 0.1

        if len(f0_voiced) > 1:
            spread1 = np.std(np.diff(f0_voiced)) / np.mean(f0_voiced) if np.mean(f0_voiced) > 0 else 0.2
            spread2 = skew(f0_voiced)
        else:
            spread1 = 0.2
            spread2 = 0.2

        d2 = 2.0 + np.mean(librosa.feature.spectral_flatness(y=audio_data))
        jitter_shimmer_ratio = jitter_percent / shimmer_percent if shimmer_percent > 0 else 0.5

        features = {
            'jitter_percent': jitter_percent,
            'jitter_abs': jitter_abs,
            'shimmer_percent': shimmer_percent,
            'shimmer_abs': shimmer_abs,
            'nhr': nhr,
            'hnr': hnr,
            'f0_mean': f0_mean,
            'f0_std': f0_std,
            'f0_max': f0_max,
            'f0_min': f0_min,
            'ppe': ppe,
            'dfa': dfa,
            'spread1': spread1,
            'spread2': spread2,
            'd2': d2,
            'f0_range': f0_range,
            'jitter_shimmer_ratio': jitter_shimmer_ratio
        }

        return pd.DataFrame([features])

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(500, f"Error extracting voice features: {str(e)}")
    
@app.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    if image_model is None:
        raise HTTPException(503, "Image model not loaded. Check server logs.")
        
    try:
        # Process image
        image_bytes = await file.read()
        processed_image = preprocess_image(image_bytes)
        
        # Add logging to debug shape issues
        print(f"Processed image shape: {processed_image.shape}")
        
        # Try to adapt the image shape if needed based on the model's expected input
        if hasattr(image_model, 'inputs') and image_model.inputs:
            expected_shape = image_model.inputs[0].shape
            print(f"Model expects input shape: {expected_shape}")
            
            # Only reshape if the input shape is fully defined (no None dimensions)
            if None not in expected_shape[1:]:  # Skip batch dimension which can be None
                # Reshape to match expected dimensions (preserving batch dimension)
                processed_image = tf.image.resize(processed_image, 
                                                 (expected_shape[1], expected_shape[2]))
                # Ensure correct number of channels
                if expected_shape[3] != processed_image.shape[3]:
                    if expected_shape[3] == 3 and processed_image.shape[3] == 1:
                        # Convert grayscale to RGB if needed
                        processed_image = tf.image.grayscale_to_rgb(processed_image)
                    # Other conversions would need specific handling
        
        # Predict using the .h5 model
        prediction = image_model.predict(processed_image)
        
        # Handle different output formats based on model architecture
        if isinstance(prediction, list):
            prediction = prediction[0]
        
        if prediction.ndim > 1 and prediction.shape[1] > 1:
            # Multi-class classification - get class with highest probability
            prediction_class = int(np.argmax(prediction[0]))
        else:
            # Binary classification
            prediction_class = int(np.round(prediction[0][0]))
            
        return {"type": "image", "prediction": prediction_class}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(500, f"Image processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


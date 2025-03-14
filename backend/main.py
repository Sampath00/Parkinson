from fastapi import FastAPI, File, UploadFile, HTTPException,Request
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import librosa
import joblib
import cv2
from typing import List
import io
import tensorflow as tf  # For .h5 model

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fix paths with forward slashes
VOICE_MODEL_PATH = "backend/models/parkinson_classifier_model.pkl"
IMAGE_MODEL_PATH = "backend/models/parkinson_disease_detection.h5"

# Initialize models as None and load them during startup
voice_model = None
image_model = None

@app.on_event("startup")
async def startup_event():
    global voice_model, image_model
    try:
        voice_model = joblib.load(VOICE_MODEL_PATH)
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

# ================== Voice Analysis ==================
def extract_voice_features(audio_data: np.ndarray, sr: int) -> List[float]:
    """Extract 22 voice features for Parkinson's detection"""
    features = {}

    # Basic features - fundamental frequency analysis
    f0, _, _ = librosa.pyin(audio_data, fmin=80, fmax=600, fill_na=0)
    features["MDVP:Fo(Hz)"] = np.mean(f0[f0 > 0]) if np.any(f0 > 0) else 0.0
    features["MDVP:Fhi(Hz)"] = np.max(f0[f0 > 0]) if np.any(f0 > 0) else 0.0
    features["MDVP:Flo(Hz)"] = np.min(f0[f0 > 0]) if np.any(f0 > 0) else 0.0

    # Jitter calculations
    rms = librosa.feature.rms(y=audio_data)[0]
    features["MDVP:Jitter(%)"] = np.std(rms) / np.mean(rms) * 100 if np.mean(rms) > 0 else 0.0
    features["MDVP:Jitter(Abs)"] = np.std(rms)
    
    # Fill remaining jitter features
    features["MDVP:RAP"] = np.mean(np.diff(rms)) if len(rms) > 1 else 0.0
    features["MDVP:PPQ"] = np.std(np.diff(rms)) if len(rms) > 1 else 0.0
    features["Jitter:DDP"] = np.mean(np.abs(np.diff(np.diff(rms)))) if len(rms) > 2 else 0.0
    
    # Shimmer features
    mfccs = librosa.feature.mfcc(y=audio_data, sr=sr)
    features["MDVP:Shimmer"] = np.std(mfccs[0]) if mfccs.size > 0 else 0.0
    features["MDVP:Shimmer(dB)"] = 20 * np.log10(np.std(mfccs[0]) + 1e-10) if mfccs.size > 0 else 0.0
    features["Shimmer:APQ3"] = np.mean(mfccs[1]) if mfccs.shape[0] > 1 else 0.0
    features["Shimmer:APQ5"] = np.mean(mfccs[2]) if mfccs.shape[0] > 2 else 0.0
    features["MDVP:APQ"] = np.mean(mfccs[3]) if mfccs.shape[0] > 3 else 0.0
    features["Shimmer:DDA"] = np.std(mfccs[1]) if mfccs.shape[0] > 1 else 0.0
    
    # NHR and HNR
    spectral_centroid = librosa.feature.spectral_centroid(y=audio_data, sr=sr)[0]
    features["NHR"] = np.std(spectral_centroid) / (np.mean(spectral_centroid) + 1e-10)
    features["HNR"] = 1.0 / (features["NHR"] + 1e-10)
    
    # Additional features - Fixed the spectral_flatness call
    features["RPDE"] = np.mean(librosa.feature.spectral_rolloff(y=audio_data, sr=sr)[0])
    features["DFA"] = np.mean(librosa.feature.spectral_bandwidth(y=audio_data, sr=sr)[0])
    features["spread1"] = np.std(librosa.feature.spectral_contrast(y=audio_data, sr=sr)[0])
    # Removed sr parameter from spectral_flatness
    features["spread2"] = np.mean(librosa.feature.spectral_flatness(y=audio_data)[0])
    chroma = librosa.feature.chroma_stft(y=audio_data, sr=sr)
    features["D2"] = np.mean(np.std(chroma, axis=1))
    features["PPE"] = np.max(librosa.feature.poly_features(y=audio_data, sr=sr)[0])
    
    return [features[key] for key in [
        "MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)",
        "MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP",
        "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer",
        "MDVP:Shimmer(dB)", "Shimmer:APQ3", "Shimmer:APQ5",
        "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR",
        "RPDE", "DFA", "spread1", "spread2", "D2", "PPE"
    ]]

# ================== Image Analysis ==================
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

# ================== API Endpoints ==================
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "API is running", 
            "voice_model_loaded": voice_model is not None,
            "image_model_loaded": image_model is not None}

@app.post("/predict/voice")
async def predict_voice(file: UploadFile = File(...)):
    if voice_model is None:
        raise HTTPException(503, "Voice model not loaded. Check server logs.")
        
    try:
        # Process audio
        audio_data, sr = librosa.load(io.BytesIO(await file.read()), sr=22050)
        if len(audio_data) < sr * 1:  # Minimum 1-second audio
            raise HTTPException(400, "Audio too short (<1s)")
        
        features = extract_voice_features(audio_data, sr)
        prediction = voice_model.predict([features])
        return {"type": "voice", "prediction": int(prediction[0])}
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(500, f"Audio processing failed: {str(e)}")

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
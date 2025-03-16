Here’s a concise summary of each function in the provided code:

1. **`app = FastAPI()`**: Initializes a FastAPI application.

2. **`app.add_middleware(CORSMiddleware, ...)`**: Configures CORS middleware to allow requests from a React frontend.

3. **`startup_event()`**: Loads the voice and image models during application startup. Handles model loading errors gracefully.

4. **`load_training_data()`**: Generates a synthetic dataset for Parkinson's disease detection based on voice characteristics, with healthy and Parkinson's samples.

5. **`train_model(_df)`**: Trains a RandomForestClassifier on the dataset, scales features using StandardScaler, and returns the trained model and scaler.

6. **`make_prediction(features, model, scaler)`**: Uses the trained model to make predictions on input features, returning prediction results with confidence.

7. **`preprocess_image(image_bytes)`**: Processes an image for model input by resizing, converting to grayscale, normalizing, and adding dimensions.

8. **`predict_voice(file)`**: Handles voice file uploads, extracts features, and makes predictions using the voice model. Returns prediction results.

9. **`extract_voice_features(audio_data, sr)`**: Extracts clinically relevant voice features (e.g., jitter, shimmer, HNR) from audio data for Parkinson's detection.

10. **`predict_image(file)`**: Handles image file uploads, preprocesses the image, and makes predictions using the image model. Returns prediction results.

11. **`if __name__ == "__main__":`**: Runs the FastAPI app using Uvicorn on `0.0.0.0:8000`.

Each function is designed to support a FastAPI-based application for detecting Parkinson's disease using voice and image data.
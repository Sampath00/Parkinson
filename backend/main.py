import os
import numpy as np
import tensorflow as tf
import librosa
import cv2
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
import pickle
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'wav', 'mp3'}

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load models
def load_models():
    # Load spiral image model
    try:
        spiral_model = tf.keras.models.load_model('backend\models\parkinson_disease_detection.h5')
    except:
        # If model doesn't exist, create a placeholder
        print("Spiral model not found. Creating new model.")
        spiral_model = create_spiral_model()
        
    # Load audio model
    try:
        audio_model = pickle.load(open('models/audio_detection_model.pkl', 'rb'))
    except:
        # If model doesn't exist, create a placeholder
        print("Audio model not found. Creating new model.")
        audio_model = create_audio_model()
    
    # Create scaler for audio features
    try:
        scaler = pickle.load(open('models/audio_scaler.pkl', 'rb'))
    except:
        print("Audio scaler not found. Creating new scaler.")
        scaler = StandardScaler()
        
    return spiral_model, audio_model, scaler

# Create placeholder models (replace with your actual pre-trained models)
def create_spiral_model():
    # Simple CNN for spiral image analysis
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
        tf.keras.layers.MaxPooling2D(2, 2),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2, 2),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

def create_audio_model():
    # Placeholder for audio model - replace with your actual model
    from sklearn.ensemble import RandomForestClassifier
    return RandomForestClassifier(n_estimators=100, random_state=42)

# Load the models
spiral_model, audio_model, audio_scaler = load_models()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Feature extraction for audio
def extract_audio_features(file_path):
    """Extract features from audio file for Parkinson's detection"""
    # Load audio file
    y, sr = librosa.load(file_path, sr=None)
    
    # Extract features relevant to Parkinson's detection
    # Acoustic features that might indicate Parkinson's:
    # - Jitter (variation in fundamental frequency)
    # - Shimmer (variation in amplitude)
    # - Noise-to-Harmonic ratio
    # - MFCC (Mel-frequency cepstral coefficients)
    
    # Basic features
    features = {}
    
    # Duration
    features['duration'] = librosa.get_duration(y=y, sr=sr)
    
    # Pitch (fundamental frequency) statistics
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    features['pitch_mean'] = np.mean(pitches[pitches > 0]) if np.any(pitches > 0) else 0
    features['pitch_std'] = np.std(pitches[pitches > 0]) if np.any(pitches > 0) else 0
    
    # Harmonicity
    harmony = librosa.effects.harmonic(y)
    features['harmonic_ratio'] = np.mean(harmony) / np.mean(y) if np.mean(y) != 0 else 0
    
    # MFCCs (vocal tract characteristics)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    for i, mfcc in enumerate(mfccs):
        features[f'mfcc_{i+1}_mean'] = np.mean(mfcc)
        features[f'mfcc_{i+1}_std'] = np.std(mfcc)
    
    # Zero crossing rate (voice tremor)
    zcr = librosa.feature.zero_crossing_rate(y)
    features['zcr_mean'] = np.mean(zcr)
    features['zcr_std'] = np.std(zcr)
    
    # Convert dictionary to feature vector
    feature_vector = np.array(list(features.values())).reshape(1, -1)
    
    return feature_vector

# Preprocess image for spiral analysis
def preprocess_image(file_path):
    """Preprocess spiral drawing image for Parkinson's detection"""
    # Load image
    img = cv2.imread(file_path)
    
    # Resize image to expected input size
    img = cv2.resize(img, (128, 128))
    
    # Normalize pixel values
    img = img / 255.0
    
    # Add batch dimension
    img = np.expand_dims(img, axis=0)
    
    return img

@app.route('/', methods=['GET'])
def some():
    return "Running"

# Detection endpoints
@app.route('/detect/audio', methods=['POST'])
def detect_from_audio():
    """Detect Parkinson's from audio recording"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    print("We are here")
    if file and allowed_file(file.filename):
        # Save the uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Extract features
            features = extract_audio_features(file_path)
            print(features)
            # Scale features
            scaled_features = audio_scaler.transform(features)
            print("sca", scaled_features)
            # Make prediction
            prediction = audio_model.predict_proba(scaled_features)[0][1]
            print(prediction)
            # Clean up file
            os.remove(file_path)
            
            return jsonify({
                'prediction': float(prediction),
                'parkinsons_probability': float(prediction),
                'threshold': 0.5,
                'has_parkinsons': bool(prediction > 0.5),
                'message': "Analysis complete: Voice patterns analyzed for potential Parkinson's indicators."
            })
            
        except Exception as e:
            # Clean up file if it exists
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/detect/spiral', methods=['POST'])
def detect_from_spiral():
    """Detect Parkinson's from spiral drawing"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    print("file", file)
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Save the uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Preprocess image
            img = preprocess_image(file_path)
            
            # Make prediction
            prediction = spiral_model.predict(img)[0][0]
            print(prediction)
            # Clean up file
            os.remove(file_path)
            
            return jsonify({
                'prediction': float(prediction),
                'parkinsons_probability': float(prediction),
                'threshold': 0.5,
                'has_parkinsons': bool(prediction > 0.5),
                'message': "Analysis complete: Spiral drawing analyzed for potential Parkinson's indicators."
            })
            
        except Exception as e:
            # Clean up file if it exists
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/detect', methods=['POST'])
def detect_auto():
    """Auto-detect file type and route to correct detection endpoint"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Determine file type
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        
        if file_extension in ['wav', 'mp3']:
            # Audio file - forward to audio endpoint
            return detect_from_audio()
        elif file_extension in ['png', 'jpg', 'jpeg']:
            # Image file - forward to spiral endpoint
            return detect_from_spiral()
        else:
            return jsonify({'error': 'Unsupported file type'}), 400
    
    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Parkinson\'s detection service is running'})

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # For development
    app.run(debug=True, host='0.0.0.0', port=8000)
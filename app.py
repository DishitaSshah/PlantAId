from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import numpy as np
from PIL import Image
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load both models
model_filter = tf.keras.models.load_model("trained_model3.keras")  # Classify leaf validity
model_disease = tf.keras.models.load_model("trained_model2.keras")  # Predict tomato diseases

# Define class labels (ONLY for disease model)
DISEASE_CLASSES = [
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy',
    'Not__Tomata__leaf',
    'Invaild_input'
]

# Treatment messages (ONLY used if valid tomato leaf)
TREATMENTS = {
    'Tomato___Bacterial_spot': 'Remove infected leaves, apply copper-based bactericides, and ensure good air circulation.',
    'Tomato___Early_blight': 'Apply fungicides like chlorothalonil or mancozeb, and rotate crops.',
    'Tomato___Late_blight': 'Use fungicides containing copper or chlorothalonil, and remove infected plants.',
    'Tomato___Leaf_Mold': 'Improve ventilation, avoid overhead watering, and apply fungicides if needed.',
    'Tomato___Septoria_leaf_spot': 'Remove affected leaves, use fungicides with chlorothalonil or mancozeb, and mulch soil.',
    'Tomato___Spider_mites Two-spotted_spider_mite': 'Spray neem oil or insecticidal soap, and introduce natural predators like ladybugs.',
    'Tomato___Target_Spot': 'Apply fungicides like azoxystrobin or difenoconazole, and maintain proper plant spacing.',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'Control whiteflies with neem oil or insecticides, and plant resistant varieties.',
    'Tomato___Tomato_mosaic_virus': 'Remove infected plants, disinfect tools, and avoid handling plants when wet.',
    'Tomato___healthy': 'No treatment needed, continue regular plant care and monitoring.',
    'Not__Tomata__leaf': 'No treatment needed, this is not a tomato leaf.',
    'Invaild_input': 'Invalid input, please try again.'
}

# Check if file is valid image
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Preprocess image to feed into model
def preprocess_image(image_path: str) -> np.ndarray:
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(128, 128))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.array([img_array])  # Shape (1, 128, 128, 3)
    return img_array  # No normalization

# Route for image analysis
@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            processed_image = preprocess_image(filepath)

            # Stage 1: Use filter model to determine if tomato leaf
            filter_pred = model_filter.predict(processed_image)
            filter_class = int(np.argmax(filter_pred[0]))
            if filter_class == 0:
                disease = 'Not a tomato leaf'
                os.remove(filepath)
                return jsonify({'disease': disease}), 200

            elif filter_class == 1:
                disease = 'Invalid input'
                os.remove(filepath)
                return jsonify({'disease': disease}), 200   
            elif filter_class == 2:
                # Stage 2: Predict disease
                disease_pred = model_disease.predict(processed_image)
                disease_index = int(np.argmax(disease_pred[0]))

                disease = DISEASE_CLASSES[disease_index]
                treatment = TREATMENTS[disease]

                os.remove(filepath)
                return jsonify({
                    'disease': disease,
                    'treatment': treatment
                })

            else:
                os.remove(filepath)
                return jsonify({'error': 'Unknown classification'}), 200

        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid file type'}), 400

# Run the app
if __name__ == '__main__':
    app.run(debug=True)

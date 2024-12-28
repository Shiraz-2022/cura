from flask import Flask, request, jsonify
import google.generativeai as genai
import torch
from PIL import Image
import json
import re
import os
from dotenv import load_dotenv
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib
from tensorflow import keras
import logging
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
CORS(app, resources={r"/api/*": {"origins": "*"}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        try:
            self.api_key = os.getenv('GEMINI_API_KEY')
            if not self.api_key:
                raise ValueError("GEMINI_API_KEY not found")
            
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-pro")
            
            self.device = 'cpu'
            
            # Update paths for Cloudflare Workers
            base_path = os.path.dirname(os.path.abspath(__file__))
            self.models_path = os.path.join(base_path, 'models')
            
            self._load_models()
            
        except Exception as e:
            logger.error(f"Init Error: {str(e)}")
            raise

    def _load_models(self):
        try:
            # Load food model
            food_model_path = os.path.join(self.models_path, 'food_model')
            self.food_model = torch.jit.load(
                os.path.join(food_model_path, 'model_training_1.pt'),
                map_location=self.device
            )
            self.food_model.eval()
            
            self.transform = torch.load(
                os.path.join(food_model_path, 'transform_training_1.pt'),
                map_location=self.device
            )
            
            # Load fatigue model
            fatigue_model_path = os.path.join(self.models_path, 'fatigue_pred_model')
            self.label_encoder = joblib.load(
                os.path.join(fatigue_model_path, 'label_encoder.pkl')
            )
            self.scaler = joblib.load(
                os.path.join(fatigue_model_path, 'scaler.pkl')
            )
            self.fatigue_model = keras.models.load_model(
                os.path.join(fatigue_model_path, 'fatigue_predictor_model.keras')
            )
            
            self.classes = {
                0: 'burger', 1: 'butter_naan', 2: 'chai', 3: 'chapati', 
                4: 'chole_bhature', 5: 'dal_makhani', 6: 'dhokla', 
                7: 'fried_rice', 8: 'idli', 9: 'jalebi', 10: 'kaathi_rolls', 
                11: 'kadai_paneer', 12: 'kulfi', 13: 'masala_dosa', 
                14: 'momos', 15: 'paani_puri', 16: 'pakode', 
                17: 'pav_bhaji', 18: 'pizza', 19: 'samosa'
            }
            
        except Exception as e:
            logger.error(f"Model Loading Error: {str(e)}")
            raise

    def predict_food(self, image_path):
        try:
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")
                
            image = Image.open(image_path).convert("RGB")
            image = image.convert("L")
            image = image.resize((224, 224))
            
            input_tensor = self.transform(image)
            input_tensor = input_tensor.unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                output = self.food_model(input_tensor)
                probabilities = torch.nn.functional.softmax(output, dim=1)
                top_prob, top_class = probabilities.topk(1, dim=1)

            predicted_class = top_class.squeeze(0).cpu().numpy()[0]
            return self.classes[predicted_class]
            
        except Exception as e:
            logger.error(f"Error predicting food: {str(e)}")
            raise

    def generate_questions(self, food_label):
        try:
            if not food_label:
                raise ValueError("Food label is required")
                
            prompt = f"""You are creating a nutritional information survey for food {food_label}. 
                Based on the provided food label, write 3 clear and concise questions. 
                The questions should be easy for an average person to understand and answer. They should address the following aspects:
                1. The typical number of servings per portion of the food.
                2. Whether any common add-ons (e.g., sauces, toppings, sides) are typically served with the dish, and what those are.
                3. The primary cooking method used for the dish.
                Keep the language simple and avoid technical jargon. 
                Start with a short compliment about the dish (Only the dish). Then in the next line ask the questions. 
                Direct speech in the past tense. 
                Assume that the person prepared it at home."""
                
            response = self.model.generate_content(prompt)
            questions = [q.strip() for q in response.text.strip().split("\n") if q.strip()]
            return questions
            
        except Exception as e:
            logger.error(f"Error generating questions: {str(e)}")
            raise

    def get_nutrition_data(self, food_label, answers):
        try:
            if not food_label or not answers:
                raise ValueError("Food label and answers are required")
                
            nutrition_prompt = f"""
            Based on the food item "{food_label}" and the user-provided details {answers}, 
            provide estimated ranges for:
            - Calories (kcal)
            - Protein (g)
            - Fat (g)
            - Carbohydrates (g)
            - Fiber (g)
            
            Format as JSON: {{"calories": "range", "protein": "range", "fat": "range", "carbs": "range", "fiber": "range"}}
            """
            
            response = self.model.generate_content(nutrition_prompt)
            return self._parse_response(response.text)
            
        except Exception as e:
            logger.error(f"Error generating nutrition data: {str(e)}")
            raise

    def _parse_response(self, response_text):
        try:
            match = re.search(r'(\{.*\})', response_text, re.DOTALL)
            if not match:
                raise ValueError("No valid JSON found in response")
            return json.loads(match.group(1))
        except Exception as e:
            logger.error(f"Error parsing response: {str(e)}")
            raise

service = MLService()

@app.route('/')
def home():
    return jsonify({
        "status": "healthy",
        "message": "ML Service is running",
        "version": "1.0.0"
    })

@app.route('/api/predict', methods=['POST'])
def predict_food():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        image_file = request.files['image']
        if not image_file.filename:
            return jsonify({"error": "Empty file provided"}), 400
            
        temp_path = os.path.join('/tmp', image_file.filename)
        image_file.save(temp_path)
        
        food_label = service.predict_food(temp_path)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            "success": True,
            "data": {"foodLabel": food_label}
        })
        
    except Exception as e:
        logger.error(f"Error in predict_food endpoint: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/questions', methods=['POST'])
def get_questions():
    try:
        data = request.get_json()
        if not data or 'foodLabel' not in data:
            return jsonify({"error": "foodLabel is required"}), 400
        
        questions = service.generate_questions(data['foodLabel'])
        return jsonify({"success": True, "data": questions})
        
    except Exception as e:
        logger.error(f"Error in questions endpoint: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

def handle_request(request):
    return app(request)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
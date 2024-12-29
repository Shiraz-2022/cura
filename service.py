# app.py
from flask import Flask, request, jsonify
import torch
from PIL import Image

app = Flask(__name__)

def predict_label(image_path, model_path='models/food_model/model_training_1.pt', transform_path='models/food_model/transform_training_1.pt', 
                  classes=None, target_size=(224, 224), device='cpu', top_k=1):

    model = torch.jit.load(model_path)
    model.eval()
    model = model.to(device)
    
    transform = torch.load(transform_path)
    
    image = Image.open(image_path).convert("RGB")
    image = image.convert("L")  
    image = image.resize(target_size)
    
    input_tensor = transform(image)
    input_tensor = input_tensor.unsqueeze(0)
    input_tensor = input_tensor.to(device)
    
    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output, dim=1)
        top_probs, top_classes = probabilities.topk(top_k, dim=1)

    top_probs = top_probs.squeeze(0).cpu().numpy()
    top_classes = top_classes.squeeze(0).cpu().numpy()
    
    label = top_classes[0]
    return classes[label]

device = 'cuda' if torch.cuda.is_available() else 'cpu'
classes = {0: 'burger', 1: 'butter_naan', 2: 'chai', 3: 'chapati', 4: 'chole_bhature',
           5: 'dal_makhani', 6: 'dhokla', 7: 'fried_rice', 8: 'idli', 9: 'jalebi',
           10: 'kaathi_rolls', 11: 'kadai_paneer', 12: 'kulfi', 13: 'masala_dosa',
           14: 'momos', 15: 'paani_puri', 16: 'pakode', 17: 'pav_bhaji',
           18: 'pizza', 19: 'samosa'}

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    image_path = f"./uploads/{file.filename}"
    file.save(image_path)
    label = predict_label(image_path, classes=classes, device=device)
    return jsonify({'label': label})

if __name__ == '__main__':
    app.run(debug=True)
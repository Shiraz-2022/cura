import torch
from PIL import Image
import cv2

def predict_label(image_path, model_path='models/food_model/model_training_1.pt', transform_path='models/food_model/transform_training_1.pt', 
                  classes=None, target_size=(224, 224), device='cpu', top_k=1):

    model = torch.jit.load(model_path)
    model.eval()
    model = model.to(device)
    
    transform = torch.load(transform_path)
    
    image = Image.open(image_path).convert("RGB")
    image = image.convert("L")  
    
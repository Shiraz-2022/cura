import numpy as np
import pandas as pd
import joblib
from tensorflow import keras

def predict_fatigue_class(new_data):
    label_encoder = joblib.load('D:/cura/models/fatigue_pred_model/label_encoder.pkl')
    scaler = joblib.load('D:/cura/models/fatigue_pred_model/scaler.pkl')
    model = keras.models.load_model('D:/cura/models/fatigue_pred_model/fatigue_predictor_model.keras')

    # Preprocess the new unseen data
    numerical_features = new_data.select_dtypes(include=['float64', 'int64'])
    new_data[numerical_features.columns] = scaler.transform(numerical_features)  # Apply the saved scaler

    # Map 'Gender' column to 0 and 1 (same as during training)
    new_data['Gender'] = new_data['Gender'].map({'Female': 0, 'Male': 1})

    # Handle missing values (drop or impute as necessary)
    new_data = new_data.dropna()  # Or use imputation if preferred

    # Predict the fatigue class using the model
    y_pred_probs_new = model.predict(new_data)  # Get prediction probabilities

    # Convert the predicted probabilities to class labels
    y_pred_classes_new = y_pred_probs_new.argmax(axis=1)  # Choose the class with the highest probability

    # Convert the predicted class labels back to the original labels using the LabelEncoder
    predicted_classes = label_encoder.inverse_transform(y_pred_classes_new)

    return predicted_classes[0]

# Example usage
if __name__ == "__main__":
    # Hardcoded synthetic input (new unseen data) for fatigue class prediction
    age = 32  # Age of the person (in years)
    gender = 'Female'  # Gender of the person
    light_sleep = 3.2  # Light Sleep (hrs)
    deep_sleep = 0.5  # Deep Sleep (hrs)
    rem_sleep = 1.8  # REM Sleep (hrs)
    sleep_quality = 75  # Sleep Quality (out of 100)
    spo2 = 90  # SpO2 (oxygen saturation percentage)
    steps = 8000  # Steps
    active_calories = 450  # Active Calories (kcal)
    light_activity_time = 2  # Light Activity Time (hrs)
    moderate_activity_time = 1  # Moderate Activity Time (hrs)
    vigorous_activity_time = 1  # Vigorous Activity Time (hrs)
    caloric_intake = 2000  # Caloric Intake (kcal)
    carbs = 280  # Carbs (g)
    protein = 80  # Protein (g)
    fats = 60  # Fats (g)

    # Creating a DataFrame with the synthetic input
    input_data = pd.DataFrame({
        'Age': [age],
        'Gender': [gender],
        'Light Sleep (hrs)': [light_sleep],
        'Deep Sleep (hrs)': [deep_sleep],
        'REM Sleep (hrs)': [rem_sleep],
        'Sleep Quality': [sleep_quality],
        'SpO2 (%)': [spo2],
        'Steps': [steps],
        'Active Calories (kcal)': [active_calories],
        'Light Activity Time (hrs)': [light_activity_time],
        'Moderate Activity Time (hrs)': [moderate_activity_time],
        'Vigorous Activity Time (hrs)': [vigorous_activity_time],
        'Caloric Intake (kcal)': [caloric_intake],
        'Carbs (g)': [carbs],
        'Protein (g)': [protein],
        'Fats (g)': [fats],
    })

    # Predict fatigue class
    predicted_class = predict_fatigue_class(input_data)
    print("\nPredicted Fatigue Class:", predicted_class)

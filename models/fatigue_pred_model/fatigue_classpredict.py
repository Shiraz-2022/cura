import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model

def predict_fatigue_class(age, gender, light_sleep, deep_sleep, rem_sleep, sleep_quality, 
                          spo2, steps, active_calories, light_activity_time, moderate_activity_time, 
                          vigorous_activity_time, caloric_intake, carbs, protein, fats):
    """
    Predict the fatigue class based on input values.
    
    Parameters:
    - age: Age of the person (in years)
    - gender: Gender of the person ('Female' or 'Male')
    - light_sleep: Light sleep in hours (0.5 to 5)
    - deep_sleep: Deep sleep in hours (0.5 to 3)
    - rem_sleep: REM sleep in hours (0.5 to 2.5)
    - sleep_quality: Sleep quality score (50 to 100)
    - spo2: SpO2 (oxygen saturation percentage) (92 to 99)
    - steps: Number of steps (2000 to 25000)
    - active_calories: Active calories (kcal) (300 to 1500)
    - light_activity_time: Light activity time in hours
    - moderate_activity_time: Moderate activity time in hours
    - vigorous_activity_time: Vigorous activity time in hours
    - caloric_intake: Caloric intake (kcal) (1500 to 4000)
    - carbs: Carbs intake in grams (150 to 600)
    - protein: Protein intake in grams (50 to 300)
    - fats: Fat intake in grams (40 to 150)
    
    Returns:
    - Predicted fatigue class
    """

    # Creating a DataFrame with the input data
    new_data = pd.DataFrame({
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

    # Load the saved transformers and model
    label_encoder = joblib.load('C:\\Users\\LENOVO\\OneDrive\\Desktop\\New folder\\models\\fatigue_pred_model\\label_encoder.pkl')  # Load LabelEncoder for 'Fatigue Class'
    scaler = joblib.load('C:\\Users\\LENOVO\\OneDrive\\Desktop\\New folder\\models\\fatigue_pred_model\\scaler.pkl')  # Load StandardScaler for numerical features
    model = load_model('C:\\Users\\LENOVO\\OneDrive\\Desktop\\New folder\\models\\fatigue_pred_model\\fatigue_predictor_model.keras')  # Load the trained model

    # Step 1: Preprocess the new unseen data
    # Normalize numerical features using the saved scaler
    numerical_features = new_data.select_dtypes(include=['float64', 'int64'])
    new_data[numerical_features.columns] = scaler.transform(numerical_features)  # Apply the saved scaler

    # Map 'Gender' column to 0 and 1 (same as during training)
    new_data['Gender'] = new_data['Gender'].map({'Female': 0, 'Male': 1})

    # Handle missing values (drop or impute as necessary)
    new_data = new_data.dropna()  # Or use imputation if preferred

    # Step 2: Predict the fatigue class using the model
    y_pred_probs_new = model.predict(new_data)  # Get prediction probabilities

    # Convert the predicted probabilities to class labels
    y_pred_classes_new = y_pred_probs_new.argmax(axis=1)  # Choose the class with the highest probability

    # Step 3: Convert the predicted class labels back to the original labels using the LabelEncoder
    predicted_classes = label_encoder.inverse_transform(y_pred_classes_new)

    return predicted_classes[0]  # Return the predicted fatigue class

# Example usage:
predicted_fatigue_class = predict_fatigue_class(
    age=32,
    gender='Female',
    light_sleep=3.2,
    deep_sleep=1.5,
    rem_sleep=1.8,
    sleep_quality=75,
    spo2=95,
    steps=8000,
    active_calories=450,
    light_activity_time=2,
    moderate_activity_time=1,
    vigorous_activity_time=0.5,
    caloric_intake=2500,
    carbs=300,
    protein=100,
    fats=80
)

print("Predicted Fatigue Class:", predicted_fatigue_class)

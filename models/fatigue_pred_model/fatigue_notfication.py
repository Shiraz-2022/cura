import google.generativeai as genai

genai.configure(api_key="????????????????????????????????????")
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_advice(age, gender, diseases, fatigue_class):
    prompt = f"""You are to give advice to a person ({gender}) aged {age} based on the fact that he/she is being classified for the day by a model as to have either
    1. High Chance 2. Moderate Chance 3. Low Chance 4. No Chance
    of fatigue the following day. Given that the person is suffering from {diseases} you need to give advice that may help in reducing fatigue. In case of no fatigue,
     help out in suggesting to make the best of it. The person has a {fatigue_class} of experiencing fatigue. Summarize in 2 friendly sentnces. Don't make the fact that
    the person has the diseases mentioned. Put it in a subtle manner and dont mention the prediction, just say in a way such that it appears that you know the person
    very well. Remember no chance may not mean completely zero chance. Try taking the age and gender in to account if relevant without specifying it."""
    response = model.generate_content(prompt)
    return response.text

# generate_advice(23, 'Male', ['Diabetes', 'Arthritis'], 'No Fatigue')
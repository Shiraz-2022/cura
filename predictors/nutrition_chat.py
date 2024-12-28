# %%
import google.generativeai as genai
import json
import re

genai.configure(api_key="AIzaSyDWP2h3LQ2fVe0ybF8HIgpKsAx7smaRe8Q")
model = genai.GenerativeModel("gemini-1.5-flash")

# %%
def generate_questions(food_label):
    prompt = f"""You are creating a nutritional information survey for food {food_label}. 
        Based on the provided food label, write 3 clear and concise questions. 
        The questions should be easy for an average person to understand and answer. They should address the following aspects:
        The typical number of servings per portion of the food.
        Whether any common add-ons (e.g., sauces, toppings, sides) are typically served with the dish, and what those are.
        The primary cooking method used for the dish.
        These questions should help assess the nutritional composition of a serving based on the food label and typical serving practices. 
        Keep the language simple and avoid technical jargon. 
        Start off with a short complement about the dish (Only the dish). Then in the next line ask the questions. 
        Direct speech in the past tense. 
        Assume that the person prepared in his home. While asking , ask in presepctive of eating not serving"""    
    response = model.generate_content(prompt)
    questions = response.text.strip().split("\n")
    
    return [q for q in questions if q != '']

def generate_output(model, food_label, answers):
    nutrition_prompt = f"""
    Based on the food item "{food_label}" and the user-provided details {answers}, 
    provide estimated ranges (in grams) for the calorie intake ,protein, fat, carbohydrate, and fiber content.  
    Present your answer as separate ranges for each nutrient (e.g., Protein: 10-20g). Provide only the ranges in the form of a dictionary(JSON format).
    """
    nutrition_response = model.generate_content(nutrition_prompt)
    return nutrition_response.text

def get_responses(questions):
    answers = []
    for q in questions:
        print(q)
        ans = input()
        answers.append(ans)
        print('\n')
    return answers

def get_chart(food_label):
    food_label = "Chapati"
    questions = generate_questions(food_label)
    answers = get_responses(questions[1:])

    n_chart = generate_output(model, food_label, answers)

    match = re.search(r'(\{.*\})', n_chart, re.DOTALL)

    if match:
        res = match.group(1)
        data = json.loads(res)
        return data
    else:
        print("No match found")
        return {}




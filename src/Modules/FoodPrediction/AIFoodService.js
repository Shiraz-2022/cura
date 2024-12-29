const { spawn } = require('child_process');
const path = require('path');

class AIFoodService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.pythonScriptPath = path.join(__dirname, '../../../../ML/predictors/nutrition_chat.py');
    }

    async getQuestions(foodLabel) {
        return this._executePythonScript("get_questions", foodLabel);
    }

    async predictNutrition(foodLabel, userAnswers) {
        return this._executePythonScript("predict", foodLabel, userAnswers);
    }

    async getChatResponse(foodLabel, message) {
        return this._executePythonScript("chat", foodLabel, message);
    }

    _executePythonScript(action, foodLabel, additionalData = null) {
        return new Promise((resolve, reject) => {
            const args = [
                this.pythonScriptPath,
                this.apiKey,
                action,
                foodLabel
            ];

            if (additionalData) {
                args.push(JSON.stringify(additionalData));
            }

            const pythonProcess = spawn('python', args);
            let result = '';

            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Error: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Process exited with code ${code}`));
                    return;
                }
                try {
                    const parsedResult = JSON.parse(result);
                    resolve(parsedResult);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}

module.exports = AIFoodService;
const { spawn } = require('child_process');
const path = require('path');

class NutritionService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.pythonScriptPath = path.join(__dirname, '../../../../ML/predictors/nutrition_chat.py');
    }

    async getQuestions(foodLabel) {
        return this._executePythonScript("get_questions", foodLabel, []);
    }

    async predictNutrition(foodLabel, userAnswers) {
        return this._executePythonScript("predict", foodLabel, userAnswers);
    }

    _executePythonScript(action, foodLabel, userAnswers) {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [
                this.pythonScriptPath,
                this.apiKey,
                foodLabel,
                JSON.stringify(userAnswers)
            ]);

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

module.exports = NutritionService;
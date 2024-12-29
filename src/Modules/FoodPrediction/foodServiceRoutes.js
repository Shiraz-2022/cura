const express = require('express');
const router = express.Router();
const AIFoodService = require('../Modules/FoodPrediction/AIFoodService');

const aiFoodService = new AIFoodService(process.env.GEMINI_API_KEY);

router.post('/questions', async (req, res) => {
    try {
        const { foodLabel } = req.body;
        const result = await aiFoodService.getQuestions(foodLabel);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/predict', async (req, res) => {
    try {
        const { foodLabel, answers } = req.body;
        const result = await aiFoodService.predictNutrition(foodLabel, answers);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/chat', async (req, res) => {
    try {
        const { foodLabel, message } = req.body;
        const result = await aiFoodService.getChatResponse(foodLabel, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
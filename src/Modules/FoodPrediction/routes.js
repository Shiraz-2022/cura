const express = require('express');
const router = express.Router();
const NutritionService = require('./NutritionService');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const nutritionService = new NutritionService(process.env.GEMINI_API_KEY);

router.post('/predict', upload.single('image'), async (req, res) => {
    try {
        const result = await nutritionService.predictFood(req.file);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/questions', async (req, res) => {
    try {
        const { foodLabel } = req.body;
        const result = await nutritionService.generateQuestions(foodLabel);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/nutrition', async (req, res) => {
    try {
        const { foodLabel, answers } = req.body;
        const result = await nutritionService.getNutritionData(foodLabel, answers);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/predict-fatigue', async (req, res) => {
    try {
        const data = req.body;
        const result = await nutritionService.predictFatigue(data);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const ML_SERVER_URL = 'https://fuzzy-lemons-design.loca.lt';

router.post('/image', upload.single('image'), async (req, res) => {
    try {
        console.log('Received image upload request')
        const formData = new FormData()
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype })
        formData.append('image', blob, req.file.originalname)
        console.log('Image processed, sending to Flask server:', ML_SERVER_URL)
        
        const response = await axios.post(`${ML_SERVER_URL}/api/process-image`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log('Flask server response:', response.data)
        res.json(response.data)
    } catch (error) {
        console.error('Error in image processing:', error)
        res.status(500).json({ error: error.message })
    }
})

router.post('/predict', upload.single('image'), async (req, res) => {
    try {
        console.log('Received prediction request')
        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('image', blob, req.file.originalname);

        const predictionResponse = await axios.post(`${ML_SERVER_URL}/api/predict`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const foodLabel = predictionResponse.data.data.foodLabel;

        const questionsResponse = await axios.post(`${ML_SERVER_URL}/api/questions`, {
            foodLabel: foodLabel
        });

        console.log('Prediction result:', {
            success: true,
            foodLabel: foodLabel,
            questions: questionsResponse.data.data
        });

        res.json({
            success: true,
            foodLabel: foodLabel,
            questions: questionsResponse.data.data
        });

    } catch (error) {
        console.error('Error in prediction:', error)
        res.status(500).json({ error: error.message })
    }
});

router.post('/questions', async (req, res) => {
    try {
        console.log('Received questions request for food:', req.body.foodLabel)
        const { foodLabel } = req.body
        const result = await axios.post(`${ML_SERVER_URL}/api/questions`, {
            foodLabel: foodLabel
        });

        console.log('Generated questions:', result)
        res.json(result)
    } catch (error) {
        console.error('Error generating questions:', error)
        res.status(500).json({ error: error.message })
    }
});

router.post('/nutrition', async (req, res) => {
    try {
        console.log('Received nutrition request:', req.body)
        const { foodLabel, answers } = req.body
        const result = await axios.post(`${ML_SERVER_URL}/api/get-nutrition`, {
            foodLabel: foodLabel,
            answers: answers
        });

        console.log('Nutrition data:', result)
        res.json(result)
    } catch (error) {
        console.error('Error getting nutrition data:', error)
        res.status(500).json({ error: error.message })
    }
});

router.post('/predict-fatigue', async (req, res) => {
    try {
        console.log('Received fatigue prediction request:', req.body)
        const data = req.body
        const result = await axios.post(`${ML_SERVER_URL}/api/predict-fatigue`, data);

        console.log('Fatigue prediction result:', result)
        res.json(result)
    } catch (error) {
        console.error('Error predicting fatigue:', error)
        res.status(500).json({ error: error.message })
    }
});

module.exports = router;
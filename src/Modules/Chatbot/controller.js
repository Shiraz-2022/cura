const { generateContent } = require('./model');

const chatbotController = {
    handleChat: async (req, res) => {
        const userMessage = req.body.message;
        try {
            const response = await generateContent(userMessage);
            const tailoredResponse = response.candidates[0].content.parts[0].text;

            // Modify the response to be more tailored for chronic disease management
            const chronicDiseaseResponse = `As a health bot, I recommend you consider the following: ${tailoredResponse}`;
            res.json({ candidates: [{ content: { parts: [{ text: chronicDiseaseResponse }] } }] });
        } catch (error) {
            res.status(500).json({ error: 'Error generating response' });
        }
    }
};

module.exports = { chatbotController };

const axios = require('axios');

const generateContent = async (userMessage) => {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDGjIhvtHCPVLSi3SRBInnrg1A-0CVP1wo`, {
        contents: [{
            parts: [{ text: userMessage }]
        }]
    });
    return response.data;
};

module.exports = { generateContent };

const axios = require('axios');

const API_KEY = process.env.API_KEY || 'ar_89LUyHegAnrFlRQkNbcC_P4KqE_l23tHjNHiBATm';
const API_URL = 'https://api.arioron.com/api/v1/ai/generate';

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await axios.post(
            API_URL,
            {
                model: 'perceptix-vex-amber',
                prompt: `You are an AI language model named Vex. Respond to the user prompt in a concise and informative manner and will help mostly vibe coders and students. Here is the user prompt: """${prompt}"""`,
                safety_harassment: false,
                safety_sexual: false,
                safety_hate: false,
                safety_self_harm: false,
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json({ response: response.data.response });

    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            details: error.response?.data || error.message
        });
    }
};

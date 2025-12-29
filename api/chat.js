const axios = require('axios');

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.arioron.com/api/v1/ai/generate';

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Check if API key exists
    if (!API_KEY) {
        console.error('❌ API_KEY environment variable is not set');
        res.status(500).json({ 
            error: 'Server configuration error',
            details: 'API_KEY not configured in Vercel environment variables'
        });
        return;
    }

    console.log('✅ API_KEY found:', API_KEY.substring(0, 10) + '...');

    // Get prompt from request
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        res.status(400).json({ error: 'Valid prompt is required' });
        return;
    }

    console.log('📩 Received prompt:', prompt.substring(0, 50) + '...');

    try {
        console.log('🚀 Making request to Arioron API...');
        
        const apiResponse = await axios.post(
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
                },
                timeout: 30000
            }
        );

        console.log('✅ API Response status:', apiResponse.status);
        console.log('📦 API Response data:', JSON.stringify(apiResponse.data));

        // Arioron returns the response in the "response" field
        if (apiResponse.data && apiResponse.data.response) {
            console.log('✅ Sending response back to client');
            res.status(200).json({ response: apiResponse.data.response });
        } else {
            console.error('❌ Unexpected response format:', apiResponse.data);
            res.status(500).json({ 
                error: 'Unexpected response format',
                details: 'API returned data but not in expected format'
            });
        }

    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data));
            console.error('Response headers:', JSON.stringify(error.response.headers));
            
            res.status(error.response.status).json({ 
                error: 'Arioron API error',
                details: JSON.stringify(error.response.data)
            });
        } else if (error.request) {
            console.error('No response received');
            console.error('Request:', error.request);
            
            res.status(503).json({ 
                error: 'Cannot reach Arioron API',
                details: 'No response from API server'
            });
        } else {
            console.error('Setup error:', error.message);
            
            res.status(500).json({ 
                error: 'Internal error',
                details: error.message
            });
        }
    }
};

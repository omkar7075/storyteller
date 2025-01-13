const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// OpenAI configuration
const openAIConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAIConfig);

// Hugging Face API configuration
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models';
const huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;

// Route: Generate Story
app.post('/api/generate-story', async (req, res) => {
  const { audience, topic, length, model } = req.body;

  if (!audience || !topic || !length || !model) {
    return res.status(400).json({ error: 'All fields are required: audience, topic, length, model.' });
  }

  try {
    let story;
    if (model === 'openai') {
      // Generate story using OpenAI
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Create a ${length} story for ${audience} about ${topic}.`,
        max_tokens: 300,
      });
      story = response.data.choices[0].text.trim();
    } else if (model === 'huggingface') {
      // Generate story using Hugging Face
      const response = await axios.post(
        `${HUGGING_FACE_API_URL}/${model}`,
        { inputs: `Create a ${length} story for ${audience} about ${topic}.` },
        {
          headers: { Authorization: `Bearer ${huggingFaceApiKey}` },
        }
      );
      story = response.data[0]?.generated_text || 'No story generated.';
    }

    res.json({ story });
  } catch (error) {
    console.error('Error generating story:', error.message);
    res.status(500).json({ error: 'Failed to generate story. Please try again later.' });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('AI Storyteller API is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [audience, setAudience] = useState('');
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('');
  const [model, setModel] = useState('openai');
  const [story, setStory] = useState('');

  const generateStory = async () => {
    if (!audience || !topic || !length) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/generate-story', {
        audience,
        topic,
        length,
        model,
      });
      setStory(response.data.story);
    } catch (error) {
      console.error('Error generating story:', error.message);
      alert('Failed to generate story. Please try again later.');
    }
  };

  return (
    <div className="App">
      <h1>AI Storyteller</h1>
      <div className="form">
        <label>Audience:</label>
        <select value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option value="">Select Audience</option>
          <option value="children">Children</option>
          <option value="adults">Adults</option>
        </select>

        <label>Topic:</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter story topic"
        />

        <label>Length:</label>
        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="">Select Length</option>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>

        <label>Model:</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="openai">OpenAI</option>
          <option value="huggingface">Hugging Face</option>
        </select>

        <button onClick={generateStory}>Generate Story</button>
      </div>

      {story && (
        <div className="story">
          <h2>Your Story</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
};

export default App;

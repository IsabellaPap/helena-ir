import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import GenderSelection from './components/GenderSelection/GenderSelection';
import Questionnaire from './components/Questionnaire/Questionnaire';
import Results from './components/Results/Results';
import './App.css';

const App = () => {
  const [gender, setGender] = useState(null);
  const [result, setResult] = useState(null);


  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleSubmit = async (answers) => {
    try {
      // Send answers to the first API endpoint and get the score
      const scoreResponse = await fetch('http://localhost:8000/calculate/risk-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      const scoreData = await scoreResponse.json();
      const score = Number(scoreData.risk_score);

      // Send score to the second API endpoint and get the classification
      const classificationResponse = await fetch('http://localhost:8000/classify/risk-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "risk_score": score, "gender": gender }),
      });

      const classificationData = await classificationResponse.json();
      const classification = classificationData.classification;

      // Set the result state to display score and classification
      setResult({ score, classification });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/gender-selection" element={<GenderSelection onGenderSelect={handleGenderSelect} />} />
          <Route path="/questionnaire" element={<Questionnaire gender={gender} onSubmit={handleSubmit} />} />
          <Route path="/results" element={result ? <Results score={result.score} classification={result.classification} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import GenderSelection from './components/GenderSelection/GenderSelection';
import Questionnaire from './components/Questionnaire/Questionnaire';
import Results from './components/Results/Results';
import './App.css';
import Login from './components/Login';
import Registration from './components/Registration';
import { calculateRiskScore, classifyRiskScore } from './api';

const App = () => {
  const [gender, setGender] = useState(null);
  const [result, setResult] = useState(null);

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleSubmit = async (answers) => {
    try {
      const scoreData = await calculateRiskScore(answers);
      const score = scoreData.risk_score;

      const classificationData = await classifyRiskScore(score, gender);
      const classification = classificationData.classification;

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/gender-selection" element={<GenderSelection onGenderSelect={handleGenderSelect} />} />
          <Route path="/questionnaire" element={<Questionnaire gender={gender} onSubmit={handleSubmit} />} />
          <Route path="/results" element={result ? <Results score={result.score} classification={result.classification} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
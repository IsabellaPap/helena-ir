import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/gender-selection');
  };

  return (
    <div>
      <h1>Welcome to the Health Assessment</h1>
      <button onClick={handleStartClick}>Start Test</button>
    </div>
  );
};

export default HomePage;
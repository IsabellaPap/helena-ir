import React from 'react';
import { useNavigate } from 'react-router-dom';

const GenderSelection = ({ onGenderSelect }) => {
  const navigate = useNavigate();

  const handleGenderSelect = (gender) => {
    onGenderSelect(gender);
    navigate('/questionnaire');
  };

  return (
    <div>
      <button onClick={() => handleGenderSelect('male')}>Male</button>
      <button onClick={() => handleGenderSelect('female')}>Female</button>
    </div>
  );
};

export default GenderSelection;
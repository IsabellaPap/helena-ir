import React, { useState } from 'react';
import { validateInput } from './validationUtil';
import { fetchBmi } from '../api';

const BMICalculator = ({ onBMICalculated }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [validationErrors, setValidationErrors] = useState({ weight: '', height: '' });

  const handleInputChange = (value, type) => {
    const { isValid, errorMessage } = validateInput(value, type);

    if (type === 'weight') {
      setWeight(value);
    } else if (type === 'height') {
      setHeight(value);
    }

    setValidationErrors({ ...validationErrors, [type]: isValid ? '' : errorMessage });
  };

  const disableButton = () => {
    return Object.values(validationErrors).some(error => error !== '');
  };
  
  function calculateBMI() {

    // Convert weight and height to numbers, if they are not already
    const formattedWeight = Number(weight);
    const formattedHeight = Number(height);

    const bmiData = {
      weight_kg: formattedWeight,
      height_cm: formattedHeight
    };

    fetchBmi(bmiData)
      .then(data => {
        onBMICalculated(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }

  return (
    <div className={`flex-column calc-box`}>
      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => handleInputChange(e.target.value, 'weight')}
        onBlur={(e) => handleInputChange(e.target.value, 'weight')} 
      />
      {validationErrors.weight && <div className="error-message">{validationErrors.weight}</div>}

      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => handleInputChange(e.target.value, 'height')}
        onBlur={(e) => handleInputChange(e.target.value, 'height')} 
      />
      {validationErrors.height && <div className="error-message">{validationErrors.height}</div>}

      <button onClick={calculateBMI} disabled={disableButton()}>Calculate BMI</button>
    </div>
  );
};

export default BMICalculator;

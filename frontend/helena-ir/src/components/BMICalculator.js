import React, { useState } from 'react';
import { validateInput } from './validationUtil';

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

    // API call to calculate BMI
    fetch('http://localhost:8000/calculate/bmi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weight_kg: formattedWeight, height_cm: formattedHeight }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        onBMICalculated(data.bmi);
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

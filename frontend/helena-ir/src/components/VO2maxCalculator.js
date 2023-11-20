import React, { useState } from 'react';
import { validateInput } from './validationUtil';

const VO2maxCalculator = ({ onVO2maxCalculated }) => {

  const [speed, setSpeed] = useState('');
  const [age, setAge] = useState('');
  const [validationErrors, setValidationErrors] = useState({ speed: '', age: '' });

  const handleInputChange = (value, type) => {
    const { isValid, errorMessage } = validateInput(value, type);

    if (type === 'speed') {
      setSpeed(value);
    } else if (type === 'age') {
      setAge(value);
    }

    setValidationErrors({ ...validationErrors, [type]: isValid ? '' : errorMessage });
  };

  function calculateVO2max() {

    // Convert weight and height to numbers, if they are not already
    const formattedSpeed = Number(speed);
    const formattedAge = Number(age);

    // API call to calculate VO2 max
    fetch('http://localhost:8000/calculate/vo2max', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ speed_km_per_h: formattedSpeed, age_yr: formattedAge }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        onVO2maxCalculated(data.vo2max);
  
      })
      .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
      });
  }
  return (
    <div>
      <input
        type="number"
        placeholder="Speed (k/h)"
        value={speed}
        onChange={(e) => handleInputChange(e.target.value, 'speed')}
        onBlur={(e) => handleInputChange(e.target.value, 'speed')} // Optional: Validate on blur
      />
      {validationErrors.speed && <div className="error-message">{validationErrors.speed}</div>}

      <input
        type="number"
        placeholder="Age (years)"
        value={age}
        onChange={(e) => handleInputChange(e.target.value, 'age')}
        onBlur={(e) => handleInputChange(e.target.value, 'age')} // Optional: Validate on blur
      />
      {validationErrors.age && <div className="error-message">{validationErrors.age}</div>}

      <button onClick={calculateVO2max}>Calculate VO2 max</button>
    </div>
  );
};

export default VO2maxCalculator;

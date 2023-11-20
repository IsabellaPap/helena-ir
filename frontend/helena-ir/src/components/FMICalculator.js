import React, { useState } from 'react';
import { validateInput } from './validationUtil';

const FMICalculator = ({ onFMICalculated }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bodyfat, setBodyfat] = useState('');
  const [fatMass, setFatMass] = useState('');
  const [formattedFatMass, setFormattedFatMass] = useState('');
  const [validationErrors, setValidationErrors] = useState({ weight: '', height: '', bodyfat: '', fatmass: '' });


  const handleInputChange = (value, type) => {
    const { isValid, errorMessage } = validateInput(value, type);

    if (type === 'weight') {
      setWeight(value);
    } else if (type === 'height') {
      setHeight(value);
    } else if (type === 'bodyfat') {
      setBodyfat(value)
    } else if (type === 'fatmass') {
      setFatMass(value);
    }

    setValidationErrors({ ...validationErrors, [type]: isValid ? '' : errorMessage });
  };

  function calculateFMI() {

    // Convert weight and height to numbers, if they are not already
    const formattedWeight = Number(weight);
    const formattedHeight = Number(height);
    const formattedBodyfat = Number(bodyfat);
    if (fatMass > 0) {
      setFormattedFatMass(Number(fatMass));
    }

    // API call to calculate FMI
    fetch('http://localhost:8000/calculate/fmi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weight_kg: formattedWeight, height_cm: formattedHeight, body_fat_percentage: formattedBodyfat, fat_mass_kg: formattedFatMass }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        onFMICalculated(data.fmi);
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
        placeholder="Body Fat (%)"
        value={bodyfat}
        onChange={(e) => handleInputChange(e.target.value, 'bodyfat')}
        onBlur={(e) => handleInputChange(e.target.value, 'bodyfat')} // Optional: Validate on blur
      />
      {validationErrors.bodyfat && <div className="error-message">{validationErrors.bodyfat}</div>}
      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => handleInputChange(e.target.value, 'weight')}
        onBlur={(e) => handleInputChange(e.target.value, 'weight')} // Optional: Validate on blur
      />
      {validationErrors.weight && <div className="error-message">{validationErrors.weight}</div>}
      <input
        type="number"
        placeholder="Fat Mass (kg)"
        value={fatMass}
        onChange={(e) => handleInputChange(e.target.value, 'fatmass')}
        onBlur={(e) => handleInputChange(e.target.value, 'fatmass')} // Optional: Validate on blur
      />
      {validationErrors.fatmass && <div className="error-message">{validationErrors.fatmass}</div>}
      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => handleInputChange(e.target.value, 'height')}
        onBlur={(e) => handleInputChange(e.target.value, 'height')} // Optional: Validate on blur
      />
      {validationErrors.height && <div className="error-message">{validationErrors.height}</div>}

      <button onClick={calculateFMI}>Calculate FMI</button>
    </div>
  );
};

export default FMICalculator;

import React, { useState } from 'react';
import { validateInput } from './validationUtil';
import { fetchFmi } from '../api';

const FMICalculator = ({ onFMICalculated }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bodyfat, setBodyfat] = useState('');
  const [fatMass, setFatMass] = useState('');
  const [validationErrors, setValidationErrors] = useState({ weight: '', height: '', bodyfat: '', fatmass: '' });


  const handleInputChange = (value, type, allowZero = false) => {
    const { isValid, errorMessage } = validateInput(value, type, allowZero);

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

  const disableButton = () => {
    const errorsPresent = Object.values(validationErrors).some(error => error !== '');

    const missingInput = !fatMass && (!weight || !bodyfat);
    const isZero = (fatMass === 0 && weight === 0 && bodyfat === 0);
    return errorsPresent || missingInput || isZero;
  };

  function calculateFMI() {

    // Convert weight and height to numbers, if they are not already
    const formattedWeight = Number(weight);
    const formattedHeight = Number(height);
    const formattedBodyfat = Number(bodyfat);
    const formattedFatMass = Number(fatMass);

    const requestBody = {
      weight_kg: formattedWeight,
      height_cm: formattedHeight,
      body_fat_percentage: formattedBodyfat,
    };

    if (formattedFatMass > 0) {
      requestBody.fat_mass_kg = formattedFatMass;
    }

    // API call to calculate FMI
    fetchFmi(requestBody)
    .then(data => {
      onFMICalculated(data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    });
  }

  return (
    <div className={`flex-column calc-box`}>
      <input className={`calcInput`}
        type="number"
        placeholder="Body Fat (%)"
        value={bodyfat}
        onChange={(e) => handleInputChange(e.target.value, 'bodyfat', true)}
        onBlur={(e) => handleInputChange(e.target.value, 'bodyfat', true)} 
      />
      {validationErrors.bodyfat && <div className="error-message">{validationErrors.bodyfat}</div>}
      <input className={`calcInput`}
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => handleInputChange(e.target.value, 'weight', true)}
        onBlur={(e) => handleInputChange(e.target.value, 'weight', true)} 
      />
      {validationErrors.weight && <div className="error-message">{validationErrors.weight}</div>}
      <input className={`calcInput`}
        type="number"
        placeholder="Fat Mass (kg)"
        value={fatMass}
        onChange={(e) => handleInputChange(e.target.value, 'fatmass', true)}
        onBlur={(e) => handleInputChange(e.target.value, 'fatmass', true)}
      />
      {validationErrors.fatmass && <div className="error-message">{validationErrors.fatmass}</div>}
      <input className={`calcInput`}
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => handleInputChange(e.target.value, 'height', true)}
        onBlur={(e) => handleInputChange(e.target.value, 'height')}
      />
      {validationErrors.height && <div className="error-message">{validationErrors.height}</div>}

      <button onClick={calculateFMI} disabled={disableButton()}>Calculate FMI</button>
    </div>
  );
};

export default FMICalculator;

import { useState } from 'react';
import { validateInput } from './validationUtil';
import { fetchVo2max } from '../api';

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

  const disableButton = () => {
    return Object.values(validationErrors).some(error => error !== '');
  };

  function calculateVO2max() {
    const formattedSpeed = Number(speed);
    const formattedAge = Number(age);

    const vo2maxData = {
      speed_km_per_h: formattedSpeed,
      age_yr: formattedAge
    };

    fetchVo2max(vo2maxData)
      .then(response => {
        onVO2maxCalculated(response);
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
        placeholder="Speed (k/h)"
        value={speed}
        onChange={(e) => handleInputChange(e.target.value, 'speed')}
        onBlur={(e) => handleInputChange(e.target.value, 'speed')} // Optional: Validate on blur
      />
      {validationErrors.speed && <div className="error-message">{validationErrors.speed}</div>}

      <input className={`calcInput`}
        type="number"
        placeholder="Age (years)"
        value={age}
        onChange={(e) => handleInputChange(e.target.value, 'age')}
        onBlur={(e) => handleInputChange(e.target.value, 'age')} // Optional: Validate on blur
      />
      {validationErrors.age && <div className="error-message">{validationErrors.age}</div>}

      <button className={`calcButton`} onClick={calculateVO2max} disabled={disableButton()}>Calculate</button>
    </div>
  );
};

export default VO2maxCalculator;

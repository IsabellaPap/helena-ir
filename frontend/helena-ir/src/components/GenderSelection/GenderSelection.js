import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GenderSelection.module.css';

const GenderSelection = ({ onGenderSelect }) => {
  const [selectedGender, setSelectedGender] = useState('');
  const navigate = useNavigate();

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleNextClick = () => {
    if (selectedGender) {
      onGenderSelect(selectedGender);
      navigate('/questionnaire');
    }
  };

  return (
    <div className={`flex-column ${styles.container}`}>
      <div className={styles.dnaStripTop}></div>
      <h1>What is your <span className={styles.genderWord}>gender</span>?</h1>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.genderButton} ${selectedGender === 'female' ? styles.selected : ''}`}
          onClick={() => handleGenderSelect('female')}
        >
          Female
        </button>
        <button
          className={`${styles.genderButton} ${selectedGender === 'male' ? styles.selected : ''}`}
          onClick={() => handleGenderSelect('male')}
        >
          Male
        </button>
      </div>
      <button className={`nextButton ${styles.customColor}`} onClick={handleNextClick}>Next</button>
      <div className={styles.dnaStripBottom}></div>
    </div>
  );
};

export default GenderSelection;

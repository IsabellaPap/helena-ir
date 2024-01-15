import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css'; // Import the styles
import healthBarImg from '../../assets/health-bar.png'; // Import the health bar image
import peopleImg from '../../assets/people.png'; // Import the people image

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/gender-selection');
  };

  return (
    <div className={styles.container}>
      <img src={healthBarImg} alt="Health Bar" className={styles.healthBar} />
      <img src={peopleImg} alt="People" className={styles.people} />
      <h1 className={styles.title}>Ready to Learn About Your Health?</h1>
      <p>Begin your journey to understanding your health. Simple, quick questions to assess early risk for Insulin Resistance and Type 2 Diabetes.</p>
      <button className={styles.startButton} onClick={handleStartClick}>Start</button>
    </div>
  );
};

export default HomePage;
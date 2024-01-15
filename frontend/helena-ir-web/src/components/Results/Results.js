import React from 'react';
import styles from './Results.module.css'
import { useNavigate } from 'react-router-dom';

const Results = ({ score, classification }) => {
  const navigate = useNavigate();

  const retakeAssessment = () => {
    navigate('/');
  };

  return (
    <div className={`flex-column`}>
      <div className={`${styles.stripTop}`}></div>
      <h1 className={styles.resultsHeading}>Results</h1>
      <div className={styles.riskScore}><strong>Risk Score:</strong> {score}</div>
      <div className={styles.riskClassification}>You have <span style={{ color: '#A49DEA' }}>{classification}</span> risk of developing IR or type 2 Diabetes at an early age</div>
      <div className={`${styles.stripBottom}`}></div>
      <button className={styles.retakeButton} onClick={retakeAssessment}>Retake</button>
    </div>
  );
};

export default Results;
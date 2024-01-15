import React, { useState } from 'react';
import Question from '../Question/Question';
import { useNavigate } from 'react-router-dom';
import BMICalculator from '../BMICalculator';
import FMICalculator from '../FMICalculator';
import VO2maxCalculator from '../VO2maxCalculator';
import { validateInput } from '../validationUtil'; // Import the validation utility
import styles from './Questionnaire.module.css';

const signatureStyles = {
  vo2max: {
    primary: '#9CDEA2',
  },
  bmi: {
    primary: '#FF9255',
  },
  fmi: {
    primary: '#FF9255',
  },
  tv_hours: {
    primary: '#A49DEA',
  },
};

const Questionnaire = ({ gender, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const maleQuestions = [
    {
      prompt: "What is your VO2 max score?",
      jsonId: "vo2max",
      calculateOption: true,
    },
    {
      prompt: "What is your BMI (Body Mass Index)?",
      jsonId: "bmi",
      calculateOption: true,
    },
  ];

  const femaleQuestions = [
    {
      prompt: "What is your VO2 max score?",
      jsonId: "vo2max",
      calculateOption: true,
    },
    {
      prompt: "What is your FMI (Fat Mass Index)?",
      jsonId: "fmi",
      calculateOption: true,
    },
    {
      prompt: "How many hours of TV do you watch in a day?",
      jsonId: "tv_hours",
      calculateOption: false,
    },
  ];
  const questions = gender === 'male' ? [...maleQuestions] : [...femaleQuestions];
  
  const navigate = useNavigate();

 
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [showFMICalculator, setShowFMICalculator] = useState(false);
  const [showVO2maxCalculator, setShowVO2maxCalculator] = useState(false);

  const handleBMICalculated = (bmiValue) => {
    setAnswers({
      ...answers,
      bmi: bmiValue,
    });
    setValidationErrors({
      ...validationErrors,
      bmi: '',
    });
  };

  const handleFMICalculated = (fmiValue) => {
    setAnswers({
      ...answers,
      fmi: fmiValue,
    });
    setValidationErrors({
      ...validationErrors,
      fmi: '',
    });
  };

  const handleVO2maxCalculated = (vo2maxValue) => {
    setAnswers({
      ...answers,
      vo2max: vo2maxValue,
    });
    setValidationErrors({
      ...validationErrors,
      vo2max: '',
    });
  };

  
  
  const handleAnswerChange = (value, jsonId) => {
    const formattedValue = Number(value);
    let isValid = true;
    let errorMessage = '';

    const validation = validateInput(value, jsonId);
    isValid = validation.isValid;
    errorMessage = validation.errorMessage;

    setAnswers({
      ...answers,
      [jsonId]: formattedValue,
    });

    setValidationErrors({
      ...validationErrors,
      [jsonId]: isValid ? '' : errorMessage,
    });
  };

  const disableButton = () => {
    const errorsPresent = Object.values(validationErrors).some(error => error !== '');
  
    const currentAnswer = answers[currentQuestion.jsonId];
    const isAnswerEmpty = currentAnswer === undefined || currentAnswer === '';
    
    return errorsPresent || isAnswerEmpty;
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalAnswers = {
        ...answers,
        gender: gender,
      };
      try {
        await onSubmit(finalAnswers);
        navigate('/results');
      } catch (error) {
        console.error('Error during onSubmit:', error);
      }
    }
  };

  const getAdditionalContent = () => {
    switch (currentQuestion.jsonId) {
      case 'bmi':
        return showBMICalculator ? 
          <BMICalculator onBMICalculated={handleBMICalculated} /> :
          <div className={`calc-box`}>
            <span>Don't know? </span>
            <button onClick={() => setShowBMICalculator(true)}>Calculate</button>
          </div>;
      case 'vo2max':
        return showVO2maxCalculator ?
          <VO2maxCalculator onVO2maxCalculated={handleVO2maxCalculated} /> :
          <div className={`calc-box`}>
            <span>Don't know? </span>
            <button onClick={() => setShowVO2maxCalculator(true)}>Calculate</button>
          </div>;
      case 'fmi':
          return showFMICalculator ?
          <FMICalculator onFMICalculated={handleFMICalculated}  /> :
            <div className={`calc-box`}>
              <span>Don't know? </span>
              <button onClick={() => setShowFMICalculator(true)}>Calculate</button>
            </div>;
      default:
        return null;
    }
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentStyle = signatureStyles[currentQuestion.jsonId];

  return (
    <div className={`flex-column ${styles.container}`} style={{ '--image-top': `url(${currentStyle.imageTop})` }}>
      <div className={`${styles.stripTop} ${styles[`${currentQuestion.jsonId}Top`]}`}></div>
      <Question
        prompt={currentQuestion.prompt}
        value={answers[currentQuestion.jsonId] || ''}
        onChange={(value) => handleAnswerChange(value, currentQuestion.jsonId)}
        jsonId={currentQuestion.jsonId}
        signatureColor={currentStyle.primary}
        additionalContent={getAdditionalContent()}
      />
      {validationErrors[currentQuestion.jsonId] && (
        <div className={`error-message`}>{validationErrors[currentQuestion.jsonId]}</div>
      )}
      <button className={`nextButton`} style={{ background: currentStyle.primary }} onClick={handleNext} disabled={disableButton()}>Next</button>
      <div className={`${styles.stripBottom} ${styles[`${currentQuestion.jsonId}Bottom`]}`}></div>
    </div>
  );
};

export default Questionnaire;

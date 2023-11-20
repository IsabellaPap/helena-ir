import React, { useState } from 'react';
import Question from './Question';
import { useNavigate } from 'react-router-dom';
import BMICalculator from './BMICalculator';
import FMICalculator from './FMICalculator';
import VO2maxCalculator from './VO2maxCalculator';

const Questionnaire = ({ gender, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  
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
  };

  const handleFMICalculated = (fmiValue) => {
    setAnswers({
      ...answers,
      fmi: fmiValue,
    });
  };

  const handleVO2maxCalculated = (vo2maxValue) => {
    setAnswers({
      ...answers,
      vo2max: vo2maxValue,
    });
  };

  
  
  const handleAnswerChange = (value, isNumeric, jsonId) => {
    const formattedValue = isNumeric ? Number(value) : value;
    setAnswers({
      ...answers,
      [jsonId]: formattedValue,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalAnswers = {
        ...answers,
        gender: gender,
      };
      onSubmit(finalAnswers);
      navigate('/results');
    }
  };

  const getAdditionalContent = () => {
    switch (currentQuestion.jsonId) {
      case 'bmi':
        return showBMICalculator ? 
          <BMICalculator onBMICalculated={handleBMICalculated} /> :
          <button onClick={() => setShowBMICalculator(true)}>Don't know? Calculate</button>;
      case 'vo2max':
        return showVO2maxCalculator ?
          <VO2maxCalculator onVO2maxCalculated={handleVO2maxCalculated} /> :
          <button onClick={() => setShowVO2maxCalculator(true)}>Don't know? Calculate</button>;
      case 'fmi':
          return showFMICalculator ?
          <FMICalculator onFMICalculated={handleFMICalculated}  /> :
          <button onClick={() => setShowFMICalculator(true)}>Don't know? Calculate</button>;
      default:
        return null;
    }
  };
  
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <Question
        prompt={currentQuestion.prompt}
        value={answers[currentQuestion.jsonId] || ''}
        onChange={handleAnswerChange}
        jsonId={currentQuestion.jsonId}
        additionalContent={getAdditionalContent()}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Questionnaire;

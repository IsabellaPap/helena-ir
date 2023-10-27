import React, { useState } from 'react';
import QuestionComponent from './components/QuestionComponent';
import './App.css';
import { fetchBmi, fetchBodyFat } from './api';

const questions = [
  { prompt: "What is your gender?", jsonId: "gender", inputType: "multipleChoice", options: ["male", "female"] },
  { prompt: "What is your age in years?", jsonId: "age_yr", inputType: "number" },
  { prompt: "What is your body fat percentage?", jsonId: "body_fat_percentage", inputType: "number" },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);

  const [apiResponse, setApiResponse] = useState(null);

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Questionnaire Complete, sending answers:", answers);
      setQuizComplete(true);
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    fetch('http://localhost:8000/classify/bodyfat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(answers)
    })
      .then(response => response.json())
      .then(data => {
        console.log("Server Response: ", data);
        setApiResponse(data);
      })
      .catch((error) => console.error('Error:', error));
  }

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion.jsonId]: value,
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="App">
      {quizComplete ? (
        <div className="result-container">
          <p className="result-message">Test Complete!</p>
          <p className="result-detail">
            {apiResponse ? `Your classification is: ${apiResponse.classification}` : null}
          </p>
        </div>
      ) : (
        <>
      <QuestionComponent
        prompt={currentQuestion.prompt}
        inputType={currentQuestion.inputType}
        options={currentQuestion.options}
        onChange={handleAnswerChange}
      />
      <button onClick={handleNext}>Next</button>
        </>
      )}
    </div>
  );
};

export default App;

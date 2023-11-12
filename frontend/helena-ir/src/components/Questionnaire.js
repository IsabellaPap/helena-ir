import React, { useState } from 'react';
import Question from './Question';
import { useNavigate } from 'react-router-dom';

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
  
  const navigate = useNavigate();

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [speed, setSpeed] = useState('');
  const [age, setAge] = useState('');
  const [bodyfat, setBodyfat] = useState('');
  const [fatMass, setFatMass] = useState('');
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [showFMICalculator, setShowFMICalculator] = useState(false);
  const [showVO2maxCalculator, setShowVO2maxCalculator] = useState(false);



  // Inline BMI Calculator JSX
  const BMICalculator = (
    <div>
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} />
      <input type="number" placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)} />
      <button onClick={calculateBMI}>Calculate BMI</button>
    </div>
  );

  // Inline VO2 max Calculator JSX
  const VO2maxCalculator = (
    <div>
      <input type="number" placeholder="Speed (k/h)" value={speed} onChange={e => setSpeed(e.target.value)} />
      <input type="number" placeholder="Age (years)" value={age} onChange={e => setAge(e.target.value)} />
      <button onClick={calculateVO2max}>Calculate VO2 max</button>
    </div>
  );

  // Inline FMI max Calculator JSX
  const FMICalculator = (
    <div>
      <input type="number" placeholder="Body Fat (%)" value={bodyfat} onChange={e => setBodyfat(e.target.value)} />
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} />
      <input type="number" placeholder="Fat Mass (kg)" value={fatMass} onChange={e => setFatMass(e.target.value)} />
      <input type="number" placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)} />
      <button onClick={calculateFMI}>Calculate FMI</button>
    </div>
  );

  function calculateVO2max() {
    if (!speed || !age) {
      alert("Please enter both speed and age");
      return;
    }

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
        // Assuming the API returns an object with a 'vo2max' field
        setAnswers({ ...answers, vo2max: data.vo2max });
        setShowVO2maxCalculator(false); // Hide calculator after calculation
      })
      .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
      });
  }

  function calculateBMI() {
    if (!weight || !height) {
      alert("Please enter both weight and height");
      return;
    }

    // Convert weight and height to numbers, if they are not already
    const formattedWeight = Number(weight);
    const formattedHeight = Number(height);

    // API call to calculate BMI
    fetch('http://localhost:8000/calculate/bmi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weight_kg: formattedWeight, height_cm: formattedHeight }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Assuming the API returns an object with a 'bmi' field
        setAnswers({ ...answers, bmi: data.bmi });
        setShowBMICalculator(false); // Hide calculator after calculation
      })
      .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
      });
  }

  function calculateFMI() {
    if ((!(bodyfat && weight) && !fatMass) || !height) {
      alert("Please enter either height, weight, and body fat or height and fat mass");
      return;
    }

    // Convert weight and height to numbers, if they are not already
    const formattedFatMass = undefined;
    const formattedWeight = Number(weight);
    const formattedHeight = Number(height);
    const formattedBodyfat = Number(bodyfat);
    if (fatMass > 0 ) {
      formattedFatMass = Number(fatMass);
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
        setAnswers({ ...answers, fmi: data.fmi });
        setShowFMICalculator(false);
      })
      .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
      });
  }

  const questions = gender === 'male' ? [...maleQuestions] : [...femaleQuestions];
  
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
        return showBMICalculator ? BMICalculator : null;
      case 'vo2max':
        return showVO2maxCalculator ? VO2maxCalculator : null;
      case 'fmi':
        return showFMICalculator ? FMICalculator : null;
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
      {currentQuestion.jsonId === 'vo2max' && !showVO2maxCalculator && (
        <button onClick={() => setShowVO2maxCalculator(true)}>Don't know? Calculate</button>
      )}
      {currentQuestion.jsonId === 'bmi' && !showBMICalculator && (
        <button onClick={() => setShowBMICalculator(true)}>Don't know? Calculate</button>
      )}
      {currentQuestion.jsonId === 'fmi' && !showFMICalculator && (
        <button onClick={() => setShowFMICalculator(true)}>Don't know? Calculate</button>
      )}
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Questionnaire;

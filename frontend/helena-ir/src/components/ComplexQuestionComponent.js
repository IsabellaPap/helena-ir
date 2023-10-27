import React, { useState, useEffect } from 'react';
import QuestionComponent from './QuestionComponent';
import api from '../api';

const ComplexQuestionComponent = ({ prompt, inputType, options, onChange }) => {
  const [calculationResult, setCalculationResult] = useState(null);

  const handleInputChange = (value) => {
    // Call the original onChange method passed in as a prop
    onChange(value);

    // Trigger API call for real-time calculations
    api.calculateValue(value)
      .then(result => setCalculationResult(result))
      .catch(error => console.error('Calculation failed:', error));
  };

  return (
    <div>
      <QuestionComponent
        prompt={prompt}
        inputType={inputType}
        options={options}
        onChange={handleInputChange}
      />
      {calculationResult && (
        <div>
          <strong>Real-time calculation:</strong> {calculationResult}
        </div>
      )}
    </div>
  );
};

export default ComplexQuestionComponent;

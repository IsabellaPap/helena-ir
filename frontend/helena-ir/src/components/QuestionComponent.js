import React from 'react';

const QuestionComponent = ({ prompt, jsonId, inputType, options, onChange }) => {
  if (inputType === "number") {
    return (
      <div className="question">
        <label>{prompt}</label>
        <input type={inputType} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  } else if (inputType === "multipleChoice") {
    return (
      <div className="question">
        <label>{prompt}</label>
        {options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              value={option}
              onChange={(e) => onChange(e.target.value)}
            />
            {option}
          </label>
        ))}
      </div>
    );
  }
};

export default QuestionComponent;

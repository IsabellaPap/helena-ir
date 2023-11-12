import React from 'react';

const Question = ({ prompt, onChange, value, jsonId, additionalContent }) => {
  return (
    <div className="question">
      <label>{prompt}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value, true, jsonId)}
        className="number-input"
      />
      {additionalContent}
    </div>
  );
};

export default Question;
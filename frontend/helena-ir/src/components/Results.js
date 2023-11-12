import React from 'react';

const Results = ({ score, classification }) => {
  return (
    <div className="results-container">
      <h2>Your Assessment Results</h2>
      <p><strong>Risk Score:</strong> {score}</p>
      <p><strong>Risk Classification:</strong> {classification}</p>
    </div>
  );
};

export default Results;
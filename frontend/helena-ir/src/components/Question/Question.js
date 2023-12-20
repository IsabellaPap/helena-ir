import React from 'react';
import styles from './Question.module.css';

const Question = ({ prompt, onChange, value, jsonId, signatureColor, additionalContent }) => {

  const wordsToHighlight = {
    vo2max: ['VO2', 'max'],
    fmi: ['FMI'],
    bmi: ['BMI'],
    tv_hours: ['hours', 'TV']
  }

  const highlightWords = (prompt, wordsArray, color) => {
    return prompt.split(' ').map((word, index) => {
      const wordLower = word.toLowerCase();
      if (wordsArray.some(w => w.toLowerCase() === wordLower)) {
        return <span key={index} style={{ color: color }}>{word} </span>;
      } else {
        return <span key={index}>{word} </span>;
      }
    });
  };

  const wordsToHighlightArray = wordsToHighlight[jsonId] || [];

  return (
    <div className={`flex-column ${styles.container}`}>
      <h1>
        {highlightWords(prompt, wordsToHighlightArray, signatureColor)}
      </h1>
      <input className={`mainInput`}
        type="number"
        value={value}
        onChange={e => onChange(e.target.value, true, jsonId)}
        style={{ borderColor: signatureColor }}
      />
      {additionalContent}
    </div>
  );
};

export default Question;
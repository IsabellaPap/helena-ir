import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Question from './Question';
import BMICalculator from './BMICalculator';
import FMICalculator from './FMICalculator';
import VO2maxCalculator from './VO2maxCalculator';
import { StackScreenProps } from '@react-navigation/stack';
import { AppStackParamList } from '../App';
import { validateInput } from './ValidationUtil';
import { calculateRiskScore, classifyRiskScore } from '../services/api';

type QuestionnaireProps = StackScreenProps<AppStackParamList, 'Questionnaire'>;

type Answers = {
  [key: string]: any;
};

type SignatureStyle = {
  primary: string;
};

type SignatureStyles = {
  [key: string]: SignatureStyle;
};

type ValidationErrors = {
  [key: string]: string;
};

const Questionnaire: React.FC<QuestionnaireProps> = ({ route, navigation }) => {
  const { gender } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const signatureStyles: SignatureStyles = {
    vo2max: { primary: '#9CDEA2' },
    bmi: { primary: '#FF9255' },
    fmi: { primary: '#FF9255' },
    tv_hours: { primary: '#A49DEA' },
  };

  const questions = gender === 'male' ? [
    { prompt: "What is your VO2 max score?", jsonId: "vo2max", calculateOption: true },
    { prompt: "What is your BMI (Body Mass Index)?", jsonId: "bmi", calculateOption: true },
  ] : [
    { prompt: "What is your VO2 max score?", jsonId: "vo2max", calculateOption: true },
    { prompt: "What is your FMI (Fat Mass Index)?", jsonId: "fmi", calculateOption: true },
    { prompt: "How many hours of TV do you watch in a day?", jsonId: "tv_hours", calculateOption: false },
  ];

  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [showFMICalculator, setShowFMICalculator] = useState(false);
  const [showVO2maxCalculator, setShowVO2maxCalculator] = useState(false);

  const handleBMICalculated = (bmiValue: number) => {
    setAnswers({ ...answers, bmi: bmiValue });
    setValidationErrors({ ...validationErrors, bmi: '' });
  };

  const handleFMICalculated = (fmiValue: number) => {
    setAnswers({ ...answers, fmi: fmiValue });
    setValidationErrors({ ...validationErrors, fmi: '' });
  };

  const handleVO2maxCalculated = (vo2maxValue: number) => {
    setAnswers({ ...answers, vo2max: vo2maxValue });
    setValidationErrors({ ...validationErrors, vo2max: '' });
  };

  const handleAnswerChange = (value: string, jsonId: string) => {
    const formattedValue = Number(value);
    let isValid = true;
    let errorMessage = '';

    const validation = validateInput(value, jsonId);
    isValid = validation.isValid;
    errorMessage = validation.errorMessage!;

    setAnswers({ ...answers, [jsonId]: formattedValue });
    setValidationErrors({ ...validationErrors, [jsonId]: isValid ? '' : errorMessage });
  };

  const disableButton = () => {
    const errorsPresent = Object.values(validationErrors).some(error => error !== '');
    const currentAnswer = answers[questions[currentQuestionIndex].jsonId];
    const isAnswerEmpty = currentAnswer === undefined || currentAnswer === '';
    return errorsPresent || isAnswerEmpty;
  };

  const handleSubmit = async (finalAnswers: Answers) => {
    try {
      const scoreData = await calculateRiskScore(finalAnswers);
      const score = scoreData.risk_score;

      const classificationData = await classifyRiskScore(score, finalAnswers.gender);
      const classification = classificationData.classification;

      //navigation.navigate('ResultsScreen', { score, classification });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalAnswers = { ...answers, gender: gender };
      try {
        await handleSubmit(finalAnswers);
      } catch (error) {
        console.error('Error during onSubmit:', error);
      }
    }
  };

  const getAdditionalContent = () => {
    const currentQuestion = questions[currentQuestionIndex];
    switch (currentQuestion.jsonId) {
      case 'bmi':
        return showBMICalculator ?
          <BMICalculator onBMICalculated={handleBMICalculated} /> :
          <TouchableOpacity onPress={() => setShowBMICalculator(true)}>
            <Text>Don't know? Calculate</Text>
          </TouchableOpacity>;
      case 'fmi':
        return showFMICalculator ?
          <FMICalculator onFMICalculated={handleFMICalculated} /> :
          <TouchableOpacity onPress={() => setShowFMICalculator(true)}>
            <Text>Don't know? Calculate</Text>
          </TouchableOpacity>;
      case 'vo2max':
        return showVO2maxCalculator ?
          <VO2maxCalculator onVO2maxCalculated={handleVO2maxCalculated} /> :
          <TouchableOpacity onPress={() => setShowVO2maxCalculator(true)}>
            <Text>Don't know? Calculate</Text>
          </TouchableOpacity>;
      default:
        return null;
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentStyle = signatureStyles[currentQuestion.jsonId];

  return (
    <View style={styles.container}>
      <Question
        prompt={currentQuestion.prompt}
        value={answers[currentQuestion.jsonId] || ''}
        onChange={(value) => handleAnswerChange(value, currentQuestion.jsonId)}
        jsonId={currentQuestion.jsonId}
        signatureColor={currentStyle.primary}
        additionalContent={getAdditionalContent()}
      />
      {validationErrors[currentQuestion.jsonId] && (
        <Text style={styles.error}>{validationErrors[currentQuestion.jsonId]}</Text>
      )}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: currentStyle.primary }]}
        onPress={handleNext}
        disabled={disableButton()}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles for your main container
  },
  error: {
    // Styles for error messages
  },
  nextButton: {
    // Styles for your 'Next' button
  },
  buttonText: {
    // Styles for text within buttons
  },
  // ... other styles
});

export default Questionnaire;

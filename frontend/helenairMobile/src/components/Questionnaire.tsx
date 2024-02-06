import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
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

type SignatureImages = {
  top: any;
  bottom: any;
}

type SignatureStyle = {
  primary: string;
  images: SignatureImages;
};

type SignatureStyles = {
  [key: string]: SignatureStyle;
};

type ValidationErrors = {
  [key: string]: string;
};

const bmiTop: any = require('../../assets/bmiTop.png');
const bmiBottom: any = require('../../assets/bmiBottom.png');
const fmiTop: any = require('../../assets/fmiTop.png');
const fmiBottom: any = require('../../assets/fmiBottom.png');
const vo2maxTop: any = require('../../assets/vo2maxTop.png');
const vo2maxBottom: any = require('../../assets/vo2maxBottom.png');
const tv_hoursTop: any = require('../../assets/tv_hoursTop.png');
const tv_hoursBottom: any = require('../../assets/tv_hoursBottom.png');

const Questionnaire: React.FC<QuestionnaireProps> = ({ route, navigation }) => {
  const { gender } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const signatureStyles: SignatureStyles = {
    vo2max: { 
      primary: '#9CDEA2', 
      images:{
        top: vo2maxTop,
        bottom: vo2maxBottom
      } },
    bmi: { 
      primary: '#FF9255', 
      images: {
        top: bmiTop,
        bottom: bmiBottom
      } },
    fmi: { 
      primary: '#FF9255', 
      images: {
        top: fmiTop,
        bottom: fmiBottom
      } },
    tv_hours: { 
      primary: '#A49DEA', 
      images: {
        top: tv_hoursTop,
        bottom: tv_hoursBottom
      }},
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

  const [calculatedValue, setCalculatedValue] = useState('');

  const handleBMICalculated = (bmiValue: number) => {
    setAnswers({ ...answers, bmi: bmiValue });
    setValidationErrors({ ...validationErrors, bmi: '' });
    setCalculatedValue(bmiValue.toString());

  };

  const handleFMICalculated = (fmiValue: number) => {
    setAnswers({ ...answers, fmi: fmiValue });
    setValidationErrors({ ...validationErrors, fmi: '' });
    setCalculatedValue(fmiValue.toString());
  };

  const handleVO2maxCalculated = (vo2maxValue: number) => {
    setAnswers({ ...answers, vo2max: vo2maxValue });
    setValidationErrors({ ...validationErrors, vo2max: '' });
    setCalculatedValue(vo2maxValue.toString());
  };

  const handleAnswerChange = (value: string, jsonId: string) => {
    setCalculatedValue(value);
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

      navigation.navigate('Results', { score, classification });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCalculatedValue('');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalAnswers = { ...answers, gender: gender };
      setCalculatedValue('');
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
          <TouchableOpacity style={styles.calculateButton} onPress={() => setShowBMICalculator(true)}>
            <Text>Don't know? Calculate</Text>
          </TouchableOpacity>;
      case 'fmi':
        return showFMICalculator ?
          <FMICalculator onFMICalculated={handleFMICalculated} /> :
          <TouchableOpacity style={styles.calculateButton} onPress={() => setShowFMICalculator(true)}>
            <Text>Don't know? Calculate</Text>
          </TouchableOpacity>;
      case 'vo2max':
        return showVO2maxCalculator ?
          <VO2maxCalculator onVO2maxCalculated={handleVO2maxCalculated} /> :
          <TouchableOpacity style={styles.calculateButton} onPress={() => setShowVO2maxCalculator(true)}>
            <Text>Don't know? Calculate</Text>
          </TouchableOpacity>;
      default:
        return null;
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentStyle = signatureStyles[currentQuestion.jsonId];

  const selectedStyleTop: any = styles[`${currentQuestion.jsonId}Top` as keyof typeof styles];
  const selectedStyleBottom: any = styles[`${currentQuestion.jsonId}Bottom` as keyof typeof styles];

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <ImageBackground source={currentStyle.images.top} style={selectedStyleTop}/>
      </View>
      <Question
        prompt={currentQuestion.prompt}
        value={calculatedValue}
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
      <View style={styles.bottomContainer}>
        <ImageBackground source={currentStyle.images.bottom} style={selectedStyleBottom} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E4',
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
  },
  error: {
    color:'#F31F1F',
    margin: 10,
  },
  nextButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 25,
    width: '70%',
  },
  buttonText: {
    textAlign: 'center',
    color: '#0E194D',
    fontSize: 18,
  },
  calculateButton: {
    alignSelf:'center',
    margin: 10,
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '35%',
    margin: 0,
    padding: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '35%'
  },
  vo2maxTop: {
    height: 250,
    width: '100%',
    resizeMode: 'contain',
  },
  vo2maxBottom: {
    height: 220,
    width: '100%',
    resizeMode: 'contain',
  },
  bmiTop: {
    height: 185,
    width: '100%',
    resizeMode: 'contain',
  },
  fmiTop: {
    height: 185,
    width: '100%',
    resizeMode: 'contain',
  },
  bmiBottom: {
    height: 160,
    width: '100%',
    resizeMode: 'contain',
  }, 
  fmiBottom: {
    height: 160,
    width: '100%',
    resizeMode: 'contain',
  },
  tv_hoursTop: {
    height: 160,
    width: '100%',
    resizeMode: 'contain',
  },
  tv_hoursBottom: {
    height: 180,
    width: '100%',
    resizeMode: 'contain',
  }
});

export default Questionnaire;

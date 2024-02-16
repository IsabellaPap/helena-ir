import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { AppStackParamList } from '../App';

const dnaTopImg = require('../../assets/dna.png');
const dnaBottomImg = require('../../assets/dna.png');

type QuestionnaireIDProps = StackScreenProps<AppStackParamList, 'QuestionnaireID'>;


const QuestionnaireID: React.FC<QuestionnaireIDProps> = ({ navigation }) => {
  const [questionnaireID, setQuestionnaireID] = useState('');

  const handleNextClick = () => {
    if (questionnaireID) {
      navigation.navigate('GenderSelection', { questionnaireID: questionnaireID });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={dnaTopImg} style={styles.dnaStripTop} />
      <Text style={styles.title}>
        Input an identifier for this test:
      </Text>
      <View>
        <TextInput
          style={styles.input}
          value={questionnaireID}
          onChangeText={setQuestionnaireID}
        />
      </View>
      <TouchableOpacity
        style={[styles.nextButton]}
        onPress={handleNextClick}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <ImageBackground source={dnaBottomImg} style={styles.dnaStripBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dnaStripTop: {
    height: '50%',
    width: '65%',
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dnaStripBottom: {
    position: 'absolute',
    bottom: -180,
    right: -100,
    height: '50%',
    width: '65%',
    resizeMode: 'contain',
  },
  title: {
    marginTop: 140,
    fontSize: 25,
    textAlign: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#0E194D',
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 25,
    width: '70%',
    marginBottom: 130,
  },
  input: {
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 100,
    textAlign: 'center',
    fontSize: 28,
  },
});

export default QuestionnaireID;

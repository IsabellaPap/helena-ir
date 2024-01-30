import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { AppStackParamList } from '../App';

const dnaTopImg = require('../../assets/dna.png');
const dnaBottomImg = require('../../assets/dna.png');

type GenderSelectionProps = StackScreenProps<AppStackParamList, 'GenderSelection'>;


const GenderSelection: React.FC<GenderSelectionProps> = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState('');

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleNextClick = () => {
    if (selectedGender) {
      navigation.navigate('Questionnaire', { gender: selectedGender });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={dnaTopImg} style={styles.dnaStripTop} />
      <Text style={styles.title}>
        What is your <Text style={styles.genderWord}>gender</Text>?
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'female' && styles.selected,
          ]}
          onPress={() => handleGenderSelect('female')}
        >
          <Text style={styles.buttonText}>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'male' && styles.selected,
          ]}
          onPress={() => handleGenderSelect('male')}
        >
          <Text style={styles.buttonText}>Male</Text>
        </TouchableOpacity>
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
    top:0,
    left:0,
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
    marginTop: 120,
    fontSize: 30,
    textAlign: 'center',
    marginBottom: -60,
  },
  genderWord: {
    color: '#FF6B6B',
  },
  buttonContainer: {
    width: '70%',
  },
  genderButton: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
    borderRadius: 25,
    marginVertical: '5%',
    paddingVertical: '5%',
  },
  buttonText: {
    textAlign: 'center',
    color: '#0E194D',
    fontSize: 18,
  },
  selected: {
    backgroundColor: '#FF6B6B',
    color: 'white',
  },
  nextButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 25,
    width: '70%',
    marginBottom: 130,
    marginTop: -40,
  }
});

export default GenderSelection;

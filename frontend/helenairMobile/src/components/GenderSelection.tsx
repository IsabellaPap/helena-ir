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
        style={[styles.nextButton, styles.customColor]}
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
    height: '20%',
    width: '120%',
    resizeMode: 'contain',
  },
  dnaStripBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: '20%',
    width: '42%',
    resizeMode: 'cover',
    zIndex: 10,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
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
    marginVertical: '2%',
    paddingVertical: '2%',
  },
  buttonText: {
    textAlign: 'center',
  },
  selected: {
    backgroundColor: '#FF6B6B',
    color: 'white',
  },
  nextButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
  },
  customColor: {
    // Additional styles if needed
  },
  // Add media query equivalent styles if needed
});

export default GenderSelection;

import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { validateInput } from './ValidationUtil';
import { fetchVo2max } from '../services/api';


interface VO2maxCalculatorProps {
  onVO2maxCalculated: (bmi: number) => void;
}

const VO2maxCalculator: React.FC<VO2maxCalculatorProps> = ({ onVO2maxCalculated }) => {
  const [speed, setSpeed] = useState('');
  const [age, setAge] = useState('');
  const [validationErrors, setValidationErrors] = useState({ speed: '', age: '' });

  const handleInputChange = (value: string, type: string) => {
    const { isValid, errorMessage } = validateInput(value, type);

    if (type === 'speed') {
      setSpeed(value);
    } else if (type === 'age') {
      setAge(value);
    }

    setValidationErrors({ ...validationErrors, [type]: isValid ? '' : errorMessage });
  };

  const disableButton = () => {
    return Object.values(validationErrors).some(error => error !== '');
  };

  const calculateVO2max = () => {
    const formattedSpeed = Number(speed);
    const formattedAge = Number(age);

    const vo2maxData = {
      speed_km_per_h: formattedSpeed,
      age_yr: formattedAge
    };

    fetchVo2max(vo2maxData)
      .then(response => {
        onVO2maxCalculated(response);
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Speed (k/h)"
          value={speed.toString()}
          onChangeText={(text) => handleInputChange(text, 'speed')}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Age (years)"
          value={age.toString()}
          onChangeText={(text) => handleInputChange(text, 'age')}
          keyboardType="numeric"
        />
      </View>
      {validationErrors.speed !== '' && <Text style={styles.error}>{validationErrors.speed}</Text>}

      {validationErrors.age !== '' && <Text style={styles.error}>{validationErrors.age}</Text>}
      
      <TouchableOpacity onPress={calculateVO2max} disabled={disableButton()} style={styles.button}>
        <Text>Calculate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    margin: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  error: {
    color: '#F31F1F',
    margin: 10,
  },
  button: {
    borderRadius: 25,
    borderColor: '#9CDEA2',
    borderWidth: 2,
    padding: 5,
    marginBottom: 10
  }
});

export default VO2maxCalculator;

import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { validateInput } from './ValidationUtil';
import { fetchBmi } from '../services/api'; 


interface BMICalculatorProps {
  onBMICalculated: (bmi: number) => void;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ onBMICalculated }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [validationErrors, setValidationErrors] = useState({ weight: '', height: '' });

  const handleInputChange = (value: string, type: string) => {
    const { isValid, errorMessage } = validateInput(value, type);

    if (type === 'weight') {
      setWeight(value);
    } else if (type === 'height') {
      setHeight(value);
    }

    setValidationErrors({ ...validationErrors, [type]: isValid ? '' : errorMessage });
  };

  const disableButton = () => {
    return Object.values(validationErrors).some(error => error !== '');
  };

  const calculateBMI = () => {
    const formattedWeight = Number(weight);
    const formattedHeight = Number(height);

    const bmiData = {
      weight_kg: formattedWeight,
      height_cm: formattedHeight
    };

    fetchBmi(bmiData)
      .then(data => {
        onBMICalculated(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={(text) => handleInputChange(text, 'weight')}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          value={height}
          onChangeText={(text) => handleInputChange(text, 'height')}
          keyboardType="numeric"
        />
      </View>
      {validationErrors.weight !== '' && <Text style={styles.error}>{validationErrors.weight}</Text>}

      {validationErrors.height !== '' && <Text style={styles.error}>{validationErrors.height}</Text>}

      <TouchableOpacity onPress={calculateBMI} disabled={disableButton()} style={styles.button}>
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
    borderColor: '#FF9255',
    borderWidth: 2,
    padding: 5,
    marginBottom: 10
  }
});

export default BMICalculator;
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
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={(text) => handleInputChange(text, 'weight')}
        keyboardType="numeric"
      />
      {validationErrors.weight !== '' && <Text style={styles.error}>{validationErrors.weight}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={height}
        onChangeText={(text) => handleInputChange(text, 'height')}
        keyboardType="numeric"
      />
      {validationErrors.height !== '' && <Text style={styles.error}>{validationErrors.height}</Text>}

      <TouchableOpacity onPress={calculateBMI} disabled={disableButton()} style={styles.button}>
        <Text>Calculate BMI</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles for the container (flexbox, padding, etc.)
  },
  input: {
    // Styles for the TextInput components
  },
  error: {
    // Styles for the error Text components
  },
  button: {
    // Styles for the TouchableOpacity button
  }
});

export default BMICalculator;
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { validateInput } from './ValidationUtil'; // Ensure this is compatible with React Native
import { fetchFmi } from '../services/api'; // Ensure this API call works in React Native

interface FMICalculatorProps {
  onFMICalculated: (bmi: number) => void;
}

interface FmiRequestBody {
  weight_kg: number;
  height_cm: number;
  body_fat_percentage: number;
  fat_mass_kg?: number;
}

const FMICalculator: React.FC<FMICalculatorProps> = ({ onFMICalculated }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bodyfat, setBodyfat] = useState('');
  const [fatMass, setFatMass] = useState('');
  const [validationErrors, setValidationErrors] = useState({ weight: '', height: '', bodyfat: '', fatmass: '' });

  const handleInputChange = (value: string, type: string, allowZero:boolean = false) => {
    const { isValid, errorMessage } = validateInput(value, type, allowZero);

    if (type === 'weight') {
      setWeight(value);
    } else if (type === 'height') {
      setHeight(value);
    } else if (type === 'bodyfat') {
      setBodyfat(value);
    } else if (type === 'fatmass') {
      setFatMass(value);
    }

    setValidationErrors({ ...validationErrors, [type]: isValid ? '' : errorMessage });
  };

  const disableButton = () => {
    const errorsPresent = Object.values(validationErrors).some(error => error !== '');
    const missingInput = !fatMass && (!weight || !bodyfat);
    const isZero = (fatMass === '0' && weight === '0' && bodyfat === '0');
    return errorsPresent || missingInput || isZero;
  };

  const calculateFMI = () => {
    const formattedWeight = Number(weight);
    const formattedHeight = Number(height);
    const formattedBodyfat = Number(bodyfat);
    const formattedFatMass = Number(fatMass);

    let requestBody: FmiRequestBody = {
      weight_kg: formattedWeight,
      height_cm: formattedHeight,
      body_fat_percentage: formattedBodyfat,
    };

    if (formattedFatMass > 0) {
      requestBody.fat_mass_kg = formattedFatMass;
    }

    fetchFmi(requestBody)
      .then(data => {
        onFMICalculated(data);
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
          placeholder="Body Fat (%)"
          value={bodyfat}
          onChangeText={(text) => handleInputChange(text, 'bodyfat', true)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={(text) => handleInputChange(text, 'weight', true)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Fat Mass (kg)"
          value={fatMass}
          onChangeText={(text) => handleInputChange(text, 'fatmass', true)}
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

      {validationErrors.bodyfat !== '' && <Text style={styles.error}>{validationErrors.bodyfat}</Text>}

      {validationErrors.weight !== '' && <Text style={styles.error}>{validationErrors.weight}</Text>}

      {validationErrors.fatmass !== '' && <Text style={styles.error}>{validationErrors.fatmass}</Text>}

      {validationErrors.height !== '' && <Text style={styles.error}>{validationErrors.height}</Text>}
      <TouchableOpacity onPress={calculateFMI} disabled={disableButton()} style={styles.button}>
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

export default FMICalculator;

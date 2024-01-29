import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerUser } from '../services/api';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../App';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  const handleSubmit = async () => {
    const data = {
      email,
      password,
      full_name: fullName,
    };
    try {
      const response = await registerUser(data);
      console.log('Registration successful:', response);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Register" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
  },
});

export default Registration;

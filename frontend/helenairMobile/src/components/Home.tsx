import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../App';
import { downloadResults } from '../services/api';

const healthBarImg = require('../../assets/health-bar.png');
const peopleImg = require('../../assets/people.png');

const HomePage = () => {
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  const handleStartClick = () => {
    navigation.navigate('QuestionnaireID');
  };

  const onDownload = async () => {
    await downloadResults();
  }

  return (
    <View style={styles.container}>
      <Image source={healthBarImg} style={styles.healthBar} />
      <Image source={peopleImg} style={styles.people} />
      <Text style={styles.title}>Ready to Learn About Your Health?</Text>
      <Text>
        Begin your journey to understanding your health. Simple, quick questions to assess early risk for Insulin Resistance and Type 2 Diabetes.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={handleStartClick}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{marginTop: 10}} onPress={onDownload}>
        <Text style={{borderBottomWidth: 1}}>Donwload results as csv</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E4',
    padding: 20,
    flex: 1,
  },
  healthBar: {
    width: '70%',
    height: undefined,
    aspectRatio: 1, 
    resizeMode: 'contain',
    marginTop: -60,
  },
  people: {
    width: '70%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginTop: -60,
  },
  title: {
    marginBottom: 10,
    color: '#333',
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Manrope',
  },
  startButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default HomePage;

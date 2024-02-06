import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { AppStackParamList } from "../App";
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from "react-native";

type ResultsProps = StackScreenProps<AppStackParamList, 'Results'>;

const resultsTop: any = require('../../assets/resultsTop.png');
const resultsBottom: any = require('../../assets/resultsBottom.png');

const Results: React.FC<ResultsProps> = ({ route, navigation }) => {
  const {score, classification} = route.params;

  const retakeAssessment = () => {
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <ImageBackground source={resultsTop} style={styles.imageTop} />
      </View>
      <Text style={styles.score}>Risk score:{score}</Text>
      <Text style={styles.classification}>You have <Text style={styles.classificationHighlight}>{classification}</Text> risk of developing IR or type 2 Diabetes at an early age</Text>
      <TouchableOpacity style={styles.retakeButton} onPress={retakeAssessment}>
        <Text style={styles.retakeButtonText}>Retake</Text>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <ImageBackground source={resultsBottom} style={styles.imageBottom} />
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
  retakeButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
  },
  retakeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    margin: 0,
    padding: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '55%'
  },
  imageTop: {
    height: 300,
    width: '100%',
    resizeMode: 'contain',
  },
  imageBottom: {
    height: 190,
    width: '100%',
    resizeMode: 'contain',
  },
  score: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 30,
    textAlign: 'center',
    fontSize: 30,
  },
  classification: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#A49DEA',
    paddingVertical: 15,
    paddingHorizontal: 15,
    textAlign: 'left',
    marginTop: 20,
    width: '70%',
    fontSize: 20
  },
  classificationHighlight: {
    color: '#A49DEA'
  }
});

export default Results;
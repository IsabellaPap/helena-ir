import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { AppStackParamList } from "../App";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

type ResultsProps = StackScreenProps<AppStackParamList, 'Results'>;

const Results: React.FC<ResultsProps> = ({ route, navigation }) => {
  const {score, classification} = route.params;

  const retakeAssessment = () => {
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <Text>{score}</Text>
      <Text>{classification}</Text>
      <TouchableOpacity style={styles.retakeButton} onPress={retakeAssessment}>
        <Text style={styles.retakeButtonText}>Retake</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles for your main container
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
  }

});

export default Results;
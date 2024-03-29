import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface QuestionProps {
  prompt: string;
  onChange: (value: string, jsonId: string) => void;
  value: string;
  jsonId: string;
  signatureColor: string;
  additionalContent: React.ReactNode;
}

const Question: React.FC<QuestionProps> = ({
  prompt,
  onChange,
  value,
  jsonId,
  signatureColor,
  additionalContent
}) => {

  const wordsToHighlight: { [key: string]: string[] } = {
    vo2max: ['VO2', 'max'],
    fmi: ['FMI'],
    bmi: ['BMI'],
    tv_hours: ['hours', 'TV'],
  };

  const highlightWords = (prompt: string, wordsArray: string[], color: string) => {
    return prompt.split(' ').map((word, index) => {
      const wordLower = word.toLowerCase();
      if (wordsArray.some(w => w.toLowerCase() === wordLower)) {
        return <Text key={index} style={{ color: color }}>{word} </Text>;
      } else {
        return <Text key={index}>{word} </Text>;
      }
    });
  };

  const wordsToHighlightArray = wordsToHighlight[jsonId] || [];

  return (
    <View>
      <Text style={styles.prompt}>
        {highlightWords(prompt, wordsToHighlightArray, signatureColor)}
      </Text>
      <TextInput
        style={[styles.input, { borderColor: signatureColor }]}
        value={value}
        onChangeText={(text) => onChange(text, jsonId)}
        keyboardType="numeric"
      />
      {additionalContent}
    </View>
  );
};

const styles = StyleSheet.create({
  prompt: {
    marginBottom: 25,
    color: '#333',
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Manrope',
  },
  input: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 15,
    textAlign: 'center',
    fontSize: 35,
  },
});

export default Question;

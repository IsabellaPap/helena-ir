import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register'
import GenderSelection from './components/GenderSelection';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import QuestionnaireID from './components/Questionnaire_ID';

export type AppStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  QuestionnaireID: undefined;
  GenderSelection: { questionnaireID: string };
  Questionnaire: { gender: string, questionnaireID: string };
  Results: {score: number, classification: string};
};

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="QuestionnaireID" component={QuestionnaireID} />
      <Stack.Screen name="GenderSelection" component={GenderSelection} />
      <Stack.Screen name="Questionnaire" component={Questionnaire} />
      <Stack.Screen name="Results" component={Results} />
    </Stack.Navigator>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
});

export default App;

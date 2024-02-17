import React, { useEffect, useState } from 'react';
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
import { checkUserAuthentication } from './services/api';
import Logout from './components/Logout';

export type AppStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  QuestionnaireID: undefined;
  GenderSelection: { questionnaireID: string };
  Questionnaire: { gender: string, questionnaireID: string };
  Results: {score: number, classification: string};
  Logout: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

interface AppNavigatorProps {
  isLoggedIn: boolean | null;
  handleLogout: () => void;
  handleLogin: () => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ isLoggedIn, handleLogout, handleLogin }) => {
  
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="QuestionnaireID" component={QuestionnaireID} />
          <Stack.Screen name="GenderSelection" component={GenderSelection} />
          <Stack.Screen name="Questionnaire" component={Questionnaire} />
          <Stack.Screen name="Results" component={Results} />
          <Stack.Screen name="Logout">
            {props => <Logout {...props} handleLogout={handleLogout} />}
          </Stack.Screen>
        </>
      ) : (
          <Stack.Screen name="Login">
            {props => <Login {...props} handleLogin={handleLogin} />}
          </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {

    const fetchUserAuthentication = async () => {
      const authenticated = await checkUserAuthentication();
      setIsLoggedIn(authenticated);
    };

    fetchUserAuthentication();
  }, []);


  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <AppNavigator isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleLogin={handleLogin} />
      </NavigationContainer>
      {isLoggedIn ? <Logout handleLogout={handleLogout} /> : null}
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

import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../App';

interface LogoutProps {
  handleLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ handleLogout }) => {

  const logout = async function () {
    try {
      await AsyncStorage.removeItem('jwtToken');
      handleLogout();
    } catch (error) {
      console.log('Error removing JWT token: ', error);
    }
  };

  return (
    <View>
      <View>
        <TouchableOpacity onPress={() => logout()}>
          <View >
            <Text>{'Logout'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Logout;
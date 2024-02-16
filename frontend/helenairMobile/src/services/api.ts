import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const API_BASE_URL = 'http://10.0.2.2:8000';

export const checkUserAuthentication = async() => {
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    return token !== null;
  } catch (error) {
    console.error('Error checking user authentication:', error);
    return false;
  }
}
export const fetchBmi = async (data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate/bmi`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch BMI');
    }

    return result.bmi;
  } catch (error) {
    console.error('BMI calculation failed:', error);
    throw error;
  }
};

export const fetchFmi = async (data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate/fmi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch BMI');
    }

    return result.fmi;
  } catch (error) {
    console.error('FMI calculation failed:', error);
    throw error;
  }
};

export const fetchVo2max = async (data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate/vo2max`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch VO2 max');
    }

    return result.vo2max;
  } catch (error) {
    console.error('VO2 max calculation failed:', error);
    throw error;
  }
};

export const calculateRiskScore = async (answers: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate/risk-score`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during risk score calculation:', error);
    throw error;
  }
};

export const classifyRiskScore = async (score: Number, gender: String) => {
  const response = await fetch(`${API_BASE_URL}/classify/risk-score`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({risk_score: score, gender: gender}),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

export const registerUser = async (userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/create/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during user registration:', error);
    throw error;
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const params = new URLSearchParams(credentials).toString();
    const data: {[key: string]: string} = {}
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: params,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during user login:', error);
    throw error;
  }
};

export const submitQuestionnaireResult = async (answers: any) => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    console.log('Request Body:', JSON.stringify(answers));

    const response = await fetch(`${API_BASE_URL}/questonnaire_result/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}` },
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error during risk score calculation:', error);
    throw error;
  }
}

export const downloadResults = async () => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  try {
    const response = await fetch(`${API_BASE_URL}/download_questionnaire`, {
      method: 'GET',
      headers: { 'Content-Type': 'text/csv', 'Authorization': `Bearer ${jwtToken}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const csvData = await response.text();
    const path = `${RNFetchBlob.fs.dirs.DownloadDir}/questionnaire_results.csv`
    await RNFetchBlob.fs.writeFile(path, csvData);
    Alert.alert('File downloaded successfully')

  } catch (error) {
    console.error('Error downloading file:', error);
    Alert.alert('Error downloading file');
  }
}
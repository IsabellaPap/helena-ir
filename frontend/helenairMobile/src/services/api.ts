const API_BASE_URL = 'http://192.168.197.224:8000';

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

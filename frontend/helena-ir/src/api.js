export const fetchBmi = async (data) => {
  try {
    const response = await fetch('http://localhost:8000/calculate/bmi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

export const fetchVo2max = async (data) => {
  try {
    const response = await fetch('http://localhost:8000/calculate/vo2max', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch VO2 max');
    }

    return result.bmi;
  } catch (error) {
    console.error('VO2 max calculation failed:', error);
    throw error;
  }
};

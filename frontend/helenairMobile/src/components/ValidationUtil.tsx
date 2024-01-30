export const validateInput = (input: string, type: string, allowZero: boolean = false) => {
  const value = Number(input);
  let errorMessage = '';

  if (isNaN(value) || (!allowZero && value === 0)) {
    errorMessage = `Please enter a valid number for ${type}.`;
    return { isValid: false, errorMessage };
  }

  let min, max;

  switch (type) {
    case 'weight':
      [min, max] = [25, 300];
      break;
    case 'height':
      [min, max] = [70, 200];
      break;
    case 'speed':
      [min, max] = [8.49, 20];
      break;
    case 'age':
      [min, max] = [7, 20];
      break;
    case 'bodyfat':
      [min, max] = [0, 80];
      break;
    case 'fatmass':
      [min, max] = [0, 300 * 0.8];
      break;
    case 'vo2max':
      [min, max] = [22.71, 94.54];
      break;
    case 'bmi':
      [min, max] = [13, 35];
      break;
    case 'fmi':
      [min, max] = [3.4, 25];
      break;
    case 'tv_hours':
      [min, max] = [0, 19];
      break;
    default:
      return { isValid: true };
  }

  if ((!allowZero && (value <= min || value >= max)) || (allowZero && (value < 0 || value > max))) {
    errorMessage = `Please enter a ${type} between ${min} and ${max}.`;
    return { isValid: false, errorMessage };
  }

  return { isValid: true };
};
export const validateInput = (input, type, allowZero = false) => {
  const value = Number(input);

  if (isNaN(value) || (!allowZero && value === 0)) {
    errorMessage = `Please enter a valid number for ${type}.`;
    return { isValid: false, errorMessage };
  }

  let min, max, errorMessage = '';

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
      [min, max] = [0, value * 0.8];
      break;
    default:
      return { isValid: true };
  }
  if ((!allowZero && (value < min || value > max)) || (allowZero && (value < 0 || value > max))) {
    errorMessage = `Please enter a ${type} between ${min} and ${max}.`;
    return { isValid: false, errorMessage };
  }

  return { isValid: true };
};
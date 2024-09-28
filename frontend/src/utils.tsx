export const getError = (error: any) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const checkID = (str: string) => {
  if (str.length === 9) {
    if (Array.from(str)[0].toLowerCase() === 'c') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

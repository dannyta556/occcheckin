export const semesterDates = [
  { name: 'Fall', start: '08/20', end: '12/20' },
  { name: 'Spring', start: '01/20', end: '05/27' },
  { name: 'Summer', start: '06/06', end: '08/15' },
];

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

export const setUpYears = () => {
  // Intialize Years
  const thisYear = new Date().getFullYear();
  let years: number[] = [];
  let earlierYears = Array.from(
    new Array(3),
    (val, index) => thisYear - index - 1
  );
  earlierYears = earlierYears.reverse();
  let laterYears = Array.from(new Array(4), (val, index) => index + thisYear);
  years.push(...earlierYears);
  years.push(...laterYears);

  return years;
};

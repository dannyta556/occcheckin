import axios from 'axios';
import { toast } from 'react-toastify';

export const semesterDates = [
  { name: 'Fall', start: '08/20', end: '12/20' },
  { name: 'Spring', start: '01/20', end: '05/27' },
  { name: 'Summer', start: '06/06', end: '08/15' },
];
export type ButtonEvent = React.MouseEvent<HTMLFormElement>;

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

export const createReducer = () => {
  return (state: any, action: any) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, ...action.payload, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
};

export const handleChange =
  (setter: React.Dispatch<React.SetStateAction<string>>) =>
  (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
  };

export const handleApiRequest = async (
  method: 'get' | 'post' | 'put',
  url: string,
  data?: any,
  callback?: () => Promise<void>
) => {
  try {
    const res = await axios[method](url, data);
    toast.success(res.data.message);

    if (callback) {
      await callback();
    }
  } catch (err) {
    toast.error(getError(err));
  }
};

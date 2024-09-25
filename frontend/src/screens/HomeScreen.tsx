import { Button, InputGroup } from 'react-bootstrap';
import { useState, useReducer, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import SearchPage from '../components/SearchPage';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        student: action.payload.student,
        exists: action.payload.exists,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [idFound, setIdFound] = useState(false);
  const [id, setID] = useState('');

  let [{ loading, error, student, exists, message }, dispatch] = useReducer(
    reducer,
    {
      student: {},
      message: '',
      exists: false,
      loading: true,
      error: '',
    }
  );

  type ButtonEvent = React.MouseEvent<HTMLFormElement>;
  const submitHandler = async (e: ButtonEvent) => {
    e.preventDefault();
    // check if id exists
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      await axios.get(`/api/students/getStudent/${id}`).then((response) => {
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
        setIdFound(true);
      });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const checkinHandler = async (isCheckin: boolean) => {
    try {
      if (isCheckin === true) {
        await axios
          .post(`/api/checkin/checkin`, { studentID: student.studentID })
          .then((res) => {
            toast.success(res.data.message);
          });
      } else {
        await axios
          .post(`/api/checkin/checkout`, { studentID: student.studentID })
          .then((res) => {
            toast.success(res.data.message);
          });
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const idChangeHandler = () => {
    setIdFound(false);
  };
  useEffect(() => {}, [idFound]);

  return (
    <div className="App">
      <SearchPage title="LRNG 051N Student Check-in" altpage="admin" />
      <div>
        <Form
          className="search-box"
          autoComplete="off"
          onSubmit={submitHandler}
        >
          <InputGroup>
            <FormControl
              type="text"
              name="q"
              id="q"
              placeholder="Enter Student ID"
              aria-label="Search Student"
              onChange={(e) => {
                setID((e.target as HTMLInputElement).value);
                idChangeHandler();
              }}
            ></FormControl>
            <Button
              variant={'outline-primary'}
              disabled={!id}
              type="submit"
              id="button-search"
            >
              Continue
            </Button>
          </InputGroup>
        </Form>

        {idFound === true ? (
          <div className="center-box">
            <div className="search-result">ID: {student.studentID}</div>
            <div className="search-result">
              First Name: {student.firstname}{' '}
            </div>
            <div className="search-result last-item">
              Last Name: {student.lastname}{' '}
            </div>
            <Button variant="standard" onClick={() => checkinHandler(true)}>
              Check-in
            </Button>
            <Button variant="standard" onClick={() => checkinHandler(false)}>
              Check-out
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;

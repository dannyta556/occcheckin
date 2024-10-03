import { Button, InputGroup } from 'react-bootstrap';
import { useState, useReducer } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import SearchPage from '../components/SearchPage';
import { toast } from 'react-toastify';
import {
  getError,
  checkID,
  createReducer,
  ButtonEvent,
  handleApiRequest,
} from '../utils';
import axios from 'axios';

const checkinReducer = createReducer();

function HomeScreen() {
  const [idFound, setIdFound] = useState(false);
  const [id, setID] = useState('');

  let [{ student }, dispatch] = useReducer(checkinReducer, {
    student: {},
  });

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
      dispatch({ type: 'FETCH_FAIL', payload: err });
      toast.error(getError(err));
    }
  };

  const checkinHandler = async (isCheckin: boolean) => {
    if (isCheckin) {
      handleApiRequest('post', '/api/checkin/checkin', {
        studentID: student.studentID,
      });
    } else {
      handleApiRequest('post', '/api/checkin/checkout', {
        studentID: student.studentID,
      });
    }
    setID('');
    setIdFound(false);
  };

  const idChangeHandler = () => {
    setIdFound(false);
  };

  return (
    <div className="App">
      <SearchPage title="LRNG 051N Student Check-in" altpage="login" />
      <div>
        <Form
          className="search-box center-box-container"
          autoComplete="off"
          onSubmit={submitHandler}
        >
          <InputGroup>
            <FormControl
              type="text"
              name="q"
              id="q"
              placeholder="Enter Student ID"
              className="form-search"
              aria-label="Search Student"
              maxLength={9}
              value={id}
              onChange={(e) => {
                setID((e.target as HTMLInputElement).value);
                idChangeHandler();
              }}
            ></FormControl>
            <Button
              variant={'outline-primary'}
              disabled={!checkID(id)}
              className="bold-text"
              type="submit"
              id="button-search"
            >
              Continue
            </Button>
          </InputGroup>
        </Form>

        {idFound === true ? (
          <div className="center-box">
            <div className="search-result">
              <span className="bold-text">ID: </span>
              {student.studentID}
            </div>
            <div className="search-result">
              <span className="bold-text"> First Name: </span>
              {student.firstname}{' '}
            </div>
            <div className="search-result last-item">
              <span className="bold-text">Last Name: </span>
              {student.lastname}{' '}
            </div>
            <div>
              <Button variant="standard" onClick={() => checkinHandler(true)}>
                Check-in
              </Button>
              <div className="divider" />
              <Button variant="standard" onClick={() => checkinHandler(false)}>
                Check-out
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;

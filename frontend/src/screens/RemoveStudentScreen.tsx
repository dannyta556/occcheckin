import SearchPage from '../components/SearchPage';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { useState, useReducer } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  getError,
  checkID,
  ButtonEvent,
  createReducer,
  handleChange,
  handleApiRequest,
} from '../utils';

const removeStudentReducer = createReducer();

function RemoveStudent() {
  const [id, setID] = useState('');
  const [idFound, setIdFound] = useState(false);
  const [semester, setSemester] = useState('');
  const [enrolled, setEnrolled] = useState([]);

  let [{ student }, dispatch] = useReducer(removeStudentReducer, {
    student: {},
  });

  const searchHandler = async (e: ButtonEvent) => {
    e.preventDefault();
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      await axios.get(`/api/students/getStudent/${id}`).then((res) => {
        setEnrolled(res.data.student.enrolled);
        setSemester(res.data.student.enrolled[0]);
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
        setIdFound(true);
      });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const submitHandler = async () => {
    // check if id exists
    handleApiRequest('put', '/api/students/removeStudent', { studentID: id });
    idChangeHandler();
    setID('');
  };

  const removeSemesterHandler = async () => {
    handleApiRequest('put', '/api/students/removeSemester', {
      studentID: id,
      semester: semester,
    });
    idChangeHandler();
    setID('');
  };

  const idChangeHandler = () => {
    setIdFound(false);
  };

  return (
    <div className="App">
      <SearchPage title="Admin Remove Student" altpage="admin" />

      <div>
        <Form
          className="search-box"
          autoComplete="off"
          onSubmit={searchHandler}
        >
          <InputGroup className="center-box-container ">
            <FormControl
              type="text"
              name="q"
              id="q"
              className="form-search"
              placeholder="Enter Student ID"
              aria-label="Search Student"
              value={id}
              maxLength={9}
              onChange={(e) => {
                setID((e.target as HTMLInputElement).value);
                idChangeHandler();
              }}
            ></FormControl>
            <Button
              variant="outline-primary"
              type="submit"
              id="button-search"
              disabled={!checkID(id)}
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
              <span className="bold-text">First Name: </span>
              {student.firstname}
            </div>
            <div className="search-result">
              <span className="bold-text">Last Name: </span>
              {student.lastname}
            </div>
            <div className="border-box center-box">
              <div className="bold-text last-item">Select Semester</div>
              <select
                className="dropdown"
                value={semester}
                onChange={handleChange(setSemester)}
              >
                {enrolled.map((semester: any) => {
                  return (
                    <option key={semester} className="center-text">
                      {semester}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <Button
                variant={!checkID(id) ? 'disabled' : 'standard'}
                onClick={submitHandler}
                type="submit"
              >
                Delete Student
              </Button>
              <div className="divider" />
              <Button
                variant={!checkID(id) ? 'disabled' : 'standard'}
                onClick={removeSemesterHandler}
              >
                Delete Semester
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
export default RemoveStudent;

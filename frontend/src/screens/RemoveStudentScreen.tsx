import SearchPage from '../components/SearchPage';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { useState, useReducer } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError, checkID } from '../utils';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        student: action.payload.student,
      };
    case 'FETCH_FAIL':
      return { ...state };
    default:
      return state;
  }
};

function RemoveStudent() {
  const [id, setID] = useState('');
  const [idFound, setIdFound] = useState(false);
  const [semester, setSemester] = useState('');
  const [enrolled, setEnrolled] = useState([]);

  let [{ student }, dispatch] = useReducer(reducer, {
    student: {},
  });

  type ButtonEvent = React.MouseEvent<HTMLFormElement>;

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
    try {
      await axios
        .put('/api/students/removeStudent', {
          studentID: id,
        })
        .then((response) => {
          toast.success(response.data.message);
        });
      idChangeHandler();
    } catch (err) {
      toast.error(getError(err));
    }
    setID('');
  };

  const removeSemesterHandler = async () => {
    try {
      await axios
        .put('/api/students/removeSemester', {
          studentID: id,
          semester: semester,
        })
        .then((res) => {
          toast.success(res.data.message);
        });
      idChangeHandler();
    } catch (err) {
      toast.error(getError(err));
    }
    setID('');
  };

  const idChangeHandler = () => {
    setIdFound(false);
  };

  const handleSemester = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemester(e.target.value);
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
                onChange={handleSemester}
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

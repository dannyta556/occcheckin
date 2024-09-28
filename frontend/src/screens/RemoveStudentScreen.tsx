import SearchPage from '../components/SearchPage';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { useState, useReducer } from 'react';
import { Button, InputGroup, ListGroup } from 'react-bootstrap';
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
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function RemoveStudent() {
  const [id, setID] = useState('');
  const [idFound, setIdFound] = useState(false);
  const [semester, setSemester] = useState('');
  const [enrolled, setEnrolled] = useState([]);

  let [{ loading, error, student }, dispatch] = useReducer(reducer, {
    student: {},
    loading: true,
    error: '',
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
          <InputGroup>
            <FormControl
              type="text"
              name="q"
              id="q"
              placeholder="Enter Student ID"
              aria-label="Search Student"
              value={id}
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
            <div className="search-result">ID: {student.studentID}</div>
            <div className="search-result">First Name: {student.firstname}</div>
            <div className="search-result">Last Name: {student.lastname}</div>
            <div className="border-box center-box">
              <select value={semester} onChange={handleSemester}>
                {student.enrolled.map((semester: any) => {
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

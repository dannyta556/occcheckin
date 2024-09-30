import { useState } from 'react';
import SearchPage from '../components/SearchPage';
import { useParams } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError, setUpYears, checkID } from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

// Intialize Years
const thisYear = new Date().getFullYear();
const years = setUpYears();

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        courses: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function EditStudentScreen() {
  const params = useParams();
  const { studentID } = params;

  const [id, setID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [level, setLevel] = useState('');
  const [season, setSeason] = useState('Spring');
  const [year, setYear] = useState(thisYear.toString());
  const [semesters, setSemesters] = useState([]);

  let [{ loading, error, courses }, dispatch] = useReducer(reducer, {
    courses: [],
    loading: true,
    error: '',
  });
  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      await axios
        .get(`/api/checkin/getStudentInfo/${studentID}`)
        .then((response) => {
          setID(response.data.studentInfo.studentID);
          setFirstName(response.data.studentInfo.firstname);
          setLastName(response.data.studentInfo.lastname);
          setLevel(response.data.studentInfo.mathlvl);
          setSemesters(response.data.studentInfo.enrolled);
        });
      const result = await axios.get(`/api/courses/getCourseList`);
      dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: err });
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    fetchData();
  }, [studentID]);

  const handleMathLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value);
  };
  const handleSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeason(e.target.value);
  };
  const handleYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };
  type ButtonEvent = React.MouseEvent<HTMLFormElement>;

  const submitHandler = async (e: ButtonEvent) => {
    e.preventDefault();
    try {
      await axios
        .post('/api/students/updateStudent', {
          firstname: firstName,
          lastname: lastName,
          studentID: studentID,
          mathlvl: level,
          type: false,
        })
        .then((res) => {
          toast.success(res.data.message);
          fetchData();
        });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const addSemesterHandler = async () => {
    try {
      await axios
        .post('/api/students/updateStudent', {
          studentID: studentID,
          enrolled: season + ' ' + year,
          type: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          fetchData();
        });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return loading ? (
    <div>
      <SearchPage title="Loading Student" altpage="admin" />
      <LoadingBox />
    </div>
  ) : error ? (
    <div>
      <SearchPage title="Error" altpage="admin" />
      <MessageBox variant="danger">{error}</MessageBox>
    </div>
  ) : (
    <div className="App">
      <SearchPage title="Admin Edit Student" altpage="admin" />
      <div className="center-box center-box-container">
        <div className="content">
          <Form className="" onSubmit={submitHandler}>
            <Form.Group className="mb-3 field-item" controlId="formID">
              <Form.Label>Student ID</Form.Label>
              <div className="divider" />
              <Form.Control
                type="text"
                placeholder="Enter Student ID"
                readOnly={true}
                value={id}
                onChange={(e) => setID((e.target as HTMLInputElement).value)}
                maxLength={9}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <div className="divider" />
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) =>
                  setFirstName((e.target as HTMLInputElement).value)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <div className="divider" />
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) =>
                  setLastName((e.target as HTMLInputElement).value)
                }
              />
            </Form.Group>
            <Form.Group className="center-box-container" controlId="formLevel">
              <Form.Select
                className="dropdown"
                value={level}
                onChange={handleMathLevel}
              >
                {courses.map((course: any) => {
                  return (
                    <option key={course._id} value={course.name}>
                      {course.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formSemester">
              <Form.Select className="dropdown" onChange={handleSeason}>
                <option>Spring</option>
                <option>Summer</option>
                <option>Fall</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formYear">
              <Form.Select
                className="dropdown"
                value={year}
                onChange={handleYear}
              >
                {years.map((year) => {
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <div>
              <Button variant="standard-resize" onClick={addSemesterHandler}>
                Add Semester
              </Button>
            </div>
            <div className="border-box center-box">
              <ListGroup>
                {semesters.map((semester) => {
                  return (
                    <ListGroup.Item key={semester} className="center-text">
                      {semester}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>
            <div>
              <Button
                variant={
                  !checkID(id) || !firstName || !lastName
                    ? 'disabled'
                    : 'standard'
                }
                type="submit"
                disabled={!checkID(id) || !firstName || !lastName}
              >
                Submit
              </Button>
              <div className="divider" />
              <a className="large-text" href={`/admin/student/${studentID}`}>
                Return
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default EditStudentScreen;

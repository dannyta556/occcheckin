import { useState } from 'react';
import SearchPage from '../components/SearchPage';
import { useParams } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

// Intialize Years
const thisYear = new Date().getFullYear();
let years: number[] = [];
let earlierYears = Array.from(
  new Array(3),
  (val, index) => thisYear - index - 1
);
earlierYears = earlierYears.reverse();
let laterYears = Array.from(new Array(5), (val, index) => index + thisYear);
years.push(...earlierYears);
years.push(...laterYears);

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
  const [season, setSeason] = useState('');
  const [year, setYear] = useState(thisYear.toString());
  const [semesters, setSemesters] = useState([]);

  let [{ loading, error, courses }, dispatch] = useReducer(reducer, {
    courses: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
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
            setSeason(response.data.studentInfo.setSeason);
            setSemesters(response.data.studentInfo.enrolled);
          });
        const result = await axios.get(`/api/courses/getCourseList`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
        toast.error(getError(err));
      }
    };
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
          studentID: id,
          mathlvl: level,
        })
        .then((res) => {
          toast.success(res.data.message);
        });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const addSemesterHandler = async (e: ButtonEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/students/addStudent', {});
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return loading ? (
    <div>
      <SearchPage title="Loading Student" altpage="admin" />
    </div>
  ) : error ? (
    <div>
      <SearchPage title="Error" altpage="admin" />
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
            <Form.Group className="mb-3 field-item" controlId="formLevel">
              <Form.Select className="dropdown" onChange={handleMathLevel}>
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
              <Form.Select className="dropdown" onChange={handleYear}>
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
              <Button variant="standard-resize">Add Semester</Button>
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
              <Button variant="standard" type="submit">
                Submit
              </Button>
              <div className="divider" />
              <a className="large-text" href={`/admin/student/${studentID}`}>
                Cancel
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default EditStudentScreen;

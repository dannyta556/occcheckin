import { useState, useEffect, useReducer } from 'react';
import SearchPage from '../components/SearchPage';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, courses: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

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

function AddStudentScreen() {
  const [id, setID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [level, setLevel] = useState('Math 100');
  const [season, setSeason] = useState('Spring');
  const [year, setYear] = useState(thisYear.toString());

  const [{ loading, error, courses }, dispatch] = useReducer(reducer, {
    courses: [],
    loading: true,
    error: '',
  });
  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const result = await axios.get(`/api/courses/getCourseList`);
      dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: err });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleMathLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
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
    /*
    console.log(
      id +
        ' ' +
        firstName +
        ' ' +
        lastName +
        ' ' +
        level +
        ' ' +
        season +
        ' ' +
        year
    );
    */
    // check if id exists
    const response: any = await axios
      .post('/api/students/addStudent', {
        firstname: firstName,
        lastname: lastName,
        studentID: id,
        enrolled: season + ' ' + year,
        mathlvl: level,
      })
      .catch((err) => {
        console.log(err);
      });
    if (response.data.success === true) {
      console.log('Success');
    } else {
      console.log('Fail');
    }
  };

  return (
    <div className="App">
      <SearchPage title="Admin Add Student" altpage="admin" />
      <div className="center-box center-box-container">
        <div className="content">
          <Form className="" onSubmit={submitHandler}>
            <Form.Group className="mb-3 field-item" controlId="formID">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Student ID"
                onChange={(e) => setID((e.target as HTMLInputElement).value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                onChange={(e) =>
                  setFirstName((e.target as HTMLInputElement).value)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
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
              <Form.Select
                className="dropdown"
                value={thisYear}
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
            <Button
              variant={!id || !firstName || !lastName ? 'disabled' : 'standard'}
              type="submit"
              disabled={!id || !firstName || !lastName}
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddStudentScreen;

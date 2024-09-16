import { useState } from 'react';
import SearchPage from '../components/SearchPage';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';

const courseList = [
  'Math 100',
  'Math 104',
  'Math 115',
  'Math 120',
  'Math 140',
  'Math 170',
  'Math 180',
  'Math 185',
  'Math 280',
  'Math 285',
];
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
  const getInitialState = () => {
    const value = 'Choose a Math Level';
    return value;
  };

  const [level, setLevel] = useState(getInitialState);

  const handleMathLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value);
  };
  type ButtonEvent = React.MouseEvent<HTMLFormElement>;

  const submitHandler = (e: ButtonEvent) => {
    e.preventDefault();
    // check if id exists
    let exists = false;
    if (exists) {
      // show check-in and check-out buttons
    } else {
      // show error
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
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter First Name" />
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Last Name" />
            </Form.Group>
            <Form.Group
              className="mb-3 field-item"
              controlId="formLevel"
              onChange={handleMathLevel}
            >
              <Form.Select className="dropdown">
                {courseList.map((course) => {
                  return (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formSemester">
              <Form.Select className="dropdown">
                <option>Spring</option>
                <option>Summer</option>
                <option>Fall</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formYear">
              <Form.Select className="dropdown">
                {years.map((year) => {
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Button variant="standard" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddStudentScreen;

import { useState } from 'react';
import SearchPage from '../components/SearchPage';
import Form from 'react-bootstrap/Form';
import { Button, ListGroup } from 'react-bootstrap';

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
const sampleStudent = {
  FirstName: 'John',
  LastName: 'Doe',
  id: 'C01238912',
};

const sampleSemesters = ['Fall 2024', 'Spring 2023'];

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

function EditStudentScreen() {
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
      <SearchPage title="Admin Edit Student" altpage="admin" />
      <div className="center-box center-box-container">
        <div className="content">
          <Form className="" onSubmit={submitHandler}>
            <Form.Group className="mb-3 field-item" controlId="formID">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Student ID"
                value={sampleStudent.id}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                value={sampleStudent.FirstName}
              />
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                value={sampleStudent.LastName}
              />
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
            <div>
              <Button variant="primary">Add Semester</Button>
            </div>
            <div className="border-box center-box">
              <ListGroup>
                {sampleSemesters.map((semester) => {
                  return (
                    <ListGroup.Item key={semester} className="center-text">
                      {semester}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>

            <Button variant="standard" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default EditStudentScreen;

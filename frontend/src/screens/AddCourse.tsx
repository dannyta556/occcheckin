import SearchPage from '../components/SearchPage';
import { ListGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Button, InputGroup } from 'react-bootstrap';

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
function AddCourseScreen() {
  // useEffect pull courseList on page load and update
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
    <div className="center-box">
      <SearchPage title="Course List" altpage="admin" />

      <ListGroup className="center-box border-box">
        {courseList.map((course) => {
          return (
            <ListGroup.Item key={course} className="center-text">
              {course}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <Form className="pad-top-lg" onSubmit={submitHandler}>
        <InputGroup className="center-box">
          <FormControl
            className="input-box"
            type="text"
            name="q"
            id="q"
            placeholder="Enter Course"
            aria-label="Search Student"
          ></FormControl>
          <Button variant="outline-primary" type="submit" id="button-search">
            Add
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default AddCourseScreen;

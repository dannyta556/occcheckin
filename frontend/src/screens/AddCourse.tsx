import SearchPage from '../components/SearchPage';
import { useState, useEffect, useReducer } from 'react';
import { ListGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';
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

function AddCourseScreen() {
  const [newCourse, setNewCourse] = useState('');

  // useEffect pull courseList on page load and update
  type ButtonEvent = React.MouseEvent<HTMLFormElement>;
  const submitHandler = async (e: ButtonEvent) => {
    e.preventDefault();
    // check if id exists
    try {
      await axios
        .post(`/api/courses/addCourse`, {
          name: newCourse.charAt(0).toUpperCase() + newCourse.slice(1),
        })
        .then((res) => {
          toast.success(res.data.message);
          fetchData();
        });
    } catch (err) {
      toast.error(getError(err));
    }
  };
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
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <div>
      <SearchPage title="Course List" altpage="admin" />
    </div>
  ) : error ? (
    <div>
      <SearchPage title="Course List" altpage="admin" />
    </div>
  ) : (
    <div className="center-box">
      <SearchPage title="Course List" altpage="admin" />

      <ListGroup className="center-box border-box">
        {courses.map((course: any) => {
          return (
            <ListGroup.Item key={course._id} className="center-text">
              {course.name}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <Form className="pad-top-lg" autoComplete="off" onSubmit={submitHandler}>
        <InputGroup
          className=""
          onChange={(e) => setNewCourse((e.target as HTMLInputElement).value)}
        >
          <FormControl
            className="input-box"
            type="text"
            name="q"
            id="q"
            placeholder="Enter Course"
            aria-label="Search Student"
          ></FormControl>
          <Button
            variant="outline-primary"
            disabled={!newCourse}
            type="submit"
            id="button-search"
          >
            Add
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default AddCourseScreen;

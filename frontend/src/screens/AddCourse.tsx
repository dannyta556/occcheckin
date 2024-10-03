import SearchPage from '../components/SearchPage';
import { useState, useEffect, useReducer } from 'react';
import { ListGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  getError,
  createReducer,
  ButtonEvent,
  handleApiRequest,
} from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const addCourseReducer = createReducer();

function AddCourseScreen() {
  const [newCourse, setNewCourse] = useState('');
  const [{ loading, error, courses }, dispatch] = useReducer(addCourseReducer, {
    courses: [],
    loading: true,
    error: '',
  });

  const submitHandler = async (e: ButtonEvent) => {
    e.preventDefault();
    // check if id exists
    handleApiRequest(
      'post',
      '/api/courses/addCourse',
      {
        name: newCourse.charAt(0).toUpperCase() + newCourse.slice(1),
      },
      fetchData
    );
  };
  const deleteCourseHandler = async (course: string) => {
    handleApiRequest(
      'put',
      '/api/courses/deleteCourse',
      { name: course },
      fetchData
    );
  };

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
  // useEffect pull courseList on page load and update
  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <div>
      <SearchPage title="Course List" altpage="admin" />
      <LoadingBox />
    </div>
  ) : error ? (
    <div>
      <SearchPage title="Course List" altpage="admin" />
      <MessageBox variant="danger">{error}</MessageBox>
    </div>
  ) : (
    <div className="center-box">
      <SearchPage title="Course List" altpage="admin" />

      <ListGroup className="center-box border-box">
        {courses.map((course: any) => {
          return (
            <ListGroup.Item key={course._id} className="center-text">
              <span className="center-text border-item">{course.name}</span>
              <button
                className="delete-btn"
                onClick={() => deleteCourseHandler(course.name)}
              >
                delete
              </button>
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
            className="input-box form-search"
            type="text"
            name="q"
            id="q"
            placeholder="Enter Course"
            aria-label="Search Student"
          ></FormControl>
          <Button
            variant="outline-primary"
            className="bold-text"
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

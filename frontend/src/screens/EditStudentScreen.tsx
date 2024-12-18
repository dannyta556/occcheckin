import { useState } from 'react';
import SearchPage from '../components/SearchPage';
import { useParams } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  getError,
  setUpYears,
  checkID,
  createReducer,
  ButtonEvent,
  handleChange,
  handleApiRequest,
} from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

// Intialize Years
const thisYear = new Date().getFullYear();
const years = setUpYears();

const editStudentReducer = createReducer();

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

  let [{ loading, error, courses }, dispatch] = useReducer(editStudentReducer, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentID]);

  const submitHandler = async (e: ButtonEvent) => {
    e.preventDefault();
    handleApiRequest(
      'post',
      '/api/students/updateStudent',
      {
        firstname: firstName,
        lastname: lastName,
        studentID: studentID,
        mathlvl: level,
        type: false,
      },
      fetchData
    );
  };

  const addSemesterHandler = async () => {
    handleApiRequest(
      'post',
      '/api/students/updateStudent',
      {
        studentID: studentID,
        enrolled: season + ' ' + year,
        type: true,
      },
      fetchData
    );
  };

  const deleteSemesterHandler = async (semester: string) => {
    handleApiRequest(
      'put',
      '/api/students/removeSemester',
      {
        studentID: studentID,
        semester: semester,
      },
      fetchData
    );
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
                className={
                  id.length === 0 || (id.length > 0 && checkID(id))
                    ? `form-input`
                    : 'form-input  form-false'
                }
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
                className="form-input"
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
                className="form-input"
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
                onChange={handleChange(setLevel)}
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
              <Form.Select
                className="dropdown"
                onChange={handleChange(setSeason)}
              >
                <option>Spring</option>
                <option>Summer</option>
                <option>Fall</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 field-item" controlId="formYear">
              <Form.Select
                className="dropdown"
                value={year}
                onChange={handleChange(setYear)}
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
            <div>
              <ListGroup className="border-box center-box">
                {semesters.map((semester, i) => {
                  return (
                    <ListGroup.Item key={semester}>
                      <span className="center-text border-item">
                        {semester}
                      </span>
                      <button
                        className="delete-btn"
                        onClick={() => deleteSemesterHandler(semester)}
                      >
                        delete
                      </button>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>
            <div className="last-item">
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

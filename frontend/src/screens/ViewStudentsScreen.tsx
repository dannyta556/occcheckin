import SearchPage from '../components/SearchPage';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        students: action.payload.studentList,
        semesters: action.payload.semesterList[0].uniqueEnrolled,
        studentTotalHrs: action.payload.studentTotalHrs,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ViewStudentsScreen() {
  const [semester, setSemester] = useState('');
  const [{ loading, error, students, semesters, studentTotalHrs }, dispatch] =
    useReducer(reducer, {
      students: [],
      semesters: [],
      studentTotalHrs: [],
      loading: true,
      error: '',
    });

  type Student = {
    firstname: string;
    lastname: string;
    studentID: string;
    mathlvl: string;
    totalHrs: string;
  };
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `/api/students/getStudentList?semester=${semester}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        console.log(result.data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, [semester]);

  const handleSemester = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemester(e.target.value);
  };
  return loading ? (
    <div>
      <SearchPage title="ViewStudents" altpage="admin" />
    </div>
  ) : error ? (
    <div>
      <SearchPage title="ViewStudents" altpage="admin" />
    </div>
  ) : (
    <>
      <SearchPage title="View Students" altpage="admin" />
      <div className="center-content">
        <div className="table-options">
          <select id="semester" value={semester} onChange={handleSemester}>
            <option value={''}>All</option>
            {semesters.map((semester: string) => {
              return (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              );
            })}
          </select>
          <Button className="align-item-right btn-export">Export</Button>
        </div>

        <Table className="student-table">
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>id</th>
              <th>Math Level</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: Student) => {
              return (
                <tr key={student.studentID}>
                  <td>{student.lastname}</td>
                  <td>{student.firstname}</td>
                  <td>
                    <Link to={`/admin/student/${student.studentID}`}>
                      {student.studentID}
                    </Link>
                  </td>
                  <td>{student.mathlvl}</td>
                  <td>{studentTotalHrs[student.studentID]}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default ViewStudentsScreen;

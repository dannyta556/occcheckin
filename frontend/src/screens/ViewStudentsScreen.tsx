import SearchPage from '../components/SearchPage';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useState, useEffect, useReducer } from 'react';
import { createReducer, handleChange } from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

type Student = {
  firstname: string;
  lastname: string;
  studentID: string;
  mathlvl: string;
  totalHrs: string;
};

const viewStudentsReducer = createReducer();

function ViewStudentsScreen() {
  const [semester, setSemester] = useState('');
  const [{ loading, error, students, semesters, studentTotalHrs }, dispatch] =
    useReducer(viewStudentsReducer, {
      students: [],
      semesters: [],
      studentTotalHrs: {},
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        await axios
          .get(`/api/students/getStudentList?semester=${semester}`)
          .then((res) => {
            dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
          });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, [semester]);

  const exportStudents = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    students.forEach(function (rowArray: Student) {
      let row =
        rowArray.lastname +
        ',' +
        rowArray.firstname +
        ',' +
        rowArray.studentID +
        ',' +
        rowArray.mathlvl +
        ',' +
        studentTotalHrs[rowArray.studentID] +
        '\r\n';
      csvContent += row;
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    if (link.download !== undefined) {
      link.setAttribute('href', encodedUri);
      let semesterName = `${semester}` !== '' ? `${semester}` : 'All';
      link.setAttribute('download', `student_data_${semesterName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return loading ? (
    <div>
      <SearchPage title="ViewStudents" altpage="admin" />
      <LoadingBox />
    </div>
  ) : error ? (
    <div>
      <SearchPage title="ViewStudents" altpage="admin" />
      <MessageBox variant="danger">{error}</MessageBox>
    </div>
  ) : (
    <>
      <SearchPage title="View Students" altpage="admin" />
      <div className="last-item">
        <div className="table-options center-content">
          <select
            className="dropdown"
            id="semester"
            value={semester}
            onChange={handleChange(setSemester)}
          >
            <option value={''}>All</option>
            {semesters.map((semester: string) => {
              return (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              );
            })}
          </select>
          <Button
            className="align-item-right btn-export bold-text"
            onClick={exportStudents}
          >
            Export
          </Button>
        </div>
        <Table className="student-table center-text">
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

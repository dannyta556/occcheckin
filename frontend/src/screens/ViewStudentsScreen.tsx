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

  const exportStudents = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    console.log(students);
    students.forEach(function (rowArray: any) {
      console.log(rowArray.lastname);
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
          <select
            className="dropdown"
            id="semester"
            value={semester}
            onChange={handleSemester}
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
            className="align-item-right btn-export"
            onClick={exportStudents}
          >
            Export
          </Button>
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

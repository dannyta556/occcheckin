import SearchPage from '../components/SearchPage';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const exampleStudentList = [
  {
    LastName: 'Doe',
    FirstName: 'John',
    id: 'C012839231',
    MathLvl: 'Math 185',
    TotalHrs: '40 hrs 32 min',
  },
  {
    LastName: 'James',
    FirstName: 'Mary',
    id: 'C23489134',
    MathLvl: 'Math 120',
    TotalHrs: '8 hrs 24 min',
  },
  {
    LastName: 'Korpela',
    FirstName: 'Jukka',
    id: 'C21482344',
    MathLvl: 'Math 170',
    TotalHrs: '13 hrs 12 min',
  },
  {
    LastName: 'Balan',
    FirstName: 'Pranav',
    id: 'C23894135',
    MathLvl: 'Math 120',
    TotalHrs: '2 hrs 7 min',
  },
];

const semesters = ['Fall 2024', 'Spring 2023', 'Fall 2023'];

function ViewStudentsScreen() {
  return (
    <div>
      <SearchPage title="View Students" altpage="admin" />
      <div className="center-content">
        <div className="table-options">
          <select name="fall 2024" id="semester">
            {semesters.map((semester) => {
              return (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              );
            })}
          </select>
          <Button className="align-item-right btn-export">Export</Button>
        </div>

        <Table className="student-table" striped bordered hover>
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
            {exampleStudentList.map((student) => {
              return (
                <tr key={student.id}>
                  <td>{student.LastName}</td>
                  <td>{student.FirstName}</td>
                  <td>
                    <Link to={`/admin/student/${student.id}`}>
                      {student.id}
                    </Link>
                  </td>
                  <td>{student.MathLvl}</td>
                  <td>{student.TotalHrs}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ViewStudentsScreen;

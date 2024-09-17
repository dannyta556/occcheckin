import SearchPage from '../components/SearchPage';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

const exampleInfo = {
  id: 'C012839231',
  MathLvl: 'Math 160',
};
const exampleCheckins = [
  {
    id: 1,
    date: '08-18-2024',
    semester: 'Fall 2024',
    checkin: '08:24',
    checkout: '12:24',
    total: '4:00',
  },
  {
    id: 2,
    date: '08-17-2024',
    semester: 'Fall 2024',
    checkin: '13:30',
    checkout: '16:00',
    total: '2:30',
  },
];

function StudentScreen() {
  return (
    <div className="center-text center-content">
      <SearchPage title="Student" altpage="admin" />
      <Link to="/editStudent">Edit Info</Link>
      <div>ID: {exampleInfo.id}</div>
      <div>Math Level: {exampleInfo.MathLvl}</div>

      <Table className="student-table center-box-container">
        <thead>
          <tr>
            <th>Date</th>
            <th>Semester</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {exampleCheckins.map((checkin) => {
            return (
              <tr key={checkin.id}>
                <td>{checkin.date}</td>
                <td>{checkin.semester}</td>
                <td>{checkin.checkin}</td>
                <td>{checkin.checkout}</td>
                <td>{checkin.total}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default StudentScreen;

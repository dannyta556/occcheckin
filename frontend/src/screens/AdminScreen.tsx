import { Button } from 'react-bootstrap';
import SearchPage from '../components/SearchPage';
import { Link } from 'react-router-dom';

function AdminScreen() {
  return (
    <div className="center-box">
      <SearchPage title="Admin" altpage="home" />
      <div>
        <div className="center-box-container">
          <Link to="/admin/addStudent">
            <Button variant="standard">Add Student</Button>
          </Link>
        </div>
        <div className="center-box-container">
          <Link to="/admin/removeStudent">
            <Button variant="standard">Remove Student</Button>
          </Link>
        </div>
        <div className="center-box-container">
          <Link to="/admin/viewStudents">
            <Button variant="standard">View Students</Button>
          </Link>
        </div>
        <div className="center-box-container">
          <Link to="/admin/addCourse">
            <Button variant="standard">Add Course</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminScreen;

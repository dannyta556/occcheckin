import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import { Container } from 'react-bootstrap';
import './App.css';
import AdminScreen from './screens/AdminScreen';
import AddStudentScreen from './screens/AddStudentScreen';
import RemoveStudentScreen from './screens/RemoveStudentScreen';
import ViewStudentsScreen from './screens/ViewStudentsScreen';
import AddCourseScreen from './screens/AddCourse';
import SuccessScreen from './screens/SuccessScreen';
import StudentScreen from './screens/StudentScreen';
import EditStudentScreen from './screens/EditStudentScreen';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/success" element={<SuccessScreen />} />
              <Route path="/admin" element={<AdminScreen />} />
              <Route path="/admin/addStudent" element={<AddStudentScreen />} />
              <Route
                path="/admin/student/:studentID"
                element={<StudentScreen />}
              />
              <Route
                path="/admin/editStudent/:studentID"
                element={<EditStudentScreen />}
              />
              <Route
                path="/admin/removeStudent"
                element={<RemoveStudentScreen />}
              />
              <Route
                path="/admin/viewStudents"
                element={<ViewStudentsScreen />}
              />
              <Route path="/admin/addCourse" element={<AddCourseScreen />} />
            </Routes>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

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

function App() {
  return (
    <BrowserRouter>
      <div className="App"></div>
      <main>
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/success" element={<SuccessScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
            <Route path="/admin/addStudent" element={<AddStudentScreen />} />
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
    </BrowserRouter>
  );
}

export default App;

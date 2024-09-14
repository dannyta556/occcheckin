import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import { Container } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App"></div>
      <main>
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
}

export default App;

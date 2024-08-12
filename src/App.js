import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Modal from 'react-modal';
import NavBar from './NavBar';
import CalenderPage from './pages/CalenderPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';

Modal.setAppElement('#root');

function App() {
  
  return (
    <BrowserRouter>
      <div className="App">
      {/* <NavBar /> */}
        <div id="page-body">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calendar" element={<CalenderPage />}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
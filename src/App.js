import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import CajeroPanel from './Components/Cajero/CajeroPanel';
import AlmacenistaPanel from './Components/Almacenista/AlmacenistaPanel';
import JardineroPanel from './Components/Jardinero/JardineroPanel';
import './App.css';
/*
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Cajero" element={<CajeroPanel />} />
        <Route path="/Almacenista" element={<AlmacenistaPanel />} />
        <Route path="/Jardinero" element={<JardineroPanel />} />
      </Routes>
    </Router>
  );
}
  */
function App() {
  return (
    <div className="App">
     
      <JardineroPanel />
    </div>
  );
}

export default App;
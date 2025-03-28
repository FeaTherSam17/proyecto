import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import Jardinero from './Components/Jardinero/JardineroPanel';
import './App.css';
import CajeroPanel from './Components/Cajero/CajeroPanel';
import AlmacenistaPanel from './Components/Almacenista/AlmacenistaPanel';
/*
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}*/

function App() {
  return (
    <div className="App">
      {/* Otros componentes que ya tengas */}
      <AlmacenistaPanel />
    </div>
  );
}


export default App;
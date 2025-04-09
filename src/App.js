import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import CajeroPanel from './Components/Cajero/CajeroPanel';
import AlmacenistaPanel from './Components/Almacenista/AlmacenistaPanel';
import JardineroPanel from './Components/Jardinero/JardineroPanel';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("Usuario en ProtectedRoute:", user?.username, "Rol:", user?.role); // Debug
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace state={{ error: 'No tienes permisos' }} />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/AdminDashboard" 
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Almacenista" 
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <AlmacenistaPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Cajero" 
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <CajeroPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Jardinero" 
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <JardineroPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
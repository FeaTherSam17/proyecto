import { Routes, Route } from 'react-router-dom';
import Login from '../Login/Login';
import AdminDashboard from '../../Pages/AdminDashboard/AdminDashboard';
import Almacenista from '../../Pages/Almacenista/Almacenista';
import Cajero from '../../Pages/Cajero/Cajero';
import Jardinero from '../../Pages/Jardinero/Jardinero';
import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={[1]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/almacenista" element={
        <ProtectedRoute allowedRoles={[3]}>
          <Almacenista />
        </ProtectedRoute>
      } />
      
      <Route path="/cajero" element={
        <ProtectedRoute allowedRoles={[2]}>
          <Cajero />
        </ProtectedRoute>
      } />
      
      <Route path="/jardinero" element={
        <ProtectedRoute allowedRoles={[4]}>
          <Jardinero />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default AppRouter;
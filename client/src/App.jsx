import { AuthProvider } from './providers/AuthContextProvider';
import { BrowserRouter as Router, Routes, Route  } from 'react-router';
import Callback from './handlers/Callback';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import UsersList from './components/UsersList';
import UserDetail from './components/UserDetail';
import CreateUser from './components/CreateUser';
import CompaniesList from './components/CompaniesList';
import CompanyDetail from './components/CompanyDetail';
import CreateCompany from './components/CreateCompany';

// import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/callback" element={<Callback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/create" 
            element={
              <ProtectedRoute>
                <CreateUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/:id" 
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/companies" 
            element={
              <ProtectedRoute>
                <CompaniesList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/companies/create" 
            element={
              <ProtectedRoute>
                <CreateCompany />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/companies/:id" 
            element={
              <ProtectedRoute>
                <CompanyDetail />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App

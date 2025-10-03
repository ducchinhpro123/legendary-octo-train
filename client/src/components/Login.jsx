import { useAuth } from '../providers/AuthContextProvider';
import { useNavigate } from 'react-router';

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-center mb-4">Login</h1>

        <div className="d-grid gap-2">
          <button onClick={login} className="btn btn-primary">
            Login
          </button>
          <button onClick={handleRegister} className="btn btn-outline-secondary">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

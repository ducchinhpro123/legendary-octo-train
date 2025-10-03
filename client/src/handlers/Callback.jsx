import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContextProvider';

const Callback = () => {
  const { handleLoginCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleLoginCallback();
        // Redirect to home after successful login
        navigate('/');
      } catch (error) {
        console.error('Error handling callback', error);
        navigate('/login');
      }
    };

    processCallback();
  }, [handleLoginCallback, navigate]);

  return <div>Processing login...</div>;
};

export default Callback;

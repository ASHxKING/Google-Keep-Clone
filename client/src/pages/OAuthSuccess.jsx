import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (token) {
      const user = { id, name, email };
      login(user, token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Signing you in...</p>;
};

export default OAuthSuccess;
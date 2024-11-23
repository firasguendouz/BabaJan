import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const { user, token, login, logout } = useContext(AuthContext);

  const isAuthenticated = () => !!token;

  return { user, token, isAuthenticated, login, logout };
};

export default useAuth;

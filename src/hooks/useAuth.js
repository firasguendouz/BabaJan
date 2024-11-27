import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../state/userSlice'; // Import the logout action

const useAuth = () => {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    logout: handleLogout,
  };
};

export default useAuth;

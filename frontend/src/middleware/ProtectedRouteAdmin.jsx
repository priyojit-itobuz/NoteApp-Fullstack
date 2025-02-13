import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';


const ProtectedRouteAdmin = ({ children }) => {
  const { isLoggedIn,AccessToken,Role} = useContext(CreateContext);

  if (!isLoggedIn || !AccessToken || Role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRouteAdmin;

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';


const ProtectedRoute = ({ children }) => {
  const { isLoggedIn,AccessToken} = useContext(CreateContext);

  if (!isLoggedIn || !AccessToken) {
    return <Navigate to="/login" />;
  }
  

  return children;
};

export default ProtectedRoute;

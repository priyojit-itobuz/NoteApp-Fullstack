import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';


const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(CreateContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

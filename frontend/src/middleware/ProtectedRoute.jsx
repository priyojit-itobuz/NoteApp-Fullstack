// ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';


//children hocche any component jake amra render korte chai

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(CreateContext);

  if (!isLoggedIn) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

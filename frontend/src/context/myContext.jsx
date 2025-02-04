import React, { useState, createContext } from "react";

export const CreateContext = createContext();

export const CreateContextProvider = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [AccessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || '');
  const [RefreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || '');

  const LoggedIn = () => {
    setLoggedIn(true);
  };

  const Logout = () => {
    setLoggedIn(false);
    setAccessToken('');
    localStorage.removeItem("accessToken"); 
  };

  return (
    <CreateContext.Provider value={{ isLoggedIn, LoggedIn, Logout, AccessToken, setAccessToken,RefreshToken,setRefreshToken}}>
      {props.children}
    </CreateContext.Provider>
  );
};

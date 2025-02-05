import React, { useState, createContext } from "react";

export const CreateContext = createContext();

export const CreateContextProvider = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem("loginstatus") || false);
  const [AccessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || '');
  const [RefreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || '');
  const [user,setUser] = useState(localStorage.getItem("userName") || '');

  const LoggedIn = () => {
    setLoggedIn(true);
    localStorage.setItem("loginstatus", isLoggedIn);
  };

  const Logout = () => {
    setLoggedIn(false);
    setAccessToken('');
    localStorage.removeItem("accessToken"); 
  };

  return (
    <CreateContext.Provider value={{ isLoggedIn,setLoggedIn, LoggedIn, Logout, AccessToken, setAccessToken,RefreshToken,setRefreshToken,user,setUser}}>
      {props.children}
    </CreateContext.Provider>
  );
};

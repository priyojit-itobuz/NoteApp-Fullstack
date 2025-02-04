import React, { useState, createContext } from "react";

export const CreateContext = createContext();

export const CreateContextProvider = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [AccessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || '');
  const [refreshToken, setrefreshToken] = useState('');

  const LoggedIn = () => {
    setLoggedIn(true)
  };

  const setaccessLocalStorage = () => {
  }

  const getaccessLocalStorage = () => {
    return localStorage.getItem("accessToken") || "";
  }

  const Logout = () => {
    setLoggedIn(false)
  }

  return (
    <CreateContext.Provider value={{ isLoggedIn, LoggedIn, Logout, AccessToken, setAccessToken, setaccessLocalStorage, getaccessLocalStorage }}>
      {props.children}
    </CreateContext.Provider>
  );
};

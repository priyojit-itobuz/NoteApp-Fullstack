import React, { useState, createContext, useEffect } from "react";

export const CreateContext = createContext();

export const CreateContextProvider = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem("loginstatus") === "true");
  const [AccessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || '');
  const [RefreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || '');
  const [user, setUser] = useState(localStorage.getItem("userName") || '');
  const [Email, setEmail] = useState(localStorage.getItem("email") || '');
  const [profile,setProfile] = useState(localStorage.getItem("profilePic") || '');
  const [verified,isVerified] = useState(false);

  useEffect(() => {
    localStorage.setItem("loginstatus", isLoggedIn);
  }, [isLoggedIn]); // Updates localStorage whenever isLoggedIn changes

  const LoggedIn = () => {
    setLoggedIn(true);
  };

  const Logout = () => {
    setLoggedIn(false);
    setAccessToken('');
    setRefreshToken('');
    setUser('');
    setProfile('')
    localStorage.removeItem("loginstatus");
    localStorage.removeItem("accessToken"); 
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("profilePic")
  };

  return (
    <CreateContext.Provider value={{ isLoggedIn, setLoggedIn, LoggedIn, Logout, AccessToken, setAccessToken, RefreshToken, setRefreshToken, user, setUser,Email,setEmail,profile,setProfile,verified,isVerified }}>
      {props.children}
    </CreateContext.Provider>
  );
};



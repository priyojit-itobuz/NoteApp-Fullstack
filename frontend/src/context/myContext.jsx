import React, { useState, createContext, useEffect } from "react";

export const CreateContext = createContext();

export const CreateContextProvider = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem("loginstatus") === "true");
  const [AccessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || '');
  const [RefreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || '');
  const [user, setUser] = useState(localStorage.getItem("userName") || '');
  const [Email, setEmail] = useState(localStorage.getItem("email") || '');

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
    localStorage.removeItem("loginstatus");
    localStorage.removeItem("accessToken"); 
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
  };

  return (
    <CreateContext.Provider value={{ isLoggedIn, setLoggedIn, LoggedIn, Logout, AccessToken, setAccessToken, RefreshToken, setRefreshToken, user, setUser,Email,setEmail }}>
      {props.children}
    </CreateContext.Provider>
  );
};


// import React, { useState, createContext } from "react";

// export const CreateContext = createContext();

// export const CreateContextProvider = (props) => {
//   const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem("loginstatus") || false);
//   const [AccessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || '');
//   const [RefreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || '');
//   const [user,setUser] = useState(localStorage.getItem("userName") || '');

//   const LoggedIn = () => {
//     setLoggedIn(true);
//     localStorage.setItem("loginstatus", isLoggedIn);
//   };

//   const Logout = () => {
//     setLoggedIn(false);
//     setAccessToken('');
//     localStorage.removeItem("accessToken"); 
//   };

//   return (
//     <CreateContext.Provider value={{ isLoggedIn,setLoggedIn, LoggedIn, Logout, AccessToken, setAccessToken,RefreshToken,setRefreshToken,user,setUser}}>
//       {props.children}
//     </CreateContext.Provider>
//   );
// };

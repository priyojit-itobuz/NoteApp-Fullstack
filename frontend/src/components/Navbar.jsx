import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreateContext } from '../context/myContext';

export default function Navbar() {
    const [navbar, setNavbar] = useState(false);
    const { isLoggedIn, Logout, AccessToken } = useContext(CreateContext);
    
    // Persist login state using localStorage
    const [token, setToken] = useState(localStorage.getItem("accessToken") || '');

    useEffect(() => {
        if (AccessToken) {
            localStorage.setItem("accessToken", AccessToken);
            setToken(AccessToken);
        } else {
            localStorage.removeItem("accessToken");
            setToken('');
        }
    }, [AccessToken, isLoggedIn]);

    function handleLogout() {
        Logout();
        localStorage.removeItem("accessToken");
        setToken('');
    }

    return (
        <>
            <nav className="w-full">
                <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8 bg-purple-200">
                    <div>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                            <Link to="/">
                                <h2 className="text-2xl font-bold text-black">NotesApp</h2>
                            </Link>
                            <div className="md:hidden">
                                <button
                                    className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                                    onClick={() => setNavbar(!navbar)}
                                >
                                    {navbar ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 text-black"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 text-black"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Navbar Links */}
                    <div>
                        <div className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"}`}>
                            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                                <li className="text-white hover:text-indigo-200">
                                    <Link to="/" className="text-black">Home</Link>
                                </li>
                                {token && (
                                    <li className="text-white hover:text-indigo-200">
                                        <Link to="/profile" className="text-black">Profile</Link>
                                    </li>
                                )}
                            </ul>

                            {/* Mobile View: Sign In / Sign Up / Logout */}
                            {!token ? (
                                <div className="mt-3 space-y-2 md:hidden">
                                    <Link
                                        to="/login"
                                        className="inline-block w-full px-4 py-2 text-center text-white bg-gray-600 rounded-md shadow hover:bg-gray-800"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="inline-block w-full px-4 py-2 text-center text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-3 space-y-2 md:hidden">
                                    <button
                                        className="inline-block w-full px-4 py-2 text-white text-center bg-gray-600 rounded-md shadow hover:bg-gray-800"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop View: Sign In / Sign Up / Logout */}
                    {!token ? (
                        <div className="hidden space-x-2 md:inline-block">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
                            >
                                Sign up
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden space-x-2 md:inline-block">
                            <button
                                className="inline-block w-full px-4 py-2 text-white text-center bg-gray-600 rounded-md shadow hover:bg-gray-800"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}



// import React, { useContext, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';
// import { CreateContext } from '../context/myContext';

// export default function Navbar() {
//     const [navbar, setNavbar] = useState(false);
//     const { isLoggedIn,Logout ,AccessToken} = useContext(CreateContext);
//     const [token, setToken] = useState(localStorage.getItem("accessToken") || '');
//     console.log("first state", isLoggedIn);

//     console.log("Access Token:", AccessToken);

//     function handleLogout()
//     {
//         Logout()
//     }

//     useEffect(() => {
//         setToken(AccessToken); 
//     }, [AccessToken]);

    

//     return (
//         <>
//             <nav className="w-full">
//                 <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8  bg-purple-200">
//                     <div>
//                         <div className="flex items-center justify-between py-3 md:py-5 md:block">
//                             <Link to="#">
//                                 <h2 className="text-2xl font-bold text-black">NotesApp</h2>
//                             </Link>
//                             <div className="md:hidden">
//                                 <button
//                                     className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
//                                     onClick={() => setNavbar(!navbar)}
//                                 >
//                                     {navbar ? (
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="w-6 h-6 text-black"
//                                             viewBox="0 0 20 20"
//                                             fill="currentColor"
//                                         >
//                                             <path
//                                                 fillRule="evenodd"
//                                                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                                                 clipRule="evenodd"
//                                             />
//                                         </svg>
//                                     ) : (
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="w-6 h-6 text-black"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                             strokeWidth={2}
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 d="M4 6h16M4 12h16M4 18h16"
//                                             />
//                                         </svg>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <div>
//                         <div
//                             className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"
//                                 }`}
//                         >
//                             <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
//                                 <li className="text-white hover:text-indigo-200">
//                                     <Link to="#" className='text-black'>Home</Link>
//                                 </li>
//                                 <li className="text-white hover:text-indigo-200">
//                                     <Link to="#" className='text-black'>Profile</Link>
//                                 </li>
//                             </ul>
//                             {!isLoggedIn && !token ? (<div className="mt-3 space-y-2 md:hidden ">
//                                 <Link
//                                     to="/login"
//                                     className="inline-block w-full px-4 py-2 text-center text-white bg-gray-600 rounded-md shadow hover:bg-gray-800"
//                                 >
//                                     Sign in
//                                 </Link>
//                                 <Link
//                                     to="/signup"
//                                     className="inline-block w-full px-4 py-2 text-center text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
//                                 >
//                                     Sign up
//                                 </Link>
//                             </div>) : (<div className="mt-3 space-y-2 md:hidden "><Link
//                                 to="/login"
//                                 className="inline-block w-full px-4 py-2 text-center text-white bg-gray-600 rounded-md shadow hover:bg-gray-800"
//                                 onClick={handleLogout}
//                             >
//                                 Logout
//                             </Link></div>)}
//                         </div>
//                     </div>

//                     {!isLoggedIn && !token?(<div className="hidden space-x-2 md:inline-block">
//                         <Link
//                             to="/login"
//                             className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800"
//                         >
//                             Sign in
//                         </Link>
//                         <Link
//                             to="/signup"
//                             className="px-4 py-2 text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
//                         >
//                             Sign up
//                         </Link>
//                     </div>):(<div className="hidden space-x-2 md:inline-block"><Link
//                             to="/signup"
//                             className="px-4 py-2 text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
//                             onClick={handleLogout}
//                         >
//                             Logout
//                         </Link></div>)}

//                     {/* <div className="hidden space-x-2 md:inline-block">
//                         <Link
//                             to="/login"
//                             className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800"
//                         >
//                             Sign in
//                         </Link>
//                         <Link
//                             to="/signup"
//                             className="px-4 py-2 text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
//                         >
//                             Sign up
//                         </Link>
//                     </div> */}
//                 </div>
//             </nav>
//         </>
//     )
// }

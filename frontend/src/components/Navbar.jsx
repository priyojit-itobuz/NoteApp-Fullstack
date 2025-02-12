import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';



export default function Navbar() {
    const [navbar, setNavbar] = useState(false);
    const { isLoggedIn, Logout, AccessToken, setLoggedIn, user, setUser, Email, setEmail ,Role,setRole} = useContext(CreateContext);

    // Persist login state using localStorage
    const [token, setToken] = useState(localStorage.getItem("accessToken") || '');
    const navigate = useNavigate();

    useEffect(() => {
        if (AccessToken) {
            localStorage.setItem("accessToken", AccessToken);
            setToken(AccessToken);
        } else {
            localStorage.removeItem("accessToken");
            setToken('');
        }
    }, [AccessToken, isLoggedIn]);

    async function handleLogout() {
        try {
            const res = await axiosInstance.post("/logout", {}, 
            {
                // headers: { 'Authorization': `Bearer ${AccessToken}` }
            })
            if (res.data.success) {
                console.log(res.data.message)
                toast.success(res.data.message);
                Logout();
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userName");
                localStorage.removeItem("loginstatus");
                localStorage.removeItem("email");
                localStorage.removeItem("role");
                setUser('');
                setToken('');
                setEmail('');
                setRole('');
                navigate("/login")
            }
        }
        catch (error) {
            toast.error(error.response.data.message)
            console.log(error);
        }

    }

    return (
        <>
            <nav className="w-full">
                <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8 bg-purple-200">
                    <div>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                            <Link to="/">
                                <h2 className="text-2xl font-bold text-black border-0">NotesApp</h2>
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
                                {token && Role !== 'admin' &&(
                                    <li className="text-white hover:text-indigo-200">
                                        <Link to="/notes" className="text-black">My Notes</Link>
                                    </li>
                                )}
                                {token && (Role === 'user' ?
                                (
                                    <li className="text-white hover:text-indigo-200">
                                        <Link to="/profile" className="text-black">Profile</Link>
                                    </li>
                                )
                                :
                                (<li className="text-white hover:text-indigo-200">
                                    <Link to="/admin/profile" className="text-black">Profile</Link>
                                </li>)
                                )}


                                {token && Role === 'admin'&&(
                                    <li className="text-white hover:text-indigo-200">
                                        <Link to="/admin" className="text-black">Admin</Link>
                                    </li>
                                )}
                            </ul>

                            {/* For Mobile */}
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
                                <div className="flex gap-4 justify-center items-center mt-3 space-y-2 md:hidden">
                                    <div className='text-black flex'>
                                Hi, <span className='text-green-600 uppercase font-semibold'>{user}</span>
                            </div>
                                    <button
                                        className="inline-block w-full px-4 py-2 text-white text-center bg-gray-600 rounded-md shadow hover:bg-gray-800 w-[50%]"
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
                        <div className="hidden md:flex gap-4 items-center">
                            <div className='text-black'>
                                Hi, <span className='text-green-600 uppercase font-semibold'>{user}</span>
                            </div>
                            <button
                                className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800"
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



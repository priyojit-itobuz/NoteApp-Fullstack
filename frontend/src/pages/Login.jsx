import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../validation/userValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CreateContext } from '../context/myContext';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

export default function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginUser),
    });
    const navigate = useNavigate();
    const { setAccessToken, setRefreshToken, setUser, setEmail, LoggedIn, Role, setRole } = useContext(CreateContext);
    const [seePassword, seeSetPassword] = useState(false)

    const handleSignin = async (data) => {
        try {
            const res = await axios.post("http://localhost:3000/login", data, {
                headers: { 'Content-type': 'application/json' },
            })
            
            if (res.data.success) {
                const { accessToken, refreshToken, userName, email, role } = res.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("userName", userName);
                localStorage.setItem("email", email);
                localStorage.setItem("role", role)
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setUser(userName);
                setEmail(email);
                setRole(role);
                LoggedIn();
                toast.success("Login Successful");
                navigate("/notes")
            }
        }
        catch (error) {
            if(error.status === 429)
            {
                toast.error("Too many Request, Try Later")
            }
            else
            {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(handleSignin)}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Login Here
                            </p>

                            {/* Email Field */}
                            <div className='flex flex-col justify-center items-center w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Your Email
                                </label>
                                <input
                                    placeholder="abc@123"
                                    {...register('email')}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2"
                                    id="email"
                                    type="email"
                                />
                                <p className='text-xs text-red-600 font-semibold min-h-[20px]'>
                                    {errors.email?.message || " "}
                                </p>
                            </div>

                            {/* Password Field */}

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-900">Your Password</label>
                                <div className='w-100 relative'>
                                    {seePassword ? (<><span className='flex justify-center items-center absolute h-100 top-[6px] right-3 cursor-pointer' onClick={() => seeSetPassword(false)}><IoMdEye size={25} /></span>
                                        <input
                                            placeholder="••••••••"
                                            {...register('password')}
                                            className="block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2"
                                            type="text"
                                        /></>) : (<><span className='flex justify-center items-center absolute h-100 top-[6px]  right-3 cursor-pointer' onClick={() => seeSetPassword(true)}><IoMdEyeOff size={25} /></span>
                                            <input
                                                placeholder="••••••••"
                                                {...register('password')}
                                                className="block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2"
                                                type="password"
                                            /></>)}
                                </div>
                                <p className="text-xs text-red-600 font-semibold min-h-[16px]">{errors.password?.message}</p>
                            </div>


                            <p>Don't have an account?
                                <Link to="/signup" className='text-blue-600 underline'> Sign Up</Link>
                            </p>

                            <button
                                className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}


import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../validation/userValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CreateContext } from '../context/myContext';

export default function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginUser),
    });
    const navigate = useNavigate();
    const { setAccessToken, setRefreshToken, setUser, setEmail, LoggedIn } = useContext(CreateContext);

    const handleSignin = async (data) => {
        try {
            const res = await axios.post("http://localhost:3000/login", data, {
                headers: { 'Content-type': 'application/json' },
            })
            if (res.data.success) {
                const { accessToken, refreshToken, userName, email } = res.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("userName", userName);
                localStorage.setItem("email", email);
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setUser(userName);
                setEmail(email);
                LoggedIn();
                toast.success("Login Successful");
                navigate("/notes")
            }
        }
        catch (error) {
            toast.error("Invalid Credentials");
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
                            <div className='flex flex-col justify-center items-center w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Your Password
                                </label>
                                <input
                                    placeholder="••••••••"
                                    {...register('password')}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2"
                                    id="password"
                                    type="password"
                                />
                                <p className='text-xs text-red-600 font-semibold min-h-[20px]'>
                                    {errors.password?.message || " "}
                                </p>
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


import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../validation/userValidation';
import { yupResolver } from '@hookform/resolvers/yup';

export default function Login() {

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(loginUser),
    });
    const navigate = useNavigate();
    const [err,setErr] = useState(false);

    const handleSignin = async(data,e) => {
        console.log(data);
        e.target.reset();
        navigate('/')
    }
  return (
    <div>
      <div>
            <form onSubmit={handleSubmit(handleSignin)}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Login Here
                            </p>
                            <div className='flex flex-col justify-center items-center'>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Your Email
                                </label>
                                <input
                                    placeholder="abc@123"
                                    name="email" {...register('email')}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-1 md:p-2"
                                    id="email"
                                    type="email"
                                />
                                <p className='text-xs text-red-600 font-semibold'>{errors.email?.message}</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Your Password
                                </label>
                                <input
                                    placeholder="••••••••"
                                    name="password" {...register('password')}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-1 md:p-2"
                                    id="password"
                                    type="password"
                                />
                                <p className='text-xs text-red-600 font-semibold'>{errors.password?.message}</p>
                            </div>
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
    </div>
  )
}

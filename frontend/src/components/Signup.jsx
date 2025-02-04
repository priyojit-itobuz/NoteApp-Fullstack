import React from 'react'
import { yupResolver } from "@hookform/resolvers/yup";
import { signupUser } from '../validation/userValidation';
import { useForm } from 'react-hook-form';

export default function Signup() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(signupUser),
    });
    
    const handleRegistration = async(data,e) => {
        console.log(data);
        const resp = await fetch("http://localhost:3000/register",{
            method:'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        console.log("resp",resp);
        e.target.reset();
    }
    return (
        <div>
            <form onSubmit={handleSubmit(handleRegistration)}>
                <div className="flex flex-col items-center justify-center px-3 py-4 mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-6 md:space-y-6 sm:p-8">
                            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Create an account
                            </p>
                            <div className='flex flex-col justify-center items-center'>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Your Name
                                </label>
                                <input
                                    placeholder="Please Enter Name"
                                    name="userName" {...register('userName')}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-1 md:p-2"
                                    id="username"
                                    type="text"
                                />
                                <p className='text-xs text-red-600 font-semibold'>{errors.userName?.message}</p>
                            </div>
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
                                <p className='text-xs  text-red-600 font-semibold'>{errors.email?.message}</p>
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
                                <p className='text-xs  text-red-600 font-semibold'>{errors.password?.message}</p>
                            </div>
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center text-white"
                                type="submit"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    )
}


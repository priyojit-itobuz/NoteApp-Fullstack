import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { MdAddCircle } from "react-icons/md";
import { CreateContext } from '../context/myContext';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";


export default function Admin() {

    const [users, setUsers] = useState([]);
    const { uId, setuId } = useContext(CreateContext);
    const navigate = useNavigate();


    async function getUsers() {
        try {
            const res = await axiosInstance.get("/admin/allUser")
            if (res.data.success) {
                setUsers(res.data.data)
            }
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getUsers();
    }, [])


    async function handleUserDelete(id) {
        try {
            const res = await axiosInstance.delete(`/admin/deleteUser/${id}`, {
            });
            if (res.data.success) {
                toast.success("User deleted successfully.");
                getUsers();
            } else {
                toast.error("Failed to delete User.");
            }
        } catch (error) {
            console.error("error");
        }
    }

    return (
        <div>
            <Navbar />
            <h1 className='text-2xl mt-5 font-bold'>All Users</h1>
            <div className=" mt-5 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                                User Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Add Notes
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Start Chat
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Delete User
                            </th>

                        </tr>
                    </thead>

                    {users.map((user, index) => {
                        return <tbody key={index}>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                    {user.userName}
                                </th>
                                <td className="px-6 py-4 text-center">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 cursor-pointer text-center">
                                    <button onClick={() => { setuId(user._id); navigate("/addNote") }} ><MdAddCircle size={25} /></button>
                                </td>
                                <td className="px-6 py-4">
                                <IoChatbubbleEllipsesOutline size={25} className='cursor-pointer mx-auto'/> 
                                </td> 
                                <td className="px-6 py-4 cursor-pointer text-center" onClick={() => handleUserDelete(user._id)}>
                                    <MdDelete color='red' size={25} className='mx-auto'/>
                                </td>

                            </tr>
                        </tbody>
                    })}
                </table>
            </div>

        </div>
    )
}

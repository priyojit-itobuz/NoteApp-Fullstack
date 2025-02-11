import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

export default function Admin() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await axiosInstance.get("/admin/allUser")
                if (res.data.success) {
                    console.log(res.data.data);
                    setUsers(res.data.data)

                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
        getUsers();
    }, [])

    return (
        <div>
            <Navbar />
            <h1 className='text-2xl mt-5 font-bold'>All Users</h1>
            <div className=" mt-5 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                User Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                View Notes
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Profile Picture
                            </th>

                        </tr>
                    </thead>

                    {users.map((user, index) => {
                        return <tbody key = {index}>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {user.userName}
                                </th>
                                <td className="px-6 py-4">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 cursor-pointer">
                                <Link to={`/userNote/${user._id}`}>
                                    Click Here
                                </Link>
                                </td>
                                <td className="px-6 py-4">
                                    {!user.profilePic?"No Picture Uploaded":user.profilePic}
                                </td>

                            </tr>
                        </tbody>
                    })}




                </table>
            </div>

        </div>
    )
}

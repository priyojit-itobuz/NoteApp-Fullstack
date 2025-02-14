import React, { useContext, useEffect, useState } from 'react'
import { CreateContext } from '../context/myContext';
import Navbar from '../components/Navbar';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import userProfile from '../assets/userProfile.png'


export default function Profile() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [picModal, setpicModal] = useState(false);
    const [profile, setProfile] = useState('');

    const { register, handleSubmit } = useForm({});

    const { AccessToken, setUser, user, Email } = useContext(CreateContext);

    function onCloseModal() {
        setIsModalOpen(false);
    }

    const handleEditNote = async (data) => {
        try {
            const res = await axiosInstance.post(`/changeUserName`, data, {
            });

            if (res.data.success) {
                const userName = res.data.message.userName;
                localStorage.setItem("userName", userName);
                setUser(userName)
                toast.success("UserName Updated Success");
            }
            setIsModalOpen(false);

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update Username");
            console.error("Error updating UserName:", error.message);
        }
    };

    useEffect(() => {
        async function getUser() {
            try {
                const res = await axiosInstance.get("http://localhost:3000/getUser", {
                });

                if (res.data.success) {
                    setProfile(res.data.searchUser.profilePic)
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.error || "Something went wrong");
            }
        }
        getUser();
    }, [])

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        try {
            const formData = new FormData();
            formData.append("profilePic", file);
            const res = await axiosInstance.post(`changeProfilePic`, formData, { headers: { 'Authorization': `Bearer ${AccessToken}`, "Content-Type": "multipart/form-data" } });
            if (res.data.success) {
                setProfile(`http://localhost:3000/uploads/${res.data.data}`)
                toast.success("File uploaded successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload file");
            console.error("Error updating note:", error);
        }
    }

    return (
        <>
            <Navbar />
            <div className="font-std mt-20 w-full rounded-2xl bg-slate-300 p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 text-center mb-8 md:mb-0">
                        <img
                            src={!profile ? userProfile : profile}
                            alt="Profile Picture"
                            className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-indigo-800 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
                        />
                        <div className='flex gap-3 justify-center items-center'>
                            <button className="mt-4 bg-indigo-800 text-white px-2 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300" onClick={() => setIsModalOpen(true)}>
                                Edit Username
                            </button>
                            <button className="mt-4 bg-indigo-800 text-white px-2 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300" onClick={() => setpicModal(true)}>
                                Edit Picture
                            </button>
                        </div>
                    </div>
                    <div className="md:w-2/3 md:pl-8">
                        <h1 className="text-2xl font-bold text-indigo-800 mb-2">{user}</h1>
                        <p className="text-gray-600 mb-6">Software Developer</p>
                        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                            Organization Information
                        </h2>
                        <p className="text-gray-700 mb-6">Itobuz Technologies</p>
                        <div className='flex flex-col justify-between items-center'>
                            <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                                Contact Information
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-indigo-800 "
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    {Email}
                                </li>
                                <li className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-indigo-800"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    +1 (555) 123-4567
                                </li>
                                <li className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-indigo-800 0"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    San Francisco
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal show={isModalOpen} size="md" onClose={onCloseModal} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Change Your UserName</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="userName" value="Your UserName" />
                                </div>
                                <TextInput
                                    id="userName"
                                    {...register('userName')}
                                    placeholder="xxxxx"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Button onClick={handleSubmit(handleEditNote)}>Change UserName</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            {picModal && (
                <div>
                    <Modal
                        show={picModal}
                        onClose={() => {
                            setpicModal(false);
                        }}
                    >
                        <Modal.Header>Upload Profile Picture</Modal.Header>
                        <Modal.Body>
                            <div className="space-y-6 p-6">
                                <p><input type='file' accept=".png, .jpg, .jpeg, .txt" onChange={handleFileUpload} /> </p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => {
                                setpicModal(false);
                            }}>Close</Button>

                        </Modal.Footer>
                    </Modal>
                </div>
            )}

        </>
    )
}
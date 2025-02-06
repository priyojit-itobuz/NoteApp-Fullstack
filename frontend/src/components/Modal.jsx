import { Button, Modal } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
// import { IoIosWarning } from "react-icons/io";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CreateContext } from "../context/myContext";
import axios from "axios";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
    
export default function ModalComponent({deleteModal,setDeleteModal,notes,setNotes,id}) {

const [openModal, setOpenModal] = useState(true);
const { AccessToken,isLoggedIn } = useContext(CreateContext);

async function handleDelete() {
    try {
        setDeleteModal(false)
        const res = await axios.delete(`http://localhost:3000/note/deleteNote/${id}`, {
            headers: { 'Authorization': `Bearer ${AccessToken}` }
        });

        if (res.data.success) {
            toast.success("Note Deleted Successfully");
            setNotes(notes.filter(note => note._id !== id));
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting note");
        console.error(error.message);
    }
}

useEffect(() => {
    const fetchNotes = async () => {
        if (!AccessToken) return; // Prevent API call if there's no token
        try {
            const res = await axios.get("http://localhost:3000/note/oneNote", {
                headers: { 'Authorization': `Bearer ${AccessToken}` }
            });

            if (res.data.success) {
                console.log("Fetched notes:", res.data.data);
                setNotes(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching notes:", error.message);
        }
    };

    fetchNotes();
}, [isLoggedIn, AccessToken,openModal]);

  return (
    <>
      <Modal show={openModal} size="md" onClose={() => setDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this note?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}


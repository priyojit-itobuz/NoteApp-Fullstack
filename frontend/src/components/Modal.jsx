

import { Button, Modal } from "flowbite-react";
import { useContext, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CreateContext } from "../context/myContext";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export default function ModalComponent({ deleteModal, setDeleteModal, notes, setNotes, id,fetchNotes }) {
  const { AccessToken } = useContext(CreateContext);

  // Delete note function


  async function handleDelete() {
    if (!AccessToken) {
      toast.error("Unauthorized. Please log in.");
      return;
    }
  
    try {
      const res = await axiosInstance.delete(`/note/deleteNote/${id}`, {
        // headers: { Authorization: `Bearer ${AccessToken}` },
      });
  
      if (res.data.success) {
        toast.success("Note deleted successfully.");
        setDeleteModal(false); // Close the modal
        fetchNotes(); // Refetch updated notes
      } else {
        toast.error("Failed to delete the note.");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error(error.response?.data?.message || "Error deleting note.");
    }
  }
  



  return (
    <Modal show={deleteModal} size="md" onClose={() => setDeleteModal(false)} popup>
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
  );
}




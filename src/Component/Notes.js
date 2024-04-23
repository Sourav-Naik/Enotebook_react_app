import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NoteContext from "../Context/Notes/NoteContext";

export default function NoteItem() {
  const { userNotes } = useContext(NoteContext);
  const [userNotesData, setUserNotesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notes = await userNotes();
        setUserNotesData(notes.reverse());
      } catch (error) {
        console.error("Error fetching user notes:", error);
      }
    };

    fetchData();
  }, [userNotes]);

  const handleDeleteNote = async (id) => {
    try {
      const token = sessionStorage.getItem("token")||localStorage.getItem("token");
      if (token) {
        const headers = { "auth-token": token };
        const response = await axios.delete(
          `http://localhost:5000/api/notes/deletenote/${id}`,
          { headers }
        );
        if (response.data.success === true) {
          // Remove the deleted note from userNotesData
          setUserNotesData(userNotesData.filter((note) => note._id !== id));
        }
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="row">
      <div className="col-sm-4 p-2">
        <Link to="/newNote" className="text-decoration-none">
          <div className="card h-100">
            <div className="card-body h-100 d-flex flex-column align-items-center justify-content-center">
              {/* <i class="fa-solid fa-plus fa-2xl" /> */}
              <p
                className="m-0 fw-semibold"
                style={{ fontSize: "50px", lineHeight: "20px" }}
              >
                +
              </p>
              <p className="m-0 fw-semibold fs-4">Add New Note</p>
            </div>
          </div>
        </Link>
      </div>
      {userNotesData.map((note) => (
        <div key={note._id} className="col-sm-4 p-2">
          <div className="card h-100">
            <div className="card-body h-100 d-flex flex-column">
              <h5 className="card-title m-0">{note.title}</h5>
              <hr className="m-0 mb-2" />
              <h6 className="card-subtitle mb text-body-secondary">
                {note.tag}
              </h6>
              <div className="card-text h-100 mb-2">{note.description}</div>
              <div className="d-flex justify-content-end">
                <Link to="/open-note" state={{ note }}>
                  <i className="fa-solid fa-arrow-up-right-from-square fa-xl text-dark" />
                </Link>
                <button
                  type="button"
                  className="border-0 bg-transparent p-0 ms-3"
                  onClick={() => handleDeleteNote(note._id)}
                >
                  <i className="fa-regular fa-trash-can fa-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

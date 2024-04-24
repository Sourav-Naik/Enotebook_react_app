import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
export default function OpenNote() {
  const location = useLocation();
  let noteState = location.state.note;
  const [spinner, setSpinner] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [Alert, setAlert] = useState({
    type: "",
    msg: "",
    display: "none",
  });
  const [note, setNote] = useState({
    title: noteState.title,
    tag: noteState.tag,
    description: noteState.description,
    content: noteState.content,
  });
  const navigate = useNavigate();
  const handelAlert = () => {
    if (Alert.type === "danger") {
      setAlert({
        type: "",
        msg: "",
        display: "none",
      });
      setDisabled(false);
    }
  };
  const handelSave = async () => {
    setDisabled(true);
    let token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (note.title.length <= 3) {
      setAlert({
        type: "danger",
        msg: `Title is Short`,
        display: "block",
      });
      return Alert;
    }
    if (note.description.length <= 9) {
      setAlert({
        type: "danger",
        msg: `Description is Short`,
        display: "block",
      });
      return Alert;
    }
    if (note.content.length <= 0) {
      setAlert({
        type: "danger",
        msg: `Content Area Can't be Blank`,
        display: "block",
      });
      return Alert;
    }
    try {
      setSpinner(true);
      setAlert({
        type: "light",
        msg: "Saving",
        display: "block",
      });
      const url = `http://localhost:5000/api/notes/update/${noteState._id}`;
      const response = await axios.put(url, note, {
        headers: {
          "auth-token": token,
        },
      });
      let msg = response.data.msg;
      setTimeout(() => {
        setSpinner(false);
        setAlert({
          type: "success",
          msg: msg,
          display: "block",
        });
      }, 500);
      setTimeout(() => {
        navigate("/notes");
      }, 1000);
    } catch (error) {
      setAlert({
        type: "danger",
        msg: error.response.data.msg,
        display: "block",
      });
    }
  };

  const handelTitle = (e) => {
    setNote({ ...note, title: e.target.value });
  };
  const handelTag = (e) => {
    setNote({ ...note, tag: e.target.value });
  };
  const handelDiscription = (e) => {
    setNote({ ...note, description: e.target.value });
  };
  const handelContent = (e) => {
    setNote({ ...note, content: e.target.value });
  };

  return (
    <div className="text-white position-relative h-100 d-flex flex-column align-items-end h-100">
      <div className="text-white h-100 d-flex flex-column w-100">
        <div className="row">
          <div className="col-sm-6 d-flex align-items-end mt-2">
            <label htmlFor="title" className="me-2 fs-5 lh-1">
              Title*
            </label>
            <input
              type="text"
              className="form-control py-1"
              id="title"
              value={note.title}
              onChange={handelTitle}
              disabled={disabled}
            />
          </div>
          <div className="col-sm-6 d-flex align-items-end mt-2">
            <label htmlFor="tag" className="me-2 fs-5 lh-1">
              Tag
            </label>
            <input
              type="text"
              className="form-control py-1"
              id="tag"
              value={note.tag}
              onChange={handelTag}
              disabled={disabled}
            />
          </div>
        </div>
        <hr className="m-0 mt-2" />
        <div className="d-flex w-100 flex-wrap">
          <div className="d-flex align-items-end mt-2">
            <label htmlFor="description" className="me-2 fs-5 lh-1">
              Description*
            </label>
          </div>
          <div className="col-10 mt-2">
            <input
              type="text"
              className="form-control py-1"
              id="description"
              value={note.description}
              onChange={handelDiscription}
              disabled={disabled}
            />
          </div>
        </div>
        <textarea
          type="text"
          className="form-control mt-3 h-100"
          value={note.content}
          onChange={handelContent}
          disabled={disabled}
        />
      </div>
      <div className="d-flex flex-wrap">
        <Link
          to="/notes"
          className="btn btn-outline-light py-1 px-3 mt-2 text-decoration-none me-2"
          disabled={disabled}
        >
          Go Back
        </Link>
        <button
          className="btn btn-outline-light py-1 px-3 mt-2"
          onClick={handelSave}
          disabled={disabled}
        >
          Save And Exit
        </button>
      </div>
      {/* -----------------alert-------------- */}
      {Alert.display === "block" && (
        <div className="z-2 position-absolute top-0 w-100 h-100 d-flex justify-content-center align-items-center">
          <div
            className={`d-flex flex-column align-items-center alert alert-${Alert.type}`}
            role="alert"
          >
            {spinner ? (
              <div className="spinner-border text-dark" role="status" />
            ) : (
              <div>
                <div
                  className={`m-4 fa-solid fa-circle-${
                    Alert.type === "success" ? "check" : "xmark"
                  } fa-2xl text-${Alert.type}`}
                  style={{ fontSize: "50px", cursor: "pointer" }}
                  onClick={handelAlert}
                />
              </div>
            )}
            <div
              className={`fs-4 mt-3 text-center text-${
                Alert.type === "light" ? "dark" : Alert.type
              }`}
            >
              {Alert.msg}
            </div>
          </div>
        </div>
      )}
      {/* -----------------alert-------------- */}
    </div>
  );
}

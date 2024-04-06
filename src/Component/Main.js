import React, { useContext, useState, useEffect } from "react";
import NoteContext from "../Context/Notes/NoteContext";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import NoteItem from "./Notes";
import OpenNote from "./OpenNote";
import NewNote from "./NewNote";

export default function Notes() {
  const { userInfo } = useContext(NoteContext);
  const [userPic, setUserPic] = useState(null);
  const [userName, setUserName] = useState("User Name");
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      let userDetails = await userInfo();
      setUserName(userDetails.name);
      setUserPic(`data:image/jpeg;base64,${userDetails.imageBuffer}`);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    setSpinner(true);
    navigate("/");
    setTimeout(() => {
      sessionStorage.setItem("token", "");
      sessionStorage.setItem("loggedIn", "");
      window.location.reload();
    }, 500);
  };

  return (
    <div className="container-xl p-0 h-100 d-flex flex-column">
      <div className=" d-flex justify-content-between mx-2">
        <ul className="nav border-0 nav-tabs mt-2 d-flex flex-nowrap">
          <li className="nav-item">
            <Link
              to="/"
              className="nav-link active fw-semibold p-0"
              aria-current="page"
            >
              <img
                src={userPic}
                alt="."
                height="40"
                width="40"
                className="rounded-circle object-fit-cover p-1"
              />
              <span className="fs-6 me-1">{userName}</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/notes" className="nav-link text-white px-2">
              MyNote
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="btn btn-light lh-1 fw-semibold p-0 px-2 mt-2 rounded-bottom-0"
          onClick={logout}
        >
          Log Out
        </button>
      </div>

      <div className="border rounded-bottom m-0 mx-2 p-4 h-100 position-relative">
        <Routes>
          <Route exact path="/" element={<Profile />} />
          <Route exact path="/notes" element={<NoteItem />} />
          <Route exact path="/open-note" element={<OpenNote />} />
          <Route exact path="/newnote" element={<NewNote />} />
        </Routes>

        {spinner && (
          <div className=" position-absolute bottom-50 start-0 end-0 d-flex justify-content-center">
            <div
              className={`d-flex flex-column align-items-center alert alert-light mx-4`}
              role="alert"
            >
              <div className="fs-4 mb-3 text-center">Logging Out</div>
              <div className="spinner-border text-dark" role="status" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

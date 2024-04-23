import React, { useContext, useState, useEffect } from "react";
import NoteContext from "../Context/Notes/NoteContext";
import axios from "axios";

export default function Profile() {
  const [userPic, setUserPic] = useState(null);
  const [userName, setUserName] = useState("User Name");
  const [userEmail, setUserEmail] = useState("User Name");
  const [editForm, setEditForm] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [disabled, setDisabled] = useState(false),
    [checkName, setCheckName] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
  });
  const [Alert, setAlert] = useState({
    type: "",
    msg: "",
    display: "none",
  });

  const { userInfo } = useContext(NoteContext);

  useEffect(() => {
    const fetchData = async () => {
      let userDetails = await userInfo();
      setUserName(userDetails.name);
      setUserEmail(userDetails.email);
      setCredentials({ name: userDetails.name });
      setCheckName(true);
      setUserPic(`data:image/jpeg;base64,${userDetails.imageBuffer}`);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const editProfile = () => {
    editForm ? setEditForm(false) : setEditForm(true);
  };

  const addPic = (event) => {
    const MAX_DIMENSION = 400; // Maximum width and height of the resized image
    const file = event.target.files[0];

    if (!file) {
      // No file selected
      setCredentials({
        ...credentials,
        file: userPic,
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        let width = image.width;
        let height = image.height;

        // Resize the image if it exceeds the maximum dimensions
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          } else {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob((blob) => {
          setUserPic(canvas.toDataURL("image/jpeg"));
          const resizedFile = new File([blob], file.name, {
            type: "image/jpeg",
          });
          setCredentials({
            ...credentials,
            file: resizedFile,
          });
        }, "image/jpeg");
      };

      image.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

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

  const onUserChange = (e) => {
    setUserName(e.target.value);
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (e.target.value.length >= 6) {
      setCheckName(true);
    } else {
      setCheckName(false);
    }
  };

  const saveProfile = async () => {
    setDisabled(true);
    if (checkName) {
      try {
        setSpinner(true);
        setAlert({
          type: "light",
          msg: "Validating",
          display: "block",
        });
        const formData = new FormData();
        formData.append("name", credentials.name);
        if (credentials.file) {
          formData.append("image", credentials.file);
        }
        let token =
          sessionStorage.getItem("token") || localStorage.getItem("token");
        const response = await axios.post(
          `http://localhost:5000/api/auth/updateuser`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "auth-token": token,
            },
          }
        );
        let msg = await response.data.msg;
        setTimeout(() => {
          setSpinner(false);
          setAlert({
            type: "success",
            msg: msg,
            display: "block",
          });
        }, 500);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        setSpinner(false);
        let msg = (await error.response.data.msg) || "Error occurred";
        setAlert({
          type: "danger",
          msg: msg,
          display: "block",
        });
      }
      return alert;
    } else {
      setAlert({
        type: "danger",
        msg: "Enter Valid Name",
        display: "block",
      });
    }
  };

  return (
    <section className="position-relative d-flex flex-wrap justify-content-center align-items-center">
      {/*----------------- profile pic------ */}
      <div className="px-4 d-flex">
        <div className="d-inline-flex justify-content-center position-relative">
          <img
            src={userPic}
            className="object-fit-cover border border-3 rounded-circle"
            alt="Profile pic"
            width="200"
            height="200"
          />

          {editForm && (
            <div className="position-absolute bottom-0 end-0 bg-white rounded">
              <input
                name="image"
                id="file-upload"
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={addPic}
                style={{ display: "none" }}
                disabled={disabled}
              />
              <label
                htmlFor="file-upload"
                className="p-0 fw-semibold"
                style={{ cursor: "pointer" }}
              >
                <i className="fi fi-rr-add-image fs-5 text-dark p-1" />
              </label>
            </div>
          )}
        </div>
      </div>
      {/* form----------------- */}

      <div className="text-white mt-4">
        <div className=" border rounded p-2 mx-1">
          <div className=" d-flex align-items-center">
            <i className="fas fa-user me-3 fa-fw fa-xl" />
            {editForm ? (
              <input
                className="rounded p-0 bg-dark text-white fs-5 mb-1 border px-1"
                type="text"
                name="name"
                value={userName}
                onChange={onUserChange}
                disabled={disabled}
              />
            ) : (
              <span className="fs-4">{userName}</span>
            )}
          </div>
          <hr className="m-0" />
          <div className="d-flex align-items-center mt-3 overflow-hidden">
            <i className="fas fa-envelope me-3 fa-fw fa-xl" />
            <span className="fs-4">{userEmail}</span>
          </div>
          <hr className="mt-0" />
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={editProfile}
            disabled={disabled}
          >
            Edit Profile
          </button>
          {editForm && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveProfile}
              disabled={disabled}
            >
              Save Profile
            </button>
          )}
        </div>
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
    </section>
  );
}

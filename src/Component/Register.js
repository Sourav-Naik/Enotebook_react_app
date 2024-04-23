import React, { useState } from "react";
import ReactDOM from "react-dom";
import pic from "../Images/defaultProfilePic.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
      name: "",
      email: "",
      password: "",
    }),
    [checkName, setCheckName] = useState(false),
    [checkMail, setCheckMail] = useState(false),
    [checkPass, setCheckPass] = useState(false),
    [checkTerm, setCheckTerm] = useState(false),
    [spinner, setSpinner] = useState(false),
    [showTerm, setShowTerm] = useState(false),
    [disabled, setDisabled] = useState(false),
    [showButton, setShowButton] = useState(false),
    [previewURL, setPreviewURL] = useState(pic),
    [Alert, setAlert] = useState({
      type: "",
      msg: "",
      display: "none",
    });

  // --------------------------------userName--------------------------------
  const onUserChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (e.target.value.length >= 6) {
      setCheckName(true);
    } else {
      setCheckName(false);
    }
  };
  // --------------------------------userName--------------------------------

  const onMailChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value.toLowerCase(),
    });
    let pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    if (pattern.test(e.target.value)) {
      setCheckMail(true);
    } else {
      setCheckMail(false);
    }
  };

  // ---------------------------password features start---------------------------------
  const show = (event) => {
    ReactDOM.findDOMNode(
      event.target
    ).parentNode.parentNode.nextSibling.style.display = "block";
    setCheckPass(false);
  };
  const hide = (event) => {
    ReactDOM.findDOMNode(
      event.target
    ).parentNode.parentNode.nextSibling.style.display = "none";
    const pass = ReactDOM.findDOMNode(event.target).parentNode.parentNode
      .nextSibling.nextSibling.nextSibling.lastChild.firstChild.value;
    if (
      event.target.value.match(/[A-Z]/g) &&
      event.target.value.match(/[a-z]/g) &&
      event.target.value.match(/[0-9]/g) &&
      event.target.value.length >= 8 &&
      event.target.value === pass
    ) {
      setCheckPass(true);
    } else {
      setCheckPass(false);
    }
  };
  const handelOnChangePass = (event) => {
    let cond = ReactDOM.findDOMNode(event.target).parentNode.parentNode
      .nextSibling.children;
    if (event.target.value.match(/[a-z]/g)) {
      cond[1].style.color = "green";
    } else {
      cond[1].style.color = "red";
    }
    if (event.target.value.match(/[A-Z]/g)) {
      cond[2].style.color = "green";
    } else {
      cond[2].style.color = "red";
    }
    if (event.target.value.match(/[0-9]/g)) {
      cond[3].style.color = "green";
    } else {
      cond[3].style.color = "red";
    }
    if (event.target.value.length >= 8) {
      cond[4].style.color = "green";
    } else {
      cond[4].style.color = "red";
    }
    ReactDOM.findDOMNode(
      event.target
    ).parentNode.parentNode.parentNode.children[8].children[1].children[0].value =
      "";
  };
  // ---------------------------password features end---------------------------------

  // ------------------------------verify password feauters start---------------------------------
  const onVerPassChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });

    let pass = ReactDOM.findDOMNode(event.target).parentNode.parentNode
      .parentNode.children[5].children[1].children[0].value;
    // ---------other way to get value of passwrod
    /*  event.target.offsetParent.children[0].children[0].children[0].children[1]
    .children[8].children[1].children[0].value ---------------document.get.elementbyID-------------document.queryselector  */

    if (
      event.target.value.match(/[A-Z]/g) &&
      event.target.value.match(/[a-z]/g) &&
      event.target.value.match(/[0-9]/g) &&
      event.target.value.length >= 8 &&
      event.target.value === pass
    ) {
      setCheckPass(true);
    } else {
      setCheckPass(false);
    }
  };
  // ------------------------------verify password feauters end---------------------------------

  // --------------------------------handelAlert----------------------------------
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
  // --------------------------------handelAlert----------------------------------

  // --------------------------------checkTerms------------------------------------
  const checkTerms = (e) => {
    setCheckTerm(e.target.checked);
  };
  const handelTerms = () => {
    !showTerm ? setShowTerm(true) : setShowTerm(false);
    !showTerm ? setDisabled(true) : setDisabled(false);
  };
  // --------------------------------checkTerms------------------------------------

  // ------------------edit-profile---------------------
  const editButton = () => {
    showButton ? setShowButton(false) : setShowButton(true);
  };

  // ------------------edit-profile---------------------
  const addPic = (event) => {
    const MAX_DIMENSION = 400; // Maximum width and height of the resized image

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        // -----------resize image----------------
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
          setPreviewURL(canvas.toDataURL("image/jpeg"));
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

  //-------------------------------------SignUp feature----------------------------
  const handelOnRegister = async (e) => {
    e.preventDefault();
    setDisabled(true);
    if (
      credentials.name.length === 0 ||
      credentials.password.length === 0 ||
      credentials.email.length === 0
    ) {
      setAlert({
        type: "danger",
        msg: "Fill all details",
        display: "block",
      });
      return Alert;
    }
    if (!checkName && !checkMail) {
      setAlert({
        type: "danger",
        msg: "Check Name and Email",
        display: "block",
      });
      return Alert;
    }
    if (!checkName) {
      setAlert({
        type: "danger",
        msg: "Name must be at least 6 characters long ",
        display: "block",
      });
      return Alert;
    }
    if (!checkMail) {
      setAlert({
        type: "danger",
        msg: "Email is not correct",
        display: "block",
      });
      return Alert;
    }
    if (!checkPass) {
      setAlert({
        type: "danger",
        msg: "Password is not matching",
        display: "block",
      });
      return Alert;
    }
    if (!checkTerm) {
      setAlert({
        type: "danger",
        msg: "Check the Terms",
        display: "block",
      });
      return Alert;
    }
    // -------------------------post request-------------------------
    try {
      setSpinner(true);
      setAlert({
        type: "success",
        msg: "Validating Details",
        display: "block",
      });
      const formData = new FormData();
      formData.append("name", credentials.name);
      formData.append("email", credentials.email);
      formData.append("googleLogin", false);
      formData.append("password", credentials.password);
      if (credentials.file) {
        formData.append("image", credentials.file);
      }

      const emailVailidation = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.REACT_APP_API_KEY}&email=${credentials.email}`
      );
      if (emailVailidation.data.is_smtp_valid.value) {
        const response = await axios.post(
          `http://localhost:5000/api/auth/createuser`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        let msg = await response.data.msg;
        setSpinner(false);
        setAlert({
          type: "success",
          msg: msg,
          display: "block",
        });
        setTimeout(() => {
          setAlert({
            type: "success",
            msg: "Moving to Home Page",
            display: "block",
          });
          setSpinner(true);
        }, 500);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setSpinner(false);
        setAlert({
          type: "danger",
          msg: "Invalid Email Account",
          display: "block",
        });
      }
    } catch (error) {
      let msg = (await error.response.data.msg) || "Error occurred";
      setSpinner(false);
      setAlert({
        type: "danger",
        msg: msg,
        display: "block",
      });
    }
    return alert;
  };
  //-------------------------------------SignUp feature----------------------------

  return (
    <div className="container">
      <div className="text-white text-center mt-3 border rounded py-3 fs-5 fw-semibold">
        Register And Start Writing
      </div>
      <section className="vh-100">
        <div className="row d-flex justify-content-center align-items-centers">
          <div className="col-lg-12 col-xl-11 mt-4 rounded">
            <div className="card">
              <div className="card-body p-md-5 bg-dark text-white rounded">
                <div className="row justify-content-center">
                  {/*----------------- profile pic------ */}
                  <div className="col-md-10 col-lg-6 col-xl-5 d-flex flex-column align-items-center justify-content-center order-1 order-lg-2">
                    <div
                      className="position-relative"
                      // id="profilePic"
                      onMouseEnter={editButton}
                      onMouseLeave={editButton}
                    >
                      <img
                        src={previewURL}
                        className="object-fit-cover border border-3 rounded-circle"
                        alt="Profile pic"
                        width="300"
                        height="300"
                      />
                      {showButton && (
                        <div className="position-absolute bottom-0 end-0 bg-white rounded">
                          <input
                            name="image"
                            id="file-upload"
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            onChange={addPic}
                            style={{ display: "none" }}
                          />
                          <label
                            htmlFor="file-upload"
                            className="p-0 fw-semibold"
                            style={{ cursor: "pointer" }}
                          >
                            <i className="fi fi-rr-add-image fs-3 text-dark p-1"></i>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* form----------------- */}
                  <div className="col-md-10 col-lg-6 col-xl-7 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Sign up
                    </p>

                    <section className="mx-1 mx-md-4 position-relative">
                      {/* --------------user name--------------------- */}
                      <label
                        className="form-label  fw-semibold"
                        htmlFor="regName"
                      >
                        User Name
                      </label>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            name="name"
                            id="regName"
                            className="form-control"
                            placeholder="Enter 7 Character User Name"
                            onChange={onUserChange}
                            disabled={disabled}
                          />
                        </div>
                      </div>

                      {/* --------------email--------------------- */}
                      <label
                        className="form-label  fw-semibold"
                        htmlFor="regEmail"
                      >
                        Email Address
                      </label>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            name="email"
                            id="regEmail"
                            className="form-control"
                            placeholder="Enter a Valid Email Address"
                            onChange={onMailChange}
                            disabled={disabled}
                          />
                        </div>
                      </div>

                      {/* --------------Password---------------- */}
                      <label
                        className="form-label  fw-semibold"
                        htmlFor="regPass"
                      >
                        Password
                      </label>
                      <div className="d-flex flex-row align-items-center mb-1">
                        <i className="fas fa-lock fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            id="regPass"
                            className="form-control"
                            placeholder="Enter Password"
                            onChange={(event) => handelOnChangePass(event)}
                            onFocus={show}
                            onBlur={hide}
                            disabled={disabled}
                          />
                        </div>
                      </div>
                      <div
                        className="bg-white text-dark py-2 px-4 rounded"
                        id="message"
                        style={{ display: "none" }}
                      >
                        <p className="fs7 fw-bolder">
                          Password must contain the following:
                        </p>
                        <p id="letter" className="fs7" style={{ color: "red" }}>
                          A <b>lowercase</b> letter
                        </p>
                        <p
                          id="capital"
                          className="fs7"
                          style={{ color: "red" }}
                        >
                          A <b>Uppercase</b> letter
                        </p>
                        <p id="number" className="fs7" style={{ color: "red" }}>
                          A <b>Number</b>
                        </p>
                        <p id="length" className="fs7" style={{ color: "red" }}>
                          Minimum <b>8 characters</b>
                        </p>
                      </div>

                      {/* -----------------verify password------------- */}
                      <label
                        className="form-label fw-semibold mt-4"
                        htmlFor="regVerifyPass"
                      >
                        Verify Password
                      </label>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            name="password"
                            id="regVerifyPass"
                            className="form-control"
                            placeholder="Enter Password Again"
                            onChange={onVerPassChange}
                            disabled={disabled}
                          />
                        </div>
                      </div>

                      {/* ------------------term and condition-------------- */}
                      <div className="form-check d-flex justify-content-center align-items-center p-0 mb-5">
                        <input
                          className="form-check-input m-0"
                          type="checkbox"
                          id="terms"
                          disabled={disabled}
                          onClick={checkTerms}
                        />
                        <label className="p-0 mx-1" htmlFor="terms">
                          I agree all statements in
                        </label>
                        <button
                          className="p-0 btn text-primary border-0"
                          disabled={disabled}
                          onClick={handelTerms}
                        >
                          Terms of service
                        </button>
                      </div>

                      {/* ------------------registeration Button-------------- */}
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="button"
                          className="btn btn-primary btn-lg px-5"
                          onClick={handelOnRegister}
                          disabled={disabled}
                        >
                          Register
                        </button>
                      </div>

                      {/* -----------------alert-------------- */}
                      {Alert.display === "block" && (
                        <div className="z-2 position-absolute top-0 w-100 h-100 d-flex justify-content-center align-items-center">
                          <div
                            className={`d-flex flex-column align-items-center alert alert-${Alert.type}`}
                            role="alert"
                          >
                            <div className="fs-4 mb-3 text-center">
                              {Alert.msg}
                            </div>
                            {spinner ? (
                              <div
                                className="spinner-border text-success"
                                role="status"
                              />
                            ) : (
                              <div className="">
                                <div
                                  className={`m-4 fa-solid fa-circle-${
                                    Alert.type === "success" ? "check" : "xmark"
                                  } fa-2xl text-${Alert.type}`}
                                  style={{
                                    fontSize: "50px",
                                    cursor: "pointer",
                                  }}
                                  onClick={handelAlert}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {/* -----------------alert-------------- */}
                    </section>

                    {/* -----------------terms -------------- */}
                    {showTerm && (
                      <div
                        className={`d-flex flex-column align-items-center text-white bg-secondary p-2 m-4`}
                        style={{
                          position: "absolute",
                          top: "200px",
                          right: "0",
                          left: "0",
                        }}
                      >
                        <div className="d-flex w-100 mb-2">
                          <div className="fs-4 w-100">Terms & policies</div>
                          <div>
                            <button
                              type="button"
                              className="btn-close p-2 bg-light"
                              aria-label="Close"
                              onClick={handelTerms}
                            />
                          </div>
                        </div>
                        <div className=" border p-2 w-100">
                          <p>
                            1. All your personal details shared on eNotebook are
                            safe and secure with us.
                          </p>
                          <p>
                            2. We don't share your personal deatils with anyone.
                          </p>
                          <p>
                            3. Only the user can get access to its note onther
                            are not able to see your notes as they are secure.
                          </p>
                          <p>
                            4. Even we don't know your password as it is
                            encryted and protected with the help of bcrypt and a
                            salt added to it.
                          </p>
                        </div>
                      </div>
                    )}
                    {/* -----------------terms -------------- */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

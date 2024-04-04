import React, { useState } from "react";
import eNotebook from "../Images/eNotebook.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import Login from "./GoogleLogin";

export default function LogIn() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [spinner, setSpinner] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "", display: "none" });
  const handelAlert = () => {
    setAlert({ type: "", msg: "", display: "none" });
    setDisabled(false);
  };

  const onPassChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onEmailChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    if (credentials.email.length === 0 || credentials.password.length === 0) {
      setAlert({
        type: "danger",
        msg: "Fill all the credentials",
        display: "block",
      });
      return;
    }

    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(credentials.email)) {
      setAlert({ type: "danger", msg: "Fill Correct Email", display: "block" });
      return;
    }

    setSpinner(true);
    setAlert({ type: "light", msg: "Validating", display: "block" });

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        credentials,
        {
          headers: { "content-type": "application/json" },
        }
      );

      const result = await response.data;
      if (result.success === true) {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("loggedIn", true);
        setTimeout(() => {
          setSpinner(false);
          setAlert({ type: "success", msg: "Logging In", display: "block" });
        }, 500);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      const msg = error.response.data.msg;
      setSpinner(false);
      setAlert({ type: "danger", msg: msg, display: "block" });
    }
  };

  return (
    <div className="container">
      <div className="text-white text-center mt-3 border rounded py-3 fs-5 fw-semibold">
        Write And Save Note Online
      </div>

      <section className="mh-100 text-white">
        <div className="container-fluid h-custom border rounded my-4 mh-100">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src={eNotebook} className="img-fluid" alt="eNoteBook" />
            </div>

            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 my-4">
              <form className="position-relative">
                <div className="d-flex align-items-center justify-content-center">
                  {/* <GoogleLogin /> */}
                  <Login />
                </div>

                <p className="text-center fw-semibold my-3 fs-4">Or</p>

                {alert.display === "block" && (
                  <div className=" position-absolute bottom-50 start-0 end-0 d-flex justify-content-center">
                    <div
                      className={`d-flex flex-column align-items-center alert alert-${alert.type} mx-4`}
                      role="alert"
                    >
                      <div className="fs-4 mb-3 text-center">{alert.msg}</div>

                      {spinner ? (
                        <div
                          className="spinner-border text-success"
                          role="status"
                        />
                      ) : (
                        <div className="">
                          <div
                            className={`m-4 fa-solid fa-circle-${
                              alert.type === "success" ? "check" : "xmark"
                            } fa-2xl text-${alert.type}`}
                            style={{ fontSize: "50px", cursor: "pointer" }}
                            onClick={handelAlert}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-outline d-flex align-items-center">
                  <i className="fas fa-user fa-lg me-3 fa-fw mb-4" />
                  <input
                    type="email"
                    id="userId"
                    onChange={onEmailChange}
                    name="email"
                    className="form-control mb-4"
                    placeholder="Enter Registered Email"
                    disabled={disabled}
                  />
                </div>

                <div className="form-outline d-flex align-items-center">
                  <i className="fas fa-key fa-lg me-3 fa-fw mb-4" />
                  <input
                    type="password"
                    id="userPass"
                    onChange={onPassChange}
                    name="password"
                    className="form-control mb-4"
                    placeholder="Enter password"
                    disabled={disabled}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      value=""
                      id="form2Example3"
                      disabled={disabled}
                    />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-white text-decoration-none"
                    disabled={disabled}
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="d-flex flex-column mt-4 pt-2 align-items-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    onClick={(event) => handleSubmit(event)}
                    disabled={disabled}
                  >
                    Login
                  </button>

                  <p className="small fw-bold my-2 pt-1 mb-0">
                    Don't have an account?
                    <Link
                      to="/register"
                      className=" text-decoration-none px-2 fs-6"
                      disabled={disabled}
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

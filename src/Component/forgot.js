import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import eNotebook from "../Images/eNotebook.jpg";
import axios from "axios";
export default function Forgot() {
  const [credentials, setCredentials] = useState({ email: "" });
  const [spinner, setSpinner] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "", display: "none" });

  const navigate = useNavigate();

  const handelAlert = () => {
    if (alert.type === "success") {
      setAlert({
        type: "success",
        msg: "Moving to login Page",
        display: "block",
      });
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
    setAlert({ type: "", msg: "", display: "none" });
    setDisabled(false);
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

    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(credentials.email)) {
      setAlert({ type: "danger", msg: "Fill Correct Email", display: "block" });
      return;
    }
    setSpinner(true);
    setAlert({ type: "light", msg: "Validating", display: "block" });

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/forgotpassword`,
        credentials,
        {
          headers: { "content-type": "application/json" },
        }
      );
      setTimeout(() => {
        setSpinner(false);
        setAlert({ type: "success", msg: response.data.msg, display: "block" });
      }, 500);
    } catch (error) {
      setSpinner(false);
      setAlert({
        type: "danger",
        msg: error.response.data.msg,
        display: "block",
      });
    }
  };
  return (
    <div className="container">
      <div className="text-white text-center mt-3 border rounded py-3 fs-5 fw-semibold">
        Write And Save Note Online
      </div>

      <section className="h-100 text-white">
        <div className="container-fluid h-custom border rounded my-4 mh-100">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src={eNotebook} className="img-fluid" alt="eNoteBook" />
            </div>

            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 my-4">
              <form className="position-relative">
                {alert.display === "block" && (
                  <div className="z-2 position-absolute top-0 w-100 h-100 d-flex justify-content-center align-items-center">
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
                  <i className="fas fa-user fa-lg me-3 fa-fw" />
                  <input
                    type="email"
                    id="userId"
                    onChange={onEmailChange}
                    name="email"
                    className="form-control"
                    placeholder="Enter Registered Email"
                    disabled={disabled}
                  />
                </div>

                <div
                  className={`d-flex flex-column mt-3 pt-2 align-items-center`}
                >
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    onClick={(event) => handleSubmit(event)}
                    disabled={disabled}
                  >
                    Get Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Login() {
  const [spinner, setSpinner] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "", display: "none" });
  const handelAlert = () => {
    setAlert({ type: "", msg: "", display: "none" });
    setDisabled(false);
  };

  const handelGoogleLogin = async (response) => {
    setSpinner(true);
    setDisabled(true);

    const googleCredentail = jwtDecode(response.credential);
    console.log(googleCredentail.email_verified);

    let file = googleCredentail.picture;
    try {
      // converting image url to file
      const loginResponse = await axios.post(
        `http://localhost:5000/api/auth/login`,
        {
          googleLogin: true,
          googleCredentail: googleCredentail,
        },
        {
          headers: { "content-type": "application/json" },
        }
      );
      const result = loginResponse.data;
      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("loggedIn", true);
      setSpinner(false);
      setAlert({ type: "success", msg: "Logged In", display: "block" });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      try {
        const imageResponse = await fetch(file);
        const imageData = await imageResponse.blob();
        file = new File([imageData], "profile.jpg", {
          type: imageResponse.headers.get("content-type"),
        });
      } catch (error) {
        file = "";
      }

      const user = error.response.data.user;
      if (user === "Not Found") {
        try {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("googleLogin", true);
          const jsonString = JSON.stringify(googleCredentail);
          formData.append("googleCredentail", jsonString);

          const signUpResponse = await axios.post(
            `http://localhost:5000/api/auth/createuser`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          let success = await signUpResponse.data.success;
          if (success === true) {
            const loginResponse = await axios.post(
              `http://localhost:5000/api/auth/login`,
              {
                googleLogin: true,
                googleCredentail: jwtDecode(response.credential),
              },
              {
                headers: { "content-type": "application/json" },
              }
            );
            const result = loginResponse.data;
            if (result.success === true) {
              sessionStorage.setItem("token", result.token);
              sessionStorage.setItem("loggedIn", true);
              setSpinner(false);
              setAlert({ type: "success", msg: "Logged In", display: "block" });
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }
          }
        } catch (error) {
          setSpinner(false);
          setAlert({
            type: "danger",
            msg: error.response.data.msg,
            display: "block",
          });
        }
      } else {
        console.log("error");
        setSpinner(false);
        setAlert({ type: "danger", msg: error.response.data.msg, display: "block" });
      }
    }
  };

  return (
    <>
      <GoogleLogin
        onSuccess={(response) => {
          handelGoogleLogin(response);
        }}
        onError={() => {
          console.log("error");
          setSpinner(false);
          setAlert({ type: "danger", msg: "google error", display: "block" });
        }}
      />

      {alert.display === "block" && (
        <div className="z-2 position-absolute top-0 w-100 h-100 d-flex justify-content-center align-items-center">
          <div
            className={`d-flex flex-column align-items-center alert alert-${alert.type} mx-4`}
            role="alert"
          >
            <div className="fs-4 mb-3 text-center">{alert.msg}</div>

            {spinner ? (
              <div className="spinner-border text-success" role="status" />
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
    </>
  );
}

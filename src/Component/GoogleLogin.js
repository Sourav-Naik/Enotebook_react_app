import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Login() {
  const handelGoogleLogin = async (response) => {
    const password = jwtDecode(response.credential).sub;
    const userEmail = jwtDecode(response.credential).email;
    const userName = jwtDecode(response.credential).name;
    const imageUrl = jwtDecode(response.credential).picture;
    let file;
    try {
      // converting image url to file
      const imageResponse = await fetch(imageUrl);
      const imageData = await imageResponse.blob();
      file = new File([imageData], "profile.jpg", {
        type: imageResponse.headers.get("content-type"),
      });

      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        {
          email: userEmail,
          password: password,
        },
        {
          headers: { "content-type": "application/json" },
        }
      );
      const result = response.data;
      if (result.success === true) {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("loggedIn", true);
        window.location.reload();
      }
    } catch (error) {
      const user = error.response.data.user;
      if (user === "Not Found") {
        try {
          const formData = new FormData();
          formData.append("name", userName);
          formData.append("email", userEmail);
          formData.append("password", password);
          formData.append("image", file);
          const response = await axios.post(
            `http://localhost:5000/api/auth/createuser`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          let success = await response.data.success;
          if (success === true) {
            const response = await axios.post(
              `http://localhost:5000/api/auth/login`,
              {
                email: userEmail,
                password: password,
              },
              {
                headers: { "content-type": "application/json" },
              }
            );
            const result = response.data;
            if (result.success === true) {
              sessionStorage.setItem("token", result.token);
              sessionStorage.setItem("loggedIn", true);
              window.location.reload();
            }
          }
        } catch (error) {
          window.location.reload();
        }
      }
    }
  };

  return (
    <GoogleLogin
      onSuccess={(response) => {
        handelGoogleLogin(response);
      }}
      onError={() => {
        window.location.reload();
      }}
    />
  );
}

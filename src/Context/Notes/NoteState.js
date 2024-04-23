import React from "react";
import NoteContext from "./NoteContext";
import axios from "axios";
export default function NoteState(props) {
  const loginStatus =
    sessionStorage.getItem("loggedIn") || localStorage.getItem("loggedIn");

  // fetch user details and notes
  const userInfo = async () => {
    let token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      const headers = { "auth-token": token };
      try {
        const userDetailsResponse = await axios.post(
          "http://localhost:5000/api/auth/getuser",
          {},
          { headers }
        );
        return userDetailsResponse.data;
      } catch (error) {
        // If an error occurs while fetching user details
        return error.response.data.msg;
      }
    } else {
      return "Token not found";
    }
  };

  const userNotes = async () => {
    let token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      const headers = { "auth-token": token };
      try {
        const userNotesResponse = await axios.get(
          "http://localhost:5000/api/notes/fetchallnotes",
          { headers }
        );
        return userNotesResponse.data;
      } catch (error) {
        // If an error occurs while fetching user notes
        return error.response.data.msg;
      }
    } else {
      return "Token not found";
    }
  };

  return (
    <NoteContext.Provider value={{ userInfo, userNotes, loginStatus }}>
      {props.children}
    </NoteContext.Provider>
  );
}

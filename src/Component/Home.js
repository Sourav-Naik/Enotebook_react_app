import React from "react";
import LogIn from "./LogIn";
import Main from "./Main";

export default function Home() {
  let login = sessionStorage.getItem("loggedIn");
  return <>{login ? <Main /> : <LogIn />}</>;
}

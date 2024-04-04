import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary bg-dark p-1"
      data-bs-theme="dark"
    >
      <div className="container-xl p-0 w-100">
        <span className="navbar-brand mb-0 h1 d-flex p-0 m-0 align-items-end">
          <Link
            to="/"
            className="fs-3 p-0 me-2 text-decoration-none text-white"
          >
            e
            <sub style={{ padding: "1px" }}>
              <i className="fi fi-ss-circle-n fs-2 p-0"></i>
            </sub>
            otebook
          </Link>
        </span>
      </div>
    </nav>
  );
}

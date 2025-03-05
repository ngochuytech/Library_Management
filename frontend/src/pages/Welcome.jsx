import React from "react";
import "../styles/Welcome.css"; // Custom styles

function Welcome() {
  return (
    <div className="welcome-container">
      <div className="overlay">
        <div className="container">
          <h1 className="display-4">
            Welcome to the Library Management System
          </h1>
          <p className="lead">
            Manage your library efficiently and effectively.
          </p>
          <p>
            <a href="/Login" className="btn btn-primary btn-lg mx-2">
              Login
            </a>
            <span className="text-white">or</span>
            <a href="/register" className="btn btn-success btn-lg mx-2">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

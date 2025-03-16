<<<<<<< HEAD
import React from "react";
import LoginForm from "../components/LoginForm";

function Login() {
  return <LoginForm />;
}

export default Login;
=======
import LoginForm from "../components/LoginForm"
import Background from "../components/Background"

function Login() {
  return (
    <Background>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <LoginForm />
      </div>
    </Background>
  )
}

export default Login

>>>>>>> a6c2f05783ad49986e36e71f46ce5a88972ae7b8

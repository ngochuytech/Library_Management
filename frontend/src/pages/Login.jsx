import React from "react";
import LoginForm from "../components/LoginForm";
import Background from "../components/Background";

function Login() {
  return (
    <Background>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <LoginForm />
    </div>
  </Background>
  );
}

export default Login;

<<<<<<< HEAD
import RegisterForm from "../components/RegisterForm";

function Register() {
  return <RegisterForm route="/api/user/register/" method="register" />;
}

export default Register;
=======
import RegisterForm from "../components/RegisterForm"
import Background from "../components/Background"

function Register() {
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
        <RegisterForm route="/api/user/register/" method="register" />
      </div>
    </Background>
  )
}

export default Register

>>>>>>> a6c2f05783ad49986e36e71f46ce5a88972ae7b8

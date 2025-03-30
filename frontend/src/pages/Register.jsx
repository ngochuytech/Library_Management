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


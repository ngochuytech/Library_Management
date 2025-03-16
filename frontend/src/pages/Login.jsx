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


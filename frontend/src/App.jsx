import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import ForgotPassword from "./pages/ForgotPassword";
import OtpForm from "./components/OtpForm";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import SuccessForm from "./components/SuccessForm";
import AdminHome from "./pages/AdminHome";
import BorrowDetail from "./pages/BorrowDetail";
import AdminBookDetail from "./pages/AdminBookDetail";
// import BookDetail from "./components/BookDetail";
import "bootstrap/dist/css/bootstrap.min.css";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

// Protected route component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/guest" element={<Welcome isGuest={true} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/reset-success" element={<SuccessForm />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/book" element={<BookDetail />} /> */}
        {/* Admin */}
        <Route path="/borrowDetail/:borrowId" element={<BorrowDetail />} />
        <Route path="/admin/books/:id" element={<AdminBookDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

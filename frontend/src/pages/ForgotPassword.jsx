"use client"

import { useState } from "react"
import Background from "../components/Background"
import EmailForm from "../components/EmailForm"
import OtpForm from "../components/OtpForm"
import ResetPasswordForm from "../components/ResetPasswordForm"
import SuccessForm from "../components/SuccessForm"

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")

  const handleEmailSubmit = (submittedEmail) => {
    setEmail(submittedEmail)
    setStep(2)
  }

  const handleOtpSubmit = () => {
    // After OTP verification, go to password reset step
    setStep(3)
  }

  const handlePasswordReset = (newPassword) => {
    // Here you would typically call an API to update the password
    console.log(`Password reset for ${email} with new password`)

    // Move to success step
    setStep(4)
  }

  const handleLoginClick = () => {
    // Navigate to login page
    window.location.href = "/login"
  }

  const handleResendOtp = () => {
    // Logic to resend OTP
    alert(`OTP đã được gửi lại đến ${email}`)
  }

  const handleGoBack = () => {
    setStep(step - 1)
  }

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
        {step === 1 && <EmailForm onSubmit={handleEmailSubmit} />}
        {step === 2 && (
          <OtpForm onSubmit={handleOtpSubmit} onResend={handleResendOtp} onGoBack={handleGoBack} email={email} />
        )}
        {step === 3 && <ResetPasswordForm onSubmit={handlePasswordReset} />}
        {step === 4 && <SuccessForm onLoginClick={handleLoginClick} message="Mật khẩu đã được đặt lại thành công" />}
      </div>
    </Background>
  )
}

export default ForgotPassword


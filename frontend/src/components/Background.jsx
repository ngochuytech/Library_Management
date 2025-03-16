import React from "react";
import "../styles/Background.css";

const Background = ({ children }) => {
  return (
    <div className="wave-container">
      {/* OTP Text */}
      <span
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "#666",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        OTP
      </span>

      {/* SVG Wave - Chính */}
      <svg className="wave-svg" viewBox="0 200 1440 753" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#18C4FF", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#0A3D5F", stopOpacity: 1 }} />
          </linearGradient>

          {/* Bộ lọc Gaussian Blur */}
          <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>

        {/* Đường cong chính */}
        <path
          fill="url(#waveGradient)"
          fillOpacity="1"
          d="M0,950 Q360,300 700,600 Q1080,700 1440,200 L1440,0 L0,0 Z"
        />

        {/* Đường cong Blur cách ra 30px */}
        <path
          fill="url(#waveGradient)"
          fillOpacity="0.6"
          d="M0,980 Q360,330 700,630 Q1080,730 1440,230 L1440,30 L0,30 Z"
          filter="url(#blurFilter)"
        />
      </svg>

      {/* Nội dung trang */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Background;

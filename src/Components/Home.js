import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./MyMedsLogo.png"

const InfoPage = () => {
  const navigate = useNavigate();

  const infoContainerStyle = {
    // Info page container styles
    background: "rgb(2,0,36)",
    background:
      "linear-gradient(24deg, rgba(2,0,36,1) 0%, rgba(177,235,134,1) 0%, rgba(0,212,255,1) 77%, rgba(0,212,255,1) 97%)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const infoContentStyle = {
    // Info page content styles
    maxWidth: "800px",
    padding: "1rem",
    textAlign: "center",
    color: "#fff",
  };

  const closeButtonStyle = {
    // Close button styles
    position: "absolute",
    top: "1rem",
    right: "1rem",
    fontSize: "1.5rem",
    color: "#fff",
    background: "none",
    border: "none",
    cursor: "pointer",
    outline: "none",
  };

  const paragraphStyle = {
    // Paragraph styles
    margin: "1.2 rem",
  };

  const handleCloseButtonClick = () => {
    // Handler for close button click
    // Navigate back to previous page
    navigate(-1);
  };

  return (
    <div style={infoContainerStyle}>
      <div style={infoContentStyle}>
        <button style={closeButtonStyle} onClick={handleCloseButtonClick}>
          X
        </button>
        <h1>Welcome to our Digital Medical Prescription Service</h1>
        <p style={paragraphStyle}>
          MyMeds is your digital prescription service. It is designed to make requesting and giving prescriptions
          easier for everyone.
        </p>
        <p style={paragraphStyle}>As a patient, you can
          request your doctor to prepare a prescription for you.</p>
        <p style={paragraphStyle}>
          As a doctor, you can register your patients and accept their
          prescription requests.
        </p>
        <img src={Logo}></img>
      </div>
    </div>
  );
};

export default InfoPage;


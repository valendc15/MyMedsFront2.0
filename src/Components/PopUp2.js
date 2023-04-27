import React from "react";
import { useState } from "react";

function Popup2(props) {
  const [nose1, setNose1] = useState("");
  const [nose2, setNose2] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    // Add any form submission logic here
    props.setTrigger(false);
  }

  const popupStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const popupInnerStyle = {
    position: "relative",
    maxWidth: 500,
    backgroundColor: "#f5f5f5",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    fontFamily: "Arial, sans-serif",
  };

  const formStyle = {
    margin: "0 auto",
  };

  const h1Style = {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#004d99",
  };

  const labelStyle = {
    display: "block",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#004d99",
  };

  const inputStyle = {
    width: "100%",
    height: 40,
    padding: 10,
    marginBottom: 20,
    border: "none",
    borderRadius: 5,
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
    fontSize: 16,
    color: "#333",
  };

  const buttonStyle = {
    display: "block",
    width: "100%",
    height: 50,
    marginTop: 20,
    border: "none",
    borderRadius: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#004d99",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
    border: "none",
    backgroundColor: "transparent",
  };

  const closeIconStyle = {
    width: 20,
    height: 20,
    color: "#666",
  };

  return props.trigger ? (
    <div className="popup" style={popupStyle}>
      <div className="popup-inner" style={popupInnerStyle}>
      <button className="close-btn btn btn-danger"
                onClick={()=>props.setTrigger(false)}
                style={closeButtonStyle}
                ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16" style={closeIconStyle}>
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg></button>
        <form onSubmit={handleSubmit} style={formStyle}>
          <h1 className="text-align-center" style={h1Style}>Please complete the prescription</h1>
          <div className="mb-3">
            <label htmlFor="nose1" className="form-label" style={labelStyle}>
              Doctor Signature
            </label>
            <input
              type="text"
              className="form-control"
              id="nose1"
              value={nose1}
              onChange={(e) => setNose1(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nose2" className="form-label" style={labelStyle}>
              Nose2
            </label>
            <input 
              style={inputStyle}
              type="text"
              className="form-control"
              id="nose2"
              value={nose2}
              onChange={(e) => setNose2(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary" style={buttonStyle}>
              Submit
            </button>
          </div>
        </form>
        {props.children}
      </div>
    </div>
  ) : null;
}


export default Popup2;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MedicNavBar from "./MedicNavBar";

function ViewRequests() {
  const [requestList, setRequestList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRequests();
  }, []);

  function getRequests() {
    fetch(`http://localhost:8080/doctor/viewRequests/${localStorage.getItem('id')}`, {
      method: "GET",
      headers: { "content-type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        return response.json();
      })
      .then((data) => {
        if (data != null || data != undefined) {
          setRequestList(data);
        } else {
          setRequestList([]);
        }
      });
  }

  const cardStyle = {
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "10px",
    margin: "10px",
    width: "300px",
  };

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const cardTextStyle = {
    fontSize: "14px",
    marginBottom: "10px",
  };

  const btnInfoStyle = {
    backgroundColor: "#17a2b8",
    color: "#fff",
    borderRadius: "5px",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
  };

  const btnDangerStyle = {
    backgroundColor: "#dc3545",
    color: "#fff",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  };

  return (
    <div>
      <MedicNavBar></MedicNavBar>
      <h1>Requests</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {requestList.map((request) => (
          <div key={request.id} style={cardStyle}>
            <div>
              <h5 style={cardTitleStyle}>Patient: {request.patientUsername}</h5>
              <p style={cardTextStyle}>Requested Medicine: {request.drugName}</p>
              <button style={btnInfoStyle}>Accept</button>
              <button style={btnDangerStyle}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewRequests;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MedicNavBar from "./MedicNavBar";
import { toast } from "react-toastify";

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

  function info(){
    toast.info("to be implemented")
  }


  function rejectRequest(id) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/doctor/deleteRequest/${localStorage.getItem("id")}`, {
      method: "DELETE",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(id),
    })
      .then((result) => {
        console.log(result);
        if (!result.ok) {
          throw Error("Error");
        }
        window.location.reload(false);
        return result.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <MedicNavBar></MedicNavBar>
      <h1 className="text-center">Requests</h1>
      {requestList.length === 0 ? (
        <h3 className="flex" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>There are no pending requests!</h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {requestList.map((request) => (
            <div key={request.requestID} style={cardStyle}>
              <div>
                <h5 style={cardTitleStyle}>Patient: {request.patientUsername}</h5>
                <p style={cardTextStyle}>Requested Medicine: {request.drugName}</p>
                <button className="btn btn-warning" onClick={() => rejectRequest(request.requestID)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default ViewRequests;

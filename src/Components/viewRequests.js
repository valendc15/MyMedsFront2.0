import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MedicNavBar from "./MedicNavBar";
import { toast } from "react-toastify";
import Popup from "./PopUp";

function ViewRequests() {
  const [requestList, setRequestList] = useState([]);
  const [popUpState, setPopUpState] = useState(false);
  const [popUpState2, setPopUpState2] = useState(false);
  const [docSignature, setDocSignature] = useState("");
  const [pharmacyID, setPharmacyID] = useState("");
  const [triggerUse, setTriggerUse] = useState(true);
  const [pharmacyList, setPharmacyList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (triggerUse) {
      getRequests();
      getPharmacy();
      setTriggerUse(false);
    }
  }, [triggerUse]);

  function getRequests() {
    fetch(`http://localhost:8080/doctor/viewRecipes/${localStorage.getItem("id")}?status=IN_PROGRESS`, {
      method: "GET",
      headers: { "content-type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  function getPharmacy() {
    fetch("http://localhost:8080/doctor/getAllPharmacys", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          return response.json().then((data) => {
            if (Array.isArray(data)) {
              setPharmacyList(data);
            } else {
              setPharmacyList([]);
            }
          });
        }
      });
  }

  const cardStyle = {
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "10px",
    margin: "10px",
    width: "300px",
    zIndex: "1",
    display: "flex",
    flexDirection: "column",
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

  function rejectRequest(id) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/doctor/DeclineRecipe/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(id),
    })
      .then((result) => {
        console.log(result);
        if (!result.ok) {
          throw Error("Error");
        }
        setTriggerUse(true);
        return result.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function acceptRequest(recipeID) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/doctor/AproveRecipe/${localStorage.getItem("id")}?recipeID=${recipeID}`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((result) => {
        setTriggerUse(true);
        if (!result.ok) {
          throw Error("Error");
        }
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
        <h3 className="flex" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          There are no pending requests!
        </h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {requestList.map((request) => (
            <div key={request.recipeID} style={cardStyle}>
              <div>
                <h5 style={cardTitleStyle}>Patient: {request.patientName}</h5>
                <h6>DNI:{request.patientID}</h6>
                <p style={cardTextStyle}>Requested Medicines:</p>
                <ul>
                  {request.drug.map((drug) => (
                    <li key={drug.brandName}>
                      <p style={cardTextStyle}>Brand Name: {drug.brandName}</p>
                      <p style={cardTextStyle}>Strength: {drug.strength}</p>
                      <p style={cardTextStyle}>Dosage: {drug.dosageForm}</p>
                    </li>
                  ))}
                </ul>
                <p style={cardTextStyle}>Pharmacy Name:{request.pharmacyName}</p>
              </div>

              {/* Spacer */}
              <div style={{ flex: "1 0 auto" }}></div>

              {/* Buttons */}
              <div style={{ display: "flex", }}>
                <button
                  className={`btn ${(popUpState || popUpState2) ? "disabled" : ""}`}
                  onClick={() => setPopUpState(true)}
                  style={{
                    backgroundColor: (popUpState || popUpState2) ? "#17a2b8" : "#17a2b8",
                    borderColor: (popUpState || popUpState2) ? "#17a2b8" : "#17a2b8",
                    marginRight: "10px",
                    color:"white"
                  }}
                >
                  Accept
                </button>
                <button
                  className={`btn btn-danger ${(popUpState || popUpState2) ? "disabled" : ""}`}
                  onClick={() => setPopUpState2(true)}
                  style={{
                    backgroundColor: (popUpState || popUpState2) ? "#dc3545" : "",
                    borderColor: (popUpState || popUpState2) ? "#dc3545" : "",
                  }}
                >
                  Reject
                </button>
              </div>

              {/* Popups */}
              <Popup
                style={{
                  zIndex: "9999",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Set the background color for the popup
                }}
                trigger={popUpState}
                setTrigger={setPopUpState}
              >
                <div>
                  <h4>Are you sure you want to accept this request?</h4>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      acceptRequest(request.recipeID);
                      setPopUpState(false);
                    }}
                  >
                    Yes
                  </button>
                  <button className="btn btn-danger" onClick={() => setPopUpState(false)}>
                    No
                  </button>
                </div>
              </Popup>

              <Popup
                style={{
                  zIndex: "9999",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Set the background color for the popup
                }}
                trigger={popUpState2}
                setTrigger={setPopUpState2}
              >
                <div>
                  <h4>Are you sure you want to reject this request?</h4>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      rejectRequest(request.recipeID);
                      setPopUpState2(false);
                    }}
                  >
                    Yes
                  </button>
                  <button className="btn btn-danger" onClick={() => setPopUpState2(false)}>
                   No
                  </button>
                </div>
              </Popup>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewRequests;

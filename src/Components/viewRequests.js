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
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading2, setIsLoading2] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (triggerUse) {
      fetchData()
      setTriggerUse(false);
    }
    
  }, [triggerUse]);

  



  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const token = sessionStorage.getItem("token");
      const doctorId = sessionStorage.getItem('id');
      const url = `http://localhost:8080/doctor/viewRecipes/${doctorId}?status=IN_PROGRESS&page=${page}&size=${8}`;
  
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
  
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }
  
      setRequestList(prevItems => [...prevItems, ...data]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
      return;
    }
    fetchData();
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

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
    const token = sessionStorage.getItem("token");
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
    setIsAccepting(true);
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:8080/doctor/AproveRecipe/${sessionStorage.getItem("id")}?recipeID=${recipeID}`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((result) => {
        setIsAccepting(false);
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
      <MedicNavBar />
      <h1 className="text-center">Requests</h1>
      {isLoading ? (
        <h3 className="text-center">Updating...</h3>
      ) : requestList.length === 0 ? (
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
              <div style={{ display: "flex" }}>
                <button
                  className={`btn ${(popUpState || popUpState2 || isAccepting) ? "disabled" : ""}`}
                  onClick={() => setPopUpState(true)}
                  style={{
                    backgroundColor: (popUpState || popUpState2 || isAccepting) ? "#17a2b8" : "#17a2b8",
                    borderColor: (popUpState || popUpState2 || isAccepting) ? "#17a2b8" : "#17a2b8",
                    marginRight: "10px",
                    color: "white",
                  }}
                  disabled={isAccepting} // Disable the button when isAccepting is true
                >
                  Accept
                </button>
                <button
                  className={`btn btn-danger ${(popUpState || popUpState2 || isAccepting) ? "disabled" : ""}`}
                  onClick={() => setPopUpState2(true)}
                  style={{
                    backgroundColor: (popUpState || popUpState2 || isAccepting) ? "#dc3545" : "",
                    borderColor: (popUpState || popUpState2 || isAccepting) ? "#dc3545" : "",
                  }}
                  disabled={isAccepting} // Disable the button when isAccepting is true
                >
                  Reject
                </button>
              </div>
  
              {/* Popups */}
              {isAccepting && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(255, 255, 255, 255)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                  }}
                >
                  <h4>Updating...</h4>
                </div>
              )}
  
              <Popup
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

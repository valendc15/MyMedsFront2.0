import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./PopUp";
import MedicNavBar from "./MedicNavBar";

function PharmacyRequest() {
  const [requestList, setRequestList] = useState([]);
  const [triggerUse, setTriggerUse] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [dniFilter, setDniFilter] = useState("");
  const [popUpState, setPopUpState] = useState(false);
  const [popUpState2, setPopUpState2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (triggerUse) {
      fetchData();
      setPopUpState(false);
    }
  }, []);

  const navigate = useNavigate();

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

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const token = sessionStorage.getItem("token");
      const doctorId = sessionStorage.getItem("id");
      const url = `http://localhost:8080/doctor/viewRecipes/${doctorId}?status=IN_PROGRESS&page=${page}&size=${8}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      setRequestList((prevItems) => [...prevItems, ...data]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    fetchData();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

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
        if (!result.ok) {
          throw Error("Error");
        }
        // Refresh the request list after accepting the request
        fetchData();
        setPopUpState(false);
        setIsAccepting(false);
        setTriggerUse(true);
        window.location.reload(false)
        return result.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <MedicNavBar></MedicNavBar>

      {isLoading ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          Loading...
        </h3>
      ) : requestList.length === 0 ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          No Recipes found.
        </h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {requestList.map((request) => (
            <div key={request.recipeID} style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
              <div style={{ flexGrow: 1 }}>
                <h5 style={cardTitleStyle}>Patient: {request.patientName}</h5>
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
                <p style={cardTextStyle}>Request ID: {request.recipeID}</p>
                <p style={cardTextStyle}>Patient ID: {request.patientID}</p>
              </div>

              <div style={{ flex: "1 0 auto" }}></div>

              <div style={{ display: "flex" }}>
                <button
                  className={`btn btn-success`}
                  onClick={() => setPopUpState(true)}
                  style={{ marginRight: "10px" }}
                >
                  Accept
                </button>
                <button className={`btn btn-danger`} onClick={() => setPopUpState2(true)}>
                  Reject
                </button>
              </div>
              <Popup
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                trigger={popUpState}
                setTrigger={setPopUpState}
              >
                <div>
                  <div>
                    <h4>Do you want to accept this request?</h4>
                    {isAccepting ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        <button className="btn btn-success accept-button" onClick={() => acceptRequest(request.recipeID)}>
                          Yes
                        </button>
                        <button className="btn btn-danger reject-button" onClick={() => setPopUpState(false)}>
                          No
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Popup>
              <Popup
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                trigger={popUpState2}
                setTrigger={setPopUpState2}
              >
                <div>
                  <div>
                    <h4>Do you want to reject this request?</h4>
                    <button className="btn btn-success accept-button" onClick={() => rejectRequest(request.recipeID)}>
                      Yes
                    </button>
                    <button className="btn btn-danger reject-button" onClick={() => setPopUpState2(false)}>
                      No
                    </button>
                  </div>
                </div>
              </Popup>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PharmacyRequest;

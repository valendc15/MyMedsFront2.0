import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MedicNavBar from "./MedicNavBar";
import { toast } from "react-toastify";
import Popup from "./PopUp";

function ViewRequests() {
  const [requestList, setRequestList] = useState([]);
  const [popUpState, setpopUpState]=useState(false)
  const [docSignature,setDocSignature]=useState("")
  const [pharmacyID, setPharmacyID]=useState("")
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


  function handlesubmit(drugname){
    const token = localStorage.getItem("token");
    let obj={docSignature, drugname, pharmacyID}
    fetch(`http://localhost:8080/doctor/createRecipe/${localStorage.getItem("id")}`, {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj),
    })
      .then((result) => {
        console.log(result);
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
        <h3 className="flex" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>There are no pending requests!</h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {requestList.map((request) => (
            <div key={request.requestID} style={cardStyle}>
              <div>
                <h5 style={cardTitleStyle}>Patient: {request.patientUsername}</h5>
                <p style={cardTextStyle}>Requested Medicine: {request.drugName}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setpopUpState(true)}
                  style={{
                    backgroundColor: "#17a2b8",
                    borderColor: "#17a2b8",
                    marginRight: "10px",
                  }}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => rejectRequest(request.requestID)}
                  style={{
                    backgroundColor: "#dc3545",
                    borderColor: "#dc3545",
                  }}
                >
                  Reject
                </button>

              </div>
              <Popup style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }} trigger={popUpState} setTrigger={setpopUpState}>
            <div>
            <h3>
Please complete the Prescripiton form
</h3>
            <form onSubmit={()=>handlesubmit(request.drugName)} >
            <div class="mb-3">
    <label class="form-label">Please write down your name as confirmation</label>
    <input type="text" class="form-control"
        value={docSignature}
        onChange={(e)=>setDocSignature(e.target.value)}/>
  </div>
  <div class="mb-3">
    <label class="form-label">Pharmacy ID</label>
    <input type="number" class="form-control"
        value={pharmacyID}
        onChange={(e)=>setPharmacyID(e.target.value)}/> 
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

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

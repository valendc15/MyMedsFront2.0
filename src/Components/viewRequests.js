import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MedicNavBar from "./MedicNavBar";
import { toast } from "react-toastify";
import Popup from "./PopUp";

function ViewRequests() {
  const [requestList, setRequestList] = useState([]);
  const [popUpState, setpopUpState]=useState(false)
  const [popUpState2,setpopUpState2]=useState(false)
  const [docSignature,setDocSignature]=useState("")
  const [pharmacyID, setPharmacyID]=useState("")
  const [triggerUse, setTriggerUse] =useState(true)
  const [pharmacyList, setPharmacyList] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if(triggerUse){
    getRequests();
    getPharmacy();
    setTriggerUse(false)
    }
  }, [triggerUse]);


  function getRequests() {
    fetch(`http://localhost:8080/doctor/viewRecipes/${localStorage.getItem('id')}?status=IN_PROGRESS`, {
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

  function getPharmacy() {
    fetch('http://localhost:8080/doctor/getAllPharmacys', {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
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
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "10px",
    margin: "10px",
    width: "300px",
    zIndex:"1"
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
        setTriggerUse(true)
        return result.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }


  function handlesubmit(drugName,recipeID){
    const token = localStorage.getItem("token");
    let obj={pharmacyID, recipeID, docSignature}
    console.log(obj);
    fetch(`http://localhost:8080/doctor/AproveRecipe/${localStorage.getItem("id")}`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj),
    })
      .then((result) => {
        console.log(result);
        if (!result.ok) {
          throw Error("Error");
        }
        setTriggerUse(true)
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
            <div key={request.recipeID} style={cardStyle}>
              <div>
                <h5 style={cardTitleStyle}>Patient: {request.patientName}</h5>
                <h6>DNI:{request.patientID}</h6>
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
                  onClick={() => setpopUpState2(true)}
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
            <form onSubmit={()=>handlesubmit(request.drugName, request.recipeID)} >
            <div class="mb-3">
    <label class="form-label">Please write down your name as confirmation</label>
    <input type="text" class="form-control"
        value={docSignature}
        onChange={(e)=>setDocSignature(e.target.value)}/>
  </div>
  <div class="mb-3">
    <label class="form-label">Pharmacy ID</label>
    <select
              className="form-control"
              onChange={(event) => setPharmacyID(event.target.value)}
              value={pharmacyID} // Set the value of the select field to docId
            >
              <option value="">Select Pharmacy</option>
              {pharmacyList.map((phar) => (
                <option key={phar.pharmacyUsername} value={phar.pharmacyID}>
                  {phar.pharmacyName} :{phar.pharmacyID}
                </option>
              ))}
            </select>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

            </div>
          </Popup>
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
  }} trigger={popUpState2} setTrigger={setpopUpState2}>
 <div>
 <div>
  <h4>Are you sure you want to reject this request?</h4>
  <button className="btn btn-danger reject-button" onClick={() => setpopUpState2(false)}>No</button>
  <button className="btn btn-success accept-button" onClick={() => rejectRequest(request.recipeID)}>Yes</button>
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

export default ViewRequests;

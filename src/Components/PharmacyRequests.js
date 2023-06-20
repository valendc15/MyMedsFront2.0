import PharmacyNavBar from "./PharmacyNavBar"
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./PopUp";
import { reject } from "q";

function PharmacyRequest() {

    const [requestList, setRequestList] = useState([]);
    const [triggerUse, setTriggerUse] =useState(true)
    const [nameFilter, setNameFilter]=useState('')
    const [dniFilter, setDniFilter]=useState('')
    const [records, setRecords] = useState([])
    const [popUpState, setpopUpState]= useState(false)
    const [popUpState2, setpopUpState2]=useState(false)
    

    useEffect(() => {
        if(triggerUse){
        getRequests();
        setTriggerUse(false)
        }
      }, [triggerUse]);

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


      function getRequests(){
        fetch(`http://localhost:8080/pharmacy/getRecipesByStatus/${sessionStorage.getItem('id')}?status=APPROVED`, {
      method: "GET",
      headers: { "content-type": "application/json", Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    })
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data != null || data != undefined) {
          setRequestList(data)
          setRecords(data)
        } else {
          setRequestList([])
        }
      });
      }

      function dispense(recipeID){
        fetch(`http://localhost:8080/pharmacy/markRecipe/${recipeID}`, {
          method: "PUT",
          headers: { "content-type": "application/json", Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        })
          .then((response) => {
            if (response.status === 401) {
              sessionStorage.clear();
              navigate("/login");
            }
            setTriggerUse(true)
            setpopUpState(false)
            return response.json();
          });
      }

      function discard(recipeID){
        fetch(`http://localhost:8080/pharmacy/rejectRecipe/${recipeID}`, {
          method: "PUT",
          headers: { "content-type": "application/json", Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        })
          .then((response) => {
            if (response.status === 401) {
              sessionStorage.clear();
              navigate("/login");
            }
            setTriggerUse(true)
            setpopUpState2(false)
            return response.json();
          });
      }
      


      const Filter=(event)=>{

        if(event.target.value!=''){
        setRecords(requestList.filter(f=>f.patientID == event.target.value ))
        }
        else{
          setRecords(requestList)
        }
      }

      const Filter2=(event)=>{
        if(event.target.value!=''){
        setRecords(requestList.filter(f=>f.doctorName.match(new RegExp(event.target.value,'i'))))
        }
        else{
          setRecords(requestList)
        }
      }

      
      
      return (
        <div>
          <PharmacyNavBar></PharmacyNavBar>
          <input type="text" className="form-control" onChange={Filter} placeholder="Search by patient DNI" />
          <input type="text" className="form-control" onChange={Filter2} placeholder="Search by doctor name" />
      
          {requestList.length === 0 ? (
            <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
              No Recipes found.
            </h3>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {records.map((request) => (
                <div key={request.recipeID} style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
                  <div style={{ flexGrow: 1 }}>
                    <h5 style={cardTitleStyle}>Doctor: {request.doctorName}</h5>
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
      
                  <div style={{ display: "flex",}}>
                    <button className={`btn btn-success`} onClick={() => setpopUpState(true)} style={{ marginRight: "10px" }}>
                      Dispensed
                    </button>
                    <button className={`btn btn-danger`} onClick={() => setpopUpState2(true)}>
                      Discard
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
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    trigger={popUpState}
                    setTrigger={setpopUpState}
                  >
                    <div>
                      <div>
                        <h4>Do you want to mark this recipe as dispensed?</h4>
                        <button className="btn btn-success accept-button" onClick={() => dispense(request.recipeID)}>Yes</button>
                        <button className="btn btn-danger reject-button" onClick={() => setpopUpState(false)}>No</button>
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
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    trigger={popUpState2}
                    setTrigger={setpopUpState2}
                  >
                    <div>
                      <div>
                        <h4>Do you want to discard this recipe?</h4>
                        <button className="btn btn-success accept-button" onClick={() => discard(request.recipeID)}>Yes</button>
                        <button className="btn btn-danger reject-button" onClick={() => setpopUpState2(false)}>No</button>
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

export default PharmacyRequest
import PharmacyNavBar from "./PharmacyNavBar"
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PharmacyRequest() {

    const [requestList, setRequestList] = useState([]);
    const [triggerUse, setTriggerUse] =useState(true)

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
        fetch(`http://localhost:8080/pharmacy/getRecipesByStatus/${localStorage.getItem('id')}?status=APPROVED`, {
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
        console.log(data);
        if (data != null || data != undefined) {
          setRequestList(data)
        } else {
          setRequestList([])
        }
      });
      }

      function dispense(recipeID){
        fetch(`http://localhost:8080/pharmacy/markRecipe/${recipeID}`, {
          method: "PUT",
          headers: { "content-type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
          .then((response) => {
            if (response.status === 401) {
              localStorage.clear();
              navigate("/login");
            }
            return response.json();
          }).then(setTriggerUse(true));
      }
      

    return(
        <div>
            <PharmacyNavBar></PharmacyNavBar>
            {requestList.length === 0 ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          No Recipes found.
        </h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {requestList.map((request) => (
            <div key={request.id} style={cardStyle}>
              <div>
                <h5 style={cardTitleStyle}>Doctor: {request.doctorName}</h5>
                <p style={cardTextStyle}>Requested Medicine: {request.drugName}</p>
                <p style={cardTextStyle}> Request ID: {request.recipeID}</p>
                <button className="btn btn-success" onClick={() =>dispense(request.recipeID)}>Dispensed</button>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
    )
}

export default PharmacyRequest
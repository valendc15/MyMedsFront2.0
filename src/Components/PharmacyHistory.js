import { ExceptionMap } from "antd/es/result"
import PharmacyNavBar from "./PharmacyNavBar"
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Collapse } from 'antd';

const { Panel } = Collapse;

function PharmacyHistory(){

    const [acceptedRequestList, setAcceptedRequestList]=useState([]);
    const[dispensedRequestList, setDispensedRequestList]=useState([]);
    const navigate=useNavigate();


    useEffect(() => {
        getAcceptedRequests();
        getDispensedRequests();
      }, []);


      


    function getAcceptedRequests(){
        fetch(`http://localhost:8080/pharmacy/viewRecipeHistory/${sessionStorage.getItem('id')}?status=APPROVED`, {
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
          setAcceptedRequestList(data)
        } else {
          setAcceptedRequestList([])
        }
      });
      }


      function getDispensedRequests(){
        fetch(`http://localhost:8080/pharmacy/viewRecipeHistory/${sessionStorage.getItem('id')}?status=DISPENSED`, {
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
          setDispensedRequestList(data)
        } else {
          setDispensedRequestList([])
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


    return(
        <div>
            <PharmacyNavBar></PharmacyNavBar>
            <h1>Recipes</h1>
            <Collapse defaultActiveKey={['0']}>
      <Panel header='Show recipes that are pending'>
      {acceptedRequestList.length === 0 ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          No Recipes found.
        </h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {acceptedRequestList.map((request) => (
            <div key={request.id} style={cardStyle}>
              <div>
                <h5 style={cardTitleStyle}>Doctor: {request.doctorName}</h5>
                <p style={cardTextStyle}>Requested Medicines:</p>
<ul>
  {request.drug.map(drug => (
    <li key={drug.brandName}>
      <p style={cardTextStyle}>Brand Name: {drug.brandName}</p>
      <p style={cardTextStyle}>Strength: {drug.strength}</p>
      <p style={cardTextStyle}>Dosage: {drug.dosageForm}</p>
    </li>
  ))}
</ul>
                <p style={cardTextStyle}>Patient ID: {request.patientID}</p>
                <p style={cardTextStyle}>Request ID: {request.recipeID}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </Panel>
      <Panel header='Show recipes already dispensed'>
      {dispensedRequestList.length === 0 ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          No requests found.
        </h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {dispensedRequestList.map((request) => (
            <div key={request.id} style={cardStyle}>
              <div>
                <h5 style={cardTitleStyle}>Doctor: {request.doctorName}</h5>
                <p style={cardTextStyle}>Requested Medicines:</p>
<ul>
  {request.drug.map(drug => (
    <li key={drug.brandName}>
      <p style={cardTextStyle}>Brand Name: {drug.brandName}</p>
      <p style={cardTextStyle}>Strength: {drug.strength}</p>
      <p style={cardTextStyle}>Dosage: {drug.dosageForm}</p>
    </li>
  ))}
</ul>
                <p style={cardTextStyle}>Patient ID: {request.patientID}</p>
                <p style={cardTextStyle}>Request ID: {request.recipeID}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </Panel>
      </Collapse>
    </div>
  );

}

export default PharmacyHistory;
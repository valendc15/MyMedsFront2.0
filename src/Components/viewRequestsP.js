import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PatientNavBar from "./PatientNavBar";
import { Collapse } from 'antd';

const { Panel } = Collapse;


function ViewRequestsP() {
  const [requestList, setRequestList] = useState([]);
  const [acceptedRequestList, setAcceptedRequestList]=useState([]);
  const [declinedRequestList, setDeclinedRequestList]=useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRequests();
    getAcceptedRequests();
    getDeclinedRequests();
  }, []);

  function getRequests() {
    fetch(`http://localhost:8080/patient/viewRecipes/${sessionStorage.getItem('id')}?status=IN_PROGRESS`, {
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
          setRequestList(data);
        } else {
          setRequestList([]);
        }
      });
  }

  function getAcceptedRequests() {
    fetch(`http://localhost:8080/patient/viewRecipes/${sessionStorage.getItem('id')}?status=APPROVED`, {
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

  function getDeclinedRequests() {
    fetch(`http://localhost:8080/patient/viewRecipes/${sessionStorage.getItem('id')}?status=DECLINED`, {
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
          setDeclinedRequestList(data)
        } else {
          setDeclinedRequestList([])
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
      <PatientNavBar></PatientNavBar>
      <h1 className="text-center">Requests</h1>
      <Collapse defaultActiveKey={['0']}>
      <Panel header='Show requests in progress'>
      {requestList.length === 0 ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          No requests found.
        </h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {requestList.map((request) => (
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
<p style={cardTextStyle}>Request ID: {request.recipeID}</p>
<p style={cardTextStyle}>Pharmacy Name: {request.pharmacyName}</p>

              </div>
            </div>
          ))}
        </div>
      )}
      </Panel>
      <Panel header='Show requests accepted by your doctor'>
      {acceptedRequestList.length === 0 ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          No requests found.
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
<p style={cardTextStyle}>Request ID: {request.recipeID}</p>
<p style={cardTextStyle}>Pharmacy Name: {request.pharmacyName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </Panel>
      <Panel header='Show requests declined by your doctor'>
      {declinedRequestList.length === 0 ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          No requests found.
        </h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {declinedRequestList.map((request) => (
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
<p style={cardTextStyle}>Request ID: {request.recipeID}</p>
<p style={cardTextStyle}>Pharmacy Name: {request.pharmacyName}</p>
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

export default ViewRequestsP;
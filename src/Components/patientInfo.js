import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import Logo from "./MyMedsLogo.png"
import userIcon from "./user2.png"
import banner from "./imageBanner.webp"

function PatientInfo(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drugList, setDrugList]= useState([])

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

  useEffect(() => {
    if (!location.state || !location.state.name || !location.state.dni) {
        localStorage.clear()
      navigate('/');
    }
    getPatientMeds();
  }, [location.state, navigate]);


  function getPatientMeds() {
    fetch(`http://localhost:8080/doctor/getPatientDrugs/${localStorage.getItem('id')}?patientID=${location.state.dni}`,{
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
          setDrugList(data)
        } else {
          setDrugList([])
        }
      });
  }

  function addDrugs(){
    
  }

  return (
<div style={{ backgroundColor: '#78e3c4', paddingBottom: 0, minHeight: '100vh', position: 'relative' }}>
  {location.state && location.state.name && location.state.dni ? (
    <div className="gradient-custom-2" style={{ backgroundColor: '#78e3c4', minHeight: '100vh' }}>
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="position-relative">
                <div
                  className="rounded-top text-white d-flex flex-row justify-content-center align-items-center position-relative"
                  style={{
                    backgroundImage: `url(${banner})`,
                    height: '200px',
                  }}
                >
                  <button
                    className="close-btn btn btn-danger float-end"
                    onClick={() => navigate('/viewPatients')}
                    style={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-lg"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                      />
                    </svg>
                  </button>
                </div>
                <MDBCardBody className="text-black p-4">
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1">About</p>
                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                      <MDBCardText className="font-italic mb-1">Name: {location.state.name}</MDBCardText>
                      <MDBCardText className="font-italic mb-1">DNI: {location.state.dni}</MDBCardText>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <MDBCardText className="lead fw-normal mb-0">Asigned Medication:</MDBCardText>
                    <MDBCardText className="mb-0">
                    </MDBCardText>
                  </div>
                  <MDBRow>
                    {drugList.map((drug) => (
                      <MDBCol md="4" key={drug.drugID}>
                        <div style={cardStyle}>
                          <div>
                            <h5 style={cardTitleStyle}>Name: {drug.brandName}</h5>
                            <p style={cardTextStyle}>Dosage: {drug.dosageForm}</p>
                          </div>
                        </div>
                      </MDBCol>
                    ))}
                  </MDBRow>
                  <div className="d-flex justify-content-center mt-3">
  <button className="btn btn-info" onClick={() => addDrugs()}>Asign new medication</button>
</div>

                </MDBCardBody>
              </div>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  ) : (
    navigate('/')
  )}
</div>



  );
}

export default PatientInfo;

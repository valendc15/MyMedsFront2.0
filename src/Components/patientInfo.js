import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import banner from "./imageBanner.webp"
import Popup from "./PopUp";
import { toast } from "react-toastify";

function PatientInfo(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drugList, setDrugList]= useState([])
  const [name,setName] = useState('')
  const [dni, setDni] = useState(location.state?.dni || '');
  const [popUpState2,setpopUpState2]=useState(false)
  const [popUpState, setpopUpState]=useState(false)
  const [searched, setSearched]=useState("")
  const [sdrugList, setSDrugList]=useState([])
  const [triggerUse, setTriggerUse] =useState(false)
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [triggerUse2,setTriggerUse2]=useState(true);
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
    if(triggerUse2){
      if (!location.state || !location.state.name || !location.state.dni) {
        sessionStorage.clear();
        navigate('/');
      } else {
        setDni(location.state.dni);
        setName(location.state.name);
        getPatientMeds();
      }
      if(triggerUse){
        setSDrugList([])
        setSearched("")
        setTriggerUse(false)
        }
      setTriggerUse2(false)
    }
  
  }, [location.state, navigate,triggerUse,triggerUse2]);

  function closePopUp() {
    setpopUpState(false);
    setSearched("")
    setSDrugList([])
    setTriggerUse(true);
  }

  function capitalizeFirstLetter(string) 
{
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


  function getPatientMeds() {
    fetch(`http://localhost:8080/doctor/getPatientDrugs/${sessionStorage.getItem('id')}?patientID=${dni}`,{
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
        if (data != null || data != undefined) {
          setDrugList(data)
        } else {
          setDrugList([])
        }
      });
  }

  function addDrugs(did){
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:8080/doctor/addDrugToPatient/${sessionStorage.getItem('id')}?patientID=${dni}&drugID=${did}`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((result) => {
        console.log(result);
        if (result.status==409){
          toast.warning("Medicine already asigned.")
          return;
        }
        if (!result.ok) {
          throw Error("Error");
        }
        setpopUpState(false)
        setTriggerUse2(true)
        return result.json();
      })
      .catch((error) => {
        toast.warning(error)
      });
  }

  function deleteDrug(did){
    fetch(`http://localhost:8080/doctor/removePatientDrug/${sessionStorage.getItem('id')}?patientID=${dni}&drugID=${did}`, {
      method: "DELETE",
      headers: { "content-type": "application/json", Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    })
      .then((result) => {
        console.log(result);
        if (!result.ok) {
          throw Error("Error");
        }
        window.location.reload(false)
        return result.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function search(){
    if (searched.trim() === "") {
      toast.warning("No search input")
      return;
    }
    fetch(`http://localhost:8080/doctor/filterDrugByBrandName/${searched}`, {
      method: "GET",
      headers: { "content-type": "application/json", Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    })
    .then((response) => {
      if (response.status === 401) {
        sessionStorage.clear();
        navigate("/login");
      } else {
        return response.json().then((data) => {
          if (Array.isArray(data)) {
           setSDrugList(data)
          } else {
           setSDrugList([])
           toast.error('No medications found')
          }
          setNoMatchFound(data.length===0)
        });
      }
    });
  }

  return (
    <div style={{ backgroundColor: '#78e3c4', paddingBottom: 0, minHeight: '100vh', position: 'relative' }}>
      {location.state?.name && location.state?.dni ? (
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
                          <MDBCardText className="font-italic mb-1">Name: {name}</MDBCardText>
                          <MDBCardText className="font-italic mb-1">DNI: {dni}</MDBCardText>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <MDBCardText className="lead fw-normal mb-0">Assigned Medication:</MDBCardText>
                        <MDBCardText className="mb-0"></MDBCardText>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {Array.isArray(drugList) && drugList.map((drug) => (
                          <div key={drug.drugID} style={cardStyle}>
                            <div>
                              <h5 style={cardTitleStyle}>Name: {capitalizeFirstLetter(drug.brandName)}</h5>
                              <p style={cardTextStyle}>Dosage: {drug.dosageForm}</p>
                              <p style={cardTextStyle}>Method: {capitalizeFirstLetter(drug.strength)}</p>
                              <button className="btn btn-danger" onClick={() => setpopUpState2(true)}>Delete</button>
  
                              <Popup
                                style={{
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
                                }}
                                trigger={popUpState2}
                                setTrigger={setpopUpState2}
                              >
                                <div>
                                  <div>
                                    <h4>Are you sure you want to disassociate this medication?</h4>
                                    <button className="btn btn-danger reject-button" onClick={() => setpopUpState2(false)}>No</button>
                                    <button className="btn btn-success accept-button" onClick={() => deleteDrug(drug.drugID)}>Yes</button>
                                  </div>
                                </div>
                              </Popup>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="d-flex justify-content-center mt-3">
                        <button className="btn btn-info" onClick={() => setpopUpState(true)}>Assign new medication</button>
                      </div>
  
                      <Popup
                        style={{
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
                        
                        }}
                        trigger={popUpState}
                        setTrigger={closePopUp}

                      >
                        <div>
                          <div className="mb-3">
                            <h2>Medication searcher</h2>
                            <div className="d-flex align-items-center">
                              <input
                                type="text"
                                className="form-control"
                                value={searched}
                                onChange={(e) => setSearched(e.target.value)}
                              />
  
                              <button className="btn btn-primary" onClick={() => search()}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-search"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Results:</label>
                            {noMatchFound && searched.trim() !== "" && (
                            <div>No medications found</div> // Display message when no drugs are found after searching
                            )}
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                              {Array.isArray(sdrugList) && sdrugList.map((drug) => (
                                <div key={drug.drugID} style={cardStyle}>
                                  <div>
                                    <h5 style={cardTitleStyle}>Name: {capitalizeFirstLetter(drug.brandName)}</h5>
                                    <p style={cardTextStyle}>Dosage: {drug.dosageForm}</p>
                                    <p style={cardTextStyle}>Method: {capitalizeFirstLetter(drug.strength)}</p>
                                    <button className="btn btn-info" onClick={() => addDrugs(drug.drugID)}>Add</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Popup>
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
  );}
  

export default PatientInfo;

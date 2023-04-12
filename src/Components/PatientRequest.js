import PatientNavBar from "./PatientNavBar";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import lol from "./prescription.jpg";
import { FaUser, FaUserMd, FaPrescriptionBottleAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PatientRequest() {
  const [drugName, setMedicine] = useState("");
  const [docId, setDoctorID] = useState("");
  const userName = localStorage.getItem("username");
  const [doclist, setDoclist] = useState([]);
  const navigate=useNavigate()

  const patientId = localStorage.getItem("id");

  useEffect(() => {
    getDoctors();
  }, []);

  function handleSumbit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let obj = { docId: parseInt(docId), drugName };
    fetch(`http://localhost:8080/patient/${patientId}/makeRequest`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj),
    })
      .then((data) => {
        if (data.status === 404) {
          throw Error("Error");
        }
        toast.success("Request sent!");
      })
      .catch((err) => {
        toast.error("Failed to send request!");
      });
  }

  function getDoctors() {
    fetch(`http://localhost:8080/patient/viewDoctors/${patientId}`, {
      method: "GET",
      headers: { "content-type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDoclist(data);
        } else {
          setDoclist([]);
        }
      });
  }

  return (
    <div>
      <PatientNavBar />
      <h1 classNameName="h1request">Your request:</h1>
      <div classNameName="request-container justify-content-center">
        <form classNameName="requestForm" onSubmit={handleSumbit}>
          <h2>Patient {localStorage.getItem("username")}: </h2>
          <div classNameName="form-group">
            <label htmlFor="inputPassword4" classNameName="form-label">
              <FaUserMd classNameName="icon" />
              Doctor ID
            </label>
            <div classNameName="dropdown">
              <button
                classNameName="btn btn-primary dropdown-toggle"
                type="button"
                id="doctorDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Select a doctor
              </button>
              <div classNameName="dropdown-menu" aria-labelledby="doctorDropdown">
                {doclist.map((doc) => (
                  <a
                    key={doc.doctorUsername}
                    classNameName="dropdown-item"
                    href="#"
                    onClick={() => setDoctorID(doc.doctorID)}
                  >
                    {doc.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div classNameName="form-group">
            <label htmlFor="inputAddress" classNameName="form-label">
              <FaPrescriptionBottleAlt classNameName="icon" />
              Medicine Required
            </label>
            <input
              type="text"
              classNameName="form-control"
              id="inputAddress"
              placeholder="Your medicine"
              value={drugName}
              onChange={(                event) => setMedicine(event.target.value)}
              />
            </div>
            <button type="submit" classNameName="btn btn-primary">
              Submit
            </button>
          </form>
          <img src={lol} classNameName="prescription-img" alt="Prescription" /> {/* Added alt attribute for accessibility */}
        </div>
      </div>
    );
  }
  
  export default PatientRequest;
  

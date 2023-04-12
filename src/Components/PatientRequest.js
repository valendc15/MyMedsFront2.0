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
      <h1 className="h1request">Your request:</h1>
      <div className="request-container justify-content-center">
        <form className="requestForm" onSubmit={handleSumbit}>
          <h2>Patient {localStorage.getItem("username")}: </h2>
          <div className="form-group">
            <label htmlFor="inputPassword4" className="form-label">
              <FaUserMd className="icon" />
              Doctor ID
            </label>
            <ul class="dropdown-menu">
            <li><span class="dropdown-item-text">Dropdown item text</span></li>
                {doclist.map((doc) => (
                  <li>
                    key={doc.doctorUsername}
                    className="dropdown-item"
                    href="#"
                    onClick={() => setDoctorID(doc.doctorID)}
                    </li>
                ))}
                </ul>
              </div>
          <div className="form-group">
            <label htmlFor="inputAddress" className="form-label">
              <FaPrescriptionBottleAlt className="icon" />
              Medicine Required
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="Your medicine"
              value={drugName}
              onChange={(                event) => setMedicine(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
          <img src={lol} className="prescription-img" alt="Prescription" /> {/* Added alt attribute for accessibility */}
        </div>
      </div>
    );
  }
  
  export default PatientRequest;
  

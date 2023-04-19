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
  const [error, setError] = useState(""); // Added state for error message
  const navigate = useNavigate();

  const patientId = localStorage.getItem("id");

  useEffect(() => {
    getDoctors();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    // Check for empty medicine name and selected doctor
    if (drugName === "" || docId === "") {
      setError("Please select a doctor and enter medicine name.");
    } else {
      const token = localStorage.getItem("token");
      let obj = { docId: parseInt(docId), drugName };
      fetch(`http://localhost:8080/patient/${patientId}/makeRequest`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
  }

  function getDoctors() {
    fetch(`http://localhost:8080/patient/viewDoctors/${patientId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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
        <form className="requestForm" onSubmit={handleSubmit}>
          <h2>Patient {localStorage.getItem("username")}: </h2>
          <div className="form-group">
            <label htmlFor="inputPassword4" className="form-label">
              <FaUserMd className="icon" />
              Doctor Username
            </label>
            <select
              className="form-control"
              onChange={(event) => setDoctorID(event.target.value)}
              value={docId} // Set the value of the select field to docId
            >
              <option value="">Select Doctor</option>
              {doclist.map((doc) => (
                <option key={doc.doctorUsername} value={doc.doctorID}>
                  {doc.doctorUsername} :{doc.doctorID}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="inputAddress" className="form-label">
            <FaPrescriptionBottleAlt className="icon" />
              Medicine Name
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="Enter Medicine Name"
              value={drugName} // Set the value of the input field to drugName
              onChange={(event) => setMedicine(event.target.value)}
            />
          </div>
          {error && ( // Render error message if error state is not empty
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        <div className="requestImgDiv">
          <img src={lol} alt="request" className="prescription-img" />
        </div>
      </div>
    </div>
  );
}

export default PatientRequest;

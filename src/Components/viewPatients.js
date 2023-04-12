import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MedicNavBar from "./MedicNavBar";
import { motion } from "framer-motion";

function ViewPatients() {
  const [patientList, setPatientList] = useState([]);
  const medicId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(()=>{
    handleOnClick()
},[])

  function handleOnClick() {
    fetch(`http://localhost:8080/doctor/listpatients/${medicId}`, {
      method: "GET",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
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
          setPatientList(data);
        } else {
          setPatientList([]);
        }
      });
  }

  function dismisP(dni) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/doctor/listpatients/${localStorage.getItem("id")}`, {
      method: "DELETE",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(dni),
    })
      .then((result) => {
        console.log(result);
        if (!result.ok) {
          throw Error("Error");
        }
        window.location.reload(false);
        return result.json();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to remove patient");
      });
  }

  return (
    <div>
      <MedicNavBar></MedicNavBar>
      <h1 className="text-center">Registered Patients</h1>
      <div className="d-flex justify-content-center"> {/* Updated: Center align button */}
      </div>
      <div className="row justify-content-center">
        {patientList.length > 0 ? (
          patientList.map((patient) => (
            <motion.div
              className="col-md-4 col-sm-6 mb-4"
              key={patient.dni}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card border-primary" style={{ width: "100%", padding: "10px" }}>
                <div className="card-body">
                  <h5 className="card-title">Name: {patient.username}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">DNI: {patient.dni}</h6>
                  <button className="btn btn-danger float-end" onClick={() => dismisP(patient.dni)}>
                    Dismiss Patient
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <h2 className="text-center mt-5"></h2>

        )}
      </div>
    </div>
  );
}

export default ViewPatients;

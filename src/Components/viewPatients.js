import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MedicNavBar from "./MedicNavBar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ViewPatients() {
  const [patientList, setPatientList] = useState([]);
  const [filteredPatientList, setFilteredPatientList] = useState([]);
  const medicId = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [dniFilter, setDniFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    handleOnClick();
  }, [dniFilter, nameFilter]);

  function handleOnClick() {
    fetch(`http://localhost:8080/doctor/listpatients/${medicId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
          setPatientList(data);
          filterPatients(data);
        } else {
          setPatientList([]);
          setFilteredPatientList([]);
        }
      });
  }

  function filterPatients(data) {
    const filteredPatients = data.filter(
      (patient) =>
        patient.dni.toString().includes(dniFilter.toString()) &&
        patient.username.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredPatientList(filteredPatients);
  }

  function goToInfo(dni, name) {
    sessionStorage.setItem("info", 1);
    navigate("/patientInfo", { state: { dni: dni, name: name } });
  }

  function dismisP(dni) {
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:8080/doctor/listpatients/${sessionStorage.getItem("id")}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

  const changeDNI = (event) => {
    setDniFilter(event.target.value);
  };

  const changeName = (event) => {
    setNameFilter(event.target.value);
  };

  return (
    <div>
      <MedicNavBar></MedicNavBar>
      <h1 className="text-center">Registered Patients</h1>
      <div className="containerinput mt-3">
      <input
        type="number"
        className="input"
        onChange={changeDNI}
        placeholder="Search by patient DNI"
      />
      <input
        type="text"
        className="input"
        onChange={changeName}
        placeholder="Search by patient Name"
      />
      </div>
      <div className="d-flex justify-content-center mt-3"></div>
      <div className="row justify-content-center">
        {filteredPatientList.length > 0 ? (
          filteredPatientList.map((patient) => (
            <motion.div
              className="col-md-4 col-sm-6 mb-4"
              key={patient.dni}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card border-dark" style={{ width: "100%", padding: "10px" }}>
                <div className="card-body">
                  <h5 className="card-title">Name: {patient.username}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">DNI: {patient.dni}</h6>
                  <button className="btn btn-info float-start" onClick={() => goToInfo(patient.dni, patient.username)}>
                    Info
                  </button>
                  <button className="btn btn-danger float-end" onClick={() => dismisP(patient.dni)}>
                    Dismiss Patient
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <h2 className="text-center mt-5">No patients found.</h2>
        )}
      </div>
    </div>
  );
}

export default ViewPatients;

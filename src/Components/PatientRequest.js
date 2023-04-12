import PatientNavBar from "./PatientNavBar";
import { useState } from "react";
import { toast } from "react-toastify";
import lol from "./prescription.jpg";
import { FaUser, FaUserMd, FaPrescriptionBottleAlt } from "react-icons/fa";





function PatientRequest(){

    const [drugName, setMedicine]=useState("")
    const [docId, setDoctorID]=useState("")
    const userName=localStorage.getItem("username")

    const patientId=localStorage.getItem('id')


    function handleSumbit(e){
        e.preventDefault();
        const token=localStorage.getItem("token")
        let obj={docId: parseInt(docId),drugName}
        fetch(`http://localhost:8080/patient/${patientId}/makeRequest`,{
            method:"PUT",
            headers: { 'content-type': 'application/json' ,'Authorization': `Bearer ${token}`},
            body: JSON.stringify(obj)
        }).then(data=>{
            if (data.status==404){
                throw Error("Error")
            }
            toast.success("Request sent!")
        }).catch(err=>{
            toast.error("Failed to send request!")
        })
    }
    




    return (
      <div>
        <PatientNavBar />
        <h1 className="h1request">Your request:</h1>
        <div className="request-container justify-content-center">
          <form className="requestForm" onSubmit={handleSumbit}>
            <div className="form-group">
              <label htmlFor="inputEmail4" className="form-label">
                <FaUser className="icon" />
                Patient name
              </label>
              <input
                className="form-control"
                id="disabledInput"
                type="text"
                placeholder={localStorage.getItem("username")}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword4" className="form-label">
                <FaUserMd className="icon" />
                Doctor ID
              </label>
              <input
                type="number"
                className="form-control"
                id="inputPassword4"
                value={docId}
                onChange={(e) => setDoctorID(e.target.value)}
                required // Added required attribute for validation
              />
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
                onChange={(e) => setMedicine(e.target.value)}
                required // Added required attribute for validation
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Request
            </button>
          </form>
          <img src={lol} className="prescription-img" alt="Prescription" /> {/* Added alt attribute for accessibility */}
        </div>
      </div>
    );
    
}

export default PatientRequest;
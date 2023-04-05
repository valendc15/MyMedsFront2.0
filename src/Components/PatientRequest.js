import PatientNavBar from "./PatientNavBar";
import { useState } from "react";
import { toast } from "react-toastify";




function PatientRequest(){

    const [drugName, setMedicine]=useState("")
    const [docId, setDoctorID]=useState("")
    const userName=localStorage.getItem("username")

    const patientId=localStorage.getItem('id')


    function handleSumbit(e){
        e.preventDefault();
    
        let obj={docId: parseInt(docId),drugName}
        fetch(`http://localhost:8080/patient/${patientId}/makeRequest`,{
            method:"PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(obj)
        }).then(data=>{
            if (!data.ok){
                throw Error("Error")
            }
            toast.success("Request sent!")
        }).catch(err=>{
            toast.error("Failed to send request!")
        })
    }
    




    return(
        <div>
        <PatientNavBar></PatientNavBar>
        <h1 className="h1request">Your request:</h1>
        <form className="row g-3 requestForm" onSubmit={handleSumbit}>
  <div class="col-md-6">
    <label for="inputEmail4" class="form-label">Patient name</label>
    <input class="form-control" id="disabledInput" type="text" placeholder={localStorage.getItem('username')} disabled/>

  </div>
  <div class="col-md-6">
    <label for="inputPassword4" class="form-label">Doctor ID</label>
    <input type="number" class="form-control" id="inputPassword4"
    value={docId}
    onChange={(e)=>setDoctorID(e.target.value)}
    />
  </div>
  <div class="col-12">
    <label for="inputAddress" class="form-label">Medicine Required</label>
    <input type="text" class="form-control" id="inputAddress" placeholder="Your medicine"
       value={drugName}
       onChange={(e)=>setMedicine(e.target.value)}/>
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-primary">Request</button>
  </div>
</form>
  </div>

    )
}

export default PatientRequest;
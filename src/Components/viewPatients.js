import { useEffect, useState} from "react";
import { toast } from "react-toastify";
import React from "react";
import MedicNavBar from "./MedicNavBar";


function ViewPatients(){


    const[patientList, setPatinetList]=useState("")
    const medicId=localStorage.getItem("id")

    function handleClick(){
        fetch(`http://localhost:8080/doctor/listpatients/${medicId}`)
        .then(response =>{
            if (!response.ok){
                throw Error
            }
            return (response.json())
        }).then((data)=>{
            const patients=data.map(patient=>
                <div class="card border-primary mb-3" styles="width: 18rem; padding:10px">
                <div class="card-body">
                <h5 class="card-title">Name: {patient.username}</h5>
                <h6 class="card-subtitle mb-2 text-muted">DNI:{patient.dni}</h6>
                <button className="btn btn-danger d-flex justify-content-end" onClick={()=>{
                    dismisP(patient.dni)
                }}>Dismiss Patient</button>
                </div>
                </div>
                )
                setPatinetList(patients)
        }).catch(err=>{
            toast.warning('Failed to show patients')
        })
    }

    function dismisP(dni){
    fetch("http://localhost:8080/", {
    method: "POST",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(dni)
  })
  .then(result =>{
    console.log(result)
    if (!result.ok){
      throw Error("Error")
    }
    return result.json()

  }).catch(error=>{
    console.log(error)
    toast.error('Failed to remove patient');
  })


    }

    return(
        <div>
            <MedicNavBar></MedicNavBar>
            <h1>Registered Patients</h1>
            <button className="btn btn-info" onClick={handleClick}>Show Patients</button>
            {patientList}

        </div>
    )
}

export default ViewPatients;
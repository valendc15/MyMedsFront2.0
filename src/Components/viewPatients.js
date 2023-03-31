import { useEffect, useState} from "react";
import { toast } from "react-toastify";
import React from "react";
import { Button } from "bootstrap";


function ViewPatients(){


    const[patientList, setPatinetList]=useState("")
    const medicId=localStorage.getItem("id")

    function handleClick(){
        fetch(`http://localhost:8080/patient/${medicId}`)
        .then(response =>{
            if (!response.ok){
                throw Error
            }
            return (response.json())
        }).then((data)=>{
            const patients=data.map(patient=>
                <div class="card" style="width: 18rem;">
                <div class="card-body">
                <h5 class="card-title">Name: {patient.username}</h5>
                <h6 class="card-subtitle mb-2 text-muted">ID:{patient.primarykey}</h6>
                </div>
                </div>
                )
                setPatinetList(patients)
        }).catch(err=>{
            toast.warning('Failed to show patients')
        })
    }


    return(
        <div>
            <h1>Registered Patients</h1>
            <button onClick={handleClick}>Show Patients</button>
            {patientList}

        </div>
    )
}

export default ViewPatients;
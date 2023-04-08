import { useEffect, useState} from "react";
import { toast } from "react-toastify";
import React from "react";
import MedicNavBar from "./MedicNavBar";


function ViewPatients(){


    const[patientList, setPatinetList]=useState([])
    const[buttonClose, setButtonClose]=useState(false)
    const medicId=localStorage.getItem("id")
    const token=localStorage.getItem("token")


    function handleOnClickClose(){
        setButtonClose(false)
    }


    function handleOnClick(){
        fetch(`http://localhost:8080/doctor/listpatients/${medicId}`,{
            method: "GET",
            headers: {'content-type': 'application/json', 'Authorization': `Bearer ${token}`}
        })
        .then(response =>{
            if (response.status!=302){
                throw Error
            }
            return (response.json())
        }).then((data)=>{
            if (data!=null || data!=undefined){
                setPatinetList(data)
            }
            else{
                const patient = <h1 className="justify-content-md-center">There are no registered Patients</h1>
                setPatinetList(patient)
            }
        })
        setButtonClose(true)
    }
    function dismisP(dni){
    const token=localStorage.getItem("token")
    fetch(`http://localhost:8080/doctor/listpatients/${localStorage.getItem('id')}`, {
    method: "DELETE",
    headers: { 'content-type': 'application/json' ,'Authorization': `Bearer ${token}` },
    body: JSON.stringify(dni)
  })
  .then(result =>{
    console.log(result)
    if (!result.ok){
      throw Error("Error")
    }
    window.location.reload(false)
    return result.json()

  }).catch(error=>{
    console.log(error)
    toast.error('Failed to remove patient');
  })


    }

    {if(buttonClose==false){
        return(
            <div>
            <MedicNavBar></MedicNavBar>
            <h1>Registered Patients</h1>
            <button className="btn btn-info" onClick={handleOnClick}>Show Patients</button>
            </div>


    )
    }
    else{
        return(
            <div>
                <MedicNavBar></MedicNavBar>
                <h1>Registered Patients</h1>
                <button className="btn btn-dark" onClick={handleOnClickClose}>Close</button>
                <div class="aiuda">
                {
                    patientList.map(patient=>{
                        return(
                        <div class="card border-primary mb-3 items" styles="width: 18rem; padding:10px">
                        <div class="card-body">
                        <h5 class="card-title">Name: {patient.username}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">DNI:{patient.dni}</h6>
                        <button className="btn btn-danger d-flex justify-content-end" onClick={()=>{
                            dismisP(patient.dni)
                        }}>Dismiss Patient</button>
                        </div>
                        </div>
                        )
                    })
                }
                </div>
            </div>
        )
    }
}
}

export default ViewPatients;
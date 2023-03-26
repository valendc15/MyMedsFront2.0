import React from 'react'
import Patient from './Patient.bmp'



function CardP(){

    return(
        <div className="card ">
            <img src={Patient}></img>
            <div className="card-body">
                <h4 className="card-title">Register as a Patient </h4>
                <p className="card-text text-secondary">Register as a patient to be able to request prescriptions</p>
            </div>
        </div>
    )
}


export default CardP;
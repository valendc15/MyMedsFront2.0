import React from 'react'
import Medic from './Medic.bmp'



function CardM(){

    return(
        <div className="card ">
            <img src={Medic}></img>
            <div className="card-body">
                <h4 className="card-title">Register as a Medic </h4>
                <p className="card-text text-secondary">Register as a medic to be able to create and give prescriptions</p>
            </div>
        </div>
    )
}

export default CardM

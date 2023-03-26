import React from 'react'
import Pharmacy from './Pharmacy.bmp'



function CardPh(){

    return(
        <div className="card">
            <img src={Pharmacy}></img>
            <div className="card-body">
                <h4 className="card-title">Register as a PH </h4>
                <p className="card-text text-secondary">Register as a Pharmacy to be able to validate prescriptions</p>
            </div>
        </div>
    )
}

export default CardPh
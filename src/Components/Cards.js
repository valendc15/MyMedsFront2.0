import CardP from "./CardP";
import CardM from "./CardM";
import CardPh from "./CardPh";
import Logo from "./MyMedsLogo.png"
import { useState, useEffect } from 'react';
import RegisterPatient from "./RegisterPatient";
import RegisterMedic from "./RegisterMedic";
import RegisterPharmacy from "./RegisterPharmacy";
import { Link } from "react-router-dom";


function Cards(){

    
    const [showAll, setShowAll] = useState(true)
    const [showP, setShowP]=useState(false)
    const [showM, setShowM]=useState(false)
    const [showPh, setShowPh]=useState(false)


    function handleOnClickP(){
        setShowAll(false);
        setShowP(true);
        setShowM(false)
        setShowPh(false)
    }

    function handleOnClickM(){
        setShowAll(false)
        setShowM(true)
        setShowP(false)
        setShowPh(false)
    }

    function handleOnClickPh(){
        setShowAll(false)
        setShowM(false)
        setShowP(false)
        setShowPh(true)
    }

    function handleOnClickBack(){
        setShowAll(true);
        setShowP(false)
        setShowM(false)
        setShowPh(false)

    }



    {if (showAll){
    return(
        <div className="container d-flex justify-content-center align-items-center h-100">
            <img src={Logo}/>

            <div className="row">
                <div className="col-md-4 col-xs-6" >
                    <CardP></CardP>
                    <button className='btn btn-dark ' onClick={handleOnClickP}>Register as a patient</button>
                </div>
                <div className="col-md-4 col-xs-6">
                    <CardM></CardM>
                    <button className='btn btn-dark' onClick={handleOnClickM}>Register as a medic</button>
                </div>
                <div className="col-md-4 col-xs-6">
                    <CardPh></CardPh>
                    <button className='btn btn-dark' onClick={handleOnClickPh}>Register as a pharmacy</button>
                </div>
                <Link to="/login"><button className="btn btn-warning w-25 position-absolute bottom-0 end-0">Already have an account? Click Here.</button></Link>
            </div>

        </div>
    )}

    else if(showP){
        return(
            <div className="container d-flex justify-content-center align-items-center h-100">
            <img src={Logo}/>

            <div className="row">
                <div className="col-md-5" >
                    <CardP></CardP>
                    <button className='btn btn-dark ' onClick={handleOnClickBack}>Go Back</button>
                </div>
                <div className="col-md-4">
                    <RegisterPatient></RegisterPatient>
                </div>
                <div className="col-md-4">
                </div>
            </div>
        </div>
        )
    }
    else if(showM){
        return(
            <div className="container d-flex justify-content-center align-items-center h-100">
            <img src={Logo}/>

            <div className="row">
                <div className="col-md-5" >
                    <CardM></CardM>
                    <button className='btn btn-dark ' onClick={handleOnClickBack}>Go Back</button>
                </div>
                <div className="col-md-4">
                    <RegisterMedic></RegisterMedic>
                </div>
                <div className="col-md-4">
                </div>
            </div>
        </div>
        )
    }
    else{
        return(
            <div className="container d-flex justify-content-center align-items-center h-100">
            <img src={Logo}/>

            <div className="row">
                <div className="col-md-5" >
                    <CardPh></CardPh>
                    <button className='btn btn-dark ' onClick={handleOnClickBack}>Go Back</button>
                </div>
                <div className="col-md-4">
                    <RegisterPharmacy></RegisterPharmacy>
                </div>
                <div className="col-md-4">
                </div>
            </div>
        </div>

        )
    }
}

}



export default Cards;
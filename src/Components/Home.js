import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";




function Home(){
    const navigate=useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/login')
        }
    },[])

    



    return(
        <div>
        <h1>Hola</h1>
        <button className="btn btn-warning" onClick={()=>{localStorage.removeItem('token')}}>Log out</button>
        </div>
    )
}

export default Home;
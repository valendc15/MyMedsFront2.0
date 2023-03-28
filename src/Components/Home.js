import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";




function Home(){
    const navigate=useNavigate();
    const [name, setName] = useState('hhvv')

    useEffect(()=>{
        let localStoragetoken=sessionStorage.getItem('token');
        if(localStoragetoken==='' || localStoragetoken===undefined){
            navigate('/login');
        }
    },[])

    function Logout(){
        sessionStorage.removeItem('token')
    }
    
    return(
        <div>
        <h1>Hola</h1>
        <button className="btn btn-warning" onClick={Logout()}>Log out</button>
        </div>
    )
}

export default Home;
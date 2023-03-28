import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";




function Home(){
    const navigate=useNavigate();
    const [name, setName] = useState('hhvv')

    useEffect(()=>{
        let localStoragetoken=localStorage.getItem('token');
        if(localStoragetoken==='' || localStoragetoken===undefined){
            navigate('/login');
        }
    },[])

    function Logout(){
        localStorage.clear()
    }
    
    return(
        <div>
        <h1>Hola</h1>
        <button className="btn btn-warning" onClick={Logout()}>Log out</button>
        </div>
    )
}

export default Home;
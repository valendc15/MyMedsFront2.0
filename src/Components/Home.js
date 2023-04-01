import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";




function Home(){
    const navigate=useNavigate();
    const [name, setName] = useState('hhvv')

    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/login');
        }
    },[])

    



    
    return(
        <div>
        <h1>Hola</h1>
        <button className="btn btn-warning" onClick={()=>{localStorage.removeItem('token');window.location.reload(false);localStorage.removeItem('id')}}>Log out</button>
        <button className="btn btn-info" onClick={navigate('/search')}>Go to Search</button>
        </div>
    )
}

export default Home;
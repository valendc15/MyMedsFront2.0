import Logo from "./MyMedsLogo.png"
import { Link,useNavigate } from "react-router-dom";
import { useEffect } from "react";



function MedicNavBar(){

    const navigate=useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/login');
        }
    },[])
    

    return(
        <nav>
            <img src={Logo} ></img>
            <div>
                <ul id="navbar">
                    <li><Link to="/home" className="link">Home</Link></li>
                    <li><Link to="/search" className="link">Search Patient</Link></li>
                    <li><Link to="/viewPatients" className="link">View Patients</Link></li>
                    <button className="btn btn-warning"onClick={()=>{localStorage.removeItem('token');window.location.reload(false);localStorage.removeItem('id')}}>LogOut</button>
                </ul>
            </div>
        </nav>
    )
}


export default MedicNavBar;
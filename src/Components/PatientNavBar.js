import Logo from "./MyMedsLogo.png"
import { Link,useNavigate } from "react-router-dom";
import { useEffect} from "react";


function PatientNavBar(){

    const navigate=useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/login');
        }
       
    },[])


    function logout(){
        fetch(`http://localhost:8080/token/${localStorage.getItem('id')}`, {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body:localStorage.getItem('token')
          })
        localStorage.removeItem('token');
        window.location.reload(false);
        localStorage.removeItem('id')
    }
    
    
    return(
        <nav>
            <img src={Logo} ></img>
            <div>
                <ul id="navbar">
                    <li><Link to="/home" className="link">Info</Link></li>
                    <li><Link to="/requestsP" className="link">Request Prescripiton</Link></li>
                    <button className="btn btn-warning"onClick={logout}>LogOut</button>
                </ul>
            </div>
        </nav>
    )
}


export default PatientNavBar;
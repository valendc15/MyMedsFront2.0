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
    
    function checkToken(){
        const token=localStorage.getItem("token")
        fetch(`http://localhost:8080/patient/tokenPatient`, {
            method: "GET",
            headers: { 'content-type': 'application/json','Authorization': `Bearer ${token}` },
          }).then(response=>{
            if (response.status===401){
                localStorage.clear()
                navigate('/login')
            }
          })
    }
    
    return(
        <nav className="d-flex align-items-center">
            <img src={Logo} style={{width:200}} ></img>
            <div>
                <ul id="navbar" className="mb-1">
                    <li><Link to="/home" className="link" onClick={checkToken}>Info</Link></li>
                    <li><Link to="/requestsP" className="link" onClick={checkToken}>Request Prescripiton</Link></li>
                    <li><Link to="/viewRequestsP" className="link" onClick={checkToken}>View sent requests</Link></li>
                    <button className="btn btn-warning"onClick={logout}>LogOut</button>
                </ul>
            </div>
        </nav>
    )
}


export default PatientNavBar;
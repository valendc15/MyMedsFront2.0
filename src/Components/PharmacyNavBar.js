import Logo from "./MyMedsLogo.png"
import { Link,useNavigate } from "react-router-dom";
import { useEffect} from "react";


function PharmacyNavBar(){

    const navigate=useNavigate()
    useEffect(()=>{
        if(!sessionStorage.getItem('token')){
            navigate('/login');
        }
        checkToken()
       
    },[])


    function logout(){
        fetch(`http://localhost:8080/token/${sessionStorage.getItem('id')}`, {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body:sessionStorage.getItem('token')
          })
        sessionStorage.removeItem('token');
        window.location.reload(false);
        sessionStorage.removeItem('id')
    }
    
    function checkToken(){
        const token=sessionStorage.getItem("token")
        fetch(`http://localhost:8080/pharmacy/tokenPharmacy`, {
            method: "GET",
            headers: { 'content-type': 'application/json','Authorization': `Bearer ${token}` },
          }).then(response=>{
            if (response.status===403 || response.status===401){
                sessionStorage.clear()
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
                    <li><Link to="/pharmacyRequest" className="link" onClick={checkToken}>Manage Recepies</Link></li>
                    <li><Link to="/history" className="link" onClick={checkToken}>History</Link></li>
                    <li><Link to="/Scanner" className="link" onClick={checkToken}>Scanner</Link></li>
                    <li><Link to="/medicineSearch" className="link" onClick={checkToken}>Add Medication</Link></li>
                    <li><Link to="/pharmacyStock" className="link" onClick={checkToken}>Stock</Link></li>
                    <button className="btn btn-warning"onClick={logout}>LogOut</button>
                </ul>
            </div>
        </nav>
    )
}


export default PharmacyNavBar;
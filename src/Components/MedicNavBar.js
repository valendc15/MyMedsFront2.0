import Logo from "./MyMedsLogo.png"
import { Link } from "react-router-dom";



function MedicNavBar(){
    

    return(
        <nav>
            <img src={Logo} ></img>
            <div>
                <ul>
                    <li><Link to="/search">Search Patient</Link></li>
                    <li><Link to="/viewPatients">View Patients</Link></li>
                </ul>
            </div>
        </nav>
    )
}


export default MedicNavBar;
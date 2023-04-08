import { Button } from "bootstrap";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import Popup from "./PopUp";
import MedicNavBar from "./MedicNavBar";
import { useNavigate } from "react-router-dom";




function Search(){

    const navigate=useNavigate()
    const [id, dnichange] = useState("");
    const [popUpState, setpopUpState]=useState(false)
    const [username, setUsernam] =useState('')


    const handlesubmit = (e) => {
        e.preventDefault();
        const token=localStorage.getItem('token');
        fetch(`http://localhost:8080/doctor/getPatientById/${id}`,{
            method:"GET",
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}`,}
        })
        .then(response =>{
            console.log(response);
            if (response.status!=302){
                throw Error
            }
            else if (result.status==401){
                localStorage.clear()
                navigate('/login')
            }
            return (response.json())
        }).then((data)=>{
            console.log(data.primarykey);
            setUsernam(data.username)
            setpopUpState(true)
        }).catch(err=>{
            toast.error("Patient not found!")
        })
    }

    function connect(){
        const medicId= parseInt( localStorage.getItem("id"))
        const token=localStorage.getItem("token")
        let obj={id,medicId}
        fetch(`http://localhost:8080/doctor/addpatient/${medicId}`,{
            method:"PUT",
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}`,
        },
            body: JSON.stringify(id)
        }).then(result=>{
            if (result.status!=202){
                throw Error("Error")
            }
            else if (result.status==401){
                localStorage.clear()
                navigate('/login')
            }
            toast.success("User succesfully registered!")
        }).catch(err=>{
            toast.error("Failed to register patient!")
        })
    }




    return(
        <div>      
            <MedicNavBar></MedicNavBar>
                 
                 
                 <p className="font-weight-light text-center searchparagraph"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-vcard" viewBox="0 0 16 16">
        <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5ZM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z"/>
        <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12V4Z"/>
      </svg> Add your patients by searching with their DNI</p>
        <div className="search d-flex justify-content-center">
            <form class="row row-cols-lg-auto g-3" onSubmit={handlesubmit}>
	<div class="col-md-2">
		<label for="inputMessage" class="visually-hidden">Message</label> <input
			type="number" class="form-control" id="inputMessage"
			placeholder="Patient DNI"
            value={id} onChange={e => dnichange(e.target.value)} />
	</div>
	<div class="col-sm-2">
		<button type="submit" class="btn btn-primary"
        ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg></button>
	</div>
</form> 
        <Popup trigger={popUpState} setTrigger={setpopUpState}>
            <h3>
                Patient: {username}
            </h3>
            <h4>
                DNI:{id}
            </h4>
            <p>
                Do you wish to register {username} as your patient?
            </p>
            <button className="btn btn-success" onClick={connect}>Register</button>
        </Popup>
        </div>
        </div>
    )
}

export default Search;
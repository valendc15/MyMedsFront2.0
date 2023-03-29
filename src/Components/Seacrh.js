import { Button } from "bootstrap";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import Popup from "./PopUp";



function Search(){


    const [id, dnichange] = useState("");
    const [popUpState, setpopUpState]=useState(false)
    const [username, setUsernam] =useState('')


    const handlesubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/patient/${id}`)
        .then(response =>{
            return (response.json())
        }).then((data)=>{
            console.log(data.primarykey);
            setUsernam(data.username)
            setpopUpState(true)
        })
    }

    function connect(){
        const medicId=localStorage.getItem("id")
        let obj={id,medicId}
        fetch(`http://localhost:8080/doctor/addpatient/${medicId}`,{
            method:"PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(id)
        }).then(data=>{
            toast.success("User succesfully registered!!")
        })
    }




    return(
        <div className="search">
            <form class="row row-cols-lg-auto g-3" onSubmit={handlesubmit}>
	<div class="col-sm-2 w-50">
		<label for="inputMessage" class="visually-hidden">Message</label> <input
			type="number" class="form-control" id="inputMessage"
			placeholder="Search for a patient using their DNI"
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
    )
}

export default Search;
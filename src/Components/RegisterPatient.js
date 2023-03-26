import { useState, useEffect } from 'react'
import {toast} from "react-toastify";
import { Link, useNavigate } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';



function RegisterPatient(){

  const [dni, dnichange] = useState("");
  const [username, namechange] = useState("");
  const [password, passwordchange] = useState("");
  const [mail, emailchange] = useState("");

  const navigate = useNavigate();


  const handlesubmit = (e) => {
    e.preventDefault();
    let regobj = { dni, username, password, mail };
    console.log(regobj)
    fetch("http://localhost:8080/patient", {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(regobj)
  }).then((res) => {
      toast.success('Registered successfully.')
      navigate('/login');
  }).catch((err) => {
      toast.error('Failed :' + err.message);
  });
  
  
  
  }
    
   


  return(



    <div >
      
    <form className='form' onSubmit={handlesubmit}>
    <div className="form-group">
    <label>Username</label>
    <input type="text" className="form-control" id="text" placeholder="Enter your username"
    value={username} onChange={e => namechange(e.target.value)}/>
  </div>
  <div className="form-group">
    <label >Email</label>
    <input type="email" className="form-control" id="email" placeholder="Enter your Email"
     value={mail} onChange={e => emailchange(e.target.value)}/>
  </div>
  <div className="form-group">
    <label>Password</label>
    <input type="password" className="form-control" id="password" placeholder="Enter your Password"
    value={password} onChange={e => passwordchange(e.target.value)}/>
  </div>
  <div className="form-group ">
    <label>DNI</label>
    <input type="number" className="form-control" id="dni" placeholder="Enter your DNI"
     value={dni} onChange={e => dnichange(e.target.value)}/>
  </div>
  <div className="submit-group">
              <button type="submit" className='btn btn-primary' id="reggisterBtn">Register</button>
              </div>
</form>

</div>

  )
}

export default RegisterPatient
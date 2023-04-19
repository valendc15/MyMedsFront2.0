import { useState, useEffect } from 'react'
import {toast} from "react-toastify";
import { Link, useNavigate } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';

function RegisterMedic(){

  const [id, idchange] = useState("");
  const [username, namechange] = useState("");
  const [password, passwordchange] = useState("");
  const [mail, emailchange] = useState("");

  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    let regobj = { id, username, password, mail };
    console.log(regobj)
    fetch("http://localhost:8080/doctor/saveDoctor", {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(regobj)
  }).then((res) => {
      if (!res.ok){
        throw Error("Error")
      }
      toast.success('Registered successfully.')
      navigate('/login');
  }).catch((err) => {
      toast.error('Failed to register');
  });
  }

  return(
    <div>
      <form className='form' onSubmit={handlesubmit} style={{ maxWidth: '500px', margin: 'auto' }}> 
        <div className="form-group">
          <label>Username</label>
          <input type="text" className="form-control" id="text" placeholder="Enter your username" 
            value={username} onChange={e => namechange(e.target.value)} style={{ fontSize: '18px', padding: '12px' }}/>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" id="email" placeholder="Enter your Email"
            value={mail} onChange={e => emailchange(e.target.value)} style={{ fontSize: '18px', padding: '12px' }}/>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" id="password" placeholder="Enter your Password"
            value={password} onChange={e => passwordchange(e.target.value)} style={{ fontSize: '18px', padding: '12px' }}/>
        </div>
        <div className="form-group">
          <label>id</label>
          <input type="number" className="form-control" id="id" placeholder="Enter your ID"
            value={id} onChange={e => idchange(e.target.value)} style={{ fontSize: '18px', padding: '12px' }}/>
        </div>
        <div className="submit-group">
          <button type="submit" className='btn btn-primary' id="reggisterBtn" style={{ fontSize: '18px', padding: '12px' }}>Register</button>
        </div>
      </form>
    </div>
  )
}

export default RegisterMedic

import Logo from "./MyMedsLogo.png"
import { Link, useHistory, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";





function Login(){
  const navigate=useNavigate();
  const [mail, setEmail]=useState("");
  const [password, setPassword] = useState("");

  


  const handlesubmit = (e) => {
  console.log(mail, password);
  e.preventDefault();
  let regobj = {mail, password };
  console.log(regobj)
  fetch("http://localhost:8080/login", {
    method: "POST",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(regobj)
  })
  .then(result =>{
    console.log(result)
    if (!result.ok){
      throw Error("Error")
    }
    return result.json()

  }).then((data)=>{
    toast.success('Logged succesfully!')
    localStorage.setItem('token',data.token)
    localStorage.setItem('id',data.primarykey)
    localStorage.setItem('username',data.username)
    if(data.userType==="DOCTOR"){
      navigate('/search')
    }
    else if(data.userType==="PATIENT") navigate('/requestsP')
    else{
      navigate('/home')
    }
  }).catch(error=>{
    console.log(error)
    toast.error('Failed to log in');
  })



}




    return(
        <div className="container-fluid bg">
            <div className="row">
                <div className="col-md-4 col-sm-4 col-xs-12">
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12">
                
                <form className="form-container" onSubmit={handlesubmit}>
                <img src={Logo} className="logo1"/>
                <div class="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"
                  value={mail}
                  onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <button type="submit" class="btn btn-success w-100">Submit</button>
              </form>

                </div>
                <div className="col-md-4 col-sm-4 col-xs-12"></div>

            </div>
            <Link to="/Register"><button className="btn btn-info position-absolute bottom-0 end-0">Don't have an account? Register here.</button></Link>
        </div>
    )
}

export default Login;
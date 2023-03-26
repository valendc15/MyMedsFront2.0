import { useState, useEffect } from 'react'

function RegisterPatient(){

  return(
    <div >
      
    <form className='form'>
    <div className="form-group">
    <label>Username</label>
    <input type="text" className="form-control" id="text" placeholder="Enter your username"/>
  </div>
  <div className="form-group">
    <label >Email</label>
    <input type="email" className="form-control" id="email" placeholder="Enter your Email"/>
  </div>
  <div className="form-group">
    <label>Password</label>
    <input type="password" className="form-control" id="password" placeholder="Enter your Password"/>
  </div>
  <div className="form-group ">
    <label>DNI</label>
    <input type="number" className="form-control" id="dni" placeholder="Enter your DNI"/>
  </div>
  <div className="submit-group">
              <button type="submit" className='btn btn-primary' id="reggisterBtn">Register</button>
              </div>
</form>

</div>

  )
}

export default RegisterPatient
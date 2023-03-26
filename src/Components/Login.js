import Logo from "./MyMedsLogo.png"
import { Link } from "react-router-dom";

function Login(){
    return(
        <div className="container-fluid bg">
            <div className="row">
                <div className="col-md-4 col-sm-4 col-xs-12">
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12">
                
                <form className="form-container">
                <img src={Logo} className="logo1"/>
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
  </div>
  <br></br>
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
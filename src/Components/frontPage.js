import background from './background.png';
import { useNavigate } from 'react-router-dom';

const Hola = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Replace '/login' with the actual login route path
  };

  const handleSignupClick = () => {
    navigate('/Register'); // Replace '/signup' with the actual signup route path
  };

  return (
    <div>
      <head>
        <title>Welcome to your personal prescription handler</title>
      </head>
      <div className="header-area header-bg" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', height: '100vh' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 d-flex align-items-center justify-content-center">
              <h1 className="welcome title text-white">Welcome to your personal prescription handler</h1>
              <div className="d-flex flex-column mt-4">
                <button className="button-6 login-button" onClick={handleLoginClick}>Login</button>
                <button className="button-6 signup-button" style={{ marginTop: '15%' }} onClick={handleSignupClick}>Sign up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hola;

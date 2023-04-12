import Card from './Components/CardP';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './Register';
import Login from './Components/Login';
import { ToastContainer } from 'react-toastify';
import InfoPage from './Components/Home';
import Search from './Components/Seacrh';
import ViewPatients from './Components/viewPatients';
import PatientRequest from './Components/PatientRequest';
import ViewRequests from './Components/viewRequests';

function App() {

  return (
    <div>
    <ToastContainer></ToastContainer>
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/Register" element={<Register></Register>}/>
        <Route exact path='/home' element={<InfoPage></InfoPage>}/>
        <Route exact path='/search' element={<Search></Search>}/>
        <Route exact path='/viewPatients' element={<ViewPatients></ViewPatients>}/>
        <Route exact path='/requestsP' element={<PatientRequest></PatientRequest>}/>
        <Route exact path='/viewRequests' element={<ViewRequests></ViewRequests>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;




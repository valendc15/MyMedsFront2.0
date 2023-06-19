import Card from './Components/CardP';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import hola from './Components/frontPage';
import Register from './Register';
import Login from './Components/Login';
import { ToastContainer } from 'react-toastify';
import InfoPage from './Components/Home';
import Search from './Components/Seacrh';
import ViewPatients from './Components/viewPatients';
import PatientRequest from './Components/PatientRequest';
import ViewRequests from './Components/viewRequests';
import ViewRequestsP from './Components/viewRequestsP';
import PharmacyRequest from './Components/PharmacyRequests';
import PharmacyHistory from './Components/PharmacyHistory';
import Scanner from './Components/scanner';
import PatientInfo from './Components/patientInfo';
import MedicineSearch from './Components/medicineSearch';



function App() {
  return (
    <div>
      <ToastContainer></ToastContainer>
      <Router>
        <Routes>
          <Route path='' Component={hola}></Route>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/Register" element={<Register />} />
          <Route exact path="/home" element={<InfoPage />} />
          <Route exact path="/search" element={<Search />} />
          <Route exact path="/viewPatients" element={<ViewPatients />} />
          <Route exact path="/requestsP" element={<PatientRequest />} />
          <Route exact path="/viewRequests" element={<ViewRequests />} />
          <Route exact path="/viewRequestsP" element={<ViewRequestsP />} />
          <Route exact path="/history" element={<PharmacyHistory></PharmacyHistory>}/>
          <Route exact path="/pharmacyRequest" element={<PharmacyRequest></PharmacyRequest>}/>
          <Route exact path='/Scanner'element={<Scanner></Scanner>}/>
          <Route exact path='/patientInfo'element={<PatientInfo></PatientInfo>}/>
          <Route exact path='/medicineSearch'element={<MedicineSearch></MedicineSearch>}/>
        </Routes>
      </Router>
    </div>
  );
}


export default App;




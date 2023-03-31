import Card from './Components/CardP';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './Register';
import Login from './Components/Login';
import { ToastContainer } from 'react-toastify';
import Home from './Components/Home';
import Search from './Components/Seacrh';
import ViewPatients from './Components/viewPatients';

function App() {

  return (
    <div>
    <ToastContainer></ToastContainer>
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/Register" element={<Register></Register>}/>
        <Route exact path='/home' element={<Home></Home>}/>
        <Route exact path='/search' element={<Search></Search>}/>
        <Route exact path='/viewPatients' element={<ViewPatients></ViewPatients>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;




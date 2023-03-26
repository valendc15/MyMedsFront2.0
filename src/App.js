import Card from './Components/CardP';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './Register';
import Login from './Components/Login';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/Register" element={<Register></Register>}/>
      </Routes>
    </Router>
  );
}

export default App;




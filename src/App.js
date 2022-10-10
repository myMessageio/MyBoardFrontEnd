
import './App.css';
import { BrowserRouter  } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./components/Loading/components/PreLoader3";
import User from "./layouts/User.js";


function App() {
 
  return (
    <BrowserRouter basename="/MyBoard">
       <User/>
    </BrowserRouter>
 
  


  );
}

export default App;

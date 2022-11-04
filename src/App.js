
import './App.css';
import { BrowserRouter  } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./components/Loading/components/PreLoader3";
import User from "./layouts/User.js";
import 'react-toastify/dist/ReactToastify.css';

function App() {
 
  return (
    <BrowserRouter basename="/MyBoard">
       <User/>
    </BrowserRouter>
 
  


  );
}

export default App;

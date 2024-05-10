import React, {useState, useEffect} from 'react'; 
import Home from './Home'
import Body from './Body'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShotChart from './ShotChart'
import TeamInfo from './TeamInfo'
import Login from "./Login"
import Game from "./Game"
import Front from "./Front"

function App() {

  return (
    <Router>
      <div>
        <Home />
        <div>
          <Routes>
            <Route path = "/" element ={<Front />} />
            <Route path="/playerhistory" element={<Body />} />
            <Route path="/morestats" element={<ShotChart />} />
            <Route path="/teaminfo" element={<TeamInfo />} />
            <Route path='/login' element={<Login />} />
            <Route path ='/game' element={<Game />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

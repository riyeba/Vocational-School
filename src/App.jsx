import React from "react";

import { Route, Router, Routes } from "react-router";







import GreenLeafSignUp from "./components/SignIn";
import GreenLeafEvents from "./components/Upcoming";
import GreenLeafProfile from "./components/Profile";
// import Header from "./components/Header";
import GreenLeafFeed from "./components/GreenField";
import SportsConnect from "./CoonectScrolldown";

import Header from "./components/Header";

import NewProfile from "./NewProfile";
import MediawithThree from "./components/MediaThree";



function App() {
  return (
    <div>
    

<Header/>
      <Routes>
        <Route path="/" element={<MediawithThree/>} />
        <Route path="/signup" element={<GreenLeafSignUp/>} />
        <Route path="/event" element={<GreenLeafEvents/>} />  
        <Route path="/profile" element={<GreenLeafProfile/>} />   
        <Route path="/feed" element={<GreenLeafFeed/>} />  
        <Route path="/connect" element={< SportsConnect />} /> 
        
       
        <Route path="/newprofile" element={<  NewProfile />} />
        
      </Routes>
      
      
    </div>
  );
}

export default App;

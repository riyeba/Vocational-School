import React from "react";

import { Route, Router, Routes } from "react-router";









import Header from "./components/Header";


import MediaPipe from "./MediaPipe";
import Three from "./components/Three";



function App() {
  return (
    <div>
    

<Header/>
      <Routes>
       
        <Route path="/event" element={< Three/>} />  
         
        
        
       
        <Route path="/newprofile" element={< MediaPipe />} />
        
      </Routes>
      
      
    </div>
  );
}

export default App;

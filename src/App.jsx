import React from "react";

import { Route, Router, Routes } from "react-router";









import Header from "./components/Header";



import Three from "./components/Three";
import MediaPipe from "./components/MediaPipe";



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

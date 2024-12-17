import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import ProductJewels from "./components/product/ProductJewellery";
import Upload_data from "./components/product/Upload_data";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the login and signup page */}
        <Route path="/" element={< LoginSignup />} />

        {/* Route for the products page */}
        <Route path="/api/images" element={< ProductJewels />} />
        
        <Route path="/uploads" element={< Upload_data />} />
      </Routes>
    </Router>
  );
}

export default App;

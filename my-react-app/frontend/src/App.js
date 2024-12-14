import React, { useState } from "react";
import LoginSignup from "./components/LoginSignup/LoginSignup";
// import ProductJewellery from "./components/product/ProductJewellery";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update the state to indicate the user is logged in
  };

  return (
    <div>
       <LoginSignup onLoginSuccess={handleLoginSuccess} /> 
    </div>
    // <div className="app-container">
    //   {!isLoggedIn && (
    //     <>
    //       <h1>Welcome to Our App</h1>
    //       <div className="toggle-container">
    //         <button
    //           className={isLogin ? "active" : ""}
    //           onClick={() => setIsLogin(true)}
    //         >
    //           Login
    //         </button>
    //         <button
    //           className={!isLogin ? "active" : ""}
    //           onClick={() => setIsLogin(false)}
    //         >
    //           Signup
    //         </button>
    //       </div>
    //     </>
    //   )}

    //   {isLoggedIn ? (
    //     <ProductJewellery /> // Show the ProductJewellery component after login
    //   ) : (
    //     isLogin ? <Login onLoginSuccess={handleLoginSuccess} /> : <Signup />
    //   )}
    // </div>
  );
}

export default App;

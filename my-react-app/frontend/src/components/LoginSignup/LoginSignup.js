// import React, { act, useState } from "react";
// import axios from "axios";
// import "./LoginSignup.css";
// import user_icon from "../Assets/person.png";
// import email_icon from "../Assets/email.png";
// import password_icon from "../Assets/password.png";


// function LoginSignup({ onLoginSuccess }) {
//   // const [email, setEmail] = useState("");
//   // const [password, setPassword] = useState("");
//   // const [message, setMessage] = useState("");

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await axios.post("http://localhost:5000/login", {
//   //       email,
//   //       password,
//   //     });
//   //     console.log(response);
//   //     setMessage(response.data.message || "Login successful!");
//   //     onLoginSuccess();  // Call the function to indicate successful login
//   //   } catch (error) {
//   //     setMessage(error.response?.data?.message || "An error occurred.");
//   //   }
//   // };


  
//   const [action,setAction] = useState("Login");

//   return (
//       <div className="container">
//         <div className="header">
//           <div className="text">{action}</div>
//           <div className="underline"></div>
//         </div>
//         <div className="inputs">
//           {action==="Login"?<div></div>:
//           <div className="input">
//             <img src={user_icon} alt=""/>
//             <input type="text" placeholder="Username"/>
//           </div>}
//           <div className="input">
//             <img src={email_icon} alt=""/>
//             <input type="email" placeholder="Email"/>
//           </div>
//           <div className="input">
//             <img src={password_icon} alt=""/>
//             <input type="password" placeholder="Password"/>
//           </div>
//         </div>
//         {action==="Sign Up"?<div></div>:
//         <div className="forgot-password">LostPassword? <span>Click Here!</span></div>}
//         <div className="submit-container">
//           <div className={action==="Login"?"submit gray":"submit"} onClick={()=>setAction("Sign Up")}>Sign Up</div>
//           <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>setAction("Login")}>Login</div>
//         </div>
//       </div>

//     // <div className="form-container">
//     //   <h2>Login</h2>
//     //   <form onSubmit={handleSubmit}>
//     //     <input
//     //       type="email"
//     //       placeholder="Email"
//     //       value={email}
//     //       onChange={(e) => setEmail(e.target.value)}
//     //       required
//     //     />
//     //     <input
//     //       type="password"
//     //       placeholder="Password"
//     //       value={password}
//     //       onChange={(e) => setPassword(e.target.value)}
//     //       required
//     //     />
//     //     <button type="submit">Login</button>
//     //   </form>
//     //   <p>{message}</p>
//     // </div>
//   );
// }

// export default LoginSignup;


import React, { useState } from "react";
import axios from "axios";
import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

function LoginSignup({ onLoginSuccess }) {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // For sign-up only
  const [message, setMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log(response);
      setMessage(response.data.message || "Login successful!");
      onLoginSuccess(); // Call the parent function after successful login
    } catch (error) {
      // Log the full error to help with debugging
    console.log('Error object:', error);

    if (error.response) {
      // If there is a response from the server, extract the message
      console.log('Response data:', error.response.data);
      setMessage(error.response.data.message || "An error occurred.");
    } else if (error.request) {
      // No response from the server
      console.log('No response was received:', error.request);
      setMessage("No response from the server. Please try again later.");
    } else {
      // Other errors (e.g., something else went wrong)
      console.log('Error message:', error.message);
      setMessage("Unexpected error occurred.");
    }
  }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        username,
        email,
        password,
      });
      setMessage(response.data.message || "Signup successful!");
      setAction("Login"); // After successful sign-up, switch to Login view
    } catch (error) {
      // Check if the error response contains a message
    if (error.response) {
      console.log(error);
      // If there is a response from the server, extract the message
      setMessage(error.response.data.message || "An error occurred.");
    } else {
      // If no response, handle network issues or unexpected errors
      setMessage("An unexpected error occurred.");
    }
  }   
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="Username" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="Email" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="Password" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="forgot-password">
      {message && <div className="message">{message}</div>}
      </div>
      
      {action === "Login" ? (
        <div className="forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>
      ) : null}

      <div className="submit-container">
        {action === "Login" ? (
          <div className="submit-container">
            <div
              className={action === "Login" ? "submit gray" : "submit"}
              onClick={() => setAction("Sign Up")}>
              Sign Up
            </div>
            <div className="submit" onClick={handleLoginSubmit}>
              Login</div>
          </div>
        ) : (
          <div className="submit-container">
            <div
              className={action === "Sign Up" ? "submit gray" : "submit"}
              onClick={() => setAction("Login")}
            >
              Login
            </div>
            <div className="submit" onClick={handleSignUpSubmit}>
              Sign Up
            </div>
          </div>
        )}
      </div>

      {/* <div className="toggle-action">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => setAction("Sign Up")}
        >
          Sign Up
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => setAction("Login")}
        >
          Login
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default LoginSignup;

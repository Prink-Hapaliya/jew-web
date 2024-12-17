import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log(response);
      setMessage(response.data.message || "Login successful!");
      // Check if login was successful
      if (response.data.success) {
        console.log("Login successful, navigating to /products...");
        navigate("/api/images"); // Redirect to the products page
        if (onLoginSuccess) {
          onLoginSuccess(); // Call the parent callback if provided
        }
      } else {
        console.log("Login failed. Message:", response.data.message);
        setMessage(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error); // Log the full error

      // Handle errors based on their type
      if (error.response) {
        // Server responded with a status outside the 2xx range
        console.log("Response error data:", error.response.data);
        setMessage(error.response.data.message || "An error occurred.");
      } else if (error.request) {
        // No response was received from the server
        console.log("No response received:", error.request);
        setMessage("No response from the server. Please try again later.");
      } else {
        // An unknown error occurred
        console.log("Error message:", error.message);
        setMessage("An unexpected error occurred. Please try again.");
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
      if (error.response) {
        console.log(error);
        setMessage(error.response.data.message || "An error occurred.");
      } else {
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
              onClick={() => setAction("Sign Up")}
            >
              Sign Up
            </div>
            <div className="submit" onClick={handleLoginSubmit}>
              Login
            </div>
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
    </div>);
}

export default LoginSignup;

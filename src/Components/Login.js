import React, { useState } from "react";
import axios from "axios";
import Background1 from "../assests/travel.gif";
import bg from "../assests/sds.webp"
import { useNavigate } from "react-router-dom"; 
import config from "../config";

const Login = () => {
  const [loginData, setLoginData] = useState({
    loginIdentifier: "",
    password: "",
  });
  const navigate = useNavigate(); 
  const [alertMessage, setAlertMessage] = useState(null); 
  const [color, setcolor] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); 
    try {
      const response = await axios.post(
        `${config.apiUrl}/user/login`,
        loginData
      );
      if (response.data.status === 200) {
        setAlertMessage("Login Successful!");
        setcolor(true);
        setTimeout(() => {
          setAlertMessage(null); 
          localStorage.setItem("user", JSON.stringify(response.data.data));
          navigate("/dashboard"); 
          setIsButtonDisabled(false); 
        }, 2000);
      }
    } 
  catch (error) {
    console.error("Login failed:", error);
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data.message;
      if (errorMessage === "Invalid username or password") {
        setAlertMessage("Invalid username or password");
      } else if (errorMessage === "Invalid username") {
        setAlertMessage("Invalid username or password");
      } else if (errorMessage === "Invalid password") {
        setAlertMessage("Invalid password.");
      } else {
        setAlertMessage("Invalid username or password");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setIsButtonDisabled(false); 

      }, 2000);
    } else {
      console.error("An unexpected error occurred:", error);
      setAlertMessage("An unexpected error occurred. Please try again.");
      setTimeout(() => {
        setAlertMessage(null); 
        setIsButtonDisabled(false); 
      }, 2000);
    }
  }
  };

  const alertStyle = {
    position: "fixed",
    bottom: "55px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: color?"transparent":"red" , 
    color: "white",
    padding: "10px",
    borderRadius: "5px",
      boxShadow: "0 0 10px rgba(255, 255, 255, 1)", 
    zIndex: "9999",
    display: alertMessage ? "block" : "none", 
    opacity: alertMessage ? 1 : 0, 
    transition: "opacity 0.5s ease-in-out", 
  };
  
  return (
  

<div className="relative">
  <div
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "100% 100%",
      minHeight: "100vh",
      backgroundRepeat: "no-repeat",
      fontFamily: "serif",
    //   filter: 'blur(3px)'
    }}
  ></div>
  <div
    className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
  >
    <div
      className="p-4 border-5"
      style={{
        height: "380px",
        width: "500px",
        boxShadow: "0 0 10px rgba(255, 255, 255, 1)",
        backgroundImage: `url(${Background1})`,  backgroundRepeat: "no-repeat",backgroundSize: "100% 100%",
      }}
    >
      <div>
        <div className="text-center text-white m-4">
          <h2 className="text-3xl mt-12 mb-0">
            <b>User Login</b>
          </h2>
          <p className="text-xl">Welcome back! Please enter your details</p>
        </div>
        <div style={alertStyle}>{alertMessage}</div>

        <form onSubmit={handleLogin} className="text-center">
          <div className="">
            <label htmlFor="loginIdentifier">
              <b className="text-lg text-white">User Name / Mobile Number</b>
            </label>
            <br />
            <input
              type="text"
              id="loginIdentifier"
              name="loginIdentifier"
              placeholder="User Name or Mobile Number"
              className="p-3 rounded w-3/4"
              value={loginData.loginIdentifier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              <b className="text-lg text-white">Password</b>
            </label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="p-3 rounded w-3/4"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn bg-shitw text-white text-lg p-2 rounded"
              style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 1)" }}
              disabled={isButtonDisabled}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>



  

  );
};

export default Login;
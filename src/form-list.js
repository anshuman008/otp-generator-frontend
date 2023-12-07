import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form-list.scss";
import { Spin } from "antd";

const FormList = () => {
  const [adminBool, setAdminBool] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="form-container">
      {adminBool ? <AdminLogin /> : <UserLogin />}
      <div onClick={() => setAdminBool(!adminBool)} className="admin-text">
        {adminBool ? "Login as User ?" : "Login as Admin ?"}
      </div>
    </div>
  );
};

const UserLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");

  useEffect(() => {
    fetchCaptchaImage();
  }, []);

  const fetchCaptchaImage = async () => {
    try {
      const response = await fetch("/captcha");
      const blob = await response.blob();
      const captchaUrl = URL.createObjectURL(blob);
      setCaptchaImage(captchaUrl);
    } catch (error) {
      console.error("Error fetching captcha image:", error.message);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    navigate("/listing");
    e.preventDefault();

    try {
      console.log(captcha, "captcha");
      const response = await fetch("/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          captcha,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Captcha verification successful");
      } else {
        console.error("Captcha verification failed");
      }
    } catch (error) {
      console.error("Error verifying captcha:", error.message);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username / Email
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </label>
        <div className="captcha">
        {captchaImage ? (
          <img src={captchaImage} alt="Captcha" />
        ) : (
          <Spin className="spin-style" />
        )}

        <input
          type="text"
          value={captcha}
          onChange={(e) => setCaptcha(e.target.value)}
          placeholder="Enter Captcha"
        />
      </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5001";

  const handleSubmit = async (e) => {
    // navigate("/listing");
    e.preventDefault();

    try {
      const response = await fetch(API_URL + "/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("admin", data?.token);
        if(data?.hasOwnProperty("admin")) {
          navigate('/createUser')
        }
        // window.location.reload()
        console.log("Captcha verification successful");
      } else {
        console.error("Captcha verification failed");
      }
    } catch (error) {
      // console.error("Error verifying captcha:", error.message);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormList;

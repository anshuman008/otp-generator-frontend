import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form-list.scss";
import { Spin } from "antd";
import { Navigate } from 'react-router-dom';
import { ReloadOutlined } from "@ant-design/icons";
const API_URL = "https://nodejsclusters-157156-0.cloudclusters.net";

const FormList = () => {
  const [adminBool, setAdminBool] = useState(false);
  const isUser = localStorage.getItem("user");
  const isAdmin = localStorage.getItem("admin");

  if(isUser) {
    return <Navigate to="/listing" />;
  }

  if(isAdmin) {
    return <Navigate to="/createUser" />;
  }

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
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCaptchaImage();
  }, []);

  const validateEmail = (value) => {
    // Use a simple regex to check for a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const fetchCaptchaImage = async () => {
    try {
      const response = await fetch(API_URL + "/captcha");
      const blob = await response.blob();
      const captchaUrl = URL.createObjectURL(blob);
      setCaptchaImage(captchaUrl);
    } catch (error) {
      console.error("Error fetching captcha image:", error.message);
    }
  };

  const reloadCaptcha = () => {
    fetchCaptchaImage();
    setCaptcha(""); // Clear the existing captcha value when reloading
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(phoneNumber)) {
      setErrors({ ...errors, phoneNumber: "Invalid email format" });
      return;
    } else {
      setErrors({ ...errors, phoneNumber: "" });
    }

    try {
      const response = await fetch(API_URL + "/verify-captcha", {
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

        try {
          const response = await fetch(API_URL + "/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: phoneNumber,
              password: otp,
            }),
          });

          const data = await response.json();

          if (data.token) {
            localStorage.setItem("user", data?.token);
            navigate('/listing');
            console.log("Login successful");
          } else {
            console.error("Login failed");
          }
        } catch (error) {
          console.error("Login:", error.message);
        }
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
           {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
        </label>
        <label>
          Password
          <input
            type="password"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {console.log(errors, 'er')}
          {errors.otp && <div className="error-message">{errors.otp}</div>}
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
          <div className="reload-captcha">
            <button type="button" onClick={reloadCaptcha}>
              <ReloadOutlined />
            </button>
          </div>
        </div>
        {/* <div className="error-message">{!verified && `Captcha didn't match!`}</div> */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://nodejsclusters-157156-0.cloudclusters.net";

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
        if (data?.hasOwnProperty("admin")) {
          navigate("/createUser");
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

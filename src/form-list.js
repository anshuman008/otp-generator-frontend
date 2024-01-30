import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form-list.scss";
import { message } from "antd";
import ReCAPTCHA from "react-google-recaptcha";

import { Navigate } from "react-router-dom";
import { userApi, adminApi } from "./api";

const FormList = () => {
  const [adminBool, setAdminBool] = useState(false);
  const isUser = localStorage.getItem("user");
  const isAdmin = localStorage.getItem("admin");

  if (isUser) {
    return <Navigate to="/service-list" />;
  }

  if (isAdmin) {
    return <Navigate to="/createUser" />;
  }

  return (
    <div className="form-container">
      {adminBool ? <AdminLogin api={adminApi} /> : <UserLogin api={userApi} />}
      <div onClick={() => setAdminBool(!adminBool)} className="admin-text">
        {adminBool ? "Login as User ?" : "Login as Admin ?"}
      </div>
    </div>
  );
};

const UserLogin = ({ api }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState("");
  const [errors, setErrors] = useState({});

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
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
      if (captchaValue) {
        console.log("Captcha verification successful");
        try {
          const response = await fetch(api.login, {
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
            navigate("/service-list");
            console.log("Login successful");
          } else {
            console.error("Login failed");
          }
          if(response.status !== 200) {
            message.error('Invalid Credentials!')
          }
          if(response.status === 200) {
            message.success('Login Successful!')
          }
        } catch (error) {
          console.log('in')
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
          {errors.phoneNumber && (
            <div className="error-message">{errors.phoneNumber}</div>
          )}
        </label>
        <label>
          Password
          <input
            type="password"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {errors.otp && <div className="error-message">{errors.otp}</div>}
        </label>
        <div className="captcha">
          <ReCAPTCHA
            sitekey="6LdNNywpAAAAAEI8bhOkK2F0hLYO81i6lPsh7BI3"
            onChange={handleCaptchaChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const AdminLogin = ({ api }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(api.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });
      response.json().then(
        (res) => {
          if (res.token) {
            localStorage.setItem("admin", res?.token);
            if (res?.hasOwnProperty("admin")) {
              navigate("/createUser");
            }
            // window.location.reload()
            console.log("Captcha verification successful");
          }
        },
        (err) => {
          console.error(err, "Captcha verification failed");
        }
      );
    } catch (error) {
      console.error("Error verifying captcha:", error.message);
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form-list.scss";
import { Spin } from "antd";

const FormList = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the captcha image when the component mounts
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

  const handleSubmit = async (e) => {
    navigate("/listing");
    e.preventDefault();

    // Perform captcha verification in the backend
    try {
      console.log(captcha, 'captcha')
      const response = await fetch("/verify-captcha", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify(captcha),
      });

      const data = await response.json();

      if (data.success) {
        // Captcha verification successful, proceed with form submission
        console.log("Captcha verification successful");
        // Perform your login form submission logic here
      } else {
        // Captcha verification failed
        console.error("Captcha verification failed");
      }
    } catch (error) {
      console.error("Error verifying captcha:", error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            UID
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
          {console.log(captcha, "spin")}
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
    </div>
  );
};

export default FormList;

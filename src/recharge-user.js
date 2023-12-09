import React, { useState } from "react";
import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RechargeUser = () => {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const isAdmin = localStorage.getItem("admin");
  const navigate = useNavigate()

  const API_URL = "https://nodejsclusters-157156-0.cloudclusters.net";

  const handleSubmit = async (e) => {
    // navigate("/listing");
    e.preventDefault();

    try {
      const response = await fetch(API_URL + "/admin/rechargeUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": `Bearer ${isAdmin}`
        },
        body: JSON.stringify({
          email: username,
          amount: amount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Captcha verification successful");
      } else {
        console.error("Captcha verification failed");
      }
    } catch (error) {
      // console.error("Error verifying captcha:", error.message);
    }
  };

  return (
    <div className="form-container">
       <div className="logout-btn">
        <Button
          onClick={() => {
            localStorage.removeItem('admin')
            navigate('/')
          }}
          style={{ background: "#306DCE", color: "#fff" }}
        >
          <LogoutOutlined /> Logout
        </Button>
      </div>
      <div className="login-form">
        <h2>Recharge User</h2>
        <form onSubmit={handleSubmit}>
          
          <label>
            Email
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RechargeUser;

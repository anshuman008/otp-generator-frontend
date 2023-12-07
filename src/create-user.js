import React, { useState } from "react";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const isAdmin = localStorage.getItem("admin");

  const API_URL = "http://localhost:5001";

  const handleSubmit = async (e) => {
    // navigate("/listing");
    e.preventDefault();

    try {
      const response = await fetch(API_URL + "/admin/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": `Bearer ${isAdmin}`
        },
        body: JSON.stringify({
          name: name,
          email: username,
          password: password,
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
      <div className="login-form">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Email
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
        <div className="admin-text">Want to recharge a User ?</div>
    </div>
  );
};

export default CreateUser;

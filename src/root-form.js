import React from "react";
import { Form } from "react-final-form";
import BuyNumber from "./buyNumber";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const RootForm = () => {
  const navigate = useNavigate();
  return (
    <div className="form-list-container">
      <div className="logout-btn">
        <Button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          <LogoutOutlined /> Logout
        </Button>
      </div>
      <div className="back-btn">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeftOutlined /> Back
        </Button>
      </div>
   
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit, form, values }) => (
          <form onSubmit={handleSubmit}>
            <BuyNumber values={values} form={form} />
          </form>
        )}
      />
    </div>
  );
};

export default RootForm;

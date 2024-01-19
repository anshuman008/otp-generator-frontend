import React, { useEffect, useState } from "react";
import { Table, Input, Pagination, Button } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import "./audit-table.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";

const AuditTable = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const isUser = localStorage.getItem("user");

  const handleCopy = (text) => {
    // Copy text to clipboard
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    // Make your initial API call here
    fetch("http://localhost:5001/user/me/logs", {
      headers: { Authorization: `Bearer ${isUser}` },
    })
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Service",
      dataIndex: "otpGenerratedFor",
      key: "otpGenerratedFor",
    },
    {
      title: "Price",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Mobile",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => (
        <Input
          addonAfter={
            <CopyOutlined
              style={{ cursor: "pointer" }}
              onClick={() => handleCopy(text)}
            />
          }
          value={text}
          disabled
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === ("success") ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "OTP",
      dataIndex: "otp",
      key: "otp",
      width: '130px'
    },
    // {
    //   title: "Left",
    //   key: "left",
    //   render: () => "",
    // },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: () => "",
    // },
  ];

  return (
    <div className="table-container">
      <div className="back-btn">
        <Button
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined /> Back
        </Button>
      </div>
      <div className="inner-div">
        <div className="otp-heading">OTP History</div>
        <Table style={{ height: 'calc(100% - 200px)', overflow: 'auto' }} columns={columns} dataSource={apiData} pagination={false} />
        <Pagination
          total={apiData.length}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </div>
  );
};

export default AuditTable;

import React, { useEffect, useState } from "react";
import { Table, Input, Pagination, Button, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import "./audit-table.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AuditTable = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const isUser = localStorage.getItem("user");

  const handleCopy = (text) => {
    // Copy text to clipboard
    navigator.clipboard.writeText(text);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setCurrentPage(1); // Reset to the first page when pageSize changes
    setPageSize(size);
  };

  useEffect(() => {
    // Make your API call based on the current page and page size
    fetch(`https://gxout2ygj1.execute-api.ap-south-1.amazonaws.com/user/me/logs`, {
      headers: { Authorization: `Bearer ${isUser}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const newData = data.map((el) => {
          const { amount } = el;
          return { ...el, amount: amount.toFixed(2) };
        });
        setApiData(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [currentPage, pageSize]);

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
      render: (text) => (
        <Tooltip
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          placement="bottomRight"
          fresh
          title={text}
        >
          <div
            style={{
              width: "110px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "pre",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
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
        status === "success" ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "OTP",
      dataIndex: "otp",
      key: "otp",
      width: "130px",
    },
  ];

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = currentPage * pageSize;

  // Display only the relevant portion of the data based on pagination
  const displayedData = apiData.slice(startIdx, endIdx);

  return (
    <div className="table-container">
      <div className="back-btn">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeftOutlined /> Back
        </Button>
      </div>
      <div className="inner-div">
        <div className="otp-heading">OTP History</div>
        <Table
          style={{ height: "calc(100% - 200px)", overflow: "auto" }}
          columns={columns}
          dataSource={displayedData}
          pagination={false}
        />
        <Pagination
          total={apiData.length}
          pageSize={pageSize}
          current={currentPage}
          onChange={handlePageChange}
          onShowSizeChange={handlePageSizeChange}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </div>
  );
};

export default AuditTable;

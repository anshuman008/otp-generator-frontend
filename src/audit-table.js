import React from "react";
import { Table, Input, Pagination, Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, CopyOutlined } from "@ant-design/icons";
import './audit-table.scss';
import { ArrowLeftOutlined } from '@ant-design/icons'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from 'react-router-dom';

const data = [
  {
    key: "1",
    date: "2/12/2023 17:4:29",
    service: "irctc",
    price: 8,
    mobile: "9876543210",
    status: "success", // 'success' or 'error'
    otp: "123456",
  },
  {
    key: "2",
    date: "2/12/2023 17:4:29",
    service: "irctc",
    price: 8,
    mobile: "9876543210",
    status: "success", // 'success' or 'error'
    otp: "123456",
  },
  {
    key: "3",
    date: "2/12/2023 17:4:29",
    service: "irctc",
    price: 8,
    mobile: "9876543210",
    status: "success", // 'success' or 'error'
    otp: "123456",
  },
  {
    key: "4",
    date: "2/12/2023 17:4:29",
    service: "irctc",
    price: 8,
    mobile: "9876543210",
    status: "failed", // 'success' or 'error'
    otp: "123456",
  },
  {
    key: "5",
    date: "2/12/2023 17:4:29",
    service: "irctc",
    price: 8,
    mobile: "9876543210",
    status: "success", // 'success' or 'error'
    otp: "123456",
  },
  {
    key: "6",
    date: "2/12/2023 17:4:29",
    service: "irctc",
    price: 8,
    mobile: "9876543210",
    status: "success", // 'success' or 'error'
    otp: "123456",
  }
];

const AuditTable = () => {
    const navigate = useNavigate();

    const handleCopy = (text) => {
        // Copy text to clipboard
        navigator.clipboard.writeText(text);
      };
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => <Input addonAfter={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopy(text)} />} value={text} disabled />,
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
    },
    {
      title: "Left",
      key: "left",
      render: () => "",
    },
    {
      title: "Action",
      key: "action",
      render: () => "",
    },
  ];

  return (
    <div className="table-container">
         <div className="back-btn">
      <Button onClick={() => navigate(-1)} style={{ background: "#306DCE", color: '#fff' }}><ArrowLeftOutlined /> Back</Button>
      </div>
     <div className="inner-div">
     <div className="otp-heading">OTP History</div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <Pagination
        total={data.length}
        showTotal={(total) => `Total ${total} items`}
      />
     </div>
    </div>
  );
};

export default AuditTable;

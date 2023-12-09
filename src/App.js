import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import FormList from "./form-list";
import BuyNumber from "./buyNumber";
import AuditTable from "./audit-table";
import "./form-list.scss";
import CreateUser from "./create-user";
import RechargeUser from "./recharge-user";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("admin");
  const isUser = localStorage.getItem("user");

  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  // if (!isUser) {
  //   return <Navigate to="/" />;
  // }
  return children;
};

const UserProtected = ({ children }) => {
  const isUser = localStorage.getItem("user");
  // const isAdmin = localStorage.getItem("admin");

  if (!isUser) {
    return <Navigate to="/" />;
  }
  // if (!isAdmin) {
  //   return <Navigate to="/" />;
  // }
  return children;
};

const App = () => {
  return (
    <div style={{ height: "100%" }}>
      {/* <MenuBar /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FormList />} />
          <Route
            path="/listing"
            element={
              <UserProtected>
                <BuyNumber />
              </UserProtected>
            }
          />
          <Route
            path="/audit"
            element={
              <UserProtected>
                <AuditTable />
              </UserProtected>
            }
          />

          {/* Use the ProtectedRoute HOC for the CreateUser and RechargeUser routes */}
          <Route
            path="/createUser"
            element={
              <ProtectedRoute>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recharge"
            element={
              <ProtectedRoute>
                <RechargeUser />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

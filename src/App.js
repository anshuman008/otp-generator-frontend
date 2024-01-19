import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import FormList from "./form-list";
import BuyNumber from "./buyNumber";
import AuditTable from "./audit-table";
import "./form-list.scss";
import CreateUser from "./create-user";
import RechargeUser from "./recharge-user";
import ServiceList from "./service-list";
import AdminDashboard from "./admin-dashboard";
import PageTransition from "./page-transition";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("admin");

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FormList />} />
          <Route
            path="/listing"
            element={
              <UserProtected>
                <PageTransition>
                  <BuyNumber />
                </PageTransition>
              </UserProtected>
            }
          />
          <Route
            path="/service-list"
            element={
              <UserProtected>
                <PageTransition>
                  <ServiceList />
                </PageTransition>
              </UserProtected>
            }
          />
          <Route
            path="/audit"
            element={
              <UserProtected>
                <PageTransition>
                  <AuditTable />
                </PageTransition>
              </UserProtected>
            }
          />

          {/* Use the ProtectedRoute HOC for the CreateUser and RechargeUser routes */}
          <Route
            path="/createUser"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <CreateUser />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
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

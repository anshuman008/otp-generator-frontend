import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import FormList from "./form-list";
import BuyNumber from "./buyNumber";
import AuditTable from "./audit-table";
import './form-list.scss';
import CreateUser from "./create-user";

const App = () => {

  return (
    
    <div style={{ height: '100%' }}>
      {/* <MenuBar /> */}
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormList />} />
        <Route path="/listing" element={<BuyNumber />} />
        <Route path="/audit" element={<AuditTable />} />
        <Route path="/createUser" element={<CreateUser />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;

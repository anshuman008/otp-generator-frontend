import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import FormList from "./form-list";
import BuyNumber from "./buyNumber";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormList />} />
        <Route path="/listing" element={<BuyNumber />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

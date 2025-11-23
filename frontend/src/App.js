import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Page from './page'; 
import CodeReview from "./components/CodeReview";
import RaiseIssues from "./components/RaiseIssues";

const App = () => {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<Page />} />

        {/* Code Review page */}
        <Route path="/code-review" element={<CodeReview />} />

        {/* Raise Issues page */}
        <Route path="/raise-issues" element={<RaiseIssues />} />

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

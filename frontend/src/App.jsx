// src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Redirect to signup or home page */}
      </Routes>
    </Router>
  );
};

export default App;

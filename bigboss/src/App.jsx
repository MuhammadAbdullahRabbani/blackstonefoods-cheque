import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        
        <Route path="/" element={<Signup />} />

        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

       
        <Route path="/dashboard" element={<Dashboard />} />

       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

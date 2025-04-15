import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar"; // 👈 Import the Navbar
import ImageUploader from "./components/ImageUploader.jsx";
import Home from "./components/Home.jsx";
import MyUploads from "./components/MyUploads.jsx";
import ImageEditor from "./components/ImageUploader.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ImageUploader />} />
            {/* <Route path="/my-uploads" element={<MyUploads />} /> */}
            <Route path="/my-uploads" element={<MyUploads />} />
            <Route path="/edit/:imageId" element={<ImageEditor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

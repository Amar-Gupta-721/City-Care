// src/components/OfficerHeader.jsx
import React from 'react';

const OfficerHeader = ({ name, department, onLogout }) => {
  return (
    <div className="bg-primary text-white rounded-b-xl p-6 shadow mb-6">
      {/* <h1 className="text-2xl font-bold">Welcome, {name}</h1>
      <p className="text-white/80 mt-1">Department: {department}</p> */}
      <div className="flex justify-between items-center">
        
        {/* Left Side - Officer Info */}
        <div>
          <h1 className="text-2xl font-bold">Welcome, {name}</h1>
          <p className="text-white/80 mt-1">
            Department: {department}
          </p>
        </div>

        {/* Right Side - Logout Button */}
        <button
          onClick={onLogout}
          className="bg-white text-primary px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default OfficerHeader;

import React, { useEffect, useState } from "react";
import OfficerHeader from "../../components/OfficerHeader";
import ComplaintList from "../../components/ComplaintList";
import ComplaintDetail from "../../components/ComplaintDetails";
import { useNavigate } from "react-router-dom";

const OfficerDashboard = () => {
  const [officer, setOfficer] = useState({ id: "", name: "", department: "" });
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/";
  const fetchComplaintsByDepartment = async (officerId) => {
    try {
      const res = await fetch(`${BASE_URL}complaints/department/${officerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setComplaints(data);
      } else {
        setError(data.error || "Failed to fetch complaints");
      }
    } catch (err) {
      setError("An error occurred while fetching complaints.");
    }
  };

  const fetchOfficerProfile = async () => {
    if (!token) {
      setError("Missing auth token");
      navigate("/");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}officers/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setOfficer({
          id: data.id,
          name: data.name,
          department: data.department,
        });

        fetchComplaintsByDepartment(data.id);
      } else {
        setError(data.error || "Failed to fetch officer profile");
      }
    } catch (err) {
      setError("An error occurred while fetching officer profile.");
    }
  };

  const handleSolveComplaint = async (complaintId) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}officers/solve/${complaintId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {

        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint._id === complaintId
              ? { ...complaint, Status: "Resolved" }
              : complaint
          )
        );

        if (selectedComplaint && selectedComplaint._id === complaintId) {
          setSelectedComplaint((prev) => ({ ...prev, Status: "Resolved" }));
        }

        alert("Complaint marked as solved successfully!");
      } else {
        setError(data.error || "Failed to solve complaint");
      }
    } catch (err) {
      setError("An error occurred while solving the complaint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficerProfile();
  }, []);

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f7f3] to-[#F1EFEC] text-gray-800">
      <OfficerHeader name={officer.name} department={officer.department} />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-500 hover:text-red-700 font-medium"
            ></button>
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 shadow-sm">
            Processing request...
          </div>
        )}

        {selectedComplaint ? (
          <ComplaintDetail
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            onSolve={handleSolveComplaint}
            loading={loading}
          />
        ) : (
          <ComplaintList
            complaints={complaints}
            onComplaintClick={handleComplaintClick}
          />
        )}
      </main>
    </div>
  );
};

export default OfficerDashboard;

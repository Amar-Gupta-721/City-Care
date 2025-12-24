import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const submitHandler = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    alert(data.message);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full border p-3 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-primary text-white py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

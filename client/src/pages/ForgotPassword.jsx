import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const submitHandler = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full bg-primary text-white py-2 rounded">
          Send Reset Link
        </button>

        {msg && <p className="mt-4 text-center">{msg}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;

import React, { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Redirect officer away from home
  useEffect(() => {
    if (token && role === "officer") {
      navigate("/officer/dashboard");
    }
  }, [token, role, navigate]);


  console.log(import.meta.env.VITE_API_BASE_URL)
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow">
          <Hero />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
      {import.meta.env.VITE_API_BASE_URL !== 'http://localhost:8000/' ? <Analytics /> : null}
    </>
  )
}

export default App

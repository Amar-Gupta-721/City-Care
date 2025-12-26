# 🏙️ CityCare – Civic Complaint Management System

CityCare is a **full-stack web application** that enables citizens to report civic issues and allows government officers to manage and resolve complaints efficiently.  
The platform focuses on **transparency, accountability, and faster resolution of public grievances**.

---

## 🚀 Features

### 👤 Citizen Features
- User authentication (Email/Password & Google Sign-In)
- Raise complaints with:
  - Title, description, department
  - Location (Map-based using Leaflet)
  - Media uploads (images)
- View personal complaints and their statuses
- Track complaint progress (Pending / In Progress / Resolved)
- Secure **Forgot Password & Reset Password** flow via email

---

### 🧑‍💼 Officer Features
- Secure officer login
- View complaints assigned to their department
- View complaint details including:
  - Location on map
  - Uploaded media
- Mark complaints as **Resolved**
- Dedicated officer dashboard

---

### 🛡️ System Features
- Role-based authentication (Citizen / Officer)
- Protected routes using JWT
- Media handling via Multer
- RESTful API architecture
- Production-ready deployment setup

---

## 🧱 Tech Stack

### Frontend
- React.js
- React Router
- Redux Toolkit
- Tailwind CSS
- Leaflet (Maps)
- Vite

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Multer (File uploads)
- Nodemailer (Email services)

### Database
- MongoDB (MongoDB Atlas)

### Tools & Platforms
- Git & GitHub
- Postman
- VS Code
- Vercel (Frontend Deployment)
- Render (Backend Deployment)

---

## 📂 Project Structure

```txt
CityCare/
├── client/              # Frontend (React + Vite)
│   ├── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│   ├── main.jsx
│
├── server/              # Backend (Node + Express)
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── README.md
````

---

## 🔐 Authentication Flow
- JWT-based authentication
- Tokens stored securely on the client
- Role-based UI rendering (Citizen vs Officer)
- Protected API routes using middleware

---

## 🗺️ Complaint Flow
1. Citizen logs in
2. Raises a complaint with details & location
3. Complaint is stored in database
4. Officer views department-specific complaints
5. Officer marks complaint as resolved
6. Status updates reflect in real-time UI

---

## ⚙️ Environment Variables

### Frontend (.env)
VITE_API_BASE_URL=https://your-backend-url/api/  
VITE_GOOGLE_CLIENT_ID=your_google_client_id

### Backend (.env)
PORT=5000  
MONGO_URI=your_mongodb_atlas_uri  
JWT_SECRET=your_jwt_secret  
CLIENT_URL=https://your-frontend-url  
EMAIL_USER=your_email  
EMAIL_PASS=your_email_app_password  
GOOGLE_CLIENT_ID=your_google_client_id

---

## ▶️ Run Locally

### Clone Repository
```txt
git clone https://github.com/your-username/citycare.git  
cd citycare
````

### Backend Setup
```txt
cd server  
npm install  
npm run dev
````

### Frontend Setup
```txt
cd client  
npm install  
npm run dev
````

---

### 🌐 Live Demo
```txt
https://city-care-teal.vercel.app
````

---

## 🎯 Learning Outcomes
- Built a real-world **role-based full-stack system**
- Implemented secure authentication & authorization
- Integrated maps and media uploads
- Learned deployment, CORS handling, and production debugging
- Improved REST API design and frontend architecture

---

## 👨‍💻 Author
**Amar Gupta**  
Full-Stack Developer  

---

## 📄 License
This project is licensed under the **MIT License**.

<div align="center">
  <h1>🚀 NOC Management System</h1>
  <p>A comprehensive full-stack solution to efficiently manage Network Operations Center (NOC) activities, classes, subjects, and administration.</p>
  <img src="https://img.shields.io/badge/Next.js-16.1-black?logo=next.js&style=for-the-badge" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white&style=for-the-badge" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-server-green?logo=node.js&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-backend-white?logo=express&logoColor=black&style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-database-47A248?logo=mongodb&logoColor=white&style=for-the-badge" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-styling-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/TypeScript-typed-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" />

</div>

---

## 🌟 About The Project

**NOC Management System** is a modern and performant web application built to streamline operations for administration. This application leverages a robust **MERN-like stack** (replacing React with Next.js) to deliver a seamless, scalable, and secure user experience.

### Key Highlights

- **Role-Based Access Control:** Secure user authentication using JWT and bcrypt.
- **Dynamic Dashboards:** Interactive charts and visualizations powered by Recharts.
- **PDF Generation:** Automated document and report creation using PDFKit.
- **REST API:** A fully decoupled standard RESTful API backend handling business logic and data persistence.

---

## 💻 Tech Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (App Router, v16)
- **Library:** [React](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Charts:** Lucide React, Recharts
- **HTTP Client:** Axios
- **State/Toasts:** React Hot Toast

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Security:** JWT (JSON Web Tokens), Bcryptjs
- **Utilities:** PDFKit, Cookie Parser, Express-Async-Errors

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

You need to have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas URI)
- Git

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/noc-management.git
   cd noc-management
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` directory and configure the required environment variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

   Start the backend server:

   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal window:

   ```bash
   cd frontend
   npm install
   ```

   Start the Next.js development server:

   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`

---

## 📂 Project Structure

```text
noc-management/
├── backend/                  # Node.js + Express API server
│   ├── models/               # Mongoose schemas (Class, Subject, etc.)
│   ├── controllers/          # API route logic
│   ├── routes/               # Express route definitions
│   ├── server.js             # Entry point
│   ├── seed.js               # Database seeder script
│   └── package.json          # Backend dependencies
│
└── frontend/                 # Next.js Application
    ├── app/                  # Next.js App Router pages (admin, etc.)
    ├── components/           # Reusable UI components
    ├── proxy.ts              # API proxy/configuration
    └── package.json          # Frontend dependencies
```

---

## ✨ Features

- **Administrative Dashboard:** Complete overview of NOC operations.
- **Class & Subject Management:** Easily create, read, update, and delete class and subject entries.
- **Responsive UI:** Fully responsive design that works perfectly on desktop and mobile.
- **Real-time Data Visualization:** Visual metrics enabled by highly responsive charts.
- **Secure Authentication:** Cookie-based JWT authentication keeping sessions secure.

---

## 📜 License

This project is licensed under the **ISC License**.

---

<div align="center">
  <i>Built with ❤️ by Vedang Dhuri</i>
</div>

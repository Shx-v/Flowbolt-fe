# ⚛️ FlowBolt Frontend

Frontend application for **FlowBolt**, a task & ticket management system. Built with **React + Vite + Material UI**, focused on performance, scalability, and maintainable UI architecture.

---

## 🚀 Quick Start

```bash
git clone https://github.com/Shx-v/Flowbolt-fe.git
cd flowbolt-fe
npm install
npm run dev
```

App runs at:

```bash
http://localhost:5173
```

---

## 📦 Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🧱 Tech Stack

* **React 18+**
* **Vite**
* **Material UI (MUI)**
* **Emotion (styling)**
* **ESLint**

---

## 📁 Project Structure

```bash
src/
├── components/        # Reusable UI components
├── pages/             # Feature-level pages (Dashboard, Tickets, etc.)
├── hooks/             # Custom hooks
├── services/          # API layer (Axios / fetch wrappers)
├── store/             # Global state management (if used)
├── routes/            # Route configuration
├── layouts/           # Layouts (dashboard, auth, etc.)
├── theme/             # MUI theme setup
├── utils/             # Helpers & constants
├── App.jsx
└── main.jsx
```

---

## ⚙️ Architecture

* **Component-driven design** with reusable UI blocks
* **Centralized API layer** for backend communication
* **Separation of concerns** across pages, services, and UI
* **Theme-based styling** using MUI
* Designed to support **dynamic forms, workflows, and dashboards**

---

## 🔗 Backend Integration

This frontend depends on the FlowBolt backend APIs:

👉 https://flowbolt-be.onrender.com/api/v1/webjars/swagger-ui/index.html

Ensure backend is running and accessible.

---

## 🌍 Environment Variables

Create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🧩 Features Supported

* Project & ticket management UI
* Workflow-based status transitions
* Role-based UI rendering (based on permissions)
* Dashboard with ticket insights
* Dynamic forms (based on backend configurations)

---

## 🧪 Code Quality

* ESLint configured with React + Hooks rules
* Consistent folder structure
* Scalable for large feature additions

---

## 🚀 Build & Deployment

```bash
npm run build
```

Output directory:

```bash
dist/
```

Deploy using:

* Nginx
* AWS S3 + CloudFront
* Vercel / Netlify

---

## 📄 License

MIT License

---

## 📬 Contact

Shivranjan Bharadwaj
📧 [shivranjanbharadwaj@gmail.com](mailto:shivranjanbharadwaj@gmail.com)

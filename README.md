# 🎓 EduConnect: Modern Collaborative Learning & Mentorship Platform

Welcome to **EduConnect**, a premium, next-generation learning management and mentorship platform. Designed to overcome the clunky, rigid interfaces of traditional LMS solutions, EduConnect delivers a vibrant, highly interactive, and seamless user experience tailored for modern learners, educators, and mentors.

---

## 🌟 Why EduConnect? (The Vision)

Unlike existing legacy educational websites that often suffer from outdated aesthetics and cumbersome navigation, EduConnect is built from the ground up with a **"User-First, Design-Forward"** philosophy. 

### Key Differentiators:
- **Premium, High-End UI**: Replaces generic static pages with dynamic, glassmorphism-inspired designs, unique backgrounds, and smooth micro-interactions.
- **Fluid Interactivity**: Every action—from downloading certificates to navigating discussion forums—is engineered for a frictionless experience.
- **Actionable Analytics**: Gone are static tables; EduConnect uses real-time, interactive charts to visualize learning progress.
- **Modern Gig & Portfolio Integration**: Reflects a polished, professional-grade portfolio UI that helps learners showcase their achievements effectively.

---

## 🚀 Core Features & Use Cases

- **Interactive Learning Dashboard**: A centralized, visually stunning hub tracking course progress, recent activities, and upcoming assignments with dynamic charts.
- **Robust Discussion Forums**: A seamless, real-time communication space for collaborative learning, allowing students and mentors to connect without workflow friction.
- **Automated Certificate Generation**: Instantly generate and download high-quality, customized PDF certificates upon course completion.
- **Streamlined Assignment Management**: An intuitive interface for learners to upload assignments with immediate visual feedback and selection reflection.
- **Secure Authentication & Authorization**: Enterprise-grade security ensuring user data, course materials, and mentorship chats are fully protected.

---

## 💻 Tech Stack & Engineering

EduConnect utilizes a modern, decoupled architecture separating a high-performance frontend from a robust, scalable backend.

### **Frontend (Client-Side)**
- **Framework**: React 18 with Vite (for ultra-fast HMR and optimized building).
- **Styling & UI**: Tailwind CSS (for rapid, responsive utility styling) combined with custom Vanilla CSS for complex, premium aesthetic overrides.
- **Animations**: Framer Motion (powering fluid page transitions and micro-animations).
- **Data Visualization**: Recharts (for rendering responsive, interactive progress and analytics charts).
- **Utilities**: `jsPDF` (for client-side dynamic certificate generation), `lucide-react` (for clean, modern iconography), `react-router-dom` (for declarative routing).

### **Backend (Server-Side)**
- **Core Framework**: Java 17 & Spring Boot 3.3 (providing a stable, enterprise-ready RESTful API backbone).
- **Security**: Spring Security & JWT (JSON Web Tokens) for stateless, secure user authentication and role-based access control.
- **Data Persistence**: Spring Data JPA & Hibernate.
- **Database**: PostgreSQL (relational database for robust, transactional data integrity).
- **Tooling**: Maven, Lombok (reducing boilerplate code).

---

## 📂 Project Structure

The repository is organized into a clean monorepo-style structure:

```text
EduConnect/
├── EduConnect_Frontend/     # React + Vite Client Application
│   ├── src/                 # UI Components, Pages, and Assets
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Design system tokens and styling rules
│
└── EduConnect_Backend/      # Spring Boot REST API
    ├── src/                 # Controllers, Services, Models, and Repositories
    └── pom.xml              # Maven backend dependencies
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Java** (JDK 17)
- **Maven**
- **PostgreSQL** (Ensure a local or remote instance is running)

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd EduConnect_Backend
   ```
2. Update the `application.properties` (or `.env` equivalents) with your PostgreSQL credentials.
3. Build and run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd EduConnect_Frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser to view the application.

---

> **Note to Recruiters/Reviewers:** This project demonstrates full-stack proficiency, an eye for premium UI/UX design, and the ability to solve real-world functional problems (like seamless file handling and dynamic PDF generation) within a modern application architecture.

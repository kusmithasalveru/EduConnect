# EduConnect

EduConnect is a full-stack learning management and mentorship platform I built to solve some of the UX friction I noticed in traditional LMS software. The goal was to build a platform that feels fast, looks modern, and handles complex features—like dynamic file generation and real-time data visualization—without being clunky.

This repository is structured as a monorepo containing both the frontend client and the REST API backend.

## Tech Stack Overview

### Frontend
- **TypeScript & React**: Built entirely in strict TypeScript using React. I specifically chose TS to ensure type safety across complex data flows, especially around user states and assignment structures.
- **Vite**: Used for tooling and bundling to get fast HMR and highly optimized production builds.
- **Tailwind CSS & Custom CSS**: Handled styling primarily with Tailwind for rapid development, layered with custom CSS for specific UI overrides and a polished layout.
- **Framer Motion**: Integrated for smooth, complex animations and page transitions.
- **Recharts**: Used to render the interactive learning progress dashboards.
- **jsPDF**: Implemented client-side PDF generation for course certificates, deliberately chosen to offload processing from the backend.

### Backend
- **Java 17 & Spring Boot 3**: The core API backbone. I chose Spring Boot for its robustness and enterprise-level architecture.
- **Spring Security & JWT**: Implemented stateless authentication using JSON Web Tokens. Secures all endpoints and manages role-based access control.
- **PostgreSQL**: Relational database chosen for structured, ACID-compliant data storage.
- **Spring Data JPA (Hibernate)**: Handled the ORM layer to map Java models directly to the Postgres tables cleanly.

## What This Project Demonstrates 

If you are a recruiter or engineering manager reviewing my work, here are the key technical challenges I tackled in this project:

### 🎯 Highlights for Frontend Roles:
- **TypeScript Mastery**: Demonstrated the ability to strictly type React components, API payloads, and state management.
- **Client-Side Document Generation**: Solved a real-world performance problem by generating dynamic, downloadable PDF certificates directly in the browser using `jsPDF` rather than relying on server-side rendering.
- **Advanced UI/UX Implementation**: Built a custom, fully responsive interface utilizing `Framer Motion` to make micro-interactions and routing feel native and polished.
- **Data Visualization**: Integrated `Recharts` to parse and map raw backend data into readable, interactive analytics for the user dashboard.

### ⚙️ Highlights for Backend Roles:
- **Secure Architecture**: Engineered a complete JWT authentication flow from scratch using Spring Security, ensuring that user data, assignments, and mentorship communications are protected.
- **Relational Data Modeling**: Designed a scalable PostgreSQL schema using Spring Data JPA to efficiently handle complex relationships between users, courses, assignment uploads, and forum discussions.
- **Decoupled System Design**: Built a clean, stateless REST API that strictly separates concerns and can be easily consumed by any web or mobile client.
- **Production-Ready Configuration**: Configured Docker and deployment setups (via `render.yaml`) to seamlessly deploy the Spring Boot backend to cloud environments.

## Detailed Application Workflow

To give you a clear picture of how the application operates from end to end, here is the user journey across the core modules:

### 1. Authentication & Onboarding
- **Login/Register Flow**: Users land on the authentication page, which features smooth Framer Motion transitions between login and registration states. 
- **Security**: Upon submission, the Spring Boot backend validates credentials and issues a secure JWT token. The React client stores this token and attaches it via Axios interceptors to all subsequent protected requests.
- **Role Routing**: Depending on the user's role (Student or Mentor), the client dynamically routes them to their appropriate, customized dashboard layout.

### 2. Main Dashboard (Analytics)
- **Data Fetching**: The dashboard immediately fetches user-specific progress data from the REST API.
- **Visual Analytics**: Raw data is piped into `Recharts` components to render interactive graphs (e.g., weekly learning hours, assignment completion rates).
- **Quick Actions**: Users can jump directly back into their most recently accessed courses or view pending assignment deadlines highlighted in the UI.

### 3. Course Management & Viewing
- **Course Library**: Displays a grid of available courses. We use custom CSS and Tailwind to ensure the cards are responsive and visually engaging.
- **Course View**: When a course is clicked, the router loads the specific module data. It tracks completion state (managed via backend state updates) so users know exactly where they left off.

### 4. Assignment Submissions
- **Upload Flow**: Users navigate to the Assignments module to view pending tasks. When a file is selected, the UI immediately reflects the chosen file to ensure the correct document is uploaded.
- **Submission**: The file and metadata are sent securely to the backend. The UI updates instantly to show a "Submitted" state, avoiding page reloads and reducing user friction.

### 5. Discussion Forum (Mentorship)
- **Collaborative Learning**: Users can enter specific course forums to ask questions or interact with mentors. 
- **Interaction Logic**: When a user posts a question or replies to a thread, the UI updates dynamically while syncing the payload to the PostgreSQL database, keeping the conversation flow natural and responsive.

### 6. Certificate Generation
- **Completion Trigger**: Once the backend registers 100% completion for a course module, the "Download Certificate" button unlocks.
- **Client-Side Rendering**: Clicking the button triggers `jsPDF`. The application dynamically layers the user's name, course details, and completion date onto a PDF template and prompts a browser download. This entirely bypasses the server, saving bandwidth and compute resources.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java (JDK 17)
- Maven
- PostgreSQL running locally or remotely

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd EduConnect_Backend
   ```
2. Local defaults live in `src/main/resources/application-dev.yml` (PostgreSQL on `localhost:5432`, user/password `postgres`). Override with the `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` environment variables if yours differ.
3. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The API will start on `localhost:8080`.*

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd EduConnect_Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will start on `localhost:5173`.*

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the production setup (Vercel + Render + Neon), required environment variables and DNS records.

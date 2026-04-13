# EduConnect - Modern Full-Stack Frontend UI

A beautiful, responsive, and feature-rich frontend UI for **EduConnect**, a collaborative learning platform that combines Discord-style community chat, Coursera-style learning management system, and a tutor marketplace.

## ✨ Features

### 🎨 Design
- **Modern SaaS UI** with Discord + Notion + Coursera inspiration
- **Dark/Light Mode** support with smooth theme transitions
- **Responsive Design** that works on all devices
- **Smooth Animations** for better user experience
- **Professional Color Scheme** with gradient accents

### 📱 Layout
- **Discord-style Server Bar** with circular community icons
- **Navigation Sidebar** with intuitive menu items
- **Top Navbar** with search functionality and theme toggle
- **Dynamic Main Content Area** that changes based on route

### 📚 Pages Implemented

1. **Dashboard**
   - Welcome banner with personalized greeting
   - Learning progress cards
   - Upcoming tutor sessions
   - Recommended courses
   - Community activity feed

2. **Community Chat** (Discord-style)
   - Channel list with public and private channels
   - Real-time message interface
   - Message reactions with emoji
   - Message input with attachments support

3. **Find Tutors**
   - Tutor marketplace with filterable grid
   - Advanced filters (subject, price, rating)
   - Tutor profiles with ratings and reviews
   - Book session functionality

4. **Courses**
   - Course discovery with search and filters
   - Coursera-style course cards
   - Category-based filtering
   - Sorting options (popular, rating, newest)
   - Course enrollment tracking

5. **Course Learning Page**
   - Video player placeholder
   - Expandable course modules
   - Lesson list with progress tracking
   - Assignments section
   - Discussion forum

6. **Assignments**
   - Assignment tracking dashboard
   - Status indicators (pending, submitted, overdue)
   - Assignment details and grading
   - Submission history

7. **Leaderboard**
   - Global leaderboard with multiple timeframes
   - User ranking system
   - Achievement badges
   - Stats dashboard

8. **Profile**
   - User information and bio
   - Completed courses showcase
   - Skills display
   - Community reputation scores
   - Learning statistics

### 🧩 Reusable Components

- `Navbar` - Top navigation bar with search and theme toggle
- `Sidebar` - Left navigation menu
- `ServerBar` - Discord-style community selector
- `ChatWindow` - Discord-style chat interface
- `MessageItem` - Individual message component
- `TutorCard` - Tutor marketplace card
- `CourseCard` - Coursera-style course card
- `ProgressCard` - Learning progress tracker
- `ErrorBoundary` - Error handling component
- `Layout` - Main layout wrapper

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or higher
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd Edu_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 📁 Project Structure

```
Edu_frontend/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ServerBar.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageItem.tsx
│   │   ├── TutorCard.tsx
│   │   ├── CourseCard.tsx
│   │   ├── ProgressCard.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   ├── pages/                # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Chat.tsx
│   │   ├── Tutors.tsx
│   │   ├── Courses.tsx
│   │   ├── CourseView.tsx
│   │   ├── Assignments.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── Profile.tsx
│   │   └── index.ts
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles with Tailwind
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Project dependencies
└── README.md
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  accent: {
    // Customize primary accent colors here
  }
}
```

### Dark Mode
The app automatically switches between dark and light modes based on user preference and localStorage. Users can toggle the theme using the button in the navbar.

### Animations
Tailwind configuration includes custom animations in `tailwind.config.js`:
- `fade-in` - Smooth fade-in effect
- `slide-in` - Slide in from left
- `pulse-soft` - Gentle pulsing effect

## 🔧 Tech Stack

- **Framework:** React 18.2+
- **Language:** TypeScript 5.2+
- **Bundler:** Vite 5.0+
- **Styling:** Tailwind CSS 3.3+
- **Routing:** React Router 6.22+
- **Icons:** Lucide React 0.344+
- **Build Tool:** PostCSS, Autoprefixer

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktop screens (1024px and up)
- Large displays (1440px and up)

## 🌙 Dark Mode

Built-in dark mode support with:
- Automatic detection of system theme preference
- Toggle button in navbar
- Persistent theme preference in localStorage
- Carefully chosen contrast ratios for accessibility

## 🎯 Future Enhancements

- Backend API integration
- Real-time chat with WebSocket
- Video streaming functionality
- Payment integration
- Notification system
- Advanced analytics
- Mobile app (React Native)

## 📝 Notes

- This is a **frontend-only** implementation showcasing UI/UX design
- Mock data is used throughout for demonstration
- All interactions are simulated (no backend connection)
- Ready for backend API integration

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For questions or support, please open an issue or contact the development team.

---

**Built with ❤️ by the EduConnect team**

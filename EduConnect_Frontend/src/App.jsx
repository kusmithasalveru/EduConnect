import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Tutors from './pages/Tutors'
import Courses from './pages/Courses'
import CourseView from './pages/CourseView'
import Profile from './pages/Profile'
import Assignments from './pages/Assignments'
import Leaderboard from './pages/Leaderboard'
import Settings from './pages/Settings'
import EShop from './pages/EShop'
import PaymentGateway from './pages/PaymentGateway'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        if (saved) return saved === 'dark'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        const html = document.documentElement
        if (isDark) {
            html.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            html.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])

    const toggleTheme = () => setIsDark(!isDark)

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <Layout toggleTheme={toggleTheme} isDark={isDark}>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/chat" element={<Chat />} />
                                        <Route path="/tutors" element={<Tutors />} />
                                        <Route path="/courses" element={<Courses />} />
                                        <Route path="/courses/:courseId" element={<CourseView />} />
                                        <Route path="/assignments" element={<Assignments />} />
                                        <Route path="/leaderboard" element={<Leaderboard />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="/eshop" element={<EShop />} />
                                        <Route path="/payment" element={<PaymentGateway />} />
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </ErrorBoundary>
    )
}

export default App


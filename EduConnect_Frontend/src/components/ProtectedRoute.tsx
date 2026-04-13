import React from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const {
        state: { isAuthenticated },
    } = useApp()

    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <>{children}</>
}


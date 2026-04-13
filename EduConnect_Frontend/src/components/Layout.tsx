import { ReactNode } from 'react'
import ServerBar from './ServerBar'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface LayoutProps {
    children: ReactNode
    toggleTheme: () => void
    isDark: boolean
}

export default function Layout({ children, toggleTheme, isDark }: LayoutProps) {
    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
            {/* Server Bar (Left) */}
            <ServerBar />

            {/* Sidebar (Navigation) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

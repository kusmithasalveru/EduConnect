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
        <div className="flex h-screen w-full overflow-hidden bg-background font-sans antialiased text-foreground selection:bg-primary/30">
            {/* Ambient Background Pattern */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-10"></div>
            <div className="pointer-events-none fixed inset-0 z-0 bg-hero-pattern dark:bg-hero-pattern-dark opacity-[0.03]"></div>

            {/* Server Bar (Left) */}
            <div className="z-10 flex h-full">
                <ServerBar />
            </div>

            {/* Sidebar (Navigation) */}
            <div className="z-10 flex h-full border-r border-border/40 glass">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
                <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50 backdrop-blur-3xl">
                    <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

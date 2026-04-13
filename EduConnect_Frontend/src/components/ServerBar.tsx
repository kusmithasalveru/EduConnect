import { useState } from 'react'
import { Plus } from 'lucide-react'

interface Community {
    id: string
    name: string
    icon: string
    color: string
}

const communities: Community[] = [
    { id: '1', name: 'Programming', icon: '💻', color: 'bg-blue-500' },
    { id: '2', name: 'Community Score', icon: '🏅', color: 'bg-purple-500' },
    { id: '3', name: 'AI/ML', icon: '🤖', color: 'bg-green-500' },
    { id: '4', name: 'Tutor Sessions', icon: '⏱️', color: 'bg-orange-500' },
    { id: '5', name: 'Web Dev', icon: '🌐', color: 'bg-pink-500' },
]

export default function ServerBar() {
    const [active, setActive] = useState('1')

    return (
        <div className="w-20 bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 border-r border-slate-700 dark:border-slate-800 flex flex-col items-center py-4 gap-2 overflow-y-auto">
            {/* Logo */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center cursor-pointer hover:rounded-2xl transition-all duration-300 mb-2 font-bold text-white shadow-lg">
                EC
            </div>

            <div className="w-full px-2 border-t border-slate-700 my-2" />

            {/* Community Icons */}
            {communities.map((community) => (
                <button
                    key={community.id}
                    onClick={() => setActive(community.id)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:rounded-2xl ${'active' === active ? 'rounded-2xl' : ''} ${active === community.id
                            ? 'bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg'
                            : 'bg-slate-700 dark:bg-slate-800 hover:bg-slate-600 dark:hover:bg-slate-700'
                        }`}
                    title={community.name}
                >
                    {community.icon}
                </button>
            ))}

            {/* Add Community Button */}
            <button className="w-14 h-14 rounded-full bg-slate-700 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-300 hover:rounded-2xl mt-auto mb-2 border-2 border-dashed border-slate-600 dark:border-slate-700">
                <Plus size={20} />
            </button>
        </div>
    )
}

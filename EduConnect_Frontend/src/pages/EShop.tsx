import { Lock, CheckCircle, Download, ExternalLink, Linkedin } from 'lucide-react'
import { useApp } from '../state/AppContext'
import { jsPDF } from 'jspdf'

type Reward = {
    level: number
    name: string
    description: string
    requiredPoints: number
}

const rewards: Reward[] = [
    {
        level: 1,
        name: 'Virtual EduConnect T-Shirt',
        description: 'Personalized with your name + “EduConnect”',
        requiredPoints: 100,
    },
    {
        level: 2,
        name: 'EduConnect Cap',
        description: 'Cap with EduConnect branding',
        requiredPoints: 300,
    },
    {
        level: 3,
        name: 'EduConnect Bag',
        description: 'Bag with EduConnect branding',
        requiredPoints: 600,
    },
]

export default function EShop() {
    const { state } = useApp()
    const points = state.stats.communityPoints

    const handleDownload = (reward: Reward) => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' })
        const w = doc.internal.pageSize.getWidth()
        const h = doc.internal.pageSize.getHeight()

        doc.setDrawColor(99, 102, 241)
        doc.setLineWidth(2)
        doc.rect(36, 36, w - 72, h - 72)

        doc.setFillColor(99, 102, 241)
        doc.rect(36, 36, w - 72, 72, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(18)
        doc.text('EduConnect Rewards', 56, 78)

        doc.setTextColor(17, 24, 39)
        doc.setFontSize(28)
        doc.setFont('helvetica', 'bold')
        doc.text('BADGE OF MERIT', w / 2, 160, { align: 'center' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(14)
        doc.text('This verifies that', w / 2, 210, { align: 'center' })

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(22)
        doc.text(state.profile?.fullName || state.user?.username || 'Learner', w / 2, 250, { align: 'center' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(14)
        doc.text('has successfully unlocked the following reward:', w / 2, 295, { align: 'center' })

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(20)
        doc.text(reward.name, w / 2, 340, { align: 'center' })
        
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(14)
        doc.setTextColor(99, 102, 241)
        doc.text(`"Keep going! Your dedication to learning is inspiring."`, w / 2, 400, { align: 'center' })

        doc.save(`EduConnect-Badge-${reward.name.replace(/\s+/g, '-')}.pdf`)
    }

    const handleLinkedInShare = (reward: Reward) => {
        const text = encodeURIComponent(`I just unlocked the ${reward.name} on EduConnect! 🎓✨\n\nContinuing my learning journey and earning community points. Keep going! #EduConnect #ContinuousLearning #BadgeOfMerit`)
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank', 'noopener,noreferrer')
    }

    const handleOpen = (reward: Reward) => {
        // Just previewing the download logic in browser
        handleDownload(reward)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">E-Shop</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Unlock rewards using your Community Points</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">Your Community Points</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{points.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((r) => {
                    const unlocked = points >= r.requiredPoints
                    return (
                        <div
                            key={r.level}
                            className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Level {r.level}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{r.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{r.description}</p>
                                </div>
                                {unlocked ? (
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                        <CheckCircle size={18} />
                                    </div>
                                ) : (
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4">
                                {!unlocked ? (
                                    <>
                                        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-accent-500"
                                                style={{ width: `${Math.min(100, (points / r.requiredPoints) * 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                            {Math.max(0, r.requiredPoints - points)} points to unlock
                                        </p>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-accent-50 dark:bg-accent-900/30 p-3 rounded-lg border border-accent-100 dark:border-accent-800">
                                            <p className="text-sm font-bold text-accent-700 dark:text-accent-300">Badge of Merit 🏆</p>
                                            <p className="text-xs text-accent-600 dark:text-accent-400 mt-1 italic">"Keep going! Your dedication is inspiring."</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <button 
                                                onClick={() => handleOpen(r)}
                                                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <ExternalLink size={14} /> Open
                                            </button>
                                            <button 
                                                onClick={() => handleDownload(r)}
                                                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-lg text-xs font-semibold hover:bg-accent-200 dark:hover:bg-accent-800 transition-colors"
                                            >
                                                <Download size={14} /> Download
                                            </button>
                                            <button 
                                                onClick={() => handleLinkedInShare(r)}
                                                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#0077b5] text-white rounded-lg text-xs font-semibold hover:bg-[#006396] transition-colors"
                                            >
                                                <Linkedin size={14} /> LinkedIn
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useApp } from '../state/AppContext'

export default function Settings() {
    const { state, actions } = useApp()
    const profile = state.profile

    const [fullName, setFullName] = useState(profile?.fullName ?? '')
    const [email, setEmail] = useState(profile?.email ?? '')
    const [location, setLocation] = useState(profile?.location ?? '')
    const [bio, setBio] = useState(profile?.bio ?? '')
    const [savedMessage, setSavedMessage] = useState('')

    useEffect(() => {
        setFullName(profile?.fullName ?? '')
        setEmail(profile?.email ?? '')
        setLocation(profile?.location ?? '')
        setBio(profile?.bio ?? '')
    }, [profile?.fullName, profile?.email, profile?.location, profile?.bio])

    const handleSave = () => {
        actions.updateProfile({ fullName, email, location, bio })
        setSavedMessage('Changes saved successfully')
        window.setTimeout(() => setSavedMessage(''), 1800)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your profile and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                    {savedMessage && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                            <CheckCircle2 size={14} />
                            {savedMessage}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account</h2>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                            <span className="font-semibold text-gray-900 dark:text-white">Username:</span> {state.user?.username}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900 dark:text-white">Role:</span> {state.user?.role}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900 dark:text-white">Email:</span> {state.user?.email}
                        </p>
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-gray-400">
                        Profile heatmap has been removed from Settings as requested.
                    </div>
                </div>
            </div>
        </div>
    )
}


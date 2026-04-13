import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import type { Channel } from '../state/types'

type Visibility = 'Private' | 'Public'

export default function EditChannelModal({
    channel,
    isOpen,
    onClose,
    onSave,
}: {
    channel: Channel | null
    isOpen: boolean
    onClose: () => void
    onSave: (channelId: string, input: { name: string; members: string[]; visibility: Visibility }) => void
}) {
    const [name, setName] = useState(channel?.name ?? '')
    const [membersRaw, setMembersRaw] = useState(channel?.members?.join(', ') ?? '')
    const [visibility, setVisibility] = useState<Visibility>(channel?.isPrivate ? 'Private' : 'Public')

    const members = useMemo(
        () =>
            membersRaw
                .split(',')
                .map((m) => m.trim())
                .filter(Boolean),
        [membersRaw],
    )

    const canSave = name.trim().length > 1 && !!channel

    if (!isOpen || !channel) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" onClick={onClose} className="absolute inset-0 bg-black/40" aria-label="Close modal" />

            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Channel</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Update name, members, and visibility</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Channel Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Members</label>
                        <input
                            value={membersRaw}
                            onChange={(e) => setMembersRaw(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Channel Visibility</label>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value as Visibility)}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                        >
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                        </select>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg font-semibold text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!canSave}
                        onClick={() => {
                            if (!channel) return
                            onSave(channel.id, { name: name.trim(), members, visibility })
                            onClose()
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${canSave
                                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg'
                                : 'bg-gray-200 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}


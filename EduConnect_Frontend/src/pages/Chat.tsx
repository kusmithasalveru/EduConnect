import { useEffect, useMemo, useState } from 'react'
import { Hash, Lock, Settings, Plus, X, MoreVertical } from 'lucide-react'
import { ChatWindow } from '../components'
import CreateChannelModal from '../components/CreateChannelModal'
import { useApp } from '../state/AppContext'
import EditChannelModal from '../components/EditChannelModal'
import type { Channel as ChannelType } from '../state/types'
import { useSearchParams } from 'react-router-dom'

interface Channel {
    id: string
    name: string
    description: string
    isPrivate: boolean
}

export default function Chat() {
    const { state, activeChannelId, actions } = useApp()
    const [searchParams] = useSearchParams()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [showAllChannels, setShowAllChannels] = useState(() => searchParams.get('view') === 'all')
    const channels: Channel[] = state.channels.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        isPrivate: c.isPrivate,
    }))

    const activeChannel = useMemo(() => {
        const found = channels.find((c) => c.id === activeChannelId)
        return found ?? channels[0]
    }, [channels, activeChannelId])
    const [isChannelListOpen, setIsChannelListOpen] = useState(true)

    useEffect(() => {
        const channelParam = searchParams.get('channel')
        if (channelParam) {
            actions.setActiveChannelId(channelParam)
            setShowAllChannels(true)
        }
    }, [searchParams, actions])
    const messages = state.messagesByChannelId[activeChannel?.id ?? ''] ?? []
    const messagesForUi = messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestampIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }))

    const coreChannelIds = useMemo(() => new Set(['queries', 'reminders', 'notes', 'resources']), [])
    const coreChannels = useMemo(() => channels.filter((c) => coreChannelIds.has(c.id)), [channels, coreChannelIds])
    const courseChannels = useMemo(() => channels.filter((c) => c.id.startsWith('course_')), [channels])
    const customChannels = useMemo(() => channels.filter((c) => c.id.startsWith('ch_')), [channels])
    const privateChannels = useMemo(() => channels.filter((c) => c.isPrivate && !c.id.startsWith('ch_')), [channels])
    const allPublic = useMemo(() => channels.filter((c) => !c.isPrivate), [channels])
    const activeChannelFull: ChannelType | null = useMemo(() => state.channels.find((c) => c.id === activeChannel.id) ?? null, [state.channels, activeChannel.id])
    const canManageActive = activeChannel.id.startsWith('ch_') || activeChannel.id.startsWith('course_')

    return (
        <div className="flex h-full bg-gray-50 dark:bg-slate-950 gap-4 p-4">
            {/* Channel Sidebar */}
            <div
                className={`${isChannelListOpen ? 'w-64' : 'w-0'
                    } bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-all duration-300 flex flex-col`}
            >
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Programming</h2>
                        <button
                            onClick={() => setIsChannelListOpen(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2,345 members</p>
                </div>

                {/* Channels List */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
                    <div className="px-2 py-1">
                        <button
                            type="button"
                            onClick={() => setShowAllChannels((v) => !v)}
                            className="w-full flex items-center justify-between px-2 py-1"
                        >
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Available Channels
                            </p>
                            <span className="text-xs text-accent-600 font-semibold">
                                {showAllChannels ? 'Show structured' : 'Show all'}
                            </span>
                        </button>

                        <div className="mt-3 space-y-3">
                            {!showAllChannels ? (
                                <>
                                    <div className="space-y-1">
                                        <p className="px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Queries
                                        </p>
                                        {coreChannels
                                            .filter((c) => c.id === 'queries')
                                            .map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    onClick={() => actions.setActiveChannelId(channel.id)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeChannel.id === channel.id
                                                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                                            : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <Hash size={16} />
                                                    <span className="font-medium text-sm">{channel.name}</span>
                                                </button>
                                            ))}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            In-Session Reminders
                                        </p>
                                        {coreChannels
                                            .filter((c) => c.id === 'reminders')
                                            .map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    onClick={() => actions.setActiveChannelId(channel.id)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeChannel.id === channel.id
                                                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                                            : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <Hash size={16} />
                                                    <span className="font-medium text-sm">{channel.name}</span>
                                                </button>
                                            ))}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Notes
                                        </p>
                                        {coreChannels
                                            .filter((c) => c.id === 'notes')
                                            .map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    onClick={() => actions.setActiveChannelId(channel.id)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeChannel.id === channel.id
                                                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                                            : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <Hash size={16} />
                                                    <span className="font-medium text-sm">{channel.name}</span>
                                                </button>
                                            ))}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Resources
                                        </p>
                                        {coreChannels
                                            .filter((c) => c.id === 'resources')
                                            .map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    onClick={() => actions.setActiveChannelId(channel.id)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeChannel.id === channel.id
                                                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                                            : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <Hash size={16} />
                                                    <span className="font-medium text-sm">{channel.name}</span>
                                                </button>
                                            ))}
                                    </div>

                                    <div className="px-2 pt-2 border-t border-gray-200 dark:border-slate-800">
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Course Channels
                                        </p>
                                        <div className="space-y-1">
                                            {courseChannels.length === 0 ? (
                                                <div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">No course channels yet</div>
                                            ) : (
                                                courseChannels.map((channel) => (
                                                    <button
                                                        key={channel.id}
                                                        onClick={() => actions.setActiveChannelId(channel.id)}
                                                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeChannel.id === channel.id
                                                                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                                                : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        <Hash size={16} />
                                                        <span className="font-medium text-sm">{channel.name}</span>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        {customChannels.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                    Custom Channels
                                                </p>
                                                <div className="space-y-1">
                                                    {customChannels.map((channel) => (
                                                        <button
                                                            key={channel.id}
                                                            onClick={() => actions.setActiveChannelId(channel.id)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeChannel.id === channel.id
                                                                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                                                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                                }`}
                                                        >
                                                            {channel.isPrivate ? <Lock size={16} /> : <Hash size={16} />}
                                                            <span className="font-medium text-sm">{channel.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        {allPublic.map((channel) => (
                                            <button
                                                key={channel.id}
                                                onClick={() => actions.setActiveChannelId(channel.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeChannel.id === channel.id
                                                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                                        : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <Hash size={16} />
                                                <span className="font-medium text-sm">{channel.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="px-2 pt-2 border-t border-gray-200 dark:border-slate-800">
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Private
                                        </p>
                                        <div className="space-y-1">
                                            {privateChannels.map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    onClick={() => actions.setActiveChannelId(channel.id)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeChannel.id === channel.id
                                                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                                            : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <Lock size={16} />
                                                    <span className="font-medium text-sm">{channel.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-800 p-4 space-y-2">
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm"
                    >
                        <Plus size={16} />
                        <span>Create Channel</span>
                    </button>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setSettingsOpen((v) => !v)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm"
                        >
                        <Settings size={16} />
                        <span>Settings</span>
                            <span className="ml-auto">
                                <MoreVertical size={16} />
                            </span>
                        </button>

                        {settingsOpen && (
                            <div className="absolute left-0 right-0 bottom-12 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">
                                <button
                                    type="button"
                                    disabled={!canManageActive}
                                    onClick={() => {
                                        if (!canManageActive) return
                                        setIsEditOpen(true)
                                        setSettingsOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm font-semibold ${canManageActive
                                            ? 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-900 dark:text-white'
                                            : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Edit Channel
                                </button>
                                <button
                                    type="button"
                                    disabled={!canManageActive}
                                    onClick={() => {
                                        if (!canManageActive) return
                                        actions.deleteChannel(activeChannel.id)
                                        setSettingsOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm font-semibold border-t border-gray-200 dark:border-slate-800 ${canManageActive
                                            ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300'
                                            : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Delete Channel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col">
                {!isChannelListOpen && (
                    <button
                        onClick={() => setIsChannelListOpen(true)}
                        className="p-4 text-gray-600 dark:text-gray-400 hover:text-accent-600 transition-colors"
                    >
                        ← Channels
                    </button>
                )}
                <ChatWindow
                    channelName={`#${activeChannel.name}`}
                    channelDescription={activeChannel.description}
                    messages={messagesForUi}
                    onSendMessage={(input) => actions.sendMessage(activeChannel.id, input)}
                />
            </div>

            <CreateChannelModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={(input) => actions.createChannel(input)}
            />

            <EditChannelModal
                channel={activeChannelFull}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={(channelId, input) => {
                    actions.updateChannel(channelId, {
                        name: input.name,
                        isPrivate: input.visibility === 'Private',
                        members: input.members,
                        description: input.visibility === 'Private' ? 'Private channel' : 'Public channel',
                    })
                }}
            />
        </div>
    )
}

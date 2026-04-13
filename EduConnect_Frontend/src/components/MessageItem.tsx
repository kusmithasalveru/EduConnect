import { MoreVertical, CornerDownLeft, Smile } from 'lucide-react'

interface MessageItemProps {
    id: string
    author: string
    avatar: string
    content: string
    timestamp: string
    reactions?: { emoji: string; count: number }[]
    isOwn?: boolean
    attachments?: { id: string; kind: 'image'; name: string; dataUrl: string }[]
}

export default function MessageItem({
    author,
    avatar,
    content,
    timestamp,
    reactions,
    isOwn,
    attachments,
}: MessageItemProps) {

    return (
        <div className={`flex gap-3 mb-4 group ${isOwn ? 'justify-end' : ''}`}>
            {!isOwn && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {avatar}
                </div>
            )}

            <div className={`flex flex-col ${isOwn ? 'items-end' : ''}`}>
                {/* Author Info */}
                <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{author}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
                </div>

                {/* Message Bubble */}
                <div
                    className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md xl:max-w-lg break-words ${isOwn
                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none'
                        }`}
                >
                    <p className="text-sm">{content}</p>
                    {attachments && attachments.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {attachments.map((a) => (
                                <a
                                    key={a.id}
                                    href={a.dataUrl}
                                    download={a.name}
                                    className="block rounded-lg overflow-hidden border border-white/20"
                                    title={a.name}
                                >
                                    <img src={a.dataUrl} alt={a.name} className="w-full h-28 object-cover" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reactions */}
                {reactions && reactions.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {reactions.map((reaction, idx) => (
                            <button
                                key={idx}
                                className="px-2 py-1 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-xs"
                            >
                                {reaction.emoji} {reaction.count}
                            </button>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors" title="Add reaction">
                        <Smile size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors" title="Reply">
                        <CornerDownLeft size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors" title="More options">
                        <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    )
}

import { useRef, useEffect, useMemo, useState } from 'react'
import { Send, Paperclip, Smile, X } from 'lucide-react'
import MessageItem from './MessageItem'

interface Message {
    id: string
    author: string
    avatar: string
    content: string
    timestamp: string
    reactions?: { emoji: string; count: number }[]
    isOwn?: boolean
    attachments?: { id: string; kind: 'image'; name: string; dataUrl: string }[]
}

interface ChatWindowProps {
    channelName: string
    channelDescription?: string
    messages: Message[]
    onSendMessage?: (input: { content: string; attachments?: { id: string; kind: 'image'; name: string; dataUrl: string }[] }) => void
}

export default function ChatWindow({
    channelName,
    channelDescription,
    messages,
    onSendMessage,
}: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [pendingImages, setPendingImages] = useState<{ id: string; name: string; dataUrl: string }[]>([])
    const [emojiOpen, setEmojiOpen] = useState(false)

    const emojis = useMemo(() => ['😀', '😊', '🔥', '🎯', '👍', '🎉', '✨', '📌', '✅', '🤝'], [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (newMessage.trim() || pendingImages.length > 0) {
            onSendMessage?.({
                content: newMessage,
                attachments:
                    pendingImages.length > 0
                        ? pendingImages.map((p) => ({ id: p.id, kind: 'image' as const, name: p.name, dataUrl: p.dataUrl }))
                        : undefined,
            })
            setNewMessage('')
            setPendingImages([])
            setEmojiOpen(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-10 bg-white dark:bg-slate-950">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{channelName}</h2>
                {channelDescription && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{channelDescription}</p>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {messages.map((message) => (
                    <MessageItem key={message.id} {...message} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-slate-800 p-4">
                {pendingImages.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {pendingImages.map((img) => (
                            <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                                <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setPendingImages((prev) => prev.filter((p) => p.id !== img.id))}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded"
                                    aria-label="Remove image"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-end gap-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Upload from gallery"
                    >
                        <Paperclip size={20} />
                    </button>

                    <div className="flex-1 flex items-end gap-2 bg-gray-100 dark:bg-slate-800 rounded-lg px-4 py-2 border border-gray-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-accent-500">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setEmojiOpen((v) => !v)}
                                className="p-1 text-gray-600 dark:text-gray-400 hover:text-accent-600 transition-colors"
                                title="Emoji"
                            >
                            <Smile size={20} />
                            </button>
                            {emojiOpen && (
                                <div className="absolute bottom-10 right-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg p-2 grid grid-cols-5 gap-1 z-20">
                                    {emojis.map((e) => (
                                        <button
                                            key={e}
                                            type="button"
                                            onClick={() => setNewMessage((m) => `${m}${e}`)}
                                            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleSendMessage}
                        className="p-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                        <Send size={20} />
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                        const files = Array.from(e.target.files ?? [])
                        if (files.length === 0) return
                        const reads = files.slice(0, 4).map(
                            (f) =>
                                new Promise<{ id: string; name: string; dataUrl: string }>((resolve, reject) => {
                                    const reader = new FileReader()
                                    reader.onload = () => resolve({ id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, name: f.name, dataUrl: String(reader.result) })
                                    reader.onerror = () => reject(new Error('Failed to read file'))
                                    reader.readAsDataURL(f)
                                }),
                        )
                        try {
                            const results = await Promise.all(reads)
                            setPendingImages((prev) => [...prev, ...results])
                        } finally {
                            e.currentTarget.value = ''
                        }
                    }}
                />
            </div>
        </div>
    )
}

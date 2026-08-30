import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { loadAppState, saveAppState } from './storage'
import { API_BASE_URL } from '../config/api'
import type {
    AppState,
    Channel,
    ChatMessage,
    ChatAttachment,
    Course,
    Notification,
    PaymentMethod,
    PendingPayment,
    TutorSession,
    User,
    UserProfile,
    UserRole,
} from './types'
import { defaultUserStats } from './types'

type AuthMode = 'signin' | 'signup'

type CreateChannelInput = {
    name: string
    members: string[]
    visibility: 'Private' | 'Public'
}

type BookTutorPaymentInput = {
    tutorName: string
    courseType: string
    title: string
    startTimeIso: string
    durationMinutes: number
}

interface AppActions {
    login: (input: { usernameOrEmail: string; password: string; role: UserRole; mode: AuthMode; email?: string }) => Promise<void>
    logout: () => void

    updateProfile: (patch: Partial<Pick<UserProfile, 'fullName' | 'email' | 'location' | 'bio' | 'profileImage'>>) => void

    startCourseEnrollment: (courseId: string) => void
    completeCoursePayment: (courseId: string) => void
    completeCourse: (courseId: string) => void

    completeTutorSession: (sessionId: string) => void
    bookTutorSessionWithPayment: (input: BookTutorPaymentInput) => Promise<void>

    createChannel: (input: CreateChannelInput) => void
    updateChannel: (channelId: string, patch: Partial<Pick<Channel, 'name' | 'description' | 'isPrivate' | 'members'>>) => void
    deleteChannel: (channelId: string) => void
    setActiveChannelId: (channelId: string) => void
    sendMessage: (channelId: string, input: { content: string; attachments?: ChatAttachment[] }) => void

    startTutorSessionPayment: (input: BookTutorPaymentInput) => void
    startCoursePayment: (courseId: string) => void
    completePendingPayment: (method: PaymentMethod) => Promise<void>

    markAllNotificationsRead: () => void
}

interface AppContextValue {
    state: AppState
    activeChannelId: string | null
    actions: AppActions
}

function addMinutes(iso: string, minutes: number) {
    const d = new Date(iso)
    d.setMinutes(d.getMinutes() + minutes)
    return d.toISOString()
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function newId(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function seedCourses(): Course[] {
    return [
        {
            id: '1',
            title: 'React Advanced Patterns',
            instructor: 'Sarah Chen',
            rating: 4.9,
            reviews: 328,
            students: 5420,
            duration: '24',
            thumbnail: '⚛️',
            imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
            category: 'Web Development',
            enrollmentStatus: 'enrolled',
            paymentStatus: 'paid',
            channelId: 'course_1',
        },
        {
            id: '2',
            title: 'Data Science Fundamentals',
            instructor: 'Dr. James Wilson',
            rating: 4.8,
            reviews: 245,
            students: 3890,
            duration: '32',
            thumbnail: '📊',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            category: 'Data Science',
            enrollmentStatus: 'enrolled',
            paymentStatus: 'paid',
            channelId: 'course_2',
        },
        {
            id: '3',
            title: 'Web Design Masterclass',
            instructor: 'Emily Rodriguez',
            rating: 4.7,
            reviews: 156,
            students: 2100,
            duration: '18',
            thumbnail: '🎨',
            imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
            category: 'Design',
            enrollmentStatus: 'enrolled',
            paymentStatus: 'paid',
            channelId: 'course_3',
        },
        {
            id: '4',
            title: 'Machine Learning with Python',
            instructor: 'Alex Kumar',
            rating: 4.9,
            reviews: 512,
            students: 8900,
            duration: '40',
            thumbnail: '🤖',
            imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
            category: 'AI/ML',
            enrollmentStatus: 'none',
            paymentStatus: 'none',
        },
        {
            id: '5',
            title: 'Advanced TypeScript',
            instructor: 'Tom Richardson',
            rating: 4.8,
            reviews: 287,
            students: 6200,
            duration: '28',
            thumbnail: '📘',
            imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
            category: 'Web Development',
            enrollmentStatus: 'none',
            paymentStatus: 'none',
        },
        {
            id: '6',
            title: 'UI/UX Design Principles',
            instructor: 'Grace Lee',
            rating: 4.9,
            reviews: 423,
            students: 7100,
            duration: '22',
            thumbnail: '✨',
            imageUrl: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=1200&q=80',
            category: 'Design',
            enrollmentStatus: 'none',
            paymentStatus: 'none',
        },
        {
            id: '7',
            title: 'Data Structures & Algorithms',
            instructor: 'David Park',
            rating: 4.9,
            reviews: 331,
            students: 5800,
            duration: '35',
            thumbnail: '🔗',
            imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80',
            category: 'Computer Science',
            enrollmentStatus: 'none',
            paymentStatus: 'none',
        },
        {
            id: '8',
            title: 'Full Stack Web Development',
            instructor: 'Michael Chang',
            rating: 4.8,
            reviews: 267,
            students: 4500,
            duration: '48',
            thumbnail: '🌐',
            imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
            category: 'Web Development',
            enrollmentStatus: 'none',
            paymentStatus: 'none',
        },
        {
            id: '9',
            title: 'Cloud Computing with AWS',
            instructor: 'Sophia Martinez',
            rating: 4.8,
            reviews: 198,
            students: 3200,
            duration: '30',
            thumbnail: '☁️',
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
            category: 'DevOps',
            enrollmentStatus: 'none',
            paymentStatus: 'none',
        },
    ]
}

const courseImageById: Record<string, string> = {
    '1': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80', // React
    '2': 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80', // Data/DB
    '3': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', // Web
    '4': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80', // AI/ML
    '5': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80', // TypeScript
    '6': 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80', // UI/UX
    '7': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', // Networking/DSA
    '8': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80', // Full-stack
    '9': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', // Cloud/DevOps
}

function withCourseImageDefaults(courses: Course[]): Course[] {
    return courses.map((course) => ({
        ...course,
        imageUrl: course.imageUrl ?? courseImageById[course.id],
    }))
}

type BackendAuthResponse = {
    token: string
    fullName: string
    email: string
    role: 'STUDENT' | 'MENTOR' | 'ADMIN'
}

type BackendCourseResponse = {
    id: number
    title: string
    description: string
    mentorName: string
    enrolledCount: number
}

const API_BASE = API_BASE_URL
const TOKEN_KEY = 'educonnect_jwt_token'

function mapBackendRole(role: BackendAuthResponse['role']): UserRole {
    if (role === 'MENTOR') return 'Tutor'
    if (role === 'ADMIN') return 'Admin'
    return 'Student'
}

function mapFrontendRole(role: UserRole): BackendAuthResponse['role'] {
    if (role === 'Tutor') return 'MENTOR'
    if (role === 'Admin') return 'ADMIN'
    return 'STUDENT'
}

function mapBackendCourses(courses: BackendCourseResponse[]): Course[] {
    return withCourseImageDefaults(
        courses.map((c, idx) => ({
            id: String(c.id),
            title: c.title,
            instructor: c.mentorName || 'EduConnect Mentor',
            rating: 4.7 + (idx % 3) * 0.1,
            reviews: 80 + idx * 13,
            students: Math.max(c.enrolledCount || 0, 12),
            duration: String(20 + (idx % 6) * 4),
            thumbnail: ['⚛️', '📊', '🎨', '🤖', '📘', '✨', '🔗', '🌐', '☁️'][idx % 9],
            category: ['Web Development', 'Data Science', 'Design', 'AI/ML', 'Computer Science'][idx % 5],
            enrollmentStatus: 'none',
            paymentStatus: 'none',
            channelId: `course_${c.id}`,
        })),
    )
}

async function fetchBackendCourses(token: string): Promise<Course[]> {
    const response = await axios.get<BackendCourseResponse[]>(`${API_BASE}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    return mapBackendCourses(response.data)
}

function seedSessions(): TutorSession[] {
    const now = new Date()
    const today = new Date(now)
    today.setHours(15, 0, 0, 0)
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(14, 0, 0, 0)
    const inTwoDays = new Date(now)
    inTwoDays.setDate(inTwoDays.getDate() + 2)
    inTwoDays.setHours(16, 0, 0, 0)

    return [
        {
            id: 's1',
            tutorName: 'Alex Johnson',
            title: 'React Hooks Live Session',
            courseType: 'Web Development',
            startTimeIso: today.toISOString(),
            durationMinutes: 60,
            endTimeIso: addMinutes(today.toISOString(), 60),
            status: 'upcoming',
        },
        {
            id: 's2',
            tutorName: 'Maria Garcia',
            title: 'Advanced SQL Practice',
            courseType: 'Databases',
            startTimeIso: tomorrow.toISOString(),
            durationMinutes: 45,
            endTimeIso: addMinutes(tomorrow.toISOString(), 45),
            status: 'upcoming',
        },
        {
            id: 's3',
            tutorName: 'David Park',
            title: 'System Design Q&A',
            courseType: 'Computer Science',
            startTimeIso: inTwoDays.toISOString(),
            durationMinutes: 90,
            endTimeIso: addMinutes(inTwoDays.toISOString(), 90),
            status: 'upcoming',
        },
    ]
}

function seedChannels(nowIso: string): Channel[] {
    return [
        { id: 'queries', name: 'queries', description: 'Ask questions and start discussions', isPrivate: false, members: [], createdAtIso: nowIso },
        { id: 'reminders', name: 'in-session-reminders', description: 'Reminders posted by tutors', isPrivate: false, members: [], createdAtIso: nowIso },
        { id: 'notes', name: 'notes', description: 'Personal and shared notes', isPrivate: false, members: [], createdAtIso: nowIso },
        { id: 'resources', name: 'resources', description: 'Links, docs, and study resources', isPrivate: false, members: [], createdAtIso: nowIso },
        { id: 'announcements', name: 'announcements', description: 'Important updates', isPrivate: true, members: [], createdAtIso: nowIso },
        { id: 'private-activity', name: 'private-activity', description: 'Community activity feed', isPrivate: true, members: [], createdAtIso: nowIso },

        // Course-related channels (created/ensured on demand)
        { id: 'course_1', name: 'react-advanced-patterns', description: 'Course channel', isPrivate: false, members: [], createdAtIso: nowIso },
        { id: 'course_2', name: 'data-science-fundamentals', description: 'Course channel', isPrivate: false, members: [], createdAtIso: nowIso },
        { id: 'course_3', name: 'web-design-masterclass', description: 'Course channel', isPrivate: false, members: [], createdAtIso: nowIso },
    ]
}

function seedMessages(nowIso: string): Record<string, ChatMessage[]> {
    const ts = (h: number, m: number) => {
        const d = new Date(nowIso)
        d.setHours(h, m, 0, 0)
        return d.toISOString()
    }

    return {
        queries: [
            {
                id: 'm1',
                author: 'Sarah Chen',
                avatar: 'SC',
                content: 'Hey everyone! Has anyone worked with React Suspense before?',
                timestampIso: ts(10, 30),
                type: 'normal',
                reactions: [
                    { emoji: '👍', count: 5 },
                    { emoji: '🎉', count: 2 },
                ],
            },
            {
                id: 'm2',
                author: 'Alex Kumar',
                avatar: 'AK',
                content: 'Yes! I use it all the time in my projects. What issues are you facing?',
                timestampIso: ts(10, 32),
                type: 'normal',
                reactions: [{ emoji: '👀', count: 1 }],
            },
            {
                id: 'm3',
                author: 'You',
                avatar: 'JD',
                content: "I'm trying to implement lazy loading with code splitting. Resources would be appreciated!",
                timestampIso: ts(10, 35),
                type: 'normal',
                isOwn: true,
            },
            {
                id: 'm4',
                author: 'Emma Wilson',
                avatar: 'EW',
                content: 'Check out the React docs on code splitting. It has great examples!',
                timestampIso: ts(10, 37),
                type: 'normal',
                reactions: [{ emoji: '✨', count: 3 }],
            },
        ],
        'private-activity': [
            {
                id: 'a1',
                author: 'EduConnect',
                avatar: 'EC',
                content: 'Sarah Chen completed React Advanced Patterns course (2 hours ago)',
                timestampIso: ts(11, 0),
                type: 'activity',
            },
            {
                id: 'a2',
                author: 'EduConnect',
                avatar: 'EC',
                content: 'Alex Kumar answered a question in #react-help channel (4 hours ago)',
                timestampIso: ts(9, 0),
                type: 'activity',
            },
            {
                id: 'a3',
                author: 'EduConnect',
                avatar: 'EC',
                content: 'Emma Wilson achieved 1000 community points (6 hours ago)',
                timestampIso: ts(7, 0),
                type: 'activity',
            },
            {
                id: 'a4',
                author: 'EduConnect',
                avatar: 'EC',
                content: 'John Martinez started Data Science Fundamentals (8 hours ago)',
                timestampIso: ts(5, 0),
                type: 'activity',
            },
        ],
        reminders: [
            {
                id: 'r1',
                author: 'Maria Garcia',
                avatar: 'MG',
                content: 'Reminder: Bring your questions to the SQL session tomorrow.',
                timestampIso: ts(12, 5),
                type: 'reminder',
            },
        ],
        notes: [],
        resources: [],
        announcements: [],
        course_1: [],
        course_2: [],
        course_3: [],
    }
}

function seedNotificationsFromSessions(sessions: TutorSession[], nowIso: string): Notification[] {
    return sessions
        .filter((s) => s.status === 'upcoming')
        .map((s) => ({
            id: newId('n'),
            type: 'upcoming_session',
            title: 'Upcoming Tutor Session',
            body: `${s.title} • ${formatTime(s.startTimeIso)} - ${formatTime(s.endTimeIso)} • ${s.courseType}`,
            createdAtIso: nowIso,
            read: false,
        }))
}

function createFreshState(): AppState {
    const nowIso = new Date().toISOString()
    const sessions = seedSessions()
    return {
        isAuthenticated: false,
        user: null,
        profile: null,
        stats: defaultUserStats,
        courses: seedCourses(),
        sessions,
        channels: seedChannels(nowIso),
        messagesByChannelId: seedMessages(nowIso),
        notifications: seedNotificationsFromSessions(sessions, nowIso),
        pendingPayment: null,
    }
}

function migrateState(input: AppState): AppState {
    const withDefaults: AppState = {
        ...input,
        user: input.user
            ? ({
                  ...input.user,
                  email:
                      (input.user as any).email ?? `${input.user.username.replace(/\s+/g, '.').toLowerCase()}@educonnect.local`,
              } as User)
            : null,
        profile: input.profile ?? null,
        pendingPayment: input.pendingPayment ?? null,
        courses: withCourseImageDefaults(input.courses),
    }

    // If old topic-based channels exist, replace with the new structured set.
    const hasOldTopics = withDefaults.channels.some((c) => ['general', 'react-help', 'dsa', 'projects', 'off-topic'].includes(c.id) || ['general', 'react-help', 'dsa', 'projects', 'off-topic'].includes(c.name))
    if (hasOldTopics) {
        const nowIso = new Date().toISOString()
        const baseChannels = seedChannels(nowIso)
        const baseMessages = seedMessages(nowIso)
        return {
            ...withDefaults,
            channels: baseChannels,
            messagesByChannelId: { ...baseMessages, ...withDefaults.messagesByChannelId },
        }
    }

    return withDefaults
}

const Ctx = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AppState>(() => {
        const loaded = loadAppState()
        return migrateState(loaded ?? createFreshState())
    })
    const [activeChannelId, setActiveChannelId] = useState<string | null>(() => (state.channels[0]?.id ? state.channels[0].id : null))
    const stateRef = useRef(state)
    const activeChannelIdRef = useRef(activeChannelId)

    useEffect(() => {
        stateRef.current = state
    }, [state])

    useEffect(() => {
        activeChannelIdRef.current = activeChannelId
    }, [activeChannelId])

    useEffect(() => {
        saveAppState(state)
    }, [state])

    const actions: AppActions = useMemo(() => {
        return {
            login: async ({ usernameOrEmail, password, role, mode, email }) => {
                const resolvedEmail = (mode === 'signup' ? email : usernameOrEmail)?.trim() ?? ''
                if (!resolvedEmail.includes('@')) {
                    throw new Error('Please use a valid email address.')
                }

                let auth: BackendAuthResponse
                let backendCourses: Course[] = []

                try {
                    const authUrl = mode === 'signup' ? `${API_BASE}/api/auth/register` : `${API_BASE}/api/auth/login`
                    const payload =
                        mode === 'signup'
                            ? { email: resolvedEmail, password, fullName: usernameOrEmail.trim(), role: mapFrontendRole(role) }
                            : { email: resolvedEmail, password }

                    const authResponse = await axios.post<BackendAuthResponse>(authUrl, payload)
                    auth = authResponse.data
                    localStorage.setItem(TOKEN_KEY, auth.token)

                    backendCourses = await fetchBackendCourses(auth.token)
                    const isMentorOrAdmin = auth.role === 'MENTOR' || auth.role === 'ADMIN'
                    if (backendCourses.length === 0 && isMentorOrAdmin) {
                        const starterCourses = seedCourses()
                        await Promise.all(
                            starterCourses.map((course) =>
                                axios.post(
                                    `${API_BASE}/api/courses`,
                                    {
                                        title: course.title,
                                        description: `Foundational and practical learning path for ${course.title}.`,
                                    },
                                    { headers: { Authorization: `Bearer ${auth.token}` } },
                                ),
                            ),
                        )
                        backendCourses = await fetchBackendCourses(auth.token)
                    }
                } catch (error) {
                    console.warn("Backend auth failed, using mock authentication.", error)
                    const fullName = mode === 'signup' ? usernameOrEmail.trim() : (resolvedEmail.split('@')[0] || 'Demo User')
                    auth = {
                        token: 'mock-jwt-token',
                        fullName: fullName.charAt(0).toUpperCase() + fullName.slice(1),
                        email: resolvedEmail,
                        role: mapFrontendRole(role)
                    }
                    localStorage.setItem(TOKEN_KEY, auth.token)
                    backendCourses = seedCourses()
                }

                setState((prev) => {
                    const username = auth.fullName
                    const user: User = { username, role: mapBackendRole(auth.role), email: auth.email }
                    const profileKey = `educonnect_profile_${username.toLowerCase()}`
                    const existingProfileRaw = localStorage.getItem(profileKey)
                    const existingProfile = existingProfileRaw ? (JSON.parse(existingProfileRaw) as UserProfile) : null
                    const profile: UserProfile =
                        existingProfile ??
                        ({
                            username,
                            email: auth.email,
                            fullName: auth.fullName,
                            location: '—',
                            bio: 'Tell us a bit about yourself.',
                            joinDateIso: new Date().toISOString(),
                        } satisfies UserProfile)

                    localStorage.setItem(profileKey, JSON.stringify(profile))
                    localStorage.setItem(`educonnect_email_map_${auth.email.toLowerCase()}`, username)

                    return {
                        ...prev,
                        isAuthenticated: true,
                        user,
                        profile,
                        courses: backendCourses.length > 0 ? backendCourses : prev.courses,
                    }
                })
            },
            logout: () => {
                localStorage.removeItem(TOKEN_KEY)
                setState((prev) => ({ ...prev, isAuthenticated: false, user: null, profile: null, pendingPayment: null }))
            },

            updateProfile: (patch) => {
                setState((prev) => {
                    if (!prev.user || !prev.profile) return prev
                    const nextProfile: UserProfile = { ...prev.profile, ...patch, username: prev.user.username }
                    const nextUser: User = { ...prev.user, email: nextProfile.email }
                    localStorage.setItem(`educonnect_profile_${prev.user.username.toLowerCase()}`, JSON.stringify(nextProfile))
                    localStorage.setItem(`educonnect_email_map_${nextProfile.email.toLowerCase()}`, prev.user.username)
                    return { ...prev, user: nextUser, profile: nextProfile }
                })
            },

            startCourseEnrollment: (courseId) => {
                const token = localStorage.getItem(TOKEN_KEY)
                if (token && !Number.isNaN(Number(courseId))) {
                    axios.post(`${API_BASE}/api/courses/${Number(courseId)}/enroll`, null, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).catch(() => {
                        // Keep local UX responsive even if backend enrollment fails.
                    })
                }
                setState((prev) => ({
                    ...prev,
                    courses: prev.courses.map((c) => {
                        if (c.id !== courseId) return c
                        if (c.enrollmentStatus !== 'none') return c
                        const channelId = c.channelId ?? `course_${c.id}`
                        return { ...c, enrollmentStatus: 'enrolled', paymentStatus: 'in_progress', channelId }
                    }),
                    channels: prev.channels.some((ch) => ch.id === `course_${courseId}`)
                        ? prev.channels
                        : [
                              {
                                  id: `course_${courseId}`,
                                  name: prev.courses.find((c) => c.id === courseId)?.title
                                      ?.toLowerCase()
                                      .replace(/[^a-z0-9]+/g, '-')
                                      .replace(/(^-|-$)/g, '') || `course-${courseId}`,
                                  description: 'Course channel',
                                  isPrivate: false,
                                  members: [],
                                  createdAtIso: new Date().toISOString(),
                              },
                              ...prev.channels,
                          ],
                    messagesByChannelId: prev.messagesByChannelId[`course_${courseId}`]
                        ? prev.messagesByChannelId
                        : { ...prev.messagesByChannelId, [`course_${courseId}`]: [] },
                }))
                setActiveChannelId(`course_${courseId}`)
            },
            completeCoursePayment: (courseId) => {
                setState((prev) => ({
                    ...prev,
                    courses: prev.courses.map((c) =>
                        c.id === courseId && c.paymentStatus === 'in_progress'
                            ? { ...c, paymentStatus: 'paid' }
                            : c,
                    ),
                }))
            },
            completeCourse: (courseId) => {
                setState((prev) => {
                    const target = prev.courses.find((c) => c.id === courseId)
                    if (!target) return prev
                    if (target.enrollmentStatus === 'completed') return prev
                    if (target.enrollmentStatus !== 'enrolled') return prev
                    if (target.paymentStatus !== 'paid') return prev
                    return {
                        ...prev,
                        courses: prev.courses.map((c) => (c.id === courseId ? { ...c, enrollmentStatus: 'completed' } : c)),
                        stats: {
                            ...prev.stats,
                            coursesCompleted: prev.stats.coursesCompleted + 1,
                            communityPoints: prev.stats.communityPoints + 40,
                        },
                    }
                })
            },

            completeTutorSession: (sessionId) => {
                setState((prev) => {
                    const session = prev.sessions.find((s) => s.id === sessionId)
                    if (!session) return prev
                    if (session.status === 'completed') return prev
                    return {
                        ...prev,
                        sessions: prev.sessions.map((s) => (s.id === sessionId ? { ...s, status: 'completed' } : s)),
                        stats: {
                            ...prev.stats,
                            tutorSessions: prev.stats.tutorSessions + 1,
                            communityPoints: prev.stats.communityPoints + 20,
                        },
                        notifications: prev.notifications.map((n) =>
                            n.type === 'upcoming_session' && n.body.includes(session.title) ? { ...n, read: true } : n,
                        ),
                    }
                })
            },

            bookTutorSessionWithPayment: async (input) => {
                // Simulate payment latency
                await new Promise((r) => setTimeout(r, 700))
                setState((prev) => {
                    const endIso = addMinutes(input.startTimeIso, input.durationMinutes)
                    const newSession: TutorSession = {
                        id: newId('sess'),
                        tutorName: input.tutorName,
                        title: input.title,
                        courseType: input.courseType,
                        startTimeIso: input.startTimeIso,
                        endTimeIso: endIso,
                        durationMinutes: input.durationMinutes,
                        status: 'upcoming',
                    }
                    const nowIso = new Date().toISOString()
                    const newNotification: Notification = {
                        id: newId('n'),
                        type: 'upcoming_session',
                        title: 'Upcoming Tutor Session',
                        body: `${newSession.title} • ${formatTime(newSession.startTimeIso)} - ${formatTime(newSession.endTimeIso)} • ${newSession.courseType}`,
                        createdAtIso: nowIso,
                        read: false,
                    }
                    return { ...prev, sessions: [newSession, ...prev.sessions], notifications: [newNotification, ...prev.notifications] }
                })
            },

            createChannel: ({ name, members, visibility }) => {
                setState((prev) => {
                    const nowIso = new Date().toISOString()
                    const channel: Channel = {
                        id: newId('ch'),
                        name,
                        description: visibility === 'Private' ? 'Private channel' : 'Public channel',
                        isPrivate: visibility === 'Private',
                        members,
                        createdAtIso: nowIso,
                    }
                    return {
                        ...prev,
                        channels: [channel, ...prev.channels],
                        messagesByChannelId: { ...prev.messagesByChannelId, [channel.id]: [] },
                    }
                })
            },

            updateChannel: (channelId, patch) => {
                setState((prev) => {
                    if (!prev.channels.some((c) => c.id === channelId)) return prev
                    return {
                        ...prev,
                        channels: prev.channels.map((c) => (c.id === channelId ? { ...c, ...patch, id: c.id } : c)),
                    }
                })
            },
            deleteChannel: (channelId) => {
                setState((prev) => {
                    const nextChannels = prev.channels.filter((c) => c.id !== channelId)
                    const { [channelId]: _removed, ...restMsgs } = prev.messagesByChannelId
                    const nextActive = nextChannels[0]?.id ?? 'queries'
                    if (activeChannelIdRef.current === channelId) setActiveChannelId(nextActive)
                    return { ...prev, channels: nextChannels, messagesByChannelId: restMsgs }
                })
            },

            setActiveChannelId: (channelId) => setActiveChannelId(channelId),

            sendMessage: (channelId, { content, attachments }) => {
                setState((prev) => {
                    if (!prev.user) return prev
                    const trimmed = content.trim()
                    if (!trimmed) return prev

                    const isTutorReminder = prev.user.role === 'Tutor' && trimmed.toLowerCase().startsWith('/remind ')
                    const messageContent = isTutorReminder ? trimmed.slice('/remind '.length).trim() : trimmed
                    const nowIso = new Date().toISOString()

                    const msg: ChatMessage = {
                        id: newId('m'),
                        author: 'You',
                        avatar: 'JD',
                        content: messageContent,
                        timestampIso: nowIso,
                        type: isTutorReminder ? 'reminder' : 'normal',
                        isOwn: true,
                        attachments,
                    }

                    const nextMessages = [...(prev.messagesByChannelId[channelId] ?? []), msg]

                    const nextNotifications: Notification[] = isTutorReminder
                        ? [
                              {
                                  id: newId('n'),
                                  type: 'tutor_reminder',
                                  title: 'Tutor Reminder',
                                  body: messageContent,
                                  createdAtIso: nowIso,
                                  read: false,
                              },
                              ...prev.notifications,
                          ]
                        : prev.notifications

                    return {
                        ...prev,
                        messagesByChannelId: { ...prev.messagesByChannelId, [channelId]: nextMessages },
                        notifications: nextNotifications,
                    }
                })
            },

            startTutorSessionPayment: (input) => {
                setState((prev) => ({
                    ...prev,
                    pendingPayment: {
                        id: newId('pay'),
                        kind: 'tutor_session',
                        tutorName: input.tutorName,
                        courseType: input.courseType,
                        title: input.title,
                        startTimeIso: input.startTimeIso,
                        durationMinutes: input.durationMinutes,
                    } satisfies PendingPayment,
                }))
            },
            startCoursePayment: (courseId) => {
                setState((prev) => ({
                    ...prev,
                    pendingPayment: { id: newId('pay'), kind: 'course', courseId } satisfies PendingPayment,
                }))
            },
            completePendingPayment: async (_method: PaymentMethod) => {
                const payment = stateRef.current.pendingPayment
                if (!payment) return
                // Simulate gateway latency
                await new Promise((r) => setTimeout(r, 900))

                if (payment.kind === 'tutor_session') {
                    setState((prev) => {
                        const endIso = addMinutes(payment.startTimeIso, payment.durationMinutes)
                        const newSession: TutorSession = {
                            id: newId('sess'),
                            tutorName: payment.tutorName,
                            title: payment.title,
                            courseType: payment.courseType,
                            startTimeIso: payment.startTimeIso,
                            endTimeIso: endIso,
                            durationMinutes: payment.durationMinutes,
                            status: 'upcoming',
                        }
                        const nowIso = new Date().toISOString()
                        const newNotification: Notification = {
                            id: newId('n'),
                            type: 'upcoming_session',
                            title: 'Upcoming Tutor Session',
                            body: `${newSession.title} • ${formatTime(newSession.startTimeIso)} - ${formatTime(newSession.endTimeIso)} • ${newSession.courseType}`,
                            createdAtIso: nowIso,
                            read: false,
                        }
                        return {
                            ...prev,
                            sessions: [newSession, ...prev.sessions],
                            notifications: [newNotification, ...prev.notifications],
                            pendingPayment: null,
                        }
                    })
                } else {
                    setState((prev) => ({
                        ...prev,
                        courses: prev.courses.map((c) =>
                            c.id === payment.courseId && c.paymentStatus === 'in_progress'
                                ? { ...c, paymentStatus: 'paid' }
                                : c,
                        ),
                        pendingPayment: null,
                    }))
                }
            },

            markAllNotificationsRead: () => {
                setState((prev) => ({ ...prev, notifications: prev.notifications.map((n) => ({ ...n, read: true })) }))
            },
        }
    }, [])

    const value: AppContextValue = useMemo(
        () => ({ state, activeChannelId, actions }),
        [state, activeChannelId, actions],
    )

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
    const v = useContext(Ctx)
    if (!v) throw new Error('useApp must be used within AppProvider')
    return v
}


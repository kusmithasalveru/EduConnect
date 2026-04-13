export type UserRole = 'Student' | 'Tutor' | 'Admin'

export interface User {
    username: string
    email: string
    role: UserRole
}

export interface UserProfile {
    username: string
    email: string
    fullName: string
    location: string
    bio: string
    joinDateIso: string
    profileImage?: string
}

export interface UserStats {
    learningStreak: number
    coursesCompleted: number
    tutorSessions: number
    communityPoints: number
}

export const defaultUserStats: UserStats = {
    learningStreak: 0,
    coursesCompleted: 0,
    tutorSessions: 0,
    communityPoints: 0,
}

export type CourseEnrollmentStatus = 'none' | 'enrolled' | 'completed'

export type PaymentStatus = 'none' | 'in_progress' | 'paid'

export interface Course {
    id: string
    title: string
    instructor: string
    rating: number
    reviews: number
    students: number
    duration: string
    thumbnail: string
    imageUrl?: string
    category?: string
    enrollmentStatus: CourseEnrollmentStatus
    paymentStatus: PaymentStatus
    channelId?: string
}

export type TutorSessionStatus = 'upcoming' | 'completed'

export interface TutorSession {
    id: string
    title: string
    courseType: string
    startTimeIso: string
    endTimeIso: string
    durationMinutes: number
    status: TutorSessionStatus
    tutorName?: string
}

export interface Channel {
    id: string
    name: string
    description: string
    isPrivate: boolean
    members: string[]
    createdAtIso: string
}

export type ChatMessageType = 'normal' | 'reminder' | 'activity'

export interface ChatAttachment {
    id: string
    kind: 'image'
    name: string
    dataUrl: string
}

export interface ChatMessage {
    id: string
    author: string
    avatar: string
    content: string
    timestampIso: string
    type: ChatMessageType
    isOwn?: boolean
    reactions?: { emoji: string; count: number }[]
    attachments?: ChatAttachment[]
}

export type NotificationType = 'upcoming_session' | 'tutor_reminder'

export interface Notification {
    id: string
    type: NotificationType
    title: string
    body: string
    createdAtIso: string
    read: boolean
}

export interface AppState {
    isAuthenticated: boolean
    user: User | null
    profile: UserProfile | null
    stats: UserStats
    courses: Course[]
    sessions: TutorSession[]
    channels: Channel[]
    messagesByChannelId: Record<string, ChatMessage[]>
    notifications: Notification[]
    pendingPayment: PendingPayment | null
}

export type PaymentMethod = 'UPI' | 'NetBanking' | 'Other'

export type PendingPayment =
    | {
          id: string
          kind: 'tutor_session'
          tutorName: string
          courseType: string
          title: string
          startTimeIso: string
          durationMinutes: number
      }
    | {
          id: string
          kind: 'course'
          courseId: string
      }


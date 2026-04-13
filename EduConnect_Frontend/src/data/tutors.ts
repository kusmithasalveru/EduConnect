export interface Tutor {
    id: string
    name: string
    subject: string
    rating: number
    reviews: number
    hourlyRate: number
    availability: string
    bio: string
    avatar: string
    tags: string[]
}

export const tutors: Tutor[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        subject: 'React & JavaScript',
        rating: 4.9,
        reviews: 87,
        hourlyRate: 45,
        availability: 'Mon-Fri 3-9 PM',
        bio: 'Senior developer with 8+ years experience in React and full-stack development.',
        avatar: 'SC',
        tags: ['React', 'JavaScript', 'Web Dev'],
    },
    {
        id: '2',
        name: 'Alex Kumar',
        subject: 'Data Science & Python',
        rating: 4.8,
        reviews: 65,
        hourlyRate: 50,
        availability: 'Flexible schedule',
        bio: 'Data scientist specializing in machine learning and data visualization.',
        avatar: 'AK',
        tags: ['Python', 'ML', 'Data Science'],
    },
    {
        id: '3',
        name: 'Emma Wilson',
        subject: 'UI/UX Design',
        rating: 4.9,
        reviews: 92,
        hourlyRate: 55,
        availability: 'Tue-Sat 10 AM-6 PM',
        bio: 'Award-winning designer with focus on user experience and design systems.',
        avatar: 'EW',
        tags: ['Design', 'UI/UX', 'Figma'],
    },
    {
        id: '4',
        name: 'David Park',
        subject: 'System Design & DSA',
        rating: 4.9,
        reviews: 71,
        hourlyRate: 60,
        availability: 'Mon-Sat 2-8 PM',
        bio: 'Ex-Google engineer teaching advanced algorithms and system design.',
        avatar: 'DP',
        tags: ['Algorithms', 'System Design', 'Java'],
    },
    {
        id: '5',
        name: 'Maria Garcia',
        subject: 'SQL & Databases',
        rating: 4.8,
        reviews: 58,
        hourlyRate: 40,
        availability: 'Daily 1-7 PM',
        bio: 'Database expert with 10+ years in SQL optimization and design.',
        avatar: 'MG',
        tags: ['SQL', 'Databases', 'PostgreSQL'],
    },
    {
        id: '6',
        name: 'James Brown',
        subject: 'Mobile Development',
        rating: 4.7,
        reviews: 49,
        hourlyRate: 48,
        availability: 'Wed-Sun 4-9 PM',
        bio: 'iOS and Android developer focusing on native mobile apps.',
        avatar: 'JB',
        tags: ['React Native', 'iOS', 'Android'],
    },
    {
        id: '7',
        name: 'Sophia Martinez',
        subject: 'DevOps & Cloud',
        rating: 4.8,
        reviews: 62,
        hourlyRate: 55,
        availability: 'Mon-Fri 9 AM-5 PM',
        bio: 'Cloud architect specializing in AWS, Docker, and Kubernetes.',
        avatar: 'SM',
        tags: ['AWS', 'Docker', 'DevOps'],
    },
    {
        id: '8',
        name: 'Tom Richardson',
        subject: 'TypeScript & Node.js',
        rating: 4.9,
        reviews: 79,
        hourlyRate: 52,
        availability: 'Tue-Thu 2-8 PM',
        bio: 'Full-stack engineer passionate about TypeScript best practices.',
        avatar: 'TR',
        tags: ['TypeScript', 'Node.js', 'Express'],
    },
]


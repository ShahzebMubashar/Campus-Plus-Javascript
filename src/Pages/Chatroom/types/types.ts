export interface Room {
    id: string
    title: string
    description: string
    rules?: string[]
    memberCount?: number
    createdAt?: string
}

export interface Post {
    id: string
    roomId: string
    author: string
    content: string
    likes: number
    comments: Comment[]
    createdAt: string
}

export interface Comment {
    id: string
    author: string
    content: string
    createdAt: string
}


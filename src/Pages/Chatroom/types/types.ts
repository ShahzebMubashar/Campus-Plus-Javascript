export interface Room {
    roomid: string;
    id: string; // Add this for compatibility
    name: string;
    title: string; // Add this for compatibility
    description: string;
    created_at: string;
    created_by: string;
}
export interface Post {
    messageid: string;
    roomid: string;
    userid: string;
    username: string;
    content: string;
    posted_at: string;
}
export interface Comment {
    id: string
    author: string
    content: string
    createdAt: string
}


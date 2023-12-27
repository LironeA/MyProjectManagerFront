export interface Project {
    id: number;
    name: string;
    description: string;
    userId: number;
}

export interface Todo {
    id: number;
    projectId: number;
    name: string;
    description: string;
    isComplete: boolean;
    order?: number;
    highlight: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
}
export interface Project {
    id: number;
    name: string;
    description: string;
}

export interface Todo {
    id: number;
    projectId: number;
    name: string;
    description: string;
    isComplete: boolean;
    order?: number;
}
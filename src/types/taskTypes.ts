export type PriorityType = 1 | 2 | 3; 

export type TaskTypes = {
    id?: string;
    title: string;    
    description?: string;
    deadline: string;
    priority?: PriorityType;
    done: boolean;
    createdAt: string;
    subtasks?: {
        id: string; 
        title: string;
        done: boolean;
    }[];
    tags?: string[];
    sharedWith?: string;
}
export interface TaskFilters{
    order?: 'baixaParaAlta' | 'altaParaBaixa'; 
    tags?: string[];
    date?: string;
}

export type PriorityType = 1 | 2 | 3; // 1=alta, 2=média, 3=baixa

export type TaskTypes = {
    id?: string;
    title: string;    
    description?: string;
    deadline: string;
    priority?: PriorityType;
    done: boolean;
    createdAt: string;
    subtasks?: {
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

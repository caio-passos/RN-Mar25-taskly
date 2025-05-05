export type TaskTypes = {
    id: string;
    Task: string;    
    Descricao: string;
    Prazo?: string;
    Tags?: string[];
    Subtask?: {
        id: string;
        title: string;
        completed: boolean;
    }[];
    Checked?: Boolean;
    toDelete?: Boolean;
}

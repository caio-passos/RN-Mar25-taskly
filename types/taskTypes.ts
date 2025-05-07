export type PrioridadeType = 'baixa' | 'média' | 'alta';

export type TaskTypes = {
    id: string;
    Task: string;    
    Descricao: string;
    Prazo?: string;
    Tags?: string[];
    Subtask?: {
        id: string;
        title: string;
        done: boolean;
    }[];
    Prioridade?: PrioridadeType;
    Checked?: Boolean;
    toDelete?: Boolean;
}

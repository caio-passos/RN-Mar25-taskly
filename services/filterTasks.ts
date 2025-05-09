import { TaskTypes, PrioridadeType } from '../types/taskTypes';
import {TaskFilters}  from '../types/taskTypes';

const priorityOrder: Record<PrioridadeType, number> = {
    baixa: 1,
    média: 2,
    alta: 3
};

export function filterTasks(tasks: TaskTypes[], filters: TaskFilters): TaskTypes[] {
    let result = [...tasks];
    
    if (filters.tags && filters.tags.length > 0) {
        result = result.filter(task => 
            task.Tags?.some(tag => filters.tags!.includes(tag.toLowerCase()))
        )
    }
    
    if (filters.date) {
        result = result.filter(task => 
            task.Prazo && task.Prazo === filters.date)
    }
    
    if (filters.order) {
        result.sort((a, b) => {
            const aPriority = a.Prioridade ? priorityOrder[a.Prioridade] : 0;
            const bPriority = b.Prioridade ? priorityOrder[b.Prioridade] : 0;
            
            return filters.order === 'baixaParaAlta' 
                ? aPriority - bPriority 
                : bPriority - aPriority;
        });
    }
    
    return result;
}
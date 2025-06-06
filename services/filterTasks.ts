import { TaskTypes, PriorityType, TaskFilters} from '../types/taskTypes';

const priorityOrder: Record<PriorityType, number> = {
    baixa: 1,
    média: 2,
    alta: 3
};

export function filterTasks(tasks: TaskTypes[], filters: TaskFilters): TaskTypes[] {
    let result = [...tasks];
    
    if (filters.tags && filters.tags.length > 0) {
        result = result.filter(task => 
            task.tags?.some(tag => filters.tags!.includes(tag.toLowerCase()))
        )
    }
    
    if (filters.date) {
        result = result.filter(task => 
            task.deadline && task.deadline=== filters.date)
    }
    
    if (filters.order) {
        result.sort((a, b) => {
            const aPriority = a.priority ? priorityOrder[a.priority] : 0;
            const bPriority = b.priority ? priorityOrder[b.priority] : 0;
            
            return filters.order === 'lowToHigh' 
                ? aPriority - bPriority 
                : bPriority - aPriority;
        });
    }
    
    return result;
}
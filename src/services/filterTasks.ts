import { TaskTypes, TaskFilters } from '../types/taskTypes';
import { parseAPIDate } from '../utils/dateUtils'; 

export function filterTasks(tasks: TaskTypes[], filters: TaskFilters): TaskTypes[] {
    let result = [...tasks];
    
    if (filters.tags && filters.tags.length > 0) {
        result = result.filter(task => 
            task.tags?.some(tag => filters.tags!.includes(tag.toLowerCase()))
        );
    }
    
    if (filters.date) {
        const filterDate = parseAPIDate(filters.date);
        result = result.filter(task => {
            if (!task.deadline) return false;
            const taskDeadlineDate = parseAPIDate(task.deadline);
            return taskDeadlineDate.getTime() <= filterDate.getTime();
        });
    }
    
    if (filters.order) {
        result.sort((a, b) => {
            const aPriority = a.priority || 0; 
            const bPriority = b.priority || 0; 
            
            if (filters.order === 'baixaParaAlta') { 
                return aPriority - bPriority; 
            } else if (filters.order === 'altaParaBaixa') { 
                return bPriority - aPriority;
            }
            return 0; 
        });
    }
    
    return result;
}

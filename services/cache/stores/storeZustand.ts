import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
<<<<<<< HEAD
import { mmkvStorage } from '../../db/storageMMKV';
import { produce } from 'immer';
import { UserDataTypes } from '../../../types/userTypes';
import { TaskTypes } from '../../../types/taskTypes';

interface UserStore {
  userData: UserDataTypes | null;
  setItemUserData: (data: UserDataTypes ) => void;
=======
import { MMKV } from 'react-native-mmkv';
import { produce } from 'immer';
import { UserDataTypes } from '../../../types/userTypes';


interface UserStore {
  userData: UserDataTypes | null;
  setUserData: (data: UserDataTypes ) => void;
>>>>>>> develop
  clearUserData: () => void;
  updateUserData: (updater: (draft: UserDataTypes ) => void) => void;
  partialUpdate: (data: Partial<UserDataTypes >) => void;
}

<<<<<<< HEAD
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userData: null,
      setItemUserData: (data) => {
        console.log("Persisted userData: ", data);
        set({ userData: data });
        console.log("Persisted userData after setting: ", get().userData); 
      },
      clearUserData: () => set({ userData: null }),
=======
const storage = new MMKV();

const MMKVStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userData: null,
      
      setUserData: (data) => set({ userData: data }),
      
      clearUserData: () => set({ userData: null }),
      
>>>>>>> develop
      updateUserData: (updater) => 
        set(produce((state: UserStore) => {
          if (state.userData) {
            updater(state.userData);
          }
        })),
      
      partialUpdate: (data) => 
        set(produce((state: UserStore) => {
          if (state.userData) {
            Object.assign(state.userData, data);
          }
        })),
    }),
    {
      name: 'user-storage',
<<<<<<< HEAD
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

export interface AvatarStore{
  selectedAvatar: number | null;
  setSelectedAvatar: (id: number | null) => void;
  clearAvatarData: () => void;
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  selectedAvatar: null,
  setSelectedAvatar: (id: number | null) => set({ selectedAvatar: id }),
  clearAvatarData: () =>  set({selectedAvatar: null})
}));

interface TaskStore {
  tasks: TaskTypes[];
  addTask: (task: TaskTypes) => void;
  updateTask: (id: string, updater: (draft: TaskTypes) => void) => void;
  deleteTask: (id: string) => void;
  bulkDeleteMarkedTasks: () => void;
  toggleTaskChecked: (id: string) => void;
  markTaskForDeletion: (id: string) => void;
  unmarkTaskForDeletion: (id: string) => void;
  addSubtask: (taskId: string, subtask: {
    id?: string;
    title: string;
    completed?: boolean;
  }) => void;
  clearAllTasks: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      loadTasks: (tasks: TaskTypes[]) =>
        set({tasks }),

      addTask: (task) => 
        set(produce((state) => {
          state.tasks.push(task);
        })),
      
      updateTask: (id, updater) => 
        set(produce((state) => {
          const taskIndex = state.tasks.findIndex(task => task.id === id);
          if (taskIndex !== -1) {
            updater(state.tasks[taskIndex]);
          }
        })),
      
      deleteTask: (id) => 
        set(produce((state) => {
          state.tasks = state.tasks.filter(task => task.id !== id);
        })),
      
      bulkDeleteMarkedTasks: () => 
        set(produce((state) => {
          state.tasks = state.tasks.filter(task => !task.toDelete);
        })),
      
      toggleTaskChecked: (id) => 
        set(produce((state) => {
          const task = state.tasks.find(task => task.id === id);
          if (task) {
            task.Checked = !task.Checked;
          }
        })),
      
      markTaskForDeletion: (id) => 
        set(produce((state) => {
          const task = state.tasks.find(task => task.id === id);
          if (task) {
            task.toDelete = true;
          }
        })),
      
      unmarkTaskForDeletion: (id) => 
        set(produce((state) => {
          const task = state.tasks.find(task => task.id === id);
          if (task) {
            task.toDelete = false;
          }
        })),

        addSubtask: (taskId, subtask) => 
          set(produce((state) => {
            const task = state.tasks.find(task => task.id === taskId);
            if (task) {
              const newSubtask = {
                id: subtask.id || `subtask_${Date.now()}`,
                title: subtask.title,
                completed: subtask.completed || false
              };
  
              if (!task.Subtask) {
                task.Subtask = [];
              }
  
              task.Subtask.push(newSubtask);
            }
          })),
        
      
      clearAllTasks: () => 
        set({ tasks: [] }),
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: (state) => {
        console.log('Rehydrataded state', state);
      }
    }
  )
);
=======
      storage: createJSONStorage(() => MMKVStorage),
    }
  )
);
>>>>>>> develop

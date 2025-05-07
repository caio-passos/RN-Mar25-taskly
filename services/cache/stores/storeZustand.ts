import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../db/storageMMKV';
import { produce } from 'immer';
import { AvatarData, UserDataTypes } from '../../../types/userTypes';
import { TaskTypes } from '../../../types/taskTypes';
import Theme from '../../../screens/(auth)/Theme';

interface UserStore {
  userData: UserDataTypes | null;
  setItemUserData: (data: UserDataTypes) => void;
  clearUserData: () => void;
  updateUserData: (updater: (draft: UserDataTypes) => void) => void;
  partialUpdate: (data: Partial<UserDataTypes>) => void;
}

export function generateUniqueId(): string {
  return `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

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
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

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
  toggleSubtaskStatus: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  clearAllTasks: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      loadTasks: (tasks: TaskTypes[]) =>
        set({ tasks }),

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


      addSubtask: (taskId: string, subtask: {
        id?: string;
        title: string;
        completed?: boolean
      }) => {
        set(produce((state) => {
          const taskIndex = state.tasks.findIndex(task => task.id === taskId);

          if (taskIndex !== -1) {
            const task = state.tasks[taskIndex];
            const newSubtask = {
              id: subtask.id || generateUniqueId(),
              title: subtask.title,
              completed: subtask.completed ?? false
            };

            task.Subtask = task.Subtask || [];

            task.Subtask.push(newSubtask);
          }
        }
        ))
      },
      updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
        set(produce((state) => {
          const taskIndex = state.tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            const subtaskIndex = state.tasks[taskIndex].Subtask.findIndex(
              subtask => subtask.id === subtaskId
            );
            if (subtaskIndex !== -1) {
              state.tasks[taskIndex].Subtask[subtaskIndex] = {
                ...state.tasks[taskIndex].Subtask[subtaskIndex],
                ...updates
              };
            }
          }
        }));
      },
      deleteSubtask: (taskId: string, subtaskId: string) => {
        set(produce((state) => {
          const taskIndex = state.tasks.findIndex(task => task.id === taskId);

          if (taskIndex !== -1) {
            const task = state.tasks[taskIndex];
            
            task.Subtask = task.Subtask 
              ? task.Subtask.filter(subtask => subtask.id !== subtaskId)
              : [];
          }
        }))
      },
      toggleSubtaskStatus: (taskId: string, subtaskId: string) => {
        set(produce((state) => {
          const taskIndex = state.tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            const task = state.tasks[taskIndex];
            const subtaskIndex = task.Subtask?.findIndex(sub => sub.id === subtaskId);
            if (subtaskIndex !== undefined && subtaskIndex >= 0) {
              task.Subtask[subtaskIndex].done = !task.Subtask[subtaskIndex].done;
            }
          }
        }));
      },

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

interface AuthStore {
  userData: UserDataTypes | null;
  tokens: {
    idToken: string | null;
    refreshToken: string | null;
  };

  setAuthData: (userData: UserDataTypes, idToken: string, refreshToken: string) => void;
  updateUserData: (updater: (draft: UserDataTypes) => void) => void;
  setAvatar: (avatar: AvatarData) => void;
  setTheme: (theme : {darkMode: boolean}) => void;
  updateTokens: (idToken: string, refreshToken: string) => void;
  clearAuthData: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userData: null,
      tokens: {
        idToken: null,
        refreshToken: null
      },

      setAuthData: (userData, idToken, refreshToken) =>
        set({
          userData,
          tokens: { idToken, refreshToken }
        }),

      updateUserData: (updater) =>
        set(produce((state) => {
          if (state.userData) {
            updater(state.userData);
          }
        })),
      setAvatar: (avatar) =>
        set(produce((state) => {
          if (state.userData) {
            state.userData.avatar = avatar;
          }
        })),
        setTheme: (theme: { darkMode: boolean }) => 
          set(produce((state: AuthStore) => {
            if (state.userData) {
              console.log('Setting theme:', theme);
              state.userData.theme = theme;
            }
          })),
      updateTokens: (idToken, refreshToken) =>
        set(state => ({
          tokens: { idToken, refreshToken }
        })),

      clearAuthData: () =>
        set({
          userData: null,
          tokens: { idToken: null, refreshToken: null }
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: (state) => {
        console.log('Auth store rehydrated:', state);
      }
    }
  )
);

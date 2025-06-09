import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../db/storageMMKV';
import { produce } from 'immer';
import { AvatarData, UserDataTypes, UserTypes } from '../../../types/userTypes';
import { TaskTypes } from '../../../types/taskTypes';
import { fetchTasks, createTaskOnApi, updateTaskOnApi, deleteTaskOnApi, updateUserOnApi, fetchUserProfile } from '../../db/api/api';
import { sanitizePhoneNumber } from '../../../utils/dateUtils';

export interface LocalTaskTypes extends TaskTypes {
  toDelete?: boolean;
  Checked?: boolean;
}

export type SyncAction =
  | { type: 'create'; payload: TaskTypes }
  | { type: 'update'; payload: { id: string; data: Partial<TaskTypes> } }
  | { type: 'delete'; payload: string }; 

export interface UserStore {
  userData: UserTypes | null;
  setItemUserData: (data: UserTypes) => void;
  clearUserData: () => void;
  updateUserData: (updater: (draft: UserTypes) => void) => void;
  partialUpdate: (data: Partial<UserDataTypes>) => void;
  syncUserUpdate: (data: Partial<UserDataTypes>) => Promise<void>;
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

      partialUpdate: (data) => {
        set(produce((state: UserStore) => {
          if (state.userData) {
            Object.assign(state.userData, data);
          }
        }));
        get().syncUserUpdate(data); 
      },
      syncUserUpdate: async (data) => {
        const { userData } = get();
        if (!userData || !userData.uid) {
          console.error('User data or UID not available for sync.');
          return;
        }
        const sanitizedData = { ...data };
        if (sanitizedData.phone_number) {
          sanitizedData.phone_number = sanitizePhoneNumber(sanitizedData.phone_number);
        }
        try {
          const success = await updateUserOnApi(sanitizedData);
          if (success) {
            console.log('User data synced successfully to API.');
            const updatedProfile = await fetchUserProfile();
            if (updatedProfile) {
              set(produce((state: UserStore) => {
                state.userData = updatedProfile;
              }));
              useAuthStore.getState().updateUserData(draft => {
                draft.name = updatedProfile.name;
                draft.email = updatedProfile.email;
                draft.phone_number = updatedProfile.phone_number;
                draft.avatar = updatedProfile.avatar; 
              });
            }
          } else {
            console.error('Failed to sync user data to API.');
          }
        } catch (error) {
          console.error('Error during user data sync:', error);
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

export interface TaskStore {
  tasks: LocalTaskTypes[];
  syncQueue: SyncAction[]; 
  isSyncing: boolean; 

  addTask: (task: LocalTaskTypes) => void;
  updateTask: (id: string, updater: (draft: LocalTaskTypes) => void) => void;
  deleteTask: (id: string) => void;
  bulkDeleteMarkedTasks: () => void;
  toggleTaskChecked: (id: string) => void;
  markTaskForDeletion: (id: string) => void;
  unmarkTaskForDeletion: (id: string) => void;
  addSubtask: (taskId: string, subtask: { title: string; done?: boolean; }) => void;
  toggleSubtaskStatus: (taskId: string, subtaskTitle: string) => void;
  deleteSubtask: (taskId: string, subtaskTitle: string) => void;
  clearAllTasks: () => void;
  loadTasks: (tasks: LocalTaskTypes[]) => void;
  fetchAndLoadTasks: () => Promise<void>;

  processNextSyncItem: () => Promise<void>;
  setIsSyncing: (syncing: boolean) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      syncQueue: [],
      isSyncing: false,

      loadTasks: (tasks) => set({ tasks }),
      fetchAndLoadTasks: async () => {
        const fetchedTasks = await fetchTasks();
        if (fetchedTasks) {
          const { syncQueue } = get();
          const mergedTasks = new Map<string, LocalTaskTypes>();
          fetchedTasks.forEach(task => mergedTasks.set(task.id!, task as LocalTaskTypes));

          syncQueue.forEach(action => {
            switch (action.type) {
              case 'create':
                if (!mergedTasks.has(action.payload.id!)) {
                  mergedTasks.set(action.payload.id!, action.payload as LocalTaskTypes);
                }
                break;
              case 'update':
                const updatePayload = action.payload as { id: string; data: Partial<TaskTypes> };
                if (mergedTasks.has(updatePayload.id)) {
                  mergedTasks.set(updatePayload.id, {
                    ...mergedTasks.get(updatePayload.id)!,
                    ...updatePayload.data,
                  });
                }
                break;
              case 'delete':
                mergedTasks.delete(action.payload as string);
                break;
            }
          });

          set({ tasks: Array.from(mergedTasks.values()) });
        }
      },
      addTask: (task: LocalTaskTypes) =>
        set(produce((state: TaskStore) => {
          state.tasks.push(task);
        })),
      updateTask: (id, updater) =>
        set(produce((state: TaskStore) => {
          const taskIndex = state.tasks.findIndex((task: LocalTaskTypes) => task.id === id);
          if (taskIndex !== -1) {
            updater(state.tasks[taskIndex]);
          }
        })),

      deleteTask: (id) =>
        set(produce((state: TaskStore) => {
          state.tasks = state.tasks.filter((task: LocalTaskTypes) => task.id !== id);
        })),

      bulkDeleteMarkedTasks: () =>
        set(produce((state: TaskStore) => {
          state.tasks = state.tasks.filter((task: LocalTaskTypes) => !task.toDelete);
        })),

      toggleTaskChecked: (id) =>
        set(produce((state: TaskStore) => {
          const task = state.tasks.find((task: LocalTaskTypes) => task.id === id);
          if (task) {
            task.Checked = !task.Checked;
          }
        })),
      markTaskForDeletion: (id) =>
        set(produce((state: TaskStore) => {
          const task = state.tasks.find((task: LocalTaskTypes) => task.id === id);
          if (task) {
            task.toDelete = true;
          }
        })),
      unmarkTaskForDeletion: (id) =>
        set(produce((state: TaskStore) => {
          const task = state.tasks.find((task: LocalTaskTypes) => task.id === id);
          if (task) {
            task.toDelete = false;
          }
        })),
      addSubtask: (taskId: string, subtask: { title: string; done?: boolean }) => {
        set(produce((state: TaskStore) => {
          const taskIndex = state.tasks.findIndex((task: LocalTaskTypes) => task.id === taskId);
          if (taskIndex !== -1) {
            const task = state.tasks[taskIndex];
            const newSubtask = { id: generateUniqueId(), title: subtask.title, done: subtask.done ?? false };
            task.subtasks = task.subtasks || [];
            task.subtasks.push(newSubtask);
          }
        }));
      },
      updateSubtask: (taskId: string, subtaskId: string, updates: Partial<{ title: string; done: boolean }>) => {
        set(produce((state: TaskStore) => {
          const task = state.tasks.find((t: LocalTaskTypes) => t.id === taskId);
          if (task && task.subtasks) {
            const subtaskIndex = task.subtasks.findIndex(subtask => subtask.id === subtaskId);
            if (subtaskIndex !== -1) {
              task.subtasks[subtaskIndex] = { ...task.subtasks[subtaskIndex], ...updates };
            }
          }
        }));
      },
      deleteSubtask: (taskId: string, subtaskId: string) => {
        set(produce((state: TaskStore) => {
          const task = state.tasks.find((t: LocalTaskTypes) => t.id === taskId);
          if (task && task.subtasks) {
            task.subtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
          }
        }));
      },
      toggleSubtaskStatus: (taskId: string, subtaskId: string) => {
        set(produce((state: TaskStore) => {
          const task = state.tasks.find((t: LocalTaskTypes) => t.id === taskId);
          if (task && task.subtasks) {
            const subtaskIndex = task.subtasks.findIndex(sub => sub.id === subtaskId);
            if (subtaskIndex !== -1) {
              task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
            }
          }
        }));
      },
      clearAllTasks: () => set({ tasks: [] }),

      queueTaskForSync: (action: SyncAction) =>
        set(produce((state: TaskStore) => {
          state.syncQueue.push(action);
        })),

      setIsSyncing: (syncing: boolean) => set({ isSyncing: syncing }),

      processNextSyncItem: async () => {
        const { syncQueue, isSyncing, setIsSyncing, fetchAndLoadTasks } = get();
        if (isSyncing || syncQueue.length === 0) {
          return;
        }

        setIsSyncing(true);
        const nextAction = syncQueue[0];

        try {
          let success = false;
          switch (nextAction.type) {
            case 'create':
              const newTaskId = await createTaskOnApi(nextAction.payload as TaskTypes);
              if (newTaskId) {
                set(produce((state: TaskStore) => {
                  const tempTask = state.tasks.find(t => t.id === (nextAction.payload as TaskTypes).id);
                  if (tempTask) {
                    tempTask.id = newTaskId;
                  }
                }));
                success = true;
              }
              break;
            case 'update':
              const updatePayload = nextAction.payload as { id: string; data: Partial<TaskTypes> };
              success = await updateTaskOnApi(updatePayload.id, updatePayload.data);
              break;
            case 'delete':
              success = await deleteTaskOnApi(nextAction.payload as string);
              break;
          }

          if (success) {
            set(produce((state: TaskStore) => {
              state.syncQueue.shift(); 
            }));
            await fetchAndLoadTasks(); 
          } else {
            console.error('Sync operation failed for:', nextAction);
          }
        } catch (error) {
          console.error('Error processing sync item:', error);
        } finally {
          setIsSyncing(false);
          if (get().syncQueue.length > 0) {
            get().processNextSyncItem();
          }
        }
      },
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

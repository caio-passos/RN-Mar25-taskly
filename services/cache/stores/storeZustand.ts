import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { produce } from 'immer';
import { UserDataTypes } from '../../../types/userTypes';


interface UserStore {
  userData: UserDataTypes | null;
  setUserData: (data: UserDataTypes ) => void;
  clearUserData: () => void;
  updateUserData: (updater: (draft: UserDataTypes ) => void) => void;
  partialUpdate: (data: Partial<UserDataTypes >) => void;
}

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
      storage: createJSONStorage(() => MMKVStorage),
    }
  )
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../db/storageMMKV';
import { produce } from 'immer';
import { UserDataTypes } from '../../../types/userTypes';


interface UserStore {
  userData: UserDataTypes | null;
  setItemUserData: (data: UserDataTypes ) => void;
  clearUserData: () => void;
  updateUserData: (updater: (draft: UserDataTypes ) => void) => void;
  partialUpdate: (data: Partial<UserDataTypes >) => void;
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

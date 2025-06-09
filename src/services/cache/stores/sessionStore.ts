import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../db/storageMMKV';
import { produce } from 'immer';
import { sessionTypes } from '../../../types/sessionTypes';


interface sessionStoreState {
    sessionData: sessionTypes | null;
    setItemSessionData: (data: sessionTypes) => void;
    clearSessionData: () => void;
    updateSessionData: (updater: (draft: sessionTypes) => void) => void;
}

export function generateUniqueId(): string {
    return `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const useSessionStore = create<sessionStoreState>()(
    persist(
        (set, get) => ({
            sessionData: null,
            setItemSessionData: (data: sessionTypes) => {
                console.log("Persisted sessionSession: ", data);
                set({ sessionData: data });
                console.log("Persisted sessionSession after setting: ", get().sessionData);
            },
            clearSessionData: () => set({
                sessionData: null
            }),
            updateSessionData: (updater) =>
                set(produce((state: sessionStoreState) => {
                    if (state.sessionData) {
                        updater(state.sessionData);
                    }
                }))
        }),
        {
            name: 'session-storage',
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);

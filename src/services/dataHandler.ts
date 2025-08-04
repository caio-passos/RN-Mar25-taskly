import { useUserStore } from './cache/stores/storeZustand';
import { useSessionStore } from './cache/stores/sessionStore';
import { useTaskStore } from './cache/stores/storeZustand';
import { useAuthStore } from './cache/stores/storeZustand';
import {sessionTypes} from '../types/sessionTypes';
import { UserDataTypes } from '../types/userTypes';
import { TaskTypes } from '../types/taskTypes';

export const saveUserInfo = (userData: UserDataTypes) => {
    useUserStore.getState().setItemUserData(userData);
};
export const updateUserInfo = (userData: UserDataTypes) => {
    useUserStore.getState().partialUpdate(userData);
}
export const getIdToken = () => {
    return useAuthStore.getState().tokens.idToken;
};
export const getRefreshToken = (): string | null => {
    return useAuthStore.getState().tokens.refreshToken;
};
export const clearTokens = () => {
    useAuthStore.getState().clearAuthData();
};
export const clearUserInfo = () => {
    useUserStore.getState().clearUserData();
};
export const clearTaskData = () => {
    useTaskStore.getState().clearAllTasks();
}
export const saveTaskData = (tasks: TaskTypes[]) => {
    useTaskStore.getState().loadTasks(tasks);
}

import { useUserStore } from './cache/stores/storeZustand';
import { useSessionStore } from './cache/stores/sessionStore';
import { useTaskStore } from './cache/stores/storeZustand';
import { useAuthStore } from './cache/stores/storeZustand';
import {sessionTypes} from '../types/sessionTypes';
import { UserTypes } from '../model/userModel';
import { TaskTypes } from '../types/taskTypes';

export const saveTokens = (sessionData: sessionTypes) => {
    useSessionStore.getState().setItemSessionData(sessionData);
};
export const saveUserInfo = (userData: UserTypes) => {
    useUserStore.getState().setItemUserData(userData);
};
export const updateUserInfo = (userData: UserTypes) => {
    useUserStore.getState().partialUpdate(userData);
}
export const getIdToken = () => {
    return useSessionStore.getState().sessionData?.id_token;
};
export const getRefreshToken = (): string | null => {
    return useAuthStore.getState().tokens.refreshToken;
};
export const clearTokens = () => {
    useSessionStore.getState().clearSessionData();
};
export const clearUserInfo = () => {
    useUserStore.getState().clearUserData();
};
export const clearTaskData = () => {
    useTaskStore.getState().clearAllTasks();
}
export const saveTaskData = (task: TaskTypes) => {
    useTaskStore.getState().addTask;
}

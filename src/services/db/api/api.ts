import { useAuthStore, useUserStore } from '../../cache/stores/storeZustand';
import { UserTypes } from '../../../types/userTypes';
import { sessionTypes } from '../../../types/sessionTypes';
import { LoginData } from '../../../model/loginModel';
import { TaskTypes } from '../../../types/taskTypes';
import { getIdToken, clearTokens, saveUserInfo, clearUserInfo } from '../../dataHandler';
import { API_DATE_FORMAT, isValidDateString, formatDateForAPI, sanitizeDateString } from '../../../utils/dateUtils';
import { UserDataTypes } from '../../../types/userTypes';

const PUBLIC_IP = '54.233.170.218'
const API_URL = `http://54.233.170.218:3000`;

interface ApiError {
    message: string;
    status?: number;
    details?: any;
}

const getAuthHeader = (): HeadersInit_ | undefined => {
    const token = getIdToken();
    if (!token) {
        console.warn('Nenhum token de autenticação encontrado para a requisição API.');
        return undefined;
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        let errorDetails: any = null;
        try { errorDetails = await response.json(); } catch (e) { }
        const error: ApiError = {
            message: `API Error: ${response.status} ${response.statusText}`,
            status: response.status,
            details: errorDetails || await response.text(),
        };
        console.error('API error response:', JSON.stringify(error, null, 2));
        throw error;
    }
    const contentType = response.headers.get('content-type');
    if (response.status === 204 || response.headers.get('content-length') === '0' || !contentType || !contentType.includes('application/json')) {
        return null;
    }
    return await response.json();
};


export const registerUser = async (userData: UserDataTypes): Promise<sessionTypes | null> => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const registerResponse = await handleApiResponse(response) as (sessionTypes & { user: UserTypes });
        if (!registerResponse) return null;

        if (registerResponse) {
            const idToken = registerResponse.idToken || registerResponse.id_token!;
            console.log('idToken register:', JSON.stringify(idToken))
            const refreshToken = registerResponse.refreshToken || registerResponse.refresh_token!;
            const transformedResponse: sessionTypes = {
                id_token: idToken,
                refresh_token: refreshToken,
                expiresIn: registerResponse.expiresIn || 3600
            };
            await useAuthStore.getState().setAuthData(registerResponse.user, registerResponse.id_token!, registerResponse.refresh_token!);
            
            // Verify token persistence
            const token = getIdToken();
            if (!token) {
                throw new Error('Token persistence failed');
            }

            const userProfile = await fetchUserProfile(); 
            if (userProfile) {
                useUserStore.getState().setItemUserData(userProfile);
            } else {
                console.error('Failed to fetch user profile after registration.');
            }
            return transformedResponse;
        }
        return null;
    } catch (error) {
        console.error('Register failed! : ', error)
        clearTokens();
        clearUserInfo();
        return null;
    }
};
export const loginUser = async (credentials: LoginData): Promise<sessionTypes | null> => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await handleApiResponse(response) as (sessionTypes & { user: UserTypes });
        if (data) {
            const idToken = (data.id_token ?? '') as string;
            const refreshToken = (data.refresh_token ?? '') as string;
            const sessionData: sessionTypes = {
                id_token: idToken,
                refresh_token: refreshToken,
            };
            useAuthStore.getState().setAuthData(data.user, idToken, refreshToken);
            useUserStore.getState().setItemUserData(data.user);
            return sessionData;
        }
        return null;
    } catch (error) {
        console.error('Login failed:', error);
        return null;
    };
};

export const fetchUserProfile = async (): Promise<UserTypes | null> => {
    const Authorization = await getIdToken()
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Authorization}`
            },
        });
        const data = await handleApiResponse(response);
        if (data) {
            const userData: UserTypes = {
                id: data.uid,
                uid: data.uid,
                email: data.email,
                password: '',
                name: data.name,
                phone_number: data.phone_number,
            };
            await saveUserInfo(userData);
            return userData;
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return null;
    };
};

export const updateUserOnApi = async (userData: Partial<UserTypes>): Promise<boolean> => {
    const headers = getAuthHeader();
    if (!headers) return false;

    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(userData),
        });
        await handleApiResponse(response);
        return true;
    } catch (error) {
        console.error('Failed to update user profile:', error);
        return false;
    }
};

interface UpdateTaskBody {
    title?: string;
    description?: string;
    done?: boolean;
    subtasks?: { title: string; done: boolean }[];
    tags?: string[];
    deadline?: string;
}

export const fetchTasks = async (): Promise<TaskTypes[] | null> => {
    const Authorization = getIdToken()
    if (!Authorization) return null;
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Authorization}`
            }
        });
        const data = await handleApiResponse(response);
        console.log('fetched tasks', data);
        if (data) {
            return data.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                deadline: task.deadline,
                priority: task.priority,
                done: task.done,
                createdAt: task.createdAt,
                subtasks: task.subtasks || [],
                tags: task.tags || [],
                sharedWith: task.sharedWith || []
            }));
        }
        return null; 
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return null;
    }
};

export const createTaskOnApi = async (taskData: TaskTypes): Promise<string | null> => {
    const headers = getAuthHeader();
    if (!headers) return null;

    if (taskData.deadline) {
        taskData.deadline = sanitizeDateString(taskData.deadline);
        if (!isValidDateString(taskData.deadline)) {
            console.error(`Invalid deadline format. Expected ${API_DATE_FORMAT}`);
            return null;
        }
    }

    const payload = {
        ...taskData,
        deadline: taskData.deadline ? formatDateForAPI(taskData.deadline) : undefined
    };

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });
        const { id } = await handleApiResponse(response);
        return id;
    } catch (error) {
        console.error('Falha ao criar tarefa:', error);
        return null;
    }
};

export const updateTaskOnApi = async (taskId: string, taskUpdateData: UpdateTaskBody): Promise<boolean> => {
    const headers = getAuthHeader();
    if (!headers) return false;

    if (Object.keys(taskUpdateData).length === 0) {
        console.warn("Sem novos dados para update");
        return true;
    }

    if (taskUpdateData.deadline) {
        taskUpdateData.deadline = sanitizeDateString(taskUpdateData.deadline);
        if (!isValidDateString(taskUpdateData.deadline)) {
            console.error(`Invalid deadline format. Expected ${API_DATE_FORMAT}`);
            return false;
        }
    }

    const payload = {
        ...taskUpdateData,
        deadline: taskUpdateData.deadline ? formatDateForAPI(taskUpdateData.deadline) : undefined
    };

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(payload),
        });
        await handleApiResponse(response);
        return true;
    } catch (error) {
        console.error(`Falha ao atualizar tarefa ${taskId}:`, error);
        return false;
    }
};

export const deleteTaskOnApi = async (taskId: string): Promise<boolean> => {
    const headers = getAuthHeader();
    if (!headers) return false;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: headers,
        });
        await handleApiResponse(response);
        return true;
    } catch (error) {
        console.error(`Falha ao deletar tarefa ${taskId}:`, error);
        return false;
    }
};

export const logout = () => {
    clearTokens();
    useAuthStore.getState().clearAuthData(); 
    useUserStore.getState().clearUserData(); 
    console.log("Usuário deslogado, tokens e estados do Zustand limpos.");
};

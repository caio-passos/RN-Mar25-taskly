import { useAuthStore } from '../../cache/stores/storeZustand';
import { UserTypes } from '../../../model/userModel';
import { sessionTypes } from '../../../types/sessionTypes';
import { LoginData } from '../../../model/loginModel';
import { TaskTypes } from '../../../types/taskTypes';
import { getIdToken, saveTokens, clearTokens, saveUserInfo, clearUserInfo } from '../../dataHandler';

// URL base
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
        console.error('API error response:', error);
        throw error;
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }
    return await response.json();
};

// --- API p/ Auth ---
export const registerUser = async (userData: UserTypes): Promise<sessionTypes | null> => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const registerResponse = await handleApiResponse(response);
        if (!registerResponse) return null;
        if (registerResponse) {
            const transformedResponse: sessionTypes = {
                id_token: registerResponse.idToken,
                refresh_token: registerResponse.refreshToken || '',
                expiresIn: registerResponse.expiresIn || 3600
            };
            saveTokens(transformedResponse);
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
        const data = await handleApiResponse(response);
        if (data) {
            const sessionData: sessionTypes = {
                id_token: data.id_token,
                refresh_token: data.refresh_token,
            };
            if (sessionData) {
                saveTokens(sessionData);
            }
            const userProfile = await fetchUserProfile();
            if (userProfile) {
                saveUserInfo(userProfile as UserTypes)
            }
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
                uid: data.uid,
                email: data.email,
                password: '',
                name: data.name,
                phone_number: data.phone_number,
                picture: data.picture,
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

export const updateUserProfileName = async (name: string): Promise<boolean> => { return false; }
export const updateUserProfileAvatar = async (picture: string): Promise<boolean> => { return false; }
interface FullProfileBody { name: string; phone: string; picture: string; }
export const createOrUpdateUserProfile = async (profileData: FullProfileBody): Promise<boolean> => { return false }

// interface CreateTaskBody {
//     title: string;
//     description?: string;
//     done?: boolean;
//     subtasks?: { title: string; done: boolean }[];
//     tags?: string[];
// }

interface UpdateTaskBody {
    title?: string;
    description?: string;
    done?: boolean;
    subtasks?: { title: string; done: boolean }[];
    tags?: string[];
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
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(taskData),
        });
        const { id } = await handleApiResponse(response);
        return id;
    } catch (error) {
        console.error('Falha ao criar tarefa:', error);
        return null;
    }
};

// Atualiza uma tarefa na API
export const updateTaskOnApi = async (taskId: string, taskUpdateData: UpdateTaskBody): Promise<boolean> => {
    const headers = getAuthHeader();
    if (!headers) return false;

    if (Object.keys(taskUpdateData).length === 0) {
        console.warn("Sem novos dados para update");
        return true;
    }
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(taskUpdateData),
        });
        await handleApiResponse(response);
        return true;
    } catch (error) {
        console.error(`Falha ao atualizar tarefa ${taskId}:`, error);
        return false;
    }
};

// Deleta uma tarefa na API
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

// Helper do Logout
export const logout = () => {
    clearTokens();
    // limpar o estado do Zustand aqui !!!!!!!!!!!!
    console.log("Usuário deslogado, tokens limpos.");
};

import { MMKV } from 'react-native-mmkv';
import { UserDataTypes } from '../../../types/userTypes';
import { TaskTypes } from '../../../types/taskTypes';

// URL base
const API_URL = 'http://15.229.11.44:3000';
const authStorage = new MMKV(); // Armazenamento local de tokens

// Chaves pra salvar os tokens no MMKV
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const saveTokens = (idToken: string, refreshToken: string) => {
    try {
        authStorage.set(AUTH_TOKEN_KEY, idToken);
        authStorage.set(REFRESH_TOKEN_KEY, refreshToken);
        console.log('Tokens salvos com sucesso.');
    } catch (error) {
        console.error('Erro ao salvar tokens:', error);
    }
};

const getIdToken = (): string | null => {
    try {
        const token = authStorage.getString(AUTH_TOKEN_KEY);
        return token ?? null;
    } catch (error) {
        console.error('Erro ao recuperar ID token:', error);
        return null;
    }
};

const getRefreshToken = (): string | null => {
    try {
        const token = authStorage.getString(REFRESH_TOKEN_KEY);
        return token ?? null;
    } catch (error) {
        console.error('Erro ao recuperar refresh token:', error);
        return null;
    }
};

const clearTokens = () => {
    try {
        authStorage.delete(AUTH_TOKEN_KEY);
        authStorage.delete(REFRESH_TOKEN_KEY);
        console.log('Tokens removidos.');
    } catch (error) {
        console.error('Erro ao remover tokens:', error);
    }
};

// --- Helper da API ---
interface ApiError {
    message: string;
    status?: number;
    details?: any;
}

// 3. Gera o header de autenticação pros requests
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
        console.error('Erro na resposta da API:', error);
        throw error;
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }
    return await response.json();
};

// --- API p/ Auth ---
interface RegisterRequestBody { email: string; password: string; name: string; phone_number: string; }
interface RegisterResponse { uid: string; idToken: string; refreshToken?: string; }
export const registerUser = async (userData: RegisterRequestBody): Promise<RegisterResponse | null> => { return null; /* TODO: Implementar */ };

interface LoginRequestBody {
    email: string;
    password: string;
}
interface LoginResponse {
    id_token: string;
    refresh_token: string;
}

export const loginUser = async (credentials: LoginRequestBody): Promise<LoginResponse | null> => { return null; /* TODO: Implementar */ };
interface RefreshTokenResponse { idToken: string; refreshToken: string; expiresIn: string; }
export const refreshAuthToken = async (): Promise<RefreshTokenResponse | null> => { return null; /* TODO: Implementar */ };
// --- API de Perfil ---
interface ApiUserProfile { uid: string; email: string; name: string; picture: string; phone?: string; }
export const fetchUserProfile = async (): Promise<ApiUserProfile | null> => { return null; /* TODO: Implementar */ };
export const updateUserProfileName = async (name: string): Promise<boolean> => { return false; /* TODO: Implementar */ };
export const updateUserProfileAvatar = async (picture: string): Promise<boolean> => { return false; /* TODO: Implementar */ };
interface FullProfileBody { name: string; phone: string; picture: string; }
export const createOrUpdateUserProfile = async (profileData: FullProfileBody): Promise<boolean> => { return false; /* TODO: Implementar */ };







interface ApiTask {
    id: string;
    title: string;
    description?: string;
    done: boolean;
    createdAt: string;
    subtasks?: { title: string; done: boolean }[];
    tags?: string[];
    sharedWith?: string[];
}

interface CreateTaskBody {
    title: string;
    description?: string;
    done?: boolean;
    subtasks?: { title: string; done: boolean }[];
    tags?: string[];
}

interface UpdateTaskBody {
    title?: string;
    description?: string;
    done?: boolean;
    subtasks?: { title: string; done: boolean }[];
    tags?: string[];
}

export const fetchTasks = async (): Promise<ApiTask[] | null> => {
    const headers = getAuthHeader();
    if (!headers) return null;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'GET',
            headers: headers,
        });
        return await handleApiResponse(response) as ApiTask[];
    } catch (error) {
        console.error('Falha ao buscar tarefas:', error);
        return null;
    }
};

export const createTaskOnApi = async (taskData: CreateTaskBody): Promise<boolean> => {
    const headers = getAuthHeader();
    if (!headers) return false;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(taskData),
        });
        await handleApiResponse(response);
        return true;
    } catch (error) {
        console.error('Falha ao criar tarefa:', error);
        return false;
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
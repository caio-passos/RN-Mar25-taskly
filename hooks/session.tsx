import React, { createContext, ReactNode, useContext } from 'react';
import { useUserStore } from '../services/cache/stores/storeZustand';

interface User {
    nome: string;
    email: string;
}

interface SessionContextType {
    isLoggedIn: boolean;
    user: User | null; 
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userData = useUserStore(); 

    const user: User | null = userData?.userData ? {
        nome: userData.userData.name,
        email: userData.userData.email,
    } : null;
    const loggedAccount: SessionContextType = {
        isLoggedIn: userData?.userData?.loggedIn || false, 
        user: user, 
    };

    return (
        <SessionContext.Provider value={loggedAccount}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession precisa de um SessionProvider');
    }
    return context;
};
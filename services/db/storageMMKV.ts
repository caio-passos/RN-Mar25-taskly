import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const mmkvStorage = {
    setItem: (key: string, value: string) => {
        try {
            storage.set(key, value);
            console.log('Stored in MMKV:', { key, value });
        } catch (error) {
            console.error('Error storing data:', error);
        }
    },
    getItem: (key: string) => {
        try {
            const value = storage.getString(key);
            console.log('Retrieved from MMKV:', { key, value });
            return value ?? null;
        } catch (error) {
            console.error('Error retrieving data:', error);
            return null;
        }
    },
    removeItem: (key: string) => storage.delete(key),
};
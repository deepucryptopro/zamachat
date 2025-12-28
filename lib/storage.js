/**
 * Mock Smart Contract Storage
 * 
 * Simulates a blockchain storage where only encrypted data is stored.
 * The contract doesn't know what's inside.
 */

const STORAGE_KEY = 'zamachat_contract_storage';

export const saveEncryptedMessage = (encryptedData) => {
    const current = getEncryptedMessages();
    const newMessage = {
        id: Date.now().toString(),
        data: encryptedData, // The "E_..." string
        blockTimestamp: new Date().toISOString()
    };

    const updated = [...current, newMessage];
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return newMessage;
};

export const getEncryptedMessages = () => {
    if (typeof window === 'undefined') return [];

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

export const clearStorage = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
};

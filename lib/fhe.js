/**
 * Mock FHE (Fully Homomorphic Encryption) Simulation Library
 * 
 * This mock library simulates the behavior of FHE where data is encrypted,
 * stored/computed on without decryption, and only decrypted by the owner.
 * 
 * In a real Zama application, this would use fhEVM or TFHE-rs.
 */

// Helper to generate a random mock wallet address
export const generateWallet = () => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
};

// Mock Client-Side Encryption
// In real FHE, this creates a ciphertext that can be computed on.
export const encryptMessage = async (plaintext, receiverAddress) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // We mock encryption by bas64 encoding and adding a prefix + random noise
    // This ensures the "smart contract" (storage) cannot read it.
    const payload = JSON.stringify({
        content: plaintext,
        timestamp: Date.now(),
        receiver: receiverAddress
    });

    const encoded = Buffer.from(payload).toString('base64');
    // "E_" simulates the encrypted handle
    return `E_${encoded}`;
};

// Mock Client-Side Decryption
export const decryptMessage = async (ciphertext, userWallet) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!ciphertext || !ciphertext.startsWith('E_')) {
        return null;
    }

    const encoded = ciphertext.substring(2);
    try {
        const jsonStr = Buffer.from(encoded, 'base64').toString('utf-8');
        const data = JSON.parse(jsonStr);

        // In FHE, you can only decrypt what belongs to you.
        // Ensure strict access control.
        if (!data.receiver || !userWallet || data.receiver.toLowerCase() !== userWallet.toLowerCase()) {
            // Not authorized to decrypt
            return null;
        }

        return data.content;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );
    const derivedKey = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: encoder.encode(password),
            iterations: 300000,
            hash: "SHA-512"
        },
        keyMaterial,
        512
    );

    return btoa(String.fromCharCode(...new Uint8Array(derivedKey))); // Convert to Base64
};

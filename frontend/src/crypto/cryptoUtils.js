// // frontend/src/crypto/cryptoUtils.js
// const subtle = window.crypto.subtle;

// // Generate ECDH key pair (P-256)
// export async function generateKeyPair() {
//   return await subtle.generateKey(
//     { name: "ECDH", namedCurve: "P-256" },
//     true, // extractable so we can export
//     ["deriveKey"]
//   );
// }

// // Export keys as JWK (JSON)
// export async function exportPublicJwk(publicKey) {
//   return await subtle.exportKey("jwk", publicKey);
// }
// export async function exportPrivateJwk(privateKey) {
//   return await subtle.exportKey("jwk", privateKey);
// }

// // Import JWKs
// export async function importPublicKeyJwk(jwk) {
//   return await subtle.importKey(
//     "jwk",
//     jwk,
//     { name: "ECDH", namedCurve: "P-256" },
//     false,
//     []
//   );
// }
// export async function importPrivateKeyJwk(jwk) {
//   return await subtle.importKey(
//     "jwk",
//     jwk,
//     { name: "ECDH", namedCurve: "P-256" },
//     true,
//     ["deriveKey"]
//   );
// }

// // Derive AES-GCM key (256) from ECDH privateKey & other party publicKey
// export async function deriveSharedKey(privateKey, otherPublicKey) {
//   return await subtle.deriveKey(
//     { name: "ECDH", public: otherPublicKey },
//     privateKey,
//     { name: "AES-GCM", length: 256 },
//     false,
//     ["encrypt", "decrypt"]
//   );
// }

// // AES-GCM encrypt (returns base64 ciphertext and iv as base64)
// export async function encryptWithKey(aesKey, plaintext) {
//   const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes
//   const enc = new TextEncoder();
//   const pt = enc.encode(plaintext);
//   const cipherBuffer = await subtle.encrypt({ name: "AES-GCM", iv }, aesKey, pt);
//   return {
//     ciphertext: arrayBufferToBase64(cipherBuffer),
//     iv: arrayBufferToBase64(iv.buffer)
//   };
// }

// // AES-GCM decrypt
// export async function decryptWithKey(aesKey, ciphertextB64, ivB64) {
//   const cipherBuf = base64ToArrayBuffer(ciphertextB64);
//   const ivBuf = base64ToArrayBuffer(ivB64);
//   const plainBuf = await subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(ivBuf) }, aesKey, cipherBuf);
//   const dec = new TextDecoder();
//   return dec.decode(plainBuf);
// }

// // Helpers: ArrayBuffer <-> base64
// function arrayBufferToBase64(buffer) {
//   const bytes = new Uint8Array(buffer);
//   let binary = "";
//   for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//   return btoa(binary);
// }
// function base64ToArrayBuffer(base64) {
//   const binary = atob(base64);
//   const len = binary.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
//   return bytes.buffer;
// }

// frontend/src/crypto/cryptoUtils.js


// frontend/src/crypto/cryptoUtils.js
const subtle = window.crypto.subtle;

// Generate ECDH key pair (P-256)
export async function generateKeyPair() {
  return await subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true, // extractable so we can export
    ["deriveKey"]
  );
}

// Export keys as JWK (JSON)
export async function exportPublicJwk(publicKey) {
  return await subtle.exportKey("jwk", publicKey);
}
export async function exportPrivateJwk(privateKey) {
  return await subtle.exportKey("jwk", privateKey);
}

// Import JWKs
export async function importPublicKeyJwk(jwk) {
  return await subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );
}
export async function importPrivateKeyJwk(jwk) {
  return await subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
  );
}

// Derive AES-GCM key (256) from ECDH privateKey & other party publicKey
export async function deriveSharedKey(privateKey, otherPublicKey) {
  return await subtle.deriveKey(
    { name: "ECDH", public: otherPublicKey },
    privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// AES-GCM encrypt (returns base64 ciphertext and iv as base64)
export async function encryptWithKey(aesKey, plaintext) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes
  const enc = new TextEncoder();
  const pt = enc.encode(plaintext);
  const cipherBuffer = await subtle.encrypt({ name: "AES-GCM", iv }, aesKey, pt);
  return {
    ciphertext: arrayBufferToBase64(cipherBuffer),
    iv: arrayBufferToBase64(iv.buffer)
  };
}

// AES-GCM decrypt
export async function decryptWithKey(aesKey, ciphertextB64, ivB64) {
  const cipherBuf = base64ToArrayBuffer(ciphertextB64);
  const ivBuf = base64ToArrayBuffer(ivB64);
  const plainBuf = await subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(ivBuf) }, aesKey, cipherBuf);
  const dec = new TextDecoder();
  return dec.decode(plainBuf);
}

// Helpers: ArrayBuffer <-> base64
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

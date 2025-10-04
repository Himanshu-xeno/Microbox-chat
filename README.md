
---

# 📦 Microbox-Chat

**Microbox-Chat** is a LAN-based peer-to-peer chat application built using the **MERN stack (MongoDB, Express, React, Node.js)** with **Socket.io** for real-time communication and **WebCrypto API (AES-GCM + RSA/ECDH)** for end-to-end encryption.

The goal is to create a **lightweight, decentralized, and secure local chat app** that runs within a LAN without depending on internet services.

---

## 🚀 Features (Till Now)

* 🔐 **User Authentication** (Register/Login with JWT)
* 💬 **1-to-1 Chat** with real-time messaging (Socket.io)
* 📜 **Message Persistence** (MongoDB stores encrypted messages)
* ⏱ **Timestamps** for each message
* 🔑 **End-to-End Encryption** with local keypairs (WebCrypto API):

  * Keys generated in browser and stored in IndexedDB
  * Messages encrypted client-side, decrypted only with private key
* 📡 **Realtime Updates** – new messages now appear instantly without page refresh
* 🖥 **LAN-ready Setup** (future shift to P2P discovery, no internet dependency)

---

## 📂 Project Structure

```
microbox-chat/
├─ backend/
│  ├─ server.js
│  ├─ package.json
│  ├─ .env                 # MONGO_URI, JWT_SECRET etc.
│  ├─ models/
│  │  ├─ User.js
│  │  └─ Message.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ conversation.js
│  │  └─ unread.js
│  └─ middleware/
│     └─ verifyToken.js
│
├─ frontend/
│  ├─ package.json
│  ├─ index.html
│  ├─ src/
│  │  ├─ main.jsx
│  │  ├─ App.jsx
│  │  ├─ ChatWindow.jsx
│  │  ├─ UsersList.jsx
│  │  ├─ Login.jsx
│  │  ├─ Register.jsx
│  │  ├─ components/...    # icons, reusable UI parts
│  │  └─ crypto/
│  │     ├─ cryptoUtils.js # key generation, export/import, AES encrypt/decrypt
│  │     └─ keyStore.js    # IndexedDB wrapper (save/load/delete private keys)
│  └─ vite.config.js
└─ README.md
```

---

## 📅 Development Journey (Steps)

### Step 1: Base Setup

* Initialized MERN + Socket.io boilerplate
* Basic frontend + backend communication

### Step 2: Authentication

* Implemented **JWT-based login & registration**
* MongoDB stores hashed credentials

### Step 3: Messaging (Plaintext)

* Users can send/receive messages via Socket.io
* Messages stored in MongoDB

### Step 4: Message Persistence

* Chat history loads when opening a conversation
* Added timestamps below messages

### Step 5: Security Layer (End-to-End Encryption)

* AES-GCM for message encryption/decryption
* Local keypair generated in browser
* Private keys stored only in **IndexedDB** (never leave the device)
* Solved **real-time refresh issue** (messages update instantly without page reload)

---

## 🛠 Tech Stack

* **Frontend:** React (Vite, TailwindCSS planned), Socket.io-client
* **Backend:** Node.js, Express, Socket.io, MongoDB (Mongoose)
* **Security:** WebCrypto API (AES-GCM + RSA/ECDH), IndexedDB
* **Auth:** JWT-based authentication

---

## 🔮 Roadmap (Future Steps)

*  **Export/Import Keys** (allow users to backup their private keys as `.json`)
*  **Group Chats** (encrypted group messaging)
*  **P2P LAN Discovery** (mDNS / WebRTC for direct peer connections)
*  **Offline Support** (local-first storage with sync)
*  **UI/UX Improvements** (modern chat UI with Tailwind + better alerts/banners)
*  **File Sharing** (encrypted file transfer within LAN)
*  **Cross-Device Support** with optional key import

---

## 📖 How It Works (Security Model)

* When a user **registers/logs in**, a new RSA/ECDH keypair is generated locally.
* Private key is stored in **IndexedDB**, never sent to the server.
* Public key is shared with server → distributed to contacts.
* Each message is encrypted using:

  * **AES-GCM** (symmetric, per-message encryption)
  * Key exchanged via RSA/ECDH public keys
* If the user clears browser data → private key is lost → old messages cannot be decrypted.

---

## 🤝 Contributing

Microbox-Chat is a learning + experimental project. Contributions and ideas are welcome, especially around **LAN P2P discovery** and **encryption improvements**.

---



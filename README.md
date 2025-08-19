# Bitespeed Backend Task: Identity Reconciliation

This project is an implementation of the **Identity Reconciliation API** for the Bitespeed Backend Task.  
It is built using **Node.js, Express, TypeScript, and PostgreSQL**.

**API URL:** https://bitespeed-backend-task-identity-pp9q.onrender.com/contacts/identify

---

## 🚀 Features
- Identify and reconcile customer contacts by **email** and **phone number**.
- Maintain a **primary contact** with multiple linked **secondary contacts**.
- Automatically merge contacts if duplicates are found.
- Built with **TypeScript** for type safety.
- PostgreSQL as the database.

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Pandepic-pp/bitespeed-backend-task-identity-reconcilation.git
cd test-api-postgre
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env file in the root directory with values like:

```bash
PGHOST
PGPORT
PGDATABASE
PGUSER
PGPASSWORD
PGSSL
PORT
```

### 4. Run in development mode

```bash
npm run dev
```

### 5. Build and run in production

```bash
npm run build
npm start
```

## 🛠️ API Endpoints

### POST /identify
Identify or reconcile a contact.

Request Body
```json
{
  "email": "abc@xyz.com",
  "phoneNumber": "123456"
}
```

Response Example
```json
{
  "contact": {
    "primaryContactId": 6,
    "emails": ["abc@xyz.com","def@xyz.com","ghi@xyz.com"],
    "phoneNumbers": ["123456", "123457", "123458"],
    "secondaryContactIds": [7, 8, 9, 10, 11, 12]
  }
}
```

### Deployment on Render
<ol>
<li>Push your project to GitHub.</li>
<li>On Render, create a New Web Service and connect the repo.</li>
<li>Use the following commands:
  <ul>
    <li>Build Command: npm install && npm run build</li>
    <li>Start Command: npm start</li>
  </ul>
  </li>
<li>Add environment variables (DATABASE_URL, PORT, etc.).</li>
</ol>

Your API will be available at:
```bash
https://bitespeed-backend-task-identity-pp9q.onrender.com/contacts/identify
```

## Tech Stack
<ul>
  <li>Node.js + Express</li>
  <li>TypeScript</li>
  <li>PostgreSQL</li>
  <li>Render (deployment)</li>
</ul>

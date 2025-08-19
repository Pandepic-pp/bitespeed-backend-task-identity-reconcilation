# Bitespeed Backend Task: Identity Reconciliation

This project is an implementation of the **Identity Reconciliation API** for the Bitespeed Backend Task.  
It is built using **Node.js, Express, TypeScript, and PostgreSQL**.

**API URL:** https://bitespeed-backend-task-identity-pp9q.onrender.com/contacts/identify

---

### 🔍 Edge Case Handling

**Scenario:**

1. `POST {"email": "abc@xyz.com", "phoneNumber": "123456"}`  
   → Creates **Primary Record** (id = 1).

2. `POST {"email": "def@xyz.com", "phoneNumber": "123456"}`  
   → Creates **Secondary Record** (id = 2) linked to id = 1 (since phone number already exists).

3. `POST {"email": "def@xyz.com", "phoneNumber": "123457"}`  
   → A new phone number, so a **new Record** (id = 3) is created.

**The Confusion:**  
- Record 2 already exists with the same email as Record 3.  
- Should Record 2 or 3 be promoted to Primary?  
- Or should everything still resolve back to Record 1 (the original Primary)?

**My Approach & Resolution:**  
- **A Primary should never be demoted** unless there’s a strong reason.  
- Whenever a new record matches an **existing secondary**, it should **still link back to the original Primary**.  
- In this case, Record 3 (same email as Record 2) is linked back to Primary Record 1, keeping identity reconciliation consistent.  
- This avoids conflicts where multiple primaries could exist for the same identity.

✅ **Final Decision:**  
All new records that overlap with any secondary must ultimately resolve to the **first/original primary**.  
This ensures a single source of truth for each identity and prevents fragmented identity chains.

## 🚀 Features
- Identify and reconcile customer contacts by **email** and **phone number**.
- Maintain a **primary contact** with multiple linked **secondary contacts**.
- Automatically merge contacts if duplicates are found.
- Built with **TypeScript** for type safety.
- PostgreSQL as the database.

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

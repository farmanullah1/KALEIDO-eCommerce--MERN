# KALEIDO - Interactive 3D E-Commerce Platform

A premium, 3D-first e-commerce experience built with the MERN stack, Three.js, and Framer Motion.
# 💎 KALEIDO | Dimensional Marketplace

**Experience commerce in the third dimension.** KALEIDO is a high-fidelity, neuro-aesthetic marketplace built on the MERN stack, designed to bridge the gap between digital artifacts and human desire.

---

## 🌌 Core Features

### 🛠️ Neural Link (Real-time Messaging)
*   **Direct Connectivity**: Real-time WebSocket architecture for instant buyer-seller synchronization.
*   **Encrypted Transmissions**: Secure data handling for all marketplace communications.

### 📊 System Command (Admin Panel)
*   **Centralized Oversight**: Monitor platform-wide analytics, including revenue, user acquisition, and active sellers.
*   **Artifact Moderation**: Review and authorize pending digital assets through a specialized moderation queue.
*   **User Archive**: Manage global access control, user roles (Buyer, Seller, Admin), and account status.
*   **Matrix Nodes (Categories)**: Dynamically manage product taxonomy with custom icons and metadata.
*   **System Broadcast**: Send real-time psychic transmissions to all active nodes in the collective.
*   **Comparison Matrix**: Cross-analyze multiple artifacts to determine optimal integration.

### 🏪 Vendor Portal (Seller System)
*   **Onboarding**: Seamless registration flow for new sellers with shop verification.
*   **Inventory Control**: Advanced CRUD operations for digital artifacts with multi-image support.
*   **Order Fulfillment**: Track and manage orders specific to your shop with real-time status updates.
*   **Shop Settings**: Customize your vendor presence with shop logos, descriptions, and metadata.

### 🚀 Performance & SEO
*   **Vite-Powered**: Ultra-fast hot module replacement and production builds.
*   **Semantic Intelligence**: Advanced SEO protocols with dynamic meta management for every artifact.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, Framer Motion |
| **Backend** | Node.js, Express, Socket.io |
| **Database** | MongoDB with Mongoose ODM |
| **State** | Zustand (Global State), React Context |
| **Security** | JWT Authentication, Bcrypt Encryption |

---

## 📂 Project Structure

```bash
KALEIDO/
├── frontend/          # Vite + React 19 Frontend
├── backend/           # Express Server & Socket.io
└── shared/            # Shared types and constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd KALEIDO
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI
   npm run build
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

## 📂 Project Structure

- `frontend/`: React application with Three.js components.
- `backend/`: Express API with MongoDB models and controllers.
- `DESIGN.md`: Visual language and interaction guidelines.

## 📜 License

ISC

💬 **Real-Time Chat Application**

A real-time chat application built using the MRN stack (MongoDB, React, Node.js/Express).
This app allows users to create accounts, send & receive messages instantly, and stay connected with live socket-based communication.

🚀 **Features**

🔐 User Authentication – Secure login & signup with JWT.

💬 Real-Time Messaging – Powered by Socket.IO for instant updates.

👤 Online/Offline Status – Track who’s currently active.

📱 Responsive UI – Optimized for desktop and mobile.

🌓 Dark/Light Mode – Toggle-friendly modern theme.

📡 Scalable Backend – REST APIs with Express & MongoDB.

🛠️ Tech Stack

**Frontend (React):**

React 18 + Vite

TailwindCSS (for styling)

Axios (API calls)

Socket.IO Client

**Backend (Node.js + Express):**

Node.js & Express

MongoDB + Mongoose

Socket.IO (real-time communication)

JWT Authentication + bcrypt

CORS (security)

Database:

MongoDB (Atlas / Local)

📂 Project Structure
📦 chat-app
 ┣ 📂 client       # React frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┗ 📜 App.jsx
 ┣ 📂 server       # Node.js backend
 ┃ ┣ 📂 models
 ┃ ┣ 📂 routes
 ┃ ┣ 📂 controllers
 ┃ ┗ 📜 server.js
 ┣ 📜 package.json
 ┗ 📜 README.md

⚙️ Installation & Setup
Clone the repository
git clone https://github.com/Ishantrivedi007/mern-chat-app.git
cd chat-app

Setup Backend
cd server
npm install


Create a .env file inside server/ and add:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key


Run server:

npm start

Setup Frontend
cd ../client
npm install
npm run dev


Frontend will start on http://localhost:5173
 (if using Vite).
Backend runs on http://localhost:5000

🔮 **Future Enhancements**

📷 Image/Media Sharing

📞 Voice & Video Calls

🔔 Push Notifications

🔐 OAuth (Google, GitHub, etc.)

🤝 Contributing

Contributions are welcome! Please fork the repo and submit a PR.

📜 License

This project is licensed under the MIT License – free to use and modify.

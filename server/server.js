const http = require("http");
const app = require('./app');
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const initcronJobs = require("./utils/cronjobs");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        initcronJobs();

        const server = http.createServer(app);

        const io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:5173",
                methods: ["GET", "POST", "PUT", "DELETE"],
                credentials: true
            }
        });

        const onlineUsers = new Map();

        app.set('io', io);
        app.set('onlineUsers', onlineUsers);

        io.on("connection", (socket) => {
            console.log("✅ Socket Connected:", socket.id);

            socket.on("register_user", (userId) => {
                if (!userId) return;

                const uid = userId.toString();

                onlineUsers.set(uid, socket.id);
                socket.join(`user:${uid}`);

                console.log(`🟢 User ${uid} registered with socket ${socket.id}`);
                console.log("Online Users:", onlineUsers);
            });

            socket.on("join_chat", (chatId) => {
                if (!chatId) return;

                socket.join(chatId);
                console.log(`📩 User joined chat room: ${chatId}`);
            });

            socket.on("leave_chat", (chatId) => {
                if (!chatId) return;

                socket.leave(chatId);
                console.log(`📤 User left chat room: ${chatId}`);
            });

            socket.on("disconnect", () => {
                for (let [userId, socketId] of onlineUsers.entries()) {
                    if (socketId === socket.id) {
                        onlineUsers.delete(userId);
                        console.log(` User ${userId} disconnected`);
                        break;
                    }
                }
            });
        });

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server not started because MongoDB connection failed.");
        console.error(error.message);
        process.exit(1);
    }
};

startServer();

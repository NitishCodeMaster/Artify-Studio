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

        const allowedOrigins = [
            "http://localhost:5173",
            "https://artify-studio-client.vercel.app"
        ];

        const io = new Server(server, {
            cors: {
                origin: allowedOrigins,
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

                // Broadcast updated online users list
                io.emit("online_users_list", Array.from(onlineUsers.keys()));
                console.log(`🟢 User ${uid} registered with socket ${socket.id}`);
            });

            socket.on("get_online_users", () => {
                socket.emit("online_users_list", Array.from(onlineUsers.keys()));
            });

            socket.on("join_chat", (chatId) => {
                if (!chatId) return;
                socket.join(chatId);
            });

            socket.on("leave_chat", (chatId) => {
                if (!chatId) return;
                socket.leave(chatId);
            });

            socket.on("typing", ({ chatId, userId, userName }) => {
                if (!chatId) return;
                socket.to(chatId).emit("display_typing", { chatId, userId, userName });
            });

            socket.on("stop_typing", ({ chatId, userId }) => {
                if (!chatId) return;
                socket.to(chatId).emit("hide_typing", { chatId, userId });
            });

            socket.on("disconnect", () => {
                for (let [userId, socketId] of onlineUsers.entries()) {
                    if (socketId === socket.id) {
                        onlineUsers.delete(userId);
                        io.emit("online_users_list", Array.from(onlineUsers.keys()));
                        console.log(`🔴 User ${userId} disconnected`);
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

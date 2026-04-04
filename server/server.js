const http = require("http");
const app = require('./app');
const connectDB = require("./config/db");
const { Server } = require("socket.io");

connectDB();

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

app.set('io', io);

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`User Joined Chat Room: ${chatId}`);
    });

    socket.on("disconnect", () => {
        console.log(` User Disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
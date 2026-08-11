const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const app = express();

const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes');
const postRoutes = require('./routes/postRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const homeRoutes = require('./routes/homeRoutes');
const learnRoutes = require('./routes/learnRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use(compression());
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://artify-studio-client.vercel.app",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, origin);
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

app.use(express.json({ limit: '80mb' }));
app.use(express.urlencoded({ limit: '80mb', extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Artify Production Backend Running ");
});

app.get("/api/test", (req, res) => {
    res.json({ status: "Backend working " });
});

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);
app.use('/api/sellers', sellerRoutes);
app.use("/api/home", homeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/events', eventRoutes);
app.use('/events', eventRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);

module.exports = app;

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes');
const postRoutes = require('./routes/postRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello world");
});

app.use('/users', userRoutes);
app.use('/sellers', sellerRoutes);
app.use('/products', productRoutes);
app.use('/posts', postRoutes);
app.use('/payments', paymentRoutes);

module.exports = app;

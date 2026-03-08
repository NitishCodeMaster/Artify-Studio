const dotenv = require('dotenv');
dotenv.config(); 

const cors = require('cors');
const express = require('express'); 
const app = express();
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello world");
});

app.use('/users', userRoutes);
app.use('/sellers', sellerRoutes);
app.use('/products', productRoutes);

module.exports = app;

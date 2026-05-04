const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing in server/.env");
    }

    try {
        mongoose.set("bufferCommands", false);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
        });

        console.log("✅ MongoDB Atlas Connected");
    } catch (error) {
        console.error("🔴 Error connecting to MongoDB.");
        console.error("Check MongoDB Atlas Network Access, database user/password, and MONGO_URI in server/.env.");
        throw error;
    }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', false);
    try {
        const conn = await mongoose.connect('mongodb+srv://codekochihack:tW8Hb7FtQ54MyR6u@cura.rljdi.mongodb.net/?retryWrites=true&w=majority&appName=cura');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
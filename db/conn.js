const mongoose = require('mongoose');

const DB = process.env.DATABASE;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database Connected");
        createTitleIndex();
    } catch (error) {
        console.log("Error", error);
    }
};

const createTitleIndex = () => {
    mongoose.connection.db.collection('apis').createIndex({ title: 1 }, (err) => {
        if (err) {
            console.error('Error creating index:', err);
        } else {
            console.log('Index on title field created successfully');
        }
        mongoose.connection.close();
    });
};

connectToDatabase();

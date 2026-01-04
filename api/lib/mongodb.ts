import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.mongo_db_url || '';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: 'db_cardamom',
        };

        console.log('Connecting to MongoDB with URI:', MONGODB_URI.split('@')[1] || 'hidden');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB connection established');
            return mongoose;
        }).catch((error) => {
            console.error('MongoDB connection error:', error);
            throw error;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;

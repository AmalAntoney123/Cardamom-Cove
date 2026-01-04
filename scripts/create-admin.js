import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.mongo_db_url;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node scripts/create-admin.js admin.cardamom admin@cardamom.123!');
        process.exit(1);
    }

    const [username, password] = args;

    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'db_cardamom' });
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            password: hashedPassword,
        });

        await user.save();
        console.log(`Admin user "${username}" created successfully!`);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();

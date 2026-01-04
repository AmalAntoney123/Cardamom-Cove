import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('Attempting to connect to database...');
        await dbConnect();
        console.log('Database connected successfully.');

        const { username, password } = req.body;
        console.log(`Attempting login for user: ${username}`);

        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found.');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('User found, comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch.');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful, signing token...');
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error: any) {
        console.error('Login error detail:', error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

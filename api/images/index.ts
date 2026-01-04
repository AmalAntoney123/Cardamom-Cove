import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb';
import Image from '../models/Image';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const images = await Image.find({}).sort({ createdAt: -1 });
            res.status(200).json(images);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'POST') {
        // Check authentication for POST
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        try {
            jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        try {
            const image = await Image.create(req.body);
            res.status(201).json(image);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

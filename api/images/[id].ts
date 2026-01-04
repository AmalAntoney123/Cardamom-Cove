import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Image from '../models/Image.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const { id } = req.query;
    await dbConnect();

    if (req.method === 'DELETE') {
        // Check authentication for DELETE
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
            const deletedImage = await Image.deleteOne({ _id: id });
            if (deletedImage.deletedCount === 0) {
                return res.status(404).json({ message: 'Image not found' });
            }
            res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Booking from '../models/Booking.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

function verifyAdmin(req: VercelRequest): boolean {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return false;
    try {
        jwt.verify(auth.split(' ')[1], JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();

    const { id } = req.query;

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!verifyAdmin(req)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // ── PATCH — update status / dates / room ───────────────────────
    if (req.method === 'PATCH') {
        try {
            const { status, checkIn, checkOut, room } = req.body;
            const updates: Record<string, any> = {};
            if (status !== undefined) updates.status = status;
            if (checkIn !== undefined) updates.checkIn = checkIn;
            if (checkOut !== undefined) updates.checkOut = checkOut;
            if (room !== undefined) updates.room = room;

            const updated = await Booking.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            );
            if (!updated) return res.status(404).json({ message: 'Booking not found' });
            return res.status(200).json(updated);
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    }

    // ── DELETE ────────────────────────────────────────────────────
    if (req.method === 'DELETE') {
        try {
            const deleted = await Booking.findByIdAndDelete(id);
            if (!deleted) return res.status(404).json({ message: 'Booking not found' });
            return res.status(200).json({ message: 'Booking deleted' });
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

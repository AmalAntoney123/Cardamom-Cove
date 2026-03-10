import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Booking from '../models/Booking.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

function getAdminToken(req: VercelRequest): string | null {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return null;
    return auth.split(' ')[1];
}

async function sendNotificationEmail(booking: {
    name: string;
    email: string;
    phone: string;
    checkIn: Date | string;
    checkOut: Date | string;
    room?: string;
    message: string;
}) {
    const user = process.env.MAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;
    const to = process.env.NOTIFY_EMAIL || user;

    if (!user || !pass) {
        console.warn('SMTP_USER / SMTP_PASS not set — skipping email notification.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
    });

    const fmt = (d: Date | string) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    await transporter.sendMail({
        from: `"The Cardamom Cove" <${user}>`,
        to,
        subject: `🌿 New Booking Enquiry from ${booking.name}`,
        html: `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f6;padding:32px;border:1px solid #e5e0d8;">
  <h2 style="color:#1a2e25;font-size:24px;margin-bottom:4px;">New Booking Enquiry</h2>
  <p style="color:#c5a059;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:0;">The Cardamom Cove</p>
  <hr style="border:none;border-top:1px solid #e5e0d8;margin:20px 0;" />
  <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;">
    <tr><td style="padding:8px 0;color:#888;width:140px;">Guest Name</td><td style="padding:8px 0;font-weight:bold;">${booking.name}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">${booking.email}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;">${booking.phone}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Check-in</td><td style="padding:8px 0;">${fmt(booking.checkIn)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Check-out</td><td style="padding:8px 0;">${fmt(booking.checkOut)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Room Preference</td><td style="padding:8px 0;font-weight:bold;color:#1a2e25;">${booking.room && booking.room !== 'any' ? booking.room : '<em style="color:#aaa;">No preference</em>'}</td></tr>
    <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Message</td><td style="padding:8px 0;">${booking.message || '<em style="color:#aaa;">No message</em>'}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #e5e0d8;margin:20px 0;" />
  <p style="font-size:12px;color:#aaa;text-align:center;">Kauwanty, Idukki, Kerala · thecardamomcove.in</p>
</div>`,
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();

    // ── GET — list all bookings (admin only) ───────────────────────
    if (req.method === 'GET') {
        const token = getAdminToken(req);
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
        try {
            jwt.verify(token, JWT_SECRET);
        } catch {
            return res.status(401).json({ message: 'Invalid token' });
        }
        try {
            const bookings = await Booking.find({}).sort({ createdAt: -1 });
            return res.status(200).json(bookings);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // ── POST — create a booking (public) ───────────────────────────
    if (req.method === 'POST') {
        try {
            const booking = await Booking.create(req.body);
            try {
                await sendNotificationEmail(req.body);
            } catch (e) {
                console.error('Email notification error:', e);
            }
            return res.status(201).json(booking);
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

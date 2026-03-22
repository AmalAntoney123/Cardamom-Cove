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

async function sendReplyEmail(booking: { name: string, email: string }, message: string) {
    const user = process.env.REPLY_MAIL_USER;
    const pass = process.env.REPLY_MAIL_PASS;

    console.log('[api/bookings/reply] Using mail user:', user);
    if (!user || !pass) {
        throw new Error('SMTP_USER / SMTP_PASS or REPLY_MAIL_USER / REPLY_MAIL_PASS not set');
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
    });

    await transporter.sendMail({
        from: `"The Cardamom Cove" <${user}>`,
        to: booking.email,
        subject: `Re: Your Booking Enquiry at The Cardamom Cove - ${booking.name}`,
        html: `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f6;padding:32px;border:1px solid #e5e0d8;">
  <div style="text-align:center;margin-bottom:24px;">
    <h2 style="color:#1a2e25;font-size:24px;margin-bottom:4px;">The Cardamom Cove</h2>
    <p style="color:#c5a059;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:0;">Boutique Plantation Retreat</p>
  </div>
  <hr style="border:none;border-top:1px solid #e5e0d8;margin:20px 0;" />
  
  <div style="color:#333;font-size:15px;line-height:1.6;">
    <div style="white-space: pre-wrap;">${message}</div>
  </div>

  <hr style="border:none;border-top:1px solid #e5e0d8;margin:32px 0 20px 0;" />
  <p style="font-size:12px;color:#aaa;text-align:center;">
    Kauwanty, Idukki, Kerala · <a href="https://thecardamomcove.in" style="color:#c5a059;text-decoration:none;">thecardamomcove.in</a>
  </p>
</div>`,
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    const token = getAdminToken(req);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    const { bookingId, message } = req.body;

    if (!bookingId || !message) {
        return res.status(400).json({ message: 'Missing bookingId or message' });
    }

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.email) {
            return res.status(400).json({ message: 'Booking has no email address' });
        }

        await sendReplyEmail(booking, message);

        return res.status(200).json({ message: 'Reply sent successfully' });
    } catch (err: any) {
        console.error('[api/bookings/reply] Error:', err);
        return res.status(500).json({ message: err.message });
    }
}

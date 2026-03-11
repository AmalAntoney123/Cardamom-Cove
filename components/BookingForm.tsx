import React, { useState } from 'react';

const BookingForm: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', checkIn: '', checkOut: '', room: 'any', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Server error');
            setFormStatus('success');
            setFormData({ name: '', email: '', phone: '', checkIn: '', checkOut: '', room: 'any', message: '' });
        } catch {
            setFormStatus('error');
        }
    };

    if (formStatus === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-[#1a2e25] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#c5a059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-serif text-2xl text-[#1a2e25]">Enquiry Received</h3>
                <p className="text-stone-500 font-light text-sm max-w-xs">Thank you, we'll be in touch shortly to confirm your stay at The Cardamom Cove.</p>
                <button onClick={() => setFormStatus('idle')} className="text-[10px] uppercase tracking-widest font-bold text-[#c5a059] border-b border-[#c5a059]/40 pb-1 hover:text-[#1a2e25] transition-colors">Send Another</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleBookingSubmit} className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border-b border-stone-200 focus-within:border-[#c5a059] transition-colors sm:col-span-2">
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="YOUR NAME" required className="w-full bg-transparent border-none py-4 text-xs tracking-widest focus:ring-0 uppercase placeholder:text-stone-300" />
                </div>
                <div className="border-b border-stone-200 focus-within:border-[#c5a059] transition-colors">
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="YOUR EMAIL" required={!formData.phone} className="w-full bg-transparent border-none py-4 text-xs tracking-widest focus:ring-0 uppercase placeholder:text-stone-300" />
                </div>
                <div className="border-b border-stone-200 focus-within:border-[#c5a059] transition-colors">
                    <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="YOUR PHONE" required={!formData.email} className="w-full bg-transparent border-none py-4 text-xs tracking-widest focus:ring-0 uppercase placeholder:text-stone-300" />
                </div>
                <div className="border-b border-stone-200 focus-within:border-[#c5a059] transition-colors">
                    <label className="block text-[9px] uppercase tracking-widest text-stone-400 pt-4 pb-1">Check-in Date</label>
                    <input type="date" name="checkIn" value={formData.checkIn} onChange={handleFormChange} required min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent border-none py-2 text-xs tracking-widest focus:ring-0 text-[#1a2e25]" />
                </div>
                <div className="border-b border-stone-200 focus-within:border-[#c5a059] transition-colors">
                    <label className="block text-[9px] uppercase tracking-widest text-stone-400 pt-4 pb-1">Check-out Date</label>
                    <input type="date" name="checkOut" value={formData.checkOut} onChange={handleFormChange} required min={formData.checkIn || new Date().toISOString().split('T')[0]} className="w-full bg-transparent border-none py-2 text-xs tracking-widest focus:ring-0 text-[#1a2e25]" />
                </div>
                <div className="border-b border-stone-200 focus-within:border-[#c5a059] transition-colors sm:col-span-2">
                    <label className="block text-[9px] uppercase tracking-widest text-stone-400 pt-4 pb-1">Preferred Room</label>
                    <select name="room" value={formData.room} onChange={handleFormChange} className="w-full bg-transparent border-none py-2 text-xs tracking-widest focus:ring-0 text-[#1a2e25] uppercase">
                        <option value="any">No Preference</option>
                        <option value="The Emerald Suite">The Emerald Suite — King Bed · Premier Suite</option>
                        <option value="The Canopy Loft">The Canopy Loft — Mezzanine Floor · 2 Beds</option>
                        <option value="The Mist Retreat">The Mist Retreat — Twin Sharing · Cozy Hideaway</option>
                        <option value="Full Property">Full Property — Exclusive Access to Entire Cove</option>
                    </select>
                </div>
                <div className="border-b border-stone-200 focus-within:border-[#c5a059] transition-colors sm:col-span-2">
                    <textarea name="message" value={formData.message} onChange={handleFormChange} placeholder="YOUR MESSAGE" rows={3} className="w-full bg-transparent border-none py-4 text-xs tracking-widest focus:ring-0 uppercase placeholder:text-stone-300 resize-none"></textarea>
                </div>
            </div>
            {formStatus === 'error' && <p className="text-red-800 text-[10px] uppercase tracking-wider">Something went wrong. Please try again or call us directly.</p>}
            <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-[#1a2e25] text-white py-5 rounded-sm font-bold tracking-[0.3em] text-xs uppercase hover:bg-[#c5a059] transition-all disabled:opacity-60 flex items-center justify-center space-x-3"
            >
                {formStatus === 'sending' ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Sending...</span></> : <span>Submit Enquiry</span>}
            </button>
        </form>
    );
};

export default BookingForm;

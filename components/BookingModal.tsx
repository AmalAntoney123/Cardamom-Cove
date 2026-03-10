import React, { useEffect, useState } from 'react';
import BookingForm from './BookingForm';
import { X } from 'lucide-react';

const BookingModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('openBookingModal', handleOpen);
        return () => window.removeEventListener('openBookingModal', handleOpen);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#faf9f6] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <div className="sticky top-0 bg-[#faf9f6]/90 backdrop-blur-md px-8 py-6 flex items-center justify-between z-10 border-b border-stone-200">
                    <div>
                        <h3 className="font-serif text-2xl text-[#1a2e25]">Reserve Your Stay</h3>
                        <p className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold mt-1">The Cardamom Cove</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="text-stone-400 hover:text-[#1a2e25] transition-colors p-2 hover:bg-stone-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8">
                    <BookingForm />
                </div>
            </div>
        </div>
    );
};

export default BookingModal;

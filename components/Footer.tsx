
import React from 'react';
import { Palmtree, Instagram, Facebook, Mail, Phone, MapPin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1a15] text-[#d1d5db] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-[#2d4a3e] pb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-8">
              <Palmtree className="w-8 h-8 text-[#c5a059]" />
              <span className="text-2xl font-serif tracking-widest text-white">
                CARDAMOM COVE
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed font-light italic text-sm">
              A sanctuary where luxury meets nature in the heart of Kauwanty, Idukki. Experience the mist of the Western Ghats.
            </p>
          </div>

          <div>
            <h4 className="text-[#c5a059] font-bold uppercase tracking-[0.2em] text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/room/emerald" className="hover:text-white transition-colors">Luxury Rooms</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#c5a059] font-bold uppercase tracking-[0.2em] text-xs mb-8">Contact</h4>
            <ul className="space-y-4 font-light text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span>Kauwanty, Idukki, Kerala</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#c5a059]" />
                <span>+91 6235 62 6334</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#c5a059]" />
                <span>info@thecardamomcove.in</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#c5a059] font-bold uppercase tracking-[0.2em] text-xs mb-8">Follow Us</h4>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/thecardamomcove/" target="_blank" rel="noopener noreferrer" className="group p-2 border border-stone-800 rounded-full hover:border-[#c5a059] transition-all">
                <Instagram className="w-5 h-5 cursor-pointer group-hover:text-[#c5a059] transition-colors" />
              </a>
              <a href="https://www.instagram.com/thecardamomcove/" target="_blank" rel="noopener noreferrer" className="group p-2 border border-stone-800 rounded-full hover:border-[#c5a059] transition-all">
                <Facebook className="w-5 h-5 cursor-pointer group-hover:text-[#c5a059] transition-colors" />
              </a>
              <a href="https://www.instagram.com/thecardamomcove/" target="_blank" rel="noopener noreferrer" className="group p-2 border border-stone-800 rounded-full hover:border-[#c5a059] transition-all">
                <Twitter className="w-5 h-5 cursor-pointer group-hover:text-[#c5a059] transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center font-light text-stone-500 text-[10px] tracking-[0.2em] uppercase">
          <p>© 2026 The Cardamom Cove. All rights reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

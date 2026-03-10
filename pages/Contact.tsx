import React, { useEffect } from 'react';
import { Phone, Mail, MapPin, Leaf } from 'lucide-react';
import BookingForm from '../components/BookingForm';

const Contact: React.FC = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-40 min-h-screen relative overflow-hidden bg-[#faf9f6]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] -z-10 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-50 rounded-full blur-[120px] -z-10 opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-24">
        <div className="text-center space-y-6 mb-20 reveal">
          <div className="flex justify-center mb-4">
            <Leaf className="text-emerald-800/20 w-12 h-12" />
          </div>
          <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">Connect With Us</span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#1a2e25] leading-tight">
            Plan Your Stay
          </h1>
          <div className="w-16 h-[1px] bg-[#c5a059] mx-auto opacity-50"></div>
          <p className="max-w-2xl mx-auto text-stone-500 font-light leading-relaxed">
            Reach out to us for bookings or inquiries. We’re here to make your stay in Idukki unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="reveal-left">
            <div className="space-y-8">
              <div className="flex items-center space-x-6 group cursor-pointer bg-white p-6 rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-[#c5a059] group-hover:bg-[#1a2e25] group-hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">Call Us</p>
                  <p className="text-[#1a2e25] font-semibold text-lg hover:text-[#c5a059] transition-colors"><a href="tel:+916235626334">+91 6235 62 6334</a></p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 group cursor-pointer bg-white p-6 rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-[#c5a059] group-hover:bg-[#1a2e25] group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">Email Us</p>
                  <p className="text-[#1a2e25] font-semibold text-lg hover:text-[#c5a059] transition-colors"><a href="mailto:info@thecardamomcove.in">info@thecardamomcove.in</a></p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 group cursor-pointer bg-white p-6 rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-[#c5a059] group-hover:bg-[#1a2e25] group-hover:text-white transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">Location</p>
                  <p className="text-[#1a2e25] font-semibold text-lg">Kauwanty, Idukki, Kerala</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 shadow-2xl reveal-right rounded-lg border border-stone-50">
            <BookingForm />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="h-[500px] w-full bg-stone-200 relative reveal">
        <div className="absolute inset-0 grayscale opacity-70">
          <iframe
            src="https://www.google.com/maps?q=9.8071547,77.0399898&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="Cardamom Cove Map"
          ></iframe>
        </div>
        <div className="absolute bottom-12 left-12 bg-[#1a2e25] text-white p-8 max-w-xs shadow-2xl rounded-sm">
          <h4 className="font-serif text-2xl mb-4">Find Us</h4>
          <p className="text-stone-400 text-xs font-light mb-6">Kauwanty, Idukki, Kerala. Open Google Maps for turn-by-turn navigation.</p>
          <a href="https://www.google.com/maps?q=9.8071547,77.0399898" target="_blank" rel="noreferrer" className="text-[#c5a059] text-[10px] uppercase tracking-widest font-bold border-b border-[#c5a059] pb-1 hover:text-white transition-colors">
            Open in Google Maps
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;

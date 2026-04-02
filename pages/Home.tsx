import React, { useState, useEffect } from 'react';
import { ChevronRight, Wind, Coffee, Trees, Heart, Flame, Car, MapPin, Phone, Mail, X, Sparkles, Volume2, Maximize2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

const Home: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenBookingOpen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setShowPopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Prevent scroll when player is open
  useEffect(() => {
    if (isPlayerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPlayerOpen]);

  const closePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('hasSeenBookingOpen', 'true');
  };

  const openBookingForm = () => {
    closePopup();
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const rooms = [
    {
      id: "emerald",
      name: "The Emerald Suite",
      description: "A sophisticated sanctuary offering refined luxury with a king-sized view of the Western Ghats.",
      img: "/images/emerald/emerald-1.png",
      features: "Mini Kitchen • King Bed • Premier Suite",
      price: "16,499"
    },
    {
      id: "canopy",
      name: "The Canopy Loft",
      description: "An architectural marvel featuring a spacious mezzanine floor and two beds, perfect for elevated comfort.",
      img: "/images/canopy/canopy-1.png",
      features: "Mini Kitchen • Mezzanine Floor • 2 Beds",
      price: "18,799"
    },
    {
      id: "mist",
      name: "The Mist Retreat",
      description: "An intimate and cozy escape designed for companions, featuring bespoke twin sharing beds and garden access.",
      img: "/images/mist/mist-1.png",
      features: "Mini Kitchen • Twin Sharing Beds • Cozy Hideaway",
      price: "8,699"
    }
  ];

  return (
    <div className="w-full bg-[#faf9f6]">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src="https://www.youtube.com/embed/qV1gT4EQlO4?autoplay=1&mute=1&loop=1&playlist=qV1gT4EQlO4&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none max-w-none max-h-none scale-105"
            style={{
              width: 'max(100vw, 177.78vh)',
              height: 'max(100vh, 56.25vw)',
            }}
            frameBorder="0"
            allow="autoplay; fullscreen"
          ></iframe>
          <div className="absolute inset-0 bg-[#0f1a15]/60"></div>
        </div>

        {/* Enjoy in Fullscreen Button */}
        <button
          onClick={() => setIsPlayerOpen(true)}
          className="absolute bottom-10 right-10 z-20 flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-3 md:px-6 md:py-4 rounded-full text-white hover:bg-white/20 transition-all group animate-in fade-in slide-in-from-right-8 duration-1000 delay-1000"
        >
          <div className="w-8 h-8 rounded-full bg-[#c5a059] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 text-[#0f1a15] fill-[#0f1a15]" />
          </div>
          <span className="hidden md:inline ml-3 text-[10px] uppercase tracking-[0.2em] font-bold">Experience</span>
        </button>

        <div className="relative text-center px-4 max-w-4xl drop-shadow-2xl">
          <span className="text-[#c5a059] uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Kauwanty, Idukki, Kerala
          </span>
          <h1 className="text-5xl md:text-8xl text-white font-serif mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 drop-shadow-lg">
            The Cardamom Cove
          </h1>
          <p className="text-[#f2f1ec] text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed italic opacity-90 animate-in fade-in duration-1000 delay-700 drop-shadow-md">
            "A sanctuary where luxury meets nature in the heart of the Western Ghats."
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 animate-in fade-in duration-1000 delay-1000">
            <button
              onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#c5a059] text-[#0f1a15] px-12 py-4 rounded-sm font-bold tracking-[0.2em] text-xs uppercase hover:bg-white transition-all w-full sm:w-auto shadow-lg hover:-translate-y-1"
            >
              Explore Rooms
            </button>
            <Link to="/gallery" className="text-white border-b border-white/40 py-2 px-4 hover:border-[#c5a059] hover:text-[#c5a059] transition-all font-bold tracking-[0.2em] text-xs uppercase group">
              The Gallery
              <ChevronRight className="inline-block ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#c5a059] to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="relative reveal-left">
              <img
                src="/images/sanctuary-img.jpg"
                alt="Idukki Landscape"
                className="w-full h-[650px] object-cover rounded-sm shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-10 -right-10 bg-[#1a2e25] text-white p-12 hidden lg:block max-w-sm z-20 shadow-2xl reveal-scale delay-300">
                <h3 className="font-serif text-3xl mb-4 text-[#c5a059]">A Sanctuary in Idukki</h3>
                <p className="font-light text-stone-300 text-sm leading-relaxed">Located in Kauwanty, surrounded by the lush greenery of a cardamom estate with stunning views of the Western Ghats and Idukki Reservoir.</p>
              </div>
            </div>
            <div className="space-y-10 reveal">
              <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">Architecture & Nature</span>
              <h2 className="text-4xl md:text-6xl font-serif leading-tight text-[#1a2e25]">Elegance Rooted in the Soil</h2>
              <p className="text-stone-600 text-lg leading-relaxed font-light">
                At The Cardamom Cove, we offer a unique retreat where the cool highland climate meets unparalleled hospitality. Every corner is designed to honor the tranquil waters and emerald forests that surround us.
              </p>
              <div className="grid grid-cols-2 gap-10 pt-6">
                <div className="flex flex-col space-y-4 reveal delay-100">
                  <Trees className="w-10 h-10 text-[#2d4a3e] stroke-1" />
                  <h4 className="font-serif text-2xl text-[#1a2e25]">Cardamom Estate</h4>
                  <p className="text-sm text-stone-500 font-light">Live inside a working aromatic plantation.</p>
                </div>
                <div className="flex flex-col space-y-4 reveal delay-200">
                  <Heart className="w-10 h-10 text-[#2d4a3e] stroke-1" />
                  <h4 className="font-serif text-2xl text-[#1a2e25]">Breathtaking Views</h4>
                  <p className="text-sm text-stone-500 font-light">Western Ghats and Idukki Reservoir vistas.</p>
                </div>
              </div>
              <ul className="space-y-4 pt-6">
                <li className="flex items-center space-x-3 text-[#1a2e25] text-sm">
                  <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full"></div>
                  <span>3 Exclusive Luxury Rooms</span>
                </li>
                <li className="flex items-center space-x-3 text-[#1a2e25] text-sm">
                  <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full"></div>
                  <span>Mini Kitchen in Every Room</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Rooms Grid */}
      <section id="rooms" className="py-32 bg-[#f2f1ec]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4 reveal">
            <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">The Sanctuaries</span>
            <h2 className="text-4xl md:text-6xl font-serif text-[#1a2e25]">Private Living</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {rooms.map((room, idx) => (
              <div
                key={idx}
                className={`bg-white group overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 reveal`}

                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                <div className="h-96 overflow-hidden relative">
                  <img
                    src={room.img}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-[#0f1a15]/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0f1a15]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[#c5a059] text-xs font-bold tracking-widest uppercase">{room.features}</span>
                  </div>
                </div>
                <div className="p-10 space-y-5">
                  <h3 className="text-3xl font-serif text-[#1a2e25]">{room.name}</h3>
                  <p className="text-stone-500 font-light leading-relaxed text-sm">{room.description}</p>
                  <Link to={`/room/${room.id}`} className="inline-flex pt-6 text-[#1a2e25] font-bold items-center space-x-3 group/btn hover:text-[#c5a059] transition-colors uppercase tracking-[0.2em] text-[10px]">
                    Explore Space
                    <ChevronRight className="w-4 h-4 text-[#c5a059] group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Full Property Inauguration offer */}
          <div className="mt-24 bg-[#1a2e25] p-12 md:p-20 relative overflow-hidden reveal">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Trees className="w-64 h-64 text-[#c5a059]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-3 text-[#c5a059]">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Inauguration Bonus</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                  Exclusive Full-Property Retreat for <span className="text-[#c5a059]">₹35,000</span>
                </h3>
                <p className="text-stone-400 font-light leading-relaxed">
                  Experience the ultimate privacy by booking all three sanctuaries for your group. Enjoy exclusive access to the entire Cardamom Cove estate at a special introductory rate.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 pt-4">
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-[#c5a059] text-[#0f1a15] px-10 py-4 rounded-sm font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-white transition-all shadow-lg"
                  >
                    Reserve Full Property
                  </button>
                  <div className="flex flex-col">
                    <span className="text-stone-500 line-through text-sm">Standard Rate: ₹40,000</span>
                    <span className="text-[#c5a059] text-xs font-bold uppercase tracking-widest mt-1">Limited Time Offer</span>
                  </div>
                </div>
              </div>
              <div className="relative h-80 md:h-full min-h-[300px]">
                <img
                  src="/images/retreat_view.png"
                  alt="Full Villa View"
                  className="w-full h-full object-cover rounded-sm opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1a2e25]/60 md:to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Amenities Banner */}
      <section className="py-24 bg-[#0f1a15] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { Icon: Flame, title: "Campfire", sub: "Under the stars" },
              { Icon: Coffee, title: "Mini Kitchen", sub: "Private Convenience" },
              { Icon: Car, title: "Ample Parking", sub: "Safe & Spacious" },
              { Icon: Wind, title: "Highland Air", sub: "Western Ghats" }
            ].map((item, i) => (
              <div key={i} className="space-y-6 reveal-scale" style={{ transitionDelay: `${i * 150}ms` }}>
                <item.Icon className="w-12 h-12 mx-auto text-[#c5a059] stroke-1" />
                <h5 className="font-serif text-2xl">{item.title}</h5>
                <p className="text-stone-500 text-[10px] uppercase tracking-[0.3em]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="reveal-left">
              <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">Connect With Us</span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#1a2e25] mt-4 mb-8">Plan Your Stay</h2>
              <p className="text-stone-600 font-light mb-12">Reach out to us for bookings or inquiries. We’re here to make your stay in Idukki unforgettable.</p>

              <div className="space-y-8">
                <div className="flex items-center space-x-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-[#c5a059] group-hover:bg-[#1a2e25] group-hover:text-white transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Call Us</p>
                    <p className="text-[#1a2e25] font-semibold">+91 6235 62 6334</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-[#c5a059] group-hover:bg-[#1a2e25] group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Email Us</p>
                    <p className="text-[#1a2e25] font-semibold">info@thecardamomcove.in</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-[#c5a059] group-hover:bg-[#1a2e25] group-hover:text-white transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Location</p>
                    <p className="text-[#1a2e25] font-semibold">Kauwanty, Idukki, Kerala</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 shadow-2xl reveal-right">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

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
        <div className="absolute bottom-12 left-12 bg-[#1a2e25] text-white p-8 max-w-xs shadow-2xl">
          <h4 className="font-serif text-2xl mb-4">Find Us</h4>
          <p className="text-stone-400 text-xs font-light mb-6">Kauwanty, Idukki, Kerala. Open Google Maps for turn-by-turn navigation.</p>
          <a href="https://www.google.com/maps?q=9.8071547,77.0399898" target="_blank" rel="noreferrer" className="text-[#c5a059] text-[10px] uppercase tracking-widest font-bold border-b border-[#c5a059] pb-1">
            Open in Google Maps
          </a>
        </div>
      </section>

      {/* Booking Open Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0f1a15]/40 backdrop-blur-sm animate-in fade-in duration-700">
          <div className="max-w-xl w-full bg-[#faf9f6]/95 backdrop-blur-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-[#c5a059]/20 p-12 relative overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-700">
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trees className="w-32 h-32 text-[#c5a059]" />
            </div>

            <button
              onClick={closePopup}
              className="absolute top-6 right-6 text-stone-400 hover:text-[#c5a059] transition-colors"
            >
              <X className="w-6 h-6 stroke-1" />
            </button>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center space-x-3 text-[#c5a059]">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Bookings Now Open</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif text-[#1a2e25] leading-tight">
                  Your Stay in the Cove <span className="italic">Awaits</span>
                </h2>
                <div className="w-16 h-[1px] bg-[#c5a059]"></div>
              </div>

              <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                <p>
                  We are thrilled to announce that The Cardamom Cove is now accepting reservations. Secure your retreat in the heart of the Western Ghats.
                </p>
                <div className="p-4 bg-emerald-50/50 border border-[#c5a059]/10 rounded-sm">
                  <p className="text-[#1a2e25] font-serif text-lg mb-1">Inauguration Bonus</p>
                  <p className="text-xs text-stone-500 italic">Full Property Booking at ₹35,000 for a limited time.</p>
                </div>
                <a
                  href="tel:+91 6235 62 6334"
                  className="flex items-center space-x-4 bg-[#1a2e25] text-white px-6 py-4 group hover:bg-[#c5a059] transition-all"
                >
                  <Phone className="w-5 h-5 text-[#c5a059] group-hover:text-white transition-colors flex-shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 group-hover:text-white/70 transition-colors">Call to Book</p>
                    <p className="font-semibold tracking-wider text-lg">+91 6235 62 6334</p>
                  </div>
                </a>
              </div>

              <div className="space-y-3">
                <button
                  onClick={openBookingForm}
                  className="w-full bg-[#c5a059] text-[#0f1a15] py-5 font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-[#1a2e25] hover:text-white transition-all"
                >
                  Book a Room
                </button>
                <button
                  onClick={closePopup}
                  className="w-full bg-transparent text-stone-400 py-2 font-bold tracking-[0.3em] text-[10px] uppercase hover:text-[#1a2e25] transition-all"
                >
                  Explore the Cove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Fullscreen Video Player */}
      {isPlayerOpen && (
        <div className="fixed inset-0 z-[200] bg-[#000000] backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-500">
          <button
            onClick={() => setIsPlayerOpen(false)}
            className="absolute top-6 right-6 md:top-10 md:right-10 z-[210] text-white/50 hover:text-white transition-colors p-3 bg-white/10 rounded-full hover:bg-white/20"
            aria-label="Close video"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="w-full max-w-6xl aspect-video relative shadow-2xl animate-in zoom-in duration-500 px-4 md:px-0">
            <iframe
              src="https://www.youtube.com/embed/qV1gT4EQlO4?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen"
              title="Cardamom Cove Experience"
            ></iframe>
          </div>

          <p className="mt-8 text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium hidden md:block">
            Esc to close • Cinematic Experience
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;

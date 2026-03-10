import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Maximize2, X, ChevronRight, Wind, Coffee, Flame, CheckCircle2, ArrowLeft, ArrowRight, AirVent, Bed, ChevronLeft } from 'lucide-react';
import BookingModal from '../components/BookingModal';

// Hardcoded data for the 3 rooms
const ROOM_DATA: Record<string, any> = {
    emerald: {
        name: "The Emerald Suite",
        subtitle: "A sophisticated sanctuary offering refined luxury",
        description: "Experience the pinnacle of luxury in our Premier Suite. Nestled amidst the cardamom plantation, the Emerald Suite features expansive windows that frame the breathtaking Western Ghats. A plush king-sized bed, elegantly appointed interiors, and a private balcony seamlessly blend indoor comfort with nature's grandeur.",
        heroImage: "/images/emerald/emerald-1.png",

        features: [
            { icon: Coffee, text: "Mini Kitchen" },
            { icon: Wind, text: "Highland Breeze Balcony" },
            { icon: CheckCircle2, text: "King-sized Bed" },
            { icon: CheckCircle2, text: "En-suite Luxury Bath" },
            { icon: AirVent, text: "Air Conditioning" },
            { icon: Flame, text: "Fire Place" },

        ]
    },
    canopy: {
        name: "The Canopy Loft",
        subtitle: "Elevated comfort amidst the trees",
        description: "An architectural marvel featuring a spacious mezzanine floor. The Canopy Loft split-level design ensures ample space, making it perfect for families or small groups. Wake up to the sound of birds and step out onto your elevated deck to take in the serene surroundings.",
        heroImage: "/images/canopy/canopy-1.png",

        features: [
            { icon: Coffee, text: "Mini Kitchen" },
            { icon: Flame, text: "Cozy Mezzanine" },
            { icon: Bed, text: "1 King Bed" },
            { icon: Bed, text: "1 Twin Bed" },
            { icon: CheckCircle2, text: "Valley View Deck" },
            { icon: AirVent, text: "Air Conditioning" },
        ],

    },
    mist: {
        name: "The Mist Retreat",
        subtitle: "A cozy hideaway for two",
        description: "Designed for intimate getaways, the Mist Retreat offers a snug and warming atmosphere. Perfect for couples or solo travelers, this twin-sharing haven is enveloped by the estate's natural beauty, providing an authentic escape from the hustle and bustle.",
        heroImage: "/images/mist/mist-1.png",
        features: [
            { icon: Wind, text: "Mist-covered Mornings" },
            { icon: CheckCircle2, text: "2 Twin Beds" },
            { icon: CheckCircle2, text: "Attached Bath" },
            { icon: CheckCircle2, text: "Plantation Access" }
        ]
    }
};

const RoomDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [roomImages, setRoomImages] = useState<any[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchImages = async () => {
            try {
                const response = await fetch('/api/images');
                if (response.ok) {
                    const allImages = await response.json();
                    const tagged = allImages.filter((img: any) => img.roomTag === id);
                    if (tagged.length > 0) {
                        setRoomImages(tagged);
                    } else {
                        setRoomImages([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching room images:', error);
            }
        };

        fetchImages();
    }, [id]);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // using -1 to account for any decimal pixel rounding issues
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [roomImages]);

    const scrollGallery = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            // setTimeout to check scroll after the smooth scroll animation finishes
            setTimeout(checkScroll, 300);
        }
    };

    if (!id || !ROOM_DATA[id]) {
        return <Navigate to="/" />;
    }

    const room = ROOM_DATA[id];

    // Helper to get adjacent rooms for prev/next navigation
    const roomKeys = Object.keys(ROOM_DATA);
    const currentIndex = roomKeys.indexOf(id);
    const nextRoomId = roomKeys[(currentIndex + 1) % roomKeys.length];
    const prevRoomId = roomKeys[(currentIndex - 1 + roomKeys.length) % roomKeys.length];

    return (
        <div className="bg-[#faf9f6] min-h-screen">
            {/* Hero Header */}
            <section className="relative h-[70vh] w-full bg-[#1a2e25] flex items-end">
                <div className="absolute inset-0 z-0">
                    <img
                        src={room.heroImage}
                        alt={room.name}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a15] to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <Link to="/" className="inline-flex items-center text-[#c5a059] text-[10px] uppercase font-bold tracking-[0.2em] mb-6 hover:text-white transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">{room.name}</h1>
                    <p className="text-stone-300 tracking-[0.2em] uppercase text-xs font-bold max-w-2xl">{room.subtitle}</p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Main Description */}
                    <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        <div>
                            <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">The Experience</span>
                            <h2 className="text-3xl font-serif text-[#1a2e25] mt-4 mb-6">About the Space</h2>
                            <p className="text-stone-600 font-light leading-relaxed text-lg">
                                {room.description}
                            </p>
                        </div>

                        <div className="border-t border-stone-200 pt-12">
                            <h3 className="text-xl font-serif text-[#1a2e25] mb-8">Room Features</h3>
                            <div className="grid grid-cols-2 gap-8">
                                {room.features.map((feature: any, idx: number) => (
                                    <div key={idx} className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#c5a059]">
                                            <feature.icon className="w-5 h-5 stroke-1" />
                                        </div>
                                        <span className="text-stone-600 font-medium text-sm">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Sticky Booking panel */}
                    <div className="lg:col-span-1 relative">
                        <div className="sticky top-32 bg-white p-8 shadow-xl border border-stone-100 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">

                            <button
                                onClick={() => window.dispatchEvent(new Event('openBookingModal'))}
                                className="w-full bg-[#1a2e25] text-white py-4 rounded-sm font-bold tracking-[0.2em] text-xs uppercase hover:bg-[#c5a059] transition-colors mb-6"
                            >
                                Reserve This Room
                            </button>

                            <p className="text-[10px] text-stone-400 text-center uppercase tracking-wider leading-relaxed">
                                Includes complimentary breakfast and plantation walk.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Gallery Section */}
            {roomImages.length > 0 && (
                <section className="py-24 bg-white border-t border-stone-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-16 relative">
                            <div className="text-left">
                                <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">Visuals</span>
                                <h2 className="text-3xl font-serif text-[#1a2e25] mt-4 mb-0">{room.name} Gallery</h2>
                            </div>
                        </div>

                        <div className="relative group/carousel">
                            <button
                                onClick={() => scrollGallery('left')}
                                className={`absolute left-2 md:left-4 top-[calc(50%-1rem)] -translate-y-1/2 z-20 w-10 md:w-12 h-10 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#c5a059] hover:border-[#c5a059] transition-all duration-300 ${canScrollLeft
                                    ? 'opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 translate-x-0'
                                    : 'opacity-0 -translate-x-4 pointer-events-none'
                                    }`}
                            >
                                <ChevronLeft className="w-5 md:w-6 h-5 md:h-6" />
                            </button>

                            <button
                                onClick={() => scrollGallery('right')}
                                className={`absolute right-2 md:right-4 top-[calc(50%-1rem)] -translate-y-1/2 z-20 w-10 md:w-12 h-10 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#c5a059] hover:border-[#c5a059] transition-all duration-300 ${canScrollRight
                                    ? 'opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 translate-x-0'
                                    : 'opacity-0 translate-x-4 pointer-events-none'
                                    }`}
                            >
                                <ChevronRight className="w-5 md:w-6 h-5 md:h-6" />
                            </button>

                            <div
                                className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 md:px-0"
                                ref={scrollContainerRef}
                                onScroll={checkScroll}
                            >
                                {roomImages.map((img: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="relative group cursor-pointer overflow-hidden rounded-sm shadow-lg border border-stone-100 flex-shrink-0 w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-[25vw] snap-center aspect-[3/4]"
                                        onClick={() => setSelectedImage(img.url)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent z-0"></div>
                                        <img
                                            src={img.url}
                                            alt={img.title || `Gallery ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-[#0f1a15]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                                <Maximize2 className="text-white w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Prev / Next Room Navigation */}
            <section className="border-t border-stone-100 bg-[#faf9f6] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-8 sm:space-y-0">
                    <Link to={`/room/${prevRoomId}`} className="group flex items-center space-x-4 text-left w-full sm:w-auto hover:bg-stone-100 p-4 rounded-lg transition-colors">
                        <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#c5a059] group-hover:border-[#c5a059] transition-colors flex-shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">Previous Room</p>
                            <p className="font-serif text-lg text-[#1a2e25] group-hover:text-[#c5a059] transition-colors">{ROOM_DATA[prevRoomId].name}</p>
                        </div>
                    </Link>

                    <Link to={`/room/${nextRoomId}`} className="group flex items-center justify-end space-x-4 text-right w-full sm:w-auto hover:bg-stone-100 p-4 rounded-lg transition-colors">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">Next Room</p>
                            <p className="font-serif text-lg text-[#1a2e25] group-hover:text-[#c5a059] transition-colors">{ROOM_DATA[nextRoomId].name}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#c5a059] group-hover:border-[#c5a059] transition-colors flex-shrink-0">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>
            </section>

            {/* Lightbox for Gallery */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-[#0f1a15]/98 flex items-center justify-center p-4 sm:p-20 animate-in fade-in duration-500 backdrop-blur-md"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-8 right-8 text-white hover:text-[#c5a059] transition-colors bg-white/5 p-3 rounded-full hover:bg-white/10"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-8 h-8 stroke-1" />
                    </button>
                    <img
                        src={selectedImage}
                        className="max-w-full max-h-[85vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-stone-800 animate-in zoom-in duration-500"
                        alt="Enlarged"
                    />
                </div>
            )}
        </div>
    );
};

export default RoomDetails;

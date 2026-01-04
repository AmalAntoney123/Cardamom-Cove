
import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../types';
import { Maximize2, X, Sparkles, Leaf } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'exterior' | 'interior' | 'dining' | 'nature'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const { addToReveal } = useReveal();


  useEffect(() => {
    const fetchCustomImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (response.ok) {
          const customImages = await response.json();

          // Map MongoDB _id to id for frontend compatibility
          const formattedCustom = customImages.map((img: any) => ({
            ...img,
            id: img._id
          }));
          setAllImages(formattedCustom);
        } else {
          setAllImages([]);
        }
      } catch (error) {
        console.error('Error fetching custom images:', error);
        setAllImages([]);
      }
    };

    fetchCustomImages();
  }, []);

  const filteredImages = filter === 'all'
    ? allImages
    : allImages.filter(img => img.category === filter);

  const filterButtons = [
    { label: 'All', value: 'all', color: 'bg-emerald-800' },
    { label: 'Architecture', value: 'exterior', color: 'bg-amber-700' },
    { label: 'Rooms', value: 'interior', color: 'bg-stone-700' },
    { label: 'Culinary', value: 'dining', color: 'bg-red-900' },
    { label: 'Estate', value: 'nature', color: 'bg-green-900' },
  ];

  return (
    <div className="pt-40 pb-32 min-h-screen relative overflow-hidden bg-[#faf9f6]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] -z-10 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-50 rounded-full blur-[120px] -z-10 opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-6 mb-20 reveal" ref={addToReveal}>
          <div className="flex justify-center mb-4">
            <Leaf className="text-emerald-800/20 w-12 h-12" />
          </div>
          <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">The Visual Archive</span>
          <h1 className="text-4xl md:text-7xl font-serif text-[#1a2e25] drop-shadow-sm">Immersive Views</h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mt-4"></div>
          <p className="text-stone-500 font-light max-w-xl mx-auto text-lg leading-relaxed italic">
            Capturing the serenity of Kauwanty, from the cardamom fields to the Idukki Reservoir.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 reveal" ref={addToReveal}>
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value as any)}
              className={`group relative px-8 py-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-all overflow-hidden rounded-full shadow-sm hover:shadow-md ${filter === btn.value
                ? 'text-white'
                : 'text-stone-500 bg-white hover:text-stone-800'
                }`}
            >
              <div className={`absolute inset-0 transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100 ${btn.color} opacity-10`}></div>
              <div className={`absolute inset-0 transition-transform duration-500 origin-left ${filter === btn.value ? 'scale-x-100' : 'scale-x-0'} ${btn.color}`}></div>
              <span className="relative z-10">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="relative group cursor-pointer overflow-hidden rounded-sm break-inside-avoid shadow-lg reveal-scale border border-stone-100"
              ref={addToReveal}
              onClick={() => setSelectedImage(img.url)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent z-0"></div>
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0f1a15]/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-10 backdrop-blur-[2px]">
                <div className="absolute top-4 left-4 bg-[#c5a059] p-2 rounded-full shadow-lg">
                  <Sparkles className="text-white w-4 h-4" />
                </div>
                <p className="text-white font-serif text-2xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.title}</p>
                <div className="w-12 h-[2px] bg-[#c5a059] mb-4 opacity-0 group-hover:opacity-100 transition-all delay-200"></div>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all delay-300">
                  <p className="text-[#c5a059] text-[9px] uppercase tracking-[0.3em] font-bold">{img.category}</p>
                  <div className="bg-white/10 p-2 rounded-full">
                    <Maximize2 className="text-white w-4 h-4 stroke-1 hover:scale-125 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-[#0f1a15]/98 flex items-center justify-center p-4 sm:p-20 animate-in fade-in duration-500 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-amber-900/20 pointer-events-none"></div>
          <button
            className="absolute top-8 right-8 text-white hover:text-[#c5a059] transition-all bg-white/5 p-3 rounded-full hover:bg-white/10 border border-white/10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8 stroke-1" />
          </button>
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#c5a059]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={selectedImage}
              className="max-w-full max-h-[85vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-stone-800 relative z-10 animate-in zoom-in duration-500"
              alt="Enlarged"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;


import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { GalleryImage } from '../types';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    category: 'exterior' as const
  });

  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setIsLoggedIn(true);

    const fetchCustomImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (response.ok) {
          const images = await response.json();
          // Map MongoDB _id to id
          setUploadedImages(images.map((img: any) => ({ ...img, id: img._id })));
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (token) fetchCustomImages();
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('admin_token', token);
        setIsLoggedIn(true);
        setError('');
      } else {
        setError('Invalid credentials for the curator portal.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_token');
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newImage)
      });

      if (response.ok) {
        const addedImage = await response.json();
        setUploadedImages([{ ...addedImage, id: addedImage._id }, ...uploadedImages]);
        setNewImage({ url: '', title: '', category: 'exterior' });
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Error adding image:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUploadedImages(uploadedImages.filter(img => img.id !== id));
      }
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f1a15] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#faf9f6] p-12 shadow-2xl rounded-sm animate-in fade-in zoom-in duration-700">
          <div className="text-center mb-10">
            <Lock className="w-10 h-10 text-[#c5a059] mx-auto mb-4 stroke-1" />
            <h1 className="font-serif text-3xl text-[#1a2e25]">Curator Portal</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mt-2">Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:ring-1 focus:ring-[#c5a059] outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:ring-1 focus:ring-[#c5a059] outline-none transition-all"
              />
            </div>
            {error && <p className="text-red-800 text-[10px] uppercase tracking-wider text-center">{error}</p>}
            <button className="w-full bg-[#1a2e25] text-white py-4 font-bold tracking-[0.3em] text-xs uppercase hover:bg-[#c5a059] transition-all">
              Authorize
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-[#faf9f6] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">Cove Management</span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#1a2e25] mt-2">Gallery Curator</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-stone-400 hover:text-red-800 transition-colors uppercase tracking-widest text-[10px] font-bold"
          >
            <span>Exit Portal</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 shadow-xl sticky top-32">
              <h2 className="font-serif text-2xl mb-8 flex items-center space-x-3">
                <Plus className="w-5 h-5 text-[#c5a059]" />
                <span>Add To Archive</span>
              </h2>

              <form onSubmit={handleAddImage} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400">Image URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newImage.url}
                    onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    className="w-full bg-[#faf9f6] border-none px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#c5a059]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400">Image Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sunset over Idukki"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    className="w-full bg-[#faf9f6] border-none px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#c5a059]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400">Category</label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value as any })}
                    className="w-full bg-[#faf9f6] border-none px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#c5a059] uppercase tracking-widest"
                  >
                    <option value="exterior">Architecture</option>
                    <option value="interior">Rooms</option>
                    <option value="dining">Culinary</option>
                    <option value="nature">Estate</option>
                  </select>
                </div>

                <button className="w-full bg-[#1a2e25] text-white py-4 font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-[#c5a059] transition-all flex items-center justify-center space-x-2">
                  {status === 'success' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added to Gallery</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Update Gallery</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Manage List */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl mb-8 flex items-center space-x-3">
              <ImageIcon className="w-5 h-5 text-[#c5a059]" />
              <span>Custom Collection</span>
            </h2>

            {uploadedImages.length === 0 ? (
              <div className="bg-white p-20 text-center border-2 border-dashed border-stone-200">
                <p className="text-stone-400 italic text-sm">No custom images added yet. Your archive is currently utilizing the core collection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="bg-white p-4 shadow-md group relative">
                    <div className="h-48 overflow-hidden mb-4">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif text-lg text-[#1a2e25]">{img.title}</h4>
                        <p className="text-[9px] uppercase tracking-widest text-[#c5a059]">{img.category}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="text-stone-300 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

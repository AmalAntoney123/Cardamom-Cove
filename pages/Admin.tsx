
import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, Image as ImageIcon, CheckCircle2, CalendarDays, Phone, Mail, ChevronDown } from 'lucide-react';
import { GalleryImage } from '../types';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'gallery' | 'bookings'>('gallery');

  // ── Bookings state ──
  const [bookings, setBookings] = useState<any[]>([]);
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    setIsFetchingBookings(true);
    try {
      const res = await fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setBookings(await res.json());
    } catch (e) { console.error(e); }
    finally { setIsFetchingBookings(false); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const token = localStorage.getItem('admin_token');
    setUpdatingBookingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(prev => prev.map(b => b._id === id ? updated : b));
      }
    } catch (e) { console.error(e); }
    finally { setUpdatingBookingId(null); }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Remove this booking enquiry?')) return;
    const token = localStorage.getItem('admin_token');
    setDeletingBookingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setBookings(prev => prev.filter(b => b._id !== id));
    } catch (e) { console.error(e); }
    finally { setDeletingBookingId(null); }
  };

  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    category: 'exterior' as const
  });

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');

  // Search, Filter, Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    url: '',
    title: '',
    category: 'exterior' as const
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setIsLoggedIn(true);

    const fetchCustomImages = async () => {
      setIsFetching(true);
      try {
        const response = await fetch('/api/images');
        if (response.ok) {
          const images = await response.json();
          setUploadedImages(images.map((img: any) => ({ ...img, id: img._id })));
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsFetching(false);
      }
    };

    if (token) {
      fetchCustomImages();
      fetchBookings();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
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
      } else {
        setError('Invalid credentials for the curator portal.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_token');
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    setIsAdding(true);

    try {
      let body;
      if (bulkMode) {
        const urls = bulkUrls.split('\n').filter(url => url.trim() !== '');
        body = urls.map(url => ({
          url: url.trim(),
          title: 'Untitled Archive',
          category: 'nature'
        }));
      } else {
        body = newImage;
      }

      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const added = await response.json();
        const newItems = Array.isArray(added)
          ? added.map((img: any) => ({ ...img, id: img._id }))
          : [{ ...added, id: added._id }];

        setUploadedImages([...newItems, ...uploadedImages]);
        setNewImage({ url: '', title: '', category: 'exterior' });
        setBulkUrls('');
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Error adding image:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updated = await response.json();
        setUploadedImages(uploadedImages.map(img =>
          img.id === id ? { ...updated, id: updated._id } : img
        ));
        setEditingId(null);
      }
    } catch (err) {
      console.error('Error updating image:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this from the archive?')) return;

    const token = localStorage.getItem('admin_token');
    setDeletingId(id);
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
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (img: GalleryImage) => {
    setEditingId(img.id);
    setEditForm({
      url: img.url,
      title: img.title,
      category: img.category as any
    });
  };

  const getTagColor = (cat: string) => {
    switch (cat) {
      case 'exterior': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'interior': return 'bg-stone-100 text-stone-800 border-stone-200';
      case 'dining': return 'bg-red-50 text-red-800 border-red-100';
      case 'nature': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const filteredAndSortedImages = uploadedImages
    .filter(img => {
      const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || img.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      const dateA = new Date((a as any).createdAt || 0).getTime();
      const dateB = new Date((b as any).createdAt || 0).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

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
            <button
              disabled={isLoggingIn}
              className="w-full bg-[#1a2e25] text-white py-4 font-bold tracking-[0.3em] text-xs uppercase hover:bg-[#c5a059] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <span>Authorize</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-[#faf9f6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 space-y-4 md:space-y-0">
          <div>
            <span className="text-[#c5a059] uppercase tracking-[0.3em] font-bold text-[10px]">Cove Management</span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#1a2e25] mt-2">Curator Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-stone-400 hover:text-red-800 transition-colors uppercase tracking-widest text-[10px] font-bold"
          >
            <span>Exit Portal</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex space-x-1 mb-12 border-b border-stone-200">
          {(['gallery', 'bookings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all border-b-2 -mb-px ${activeTab === tab ? 'border-[#c5a059] text-[#1a2e25]' : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
            >
              {tab === 'gallery' ? 'Gallery Archive' : `Bookings${bookings.length ? ` (${bookings.length})` : ''}`}
            </button>
          ))}
        </div>

        {activeTab === 'gallery' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Upload Form */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 shadow-xl sticky top-32">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl flex items-center space-x-3">
                    <Plus className="w-5 h-5 text-[#c5a059]" />
                    <span>{bulkMode ? 'Bulk Archive' : 'Add To Archive'}</span>
                  </h2>
                  <button
                    onClick={() => setBulkMode(!bulkMode)}
                    className="text-[9px] uppercase tracking-widest font-bold text-[#c5a059] border-b border-[#c5a059]/30 pb-1"
                  >
                    {bulkMode ? 'Single Mode' : 'Bulk Mode'}
                  </button>
                </div>

                <form onSubmit={handleAddImage} className="space-y-6">
                  {bulkMode ? (
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400">Image URLs (One per line)</label>
                      <textarea
                        required
                        rows={8}
                        placeholder="https://images.unsplash.com/url1&#10;https://images.unsplash.com/url2"
                        value={bulkUrls}
                        onChange={(e) => setBulkUrls(e.target.value)}
                        className="w-full bg-[#faf9f6] border-none px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#c5a059] resize-none font-mono"
                      />
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}

                  <button
                    disabled={isAdding}
                    className="w-full bg-[#1a2e25] text-white py-4 font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-[#c5a059] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Archive Updated</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{bulkMode ? 'Add Bulk Collection' : 'Update Gallery'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Manage List */}
            <div className="lg:col-span-8">
              <div className="flex flex-col space-y-6 mb-8">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="w-5 h-5 text-[#c5a059]" />
                  <h2 className="font-serif text-2xl">Collection Archive</h2>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2 relative">
                    <input
                      type="text"
                      placeholder="SEARCH ARCHIVE..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-4 py-2 text-[10px] tracking-widest outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-white border border-stone-200 px-4 py-2 text-[10px] tracking-widest uppercase outline-none focus:border-[#c5a059]"
                  >
                    <option value="all">All Categories</option>
                    <option value="exterior">Architecture</option>
                    <option value="interior">Rooms</option>
                    <option value="dining">Culinary</option>
                    <option value="nature">Estate</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-stone-200 px-4 py-2 text-[10px] tracking-widest uppercase outline-none focus:border-[#c5a059]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Alphabetical</option>
                  </select>
                </div>
              </div>

              {isFetching ? (
                <div className="bg-white p-20 text-center border border-stone-100 flex flex-col items-center justify-center space-y-4">
                  <div className="w-8 h-8 border-2 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
                  <p className="text-[#c5a059] uppercase tracking-[0.2em] text-[10px] font-bold">Synchronizing Archive...</p>
                </div>
              ) : filteredAndSortedImages.length === 0 ? (
                <div className="bg-white p-20 text-center border-2 border-dashed border-stone-200">
                  <p className="text-stone-400 italic text-sm">No images match your current filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedImages.map((img) => (
                    <div key={img.id} className="bg-white p-4 shadow-sm group border border-stone-100 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 relative">
                      <div className="w-full sm:w-32 h-24 flex-shrink-0 overflow-hidden bg-stone-100">
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-grow flex flex-col justify-center">
                        {editingId === img.id ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              className="text-sm bg-stone-50 border-b border-[#c5a059] px-2 py-1 outline-none"
                            />
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                              className="text-[10px] uppercase font-bold bg-stone-50 border-b border-[#c5a059] px-2 py-1 outline-none"
                            >
                              <option value="exterior">Architecture</option>
                              <option value="interior">Rooms</option>
                              <option value="dining">Culinary</option>
                              <option value="nature">Estate</option>
                            </select>
                            <input
                              type="text"
                              value={editForm.url}
                              onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                              className="sm:col-span-2 text-[10px] font-mono bg-stone-50 border-b border-[#c5a059] px-2 py-1 outline-none"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="font-serif text-xl text-[#1a2e25]">{img.title}</h4>
                              <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${getTagColor(img.category)}`}>
                                {img.category === 'exterior' ? 'Architecture' :
                                  img.category === 'interior' ? 'Rooms' :
                                    img.category === 'dining' ? 'Culinary' : 'Estate'}
                              </span>
                            </div>
                            <p className="text-stone-400 font-mono text-[9px] truncate max-w-md">{img.url}</p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 border-t sm:border-t-0 sm:border-l border-stone-100 pt-4 sm:pt-0 sm:pl-6">
                        {editingId === img.id ? (
                          <>
                            <button
                              disabled={isUpdating}
                              onClick={() => handleUpdate(img.id)}
                              className="text-emerald-700 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-2 hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                              {isUpdating ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-emerald-700/30 border-t-emerald-700 rounded-full animate-spin" />
                                  <span>Saving</span>
                                </>
                              ) : (
                                <span>Save</span>
                              )}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-stone-400 font-bold text-[10px] uppercase tracking-widest px-4 py-2 hover:text-stone-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(img)}
                              className="text-stone-400 hover:text-[#c5a059] font-bold text-[10px] uppercase tracking-widest transition-colors px-2"
                            >
                              Edit
                            </button>
                            <button
                              disabled={deletingId === img.id}
                              onClick={() => handleDelete(img.id)}
                              className="text-stone-300 hover:text-red-700 transition-colors p-2 disabled:opacity-50"
                            >
                              {deletingId === img.id ? (
                                <div className="w-4 h-4 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ───── Bookings Panel ───── */
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <CalendarDays className="w-5 h-5 text-[#c5a059]" />
                <h2 className="font-serif text-2xl text-[#1a2e25]">Booking Enquiries</h2>
              </div>
            </div>

            {isFetchingBookings ? (
              <div className="bg-white p-20 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
                <p className="text-[#c5a059] uppercase tracking-[0.2em] text-[10px] font-bold">Loading Enquiries...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white p-20 text-center border-2 border-dashed border-stone-200">
                <p className="text-stone-400 italic text-sm">No booking enquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-50 text-amber-800 border-amber-200',
                    confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    cancelled: 'bg-red-50 text-red-800 border-red-100',
                  };
                  const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                  return (
                    <div key={b._id} className="bg-white p-6 shadow-sm border border-stone-100 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-serif text-xl text-[#1a2e25]">{b.name}</h4>
                          <div className="flex flex-wrap gap-4 text-[11px] text-stone-500">
                            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{b.email}</span>
                            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{b.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="relative">
                            <select
                              value={b.status}
                              disabled={updatingBookingId === b._id}
                              onChange={e => handleStatusChange(b._id, e.target.value)}
                              className={`text-[9px] uppercase tracking-widest font-bold pl-3 pr-7 py-1.5 border rounded-full appearance-none outline-none cursor-pointer disabled:opacity-50 ${statusColors[b.status] || statusColors.pending}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                          </div>
                          <button
                            disabled={deletingBookingId === b._id}
                            onClick={() => handleDeleteBooking(b._id)}
                            className="text-stone-300 hover:text-red-700 transition-colors p-1.5 disabled:opacity-50"
                          >
                            {deletingBookingId === b._id
                              ? <div className="w-4 h-4 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin" />
                              : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-8 text-[11px]">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">Check-in</p>
                          <p className="font-semibold text-[#1a2e25]">{fmt(b.checkIn)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">Check-out</p>
                          <p className="font-semibold text-[#1a2e25]">{fmt(b.checkOut)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">Received</p>
                          <p className="text-stone-500">{fmt(b.createdAt)}</p>
                        </div>
                      </div>

                      {b.message && (
                        <p className="text-stone-500 text-sm font-light border-t border-stone-100 pt-4 italic">“{b.message}”</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

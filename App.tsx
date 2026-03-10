
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import RoomDetails from './pages/RoomDetails';
import Admin from './pages/Admin';
import { useReveal } from './hooks/useReveal';
import BookingModal from './components/BookingModal';

const App: React.FC = () => {
  useReveal();

  return (
    <Router>
      <div className="flex flex-col min-h-screen selection:bg-emerald-900 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/admin-portal" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <BookingModal />
      </div>
    </Router>
  );
};

export default App;

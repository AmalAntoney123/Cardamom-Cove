
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Palmtree } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Rooms', path: '/#rooms' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.includes('#')) {
      const id = path.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#faf9f6] shadow-sm py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Palmtree className={`w-8 h-8 ${scrolled ? 'text-[#1a2e25]' : 'text-white'}`} />
            <span className={`text-2xl font-serif tracking-widest ${scrolled ? 'text-[#1a2e25]' : 'text-white'}`}>
              CARDAMOM COVE
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.path.substring(1)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.path);
                  }}
                  className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-300 cursor-pointer ${
                    scrolled 
                      ? 'text-[#1a2e25] hover:text-[#c5a059]' 
                      : 'text-white hover:text-[#c5a059]'
                  }`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
                    scrolled 
                      ? 'text-[#1a2e25] hover:text-[#c5a059]' 
                      : 'text-white hover:text-[#c5a059]'
                  } ${location.pathname === link.path ? 'border-b border-[#c5a059]' : ''}`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <button className={`px-6 py-2 rounded-sm transition-all duration-300 uppercase tracking-widest text-[10px] font-bold border ${
              scrolled 
                ? 'bg-[#1a2e25] text-white border-[#1a2e25] hover:bg-[#c5a059] hover:border-[#c5a059]' 
                : 'bg-transparent text-white border-white hover:bg-white hover:text-[#1a2e25]'
            }`}>
              Reserve
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${scrolled ? 'text-[#1a2e25]' : 'text-white'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-[#faf9f6] transition-all duration-300 shadow-xl border-t border-stone-100 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => handleNavClick(link.path)}
              className="block px-3 py-4 text-xs font-bold tracking-widest text-[#1a2e25] hover:bg-[#f2f1ec] uppercase transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4">
            <button className="w-full bg-[#1a2e25] text-white py-4 rounded-sm font-bold tracking-widest uppercase text-xs">
              Book Your Stay
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

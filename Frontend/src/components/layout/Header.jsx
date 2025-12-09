import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/features/authSlice';
// import { Menu, X, User, LogOut, PenSquare, Home } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">BlogApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
              {/* <Home size={18} /> */}
              <span>Home</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create-blog" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
                  <PenSquare size={18} />
                  <span>Write</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
                {user?.avatar && (
                  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary transition">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {/* {isMenuOpen ? <x size={24} /> : <Menu size={24} />} */}
            X
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link to="/" className="block py-2 px-4 hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create-blog" className="block py-2 px-4 hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>Write Blog</Link>
                <Link to="/profile" className="block py-2 px-4 hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 px-4 hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 px-4 hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
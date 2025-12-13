import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/features/authSlice';
import { RiHome3Line, RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdLogin, MdOutlineMenu } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-amber-200 shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">B</span>
            </div>
            <span className="text-2xl font-bold text-primary">BlogApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-2 text-base-content hover:text-primary transition">
              <RiHome3Line size={18} />
              <span>Home</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/blogs/create" className="flex items-center gap-2 text-base-content hover:text-primary transition">
                  <FaPenToSquare size={18} />
                  <span>Write</span>
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-base-content hover:text-primary transition">
                  <FaRegUserCircle size={18} />
                  <span>Profile</span>
                </Link>
                <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-base-content hover:text-primary transition">
                  <RiLogoutCircleRLine size={18} />
                  <span>Logout</span>
                </button>
                {user?.avatar ? (
                  <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"/>
                ):(
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-base-content hover:text-primary transition">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden text-base-content" 
          aria-label="Toggle menu"
          >
            {isMenuOpen ? <RxCross2 size={28} /> : <MdOutlineMenu size={28} />}
            
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
           <div className="md:hidden mt-6 pb-4 border-t border-base-300">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="py-3 px-4 hover:bg-gray-300 rounded-lg" onClick={closeMenu}>
              <div className="flex items-center gap-3">
                  <RiHome3Line size={20} />
                  <span>Home</span>
                </div>
              </Link>

              {isAuthenticated ? (
              <>
                <Link to="/blogs/create" className="py-3 px-4 hover:bg-base-200 rounded-lg" onClick={closeMenu}>
                <div className="flex items-center gap-3">
                  <FaPenToSquare size={18} />
                  <span>Write Blog</span>
                </div>
                </Link>
                <Link to="/profile" className="py-3 px-4 hover:bg-base-200 rounded-lg" onClick={closeMenu}>
                 <div className="flex items-center gap-3">
                      < FaRegUserCircle size={20} />
                      <span>Profile</span>
                    </div>
                </Link>
                <button 
                onClick={handleLogout} 
                className="w-full text-left py-3 px-4 hover:bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3">
                      <MdLogin size={20} />
                      <span>Logout</span>
                    </div>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-3 px-4 hover:bg-base-200 rounded-lg" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/signup" className="py-3 px-4 hover:bg-base-200 rounded-lg btn btn-primary" onClick={closeMenu}>
                    Sign Up
                  </Link>
              </>
            )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
'use client';

import "../globals.css";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const toggleDropdown = (dropdownType: 'business' | 'resources') => {
    if (dropdownType === 'business') {
      setIsBusinessOpen(!isBusinessOpen);
      setIsResourcesOpen(false);
    } else {
      setIsResourcesOpen(!isResourcesOpen);
      setIsBusinessOpen(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <Link
        href="/"
        className="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5"
      >
        <h1 className="m-0 text-primary">StartUp Dream</h1>
      </Link>
      <button
        type="button"
        className="navbar-toggler me-4"
        onClick={handleNavCollapse}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}>
        <div className="navbar-nav ms-auto p-4 p-lg-0">
          <Link 
            href="/" 
            className={`nav-item nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`nav-item nav-link ${pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
          <div className="nav-item dropdown">
            <a
              href="#"
              className={`nav-link dropdown-toggle ${isBusinessOpen ? 'show' : ''} ${
                ['/dashboard', '/favourites'].includes(pathname) ? 'active' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('business');
              }}
            >
              Business
            </a>
            <div className={`dropdown-menu rounded-0 m-0 ${isBusinessOpen ? 'show' : ''}`}>
              <Link 
                href="/dashboard" 
                className={`dropdown-item ${pathname === '/dashboard' ? 'active' : ''}`}
              >
                Business List
              </Link>
              <Link 
                href="/favourites" 
                className={`dropdown-item ${pathname === '/favourites' ? 'active' : ''}`}
              >
                My Favourites
              </Link>
            </div>
          </div>
          <div className="nav-item dropdown">
            <a
              href="#"
              className={`nav-link dropdown-toggle ${isResourcesOpen ? 'show' : ''} ${
                ['/forms/seller', '/forms/buyer', '/admin'].includes(pathname) ? 'active' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('resources');
              }}
            >
              Resources
            </a>
            <div className={`dropdown-menu rounded-0 m-0 ${isResourcesOpen ? 'show' : ''}`}>
              <Link 
                href="/forms/seller" 
                className={`dropdown-item ${pathname === '/forms/seller' ? 'active' : ''}`}
              >
                Sell
              </Link>
              <Link 
                href="/forms/buyer" 
                className={`dropdown-item ${pathname === '/forms/buyer' ? 'active' : ''}`}
              >
                Buy
              </Link>
              <Link 
                href="/admin" 
                className={`dropdown-item ${pathname === '/admin' ? 'active' : ''}`}
              >
                Admin
              </Link>
            </div>
          </div>
          <Link 
            href="/contact" 
            className={`nav-item nav-link ${pathname === '/contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
          <Link 
            href="/favourites" 
            className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block"
          >
            ♡
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

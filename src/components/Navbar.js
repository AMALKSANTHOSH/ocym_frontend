// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MAROON = '#6b1a1a';
const GOLD   = '#c9a227';

const Navbar = () => {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const links = [
    { to:'/',        label:'Home',    icon:'🏠' },
    { to:'/about',   label:'About',   icon:'⛪' },
    { to:'/events',  label:'Events',  icon:'📅' },
    { to:'/gallery', label:'Gallery', icon:'🖼️' },
    { to:'https://moscbible.com/', label:'Read the Bible', icon:'📖', external:true },
    { to:'/contact', label:'Contact', icon:'✉️' },
  ];

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      {/* ══ TOP BAR: Logo + 91 Years ══════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg,#6b1a1a 0%,#8b2020 50%,#4a0e0e 100%)',
        padding: '0.5rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `3px solid ${GOLD}`,
      }}>
        {/* Logo + Name */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.75rem', textDecoration:'none' }}>
          <img src="/ocym-logo.png" alt="OCYM Logo"
            style={{ height:58, width:'auto', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
          <div>
            <div>
              <span style={{ color:GOLD, fontWeight:800, fontSize:'clamp(1rem,3.5vw,1.25rem)', fontFamily:'Georgia,serif' }}>OCYM </span>
              <span style={{ color:'#fff',  fontWeight:800, fontSize:'clamp(1rem,3.5vw,1.25rem)', fontFamily:'Georgia,serif' }}>Kuzhimattom</span>
            </div>
            <div style={{ color:'#e8d0d0', fontSize:'clamp(0.6rem,2vw,0.76rem)', marginTop:'0.1rem' }}>
              St. George Unit · Malankara Orthodox Syrian Church
            </div>
          </div>
        </Link>

        {/* 91 Years — hidden on small phones */}
        <div style={{ textAlign:'right', borderLeft:`2px solid rgba(201,162,39,0.4)`, paddingLeft:'1.25rem' }}
          className="legacy-badge-topbar">
          <div style={{ color:GOLD, fontWeight:800, fontSize:'clamp(1.4rem,4vw,2.2rem)', lineHeight:1, fontFamily:'Georgia,serif' }}>
            91<span style={{ fontSize:'0.85rem', fontWeight:600, marginLeft:'0.15rem' }}>Yrs</span>
          </div>
          <div style={{ color:'#f5e6c0', fontWeight:600, fontSize:'0.65rem', letterSpacing:'1px', textTransform:'uppercase' }}>
            of Legacy &amp; Faith
          </div>
          <div style={{ color:'#c9a0a0', fontSize:'0.62rem', fontStyle:'italic', marginTop:'0.1rem' }}>
            Worship · Study · Service
          </div>
        </div>
      </div>

      {/* ══ STICKY NAV BAR ══════════════════════════════════════════════ */}
      <nav ref={menuRef} style={{
        background: '#2a0808',
        padding: '0 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        position: 'sticky',
        top: 0,
        zIndex: 200,
        boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        borderBottom: `2px solid ${GOLD}`,
      }}>

        {/* Desktop nav links */}
        <ul style={{ display:'flex', gap:'0.1rem', listStyle:'none', margin:0, padding:0, alignItems:'center' }}
          className="nav-links-desktop">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <li key={l.to}>
                {l.external ? (
                  <a href={l.to} target="_blank" rel="noopener noreferrer" style={{
                    color: '#f0c040',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    padding: '0.45rem 0.9rem',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'rgba(201,162,39,0.1)',
                    borderBottom: '2px solid rgba(201,162,39,0.5)',
                    transition: 'all 0.2s',
                  }}>
                    📖 {l.label}
                  </a>
                ) : (
                  <Link to={l.to} style={{
                    color: active ? GOLD : '#e0c8c8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 500,
                    padding: '0.45rem 0.9rem',
                    borderRadius: 4,
                    display: 'block',
                    background: active ? 'rgba(201,162,39,0.15)' : 'transparent',
                    borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}>
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Desktop auth buttons */}
        <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}
          className="nav-auth-desktop">
          {!user ? (
            <>
              <Link to="/login" style={{ color:'#c8a0a0', textDecoration:'none', fontSize:'0.85rem', padding:'0.35rem 0.75rem' }}>
                Login
              </Link>
              <Link to="/register" style={{ background:GOLD, color:'#1a0a0a', textDecoration:'none', fontSize:'0.85rem', fontWeight:700, padding:'0.35rem 1.1rem', borderRadius:20 }}>
                Join Us
              </Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color:GOLD, fontSize:'0.82rem', textDecoration:'none', marginRight:'0.5rem' }}>⚙ Admin</Link>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', overflow:'hidden', border:`2px solid ${GOLD}`, background:'#3a1010', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {user.photo
                    ? <img src={user.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    : <span style={{ fontSize:'0.9rem' }}>👤</span>
                  }
                </div>
                <span style={{ color:'#e0c8c8', fontSize:'0.82rem' }}>{user.name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} style={{ background:'transparent', border:`1px solid #5a2020`, color:'#c8a0a0', padding:'0.3rem 0.8rem', borderRadius:20, cursor:'pointer', fontSize:'0.8rem' }}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* ☰ Hamburger button — mobile only */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          className="hamburger-btn"
          style={{
            background: 'transparent',
            border: `1.5px solid rgba(201,162,39,0.5)`,
            borderRadius: 6,
            padding: '0.3rem 0.55rem',
            cursor: 'pointer',
            display: 'none',   // shown via CSS below
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            width: 38,
            height: 36,
          }}>
          {/* 3 bars that animate to X */}
          <span style={{
            display: 'block', width: 20, height: 2,
            background: menuOpen ? GOLD : '#e0c8c8',
            borderRadius: 2,
            transition: 'all 0.25s',
            transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
          }}/>
          <span style={{
            display: 'block', width: 20, height: 2,
            background: menuOpen ? GOLD : '#e0c8c8',
            borderRadius: 2,
            transition: 'all 0.25s',
            opacity: menuOpen ? 0 : 1,
          }}/>
          <span style={{
            display: 'block', width: 20, height: 2,
            background: menuOpen ? GOLD : '#e0c8c8',
            borderRadius: 2,
            transition: 'all 0.25s',
            transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
          }}/>
        </button>
      </nav>

      {/* ══ MOBILE DRAWER OVERLAY ══════════════════════════════════════ */}
      {/* Dark backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 150,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      {/* Slide-in drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(300px, 85vw)',
        background: 'linear-gradient(180deg,#3a0a0a 0%,#2a0808 100%)',
        zIndex: 300,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
      }}>

        {/* Drawer header */}
        <div style={{
          background: 'linear-gradient(135deg,#6b1a1a,#4a0e0e)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `2px solid ${GOLD}`,
          flexShrink: 0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
            <img src="/ocym-logo.png" alt="OCYM" style={{ height:40, filter:'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' }}/>
            <div>
              <span style={{ color:GOLD, fontWeight:800, fontSize:'0.95rem', fontFamily:'Georgia,serif' }}>OCYM </span>
              <span style={{ color:'#fff', fontWeight:800, fontSize:'0.95rem', fontFamily:'Georgia,serif' }}>Kuzhimattom</span>
            </div>
          </div>
          {/* Close ✕ button */}
          <button onClick={() => setMenuOpen(false)} style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none', color: '#fff',
            width: 32, height: 32, borderRadius: '50%',
            fontSize: '1rem', cursor: 'pointer',
            display: 'flex', alignItems:'center', justifyContent:'center',
          }}>✕</button>
        </div>

        {/* Nav links in drawer */}
        <nav style={{ flex:1, padding:'0.75rem 0' }}>
          {links.map(l => {
            const active = location.pathname === l.to;
            return l.external ? (
              <a
                key={l.to}
                href={l.to}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1.5rem',
                  color: GOLD,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  background: 'rgba(201,162,39,0.1)',
                  borderLeft: `3px solid ${GOLD}`,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize:'1.1rem', width:22, textAlign:'center' }}>📖</span>
                {l.label}
                <span style={{ marginLeft:'auto', fontSize:'0.72rem', color:'rgba(201,162,39,0.7)' }}>↗</span>
              </a>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1.5rem',
                  color: active ? GOLD : '#e0c0c0',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: active ? 700 : 400,
                  background: active ? 'rgba(201,162,39,0.12)' : 'transparent',
                  borderLeft: active ? `3px solid ${GOLD}` : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize:'1.1rem', width:22, textAlign:'center' }}>{l.icon}</span>
                {l.label}
                {active && <span style={{ marginLeft:'auto', color:GOLD, fontSize:'0.75rem' }}>●</span>}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ height:1, background:'rgba(255,255,255,0.08)', margin:'0 1.25rem' }}/>

        {/* Auth section in drawer */}
        <div style={{ padding:'1rem 1.25rem', flexShrink:0 }}>
          {!user ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                display: 'block', textAlign:'center', padding:'0.7rem',
                color: '#e0c8c8', textDecoration:'none', fontSize:'0.9rem',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius:8,
              }}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                display: 'block', textAlign:'center', padding:'0.7rem',
                background: GOLD, color:'#1a0a0a', textDecoration:'none',
                fontSize:'0.9rem', fontWeight:700, borderRadius:8,
              }}>
                ✝ Join OCYM
              </Link>
            </div>
          ) : (
            <div>
              {/* User info */}
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.85rem', padding:'0.75rem', background:'rgba(255,255,255,0.06)', borderRadius:8 }}>
                <div style={{ width:42, height:42, borderRadius:'50%', overflow:'hidden', border:`2px solid ${GOLD}`, background:'#3a1010', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {user.photo
                    ? <img src={user.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    : <span style={{ fontSize:'1.2rem' }}>👤</span>
                  }
                </div>
                <div>
                  <p style={{ color:'#fff', fontWeight:600, fontSize:'0.9rem', margin:0 }}>{user.name}</p>
                  <p style={{ color:'#a08080', fontSize:'0.75rem', margin:0 }}>{user.email}</p>
                </div>
              </div>

              {/* Admin link */}
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={{
                  display:'block', textAlign:'center', padding:'0.65rem',
                  color: GOLD, textDecoration:'none', fontSize:'0.9rem', fontWeight:600,
                  border: `1px solid rgba(201,162,39,0.3)`, borderRadius:8, marginBottom:'0.6rem',
                }}>
                  ⚙ Admin Panel
                </Link>
              )}

              {/* Logout */}
              <button onClick={handleLogout} style={{
                width:'100%', padding:'0.7rem',
                background:'rgba(231,76,60,0.15)',
                border:'1px solid rgba(231,76,60,0.3)',
                color:'#f5a0a0', borderRadius:8, cursor:'pointer',
                fontSize:'0.9rem', fontWeight:500,
              }}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Footer in drawer */}
        <div style={{ padding:'0.75rem 1.25rem', borderTop:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          <p style={{ color:'#6b4040', fontSize:'0.7rem', textAlign:'center', fontStyle:'italic' }}>
            Worship · Study · Service
          </p>
        </div>
      </div>

      {/* ══ RESPONSIVE CSS ══════════════════════════════════════════════ */}
      <style>{`
        /* Desktop: show nav links, hide hamburger */
        .nav-links-desktop { display: flex !important; }
        .nav-auth-desktop   { display: flex !important; }
        .hamburger-btn      { display: none !important; }

        /* Tablet / Mobile: hide nav links, show hamburger */
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-auth-desktop   { display: none !important; }
          .hamburger-btn      { display: flex !important; }
          .legacy-badge-topbar { display: none !important; }
        }

        /* Smooth hover on drawer links */
        a[href]:hover { opacity: 0.85; }
      `}</style>
    </>
  );
};

export default Navbar;
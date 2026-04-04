// src/components/Navbar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const links = [
    { to:'/',        label:'Home'    },
    { to:'/about',   label:'About'   },
    { to:'/events',  label:'Events'  },
    { to:'/gallery', label:'Gallery' },
    { to:'/contact', label:'Contact' },
  ];

  return (
    <>
      {/* Top bar */}
      <div style={{
        background:'linear-gradient(135deg,#6b1a1a 0%,#8b2020 50%,#4a0e0e 100%)',
        padding:'0.5rem 2rem', display:'flex', alignItems:'center',
        justifyContent:'space-between', borderBottom:'3px solid #c9a227',
      }}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:'0.9rem',textDecoration:'none'}}>
          <img src="/ocym-logo.png" alt="OCYM"
            style={{height:68,width:'auto',filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'}} />
          <div>
            <div>
              <span style={{color:'#f0c040',fontWeight:800,fontSize:'1.25rem',fontFamily:'Georgia,serif'}}>OCYM </span>
              <span style={{color:'#ffffff',fontWeight:800,fontSize:'1.25rem',fontFamily:'Georgia,serif'}}>Kuzhimattom</span>
            </div>
            <div style={{color:'#e8d0d0',fontSize:'0.76rem',marginTop:'0.1rem'}}>
              St. George Unit · Malankara Orthodox Syrian Church
            </div>
          </div>
        </Link>

        <div style={{textAlign:'right',borderLeft:'2px solid rgba(201,162,39,0.4)',paddingLeft:'1.5rem'}}>
          <div style={{color:'#f0c040',fontWeight:800,fontSize:'2.2rem',lineHeight:1,fontFamily:'Georgia,serif'}}>
            91<span style={{fontSize:'1rem',fontWeight:600,marginLeft:'0.2rem'}}>Years</span>
          </div>
          <div style={{color:'#f5e6c0',fontWeight:600,fontSize:'0.7rem',letterSpacing:'1.5px',textTransform:'uppercase'}}>
            of Legacy &amp; Faith
          </div>
          <div style={{color:'#c9a0a0',fontSize:'0.67rem',fontStyle:'italic',marginTop:'0.1rem'}}>
            Worship · Study · Service
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav style={{
        background:'#2a0808',padding:'0 2rem',display:'flex',alignItems:'center',
        justifyContent:'space-between',height:48,position:'sticky',top:0,zIndex:100,
        boxShadow:'0 2px 12px rgba(0,0,0,0.5)',borderBottom:'2px solid #c9a227',
      }}>
        <ul style={{display:'flex',gap:'0.1rem',listStyle:'none',margin:0,padding:0,alignItems:'center'}}>
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <li key={l.to}>
                <Link to={l.to} style={{
                  color: active ? '#f0c040' : '#e0c8c8',
                  textDecoration:'none',fontSize:'0.875rem',fontWeight:active?700:500,
                  padding:'0.45rem 0.9rem',borderRadius:4,display:'block',
                  background: active ? 'rgba(201,162,39,0.15)' : 'transparent',
                  borderBottom: active ? '2px solid #c9a227' : '2px solid transparent',
                  transition:'all 0.2s',
                }}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
          {!user ? (
            <>
              <Link to="/login" style={{color:'#c8a0a0',textDecoration:'none',fontSize:'0.85rem',padding:'0.35rem 0.75rem'}}>
                Login
              </Link>
              <Link to="/register" style={{
                background:'#c9a227',color:'#1a0a0a',textDecoration:'none',
                fontSize:'0.85rem',fontWeight:700,padding:'0.35rem 1.1rem',borderRadius:20,
              }}>
                Join Us
              </Link>
            </>
          ) : (
            <>
              {user.role==='admin' && (
                <Link to="/admin" style={{color:'#f0c040',fontSize:'0.82rem',textDecoration:'none',marginRight:'0.5rem'}}>
                  ⚙ Admin
                </Link>
              )}
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <div style={{
                  width:28,height:28,borderRadius:'50%',overflow:'hidden',
                  border:'2px solid #c9a227',background:'#3a1010',
                  display:'flex',alignItems:'center',justifyContent:'center',
                }}>
                  {user.photo
                    ? <img src={user.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    : <span style={{fontSize:'0.9rem'}}>👤</span>
                  }
                </div>
                <span style={{color:'#e0c8c8',fontSize:'0.82rem'}}>{user.name?.split(' ')[0]}</span>
              </div>
              <button onClick={()=>{logout();navigate('/');}} style={{
                background:'transparent',border:'1px solid #5a2020',color:'#c8a0a0',
                padding:'0.3rem 0.8rem',borderRadius:20,cursor:'pointer',fontSize:'0.8rem',
              }}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

// src/components/AdminSidebar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const links = [
    { to:'/admin',              label:'📊 Dashboard'      },
    { to:'/admin/members',      label:'👥 Members'         },
    { to:'/admin/blood-list',   label:'🩸 Blood Group List' },
    { to:'/admin/events',       label:'📅 Events'          },
    { to:'/admin/gallery',      label:'🖼️  Gallery'        },
    { to:'/admin/messages',     label:'✉️  Messages'        },
    { to:'/admin/about',        label:'📄 About Page'      },
    { to:'/admin/history',      label:'🗓️  Year History'    },
  ];

  return (
    <div style={{
      width:235,background:'linear-gradient(180deg,#4a0e0e 0%,#6b1a1a 100%)',
      color:'#fff',padding:'1.5rem 0',flexShrink:0,minHeight:'100vh',
    }}>
      <div style={{padding:'0 1.5rem 1.5rem',borderBottom:'1px solid rgba(255,255,255,0.1)',textAlign:'center'}}>
        <img src="/ocym-logo.png" alt="OCYM" style={{height:50,marginBottom:'0.5rem',opacity:0.9}} />
        <div style={{fontSize:'0.85rem',fontWeight:700}}>
          <span style={{color:'#f0c040'}}>OCYM </span>
          <span style={{color:'#fff'}}>Kuzhimattom Pally</span>
        </div>
        <div style={{color:'#c8a0a0',fontSize:'0.72rem',marginTop:'0.2rem'}}>Admin Panel</div>
        {user && <div style={{color:'#e0c0c0',fontSize:'0.75rem',marginTop:'0.5rem'}}>👤 {user.name}</div>}
      </div>

      <ul style={{listStyle:'none',margin:'0.75rem 0 0',padding:0}}>
        {links.map(link => {
          const active = location.pathname === link.to;
          return (
            <li key={link.to}>
              <Link to={link.to} style={{
                display:'block',padding:'0.7rem 1.5rem',
                color: active ? '#f0c040' : '#e0c0c0',
                textDecoration:'none',fontSize:'0.85rem',
                background: active ? 'rgba(201,162,39,0.18)' : 'transparent',
                borderLeft: active ? '3px solid #c9a227' : '3px solid transparent',
                fontWeight: active ? 700 : 400,transition:'all 0.2s',
              }}>
                {link.label}
              </Link>
            </li>
          );
        })}
        <li style={{marginTop:'2rem',borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:'1rem'}}>
          <button onClick={()=>{logout();navigate('/');}} style={{
            display:'block',width:'calc(100% - 3rem)',margin:'0 1.5rem',
            padding:'0.6rem',background:'rgba(231,76,60,0.2)',
            border:'1px solid rgba(231,76,60,0.4)',color:'#f5a0a0',
            borderRadius:6,cursor:'pointer',fontSize:'0.85rem',textAlign:'center',
          }}>
            🚪 Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;

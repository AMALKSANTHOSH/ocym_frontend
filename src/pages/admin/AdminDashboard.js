// src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then(r=>setStats(r.data)).catch(()=>{}); }, []);

  const cards = stats ? [
    {label:'Approved Members', number:stats.totalMembers,   color:'#27ae60', icon:'👥'},
    {label:'Pending Approval', number:stats.pendingMembers, color:'#e67e22', icon:'⏳'},
    {label:'Active Events',    number:stats.totalEvents,    color:'#6b1a1a', icon:'📅'},
    {label:'Gallery Photos',   number:stats.totalPhotos,    color:'#8e44ad', icon:'🖼️'},
    {label:'Unread Messages',  number:stats.unreadMessages, color:'#e74c3c', icon:'✉️'},
  ] : [];

  const quickLinks = [
    {href:'/admin/members',    label:'👥 Approve Members'},
    {href:'/admin/blood-list', label:'🩸 Blood Group List'},
    {href:'/admin/events',     label:'📅 Add Event'},
    {href:'/admin/gallery',    label:'🖼️ Upload Photo'},
    {href:'/admin/messages',   label:'✉️ View Messages'},
    {href:'/admin/history',    label:'🗓️ Year History'},
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar/>
      <div className="admin-main">
        <h2>📊 Dashboard</h2>
        <p style={{color:'#888',marginBottom:'1.5rem'}}>Welcome back, Admin! Here's an overview.</p>

        <div className="stats-grid">
          {cards.map(c => (
            <div key={c.label} className="stat-card">
              <div style={{fontSize:'1.8rem',marginBottom:'0.3rem'}}>{c.icon}</div>
              <div className="number" style={{color:c.color}}>{c.number ?? '—'}</div>
              <div className="label">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{padding:'1.5rem'}}>
          <h3 style={{color:'#6b1a1a',marginBottom:'1rem',fontFamily:'Georgia,serif'}}>Quick Actions</h3>
          <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
            {quickLinks.map(l => (
              <a key={l.href} href={l.href} style={{
                background:'#6b1a1a',color:'#fff',textDecoration:'none',
                padding:'0.5rem 1rem',borderRadius:20,fontSize:'0.85rem',fontWeight:600,
              }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

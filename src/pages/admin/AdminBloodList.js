// src/pages/admin/AdminBloodList.js
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const BLOOD_GROUPS = ['All','A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];

export default function AdminBloodList() {
  const [members, setMembers]   = useState([]);
  const [search, setSearch]     = useState('');
  const [bgFilter, setBgFilter] = useState('All');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/members/blood-list')
      .then(r => setMembers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        (m.phone||'').includes(search);
    const matchBG     = bgFilter === 'All' || m.bloodGroup === bgFilter;
    return matchSearch && matchBG;
  });

  // Blood group color map
  const bgColor = {
    'A+':'#e74c3c','A-':'#c0392b','B+':'#3498db','B-':'#2980b9',
    'AB+':'#8e44ad','AB-':'#6c3483','O+':'#27ae60','O-':'#1e8449','Unknown':'#888',
  };

  return (
    <div className="admin-layout">
      <AdminSidebar/>
      <div className="admin-main">
        <h2>🩸 Blood Group List</h2>
        <p style={{color:'#888',marginBottom:'1.5rem'}}>
          All approved members — {filtered.length} of {members.length} shown
        </p>

        {/* Blood group summary cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:'0.6rem',marginBottom:'1.5rem'}}>
          {BLOOD_GROUPS.filter(b=>b!=='All').map(bg => {
            const count = members.filter(m=>m.bloodGroup===bg).length;
            if (count===0) return null;
            return (
              <div key={bg} onClick={()=>setBgFilter(bg===bgFilter?'All':bg)} style={{
                background: bgFilter===bg ? bgColor[bg] : '#fff',
                border:`2px solid ${bgColor[bg]}`,borderRadius:8,padding:'0.6rem',
                textAlign:'center',cursor:'pointer',transition:'all 0.2s',
              }}>
                <div style={{fontWeight:800,fontSize:'1.3rem',color:bgFilter===bg?'#fff':bgColor[bg]}}>{bg}</div>
                <div style={{fontSize:'0.75rem',color:bgFilter===bg?'rgba(255,255,255,0.8)':'#888'}}>{count} member{count!==1?'s':''}</div>
              </div>
            );
          })}
        </div>

        {/* Search + filter bar */}
        <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍 Search by name or phone..."
            style={{flex:1,minWidth:200,padding:'0.65rem 1rem',border:'1.5px solid #ddd',borderRadius:8,fontSize:'0.9rem',outline:'none'}}
            onFocus={e=>e.target.style.borderColor='#6b1a1a'}
            onBlur={e=>e.target.style.borderColor='#ddd'}
          />
          <select value={bgFilter} onChange={e=>setBgFilter(e.target.value)} style={{padding:'0.65rem 1rem',border:'1.5px solid #ddd',borderRadius:8,fontSize:'0.9rem',outline:'none',background:'#fff',cursor:'pointer'}}>
            {BLOOD_GROUPS.map(b=><option key={b} value={b}>{b==='All'?'All Blood Groups':b}</option>)}
          </select>
          {(search||bgFilter!=='All') && (
            <button onClick={()=>{setSearch('');setBgFilter('All');}} style={{padding:'0.65rem 1rem',background:'#f5ece0',border:'1px solid #ddd',borderRadius:8,cursor:'pointer',fontSize:'0.85rem',color:'#6b1a1a',fontWeight:600}}>
              Clear ✕
            </button>
          )}
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'3rem',color:'#888'}}>Loading...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>Age</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign:'center',padding:'2rem',color:'#888'}}>No members found</td></tr>
                ) : filtered.map((m, i) => (
                  <tr key={m._id}>
                    <td style={{color:'#999',fontSize:'0.8rem'}}>{i+1}</td>
                    <td>
                      <div style={{width:38,height:38,borderRadius:'50%',overflow:'hidden',border:'2px solid #6b1a1a',background:'#f5ece0',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {m.photo
                          ? <img src={m.photo} alt={m.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                          : <span style={{fontSize:'1rem'}}>👤</span>
                        }
                      </div>
                    </td>
                    <td><strong>{m.name}</strong></td>
                    <td>
                      <span style={{
                        background: bgColor[m.bloodGroup]||'#888',
                        color:'#fff',padding:'0.25rem 0.75rem',borderRadius:20,
                        fontSize:'0.82rem',fontWeight:700,
                      }}>
                        {m.bloodGroup || 'Unknown'}
                      </span>
                    </td>
                    <td>{m.age != null ? `${m.age} yrs` : '—'}</td>
                    <td>{m.phone || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Export hint */}
        <p style={{color:'#aaa',fontSize:'0.8rem',marginTop:'1rem',textAlign:'center'}}>
          💡 Tip: Use Ctrl+P → Save as PDF to export this list for printing
        </p>
      </div>
    </div>
  );
}

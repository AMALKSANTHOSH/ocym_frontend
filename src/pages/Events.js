// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
const M='#6b1a1a', G='#c9a227';

export default function Events() {
  const [events, setEvents]   = useState([]);
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(events.map(e => e.category))];
  const filtered   = filter === 'all' ? events : events.filter(e => e.category === filter);

  if (loading) return <div style={{textAlign:'center',padding:'5rem',color:'#888'}}>Loading events...</div>;

  return (
    <div>
      <div style={{background:'linear-gradient(135deg,#4a0e0e,#6b1a1a)',padding:'3rem 2rem',textAlign:'center',color:'#fff'}}>
        <img src="/ocym-logo.png" alt="" style={{height:55,marginBottom:'0.75rem',opacity:0.85}}/>
        <h1 style={{fontSize:'2rem',fontFamily:'Georgia,serif',marginBottom:'0.4rem'}}>Events</h1>
        <p style={{color:'#e0c8c8',fontSize:'0.95rem'}}>Stay updated with our programs and activities</p>
      </div>
      <div style={{background:G,height:4}}/>

      <section style={{padding:'3rem 2rem',background:'#faf6f1'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          {categories.length > 1 && (
            <div style={{display:'flex',gap:'0.6rem',flexWrap:'wrap',marginBottom:'2rem',justifyContent:'center'}}>
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{
                  padding:'0.4rem 1.1rem',borderRadius:20,fontSize:'0.85rem',fontWeight:600,cursor:'pointer',
                  border:`2px solid ${filter===c ? M : '#ddd'}`,
                  background: filter===c ? M : '#fff',
                  color: filter===c ? '#fff' : '#666', transition:'all 0.2s',
                }}>
                  {c.charAt(0).toUpperCase()+c.slice(1)}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{textAlign:'center',padding:'4rem',color:'#aaa',background:'#fff',borderRadius:12,border:'1px dashed #ddd'}}>
              <p style={{fontSize:'3rem',marginBottom:'0.5rem'}}>📅</p>
              <p>No events scheduled yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:'1.5rem'}}>
              {filtered.map(e => (
                <div key={e._id} style={{background:'#fff',borderRadius:10,overflow:'hidden',
                  boxShadow:'0 2px 12px rgba(0,0,0,0.08)',borderTop:`4px solid ${G}`,transition:'transform 0.2s'}}
                  onMouseEnter={ev=>ev.currentTarget.style.transform='translateY(-3px)'}
                  onMouseLeave={ev=>ev.currentTarget.style.transform='translateY(0)'}>
                  {e.image && <img src={e.image} alt={e.title} style={{width:'100%',height:180,objectFit:'cover'}}/>}
                  <div style={{padding:'1.25rem'}}>
                    <span style={{background:'#f5ece0',color:M,fontSize:'0.72rem',padding:'0.2rem 0.6rem',borderRadius:12,fontWeight:600}}>{e.category}</span>
                    <h3 style={{color:'#1a1a1a',marginTop:'0.6rem',fontSize:'1rem'}}>{e.title}</h3>
                    <p style={{color:'#666',fontSize:'0.875rem',marginTop:'0.4rem',lineHeight:1.6}}>{e.description}</p>
                    <div style={{marginTop:'0.85rem',borderTop:'1px solid #f0e8e0',paddingTop:'0.75rem'}}>
                      <p style={{color:G,fontWeight:600,fontSize:'0.82rem'}}>
                        📅 {new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
                        {e.time && ` · ${e.time}`}
                      </p>
                      {e.location && <p style={{color:'#888',fontSize:'0.82rem',marginTop:'0.2rem'}}>📍 {e.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

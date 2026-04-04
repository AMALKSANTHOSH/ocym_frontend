// src/pages/Gallery.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
const M='#6b1a1a', G='#c9a227';

export default function Gallery() {
  const [photos, setPhotos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/gallery').then(r => setPhotos(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(photos.map(p => p.category).filter(Boolean))];
  const filtered   = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  if (loading) return <div style={{textAlign:'center',padding:'5rem',color:'#888'}}>Loading gallery...</div>;

  return (
    <div>
      <div style={{background:'linear-gradient(135deg,#4a0e0e,#6b1a1a)',padding:'3rem 2rem',textAlign:'center',color:'#fff'}}>
        <img src="/ocym-logo.png" alt="" style={{height:55,marginBottom:'0.75rem',opacity:0.85}}/>
        <h1 style={{fontSize:'2rem',fontFamily:'Georgia,serif',marginBottom:'0.4rem'}}>Gallery</h1>
        <p style={{color:'#e0c8c8',fontSize:'0.95rem'}}>Memories and moments from our activities</p>
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
              <p style={{fontSize:'3rem',marginBottom:'0.5rem'}}>🖼️</p><p>Gallery coming soon!</p>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'1rem'}}>
              {filtered.map(p => (
                <div key={p._id} onClick={() => setSelected(p)} style={{
                  borderRadius:8,overflow:'hidden',cursor:'pointer',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.1)',transition:'transform 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                  <img src={p.image} alt={p.title} style={{width:'100%',height:200,objectFit:'cover',display:'block'}}/>
                  <div style={{padding:'0.6rem 0.8rem',background:'#fff'}}>
                    <p style={{fontSize:'0.82rem',fontWeight:600,color:'#333',margin:0}}>{p.title}</p>
                    {p.category && <p style={{fontSize:'0.72rem',color:'#999',margin:'0.1rem 0 0'}}>{p.category}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'2rem'}}>
          <div style={{maxWidth:850,width:'100%',textAlign:'center'}} onClick={e=>e.stopPropagation()}>
            <img src={selected.image} alt={selected.title} style={{maxWidth:'100%',maxHeight:'75vh',borderRadius:8,objectFit:'contain'}}/>
            <p style={{color:'#fff',marginTop:'1rem',fontWeight:600,fontSize:'1.05rem'}}>{selected.title}</p>
            {selected.description && <p style={{color:'#aaa',fontSize:'0.875rem',marginTop:'0.3rem'}}>{selected.description}</p>}
            <button onClick={() => setSelected(null)} style={{marginTop:'1rem',background:G,border:'none',padding:'0.5rem 1.5rem',borderRadius:20,cursor:'pointer',fontWeight:700,color:'#1a0a0a'}}>
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

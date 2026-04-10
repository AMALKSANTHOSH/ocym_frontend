// src/pages/admin/AdminAbout.js
import React, { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const emptyMember = { name: '', position: '', phone: '', photo: '' };
const MAROON = '#6b1a1a';
const GOLD   = '#c9a227';

export default function AdminAbout() {
  const [aboutId, setAboutId]   = useState(null);
  const [about,   setAbout]     = useState(null);

  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [vision,  setVision]  = useState('');
  const [mission, setMission] = useState('');
  const [history, setHistory] = useState('');

  const [mainImageFile,    setMainImageFile]    = useState(null);
  const [historyImageFile, setHistoryImageFile] = useState(null);

  const [committee, setCommittee] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);

  const [msg,      setMsg]      = useState({ type: '', text: '' });
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 5000);
  };

  const loadAbout = useCallback(async () => {
    setFetching(true);
    try {
      const res = await api.get('/about');
      const d = res.data;
      if (d && d._id) {
        setAboutId(d._id);
        setAbout(d);
        setTitle(d.title   || '');
        setContent(d.content || '');
        setVision(d.vision  || '');
        setMission(d.mission || '');
        setHistory(d.history || '');
        const cm = (d.committee || []).map(m => ({
          name:     m.name     || '',
          position: m.position || '',
          phone:    m.phone    || '',
          photo:    m.photo    || '',
        }));
        setCommittee(cm);
        setNewPhotos(cm.map(() => null));
      } else {
        // No about page exists yet
        setAboutId(null);
        setAbout(null);
      }
    } catch (e) {
      console.error('Failed to load about:', e);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadAbout(); }, [loadAbout]);

  const addMember = () => {
    setCommittee(prev => [...prev, { ...emptyMember }]);
    setNewPhotos(prev => [...prev, null]);
  };

  const removeMember = i => {
    setCommittee(prev => prev.filter((_, idx) => idx !== i));
    setNewPhotos(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateMember = (i, field, val) => {
    setCommittee(prev => {
      const u = [...prev];
      u[i] = { ...u[i], [field]: val };
      return u;
    });
  };

  const setNewPhoto = (i, file) => {
    setNewPhotos(prev => {
      const u = [...prev];
      u[i] = file;
      return u;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showMsg('error', 'Title and Main Description are required.');
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append('title',   title.trim());
    data.append('content', content.trim());
    data.append('vision',  vision.trim());
    data.append('mission', mission.trim());
    data.append('history', history.trim());

    if (mainImageFile instanceof File)    data.append('image',        mainImageFile);
    if (historyImageFile instanceof File) data.append('historyImage', historyImageFile);

    // Committee: existing photo URLs are in the JSON so backend preserves them
    const cmJson = committee.map(m => ({
      name:     m.name.trim(),
      position: m.position.trim(),
      phone:    m.phone.trim(),
      photo:    m.photo || '',
    }));
    data.append('committee', JSON.stringify(cmJson));

    // Only send files that were actually selected, with index mapping
    const photoIndexMap = [];
    newPhotos.forEach((file, i) => {
      if (file instanceof File) {
        data.append('committeePhotos', file);
        photoIndexMap.push(i);
      }
    });
    data.append('committeePhotoIndexes', JSON.stringify(photoIndexMap));

    try {
      if (aboutId) {
        await api.put(`/about/${aboutId}`, data);
        showMsg('success', '✅ About page updated successfully!');
      } else {
        await api.post('/about', data);
        showMsg('success', '✅ About page created successfully!');
      }
      setMainImageFile(null);
      setHistoryImageFile(null);
      await loadAbout(); // reload fresh data including new Cloudinary URLs
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      showMsg('error', '❌ ' + (err.response?.data?.message || 'Save failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.65rem 0.9rem',
    border: '1.5px solid #ddd', borderRadius: 7,
    fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };
  const lbl = { display:'block', marginBottom:'0.3rem', fontSize:'0.82rem', fontWeight:600, color:'#555' };
  const card = { background:'#fff', borderRadius:10, padding:'1.25rem', marginBottom:'1.25rem', boxShadow:'0 1px 6px rgba(0,0,0,0.07)', border:'1px solid #f0ebe5' };

  if (fetching) {
    return (
      <div className="admin-layout">
        <AdminSidebar/>
        <div className="admin-main" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:300 }}>
          <p style={{ color:'#888' }}>⏳ Loading about page data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; }
          .admin-sidebar-mobile { display: none; }
          .about-grid-2 { grid-template-columns: 1fr !important; }
          .about-grid-3 { grid-template-columns: 1fr !important; }
          .admin-main { padding: 1rem !important; }
        }
      `}</style>

      <div className="admin-layout">
        <AdminSidebar/>
        <div className="admin-main" style={{ maxWidth: 880 }}>

          {/* Header */}
          <div style={{ marginBottom:'1.25rem' }}>
            <h2 style={{ margin:0 }}>📄 About Page</h2>
            <p style={{ color:'#888', marginTop:'0.25rem', fontSize:'0.82rem' }}>
              {aboutId
                ? '✅ Editing existing about page — changes save to database + Cloudinary'
                : '🆕 No about page exists yet — fill below and create'
              }
            </p>
          </div>

          {/* Alert */}
          {msg.text && (
            <div style={{
              padding:'0.85rem 1rem', borderRadius:8, marginBottom:'1.25rem',
              fontSize:'0.9rem', fontWeight:500,
              background: msg.type==='success' ? '#f0faf4' : '#fdf0f0',
              color:      msg.type==='success' ? '#155724' : '#721c24',
              border:     `1px solid ${msg.type==='success' ? '#c3e6cb' : '#f5c6cb'}`,
            }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* 1. Main Content */}
            <div style={card}>
              <h3 style={{ color:MAROON, marginBottom:'1rem', fontSize:'0.95rem' }}>📝 Main Content</h3>
              <div style={{ marginBottom:'1rem' }}>
                <label style={lbl}>Title *</label>
                <input value={title} required onChange={e=>setTitle(e.target.value)}
                  placeholder="e.g. About St. George OCYM Kuzhimattom" style={inp}
                  onFocus={e=>e.target.style.borderColor=MAROON} onBlur={e=>e.target.style.borderColor='#ddd'}/>
              </div>
              <div style={{ marginBottom:'1rem' }}>
                <label style={lbl}>Main Description *</label>
                <textarea value={content} required onChange={e=>setContent(e.target.value)}
                  placeholder="Main description about the organization..."
                  style={{ ...inp, minHeight:120, resize:'vertical' }}
                  onFocus={e=>e.target.style.borderColor=MAROON} onBlur={e=>e.target.style.borderColor='#ddd'}/>
              </div>
              <div>
                <label style={lbl}>Main Banner Image → Cloudinary</label>
                <input type="file" accept="image/*" style={{ fontSize:'0.85rem' }}
                  onChange={e=>setMainImageFile(e.target.files[0]||null)}/>
                <div style={{ marginTop:8, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
                  {about?.image && !mainImageFile && (
                    <><img src={about.image} alt="" style={{ height:48,borderRadius:4,objectFit:'cover' }}/>
                    <span style={{ fontSize:'0.75rem',color:'#27ae60' }}>✅ Current banner</span></>
                  )}
                  {mainImageFile && (
                    <><img src={URL.createObjectURL(mainImageFile)} alt="" style={{ height:48,borderRadius:4,objectFit:'cover' }}/>
                    <span style={{ fontSize:'0.75rem',color:GOLD }}>⬆ Will upload</span>
                    <button type="button" onClick={()=>setMainImageFile(null)} style={{ fontSize:'0.72rem',color:'#e74c3c',background:'none',border:'none',cursor:'pointer' }}>✕ cancel</button></>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Vision & Mission */}
            <div style={card}>
              <h3 style={{ color:MAROON, marginBottom:'1rem', fontSize:'0.95rem' }}>🎯 Vision &amp; Mission</h3>
              <div className="about-grid-2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem' }}>
                <div>
                  <label style={lbl}>Vision</label>
                  <textarea value={vision} onChange={e=>setVision(e.target.value)}
                    placeholder="Our vision for the community..."
                    style={{ ...inp, minHeight:90, resize:'vertical' }}
                    onFocus={e=>e.target.style.borderColor=MAROON} onBlur={e=>e.target.style.borderColor='#ddd'}/>
                </div>
                <div>
                  <label style={lbl}>Mission</label>
                  <textarea value={mission} onChange={e=>setMission(e.target.value)}
                    placeholder="Our mission statement..."
                    style={{ ...inp, minHeight:90, resize:'vertical' }}
                    onFocus={e=>e.target.style.borderColor=MAROON} onBlur={e=>e.target.style.borderColor='#ddd'}/>
                </div>
              </div>
            </div>

            {/* 3. History */}
            <div style={card}>
              <h3 style={{ color:MAROON, marginBottom:'1rem', fontSize:'0.95rem' }}>📜 History</h3>
              <div style={{ marginBottom:'1rem' }}>
                <label style={lbl}>History Text</label>
                <textarea value={history} onChange={e=>setHistory(e.target.value)}
                  placeholder="Brief history of the unit..."
                  style={{ ...inp, minHeight:100, resize:'vertical' }}
                  onFocus={e=>e.target.style.borderColor=MAROON} onBlur={e=>e.target.style.borderColor='#ddd'}/>
              </div>
              <div>
                <label style={lbl}>History Image (displayed beside history text) → Cloudinary</label>
                <input type="file" accept="image/*" style={{ fontSize:'0.85rem' }}
                  onChange={e=>setHistoryImageFile(e.target.files[0]||null)}/>
                <div style={{ marginTop:8, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
                  {about?.historyImage && !historyImageFile && (
                    <><img src={about.historyImage} alt="" style={{ height:48,borderRadius:4,objectFit:'cover' }}/>
                    <span style={{ fontSize:'0.75rem',color:'#27ae60' }}>✅ Current history image</span></>
                  )}
                  {historyImageFile && (
                    <><img src={URL.createObjectURL(historyImageFile)} alt="" style={{ height:48,borderRadius:4,objectFit:'cover' }}/>
                    <span style={{ fontSize:'0.75rem',color:GOLD }}>⬆ Will upload</span>
                    <button type="button" onClick={()=>setHistoryImageFile(null)} style={{ fontSize:'0.72rem',color:'#e74c3c',background:'none',border:'none',cursor:'pointer' }}>✕ cancel</button></>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Committee */}
            <div style={card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:'0.5rem' }}>
                <h3 style={{ color:MAROON, margin:0, fontSize:'0.95rem' }}>
                  👥 Current Committee
                  <span style={{ marginLeft:8, background:'#f5ece0', color:MAROON, borderRadius:12, padding:'0.1rem 0.5rem', fontSize:'0.78rem' }}>
                    {committee.length} members
                  </span>
                </h3>
                <button type="button" onClick={addMember}
                  style={{ background:MAROON, color:'#fff', border:'none', borderRadius:20, padding:'0.4rem 1rem', cursor:'pointer', fontSize:'0.85rem', fontWeight:600, whiteSpace:'nowrap' }}>
                  + Add Member
                </button>
              </div>

              {committee.length === 0 && (
                <div style={{ textAlign:'center', padding:'2rem', color:'#aaa', background:'#faf6f1', borderRadius:8, border:'1px dashed #ddd' }}>
                  <p style={{ fontSize:'1.5rem' }}>👥</p>
                  <p style={{ marginTop:'0.5rem' }}>No committee members yet. Click "+ Add Member" above.</p>
                </div>
              )}

              {committee.map((m, i) => (
                <div key={i} style={{ background:'#faf6f1', border:'1px solid #e8e0d8', borderRadius:8, padding:'1rem', marginBottom:'0.75rem', borderLeft:`3px solid ${MAROON}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.85rem', flexWrap:'wrap', gap:'0.5rem' }}>
                    <span style={{ fontWeight:700, color:MAROON, fontSize:'0.85rem' }}>
                      #{i+1} {m.name || '(no name yet)'}
                    </span>
                    <button type="button" onClick={()=>removeMember(i)}
                      style={{ background:'#e74c3c', color:'#fff', border:'none', borderRadius:6, padding:'0.3rem 0.7rem', cursor:'pointer', fontSize:'0.8rem' }}>
                      ✕ Remove
                    </button>
                  </div>

                  <div className="about-grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'0.75rem', marginBottom:'0.85rem' }}>
                    <div>
                      <label style={lbl}>Name *</label>
                      <input value={m.name} required placeholder="Full name"
                        onChange={e=>updateMember(i,'name',e.target.value)} style={inp}
                        onFocus={e=>e.target.style.borderColor=MAROON} onBlur={e=>e.target.style.borderColor='#ddd'}/>
                    </div>
                    <div>
                      <label style={lbl}>Position *</label>
                      <input value={m.position} required placeholder="e.g. President"
                        onChange={e=>updateMember(i,'position',e.target.value)} style={inp}
                        onFocus={e=>e.target.style.borderColor=MAROON} onBlur={e=>e.target.style.borderColor='#ddd'}/>
                    </div>
                    <div>
                      <label style={lbl}>Phone</label>
                      <input value={m.phone} placeholder="+91 XXXXX XXXXX"
                        onChange={e=>updateMember(i,'phone',e.target.value)} style={inp}
                        onFocus={e=>e.target.style.borderColor=MAROON} onBlur={e=>e.target.style.borderColor='#ddd'}/>
                    </div>
                  </div>

                  {/* Photo */}
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', background:'rgba(255,255,255,0.6)', borderRadius:6, padding:'0.6rem' }}>
                    {m.photo && (
                      <div style={{ textAlign:'center', flexShrink:0 }}>
                        <img src={m.photo} alt={m.name} style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:`2px solid ${MAROON}`, display:'block' }}/>
                        <span style={{ fontSize:'0.62rem', color:'#27ae60', display:'block', marginTop:2 }}>✅ saved</span>
                      </div>
                    )}
                    {newPhotos[i] instanceof File && (
                      <div style={{ textAlign:'center', flexShrink:0 }}>
                        <img src={URL.createObjectURL(newPhotos[i])} alt="preview"
                          style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:`2px solid ${GOLD}`, display:'block' }}/>
                        <span style={{ fontSize:'0.62rem', color:GOLD, display:'block', marginTop:2 }}>⬆ new</span>
                      </div>
                    )}
                    <div style={{ flex:1, minWidth:180 }}>
                      <label style={{ ...lbl, marginBottom:'0.4rem' }}>
                        {m.photo ? '📷 Replace photo' : '📷 Upload photo'} → Cloudinary
                      </label>
                      <input type="file" accept="image/*" style={{ fontSize:'0.82rem', width:'100%' }}
                        onChange={e=>setNewPhoto(i, e.target.files[0]||null)}/>
                      {newPhotos[i] instanceof File && (
                        <button type="button" onClick={()=>setNewPhoto(i,null)}
                          style={{ marginTop:'0.3rem', fontSize:'0.72rem', color:'#e74c3c', background:'none', border:'none', cursor:'pointer' }}>
                          ✕ Cancel new photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button — sticky footer */}
            <div style={{ position:'sticky', bottom:0, background:'#f5f0eb', padding:'1rem 0', borderTop:'2px solid #e8ddd5', marginTop:'0.5rem' }}>
              <button type="submit" disabled={loading} style={{
                background: loading ? '#9a3a3a' : MAROON,
                color:'#fff', border:'none', borderRadius:8,
                padding:'0.9rem 2rem', fontSize:'1rem', fontWeight:700,
                cursor: loading ? 'not-allowed' : 'pointer',
                width:'100%', maxWidth:340, display:'block',
                transition:'background 0.2s',
              }}>
                {loading ? '⏳ Saving... please wait' : aboutId ? '💾 Update About Page' : '✅ Create About Page'}
              </button>
              <p style={{ fontSize:'0.72rem', color:'#aaa', marginTop:'0.4rem' }}>
                {aboutId ? `Updating record: ${aboutId}` : 'Will create new about page'}
              </p>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

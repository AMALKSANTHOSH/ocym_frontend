// src/pages/admin/AdminMembers.js
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const BLOOD_GROUPS=['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];

export default function AdminMembers() {
  const [members, setMembers]     = useState([]);
  const [filter, setFilter]       = useState('all');
  const [msg, setMsg]             = useState({type:'',text:''});
  const [uploadingId, setUploadingId] = useState(null);
  const [editMember, setEditMember]   = useState(null);

  const load = () => api.get('/members/all').then(r=>setMembers(r.data)).catch(()=>{});
  useEffect(() => { load(); }, []);

  const showMsg = (type,text) => { setMsg({type,text}); setTimeout(()=>setMsg({type:'',text:''}),3000); };

  const handleApprove = async id => {
    try { await api.put(`/members/${id}/approve`); showMsg('success','Member approved!'); load(); }
    catch { showMsg('error','Failed to approve'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Remove this member?')) return;
    await api.delete(`/members/${id}`); showMsg('success','Member removed'); load();
  };

  const handlePhotoUpload = async (id, file) => {
    if (!file) return;
    setUploadingId(id);
    const data = new FormData(); data.append('photo', file);
    try { await api.put(`/members/${id}/photo`, data); showMsg('success','Photo updated!'); load(); }
    catch { showMsg('error','Photo upload failed'); }
    finally { setUploadingId(null); }
  };

  const handleEditSave = async () => {
    if (!editMember) return;
    const data = new FormData();
    ['name','phone','address','dob','bloodGroup'].forEach(k => { if(editMember[k]) data.append(k, editMember[k]); });
    data.append('isApproved', editMember.isApproved);
    try { await api.put(`/members/${editMember._id}`, data); showMsg('success','Member updated!'); setEditMember(null); load(); }
    catch { showMsg('error','Update failed'); }
  };

  const filtered = members.filter(m => {
    if (filter==='pending')  return !m.isApproved;
    if (filter==='approved') return m.isApproved;
    return true;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar/>
      <div className="admin-main">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <h2>👥 Members</h2>
          <a href="/admin/blood-list" style={{background:'#c9a227',color:'#1a0a0a',textDecoration:'none',padding:'0.5rem 1rem',borderRadius:20,fontSize:'0.85rem',fontWeight:700}}>
            🩸 Blood Group List
          </a>
        </div>

        {msg.text && <div className={`alert alert-${msg.type==='success'?'success':'error'}`}>{msg.text}</div>}

        <div style={{display:'flex',gap:'0.75rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          {['all','pending','approved'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`btn btn-sm ${filter===f?'btn-primary':''}`}
              style={filter!==f?{background:'#fff',border:'1.5px solid #ddd',color:'#555'}:{}}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
              {f==='pending' && members.filter(m=>!m.isApproved).length>0 && (
                <span style={{marginLeft:'0.4rem',background:'#e74c3c',color:'#fff',borderRadius:10,padding:'0.1rem 0.4rem',fontSize:'0.7rem'}}>
                  {members.filter(m=>!m.isApproved).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Photo</th><th>Name</th><th>Email</th><th>Phone</th><th>Blood</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan="7" style={{textAlign:'center',color:'#888',padding:'2rem'}}>No members found</td></tr>
              ) : filtered.map(m=>(
                <tr key={m._id}>
                  <td>
                    <div style={{position:'relative',display:'inline-block'}}>
                      <div style={{width:42,height:42,borderRadius:'50%',overflow:'hidden',border:'2px solid #6b1a1a',background:'#f5ece0',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {m.photo ? <img src={m.photo} alt={m.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:'1.1rem'}}>👤</span>}
                      </div>
                      <label style={{position:'absolute',bottom:-4,right:-4,background:'#6b1a1a',color:'#fff',borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'0.6rem'}} title="Upload photo">
                        📷<input type="file" accept="image/*" style={{display:'none'}} onChange={e=>handlePhotoUpload(m._id,e.target.files[0])}/>
                      </label>
                    </div>
                    {uploadingId===m._id && <span style={{fontSize:'0.65rem',color:'#888',display:'block'}}>uploading...</span>}
                  </td>
                  <td><strong>{m.name}</strong></td>
                  <td style={{fontSize:'0.8rem'}}>{m.email}</td>
                  <td>{m.phone||'—'}</td>
                  <td>
                    <span style={{background:m.bloodGroup&&m.bloodGroup!=='Unknown'?'#f5e0e0':'#eee',color:m.bloodGroup&&m.bloodGroup!=='Unknown'?'#6b1a1a':'#888',padding:'0.15rem 0.5rem',borderRadius:12,fontSize:'0.78rem',fontWeight:700}}>
                      {m.bloodGroup||'?'}
                    </span>
                  </td>
                  <td><span className={`badge ${m.isApproved?'badge-green':'badge-yellow'}`}>{m.isApproved?'Approved':'Pending'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                      {!m.isApproved && <button className="btn btn-sm btn-success" onClick={()=>handleApprove(m._id)}>Approve</button>}
                      <button className="btn btn-sm btn-primary" onClick={()=>setEditMember({...m})}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(m._id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit modal */}
        {editMember && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}}>
            <div style={{background:'#fff',borderRadius:12,padding:'2rem',width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto'}}>
              <h3 style={{color:'#6b1a1a',marginBottom:'1.25rem',fontFamily:'Georgia,serif'}}>Edit Member</h3>
              {[{n:'name',l:'Name',t:'text'},{n:'phone',l:'Phone',t:'text'},{n:'address',l:'Address',t:'text'},{n:'dob',l:'Date of Birth',t:'date'}].map(f=>(
                <div key={f.n} className="form-group">
                  <label>{f.l}</label>
                  <input type={f.t} value={editMember[f.n]||''} onChange={e=>setEditMember({...editMember,[f.n]:e.target.value})}/>
                </div>
              ))}
              <div className="form-group">
                <label>Blood Group</label>
                <select value={editMember.bloodGroup||'Unknown'} onChange={e=>setEditMember({...editMember,bloodGroup:e.target.value})}>
                  {BLOOD_GROUPS.map(b=><option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div style={{display:'flex',gap:'0.75rem',marginTop:'1rem'}}>
                <button className="btn btn-primary" onClick={handleEditSave} style={{flex:1}}>Save Changes</button>
                <button className="btn btn-sm" onClick={()=>setEditMember(null)} style={{background:'#eee',color:'#555',borderRadius:7,padding:'0.6rem 1rem',border:'none',cursor:'pointer'}}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// src/pages/admin/AdminEvents.js
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const emptyForm = {title:'',description:'',date:'',time:'',location:'',category:'other',image:null};

export default function AdminEvents() {
  const [events,setEvents] = useState([]);
  const [form,setForm]     = useState(emptyForm);
  const [editId,setEditId] = useState(null);
  const [msg,setMsg]       = useState({type:'',text:''});
  const [loading,setLoading] = useState(false);
  const [showForm,setShowForm] = useState(false);

  const load = () => api.get('/events').then(r=>setEvents(r.data)).catch(()=>{});
  useEffect(()=>{load();},[]);
  const showMsg=(type,text)=>{setMsg({type,text});setTimeout(()=>setMsg({type:'',text:''}),3000);};

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    const data=new FormData();
    Object.entries(form).forEach(([k,v])=>{if(v)data.append(k,v);});
    try{
      if(editId){await api.put(`/events/${editId}`,data);showMsg('success','Event updated!');}
      else{await api.post('/events',data);showMsg('success','Event created!');}
      setForm(emptyForm);setEditId(null);setShowForm(false);load();
    }catch(err){showMsg('error',err.response?.data?.message||'Error saving');}
    finally{setLoading(false);}
  };

  const handleEdit = ev => {
    setForm({title:ev.title,description:ev.description,date:ev.date?.slice(0,10),time:ev.time||'',location:ev.location||'',category:ev.category,image:null});
    setEditId(ev._id);setShowForm(true);window.scrollTo({top:0,behavior:'smooth'});
  };

  const handleDelete = async id => {
    if(!window.confirm('Delete this event?'))return;
    await api.delete(`/events/${id}`);showMsg('success','Event deleted');load();
  };

  return(
    <div className="admin-layout">
      <AdminSidebar/>
      <div className="admin-main">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <h2>📅 Events</h2>
          <button className="btn btn-primary" onClick={()=>{setForm(emptyForm);setEditId(null);setShowForm(!showForm);}}>
            {showForm?'Cancel':'+ Add Event'}
          </button>
        </div>
        {msg.text&&<div className={`alert alert-${msg.type==='success'?'success':'error'}`}>{msg.text}</div>}

        {showForm&&(
          <div className="card" style={{padding:'1.5rem',marginBottom:'2rem'}}>
            <h3 style={{color:'#6b1a1a',marginBottom:'1rem',fontFamily:'Georgia,serif'}}>{editId?'Edit Event':'Add New Event'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group"><label>Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {['conference','prayer','retreat','celebration','other'].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/></div>
                <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div>
                <div className="form-group"><label>Location</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
                <div className="form-group"><label>Image → uploaded to Cloudinary</label><input type="file" accept="image/*" onChange={e=>setForm({...form,image:e.target.files[0]})}/></div>
              </div>
              <div className="form-group"><label>Description *</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Saving...':(editId?'Update Event':'Create Event')}</button>
            </form>
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead><tr><th>Image</th><th>Title</th><th>Date</th><th>Category</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>
              {events.length===0?(
                <tr><td colSpan="6" style={{textAlign:'center',color:'#888',padding:'2rem'}}>No events yet</td></tr>
              ):events.map(ev=>(
                <tr key={ev._id}>
                  <td>{ev.image&&<img src={ev.image} alt="" style={{width:50,height:40,objectFit:'cover',borderRadius:4}}/>}</td>
                  <td><strong>{ev.title}</strong></td>
                  <td>{new Date(ev.date).toLocaleDateString('en-IN')}</td>
                  <td><span className="badge badge-maroon">{ev.category}</span></td>
                  <td>{ev.location||'—'}</td>
                  <td><div style={{display:'flex',gap:'0.5rem'}}>
                    <button className="btn btn-sm btn-primary" onClick={()=>handleEdit(ev)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(ev._id)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

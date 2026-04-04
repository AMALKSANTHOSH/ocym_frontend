// src/pages/admin/AdminGallery.js
import React,{useEffect,useState} from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

export default function AdminGallery(){
  const [photos,setPhotos]=useState([]);
  const [form,setForm]=useState({title:'',description:'',category:'general',image:null});
  const [msg,setMsg]=useState({type:'',text:''});
  const [loading,setLoading]=useState(false);
  const [showForm,setShowForm]=useState(false);
  const load=()=>api.get('/gallery').then(r=>setPhotos(r.data)).catch(()=>{});
  useEffect(()=>{load();},[]);
  const showMsg=(t,x)=>{setMsg({type:t,text:x});setTimeout(()=>setMsg({type:'',text:''}),3000);};
  const handleSubmit=async e=>{
    e.preventDefault();if(!form.image)return showMsg('error','Please select an image');
    setLoading(true);const data=new FormData();
    data.append('title',form.title);data.append('description',form.description);
    data.append('category',form.category);data.append('image',form.image);
    try{await api.post('/gallery',data);showMsg('success','Photo uploaded to Cloudinary!');setForm({title:'',description:'',category:'general',image:null});setShowForm(false);load();}
    catch(err){showMsg('error',err.response?.data?.message||'Upload failed');}
    finally{setLoading(false);}
  };
  const handleDelete=async id=>{
    if(!window.confirm('Delete this photo?'))return;
    await api.delete(`/gallery/${id}`);showMsg('success','Photo deleted');load();
  };
  return(
    <div className="admin-layout"><AdminSidebar/>
      <div className="admin-main">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <h2>🖼️ Gallery</h2>
          <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}>{showForm?'Cancel':'+ Upload Photo'}</button>
        </div>
        {msg.text&&<div className={`alert alert-${msg.type==='success'?'success':'error'}`}>{msg.text}</div>}
        {showForm&&(
          <div className="card" style={{padding:'1.5rem',marginBottom:'2rem'}}>
            <h3 style={{color:'#6b1a1a',marginBottom:'1rem'}}>Upload Photo → Cloudinary</h3>
            <form onSubmit={handleSubmit}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group"><label>Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required placeholder="Photo title"/></div>
                <div className="form-group"><label>Category</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="e.g. conference"/></div>
              </div>
              <div className="form-group"><label>Description</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Optional"/></div>
              <div className="form-group"><label>Image * (stored on Cloudinary)</label><input type="file" accept="image/*" onChange={e=>setForm({...form,image:e.target.files[0]})} required/></div>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Uploading to Cloudinary...':'Upload Photo'}</button>
            </form>
          </div>
        )}
        {photos.length===0?(
          <div style={{textAlign:'center',padding:'3rem',color:'#888',background:'#fff',borderRadius:10}}>No photos uploaded yet.</div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1rem'}}>
            {photos.map(p=>(
              <div key={p._id} className="card">
                <img src={p.image} alt={p.title} style={{width:'100%',height:150,objectFit:'cover'}}/>
                <div style={{padding:'0.75rem'}}>
                  <p style={{fontWeight:600,fontSize:'0.85rem',color:'#6b1a1a'}}>{p.title}</p>
                  <span style={{fontSize:'0.75rem',color:'#888'}}>{p.category}</span>
                  <div style={{marginTop:'0.5rem'}}><button className="btn btn-sm btn-danger" onClick={()=>handleDelete(p._id)} style={{width:'100%'}}>Delete</button></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

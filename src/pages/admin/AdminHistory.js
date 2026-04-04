// src/pages/admin/AdminHistory.js
import React,{useEffect,useState} from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const emptyMember={name:'',position:'',phone:'',photo:''};

export default function AdminHistory(){
  const [years,setYears]=useState([]);
  const [selId,setSelId]=useState(null);
  const [yearData,setYearData]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [msg,setMsg]=useState({type:'',text:''});
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({year:'',description:''});
  const [images,setImages]=useState([]);
  const [keepImages,setKeepImages]=useState([]);
  const [committee,setCommittee]=useState([{...emptyMember}]);
  const [committeePhotos,setCommitteePhotos]=useState([null]);

  const load=()=>api.get('/history').then(r=>setYears(r.data)).catch(()=>{});
  useEffect(()=>{load();},[]);
  const showMsg=(t,x)=>{setMsg({type:t,text:x});setTimeout(()=>setMsg({type:'',text:''}),4000);};

  const handleEdit=async year=>{
    const res=await api.get(`/history/${year.year}`);const d=res.data;
    setSelId(d._id);setForm({year:d.year,description:d.description||''});
    setKeepImages(d.images||[]);setImages([]);
    const cm=d.committee?.length?d.committee.map(m=>({name:m.name,position:m.position,phone:m.phone||'',photo:m.photo||''})):[{...emptyMember}];
    setCommittee(cm);setCommitteePhotos(cm.map(()=>null));
    setShowForm(true);window.scrollTo({top:0,behavior:'smooth'});
  };

  const handleNew=()=>{
    setSelId(null);setForm({year:'',description:''});setImages([]);setKeepImages([]);
    setCommittee([{...emptyMember}]);setCommitteePhotos([null]);setShowForm(true);
  };

  const addMember=()=>{setCommittee([...committee,{...emptyMember}]);setCommitteePhotos([...committeePhotos,null]);};
  const removeMember=i=>{setCommittee(committee.filter((_,idx)=>idx!==i));setCommitteePhotos(committeePhotos.filter((_,idx)=>idx!==i));};
  const updateMember=(i,f,v)=>{const u=[...committee];u[i]={...u[i],[f]:v};setCommittee(u);};
  const updateCPhoto=(i,file)=>{const u=[...committeePhotos];u[i]=file;setCommitteePhotos(u);};
  const removeKeepImg=url=>setKeepImages(keepImages.filter(x=>x!==url));

  const handleSubmit=async e=>{
    e.preventDefault();setLoading(true);
    const data=new FormData();
    data.append('year',form.year);data.append('description',form.description);
    data.append('keepImages',JSON.stringify(keepImages));
    images.forEach(f=>data.append('images',f));
    const cmJson=committee.map(m=>({name:m.name,position:m.position,phone:m.phone,photo:typeof m.photo==='string'?m.photo:''}));
    data.append('committee',JSON.stringify(cmJson));
    committeePhotos.forEach(f=>data.append('committeePhotos',f||new Blob()));
    try{
      if(selId){await api.put(`/history/${selId}`,data);showMsg('success','Year updated!');}
      else{await api.post('/history',data);showMsg('success','Year created!');}
      setShowForm(false);load();
    }catch(err){showMsg('error',err.response?.data?.message||'Error saving');}
    finally{setLoading(false);}
  };

  const handleDelete=async id=>{
    if(!window.confirm('Delete this year record?'))return;
    await api.delete(`/history/${id}`);showMsg('success','Deleted');load();
  };

  return(
    <div className="admin-layout"><AdminSidebar/>
      <div className="admin-main">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <h2>🗓️ Year-wise History</h2>
          <button className="btn btn-primary" onClick={showForm?()=>setShowForm(false):handleNew}>{showForm?'Cancel':'+ Add Year'}</button>
        </div>
        {msg.text&&<div className={`alert alert-${msg.type==='success'?'success':'error'}`}>{msg.text}</div>}

        {showForm&&(
          <div className="card" style={{padding:'1.5rem',marginBottom:'2rem'}}>
            <h3 style={{color:'#6b1a1a',marginBottom:'1.25rem',fontFamily:'Georgia,serif'}}>{selId?'Edit Year':'Add New Year'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:'1rem',marginBottom:'1rem'}}>
                <div className="form-group" style={{margin:0}}><label>Year * (e.g. 2025-2026)</label><input value={form.year} onChange={e=>setForm({...form,year:e.target.value})} required placeholder="2025-2026"/></div>
                <div className="form-group" style={{margin:0}}><label>Description</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Summary of the year"/></div>
              </div>
              <div className="form-group">
                <label>Activity Images → all uploaded to Cloudinary (select multiple)</label>
                <input type="file" accept="image/*" multiple onChange={e=>setImages([...e.target.files])}/>
                {images.length>0&&<p style={{fontSize:'0.8rem',color:'#888',marginTop:'0.3rem'}}>{images.length} new image(s) selected</p>}
              </div>
              {keepImages.length>0&&(
                <div style={{marginBottom:'1rem'}}>
                  <label style={{fontSize:'0.875rem',fontWeight:500,color:'#555',display:'block',marginBottom:'0.5rem'}}>Existing Images (click ✕ to remove)</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                    {keepImages.map((img,i)=>(
                      <div key={i} style={{position:'relative',width:70,height:70}}>
                        <img src={img} alt="" style={{width:70,height:70,objectFit:'cover',borderRadius:6}}/>
                        <button type="button" onClick={()=>removeKeepImg(img)} style={{position:'absolute',top:-6,right:-6,background:'#e74c3c',color:'#fff',border:'none',borderRadius:'50%',width:20,height:20,cursor:'pointer',fontSize:'0.7rem'}}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{marginBottom:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                  <label style={{fontSize:'0.875rem',fontWeight:600,color:'#6b1a1a'}}>Committee Members</label>
                  <button type="button" className="btn btn-sm btn-primary" onClick={addMember}>+ Add Member</button>
                </div>
                {committee.map((m,i)=>(
                  <div key={i} style={{background:'#f8fafc',border:'1px solid #e0e7ef',borderRadius:8,padding:'1rem',marginBottom:'0.75rem'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:'0.75rem',alignItems:'end'}}>
                      <div className="form-group" style={{margin:0}}><label>Name *</label><input value={m.name} onChange={e=>updateMember(i,'name',e.target.value)} required placeholder="Full name"/></div>
                      <div className="form-group" style={{margin:0}}><label>Position *</label><input value={m.position} onChange={e=>updateMember(i,'position',e.target.value)} required placeholder="e.g. President"/></div>
                      <div className="form-group" style={{margin:0}}><label>Phone</label><input value={m.phone} onChange={e=>updateMember(i,'phone',e.target.value)} placeholder="+91..."/></div>
                      <button type="button" className="btn btn-sm btn-danger" onClick={()=>removeMember(i)} style={{height:38}}>✕</button>
                    </div>
                    <div style={{marginTop:'0.75rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                      {m.photo&&<img src={m.photo} alt={m.name} style={{width:44,height:44,borderRadius:'50%',objectFit:'cover',border:'2px solid #6b1a1a'}}/>}
                      <div>
                        <label style={{fontSize:'0.8rem',color:'#555',display:'block',marginBottom:'0.2rem'}}>{m.photo?'Replace photo → Cloudinary':'Upload photo → Cloudinary'}</label>
                        <input type="file" accept="image/*" onChange={e=>updateCPhoto(i,e.target.files[0])} style={{fontSize:'0.8rem'}}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading?'Uploading to Cloudinary...':(selId?'Update Year':'Create Year')}
              </button>
            </form>
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead><tr><th>Year</th><th>Description</th><th>Images</th><th>Committee</th><th>Actions</th></tr></thead>
            <tbody>
              {years.length===0?(
                <tr><td colSpan="5" style={{textAlign:'center',padding:'2rem',color:'#888'}}>No years added yet</td></tr>
              ):years.map(y=>(
                <tr key={y._id}>
                  <td><strong style={{color:'#6b1a1a'}}>{y.year}</strong></td>
                  <td style={{fontSize:'0.85rem',color:'#666',maxWidth:250}}>{y.description?.slice(0,70)||'—'}</td>
                  <td>{y.images?.length||0} photos</td>
                  <td>{y.committee?.length||0} members</td>
                  <td><div style={{display:'flex',gap:'0.5rem'}}>
                    <button className="btn btn-sm btn-primary" onClick={()=>handleEdit(y)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(y._id)}>Delete</button>
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

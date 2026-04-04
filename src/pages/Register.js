// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const M='#6b1a1a';
const BLOOD_GROUPS=['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];

export default function Register() {
  const navigate=useNavigate();
  const [form,setForm]=useState({name:'',email:'',password:'',phone:'',address:'',dob:'',bloodGroup:'Unknown'});
  const [photo,setPhoto]=useState(null);
  const [preview,setPreview]=useState(null);
  const [msg,setMsg]=useState({type:'',text:''});
  const [loading,setLoading]=useState(false);

  const handlePhoto=e=>{
    const f=e.target.files[0];
    if(f){setPhoto(f);setPreview(URL.createObjectURL(f));}
  };

  const handleSubmit=async e=>{
    e.preventDefault();setLoading(true);setMsg({type:'',text:''});
    const data=new FormData();
    Object.entries(form).forEach(([k,v])=>{if(v)data.append(k,v);});
    if(photo)data.append('photo',photo);
    try{
      const res=await api.post('/auth/register',data);
      setMsg({type:'success',text:res.data.message});
      setTimeout(()=>navigate('/login'),2500);
    }catch(err){setMsg({type:'error',text:err.response?.data?.message||'Registration failed'});}
    finally{setLoading(false);}
  };

  const inp={width:'100%',padding:'0.65rem 0.9rem',border:'1.5px solid #ddd',borderRadius:7,fontSize:'0.9rem',outline:'none',fontFamily:'inherit',transition:'border-color 0.2s'};

  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#4a0e0e,#6b1a1a)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{background:'#fff',padding:'2.5rem',borderRadius:14,boxShadow:'0 8px 32px rgba(0,0,0,0.3)',width:'100%',maxWidth:520}}>
        <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
          <img src="/ocym-logo.png" alt="OCYM" style={{height:65,marginBottom:'0.75rem'}}/>
          <h2 style={{color:M,fontFamily:'Georgia,serif',fontSize:'1.5rem',marginBottom:'0.2rem'}}>Join OCYM</h2>
          <p style={{color:'#888',fontSize:'0.85rem'}}>Register as a member of St. George OCYM Kuzhimattom</p>
        </div>

        {msg.text&&<div className={`alert alert-${msg.type==='success'?'success':'error'}`}>{msg.text}</div>}

        <form onSubmit={handleSubmit}>
          {/* Photo upload */}
          <div style={{textAlign:'center',marginBottom:'1.25rem'}}>
            <div style={{width:85,height:85,borderRadius:'50%',margin:'0 auto 0.6rem',overflow:'hidden',border:`3px solid ${M}`,background:'#f5ece0',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {preview?<img src={preview} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:'2rem'}}>👤</span>}
            </div>
            <label style={{display:'inline-block',padding:'0.35rem 1rem',background:M,color:'#fff',borderRadius:20,cursor:'pointer',fontSize:'0.82rem',fontWeight:500}}>
              📷 Upload Photo
              <input type="file" accept="image/*" onChange={handlePhoto} style={{display:'none'}}/>
            </label>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
            <div style={{gridColumn:'span 2'}}>
              <label style={{display:'block',marginBottom:'0.25rem',fontSize:'0.82rem',fontWeight:500,color:'#555'}}>Full Name *</label>
              <input value={form.name} required placeholder="Your full name" onChange={e=>setForm({...form,name:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
            </div>
            <div>
              <label style={{display:'block',marginBottom:'0.25rem',fontSize:'0.82rem',fontWeight:500,color:'#555'}}>Email *</label>
              <input type="email" value={form.email} required placeholder="your@email.com" onChange={e=>setForm({...form,email:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
            </div>
            <div>
              <label style={{display:'block',marginBottom:'0.25rem',fontSize:'0.82rem',fontWeight:500,color:'#555'}}>Password *</label>
              <input type="password" value={form.password} required placeholder="Min 6 characters" onChange={e=>setForm({...form,password:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
            </div>
            <div>
              <label style={{display:'block',marginBottom:'0.25rem',fontSize:'0.82rem',fontWeight:500,color:'#555'}}>Phone</label>
              <input value={form.phone} placeholder="+91 XXXXX XXXXX" onChange={e=>setForm({...form,phone:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
            </div>
            <div>
              <label style={{display:'block',marginBottom:'0.25rem',fontSize:'0.82rem',fontWeight:500,color:'#555'}}>Blood Group *</label>
              <select value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} style={{...inp,background:'#fff'}}>
                {BLOOD_GROUPS.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:'block',marginBottom:'0.25rem',fontSize:'0.82rem',fontWeight:500,color:'#555'}}>Date of Birth</label>
              <input type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
            </div>
            <div style={{gridColumn:'span 2'}}>
              <label style={{display:'block',marginBottom:'0.25rem',fontSize:'0.82rem',fontWeight:500,color:'#555'}}>Address</label>
              <input value={form.address} placeholder="Your address" onChange={e=>setForm({...form,address:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{width:'100%',padding:'0.8rem',background:M,color:'#fff',border:'none',borderRadius:7,fontSize:'1rem',fontWeight:700,cursor:'pointer',marginTop:'1rem',opacity:loading?0.7:1}}>
            {loading?'Registering...':'Register'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1rem',fontSize:'0.875rem',color:'#666'}}>
          Already a member? <Link to="/login" style={{color:M,fontWeight:600}}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

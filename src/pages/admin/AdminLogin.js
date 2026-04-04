// src/pages/admin/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const M='#6b1a1a';
export default function AdminLogin() {
  const navigate=useNavigate(); const {login}=useAuth();
  const [form,setForm]=useState({email:'',password:''});
  const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false);
  const inp={width:'100%',padding:'0.7rem 0.9rem',border:'1.5px solid #ddd',borderRadius:7,fontSize:'0.9rem',outline:'none',fontFamily:'inherit'};

  const handleSubmit=async e=>{
    e.preventDefault();setLoading(true);setMsg('');
    try{const res=await api.post('/admin/login',form);login(res.data.token,res.data.user);navigate('/admin');}
    catch(err){setMsg(err.response?.data?.message||'Login failed');}
    finally{setLoading(false);}
  };

  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#4a0e0e,#2a0808)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{background:'#fff',padding:'2.5rem',borderRadius:14,boxShadow:'0 8px 32px rgba(0,0,0,0.4)',width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <img src="/ocym-logo.png" alt="OCYM" style={{height:70,marginBottom:'0.75rem'}}/>
          <h2 style={{color:M,fontFamily:'Georgia,serif',fontSize:'1.5rem',marginBottom:'0.2rem'}}>Admin Login</h2>
          <p style={{color:'#888',fontSize:'0.85rem'}}>St. George OCYM Kuzhimattom</p>
        </div>
        {msg&&<div className="alert alert-error">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'0.3rem',fontSize:'0.875rem',fontWeight:500,color:'#555'}}>Admin Email</label>
            <input type="email" value={form.email} required placeholder="admin@ocymkuzhimattom.com"
              onChange={e=>setForm({...form,email:e.target.value})} style={inp}
              onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
          </div>
          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',marginBottom:'0.3rem',fontSize:'0.875rem',fontWeight:500,color:'#555'}}>Password</label>
            <input type="password" value={form.password} required placeholder="Admin password"
              onChange={e=>setForm({...form,password:e.target.value})} style={inp}
              onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
          </div>
          <button type="submit" disabled={loading} style={{width:'100%',padding:'0.8rem',background:M,color:'#fff',border:'none',borderRadius:7,fontSize:'1rem',fontWeight:700,cursor:'pointer',opacity:loading?0.7:1}}>
            {loading?'Logging in...':'Login as Admin'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.25rem',fontSize:'0.85rem'}}>
          <a href="/" style={{color:'#888',textDecoration:'none'}}>← Back to website</a>
        </p>
      </div>
    </div>
  );
}

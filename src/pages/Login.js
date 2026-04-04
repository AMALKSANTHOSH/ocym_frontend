// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const M='#6b1a1a', G='#c9a227';
const inp={width:'100%',padding:'0.7rem 0.9rem',border:'1.5px solid #ddd',borderRadius:7,fontSize:'0.9rem',outline:'none',fontFamily:'inherit'};

export default function Login() {
  const navigate=useNavigate(); const {login}=useAuth();
  const [form,setForm]=useState({email:'',password:''});
  const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false);

  const handleSubmit=async e=>{
    e.preventDefault();setLoading(true);setMsg('');
    try{const res=await api.post('/auth/login',form);login(res.data.token,res.data.user);navigate('/');}
    catch(err){setMsg(err.response?.data?.message||'Login failed');}
    finally{setLoading(false);}
  };

  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#4a0e0e,#6b1a1a)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{background:'#fff',padding:'2.5rem',borderRadius:14,boxShadow:'0 8px 32px rgba(0,0,0,0.3)',width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:'1.75rem'}}>
          <img src="/ocym-logo.png" alt="OCYM" style={{height:70,marginBottom:'0.75rem'}}/>
          <h2 style={{color:M,fontFamily:'Georgia,serif',fontSize:'1.5rem',marginBottom:'0.2rem'}}>Member Login</h2>
          <p style={{color:'#888',fontSize:'0.85rem'}}>Welcome back to St. George OCYM Kuzhimattom</p>
        </div>
        {msg&&<div className="alert alert-error">{msg}</div>}
        <form onSubmit={handleSubmit}>
          {[{n:'email',l:'Email',t:'email',p:'your@email.com'},{n:'password',l:'Password',t:'password',p:'Your password'}].map(f=>(
            <div key={f.n} style={{marginBottom:'1rem'}}>
              <label style={{display:'block',marginBottom:'0.3rem',fontSize:'0.875rem',fontWeight:500,color:'#555'}}>{f.l}</label>
              <input type={f.t} value={form[f.n]} required placeholder={f.p}
                onChange={e=>setForm({...form,[f.n]:e.target.value})} style={inp}
                onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
            </div>
          ))}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'0.8rem',background:M,color:'#fff',border:'none',borderRadius:7,fontSize:'1rem',fontWeight:700,cursor:'pointer',opacity:loading?0.7:1,marginTop:'0.5rem'}}>
            {loading?'Logging in...':'Login'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1rem',fontSize:'0.875rem',color:'#666'}}>
          Not a member? <Link to="/register" style={{color:M,fontWeight:600}}>Register here</Link>
        </p>
        <p style={{textAlign:'center',marginTop:'0.5rem',fontSize:'0.85rem'}}>
          <Link to="/admin/login" style={{color:G,fontWeight:500}}>Admin Login →</Link>
        </p>
      </div>
    </div>
  );
}

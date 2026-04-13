// src/pages/Contact.js
import React, { useState } from 'react';
import api from '../api/axios';
const M='#6b1a1a', G='#c9a227';

export default function Contact() {
  const [form, setForm]     = useState({name:'',email:'',phone:'',subject:'',message:''});
  const [msg, setMsg]       = useState({type:'',text:''});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setMsg({type:'success', text: res.data.message});
      setForm({name:'',email:'',phone:'',subject:'',message:''});
    } catch { setMsg({type:'error', text:'Failed to send. Please try again.'}); }
    finally { setLoading(false); }
  };

  const inp = {width:'100%',padding:'0.65rem 0.9rem',border:'1.5px solid #ddd',borderRadius:7,fontSize:'0.9rem',outline:'none',fontFamily:'inherit',transition:'border-color 0.2s'};

  return (
    <div>
      <div style={{background:'linear-gradient(135deg,#4a0e0e,#6b1a1a)',padding:'3rem 2rem',textAlign:'center',color:'#fff'}}>
        <img src="/ocym-logo.png" alt="" style={{height:55,marginBottom:'0.75rem',opacity:0.85}}/>
        <h1 style={{fontSize:'2rem',fontFamily:'Georgia,serif',marginBottom:'0.4rem'}}>Contact Us</h1>
        <p style={{color:'#e0c8c8',fontSize:'0.95rem'}}>Get in touch with St. George OCYM Kuzhimattom</p>
      </div>
      <div style={{background:G,height:4}}/>

      <section style={{padding:'4rem 2rem',background:'#faf6f1'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'3rem',alignItems:'start'}}>
          <div>
            <h2 style={{color:M,marginBottom:'1.5rem',fontFamily:'Georgia,serif',fontSize:'1.4rem'}}>Reach Us</h2>
            {[{icon:'📍',label:'Address',value:'Kuzhimattom, Kottayam, Kerala, India'},
              {icon:'📞',label:'Phone',value:'+91 7558043864'},
              {icon:'✉️',label:'Email',value:'ocymkuzhimattom@gmail.com'}].map(c=>(
              <div key={c.label} style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',alignItems:'flex-start'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:M,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>{c.icon}</div>
                <div>
                  <p style={{fontWeight:700,color:M,fontSize:'0.9rem'}}>{c.label}</p>
                  <p style={{color:'#666',marginTop:'0.2rem',fontSize:'0.875rem'}}>{c.value}</p>
                </div>
              </div>
            ))}
            <div style={{background:'linear-gradient(135deg,#4a0e0e,#6b1a1a)',borderRadius:10,padding:'1.25rem',marginTop:'1rem',color:'#fff'}}>
              <p style={{fontStyle:'italic',color:G,fontWeight:600,fontSize:'0.85rem',marginBottom:'0.25rem'}}>"Worship · Study · Service"</p>
              <p style={{color:'#e0c8c8',fontSize:'0.78rem',lineHeight:1.6}}>Orthodox Christian Youth Movement<br/>Youth Wing of Malankara Orthodox Syrian Church</p>
            </div>
          </div>

          <div style={{background:'#fff',padding:'2rem',borderRadius:12,boxShadow:'0 4px 20px rgba(107,26,26,0.1)',borderTop:`4px solid ${G}`}}>
            <h3 style={{color:M,marginBottom:'0.25rem',fontFamily:'Georgia,serif'}}>Send a Message</h3>
            <p style={{color:'#888',fontSize:'0.85rem',marginBottom:'1.5rem'}}>We'll get back to you soon</p>
            {msg.text && <div className={`alert alert-${msg.type==='success'?'success':'error'}`}>{msg.text}</div>}
            <form onSubmit={handleSubmit}>
              {[{n:'name',l:'Full Name *',t:'text',r:true,p:'Your name'},
                {n:'email',l:'Email *',t:'email',r:true,p:'your@email.com'},
                {n:'phone',l:'Phone',t:'text',r:false,p:'+91 XXXXX XXXXX'},
                {n:'subject',l:'Subject *',t:'text',r:true,p:'How can we help?'}].map(f=>(
                <div key={f.n} style={{marginBottom:'0.9rem'}}>
                  <label style={{display:'block',marginBottom:'0.3rem',fontSize:'0.875rem',fontWeight:500,color:'#555'}}>{f.l}</label>
                  <input type={f.t} value={form[f.n]} required={f.r} placeholder={f.p}
                    onChange={e=>setForm({...form,[f.n]:e.target.value})} style={inp}
                    onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
                </div>
              ))}
              <div style={{marginBottom:'0.9rem'}}>
                <label style={{display:'block',marginBottom:'0.3rem',fontSize:'0.875rem',fontWeight:500,color:'#555'}}>Message *</label>
                <textarea value={form.message} required placeholder="Your message..." onChange={e=>setForm({...form,message:e.target.value})}
                  style={{...inp,minHeight:100,resize:'vertical'}}
                  onFocus={e=>e.target.style.borderColor=M} onBlur={e=>e.target.style.borderColor='#ddd'}/>
              </div>
              <button type="submit" disabled={loading} style={{width:'100%',padding:'0.8rem',background:M,color:'#fff',border:'none',borderRadius:7,fontSize:'1rem',fontWeight:700,cursor:'pointer',opacity:loading?0.7:1}}>
                {loading ? 'Sending...' : 'Send Message ✉️'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

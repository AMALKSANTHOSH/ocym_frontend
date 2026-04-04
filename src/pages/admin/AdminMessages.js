// src/pages/admin/AdminMessages.js
import React,{useEffect,useState} from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

export default function AdminMessages(){
  const [messages,setMessages]=useState([]);
  const [selected,setSelected]=useState(null);
  const [msg,setMsg]=useState({type:'',text:''});
  const load=()=>api.get('/contact').then(r=>setMessages(r.data)).catch(()=>{});
  useEffect(()=>{load();},[]);
  const showMsg=(t,x)=>{setMsg({type:t,text:x});setTimeout(()=>setMsg({type:'',text:''}),3000);};
  const markRead=async id=>{await api.put(`/contact/${id}/read`);load();};
  const handleDelete=async id=>{
    if(!window.confirm('Delete this message?'))return;
    await api.delete(`/contact/${id}`);showMsg('success','Message deleted');setSelected(null);load();
  };
  const unread=messages.filter(m=>!m.isRead).length;
  return(
    <div className="admin-layout"><AdminSidebar/>
      <div className="admin-main">
        <h2>✉️ Messages {unread>0&&<span style={{background:'#e74c3c',color:'#fff',borderRadius:20,padding:'0.1rem 0.6rem',fontSize:'0.85rem',marginLeft:'0.5rem'}}>{unread} unread</span>}</h2>
        {msg.text&&<div className={`alert alert-${msg.type==='success'?'success':'error'}`}>{msg.text}</div>}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Status</th><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {messages.length===0?(
                <tr><td colSpan="6" style={{textAlign:'center',color:'#888',padding:'2rem'}}>No messages yet</td></tr>
              ):messages.map(m=>(
                <tr key={m._id} style={{background:m.isRead?'':'#fffdf5'}}>
                  <td><span className={`badge ${m.isRead?'badge-green':'badge-yellow'}`}>{m.isRead?'Read':'New'}</span></td>
                  <td><strong>{m.name}</strong></td>
                  <td style={{fontSize:'0.8rem'}}>{m.email}</td>
                  <td>{m.subject}</td>
                  <td style={{fontSize:'0.8rem'}}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><div style={{display:'flex',gap:'0.4rem'}}>
                    <button className="btn btn-sm btn-primary" onClick={()=>{setSelected(m);if(!m.isRead)markRead(m._id);}}>View</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(m._id)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected&&(
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}}>
            <div style={{background:'#fff',borderRadius:12,padding:'2rem',width:'100%',maxWidth:520}}>
              <h3 style={{color:'#6b1a1a',marginBottom:'1rem',fontFamily:'Georgia,serif'}}>{selected.subject}</h3>
              <p style={{fontSize:'0.85rem',color:'#888',marginBottom:'1rem'}}>From: <strong>{selected.name}</strong> · {selected.email} · {selected.phone||'No phone'}</p>
              <div style={{background:'#faf6f1',borderRadius:8,padding:'1rem',lineHeight:1.8,color:'#555',marginBottom:'1.5rem'}}>{selected.message}</div>
              <div style={{display:'flex',gap:'0.75rem'}}>
                <button className="btn btn-danger" onClick={()=>handleDelete(selected._id)}>Delete</button>
                <button onClick={()=>setSelected(null)} style={{flex:1,padding:'0.65rem',background:'#eee',border:'none',borderRadius:7,cursor:'pointer',fontWeight:600}}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// src/pages/admin/AdminAbout.js
import React,{useEffect,useState} from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const emptyMember={name:'',position:'',phone:'',photo:''};

export default function AdminAbout(){
  const [about,setAbout]=useState(null);
  const [aboutId,setAboutId]=useState(null);
  const [form,setForm]=useState({title:'',content:'',vision:'',mission:'',history:''});
  const [mainImage,setMainImage]=useState(null);
  const [historyImage,setHistoryImage]=useState(null);
  const [committee,setCommittee]=useState([]);
  const [committeePhotos,setCommitteePhotos]=useState([]);
  const [msg,setMsg]=useState({type:'',text:''});
  const [loading,setLoading]=useState(false);
  const showMsg=(t,x)=>{setMsg({type:t,text:x});setTimeout(()=>setMsg({type:'',text:''}),4000);};

  useEffect(()=>{
    api.get('/about').then(r=>{
      if(r.data){const d=r.data;setAbout(d);setAboutId(d._id);
        setForm({title:d.title||'',content:d.content||'',vision:d.vision||'',mission:d.mission||'',history:d.history||''});
        const cm=d.committee||[];
        setCommittee(cm.map(m=>({name:m.name||'',position:m.position||'',phone:m.phone||'',photo:m.photo||''})));
        setCommitteePhotos(cm.map(()=>null));}
    }).catch(()=>{});
  },[]);

  const addMember=()=>{setCommittee([...committee,{...emptyMember}]);setCommitteePhotos([...committeePhotos,null]);};
  const removeMember=i=>{setCommittee(committee.filter((_,idx)=>idx!==i));setCommitteePhotos(committeePhotos.filter((_,idx)=>idx!==i));};
  const updateMember=(i,f,v)=>{const u=[...committee];u[i]={...u[i],[f]:v};setCommittee(u);};
  const updateCPhoto=(i,file)=>{const u=[...committeePhotos];u[i]=file;setCommitteePhotos(u);};

  const handleSubmit=async e=>{
    e.preventDefault();setLoading(true);
    const data=new FormData();
    Object.entries(form).forEach(([k,v])=>{if(v)data.append(k,v);});
    if(mainImage)data.append('image',mainImage);
    if(historyImage)data.append('historyImage',historyImage);
    const cmJson=committee.map(m=>({name:m.name,position:m.position,phone:m.phone,photo:typeof m.photo==='string'?m.photo:''}));
    data.append('committee',JSON.stringify(cmJson));
    committeePhotos.forEach(f=>data.append('committeePhotos',f||new Blob()));
    try{
      if(aboutId){await api.put(`/about/${aboutId}`,data);showMsg('success','About page updated!');}
      else{await api.post('/about',data);showMsg('success','About page created!');}
    }catch(err){showMsg('error',err.response?.data?.message||'Save failed');}
    finally{setLoading(false);}
  };

  const s={background:'#fff',borderRadius:10,padding:'1.5rem',marginBottom:'1.25rem',boxShadow:'0 1px 6px rgba(0,0,0,0.06)'};
  return(
    <div className="admin-layout"><AdminSidebar/>
      <div className="admin-main">
        <h2>📄 About Page</h2>
        {msg.text&&<div className={`alert alert-${msg.type==='success'?'success':'error'}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s}>
            <h3 style={{color:'#6b1a1a',marginBottom:'1rem'}}>📝 Main Content</h3>
            <div className="form-group"><label>Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required placeholder="About St. George OCYM Kuzhimattom"/></div>
            <div className="form-group"><label>Main Description *</label><textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required style={{minHeight:110}} placeholder="Main description..."/></div>
            <div className="form-group"><label>Main Banner Image → Cloudinary</label>
              <input type="file" accept="image/*" onChange={e=>setMainImage(e.target.files[0])}/>
              {about?.image&&<img src={about.image} alt="" style={{height:60,marginTop:6,borderRadius:4}}/>}
            </div>
          </div>
          <div style={s}>
            <h3 style={{color:'#6b1a1a',marginBottom:'1rem'}}>🎯 Vision &amp; Mission</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div className="form-group"><label>Vision</label><textarea value={form.vision} onChange={e=>setForm({...form,vision:e.target.value})} style={{minHeight:90}} placeholder="Our vision..."/></div>
              <div className="form-group"><label>Mission</label><textarea value={form.mission} onChange={e=>setForm({...form,mission:e.target.value})} style={{minHeight:90}} placeholder="Our mission..."/></div>
            </div>
          </div>
          <div style={s}>
            <h3 style={{color:'#6b1a1a',marginBottom:'1rem'}}>📜 History</h3>
            <div className="form-group"><label>History Text</label><textarea value={form.history} onChange={e=>setForm({...form,history:e.target.value})} style={{minHeight:100}} placeholder="Brief history of the unit..."/></div>
            <div className="form-group"><label>History Image (shown beside text) → Cloudinary</label>
              <input type="file" accept="image/*" onChange={e=>setHistoryImage(e.target.files[0])}/>
              {about?.historyImage&&<img src={about.historyImage} alt="" style={{height:60,marginTop:6,borderRadius:4}}/>}
            </div>
          </div>
          <div style={s}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h3 style={{color:'#6b1a1a',margin:0}}>👥 Current Committee</h3>
              <button type="button" className="btn btn-primary btn-sm" onClick={addMember}>+ Add Member</button>
            </div>
            {committee.length===0&&<p style={{color:'#888',textAlign:'center',padding:'1rem'}}>No committee members added yet.</p>}
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
          <button type="submit" className="btn btn-primary" disabled={loading} style={{padding:'0.8rem 2.5rem',fontSize:'1rem'}}>
            {loading?'Saving to Cloudinary...':(aboutId?'💾 Update About Page':'✅ Create About Page')}
          </button>
        </form>
      </div>
    </div>
  );
}

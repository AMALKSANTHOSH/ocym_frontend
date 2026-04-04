import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../api/axios';
const M='#6b1a1a',G='#c9a227';
export default function Home(){
  const [events,setEvents]=useState([]);
  const [gallery,setGallery]=useState([]);
  useEffect(()=>{
    api.get('/events').then(r=>setEvents(r.data.slice(0,3))).catch(()=>{});
    api.get('/gallery').then(r=>setGallery(r.data.slice(0,6))).catch(()=>{});
  },[]);
  return(<div>
    <section style={{background:'linear-gradient(160deg,#4a0e0e 0%,#6b1a1a 40%,#1a1a2e 100%)',color:'#fff',padding:'4rem 2rem 5rem',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:'26rem',opacity:0.04,pointerEvents:'none',color:G,userSelect:'none'}}>✝</div>
      <div style={{maxWidth:900,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
        <img src="/ocym-logo.png" alt="OCYM" style={{height:120,width:'auto',marginBottom:'1.5rem',filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.5))'}}/>
        <h1 style={{fontSize:'2.4rem',fontWeight:800,marginBottom:'0.5rem',lineHeight:1.2,fontFamily:'Georgia,serif'}}>
          <span style={{color:G}}>OCYM </span><span style={{color:'#fff'}}>Kuzhimattom</span>
        </h1>
        <p style={{fontSize:'0.95rem',color:'#e0c8c8',marginBottom:'0.4rem'}}>St. George Unit · Orthodox Christian Youth Movement</p>
        <div style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',background:'rgba(201,162,39,0.15)',border:'1px solid rgba(201,162,39,0.5)',borderRadius:30,padding:'0.4rem 1.2rem',margin:'1rem 0 1.5rem'}}>
          <span style={{color:G,fontWeight:800,fontSize:'1.3rem',fontFamily:'Georgia,serif'}}>91</span>
          <span style={{color:'#f5e6c0',fontSize:'0.85rem',fontWeight:500}}>Years of Faith, Legacy &amp; Service</span>
        </div>
        <p style={{fontStyle:'italic',color:'#c9a0a0',fontSize:'0.95rem',marginBottom:'2rem',letterSpacing:'1px'}}>"Worship · Study · Service"</p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/events" style={{background:G,color:'#1a0a0a',textDecoration:'none',padding:'0.75rem 2rem',borderRadius:30,fontWeight:700,fontSize:'0.95rem',boxShadow:'0 4px 15px rgba(201,162,39,0.4)'}}>View Events</Link>
          <Link to="/register" style={{border:'2px solid rgba(255,255,255,0.4)',color:'#fff',textDecoration:'none',padding:'0.75rem 2rem',borderRadius:30,fontWeight:600,background:'rgba(255,255,255,0.07)'}}>Join OCYM</Link>
          <Link to="/about" style={{border:'2px solid rgba(201,162,39,0.5)',color:G,textDecoration:'none',padding:'0.75rem 2rem',borderRadius:30,fontWeight:600,background:'rgba(201,162,39,0.08)'}}>Our Story</Link>
        </div>
      </div>
    </section>
    <div style={{background:G,padding:'0.85rem 2rem',textAlign:'center'}}>
      <p style={{color:'#1a0a0a',fontStyle:'italic',fontWeight:600,fontSize:'0.92rem',margin:0}}>"Rise up, O Lord, in all your power. With music and singing we celebrate your mighty acts." — Psalm 21:13</p>
    </div>
    <section style={{background:'#fff',padding:'4rem 2rem'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <h2 style={{textAlign:'center',color:M,fontSize:'1.7rem',marginBottom:'0.5rem',fontFamily:'Georgia,serif'}}>Our Mission</h2>
        <p style={{textAlign:'center',color:'#888',marginBottom:'2.5rem'}}>Guided by faith, united in service</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:'1.5rem'}}>
          {[{icon:'🙏',title:'Worship',color:M,text:"We gather in prayer and praise, celebrating God's presence through sacred liturgy and devotion.",verse:'Rise up, O Lord',ref:'Psalm 21:13'},
            {icon:'📖',title:'Study',color:'#1a3a5c',text:'We grow through the Word, nurturing young minds with biblical truth and theological education.',verse:'Study to shew thyself approved',ref:'2 Tim 2:15'},
            {icon:'🤝',title:'Service',color:'#1a5c2a',text:"We serve our community with love, fulfilling Christ's law through outreach and selfless action.",verse:"Carry each other's burdens",ref:'Gal 6:02'}].map(p=>(
            <div key={p.title} style={{border:`2px solid ${p.color}20`,borderRadius:12,overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',transition:'transform 0.2s',cursor:'default'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{background:p.color,padding:'1.2rem',textAlign:'center'}}><div style={{fontSize:'2.2rem'}}>{p.icon}</div><h3 style={{color:'#fff',fontSize:'1.1rem',marginTop:'0.4rem',fontFamily:'Georgia,serif'}}>{p.title}</h3></div>
              <div style={{padding:'1.25rem'}}>
                <p style={{fontStyle:'italic',color:p.color,fontWeight:600,fontSize:'0.83rem',marginBottom:'0.4rem'}}>"{p.verse}" — <span style={{color:'#888'}}>{p.ref}</span></p>
                <p style={{color:'#666',fontSize:'0.875rem',lineHeight:1.7}}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section style={{background:'#f9f4ef',padding:'4rem 2rem'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <h2 style={{textAlign:'center',color:M,fontSize:'1.7rem',marginBottom:'0.5rem',fontFamily:'Georgia,serif'}}>Upcoming Events</h2>
        <p style={{textAlign:'center',color:'#888',marginBottom:'2.5rem'}}>Stay connected with our activities</p>
        {events.length===0?(
          <div style={{textAlign:'center',padding:'3rem',color:'#aaa',background:'#fff',borderRadius:12,border:'1px dashed #ddd'}}><p style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>📅</p><p>No upcoming events yet.</p></div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:'1.5rem'}}>
            {events.map(e=>(
              <div key={e._id} style={{background:'#fff',borderRadius:10,overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',borderTop:`4px solid ${G}`,transition:'transform 0.2s'}}
                onMouseEnter={ev=>ev.currentTarget.style.transform='translateY(-3px)'} onMouseLeave={ev=>ev.currentTarget.style.transform='translateY(0)'}>
                {e.image&&<img src={e.image} alt={e.title} style={{width:'100%',height:170,objectFit:'cover'}}/>}
                <div style={{padding:'1.2rem'}}>
                  <span style={{background:'#f5ece0',color:M,fontSize:'0.72rem',padding:'0.2rem 0.6rem',borderRadius:12,fontWeight:600}}>{e.category}</span>
                  <h3 style={{color:'#1a1a1a',marginTop:'0.6rem',fontSize:'1rem'}}>{e.title}</h3>
                  <p style={{color:'#666',fontSize:'0.85rem',marginTop:'0.3rem',lineHeight:1.5}}>{e.description?.slice(0,90)}{e.description?.length>90?'...':''}</p>
                  <p style={{color:G,fontWeight:600,fontSize:'0.8rem',marginTop:'0.75rem'}}>📅 {new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}{e.time&&` · ${e.time}`}</p>
                  {e.location&&<p style={{color:'#888',fontSize:'0.8rem',marginTop:'0.2rem'}}>📍 {e.location}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{textAlign:'center',marginTop:'2rem'}}><Link to="/events" style={{background:M,color:'#fff',textDecoration:'none',padding:'0.7rem 2rem',borderRadius:25,fontWeight:600,fontSize:'0.9rem'}}>View All Events →</Link></div>
      </div>
    </section>
    <section style={{background:'#fff',padding:'4rem 2rem'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <h2 style={{textAlign:'center',color:M,fontSize:'1.7rem',marginBottom:'0.5rem',fontFamily:'Georgia,serif'}}>Our Gallery</h2>
        <p style={{textAlign:'center',color:'#888',marginBottom:'2.5rem'}}>Moments from our journey of faith</p>
        {gallery.length===0?(
          <div style={{textAlign:'center',padding:'3rem',color:'#aaa',background:'#f9f4ef',borderRadius:12,border:'1px dashed #ddd'}}><p style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>🖼️</p><p>Gallery coming soon!</p></div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gridAutoRows:'200px',gap:'0.75rem'}}>
            {gallery.map((g,i)=>(
              <div key={g._id} style={{borderRadius:8,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.1)',gridColumn:i===0?'span 2':'span 1',gridRow:i===0?'span 2':'span 1'}}>
                <img src={g.image} alt={g.title} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.3s',display:'block'}}
                  onMouseEnter={e=>e.target.style.transform='scale(1.06)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
              </div>
            ))}
          </div>
        )}
        <div style={{textAlign:'center',marginTop:'2rem'}}><Link to="/gallery" style={{background:M,color:'#fff',textDecoration:'none',padding:'0.7rem 2rem',borderRadius:25,fontWeight:600,fontSize:'0.9rem'}}>View Full Gallery →</Link></div>
      </div>
    </section>
    <section style={{background:'linear-gradient(135deg,#6b1a1a 0%,#4a0e0e 100%)',padding:'3.5rem 2rem',textAlign:'center',color:'#fff'}}>
      <img src="/ocym-logo.png" alt="OCYM" style={{height:60,marginBottom:'1rem',opacity:0.9}}/>
      <h2 style={{fontSize:'1.6rem',marginBottom:'0.5rem',fontFamily:'Georgia,serif'}}>Be Part of Our <span style={{color:G}}>Legacy</span></h2>
      <p style={{color:'#e0c8c8',maxWidth:500,margin:'0 auto 1.5rem',lineHeight:1.7}}>Join 91 years of faith, service and community.</p>
      <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
        <Link to="/register" style={{background:G,color:'#1a0a0a',textDecoration:'none',padding:'0.75rem 2rem',borderRadius:30,fontWeight:700}}>Register Now</Link>
        <Link to="/contact" style={{border:'2px solid rgba(255,255,255,0.35)',color:'#fff',textDecoration:'none',padding:'0.75rem 2rem',borderRadius:30,fontWeight:600}}>Contact Us</Link>
      </div>
    </section>
  </div>);
}

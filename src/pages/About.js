// src/pages/About.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
const M='#6b1a1a', G='#c9a227';

export default function About() {
  const [about, setAbout]       = useState(null);
  const [years, setYears]       = useState([]);
  const [selYear, setSelYear]   = useState('');
  const [yearData, setYearData] = useState(null);
  const [loadingYear, setLoadingYear] = useState(false);

  useEffect(() => {
    api.get('/about').then(r => setAbout(r.data)).catch(() => {});
    api.get('/history').then(r => {
      setYears(r.data);
      if (r.data.length > 0) setSelYear(r.data[0].year);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selYear) return;
    setLoadingYear(true); setYearData(null);
    api.get(`/history/${selYear}`).then(r => setYearData(r.data)).catch(() => setYearData(null)).finally(() => setLoadingYear(false));
  }, [selYear]);

  const Avatar = ({ photo, name, size=75, border=M }) => (
    <div style={{width:size,height:size,borderRadius:'50%',overflow:'hidden',border:`3px solid ${border}`,background:'#f5ece0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      {photo ? <img src={photo} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:size*0.4+'px'}}>👤</span>}
    </div>
  );

  return (
    <div>
      <div style={{background:'linear-gradient(135deg,#4a0e0e,#6b1a1a)',padding:'3rem 2rem',textAlign:'center',color:'#fff'}}>
        <img src="/ocym-logo.png" alt="" style={{height:65,marginBottom:'0.75rem',opacity:0.9}}/>
        <h1 style={{fontSize:'2rem',fontFamily:'Georgia,serif',marginBottom:'0.4rem'}}>About Us</h1>
        <p style={{color:'#e0c8c8',fontSize:'0.95rem'}}>
          St. George <span style={{color:G,fontWeight:600}}>OCYM</span> Kuzhimattom — Youth Wing of Malankara Orthodox Syrian Church
        </p>
      </div>
      <div style={{background:G,height:4}}/>

      <div style={{background:'#faf6f1'}}>

        {/* 1. Main Content */}
        {about && (
          <section style={{padding:'4rem 2rem',textAlign:'center'}}>
            <div style={{maxWidth:800,margin:'0 auto'}}>
              {about.image && <img src={about.image} alt="OCYM" style={{width:'100%',maxHeight:320,objectFit:'cover',borderRadius:12,marginBottom:'2rem',boxShadow:`0 4px 20px rgba(107,26,26,0.15)`}}/>}
              <h2 style={{color:M,fontSize:'1.8rem',marginBottom:'1rem',fontFamily:'Georgia,serif'}}>{about.title}</h2>
              <p style={{lineHeight:1.9,color:'#555',fontSize:'1.05rem'}}>{about.content}</p>
            </div>
          </section>
        )}

        {/* 2. Vision & Mission — CENTERED */}
        {about && (about.vision || about.mission) && (
          <section style={{padding:'3rem 2rem',background:'#fff'}}>
            <div style={{maxWidth:1000,margin:'0 auto'}}>
              <h2 style={{textAlign:'center',color:M,fontSize:'1.6rem',fontFamily:'Georgia,serif',marginBottom:'2.5rem'}}>── Vision &amp; Mission ──</h2>
              <div style={{display:'grid',gridTemplateColumns:about.vision&&about.mission?'1fr 1fr':'1fr',gap:'2rem',maxWidth:about.vision&&about.mission?900:500,margin:'0 auto'}}>
                {about.vision && (
                  <div style={{background:'#faf6f1',borderRadius:12,padding:'2.5rem',textAlign:'center',borderTop:`4px solid ${M}`,boxShadow:`0 2px 12px rgba(107,26,26,0.08)`}}>
                    <div style={{width:60,height:60,borderRadius:'50%',background:M,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',margin:'0 auto 1rem'}}>🎯</div>
                    <h3 style={{color:M,fontSize:'1.2rem',marginBottom:'1rem',fontFamily:'Georgia,serif'}}>Our Vision</h3>
                    <p style={{color:'#555',lineHeight:1.8,fontSize:'0.95rem'}}>{about.vision}</p>
                  </div>
                )}
                {about.mission && (
                  <div style={{background:'#faf6f1',borderRadius:12,padding:'2.5rem',textAlign:'center',borderTop:`4px solid ${G}`,boxShadow:`0 2px 12px rgba(201,162,39,0.1)`}}>
                    <div style={{width:60,height:60,borderRadius:'50%',background:G,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',margin:'0 auto 1rem'}}>📌</div>
                    <h3 style={{color:'#7a5500',fontSize:'1.2rem',marginBottom:'1rem',fontFamily:'Georgia,serif'}}>Our Mission</h3>
                    <p style={{color:'#555',lineHeight:1.8,fontSize:'0.95rem'}}>{about.mission}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. History */}
        {about && about.history && (
          <section style={{padding:'3rem 2rem'}}>
            <div style={{maxWidth:1000,margin:'0 auto'}}>
              <h2 style={{textAlign:'center',color:M,fontSize:'1.6rem',fontFamily:'Georgia,serif',marginBottom:'2.5rem'}}>── Our History ──</h2>
              <div style={{display:'grid',gridTemplateColumns:about.historyImage?'1fr 1fr':'1fr',gap:'2rem',alignItems:'center'}}>
                <div style={{background:'#fff',borderRadius:12,padding:'2rem',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',borderLeft:`4px solid ${M}`}}>
                  <p style={{lineHeight:1.9,color:'#555',fontSize:'0.98rem'}}>{about.history}</p>
                </div>
                {about.historyImage && <img src={about.historyImage} alt="History" style={{width:'100%',borderRadius:12,boxShadow:`0 4px 16px rgba(107,26,26,0.15)`}}/>}
              </div>
            </div>
          </section>
        )}

        {/* 4. Current Committee */}
        {about?.committee?.length > 0 && (
          <section style={{padding:'3rem 2rem',background:'#fff'}}>
            <div style={{maxWidth:1100,margin:'0 auto'}}>
              <h2 style={{textAlign:'center',color:M,fontSize:'1.6rem',fontFamily:'Georgia,serif',marginBottom:'0.5rem'}}>── Current Committee ──</h2>
              <p style={{textAlign:'center',color:'#888',marginBottom:'2.5rem'}}>Leadership serving our community</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:'1.25rem'}}>
                {about.committee.map((m,i) => (
                  <div key={i} style={{background:'#faf6f1',borderRadius:12,padding:'1.5rem',textAlign:'center',boxShadow:`0 2px 10px rgba(107,26,26,0.08)`,border:`1px solid rgba(107,26,26,0.1)`,transition:'transform 0.2s'}}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <div style={{margin:'0 auto 0.75rem',width:75,height:75}}><Avatar photo={m.photo} name={m.name} size={75} border={M}/></div>
                    <h3 style={{fontSize:'0.92rem',color:M,fontWeight:700}}>{m.name}</h3>
                    <p style={{color:G,fontWeight:600,fontSize:'0.78rem',marginTop:'0.25rem'}}>{m.position}</p>
                    {m.phone && <p style={{color:'#888',fontSize:'0.75rem',marginTop:'0.2rem'}}>📞 {m.phone}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Year-wise History */}
        <section style={{padding:'3rem 2rem'}}>
          <div style={{maxWidth:1100,margin:'0 auto'}}>
            <h2 style={{textAlign:'center',color:M,fontSize:'1.6rem',fontFamily:'Georgia,serif',marginBottom:'0.5rem'}}>── Year-wise History ──</h2>
            <p style={{textAlign:'center',color:'#888',marginBottom:'2rem'}}>Browse our activities and committee by year</p>

            {years.length === 0 ? (
              <div style={{textAlign:'center',padding:'3rem',color:'#aaa',background:'#fff',borderRadius:12,border:'1px dashed #ddd'}}>
                <p style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>📅</p>
                <p>Year-wise history will appear here once admin adds records.</p>
              </div>
            ) : (
              <>
                <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
                  <select value={selYear} onChange={e=>setSelYear(e.target.value)} style={{padding:'0.65rem 2rem',fontSize:'1.05rem',borderRadius:30,border:`2px solid ${M}`,color:M,fontWeight:700,background:'#fff',cursor:'pointer',outline:'none',boxShadow:`0 2px 8px rgba(107,26,26,0.12)`}}>
                    {years.map(y => <option key={y._id} value={y.year}>{y.year}</option>)}
                  </select>
                </div>

                {loadingYear && <div style={{textAlign:'center',padding:'2rem',color:'#888'}}>Loading...</div>}

                {!loadingYear && yearData && (
                  <div>
                    {yearData.description && (
                      <p style={{textAlign:'center',maxWidth:720,margin:'0 auto 2.5rem',lineHeight:1.85,color:'#555',fontSize:'0.98rem',background:'#fff',borderRadius:10,padding:'1.5rem',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',borderLeft:`4px solid ${G}`}}>
                        {yearData.description}
                      </p>
                    )}
                    {yearData.images?.length > 0 && (
                      <div style={{marginBottom:'3rem'}}>
                        <h3 style={{color:M,marginBottom:'1.25rem',textAlign:'center',fontFamily:'Georgia,serif',fontSize:'1.2rem'}}>
                          📸 Activities &amp; Events — {yearData.year}
                        </h3>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'0.85rem'}}>
                          {yearData.images.map((img,i) => (
                            <div key={i} style={{borderRadius:8,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
                              <img src={img} alt={`${yearData.year}-${i+1}`} style={{width:'100%',height:180,objectFit:'cover',display:'block'}}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {yearData.committee?.length > 0 && (
                      <div>
                        <h3 style={{color:M,marginBottom:'1.25rem',textAlign:'center',fontFamily:'Georgia,serif',fontSize:'1.2rem'}}>
                          👥 Committee — {yearData.year}
                        </h3>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'1.25rem'}}>
                          {yearData.committee.map((m,i) => (
                            <div key={i} style={{background:'#fff',borderRadius:12,padding:'1.5rem',textAlign:'center',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',border:`1px solid rgba(107,26,26,0.1)`,transition:'transform 0.2s'}}
                              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                              <div style={{margin:'0 auto 0.75rem',width:72,height:72}}><Avatar photo={m.photo} name={m.name} size={72} border={G}/></div>
                              <h3 style={{fontSize:'0.9rem',color:M,fontWeight:700}}>{m.name}</h3>
                              <p style={{color:G,fontWeight:600,fontSize:'0.75rem',marginTop:'0.25rem'}}>{m.position}</p>
                              {m.phone && <p style={{color:'#888',fontSize:'0.72rem',marginTop:'0.2rem'}}>📞 {m.phone}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {!about && (
          <div style={{textAlign:'center',padding:'5rem 2rem',color:'#aaa'}}>
            <p style={{fontSize:'3rem',marginBottom:'0.5rem'}}>⛪</p>
            <p>About page content coming soon. Admin can add it from the admin panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}

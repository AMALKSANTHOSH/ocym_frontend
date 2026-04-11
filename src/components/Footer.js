// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{background:'#1a0a0a',color:'#c8b0b0'}}>
    <div style={{padding:'3rem 2rem 2rem',maxWidth:1100,margin:'0 auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'2.5rem'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1rem'}}>
            <img src="/ocym-logo.png" alt="OCYM" style={{height:55,filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'}} />
            <div>
              <span style={{color:'#f0c040',fontWeight:700,fontSize:'0.95rem'}}>OCYM </span>
              <span style={{color:'#fff',fontWeight:700,fontSize:'0.95rem'}}>Kuzhimattom Pally</span>
              <div style={{color:'#e0c8c8',fontSize:'0.75rem'}}>St. George Unit</div>
            </div>
          </div>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:'0.4rem',
            background:'rgba(201,162,39,0.12)',border:'1px solid rgba(201,162,39,0.3)',
            borderRadius:20,padding:'0.3rem 0.8rem',marginTop:'0.5rem',
          }}>
            <span style={{color:'#f0c040',fontWeight:800,fontSize:'1.1rem',fontFamily:'Georgia,serif'}}>91</span>
            <span style={{color:'#e0c8c8',fontSize:'0.75rem'}}>Years of Legacy</span>
          </div>
        </div>

        <div>
          <h4 style={{color:'#f0c040',marginBottom:'1rem',fontSize:'0.9rem'}}>Quick Links</h4>
          {[['/','/about','/events','/gallery','/contact','/register'],
            ['Home','About Us','Events','Gallery','Contact','Join OCYM']].reduce((acc,_,i,arr)=>{
            if(i===0) return arr[0].map((to,j)=>({to,label:arr[1][j]}));
            return acc;
          },[]).map(l=>(
            <Link key={l.to} to={l.to} style={{display:'block',color:'#a08080',textDecoration:'none',fontSize:'0.83rem',lineHeight:2}}>
              › {l.label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{color:'#f0c040',marginBottom:'1rem',fontSize:'0.9rem'}}>Contact Us</h4>
          <p style={{fontSize:'0.82rem',color:'#a08080',lineHeight:1.8}}>📍 Kuzhimattom, Kottayam, Kerala</p>
          <p style={{fontSize:'0.82rem',color:'#a08080',lineHeight:1.8}}>📞 +91 7558043864</p>
          <p style={{fontSize:'0.82rem',color:'#a08080',lineHeight:1.8}}>✉️ ocymkuzhimattom@gmail.com</p>
        </div>

        <div>
          <h4 style={{color:'#f0c040',marginBottom:'1rem',fontSize:'0.9rem'}}>Our Motto</h4>
          {[['🙏','Worship','Psalm 21:13'],['📖','Study','2 Timothy 2:15'],['🤝','Service','Galatians 6:02']].map(m=>(
            <div key={m[1]} style={{marginBottom:'0.5rem'}}>
              <span style={{color:'#e0c8c8',fontSize:'0.83rem',fontWeight:600}}>{m[0]} {m[1]}</span>
              <span style={{color:'#6b4040',fontSize:'0.75rem',marginLeft:'0.4rem'}}>— {m[2]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{borderTop:'1px solid #2a1010',padding:'1rem 2rem',textAlign:'center',fontSize:'0.78rem',color:'#5a3535'}}>
      © {new Date().getFullYear()} St. George OCYM Kuzhimattom · Malankara Orthodox Syrian Church · All rights reserved · Developed by Amal K Santhosh
    </div>
  </footer>
);

export default Footer;

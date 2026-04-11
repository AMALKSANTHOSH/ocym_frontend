// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const M = '#6b1a1a', G = '#c9a227';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const EventCard = ({ e, isPast }) => (
  <div style={{
    background: '#fff', borderRadius: 10, overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    borderTop: `4px solid ${isPast ? '#bbb' : G}`,
    transition: 'transform 0.2s',
    opacity: isPast ? 0.88 : 1,
  }}
    onMouseEnter={ev => ev.currentTarget.style.transform = 'translateY(-3px)'}
    onMouseLeave={ev => ev.currentTarget.style.transform = 'translateY(0)'}
  >
    {e.image && (
      <div style={{ position: 'relative' }}>
        <img src={e.image} alt={e.title}
          style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', filter: isPast ? 'grayscale(20%)' : 'none' }} />
        {isPast && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.6)', color: '#fff',
            padding: '0.2rem 0.65rem', borderRadius: 12, fontSize: '0.72rem', fontWeight: 600,
          }}>
            ✓ Completed
          </div>
        )}
      </div>
    )}
    <div style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        <span style={{
          background: isPast ? '#f0f0f0' : '#f5ece0',
          color: isPast ? '#777' : M,
          fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 12, fontWeight: 600,
        }}>
          {e.category}
        </span>
        {isPast && (
          <span style={{ background: '#efefef', color: '#888', fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 12 }}>
            Past Event
          </span>
        )}
      </div>
      <h3 style={{ color: isPast ? '#555' : '#1a1a1a', fontSize: '1rem', marginBottom: '0.4rem' }}>{e.title}</h3>
      <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6 }}>{e.description}</p>
      <div style={{ marginTop: '0.85rem', borderTop: '1px solid #f0e8e0', paddingTop: '0.75rem' }}>
        <p style={{ color: isPast ? '#999' : G, fontWeight: 600, fontSize: '0.82rem' }}>
          📅 {formatDate(e.date)}{e.time && ` · ${e.time}`}
        </p>
        {e.location && <p style={{ color: '#888', fontSize: '0.82rem', marginTop: '0.2rem' }}>📍 {e.location}</p>}
      </div>
    </div>
  </div>
);

export default function Events() {
  const [tab, setTab]             = useState('upcoming');
  const [catFilter, setCatFilter] = useState('all');
  const [upcoming, setUpcoming]   = useState([]);
  const [past, setPast]           = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/events?type=upcoming').then(r => setUpcoming(r.data)).catch(() => {}),
      api.get('/events?type=past').then(r => setPast(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const events     = tab === 'upcoming' ? upcoming : past;
  const categories = ['all', ...new Set(events.map(e => e.category))];
  const filtered   = catFilter === 'all' ? events : events.filter(e => e.category === catFilter);

  const switchTab = (t) => { setTab(t); setCatFilter('all'); };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#4a0e0e,#6b1a1a)', padding: '3rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <img src="/ocym-logo.png" alt="" style={{ height: 55, marginBottom: '0.75rem', opacity: 0.85 }} />
        <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontFamily: 'Georgia,serif', marginBottom: '0.4rem' }}>Events</h1>
        <p style={{ color: '#e0c8c8', fontSize: '0.95rem' }}>
          Upcoming programs and past activities of OCYM Kuzhimattom
        </p>
      </div>
      <div style={{ background: G, height: 4 }} />

      <section style={{ padding: '2rem 1.5rem', background: '#faf6f1', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* ── Tab switcher ── */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: '2rem',
            background: '#fff', borderRadius: 10, padding: '0.4rem',
            boxShadow: '0 1px 6px rgba(0,0,0,0.09)',
            width: 'fit-content',
          }}>
            {[
              { key: 'upcoming', label: 'Upcoming Events', icon: '📅' },
              { key: 'past',     label: 'Past Events',     icon: '📋' },
            ].map(t => {
              const count = t.key === 'upcoming' ? upcoming.length : past.length;
              return (
                <button key={t.key} onClick={() => switchTab(t.key)} style={{
                  padding: '0.6rem 1.4rem', borderRadius: 7, border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                  transition: 'all 0.2s',
                  background: tab === t.key ? M : 'transparent',
                  color: tab === t.key ? '#fff' : '#888',
                  display: 'flex', alignItems: 'center', gap: '0.45rem',
                }}>
                  {t.icon} {t.label}
                  {!loading && (
                    <span style={{
                      background: tab === t.key ? 'rgba(255,255,255,0.22)' : '#eee',
                      color: tab === t.key ? '#fff' : '#777',
                      borderRadius: 12, padding: '0.05rem 0.45rem', fontSize: '0.75rem',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Category filter pills ── */}
          {!loading && categories.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} style={{
                  padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600,
                  cursor: 'pointer', border: `2px solid ${catFilter === c ? M : '#ddd'}`,
                  background: catFilter === c ? M : '#fff',
                  color: catFilter === c ? '#fff' : '#666', transition: 'all 0.2s',
                }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* ── Info bar ── */}
          {!loading && filtered.length > 0 && (
            <div style={{
              background: tab === 'upcoming' ? 'rgba(201,162,39,0.1)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${tab === 'upcoming' ? 'rgba(201,162,39,0.35)' : '#ddd'}`,
              borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1.5rem',
              fontSize: '0.85rem', color: tab === 'upcoming' ? '#7a5500' : '#666',
            }}>
              {tab === 'upcoming'
                ? `📌 ${filtered.length} upcoming event${filtered.length !== 1 ? 's' : ''} — sorted by nearest date first`
                : `📋 ${filtered.length} past event${filtered.length !== 1 ? 's' : ''} — most recent first`
              }
            </div>
          )}

          {/* ── Events grid ── */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading events...</div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '4rem', color: '#aaa',
              background: '#fff', borderRadius: 12, border: '1px dashed #ddd',
            }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                {tab === 'upcoming' ? '📅' : '📋'}
              </p>
              {tab === 'upcoming' ? (
                <>
                  <p style={{ fontWeight: 600, color: '#666', marginBottom: '0.4rem' }}>No upcoming events right now</p>
                  <p style={{ fontSize: '0.875rem' }}>
                    Check back soon — or browse{' '}
                    <button onClick={() => switchTab('past')} style={{
                      background: 'none', border: 'none', color: M,
                      fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem',
                    }}>
                      Past Events →
                    </button>
                  </p>
                </>
              ) : (
                <p>No past events recorded yet.</p>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: '1.5rem' }}>
              {filtered.map(e => <EventCard key={e._id} e={e} isPast={tab === 'past'} />)}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

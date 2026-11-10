import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Calendar as CalendarIcon, 
  Camera, 
  Video, 
  Clock, 
  MapPin, 
  UserCheck, 
  Filter, 
  ClipboardCheck, 
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Inbox,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Check,
  Package,
  Layers,
  Building,
  User,
  Users
} from 'lucide-react';
import { PickupInspectionModal } from './PickupInspectionModal';

export const CalendarTab = () => {
  const { events, dutyRoster, equipment, activeMemberId, members } = useStudio();
  const currentMember = members.find((m) => m.id === activeMemberId) || members[0] || {
    id: 'USR',
    nama: 'Kevin Pratama',
    kelas: '12 MIPA 1',
    divisi: 'Lead Videographer'
  };

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Semua');
  const [selectedEventForPickup, setSelectedEventForPickup] = useState(null);
  const [activeViewMode, setActiveViewMode] = useState('timeline'); // 'timeline' | 'calendar' | 'my-tasks'
  const [selectedDayOffset, setSelectedDayOffset] = useState(1); // 1 = Selasa (Today)

  // Interactive Checklist for Gear Pickup in Right Sidebar
  const [gearChecklist, setGearChecklist] = useState({
    camA7IV: true,
    lens2470: true,
    djiMic: false,
    tripod: false
  });

  const toggleGearItem = (key) => {
    setGearChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedGearCount = Object.values(gearChecklist).filter(Boolean).length;

  // Filter kategori
  const categories = [
    { label: 'Semua Kategori', count: 18, dotColor: null },
    { label: 'Event Sekolah', count: 7, dotColor: '#1E3A8A' },
    { label: 'Piket Studio', count: 4, dotColor: '#059669' },
    { label: 'Peminjaman Mandiri', count: 3, dotColor: '#525F75' },
    { label: 'Sewa Komersial', count: 4, dotColor: '#D97706' }
  ];

  // Penugasan dokumentasi pribadi siswa aktif
  const myPersonalAssignments = [];
  events.forEach((ev) => {
    const assigned = ev.personil?.find((p) => p.anggotaId === activeMemberId || p.nama === currentMember.nama);
    if (assigned) {
      myPersonalAssignments.push({
        event: ev,
        personnel: assigned
      });
    }
  });

  return (
    <div style={{ paddingBottom: '2.5rem' }}>
      {/* 1. TOP BREADCRUMB & SUPER TITLE HEADER */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.685rem',
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.35rem'
        }}>
          <span>CONSOLE</span>
          <span>/</span>
          <span>JADWAL PEMINJAMAN & EVENT</span>
          <span>/</span>
          <span style={{ color: '#1E3A8A', fontWeight: 700 }}>November 2026</span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em', margin: 0 }}>
              Jadwal Operasional & Roster Kru Studio
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0 0' }}>
              Koordinasi jadwal liputan acara resmi, sesi booking studio, piket lab, dan alokasi perlengkapan.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => alert('Jadwal operasional terhubung real-time dengan server Creative Corner.')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.785rem',
                padding: '0.45rem 0.85rem',
                background: '#FFFFFF'
              }}
            >
              <RefreshCw size={13} color="#64748B" />
              <span>Sinkron Kalender</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => alert('Untuk menambahkan agenda sekolah resmi baru, silakan buka tab Liputan Event di Portal Administrator.')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.785rem',
                padding: '0.45rem 0.95rem',
                fontWeight: 700,
                background: '#1E3A8A'
              }}
            >
              <PlusCircle size={14} />
              <span>+ Buat Jadwal Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. COMMAND STRIP: DATE NAV, VIEW SWITCHERS, & CATEGORY FILTERS */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        border: '1px solid #E2E8F0',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Top Strip: Date Navigator & View Switcher */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid #F1F5F9'
        }}>
          {/* Date Navigator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F1F5F9',
              borderRadius: '8px',
              padding: '2px'
            }}>
              <button
                type="button"
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '5px 7px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Bulan Sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                style={{
                  border: 'none',
                  background: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Hari Ini
              </button>
              <button
                type="button"
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '5px 7px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Bulan Selanjutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              background: '#EFF6FF',
              color: '#1E3A8A'
            }}>
              <CalendarIcon size={15} color="#1E3A8A" />
              <strong style={{ fontSize: '0.875rem' }}>November 2026</strong>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.685rem',
                background: '#DBEAFE',
                color: '#1E40AF',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                W46
              </span>
            </div>
          </div>

          {/* View Switcher Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
            gap: '3px'
          }}>
            <button
              type="button"
              onClick={() => setActiveViewMode('timeline')}
              style={{
                border: 'none',
                background: activeViewMode === 'timeline' ? '#1E3A8A' : 'transparent',
                color: activeViewMode === 'timeline' ? '#FFFFFF' : '#475569',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.775rem',
                fontWeight: activeViewMode === 'timeline' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Clock size={14} />
              <span>Agenda Timeline</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('calendar')}
              style={{
                border: 'none',
                background: activeViewMode === 'calendar' ? '#1E3A8A' : 'transparent',
                color: activeViewMode === 'calendar' ? '#FFFFFF' : '#475569',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.775rem',
                fontWeight: activeViewMode === 'calendar' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <CalendarDays size={14} />
              <span>Kalender Bulanan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('my-tasks')}
              style={{
                border: 'none',
                background: activeViewMode === 'my-tasks' ? '#1E3A8A' : 'transparent',
                color: activeViewMode === 'my-tasks' ? '#FFFFFF' : '#475569',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.775rem',
                fontWeight: activeViewMode === 'my-tasks' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <UserCheck size={14} />
              <span>Tugas Saya ({myPersonalAssignments.length})</span>
            </button>
          </div>
        </div>

        {/* Sub-strip Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginRight: '0.2rem' }}>
            Kategori:
          </span>
          {categories.map((cat) => {
            const isSelected = activeCategoryFilter === cat.label || (activeCategoryFilter === 'Semua' && cat.label.includes('Semua'));
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategoryFilter(cat.label.includes('Semua') ? 'Semua' : cat.label)}
                style={{
                  border: 'none',
                  background: isSelected ? '#1E3A8A' : '#F1F5F9',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.dotColor && !isSelected && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.dotColor }}></span>
                )}
                <span>{cat.label}</span>
                <span style={{
                  fontSize: '0.675rem',
                  opacity: 0.8,
                  fontFamily: 'var(--font-mono)'
                }}>
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SPLIT VIEW: 8 COLUMNS TIMELINE + 4 COLUMNS RIGHT SIDEBAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT MAIN: 8 Columns Timeline & Multi-Day Strip */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Multi-Day Strip Header */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '0.65rem 0.75rem',
            border: '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', textAlign: 'center' }}>
              {[
                { day: 'Sen', date: '09', count: '3 Agenda', isToday: false },
                { day: 'Sel', date: '10', count: 'Hari Ini', isToday: true },
                { day: 'Rab', date: '11', count: '4 Agenda', isToday: false },
                { day: 'Kam', date: '12', count: '2 Agenda', isToday: false },
                { day: 'Jum', date: '13', count: '5 Agenda', isToday: false },
                { day: 'Sab', date: '14', count: '1 Studio', isToday: false },
                { day: 'Min', date: '15', count: 'Libur', isToday: false }
              ].map((item, idx) => (
                <div
                  key={item.date}
                  onClick={() => setSelectedDayOffset(idx)}
                  style={{
                    padding: '0.45rem 0.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: item.isToday ? '#EFF6FF' : 'transparent',
                    border: item.isToday ? '1px solid #93C5FD' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.675rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: item.isToday ? '#1E3A8A' : '#64748B'
                  }}>
                    {item.day}
                  </div>
                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: item.isToday ? '#1E3A8A' : '#0F172A',
                    lineHeight: 1.2
                  }}>
                    {item.date}
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    color: item.isToday ? '#1E40AF' : '#94A3B8',
                    fontWeight: item.isToday ? 700 : 500,
                    display: 'block',
                    marginTop: '2px'
                  }}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slot Linear Agenda Canvas */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative'
          }}>
            {/* Timeline Header Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.85rem',
              marginBottom: '1rem',
              borderBottom: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="#1E3A8A" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Timeline Operasional - Selasa, 10 Nov 2026
                </h3>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.725rem',
                color: '#64748B'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }}></span>
                <span>Waktu Server Studio: <strong style={{ color: '#0F172A' }}>10:15 WIB</strong></span>
              </div>
            </div>

            {/* Vertical Timeline Schedule Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Event 1: Liputan Upacara Hari Pahlawan (Deep Obsidian Navy Theme) */}
              <div style={{
                background: '#0B192C',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '1rem',
                borderLeft: '4px solid #1E3A8A',
                boxShadow: '0 4px 6px -1px rgba(11, 25, 44, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{
                        background: '#1E3A8A',
                        color: '#FFFFFF',
                        fontSize: '0.685rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        EVENT RESMI SEKOLAH
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: '#93C5FD' }}>
                        07:30 - 11:30 WIB
                      </span>
                      <span style={{
                        fontSize: '0.685rem',
                        color: '#34D399',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <CheckCircle2 size={12} color="#34D399" />
                        <span>Terkonfirmasi</span>
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                      Liputan Upacara Hari Pahlawan - Tim A
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.785rem', color: '#CBD5E1' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#94A3B8" /> Lapangan Utama Kampus
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={13} color="#94A3B8" /> 3 Kru Lapangan
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.675rem', color: '#94A3B8', textTransform: 'uppercase' }}>Status Operasi</span>
                    <div style={{ color: '#34D399', fontWeight: 800, fontSize: '0.825rem' }}>Sedang Berlangsung</div>
                  </div>
                </div>

                {/* Gear Kit & Roster Sub-bar */}
                <div style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.65rem',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#94A3B8', fontWeight: 600 }}>Gear Kit:</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>2x Sony A7 IV</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Sony 24-70 GM II</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>DJI Mic 2 Set</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#94A3B8' }}>Roster Kru:</span>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#1E3A8A', border: '1.5px solid #0B192C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }} title="Kevin (Lead Cam)">KV</div>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#059669', border: '1.5px solid #0B192C', marginLeft: '-6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }} title="Aditya (Second Cam)">AD</div>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#D97706', border: '1.5px solid #0B192C', marginLeft: '-6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }} title="Rian (Audio & Gimbal)">RN</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event 2: Piket Studio Pagi (Teal / Surface Container Low Theme) */}
              <div style={{
                background: '#F0FDF4',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                border: '1px solid #BBF7D0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.675rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>
                        PIKET STUDIO
                      </span>
                      <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>
                        Piket Studio Pagi - Lab & QC Maintenance
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#475569', margin: '2px 0 0 0' }}>
                      Kalibrasi Lensa & Charging Station • Petugas: <strong>Rian & Sarah</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#475569' }}>
                    08:00 - 12:00 WIB
                  </span>
                  <span style={{
                    background: '#166534',
                    color: '#FFFFFF',
                    fontSize: '0.685rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    Log Checklist 8/8 Siap
                  </span>
                </div>
              </div>

              {/* Event 3: Sewa Studio Foto Wisuda (Amber Theme) */}
              <div style={{
                background: '#FFFBEB',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                border: '1px solid #FDE68A',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                    <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.675rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>
                      SEWA KOMERSIAL #BK-882
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: '#78350F' }}>
                      13:00 - 16:30 WIB
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>
                    Sewa Studio Foto Wisuda - Klien: Sdr. Hendra
                  </strong>
                  <p style={{ fontSize: '0.75rem', color: '#78350F', margin: '2px 0 0 0' }}>
                    Ruang Studio B (Cyclorama Putih) + Paket Lighting Godox AD600Pro
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '0.685rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #FCD34D'
                  }}>
                    Menunggu Check-in Klien
                  </span>
                </div>
              </div>

              {/* Event 4: Inspeksi Pengembalian Alat Overdue (Crimson Theme) */}
              <div style={{
                background: '#FFF1F2',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                border: '1px solid #FECDD3',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} color="#E11D48" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ background: '#E11D48', color: '#FFFFFF', fontSize: '0.675rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>
                        PRIORITAS TINGGI
                      </span>
                      <strong style={{ fontSize: '0.875rem', color: '#9F1239' }}>
                        Inspeksi Pengembalian Alat Overdue (2 Unit Lapangan)
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#881337', margin: '2px 0 0 0' }}>
                      Pengecekan unit pasca upacara + verifikasi kelengkapan memori SD card.
                    </p>
                  </div>
                </div>

                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#E11D48' }}>
                  17:00 - 17:45 WIB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: 4 Columns "Penugasan Saya & Quick Telemetry" */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* User Duty Header Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#1E3A8A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}>
                  KP
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {currentMember.nama}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {currentMember.divisi || 'Lead Videographer'} • Kru Tetap
                  </span>
                </div>
              </div>

              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#1E3A8A',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                2 Tugas Hari Ini
              </span>
            </div>

            {/* Active Upcoming Assignment Highlight */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '10px',
              padding: '0.85rem',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{
                  background: '#1E3A8A',
                  color: '#FFFFFF',
                  fontSize: '0.685rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Clock size={10} />
                  <span>Mulai 2 Jam Lagi</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: '#0F172A', fontWeight: 600 }}>
                  13:00 - 15:30 WIB
                </span>
              </div>

              <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                Sesi Foto & Video Profil Laboratorium
              </h5>
              <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                <MapPin size={12} color="#1E3A8A" />
                <span>Aula Utama Lt. 3 • Partner: <strong>Sarah (Audio)</strong></span>
              </div>

              {/* Interactive Gear Checklist */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '8px',
                padding: '0.65rem',
                border: '1px solid #E2E8F0',
                marginBottom: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.685rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>
                    Checklist Gear Keluar:
                  </span>
                  <span style={{ fontSize: '0.685rem', fontWeight: 700, color: '#1E3A8A' }}>
                    {completedGearCount} dari 4 Siap
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.775rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="checkbox"
                        checked={gearChecklist.camA7IV}
                        onChange={() => toggleGearItem('camA7IV')}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <span style={{ color: '#0F172A', fontWeight: 500 }}>Sony Alpha 7 IV</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.685rem', color: '#64748B' }}>Loker A-02</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="checkbox"
                        checked={gearChecklist.lens2470}
                        onChange={() => toggleGearItem('lens2470')}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <span style={{ color: '#0F172A', fontWeight: 500 }}>FE 24-70mm f/2.8 GM II</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.685rem', color: '#64748B' }}>Dry Cab 01</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="checkbox"
                        checked={gearChecklist.djiMic}
                        onChange={() => toggleGearItem('djiMic')}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <span style={{ color: '#0F172A', fontWeight: 500 }}>DJI Mic 2 Set Wireless</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.685rem', color: '#64748B' }}>QC Meja 1</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="checkbox"
                        checked={gearChecklist.tripod}
                        onChange={() => toggleGearItem('tripod')}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <span style={{ color: '#0F172A', fontWeight: 500 }}>Manfrotto 504HD Tripod</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.685rem', color: '#64748B' }}>Loker C-04</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (myPersonalAssignments.length > 0) {
                    setSelectedEventForPickup(myPersonalAssignments[0].event);
                  } else {
                    alert('Checklist perlengkapan siap divalidasi dengan Admin Studio.');
                  }
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.785rem',
                  padding: '0.55rem',
                  fontWeight: 700,
                  background: '#1E3A8A'
                }}
              >
                <ClipboardCheck size={15} />
                <span>Konfirmasi Kehadiran & Ambil Alat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL INSPEKSI PENGAMBILAN ALAT (BEFORE) */}
      {selectedEventForPickup && (
        <PickupInspectionModal
          isOpen={Boolean(selectedEventForPickup)}
          onClose={() => setSelectedEventForPickup(null)}
          targetEvent={selectedEventForPickup}
        />
      )}
    </div>
  );
};

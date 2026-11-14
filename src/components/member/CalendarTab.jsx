import React, { useState, useMemo } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Calendar as CalendarIcon, 
  Camera, 
  Video, 
  Clock, 
  MapPin, 
  UserCheck, 
  ClipboardCheck, 
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Inbox,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Users,
  PlusCircle
} from 'lucide-react';
import { PickupInspectionModal } from './PickupInspectionModal';
import { checkLoanOverdue } from '../../utils/loanOverdue';

export const CalendarTab = () => {
  const { 
    events, 
    dutyRoster, 
    equipment, 
    borrowings, 
    activeMemberId, 
    members, 
    currentUser,
    isSupabaseConfigured,
    setCurrentRole,
    showToast
  } = useStudio();

  const currentMember = currentUser || members.find((m) => m.id === activeMemberId) || members[0] || {
    id: 'USR',
    nama: 'Anggota Creative Corner',
    kelas: 'Studio',
    divisi: 'Kru Studio'
  };

  // State navigasi tanggal & tampilan
  const todayISO = new Date().toISOString().split('T')[0];
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const [selectedDateFilter, setSelectedDateFilter] = useState(null); // null = tampilkan seluruh agenda mendatang/aktif
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Semua');
  const [activeViewMode, setActiveViewMode] = useState('timeline'); // 'timeline' | 'calendar' | 'my-tasks'
  const [selectedEventForPickup, setSelectedEventForPickup] = useState(null);
  const [eqCategoryFilter, setEqCategoryFilter] = useState('Semua');

  // Interactive checklist state keyed by tool id for sidebar pre-check
  const [checkedToolIds, setCheckedToolIds] = useState({});

  const toggleToolCheck = (toolId) => {
    setCheckedToolIds((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const getInitials = (name) => {
    if (!name) return 'CC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Formatter helpers
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const formatReadableDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Hitung minggu berjalan dari referenceDate (Senin - Minggu)
  const weekDays = useMemo(() => {
    const base = new Date(referenceDate);
    const dayOfWeek = base.getDay(); // 0 = Min, 1 = Sen
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday);

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayEvents = events.filter((ev) => ev.tanggal === iso).length;
      const dayLoans = borrowings.filter((b) => b.tanggalPinjam === iso && b.status === 'Dipinjam').length;
      return {
        iso,
        dayName: dayNames[d.getDay()],
        dateNum: String(d.getDate()).padStart(2, '0'),
        isToday: iso === todayISO,
        agendaCount: dayEvents + dayLoans
      };
    });
  }, [referenceDate, events, borrowings, todayISO]);

  // Kalender Bulanan cells
  const monthDaysGrid = useMemo(() => {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Mulai Senin

    const cells = [];
    for (let i = 0; i < startPad; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const evs = events.filter((e) => e.tanggal === iso);
      const loans = borrowings.filter((b) => b.tanggalPinjam === iso && b.status === 'Dipinjam');
      cells.push({
        day,
        iso,
        isToday: iso === todayISO,
        events: evs,
        loans
      });
    }
    return cells;
  }, [referenceDate, events, borrowings, todayISO]);

  // Penugasan dokumentasi pribadi anggota aktif
  const myPersonalAssignments = useMemo(() => {
    const list = [];
    events.forEach((ev) => {
      const assigned = ev.personil?.find(
        (p) =>
          p.anggotaId === activeMemberId ||
          (p.nama && currentMember.nama && p.nama.toLowerCase() === currentMember.nama.toLowerCase())
      );
      if (assigned) {
        list.push({ event: ev, personnel: assigned });
      }
    });
    return list;
  }, [events, activeMemberId, currentMember.nama]);

  // Tugas aktif yang belum selesai untuk sidebar kanan
  const activeUpcomingAssignment = useMemo(() => {
    return (
      myPersonalAssignments.find(
        (a) => a.event.status !== 'Selesai' && a.event.status !== 'Dibatalkan' && a.personnel.statusTugas !== 'Sudah Melaksanakan Tugas'
      ) || myPersonalAssignments[0] || null
    );
  }, [myPersonalAssignments]);

  // Peminjaman aktif & overdue
  const activeLoans = useMemo(() => borrowings.filter((b) => b.status === 'Dipinjam'), [borrowings]);

  // Filter data untuk Timeline
  const filteredEvents = useMemo(() => {
    if (activeCategoryFilter !== 'Semua' && activeCategoryFilter !== 'Event Sekolah') return [];
    return events.filter((ev) => !selectedDateFilter || ev.tanggal === selectedDateFilter);
  }, [events, activeCategoryFilter, selectedDateFilter]);

  const filteredDutyRoster = useMemo(() => {
    if (activeCategoryFilter !== 'Semua' && activeCategoryFilter !== 'Piket Studio') return [];
    return dutyRoster;
  }, [dutyRoster, activeCategoryFilter]);

  const filteredBorrowingsForTimeline = useMemo(() => {
    if (activeCategoryFilter !== 'Semua' && activeCategoryFilter !== 'Peminjaman Aktif') return [];
    return activeLoans.filter((b) => !selectedDateFilter || b.tanggalPinjam === selectedDateFilter);
  }, [activeLoans, activeCategoryFilter, selectedDateFilter]);

  // Data ketersediaan peralatan untuk tabel status unit
  const filteredEq = useMemo(() => {
    return equipment.filter((eq) => eqCategoryFilter === 'Semua' || eq.kategori === eqCategoryFilter);
  }, [equipment, eqCategoryFilter]);

  // Navigation Handlers
  const handleShiftPeriod = (direction) => {
    const next = new Date(referenceDate);
    if (activeViewMode === 'calendar') {
      next.setMonth(next.getMonth() + direction);
    } else {
      next.setDate(next.getDate() + direction * 7);
    }
    setReferenceDate(next);
  };

  const handleGoToday = () => {
    setReferenceDate(new Date());
    setSelectedDateFilter(null);
  };

  const categories = [
    { label: 'Semua', count: events.length + dutyRoster.length + activeLoans.length, dotColor: null },
    { label: 'Event Sekolah', count: events.length, dotColor: '#1E3A8A' },
    { label: 'Piket Studio', count: dutyRoster.length, dotColor: '#059669' },
    { label: 'Peminjaman Aktif', count: activeLoans.length, dotColor: '#D97706' }
  ];

  const isUserAdmin = currentUser?.email?.toLowerCase().includes('admin') || currentMember?.divisi === 'Admin';
  const currentTimeWIB = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

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
          <span style={{ color: '#1E3A8A', fontWeight: 700 }}>{formatMonthYear(referenceDate)}</span>
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
              Koordinasi agenda liputan sekolah, jadwal piket studio, peminjaman unit aktif, dan ketersediaan gear real-time.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                handleGoToday();
                showToast(
                  isSupabaseConfigured
                    ? 'Jadwal disinkronkan dengan database Supabase Studio.'
                    : 'Tampilan jadwal diperbarui (Mode Lokal).',
                  'success'
                );
              }}
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
              <span>Sinkron Jadwal</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (isUserAdmin) {
                  setCurrentRole('admin');
                } else {
                  setSelectedEventForPickup({ id: null, judul: 'Peminjaman Mandiri Creative Corner', peralatanTerkunciIds: [] });
                }
              }}
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
              <span>{isUserAdmin ? 'Kelola Event di Admin' : 'Ajukan Pengambilan Alat'}</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F1F5F9',
              borderRadius: '8px',
              padding: '2px'
            }}>
              <button
                type="button"
                onClick={() => handleShiftPeriod(-1)}
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
                title={activeViewMode === 'calendar' ? 'Bulan Sebelumnya' : 'Minggu Sebelumnya'}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleGoToday}
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
                Semua / Hari Ini
              </button>
              <button
                type="button"
                onClick={() => handleShiftPeriod(1)}
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
                title={activeViewMode === 'calendar' ? 'Bulan Selanjutnya' : 'Minggu Selanjutnya'}
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
              <strong style={{ fontSize: '0.875rem' }}>{formatMonthYear(referenceDate)}</strong>
              {selectedDateFilter && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.685rem',
                  background: '#1E3A8A',
                  color: '#FFFFFF',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }} onClick={() => setSelectedDateFilter(null)} title="Klik untuk reset filter tanggal">
                  Filter: {selectedDateFilter} ✕
                </span>
              )}
            </div>
          </div>

          {/* View Switcher Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
            gap: '3px',
            flexWrap: 'wrap'
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

        {/* Sub-strip Category Filters */}
        {activeViewMode === 'timeline' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginRight: '0.2rem' }}>
              Filter:
            </span>
            {categories.map((cat) => {
              const isSelected = activeCategoryFilter === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat.label)}
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
                  <span style={{ fontSize: '0.675rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. VIEW MODE CONTENT */}
      {activeViewMode === 'my-tasks' ? (
        
        /* VIEW: TUGAS SAYA (DEDIKATED PERSONAL ASSIGNMENTS) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={20} color="#1E3A8A" />
                <span>Jadwal Dokumentasi Pribadi ({currentMember.nama})</span>
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#475569', margin: '2px 0 0 0' }}>
                Seluruh agenda liputan sekolah yang dimandatkan kepada Anda oleh Administrator Studio.
              </p>
            </div>
          </div>

          {myPersonalAssignments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', background: '#F8FAFC' }}>
              <CalendarDays size={38} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '1rem' }}>Belum Ada Penugasan Liputan untuk Anda</div>
              <p style={{ fontSize: '0.825rem', color: '#64748B', maxWidth: '460px', margin: '0.35rem auto 0' }}>
                Anda belum dijadwalkan pada agenda liputan resmi. Jika perlu meminjam alat secara mandiri, gunakan tab Peminjaman Alat.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {myPersonalAssignments.map(({ event, personnel }) => {
                const lockedTools = equipment.filter((eq) => event.peralatanTerkunciIds?.includes(eq.id));
                return (
                  <div key={event.id} className="card" style={{ borderLeft: '4px solid #1E3A8A', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: '#EFF6FF',
                          color: '#1E3A8A',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {personnel.peran === 'Video' || personnel.peran === 'Videografer' ? (
                            <Video size={14} />
                          ) : personnel.peran?.includes('Live Report') ? (
                            <Smartphone size={14} />
                          ) : (
                            <Camera size={14} />
                          )}
                          Peran: {personnel.peran}
                        </div>
                        <StatusBadge status={personnel.statusTugas} />
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                        {event.judul}
                      </h3>

                      <div style={{ fontSize: '0.825rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CalendarIcon size={14} color="#64748B" />
                          <span>{formatReadableDate(event.tanggal)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} color="#64748B" />
                          <span>{event.waktuMulai} - {event.waktuSelesai} WIB</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={14} color="#64748B" />
                          <span>{event.lokasi || '-'}</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          background: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          color: '#1E3A8A',
                          marginTop: '0.25rem'
                        }}>
                          <ShieldCheck size={14} color="#1E3A8A" />
                          <span>Ditetapkan oleh: <strong>{event.ditugaskanOleh || 'Admin Studio'}</strong></span>
                        </div>
                      </div>

                      {lockedTools.length > 0 && (
                        <div style={{
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '0.65rem',
                          marginBottom: '1rem',
                          fontSize: '0.785rem'
                        }}>
                          <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                            Peralatan Terkunci untuk Agenda Ini:
                          </div>
                          <ul style={{ paddingLeft: '1.2rem', color: '#334155', margin: 0 }}>
                            {lockedTools.map((t) => (
                              <li key={t.id}>{t.nama}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
                      {event.status === 'Selesai' || personnel.statusTugas === 'Sudah Melaksanakan Tugas' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: '#059669', fontWeight: 700 }}>
                          <ShieldCheck size={16} />
                          <span>Tugas Liputan Tuntas</span>
                        </div>
                      ) : event.status === 'Dibatalkan' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: '#E11D48', fontWeight: 600 }}>
                          <span>Agenda Dibatalkan</span>
                        </div>
                      ) : personnel.statusTugas === 'Sedang Melaksanakan Tugas' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: '#D97706', fontWeight: 600 }}>
                          <Clock size={16} />
                          <span>Sedang Berjalan di Lapangan</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedEventForPickup(event)}
                          id={`btn-pickup-event-${event.id}`}
                        >
                          <ClipboardCheck size={15} />
                          <span>Isi Formulir Inspeksi Pengambilan</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      ) : activeViewMode === 'calendar' ? (
        
        /* VIEW: KALENDER BULANAN INTERAKTIF */
        <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
              <div key={d} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#64748B', padding: '0.35rem 0', textTransform: 'uppercase' }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {monthDaysGrid.map((cell, idx) => {
              if (!cell) {
                return <div key={`pad-${idx}`} style={{ minHeight: '90px', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #E2E8F0' }} />;
              }
              const totalCount = cell.events.length + cell.loans.length;
              return (
                <div
                  key={cell.iso}
                  onClick={() => {
                    setSelectedDateFilter(cell.iso);
                    setActiveViewMode('timeline');
                  }}
                  style={{
                    minHeight: '95px',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: cell.isToday ? '#EFF6FF' : '#FFFFFF',
                    border: cell.isToday ? '1.5px solid #1E3A8A' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    transition: 'border-color 0.15s ease'
                  }}
                  className="hover:border-blue-400"
                  title="Klik untuk melihat detail agenda di hari ini"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: cell.isToday ? 800 : 600,
                      color: cell.isToday ? '#1E3A8A' : '#0F172A'
                    }}>
                      {cell.day}
                    </span>
                    {totalCount > 0 && (
                      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: '#1E3A8A', color: '#FFFFFF', padding: '0 5px', borderRadius: '9999px' }}>
                        {totalCount}
                      </span>
                    )}
                  </div>

                  {cell.events.slice(0, 2).map((ev) => (
                    <div key={ev.id} style={{
                      fontSize: '0.675rem',
                      background: '#DBEAFE',
                      color: '#1E3A8A',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {ev.judul}
                    </div>
                  ))}
                  {cell.loans.slice(0, 1).map((ln) => (
                    <div key={ln.id} style={{
                      fontSize: '0.65rem',
                      background: '#FEF3C7',
                      color: '#92400E',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      Pinjam: {ln.peminjamNama}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

      ) : (
        
        /* VIEW: AGENDA TIMELINE (SPLIT 8-COL TIMELINE + 4-COL RIGHT SIDEBAR) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* LEFT MAIN: Timeline & Multi-Day Strip */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Interactive 7-Day Week Strip */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '0.65rem 0.75rem',
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', textAlign: 'center' }}>
                {weekDays.map((item) => {
                  const isSelected = selectedDateFilter === item.iso;
                  return (
                    <div
                      key={item.iso}
                      onClick={() => setSelectedDateFilter(isSelected ? null : item.iso)}
                      style={{
                        padding: '0.45rem 0.25rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: isSelected ? '#1E3A8A' : item.isToday ? '#EFF6FF' : 'transparent',
                        border: isSelected ? '1px solid #1E3A8A' : item.isToday ? '1px solid #93C5FD' : '1px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                      title={isSelected ? 'Klik untuk menampilkan semua tanggal' : `Filter agenda tanggal ${item.iso}`}
                    >
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.675rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: isSelected ? '#DBEAFE' : item.isToday ? '#1E3A8A' : '#64748B'
                      }}>
                        {item.dayName}
                      </div>
                      <div style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: isSelected ? '#FFFFFF' : item.isToday ? '#1E3A8A' : '#0F172A',
                        lineHeight: 1.2
                      }}>
                        {item.dateNum}
                      </div>
                      <span style={{
                        fontSize: '0.65rem',
                        color: isSelected ? '#93C5FD' : item.agendaCount > 0 ? '#1E40AF' : '#94A3B8',
                        fontWeight: item.agendaCount > 0 || item.isToday ? 700 : 500,
                        display: 'block',
                        marginTop: '2px'
                      }}>
                        {item.agendaCount > 0 ? `${item.agendaCount} Agenda` : item.isToday ? 'Hari Ini' : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Linear Timeline Card Stream */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative'
            }}>
              {/* Timeline Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.85rem',
                marginBottom: '1rem',
                borderBottom: '1px solid #E2E8F0',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="#1E3A8A" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    {selectedDateFilter
                      ? `Agenda Operasional — ${formatReadableDate(selectedDateFilter)}`
                      : 'Semua Agenda Operasional & Jadwal Studio'}
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
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                  <span>Jam Studio: <strong style={{ color: '#0F172A' }}>{currentTimeWIB} WIB</strong></span>
                </div>
              </div>

              {/* Dynamic Event Cards */}
              {filteredEvents.length === 0 && filteredDutyRoster.length === 0 && filteredBorrowingsForTimeline.length === 0 ? (
                <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B' }}>
                  <Inbox size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>
                    Tidak Ada Agenda pada Filter Terpilih
                  </div>
                  <p style={{ fontSize: '0.8rem', margin: '0.25rem auto 0.75rem', maxWidth: '420px' }}>
                    Belum ada jadwal liputan event, piket studio, atau peminjaman alat yang sesuai dengan tanggal atau kategori ini.
                  </p>
                  {selectedDateFilter && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedDateFilter(null)}
                    >
                      Tampilkan Semua Tanggal
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* 1. REAL EVENTS FROM SUPABASE */}
                  {filteredEvents.map((ev) => {
                    const lockedTools = equipment.filter((eq) => ev.peralatanTerkunciIds?.includes(eq.id));
                    const isFeaturedNavy = ev.status !== 'Selesai' && ev.status !== 'Dibatalkan';
                    return (
                      <div
                        key={ev.id}
                        style={{
                          background: isFeaturedNavy ? '#0B192C' : '#F8FAFC',
                          color: isFeaturedNavy ? '#FFFFFF' : '#0F172A',
                          borderRadius: '10px',
                          padding: '1rem',
                          border: isFeaturedNavy ? 'none' : '1px solid #E2E8F0',
                          borderLeft: `4px solid ${ev.status === 'Selesai' ? '#059669' : ev.status === 'Dibatalkan' ? '#E11D48' : '#1E3A8A'}`,
                          boxShadow: isFeaturedNavy ? '0 4px 6px -1px rgba(11, 25, 44, 0.2)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                              <span style={{
                                background: isFeaturedNavy ? '#1E3A8A' : '#DBEAFE',
                                color: isFeaturedNavy ? '#FFFFFF' : '#1E40AF',
                                fontSize: '0.675rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px'
                              }}>
                                EVENT RESMI SEKOLAH
                              </span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: isFeaturedNavy ? '#93C5FD' : '#475569' }}>
                                {ev.tanggal} • {ev.waktuMulai || '08:00'} - {ev.waktuSelesai || '16:00'} WIB
                              </span>
                            </div>

                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: isFeaturedNavy ? '#FFFFFF' : '#0F172A', margin: '0 0 4px 0' }}>
                              {ev.judul}
                            </h4>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.785rem', color: isFeaturedNavy ? '#CBD5E1' : '#475569', flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={13} /> {ev.lokasi || 'Lokasi Studio'}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Users size={13} /> {ev.personil?.length || 0} Kru Ditugaskan
                              </span>
                            </div>
                          </div>

                          <StatusBadge status={ev.status} />
                        </div>

                        {/* Gear Kit & Roster Sub-bar */}
                        <div style={{
                          marginTop: '0.75rem',
                          paddingTop: '0.65rem',
                          borderTop: isFeaturedNavy ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.65rem',
                          fontSize: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{ color: isFeaturedNavy ? '#94A3B8' : '#64748B', fontWeight: 600 }}>Gear Kit:</span>
                            {lockedTools.length > 0 ? (
                              lockedTools.map((t) => (
                                <span key={t.id} style={{
                                  background: isFeaturedNavy ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                                  border: isFeaturedNavy ? 'none' : '1px solid #E2E8F0',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontFamily: 'var(--font-mono)'
                                }}>
                                  {t.nama}
                                </span>
                              ))
                            ) : (
                              <span style={{ opacity: 0.7 }}>Belum ada gear dikunci</span>
                            )}
                          </div>

                          {ev.personil?.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: isFeaturedNavy ? '#94A3B8' : '#64748B' }}>Kru:</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                {ev.personil.map((p, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      padding: '1px 7px',
                                      borderRadius: '9999px',
                                      background: isFeaturedNavy ? '#1E3A8A' : '#EFF6FF',
                                      color: isFeaturedNavy ? '#FFFFFF' : '#1E3A8A',
                                      fontSize: '0.7rem',
                                      fontWeight: 600
                                    }}
                                    title={`${p.nama} — ${p.peran}`}
                                  >
                                    {p.nama} ({p.peran})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* 2. REAL ACTIVE BORROWINGS & OVERDUE ALERTS */}
                  {filteredBorrowingsForTimeline.map((b) => {
                    const overdue = checkLoanOverdue(b);
                    return (
                      <div
                        key={b.id}
                        style={{
                          background: overdue.isOverdue ? '#FFF1F2' : '#FFFBEB',
                          borderRadius: '10px',
                          padding: '0.85rem 1rem',
                          border: `1px solid ${overdue.isOverdue ? '#FECDD3' : '#FDE68A'}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                          {overdue.isOverdue && <AlertTriangle size={18} color="#E11D48" style={{ marginTop: '2px', flexShrink: 0 }} />}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px', flexWrap: 'wrap' }}>
                              <span style={{
                                background: overdue.isOverdue ? '#E11D48' : '#FEF3C7',
                                color: overdue.isOverdue ? '#FFFFFF' : '#92400E',
                                fontSize: '0.675rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-mono)'
                              }}>
                                {overdue.isOverdue ? `OVERDUE • ${overdue.label}` : `PEMINJAMAN • ${b.id}`}
                              </span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: overdue.isOverdue ? '#9F1239' : '#78350F' }}>
                                {b.tanggalPinjam} • Batas {b.batasWaktuKembali || '16:00'} WIB
                              </span>
                            </div>
                            <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>
                              {b.peralatanNama} — Peminjam: {b.peminjamNama} ({b.peminjamKelas})
                            </strong>
                            <p style={{ fontSize: '0.75rem', color: overdue.isOverdue ? '#881337' : '#78350F', margin: '2px 0 0 0' }}>
                              Keperluan: {b.keperluan || '-'}
                            </p>
                          </div>
                        </div>

                        <StatusBadge status={b.status} />
                      </div>
                    );
                  })}

                  {/* 3. REAL PIKET JAGA STUDIO (DUTY ROSTER) */}
                  {filteredDutyRoster.map((duty) => (
                    <div
                      key={duty.id}
                      style={{
                        background: '#F0FDF4',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        border: '1px solid #BBF7D0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', flexShrink: 0 }}></span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.675rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>
                              PIKET STUDIO
                            </span>
                            <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>
                              {duty.hari} ({duty.tanggal})
                            </strong>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: '#475569', margin: '2px 0 0 0' }}>
                            {duty.tanggungJawab} • Petugas: <strong>{Array.isArray(duty.petugas) ? duty.petugas.join(', ') : duty.petugas}</strong>
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#475569' }}>
                          {duty.jamOperasional} WIB
                        </span>
                        <StatusBadge status={duty.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ketersediaan Unit Studio Real-time */}
            <div className="card" style={{ margin: 0 }}>
              <div className="card-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 className="card-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Sparkles size={17} color="#1E3A8A" />
                    <span>Peta Ketersediaan Unit Studio Real-Time</span>
                  </h3>
                  <div className="card-subtitle" style={{ fontSize: '0.775rem' }}>
                    Pantau status ketersediaan seluruh kamera, lensa, baterai, dan ruang studio saat ini.
                  </div>
                </div>
                <select
                  className="form-select"
                  value={eqCategoryFilter}
                  onChange={(e) => setEqCategoryFilter(e.target.value)}
                  style={{ width: 'auto', fontSize: '0.75rem', padding: '0.3rem 0.6rem', height: '32px' }}
                >
                  {['Semua', 'Kamera', 'Lensa', 'Baterai', 'Memory Card', 'Audio & Mikrofon', 'Lighting & Tata Cahaya', 'Tripod & Aksesori', 'Ruang Studio'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="table-container" style={{ margin: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Nama Alat / Kode</th>
                      <th>Kategori</th>
                      <th>Kondisi Fisik</th>
                      <th>Status Ketersediaan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEq.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.nama}</strong>
                          <div style={{ fontSize: '0.725rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>{item.kode || item.id}</div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#475569' }}>{item.kategori}</td>
                        <td style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>{item.kondisiFisik || 'Baik'}</td>
                        <td>
                          <StatusBadge status={item.status} />
                          {item.status === 'Dipinjam' && item.peminjamAktif && (
                            <div style={{ fontSize: '0.7rem', color: '#D97706', marginTop: '2px' }}>
                              Dipakai: {item.peminjamAktif}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: 4 Columns "Penugasan Saya & Checklist Persiapan Real" */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                    fontSize: '0.95rem',
                    flexShrink: 0
                  }}>
                    {getInitials(currentMember.nama)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {currentMember.nama}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {currentMember.divisi || currentMember.peranUtama || 'Anggota Kru'} • {currentMember.kelas}
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
                  borderRadius: '9999px',
                  flexShrink: 0
                }}>
                  {myPersonalAssignments.length} Tugas
                </span>
              </div>

              {activeUpcomingAssignment ? (() => {
                const { event, personnel } = activeUpcomingAssignment;
                const lockedTools = equipment.filter((eq) => event.peralatanTerkunciIds?.includes(eq.id));
                const checkedCount = lockedTools.filter((t) => checkedToolIds[t.id]).length;

                return (
                  <div style={{
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '0.9rem',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{
                        background: '#1E3A8A',
                        color: '#FFFFFF',
                        fontSize: '0.675rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Clock size={10} />
                        <span>Peran: {personnel.peran}</span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: '#0F172A', fontWeight: 600 }}>
                        {event.tanggal} • {event.waktuMulai || '08:00'} WIB
                      </span>
                    </div>

                    <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                      {event.judul}
                    </h5>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      <MapPin size={12} color="#1E3A8A" />
                      <span>{event.lokasi || 'Lokasi Studio'}</span>
                    </div>

                    {/* Real Gear Checklist for Assigned Tools */}
                    {lockedTools.length > 0 && (
                      <div style={{
                        background: '#FFFFFF',
                        borderRadius: '8px',
                        padding: '0.65rem',
                        border: '1px solid #E2E8F0',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.685rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>
                            Checklist Gear Terkunci:
                          </span>
                          <span style={{ fontSize: '0.685rem', fontWeight: 700, color: '#1E3A8A' }}>
                            {checkedCount} / {lockedTools.length} Dicek
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.775rem' }}>
                          {lockedTools.map((tool) => (
                            <label key={tool.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '0.4rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                                <input
                                  type="checkbox"
                                  checked={Boolean(checkedToolIds[tool.id])}
                                  onChange={() => toggleToolCheck(tool.id)}
                                  style={{ accentColor: '#1E3A8A' }}
                                />
                                <span style={{ color: '#0F172A', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {tool.nama}
                                </span>
                              </div>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.675rem', color: '#64748B', flexShrink: 0 }}>
                                {tool.kode || tool.id}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {event.status === 'Selesai' || personnel.statusTugas === 'Sudah Melaksanakan Tugas' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700, fontSize: '0.8rem', padding: '0.4rem' }}>
                        <CheckCircle2 size={16} />
                        <span>Tugas Liputan Tuntas</span>
                      </div>
                    ) : personnel.statusTugas === 'Sedang Melaksanakan Tugas' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#D97706', fontWeight: 700, fontSize: '0.8rem', padding: '0.4rem' }}>
                        <Clock size={15} />
                        <span>Sedang Berjalan di Lapangan</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setSelectedEventForPickup(event)}
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
                        <span>Konfirmasi & Ambil Alat</span>
                      </button>
                    )}
                  </div>
                );
              })() : (
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                  color: '#64748B',
                  fontSize: '0.8rem'
                }}>
                  <CalendarDays size={28} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>
                    Tidak Ada Penugasan Aktif
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem' }}>
                    Anda belum mendapatkan mandat liputan resmi saat ini.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setSelectedEventForPickup({ id: null, judul: 'Peminjaman Mandiri Creative Corner', peralatanTerkunciIds: [] })}
                  >
                    <ClipboardCheck size={14} />
                    <span>Ambil Unit Secara Mandiri</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL INSPEKSI PENGAMBILAN ALAT (BEFORE) DENGAN PREFILLED LOCKED TOOLS */}
      {selectedEventForPickup && (
        <PickupInspectionModal
          isOpen={Boolean(selectedEventForPickup)}
          onClose={() => setSelectedEventForPickup(null)}
          targetEvent={selectedEventForPickup.id ? selectedEventForPickup : null}
          prefilledEquipmentIds={selectedEventForPickup.peralatanTerkunciIds || []}
        />
      )}
    </div>
  );
};

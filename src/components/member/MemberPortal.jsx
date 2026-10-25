import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { CalendarTab } from './CalendarTab';
import { EquipmentLoanTab } from './EquipmentLoanTab';
import { CreativeTasksTab } from './CreativeTasksTab';
import { 
  CalendarDays, 
  Camera, 
  Palette, 
  Sparkles,
  User
} from 'lucide-react';

export const MemberPortal = () => {
  const { activeMemberId, currentUser, members, borrowings, creativeTasks } = useStudio();
  const currentMember = currentUser || members.find((m) => m.id === activeMemberId) || members[0] || {
    id: 'MEM-TEMP',
    nama: 'Anggota Creative Corner',
    kelas: 'Angkatan 25',
    divisi: 'Editor',
    peranUtama: 'Editor',
    nomorWa: '6281200000000'
  };

  const [activeTab, setActiveTab] = useState('calendar');

  // Hitung badge notifikasi
  const activeLoansCount = borrowings.filter(
    (b) => b.status === 'Dipinjam' && (b.anggotaId === activeMemberId || b.peminjamNama === currentMember?.nama)
  ).length;

  const activeTasksCount = creativeTasks.filter(
    (t) => (t.status === 'Belum Dimulai' || t.status === 'Dalam Proses') && (t.penanggungJawabId === activeMemberId || t.penanggungJawabNama === currentMember?.nama)
  ).length;

  return (
    <div>
      {/* Banner Identitas Anggota yang Sedang Masuk */}
      <div className="portal-hero-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
            flexShrink: 0
          }}>
            <img 
              src="/logo-creative-corner.png" 
              alt="Creative Corner Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(1.05rem, 3.5vw, 1.25rem)', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Selamat Datang, {currentMember.nama}
              </h1>
              <span style={{
                fontSize: '0.72rem',
                background: '#EFF6FF',
                color: '#1E3A8A',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {currentMember.kelas}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', margin: '3px 0 0 0' }}>
              Divisi: <strong>{currentMember.divisi || currentMember.peranUtama}</strong> • WA: <code>+{currentMember.nomorWa}</code>
            </p>
          </div>
        </div>

        <div className="portal-hero-stats">
          <div className="portal-hero-stat-card">
            <div style={{ fontSize: '0.675rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Alat Dipinjam</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: activeLoansCount > 0 ? '#D97706' : '#0F172A', lineHeight: 1.1 }}>
              {activeLoansCount}
            </div>
          </div>

          <div className="portal-hero-stat-card">
            <div style={{ fontSize: '0.675rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Tugas Aktif</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E3A8A', lineHeight: 1.1 }}>
              {activeTasksCount}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigasi Portal Anggota */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
          id="tab-member-calendar"
        >
          <CalendarDays size={18} />
          <span>Kalender Terpadu & Agenda</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
          id="tab-member-equipment"
        >
          <Camera size={18} />
          <span>Peminjaman Alat & Ruang</span>
          {activeLoansCount > 0 && (
            <span className="tab-pill-count" style={{ background: '#FFFBEB', color: '#D97706' }}>
              {activeLoansCount}
            </span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
          id="tab-member-tasks"
        >
          <Palette size={18} />
          <span>Tugas Kreatif (Kanban)</span>
          {activeTasksCount > 0 && (
            <span className="tab-pill-count">{activeTasksCount}</span>
          )}
        </button>

      </div>

      {/* Konten Sub-Tab */}
      {activeTab === 'calendar' && <CalendarTab />}
      {activeTab === 'equipment' && <EquipmentLoanTab />}
      {activeTab === 'tasks' && <CreativeTasksTab />}
    </div>
  );
};

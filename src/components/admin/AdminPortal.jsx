import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { EventCoverageTab } from './EventCoverageTab';
import { WhatsAppRemindersTab } from './WhatsAppRemindersTab';
import { InventoryMasterTab } from './InventoryMasterTab';
import { PCMonitoringTab } from './PCMonitoringTab';
import { MembersManagementTab } from './MembersManagementTab';
import { 
  ShieldCheck, 
  Camera, 
  MessageSquare, 
  Layers, 
  Monitor, 
  FileText,
  Users,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminPortal = () => {
  const { borrowings, pcClients, events, equipment, members, isSupabaseConfigured, clearAllData } = useStudio();
  const [activeTab, setActiveTab] = useState('inventory'); // default ke inventory agar admin langsung dapat input data

  // Hitung notifikasi untuk tab
  const activeBorrowersCount = borrowings.filter((b) => b.status === 'Dipinjam').length;
  const activePCCount = pcClients.filter((p) => p.status === 'Aktif').length;
  const anomaliesCount = borrowings.filter((b) => b.inspeksiPengembalian?.anomaliTerdeteksi).length;

  return (
    <div>
      {/* Admin Header Banner */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(1.05rem, 3.5vw, 1.25rem)', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Portal Pengelola / Administrator
              </h1>
              <span style={{
                fontSize: '0.72rem',
                background: '#ECFDF5',
                color: '#059669',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 700,
                border: '1px solid #A7F3D0'
              }}>
                Akses Penuh
              </span>

              <span style={{
                fontSize: '0.7rem',
                background: isSupabaseConfigured ? '#EFF6FF' : '#F1F5F9',
                color: isSupabaseConfigured ? '#1E3A8A' : '#64748B',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 700,
                border: isSupabaseConfigured ? '1px solid #BFDBFE' : '1px solid #CBD5E1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isSupabaseConfigured ? '#10B981' : '#94A3B8'
                }}></span>
                <span>{isSupabaseConfigured ? 'Supabase Cloud' : 'Offline Mode'}</span>
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', margin: '3px 0 0 0' }}>
              Pusat kendali inventaris kamera, liputan event, registrasi personil, dan kiosk PC.
            </p>
          </div>
        </div>

        {/* Quick Admin Metrics */}
        <div className="portal-hero-stats">
          <div className="portal-hero-stat-card">
            <div style={{ fontSize: '0.675rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Aset Terdaftar</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E3A8A', lineHeight: 1.1 }}>
              {equipment.length}
            </div>
          </div>

          <div className="portal-hero-stat-card">
            <div style={{ fontSize: '0.675rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Peminjam Aktif</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: activeBorrowersCount > 0 ? '#D97706' : '#0F172A', lineHeight: 1.1 }}>
              {activeBorrowersCount}
            </div>
          </div>

          <div className="portal-hero-stat-card">
            <div style={{ fontSize: '0.675rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>PC Dipakai</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E3A8A', lineHeight: 1.1 }}>
              {activePCCount} / 6
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: '#CBD5E1',
              color: '#64748B',
              fontSize: '0.725rem',
              alignSelf: 'center',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px'
            }}
            onClick={() => {
              if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mengosongkan seluruh data studio agar dapat mengisi inventaris dan agenda dari awal? Tindakan ini tidak dapat dibatalkan.')) {
                clearAllData();
              }
            }}
            title="Kosongkan data studio agar admin dapat mengisi dari awal"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigasi Portal Admin */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
          id="tab-admin-inventory"
        >
          <Layers size={18} />
          <span>Inventaris & Validasi Laporan Fisik</span>
          {equipment.length > 0 && (
            <span className="tab-pill-count">{equipment.length}</span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'coverage' ? 'active' : ''}`}
          onClick={() => setActiveTab('coverage')}
          id="tab-admin-coverage"
        >
          <Camera size={18} />
          <span>Penjadwalan & Live Tracker Lapangan</span>
          {events.length > 0 && (
            <span className="tab-pill-count">{events.length}</span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
          id="tab-admin-members"
        >
          <Users size={18} />
          <span>Manajemen Anggota</span>
          <span className="tab-pill-count">{members.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'whatsapp' ? 'active' : ''}`}
          onClick={() => setActiveTab('whatsapp')}
          id="tab-admin-whatsapp"
        >
          <MessageSquare size={18} />
          <span>Pengingat WhatsApp Instan</span>
          {activeBorrowersCount > 0 && (
            <span className="tab-pill-count" style={{ background: '#ECFDF5', color: '#059669' }}>
              {activeBorrowersCount}
            </span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'pc-monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('pc-monitoring')}
          id="tab-admin-pc"
        >
          <Monitor size={18} />
          <span>Pengawasan Klien PC & Log</span>
          {activePCCount > 0 && (
            <span className="tab-pill-count" style={{ background: '#EFF6FF', color: '#1E3A8A' }}>
              {activePCCount}
            </span>
          )}
        </button>

      </div>

      {/* Konten Sub-Tab */}
      {activeTab === 'inventory' && <InventoryMasterTab />}
      {activeTab === 'coverage' && <EventCoverageTab />}
      {activeTab === 'members' && <MembersManagementTab />}
      {activeTab === 'whatsapp' && <WhatsAppRemindersTab />}
      {activeTab === 'pc-monitoring' && <PCMonitoringTab />}
    </div>
  );
};

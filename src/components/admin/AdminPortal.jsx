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
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
          }}>
            <img 
              src="/logo-creative-corner.png" 
              alt="Creative Corner Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                Portal Pengelola / Administrator
              </h1>
              <span style={{
                fontSize: '0.75rem',
                background: '#ECFDF5',
                color: '#059669',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 700,
                border: '1px solid #A7F3D0'
              }}>
                Akses Penuh Studio
              </span>

              <span style={{
                fontSize: '0.72rem',
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
                <span>{isSupabaseConfigured ? 'Supabase Cloud (Database Utama)' : 'Menghubungkan ke Supabase Cloud...'}</span>
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#475569' }}>
              Pusat kendali inventaris kamera, liputan event sekolah, registrasi personil, validasi fisik, dan kiosk PC.
            </p>
          </div>
        </div>

        {/* Quick Admin Metrics */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Aset Terdaftar</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E3A8A' }}>
              {equipment.length}
            </div>
          </div>

          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Peminjam Aktif</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: activeBorrowersCount > 0 ? '#D97706' : '#0F172A' }}>
              {activeBorrowersCount}
            </div>
          </div>

          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>PC Digunakan</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E3A8A' }}>
              {activePCCount} / 6
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: '#CBD5E1',
              color: '#64748B',
              fontSize: '0.75rem',
              alignSelf: 'center',
              padding: '0.5rem 0.85rem'
            }}
            onClick={() => {
              if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mengosongkan seluruh data studio agar dapat mengisi inventaris dan agenda dari awal? Tindakan ini tidak dapat dibatalkan.')) {
                clearAllData();
              }
            }}
            title="Kosongkan data studio agar admin dapat mengisi dari awal"
          >
            <RotateCcw size={13} />
            <span>Reset Data</span>
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

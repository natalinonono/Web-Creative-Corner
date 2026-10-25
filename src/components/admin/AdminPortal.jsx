import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { EventCoverageTab } from './EventCoverageTab';
import { WhatsAppRemindersTab } from './WhatsAppRemindersTab';
import { InventoryMasterTab } from './InventoryMasterTab';
import { PCMonitoringTab } from './PCMonitoringTab';
import { MembersManagementTab } from './MembersManagementTab';
import { Modal } from '../common/Modal';
import { 
  ShieldCheck, 
  Camera, 
  MessageSquare, 
  Layers, 
  Monitor, 
  FileText,
  Users,
  AlertTriangle,
  RotateCcw,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { checkLoanOverdue } from '../../utils/loanOverdue';
import { exportBorrowingsToCSV, exportEventsToCSV, exportInventoryToCSV } from '../../utils/exportReports';

export const AdminPortal = () => {
  const { borrowings, pcClients, events, equipment, members, isSupabaseConfigured, clearAllData } = useStudio();
  const [activeTab, setActiveTab] = useState('inventory'); // default ke inventory agar admin langsung dapat input data
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Hitung notifikasi untuk tab & status keterlambatan
  const activeBorrowersCount = borrowings.filter((b) => b.status === 'Dipinjam').length;
  const overdueLoansCount = borrowings.filter((b) => checkLoanOverdue(b).isOverdue).length;
  const activePCCount = pcClients.filter((p) => p.status === 'Aktif').length;
  const anomaliesCount = borrowings.filter((b) => b.inspeksiPengembalian?.anomaliTerdeteksi).length;

  return (
    <div>
      {/* Admin Header Banner */}
      <div className="portal-hero-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3px',
            boxShadow: 'var(--shadow-xs)',
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
              <h1 style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Pusat Kendali Pengelola Studio
              </h1>
              <span style={{
                fontSize: '0.685rem',
                background: '#ECFDF5',
                color: '#059669',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 700,
                border: '1px solid #A7F3D0'
              }}>
                Akses Penuh
              </span>

              <span style={{
                fontSize: '0.685rem',
                background: isSupabaseConfigured ? '#EFF6FF' : '#F1F5F9',
                color: isSupabaseConfigured ? '#1E3A8A' : '#64748B',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 700,
                border: isSupabaseConfigured ? '1px solid #BFDBFE' : '1px solid #CBD5E1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: isSupabaseConfigured ? '#10B981' : '#94A3B8'
                }}></span>
                <span>{isSupabaseConfigured ? 'Supabase Cloud' : 'Offline Mode'}</span>
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#475569', margin: '2px 0 0 0' }}>
              Pusat kendali inventaris kamera, liputan event, registrasi personil, dan kiosk PC.
            </p>
          </div>
        </div>

        {/* Quick Admin Metrics */}
        <div className="portal-hero-stats">
          <div className="portal-hero-stat-card">
            <div style={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Aset Terdaftar</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E3A8A', lineHeight: 1.1, fontFamily: 'var(--font-mono)' }}>
              {equipment.length}
            </div>
          </div>

          <div className="portal-hero-stat-card">
            <div style={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Peminjam Aktif</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: activeBorrowersCount > 0 ? '#D97706' : '#0F172A', lineHeight: 1.1, fontFamily: 'var(--font-mono)' }}>
              {activeBorrowersCount}
            </div>
          </div>

          <div className="portal-hero-stat-card">
            <div style={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>PC Dipakai</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E3A8A', lineHeight: 1.1, fontFamily: 'var(--font-mono)' }}>
              {activePCCount} / 6
            </div>
          </div>

          {overdueLoansCount > 0 && (
            <div 
              className="portal-hero-stat-card" 
              style={{ borderColor: '#FECDD3', background: '#FFF1F2', cursor: 'pointer' }}
              onClick={() => setActiveTab('whatsapp')}
              title="Klik untuk membuka WhatsApp Pengingat & Kirim Teguran"
            >
              <div style={{ fontSize: '0.65rem', color: '#E11D48', textTransform: 'uppercase', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>Terlambat</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#E11D48', lineHeight: 1.1, fontFamily: 'var(--font-mono)' }}>
                {overdueLoansCount}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.4rem', alignSelf: 'center' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{
                background: '#047857',
                borderColor: '#059669',
                fontSize: '0.725rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px'
              }}
              onClick={() => setIsExportModalOpen(true)}
              id="btn-open-export-modal"
              title="Unduh rekap data peminjaman dan liputan event ke format Excel (.CSV)"
            >
              <Download size={13} />
              <span>Ekspor LPJ</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: '#CBD5E1',
                color: '#64748B',
                fontSize: '0.725rem',
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

      {/* MODAL EKSPOR LAPORAN LPJ (EXCEL / CSV) */}
      {isExportModalOpen && (
        <Modal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          title="Ekspor Laporan LPJ Studio ke Excel (.CSV)"
          footer={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsExportModalOpen(false)}
            >
              Tutup
            </button>
          }
        >
          <div style={{ paddingBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Pilih laporan yang ingin diunduh. File diformat khusus dengan standar <strong>UTF-8 BOM</strong> sehingga dapat langsung dibuka dengan rapi dan teratur di <strong>Microsoft Excel, Google Sheets, atau Numbers</strong> untuk keperluan Laporan Pertanggungjawaban (LPJ) ke Pembina OSIS / Pihak Sekolah.
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {/* Opsi 1: Rekap Peminjaman */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A' }}>
                    <FileSpreadsheet size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block' }}>
                      Rekap Riwayat Peminjaman Alat ({borrowings.length} Data)
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      Memuat nomor resi, tanggal, nama peminjam, kelas, kontak WA, daftar unit, batas jam, dan catatan inspeksi.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ background: '#059669', borderColor: '#047857' }}
                  onClick={() => exportBorrowingsToCSV(borrowings)}
                  id="btn-export-borrowings"
                >
                  <Download size={14} />
                  <span>Unduh .CSV</span>
                </button>
              </div>

              {/* Opsi 2: Rekap Liputan Event */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <Camera size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block' }}>
                      Rekap Agenda Liputan Event Lapangan ({events.length} Agenda)
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      Memuat judul acara, lokasi, jadwal, alokasi 4 peran petugas lapangan (Foto 1, Foto 2, Video, Live Report HP), dan alat.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ background: '#059669', borderColor: '#047857' }}
                  onClick={() => exportEventsToCSV(events, members, equipment)}
                  id="btn-export-events"
                >
                  <Download size={14} />
                  <span>Unduh .CSV</span>
                </button>
              </div>

              {/* Opsi 3: Master Inventaris */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                    <Layers size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block' }}>
                      Katalog Master Inventaris Aset ({equipment.length} Unit)
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      Daftar seluruh unit kamera, ragam lensa, baterai, memory card, mikrofon, lighting, dan fasilitas studio.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ background: '#059669', borderColor: '#047857' }}
                  onClick={() => exportInventoryToCSV(equipment)}
                  id="btn-export-inventory"
                >
                  <Download size={14} />
                  <span>Unduh .CSV</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  Monitor, 
  Clock, 
  User, 
  Lock, 
  Unlock, 
  Search, 
  Activity, 
  History, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Edit3,
  Plus,
  Trash2,
  Cpu,
  Settings,
  Download,
  Copy,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Terminal,
  FileCode,
  Check
} from 'lucide-react';

export const PCMonitoringTab = () => {
  const { 
    pcClients, 
    pcLogs, 
    endPCSession, 
    extendPCSession,
    updatePCClient,
    addPCClient,
    deletePCClient
  } = useStudio();

  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [selectedPCFilter, setSelectedPCFilter] = useState('Semua');

  // Modal State Edit PC
  const [editingPC, setEditingPC] = useState(null);
  const [editNamaUnit, setEditNamaUnit] = useState('');
  const [editSpesifikasi, setEditSpesifikasi] = useState('');
  const [editStatus, setEditStatus] = useState('Tersedia');

  // Modal State Tambah PC Baru
  const [isAddPCModalOpen, setIsAddPCModalOpen] = useState(false);
  const [newPCId, setNewPCId] = useState('');
  const [newPCNama, setNewPCNama] = useState('');
  const [newPCSpesifikasi, setNewPCSpesifikasi] = useState('');

  // Modal Panduan Auto-Startup PC Windows
  const [isStartupGuideOpen, setIsStartupGuideOpen] = useState(false);
  const [copiedPCId, setCopiedPCId] = useState(null);
  const [guideActivePC, setGuideActivePC] = useState('PC-01');
  const [activeGuideTab, setActiveGuideTab] = useState('bat'); // 'bat' | 'shortcut' | 'assigned'

  // Salin URL Kiosk khusus untuk PC terpilih
  const handleCopyKioskUrl = (pcId) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://web-creative-corner.vercel.app';
    const url = `${origin}/?mode=kiosk&pc=${pcId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedPCId(pcId);
      setTimeout(() => setCopiedPCId(null), 2500);
    });
  };

  // Unduh Script .bat Otomatis untuk Startup Windows
  const handleDownloadStartupScript = (pcId) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://web-creative-corner.vercel.app';
    const kioskUrl = `${origin}/?mode=kiosk&pc=${pcId}`;
    
    const batContent = `@echo off
:: ===================================================================
:: CREATIVE CORNER STUDIO - AUTO STARTUP KIOSK LAUNCHER
:: Target Workstation : ${pcId}
:: Tautan Kiosk       : ${kioskUrl}
:: ===================================================================
title Memulai Kiosk Creative Corner - ${pcId}
echo ===================================================================
echo   MEMULAI SISTEM KIOSK CREATIVE CORNER STUDIO - ${pcId}
echo ===================================================================
echo Menunggu koneksi jaringan dan startup sistem Windows selesai (5 detik)...
timeout /t 5 /nobreak >nul

set TARGET_URL=${origin}/?mode=kiosk^&pc=${pcId}

:: 1. Cek Google Chrome di Program Files
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    echo Menjalankan Google Chrome Kiosk Fullscreen...
    start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --kiosk --incognito "%TARGET_URL%"
    goto SELESAI
)
if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    echo Menjalankan Google Chrome (x86) Kiosk Fullscreen...
    start "" "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" --kiosk --incognito "%TARGET_URL%"
    goto SELESAI
)
if exist "%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe" (
    echo Menjalankan Google Chrome Local Kiosk Fullscreen...
    start "" "%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe" --kiosk --incognito "%TARGET_URL%"
    goto SELESAI
)

:: 2. Jika Chrome tidak ada, jalankan Microsoft Edge Kiosk Mode
echo Google Chrome tidak ditemukan, menjalankan Microsoft Edge Kiosk Fullscreen...
start msedge.exe --kiosk "%TARGET_URL%" --edge-kiosk-type=fullscreen --no-first-run

:SELESAI
echo Kiosk Creative Corner berhasil diluncurkan!
exit
`;

    const blob = new Blob([batContent], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Startup_CreativeCorner_${pcId}.bat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format detik menjadi MM:SS
  const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Filter Log
  const filteredLogs = pcLogs.filter((log) => {
    const matchPC = selectedPCFilter === 'Semua' || log.pcId === selectedPCFilter;
    const matchSearch = log.namaSiswa.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                        log.kelas.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                        log.keperluan.toLowerCase().includes(logSearchQuery.toLowerCase());
    return matchPC && matchSearch;
  });

  // Hitung total menit terpakai di log
  const totalMenitLog = pcLogs.reduce((acc, curr) => acc + (curr.durasiMenit || 0), 0);
  const activePCCount = pcClients.filter((pc) => pc.status === 'Aktif').length;

  // Buka Modal Edit Spesifikasi PC
  const handleOpenEditPC = (pc) => {
    setEditingPC(pc);
    setEditNamaUnit(pc.namaUnit || `${pc.id} Workstation`);
    setEditSpesifikasi(pc.spesifikasi || '');
    setEditStatus(pc.status === 'Aktif' ? 'Aktif' : (pc.status || 'Tersedia'));
  };

  const handleSaveEditPC = (e) => {
    e.preventDefault();
    if (!editingPC) return;

    updatePCClient(editingPC.id, {
      namaUnit: editNamaUnit.trim() || `${editingPC.id} Workstation`,
      spesifikasi: editSpesifikasi.trim() || 'Workstation Editing & Desain',
      status: editingPC.status === 'Aktif' ? 'Aktif' : editStatus
    });

    setEditingPC(null);
  };

  // Submit Tambah PC Baru
  const handleAddPCSubmit = (e) => {
    e.preventDefault();
    const generatedId = newPCId.trim().toUpperCase() || `PC-0${pcClients.length + 1}`;

    addPCClient({
      id: generatedId,
      namaUnit: newPCNama.trim() || `${generatedId} (Workstation)`,
      spesifikasi: newPCSpesifikasi.trim() || 'Intel Core i7 / RAM 32GB / GPU RTX / Monitor 144Hz'
    });

    setNewPCId('');
    setNewPCNama('');
    setNewPCSpesifikasi('');
    setIsAddPCModalOpen(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Monitor size={22} color="#1E3A8A" />
            <span>Pengawasan Klien PC Studio & Manajemen Workstation</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
            Pemantauan langsung seluruh workstation editing, pengubahan spesifikasi teknis komputer, pengendalian jarak jauh, dan arsip log aktivitas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsStartupGuideOpen(true)}
            style={{
              borderColor: '#60A5FA',
              background: '#EFF6FF',
              color: '#1E3A8A',
              fontWeight: 700
            }}
          >
            <Sparkles size={16} color="#2563EB" />
            <span>Panduan Auto-Startup PC (Windows)</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setNewPCId(`PC-0${pcClients.length + 1}`);
              setNewPCNama(`PC-0${pcClients.length + 1} (Editing Workstation)`);
              setNewPCSpesifikasi('Intel Core i9 / RAM 32GB / GPU RTX 4070 / Pen Tablet');
              setIsAddPCModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>+ Tambah Workstation PC</span>
          </button>
        </div>
      </div>

      {/* 1. PEMANTAUAN STATUS PC (LIVE GRID PC) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="#10B981" />
            <span>Live Grid Status Workstation Studio ({activePCCount} dari {pcClients.length} Sedang Digunakan)</span>
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {pcClients.map((pc) => {
            const isActive = pc.status === 'Aktif' && pc.penggunaAktif;
            const isMaintenance = pc.status === 'Perbaikan';
            const sisaDetik = pc.penggunaAktif?.sisaDetik || 0;
            const isNearTimeout = sisaDetik <= 300 && sisaDetik > 0;

            return (
              <div
                key={pc.id}
                className="card"
                style={{
                  borderTop: isActive ? '4px solid #1E3A8A' : isMaintenance ? '4px solid #F59E0B' : '4px solid #94A3B8',
                  background: isActive ? '#FFFFFF' : '#FAFAFA',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Monitor size={20} color={isActive ? '#1E3A8A' : isMaintenance ? '#D97706' : '#94A3B8'} />
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
                        {pc.id}
                      </span>
                      <div style={{ fontSize: '0.725rem', color: '#64748B' }}>
                        {pc.namaUnit || `${pc.id} Workstation`}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge ${isActive ? (isNearTimeout ? 'badge-crimson' : 'badge-emerald') : isMaintenance ? 'badge-amber' : 'badge-blue'}`}
                  >
                    <span className="badge-dot"></span>
                    {isActive ? (isNearTimeout ? 'Waktu Hampir Habis' : 'Sedang Aktif') : isMaintenance ? 'Perbaikan / Rusak' : 'Kosong / Siap Pakai'}
                  </span>
                </div>

                {/* Spesifikasi Teknis yang Dapat Diubah Admin */}
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#475569', 
                  background: '#F1F5F9',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  marginBottom: '0.75rem', 
                  minHeight: '44px',
                  lineHeight: '1.4'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <strong style={{ color: '#1E3A8A', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Cpu size={12} />
                      <span>Spesifikasi Hardware:</span>
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPC(pc)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#2563EB',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                      title="Ubah spesifikasi teknis komputer ini"
                    >
                      <Edit3 size={11} />
                      <span>Ubah Spek</span>
                    </button>
                  </div>
                  <div>{pc.spesifikasi}</div>
                </div>

                {isActive ? (
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    marginBottom: '1rem',
                    fontSize: '0.825rem'
                  }}>
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ color: '#64748B' }}>Pengguna:</span>{' '}
                      <strong>{pc.penggunaAktif.nama}</strong> ({pc.penggunaAktif.kelas})
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#64748B' }}>Keperluan:</span>{' '}
                      <span style={{ color: '#1E3A8A', fontWeight: 600 }}>{pc.penggunaAktif.keperluan}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isNearTimeout ? '#FFF1F2' : '#EFF6FF',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      border: isNearTimeout ? '1px solid #FECDD3' : '1px solid #BFDBFE'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: isNearTimeout ? '#E11D48' : '#1E3A8A', fontWeight: 700 }}>
                        ⏱️ Sisa Durasi:
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: isNearTimeout ? '#E11D48' : '#1E3A8A'
                      }}>
                        {formatTime(sisaDetik)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '1rem',
                    textAlign: 'center',
                    background: '#FAFAFA',
                    border: '1px dashed #CBD5E1',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    color: '#64748B',
                    fontSize: '0.825rem'
                  }}>
                    {isMaintenance ? 'Unit Sedang Dalam Perawatan / Perbaikan' : 'Workstation Terkunci di Layar Kiosk'}
                  </div>
                )}

                {/* Kontrol & Aksi Admin */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    {isActive ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => extendPCSession(pc.id, 15)}
                        >
                          +15 Menit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => {
                            if (window.confirm(`Hentikan paksa sesi pemakaian di ${pc.id}?`)) {
                              endPCSession(pc.id, 'Dihentikan oleh Administrator');
                            }
                          }}
                        >
                          Kunci PC
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, fontSize: '0.75rem' }}
                          onClick={() => handleOpenEditPC(pc)}
                        >
                          <Edit3 size={13} />
                          <span>Edit Spek & Status</span>
                        </button>
                        {pcClients.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                            onClick={() => {
                              if (window.confirm(`Hapus unit ${pc.id} dari sistem studio?`)) {
                                deletePCClient(pc.id);
                              }
                            }}
                            title="Hapus unit PC ini"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Tombol Khusus Auto-Startup PC Windows */}
                  <div style={{ display: 'flex', gap: '0.35rem', paddingTop: '0.2rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        flex: 1, 
                        fontSize: '0.72rem', 
                        padding: '0.3rem 0.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.25rem',
                        borderColor: copiedPCId === pc.id ? '#10B981' : '#CBD5E1',
                        color: copiedPCId === pc.id ? '#059669' : '#475569'
                      }}
                      onClick={() => handleCopyKioskUrl(pc.id)}
                      title="Salin tautan startup mode Kiosk untuk PC ini"
                    >
                      {copiedPCId === pc.id ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                      <span>{copiedPCId === pc.id ? 'URL Tersalin!' : 'Salin URL'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        flex: 1.2, 
                        fontSize: '0.72rem', 
                        padding: '0.3rem 0.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.25rem',
                        borderColor: '#93C5FD', 
                        background: '#EFF6FF', 
                        color: '#1E3A8A',
                        fontWeight: 700 
                      }}
                      onClick={() => handleDownloadStartupScript(pc.id)}
                      title="Unduh file script .bat agar PC ini otomatis membuka Kiosk saat booting"
                    >
                      <Download size={12} color="#2563EB" />
                      <span>Script .bat Startup</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ARSIP LOG PENGGUNAAN PC STUDIO */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <History size={20} color="#1E3A8A" />
              <span>Arsip Rekapitulasi Pemakaian PC Studio ({filteredLogs.length} Sesi Selesai)</span>
            </h3>
            <div className="card-subtitle">
              Riwayat siswa yang telah menggunakan workstation editing beserta keperluan dan durasi pakainya.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#1E3A8A',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.785rem',
              fontWeight: 700
            }}>
              Total Pemakaian: {totalMenitLog} Menit ({Math.round(totalMenitLog / 60 * 10) / 10} Jam)
            </span>

            {/* Filter Unit PC */}
            <select
              className="form-select"
              value={selectedPCFilter}
              onChange={(e) => setSelectedPCFilter(e.target.value)}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
            >
              <option value="Semua">Semua Unit PC</option>
              {pcClients.map((pc) => (
                <option key={pc.id} value={pc.id}>{pc.id}</option>
              ))}
            </select>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari log siswa..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem', fontSize: '0.8rem', width: '160px' }}
              />
            </div>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
            <History size={36} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Belum Ada Catatan Log Sesi Selesai</div>
            <p style={{ fontSize: '0.825rem' }}>Setiap siswa yang selesai menggunakan PC Kiosk akan otomatis terekam pada tabel ini.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID Log</th>
                  <th>Unit PC</th>
                  <th>Nama Siswa / Pengguna</th>
                  <th>Kelas</th>
                  <th>Keperluan Proyek</th>
                  <th>Durasi Pakai</th>
                  <th>Waktu Sesi</th>
                  <th>Status Penutupan</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E3A8A' }}>
                      {log.id}
                    </td>
                    <td>
                      <span className="badge badge-blue">{log.pcId}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{log.namaSiswa}</td>
                    <td>{log.kelas}</td>
                    <td style={{ maxWidth: '240px' }}>{log.keperluan}</td>
                    <td>
                      <strong>{log.durasiMenit} Menit</strong>
                    </td>
                    <td style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      {log.waktuMulai} s/d {log.waktuSelesai}
                    </td>
                    <td>
                      <span className="badge badge-emerald">
                        <CheckCircle size={12} />
                        <span>{log.statusSesi}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL EDIT SPESIFIKASI WORKSTATION PC */}
      {editingPC && (
        <Modal
          isOpen={Boolean(editingPC)}
          onClose={() => setEditingPC(null)}
          title={`Ubah Spesifikasi & Data Workstation: ${editingPC.id}`}
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingPC(null)}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveEditPC}>
                Simpan Perubahan Spesifikasi
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveEditPC}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">ID Unit PC</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPC.id}
                  disabled
                  style={{ background: '#F8FAFC', fontWeight: 700 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Unit Workstation *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editNamaUnit}
                  onChange={(e) => setEditNamaUnit(e.target.value)}
                  placeholder="Contoh: PC-01 (Editing Video 4K)"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Spesifikasi Hardware & Software Teknis *</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={editSpesifikasi}
                onChange={(e) => setEditSpesifikasi(e.target.value)}
                placeholder="Contoh: Intel Core i9-13900K / RAM 64GB DDR5 / GPU RTX 4080 / SSD NVMe 2TB / Adobe CC & DaVinci Resolve"
                required
              ></textarea>
              <div className="form-hint">
                Rincian ini akan tampil secara real-time pada kartu monitoring admin dan layar Kiosk siswa.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status Ketersediaan</label>
              <select
                className="form-select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                disabled={editingPC.status === 'Aktif'}
              >
                <option value="Tersedia">Tersedia (Siap Digunakan Siswa)</option>
                <option value="Perbaikan">Perbaikan / Maintenance (Terkunci)</option>
              </select>
              {editingPC.status === 'Aktif' && (
                <div className="form-hint" style={{ color: '#D97706' }}>
                  Unit sedang aktif digunakan oleh siswa ({editingPC.penggunaAktif?.nama}). Status akan kembali normal setelah sesi selesai.
                </div>
              )}
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL TAMBAH WORKSTATION PC BARU */}
      {isAddPCModalOpen && (
        <Modal
          isOpen={isAddPCModalOpen}
          onClose={() => setIsAddPCModalOpen(false)}
          title="Tambah Unit Workstation PC Studio Baru"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddPCModalOpen(false)}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddPCSubmit}>
                Simpan & Daftarkan PC
              </button>
            </>
          }
        >
          <form onSubmit={handleAddPCSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Kode Unit PC *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPCId}
                  onChange={(e) => setNewPCId(e.target.value)}
                  placeholder="PC-07"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Tampilan Unit *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPCNama}
                  onChange={(e) => setNewPCNama(e.target.value)}
                  placeholder="PC-07 (Color Grading Suite)"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Spesifikasi Hardware & Software *</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={newPCSpesifikasi}
                onChange={(e) => setNewPCSpesifikasi(e.target.value)}
                placeholder="Tuliskan prosesor, kapasitas RAM, kartu grafis, monitor, software terpasang..."
                required
              ></textarea>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL PANDUAN AUTO-STARTUP PC WINDOWS */}
      {isStartupGuideOpen && (
        <Modal
          isOpen={isStartupGuideOpen}
          onClose={() => setIsStartupGuideOpen(false)}
          title="Panduan Setup Auto-Startup Kiosk PC Studio (Windows)"
          footer={
            <button type="button" className="btn btn-primary" onClick={() => setIsStartupGuideOpen(false)}>
              Tutup Panduan
            </button>
          }
        >
          <div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: 0, marginBottom: '1rem', lineHeight: '1.5' }}>
              Panduan ini membantu Anda mengatur komputer studio agar <strong>secara otomatis membuka sistem manajemen PC Kiosk dalam mode layar penuh (fullscreen) saat komputer pertama kali dinyalakan</strong> oleh siswa/anggota.
            </p>

            {/* Pilih Unit PC Target */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E3A8A', display: 'block', marginBottom: '0.2rem' }}>
                  Pilih Unit PC Studio yang Sedang Dikonfigurasi:
                </label>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Setiap PC memiliki ID unik yang akan terkunci otomatis di layarnya.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  className="form-select"
                  value={guideActivePC}
                  onChange={(e) => setGuideActivePC(e.target.value)}
                  style={{ width: 'auto', fontWeight: 800, color: '#1E3A8A' }}
                >
                  {pcClients.map((pc) => (
                    <option key={pc.id} value={pc.id}>{pc.id} - {pc.namaUnit || 'Workstation'}</option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCopyKioskUrl(guideActivePC)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  {copiedPCId === guideActivePC ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copiedPCId === guideActivePC ? 'URL Tersalin!' : 'Salin URL'}</span>
                </button>
              </div>
            </div>

            {/* Navigasi Tab Metode */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveGuideTab('bat')}
                style={{
                  background: activeGuideTab === 'bat' ? '#1E3A8A' : 'transparent',
                  color: activeGuideTab === 'bat' ? '#FFFFFF' : '#64748B',
                  border: 'none',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Terminal size={15} />
                <span>Metode 1: File Script .bat (Paling Cepat & Mudah)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGuideTab('shortcut')}
                style={{
                  background: activeGuideTab === 'shortcut' ? '#1E3A8A' : 'transparent',
                  color: activeGuideTab === 'shortcut' ? '#FFFFFF' : '#64748B',
                  border: 'none',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <FileCode size={15} />
                <span>Metode 2: Shortcut Chrome / Edge Kiosk</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGuideTab('assigned')}
                style={{
                  background: activeGuideTab === 'assigned' ? '#1E3A8A' : 'transparent',
                  color: activeGuideTab === 'assigned' ? '#FFFFFF' : '#64748B',
                  border: 'none',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Lock size={15} />
                <span>Metode 3: Kiosk Resmi Windows (Terkunci Penuh)</span>
              </button>
            </div>

            {/* KONTEN TAB 1: SCRIPT .BAT */}
            {activeGuideTab === 'bat' && (
              <div>
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ color: '#1E3A8A', fontSize: '0.9rem' }}>
                        Unduh Script Startup Otomatis untuk {guideActivePC}:
                      </strong>
                      <p style={{ fontSize: '0.785rem', color: '#3B82F6', margin: '0.2rem 0 0 0' }}>
                        File script ini sudah diprogram untuk mendeteksi Chrome atau Edge dan langsung membukanya dalam mode Kiosk Fullscreen tanpa address bar.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDownloadStartupScript(guideActivePC)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Download size={15} />
                      <span>Unduh Startup_{guideActivePC}.bat</span>
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: '1.6' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#0F172A', fontSize: '0.875rem' }}>
                    Langkah Pemasangan di PC Studio (Hanya 1 Menit):
                  </strong>
                  <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      Unduh file script <strong>Startup_{guideActivePC}.bat</strong> di atas dan simpan di PC studio yang bersangkutan.
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      Pada keyboard PC tersebut, tekan kombinasi tombol <strong>Windows + R</strong> untuk membuka dialog <em>Run</em>.
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      Ketik <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#1E3A8A', fontWeight: 700 }}>shell:startup</code> lalu tekan <strong>Enter</strong>. Jendela folder Startup Windows akan terbuka.
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      Pindahkan (Cut / Copy) file <strong>Startup_{guideActivePC}.bat</strong> ke dalam folder Startup tersebut.
                    </li>
                    <li>
                      <strong>Selesai!</strong> Restart PC atau nyalakan ulang. Saat Windows selesai booting, layar manajemen PC Creative Corner akan otomatis muncul di seluruh layar tanpa perlu membuka browser secara manual.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* KONTEN TAB 2: SHORTCUT BROWSER */}
            {activeGuideTab === 'shortcut' && (
              <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 0.75rem 0' }}>
                  Jika Anda lebih memilih membuat shortcut browser secara manual tanpa file .bat:
                </p>

                <ol style={{ paddingLeft: '1.25rem', margin: '0 0 1rem 0' }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Tekan <strong>Windows + R</strong>, ketik <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>shell:startup</code>, tekan Enter.
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Klik kanan di area kosong folder tersebut &gt; <strong>New</strong> &gt; <strong>Shortcut</strong>.
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Di kolom <em>"Type the location of the item"</em>, salin dan tempel salah satu baris perintah berikut:
                    
                    <div style={{ marginTop: '0.5rem', background: '#0F172A', color: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', overflowX: 'auto' }}>
                      <div style={{ color: '#94A3B8', marginBottom: '0.25rem' }}># Opsi A: Google Chrome (Rekomendasi)</div>
                      "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --incognito "https://web-creative-corner.vercel.app/?mode=kiosk&pc={guideActivePC}"
                    </div>

                    <div style={{ marginTop: '0.5rem', background: '#0F172A', color: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', overflowX: 'auto' }}>
                      <div style={{ color: '#94A3B8', marginBottom: '0.25rem' }}># Opsi B: Microsoft Edge (Bawaan Windows)</div>
                      msedge.exe --kiosk "https://web-creative-corner.vercel.app/?mode=kiosk&pc={guideActivePC}" --edge-kiosk-type=fullscreen
                    </div>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Klik <strong>Next</strong>, beri nama shortcut <strong>Kiosk Creative Corner {guideActivePC}</strong>, lalu klik <strong>Finish</strong>.
                  </li>
                </ol>
              </div>
            )}

            {/* KONTEN TAB 3: WINDOWS ASSIGNED ACCESS */}
            {activeGuideTab === 'assigned' && (
              <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: '1.6' }}>
                <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#92400E' }}>
                  <strong>Tingkat Proteksi Maksimal:</strong> Metode ini mengunci sistem Windows sepenuhnya. Siswa tidak akan dapat mengakses desktop, File Explorer, atau aplikasi lain kecuali administrator keluar.
                </div>

                <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Buka <strong>Windows Settings</strong> (tekan <strong>Win + I</strong>).
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Pilih <strong>Accounts</strong> &gt; <strong>Other users</strong> (atau <em>Family & other users</em>).
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Cari bagian <strong>Set up a kiosk</strong> &gt; klik <strong>Get started</strong>.
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Beri nama akun kiosk (misal: <em>CreativeCornerKiosk</em>).
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Pilih aplikasi <strong>Microsoft Edge</strong> &gt; pilih opsi <strong>As a digital sign or interactive display</strong> (Fullscreen).
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    Masukkan tautan URL: <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#1E3A8A' }}>https://web-creative-corner.vercel.app/?mode=kiosk&pc={guideActivePC}</code>
                  </li>
                  <li>
                    Atur waktu idle refresh, lalu simpan. Setiap kali PC dinyalakan, Windows otomatis login langsung ke Kiosk Creative Corner.
                  </li>
                </ol>
              </div>
            )}

            {/* TIPS PENTING UNTUK ADMIN STUDIO */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              background: '#F1F5F9',
              borderRadius: '8px',
              borderLeft: '4px solid #1E3A8A',
              fontSize: '0.8rem',
              color: '#334155'
            }}>
              <strong style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <HelpCircle size={15} color="#1E3A8A" />
                <span>Tips Penting untuk Administrator Studio:</span>
              </strong>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: '1.5' }}>
                <li>
                  <strong>Cara Keluar dari Mode Kiosk:</strong> Tekan <strong>Alt + F4</strong> atau tombol <strong>F11</strong> di keyboard untuk menutup atau meminimalkan browser jika administrator perlu mengakses desktop.
                </li>
                <li>
                  <strong>Login Otomatis Tanpa Password Windows:</strong> Jika ingin PC langsung masuk ke desktop tanpa meminta ketik PIN/Password Windows saat dinyalakan, tekan <strong>Win + R</strong>, ketik <strong>netplwiz</strong>, lalu hilangkan centang pada <em>"Users must enter a user name and password to use this computer"</em>.
                </li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

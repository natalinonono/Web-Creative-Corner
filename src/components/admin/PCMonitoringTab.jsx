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
  Settings
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
                    {isMaintenance ? '⚠️ Unit Sedang Dalam Perawatan / Perbaikan' : '🔒 Workstation Terkunci di Layar Kiosk'}
                  </div>
                )}

                {/* Kontrol & Aksi Admin */}
                <div style={{ display: 'flex', gap: '0.45rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
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
    </div>
  );
};

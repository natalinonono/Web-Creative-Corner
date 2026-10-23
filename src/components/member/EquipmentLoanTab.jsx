import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Camera, 
  Layers, 
  CheckCircle, 
  Lock, 
  Clock, 
  RotateCcw, 
  ClipboardCheck, 
  ShieldAlert,
  Search,
  Plus
} from 'lucide-react';
import { PickupInspectionModal } from './PickupInspectionModal';
import { ReturnInspectionModal } from './ReturnInspectionModal';

export const EquipmentLoanTab = () => {
  const { equipment, borrowings, activeMemberId, members } = useStudio();
  const currentMember = members.find((m) => m.id === activeMemberId) || members[0];

  const [activeKategori, setActiveKategori] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [prefilledEqIds, setPrefilledEqIds] = useState([]);
  const [selectedBorrowingForReturn, setSelectedBorrowingForReturn] = useState(null);

  // Filter peralatan
  const filteredEquipment = equipment.filter((item) => {
    const matchCategory = activeKategori === 'Semua' || item.kategori === activeKategori;
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.spesifikasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Peminjaman aktif yang relevan
  const myActiveBorrowings = borrowings.filter(
    (b) => b.status === 'Dipinjam' && (b.anggotaId === activeMemberId || b.peminjamNama === currentMember.nama)
  );

  const myHistoryBorrowings = borrowings.filter(
    (b) => b.status === 'Selesai' && (b.anggotaId === activeMemberId || b.peminjamNama === currentMember.nama)
  );

  const handleOpenPickupForTool = (toolId) => {
    setPrefilledEqIds([toolId]);
    setPickupModalOpen(true);
  };

  return (
    <div>
      {/* 1. SEKSI PEMINJAMAN AKTIF & TOMBOL PENGEMBALIAN */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={22} color="#1E3A8A" />
              <span>Peminjaman Aktif Saya ({currentMember.nama})</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Alat yang saat ini sedang Anda bawa untuk liputan. Harap kembalikan tepat waktu dan lakukan verifikasi akhir.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setPrefilledEqIds([]);
              setPickupModalOpen(true);
            }}
            id="btn-open-general-pickup"
          >
            <Plus size={16} />
            <span>Formulir Inspeksi Pengambilan Baru</span>
          </button>
        </div>

        {myActiveBorrowings.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC' }}>
            <ClipboardCheck size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600, color: '#334155' }}>Tidak Ada Alat yang Sedang Anda Pinjam</div>
            <p style={{ fontSize: '0.825rem', color: '#64748B' }}>
              Pilihlah unit kamera, lensa, atau ruang studio dari katalog di bawah untuk melakukan reservasi & inspeksi pengambilan.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
            {myActiveBorrowings.map((b) => (
              <div key={b.id} className="card" style={{ borderLeft: '4px solid #D97706', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
                    {b.id}
                  </span>
                  <StatusBadge status={b.status} />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {b.peralatanNama}
                </h3>

                <div style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1rem' }}>
                  <div><strong>Keperluan:</strong> {b.keperluan}</div>
                  <div><strong>Waktu Pinjam:</strong> {b.tanggalPinjam} pukul {b.jamPinjam} WIB</div>
                  <div style={{ color: '#E11D48', fontWeight: 700, marginTop: '2px' }}>
                    <strong>Batas Pengembalian:</strong> Pukul {b.batasWaktuKembali} WIB
                  </div>
                </div>

                {/* Ringkasan Inspeksi Pengambilan Awal */}
                {b.inspeksiPengambilan && (
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    fontSize: '0.785rem'
                  }}>
                    <div style={{ fontWeight: 700, color: '#1E3A8A', marginBottom: '0.25rem' }}>
                      Catatan Inspeksi Awal (Saat Diambil):
                    </div>
                    <div>• Fisik: {b.inspeksiPengambilan.kondisiFisik}</div>
                    <div>• Optik Lensa: {b.inspeksiPengambilan.kebersihanLensa}</div>
                    <div>• Baterai Awal: ⚡ {b.inspeksiPengambilan.bateraiPersen}%</div>
                  </div>
                )}

                {/* Tombol Aksi Pengembalian -> Memicu Trigger 4 */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ background: '#10B981', borderColor: '#059669' }}
                    onClick={() => setSelectedBorrowingForReturn(b)}
                    id={`btn-return-${b.id}`}
                  >
                    <RotateCcw size={16} />
                    <span>Formulir Inspeksi Pengembalian</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. KATALOG & RESERVASI MANDIRI (PENONAKTIFAN ALAT TERKUNCI EVENT) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Camera size={20} color="#1E3A8A" />
              <span>Katalog Aset & Reservasi Studio Mandiri</span>
            </h3>
            <div className="card-subtitle">
              Pilih spesifikasi unit kamera, ragam lensa, aksesori, atau ruang studio. Unit yang terkunci event sekolah otomatis tidak dapat dipilih.
            </div>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Cari alat atau lensa..."
              style={{ paddingLeft: '2.2rem', fontSize: '0.825rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tab Filter Kategori */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
          {['Semua', 'Kamera', 'Lensa', 'Aksesori', 'Ruang Studio'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${activeKategori === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveKategori(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Katalog Alat atau Empty State */}
        {filteredEquipment.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B' }}>
            <Camera size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600, color: '#334155' }}>Katalog Inventaris Masih Kosong</div>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Belum ada kamera, lensa, aksesori, atau ruang studio terdaftar. Administrator dapat menambahkan unit melalui Portal Pengelola.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {filteredEquipment.map((tool) => {
            const isLockedByEvent = tool.status === 'Terkunci Event';
            const isBorrowed = tool.status === 'Dipinjam';
            const isAvailable = tool.status === 'Tersedia';

            return (
              <div 
                key={tool.id} 
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: isLockedByEvent ? 0.85 : 1,
                  background: isLockedByEvent ? '#FFF1F2' : '#FFFFFF',
                  borderColor: isLockedByEvent ? '#FECDD3' : '#E2E8F0'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
                      {tool.kode}
                    </span>
                    <StatusBadge status={tool.status} />
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                    {tool.nama}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', minHeight: '38px' }}>
                    {tool.spesifikasi}
                  </p>

                  <div style={{ fontSize: '0.785rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1rem' }}>
                    <div>📍 <strong>Lokasi:</strong> {tool.lokasiRak}</div>
                    <div>🔧 <strong>Kondisi:</strong> {tool.kondisiFisik}</div>
                    {tool.baterai !== null && (
                      <div>⚡ <strong>Baterai:</strong> {tool.baterai}%</div>
                    )}
                  </div>
                </div>

                {/* Tombol Reservasi / Ambil Alat */}
                <div>
                  {isAvailable ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => handleOpenPickupForTool(tool.id)}
                      id={`btn-borrow-${tool.id}`}
                    >
                      <ClipboardCheck size={15} />
                      <span>Inspeksi & Ambil Unit</span>
                    </button>
                  ) : isLockedByEvent ? (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ width: '100%', cursor: 'not-allowed' }}
                      disabled
                      title="Unit ini otomatis dikunci untuk agenda liputan resmi sekolah"
                    >
                      <Lock size={15} />
                      <span>Terkunci Event Sekolah</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', cursor: 'not-allowed', color: '#D97706', borderColor: '#FDE68A' }}
                      disabled
                    >
                      <Clock size={15} />
                      <span>Sedang Dipinjam ({tool.peminjamAktif || 'Anggota'})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* 3. RIWAYAT PEMINJAMAN SELESAI */}
      {myHistoryBorrowings.length > 0 && (
        <div className="card" style={{ marginTop: '2.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">
              <CheckCircle size={20} color="#059669" />
              <span>Riwayat Pengembalian & Penugasan Selesai</span>
            </h3>
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No. Dokumen</th>
                  <th>Alat / Ruang</th>
                  <th>Tanggal</th>
                  <th>Kondisi Akhir</th>
                  <th>Status Tugas</th>
                </tr>
              </thead>
              <tbody>
                {myHistoryBorrowings.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{h.id}</td>
                    <td><strong>{h.peralatanNama}</strong></td>
                    <td>{h.tanggalPinjam}</td>
                    <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {h.inspeksiPengembalian?.kondisiFisikAkhir || 'Kembali normal'}
                    </td>
                    <td>
                      <StatusBadge status="Sudah Melaksanakan Tugas" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Cek Fisik Pengambilan */}
      {pickupModalOpen && (
        <PickupInspectionModal
          isOpen={pickupModalOpen}
          onClose={() => {
            setPickupModalOpen(false);
            setPrefilledEqIds([]);
          }}
          prefilledEquipmentIds={prefilledEqIds}
        />
      )}

      {/* Modal Verifikasi Pengembalian */}
      {selectedBorrowingForReturn && (
        <ReturnInspectionModal
          isOpen={Boolean(selectedBorrowingForReturn)}
          onClose={() => setSelectedBorrowingForReturn(null)}
          targetBorrowing={selectedBorrowingForReturn}
        />
      )}
    </div>
  );
};

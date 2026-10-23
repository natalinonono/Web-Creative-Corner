import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStudio } from '../../context/StudioContext';
import { RotateCcw, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReturnInspectionModal = ({ isOpen, onClose, targetBorrowing }) => {
  const { submitReturnInspection } = useStudio();

  if (!targetBorrowing) return null;

  // Form Fields
  const [kondisiFisikAkhir, setKondisiFisikAkhir] = useState('Bodi mulus, tidak ada goresan atau benturan selama kegiatan');
  const [fungsiTombol, setFungsiTombol] = useState('Semua tombol dan dial berfungsi dengan baik 100%');
  const [kebersihanLensa, setKebersihanLensa] = useState('Optik bersih, tidak ada bercak minyak atau sidik jari');
  const [sisaBateraiPersen, setSisaBateraiPersen] = useState(45);
  const [kelengkapanAksesori, setKelengkapanAksesori] = useState('Semua aksesori, cap, kabel, strap, dan tas lengkap');
  const [kebersihanRuang, setKebersihanRuang] = useState('Ruang telah dirapikan, sampah dibuang, lampu & AC studio dimatikan');
  const [catatanKendala, setCatatanKendala] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    submitReturnInspection({
      borrowingId: targetBorrowing.id,
      returnInspectionData: {
        kondisiFisikAkhir,
        fungsiTombol,
        kebersihanLensa,
        sisaBateraiPersen: Number(sisaBateraiPersen),
        kelengkapanAksesori,
        kebersihanRuang,
        catatanKendala: catatanKendala.trim() || 'Tidak ada kendala. Alat dan ruang dikembalikan dalam kondisi normal.',
        petugasPemeriksa: `${targetBorrowing.peminjamNama} (Inspeksi Pengembalian Mandiri)`
      }
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      title="Formulir Inspeksi Pengembalian (Verifikasi Akhir & Penutupan Tugas)"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSubmit}
            id="btn-submit-return"
          >
            <CheckCircle size={16} />
            <span>Kirim Inspeksi & Kembalikan Alat</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <ShieldCheck size={22} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#065F46' }}>
              Alur Otomatis Creative Corner (State-Machine Trigger 4)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#047857', marginTop: '2px' }}>
              Menyerahkan formulir ini akan <strong>otomatis mengembalikan kuota alat menjadi "Tersedia"</strong>, mencatat perbandingan inspeksi awal vs akhir untuk verifikasi Admin, dan mengubah status penugasan Anda menjadi <strong>"Sudah Melaksanakan Tugas" (Selesai)</strong>.
            </p>
          </div>
        </div>

        {/* Informasi Peminjaman yang Sedang Dikembalikan */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div>
              <span style={{ color: '#64748B' }}>Peminjam:</span>
              <div style={{ fontWeight: 700, color: '#0F172A' }}>{targetBorrowing.peminjamNama} ({targetBorrowing.peminjamKelas})</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Unit Alat / Ruangan:</span>
              <div style={{ fontWeight: 700, color: '#1E3A8A' }}>{targetBorrowing.peralatanNama}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Batas Jam Kembali:</span>
              <div style={{ fontWeight: 700, color: '#E11D48' }}>{targetBorrowing.batasWaktuKembali} WIB</div>
            </div>
          </div>
        </div>

        {/* Form Verifikasi Kondisi Akhir */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">1. Kondisi Fisik Akhir Alat *</label>
            <input
              type="text"
              className="form-input"
              value={kondisiFisikAkhir}
              onChange={(e) => setKondisiFisikAkhir(e.target.value)}
              placeholder="Contoh: Bodi mulus, tidak ada retak/lecet"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">2. Fungsi Tombol & Mekanikal Akhir *</label>
            <input
              type="text"
              className="form-input"
              value={fungsiTombol}
              onChange={(e) => setFungsiTombol(e.target.value)}
              placeholder="Contoh: Semua tombol dan layar normal 100%"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">3. Kebersihan Lensa & Optik Akhir *</label>
            <input
              type="text"
              className="form-input"
              value={kebersihanLensa}
              onChange={(e) => setKebersihanLensa(e.target.value)}
              placeholder="Contoh: Optik bersih bening"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">4. Sisa Daya Baterai Saat Ini (%) *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={sisaBateraiPersen}
                onChange={(e) => setSisaBateraiPersen(e.target.value)}
                style={{ flex: 1, accentColor: '#10B981' }}
              />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.9rem',
                minWidth: '45px',
                textAlign: 'right',
                color: sisaBateraiPersen <= 20 ? '#E11D48' : '#059669'
              }}>
                {sisaBateraiPersen}%
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">5. Kelengkapan Aksesori & Kabel *</label>
            <input
              type="text"
              className="form-input"
              value={kelengkapanAksesori}
              onChange={(e) => setKelengkapanAksesori(e.target.value)}
              placeholder="Contoh: Lengkap cap depan/belakang, tali, tas"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">6. Kebersihan Ruangan Studio *</label>
            <input
              type="text"
              className="form-input"
              value={kebersihanRuang}
              onChange={(e) => setKebersihanRuang(e.target.value)}
              placeholder="Contoh: Bersih dan rapi kembali / N/A"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Catatan Kendala / Penurunan Kondisi (Opsional / Jika Ada Temuan)
          </label>
          <textarea
            className="form-textarea"
            rows="3"
            value={catatanKendala}
            onChange={(e) => setCatatanKendala(e.target.value)}
            placeholder="Tuliskan jika ada kendala baterai habis, lensa terkena debu tebal, atau kelengkapan yang perlu diperiksa oleh Admin..."
          ></textarea>
          <div className="form-hint">
            Catatan ini akan otomatis muncul pada panel validasi perbandingan inspeksi berdampingan di Portal Pengelola.
          </div>
        </div>
      </form>
    </Modal>
  );
};

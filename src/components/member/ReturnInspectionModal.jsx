import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStudio } from '../../context/StudioContext';
import { RotateCcw, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReturnInspectionModal = ({ isOpen, onClose, targetBorrowing }) => {
  const { submitReturnInspection } = useStudio();

  if (!targetBorrowing) return null;

  // Form Fields (Hanya: Kondisi Fisik dan Keterangan Alat)
  const [kondisiFisikAkhir, setKondisiFisikAkhir] = useState('Baik, normal tanpa kendala');
  const [keteranganAlat, setKeteranganAlat] = useState('Lengkap dan aman');

  const handleSubmit = (e) => {
    e.preventDefault();

    submitReturnInspection({
      borrowingId: targetBorrowing.id,
      returnInspectionData: {
        kondisiFisikAkhir,
        keteranganAlat,
        fungsiTombol: 'Normal',
        kebersihanLensa: 'Bersih',
        sisaBateraiPersen: 100,
        kelengkapanAksesori: keteranganAlat,
        kebersihanRuang: 'Bersih',
        catatanKendala: keteranganAlat || 'Tidak ada kendala. Alat dikembalikan dalam kondisi normal.',
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Kondisi Fisik Alat Saat Kembali *</label>
            <input
              type="text"
              className="form-input"
              value={kondisiFisikAkhir}
              onChange={(e) => setKondisiFisikAkhir(e.target.value)}
              placeholder="Contoh: Baik, mulus, tidak ada kerusakan"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Keterangan Alat / Catatan Pengembalian *</label>
            <input
              type="text"
              className="form-input"
              value={keteranganAlat}
              onChange={(e) => setKeteranganAlat(e.target.value)}
              placeholder="Contoh: Lengkap cap/strap/tas, tidak ada kendala"
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

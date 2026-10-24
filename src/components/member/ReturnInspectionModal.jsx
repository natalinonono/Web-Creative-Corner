import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStudio } from '../../context/StudioContext';
import { 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  Camera, 
  Upload, 
  Trash2, 
  Eye 
} from 'lucide-react';

export const ReturnInspectionModal = ({ isOpen, onClose, targetBorrowing }) => {
  const { submitReturnInspection } = useStudio();

  if (!targetBorrowing) return null;

  // Form Fields (Hanya: Kondisi Fisik dan Keterangan Alat)
  const [kondisiFisikAkhir, setKondisiFisikAkhir] = useState('Baik, normal tanpa kendala');
  const [keteranganAlat, setKeteranganAlat] = useState('Lengkap dan aman');

  // Foto Kondisi Fisik Alat Saat Dikembalikan (AFTER)
  const [fotoAfterFile, setFotoAfterFile] = useState(null);
  const [previewZoomModal, setPreviewZoomModal] = useState(null);

  // Ambil referensi Foto BEFORE dari peminjaman jika tersedia
  const fotoBeforeRef = targetBorrowing.fotoBefore || targetBorrowing.inspeksiPengambilan?.fotoBefore || targetBorrowing.buktiSurat;

  // Upload & Kamera HP Handler
  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Ukuran foto maksimal 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFotoAfterFile({
        name: file.name || `foto-after-${Date.now()}.jpg`,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'image/jpeg',
        isImage: true,
        dataUrl: event.target.result,
        uploadedAt: new Date().toLocaleString('id-ID')
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fotoAfterFile) {
      if (!window.confirm('PERHATIAN: Anda belum melampirkan foto fisik alat saat dikembalikan (AFTER). Apakah Anda yakin ingin menyelesaikan pengembalian tanpa bukti foto fisik akhir?')) {
        return;
      }
    }

    submitReturnInspection({
      borrowingId: targetBorrowing.id,
      fotoAfter: fotoAfterFile,
      returnInspectionData: {
        kondisiFisikAkhir,
        keteranganAlat,
        fungsiTombol: 'Normal',
        kebersihanLensa: 'Bersih',
        sisaBateraiPersen: 100,
        kelengkapanAksesori: keteranganAlat,
        kebersihanRuang: 'Bersih',
        catatanKendala: keteranganAlat || 'Tidak ada kendala. Alat dikembalikan dalam kondisi normal.',
        petugasPemeriksa: `${targetBorrowing.peminjamNama} (Inspeksi Pengembalian Mandiri)`,
        fotoAfter: fotoAfterFile
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
              Menyerahkan formulir ini akan <strong>otomatis mengembalikan kuota alat menjadi "Tersedia"</strong>, mencatat perbandingan inspeksi awal (BEFORE) vs akhir (AFTER) untuk verifikasi Admin, dan mengubah status penugasan Anda menjadi <strong>"Sudah Melaksanakan Tugas" (Selesai)</strong>.
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

        {/* Referensi Foto BEFORE (Saat Diambil) jika tersedia */}
        {fotoBeforeRef && (
          <div style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#0F172A',
                  cursor: 'pointer',
                  border: '1px solid #0284C7'
                }}
                onClick={() => setPreviewZoomModal(fotoBeforeRef.dataUrl || fotoBeforeRef)}
                title="Klik untuk memperbesar foto awal (BEFORE)"
              >
                <img
                  src={fotoBeforeRef.dataUrl || fotoBeforeRef}
                  alt="Foto Before Ref"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.675rem', fontWeight: 800, background: '#0284C7', color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Foto Referensi BEFORE
                </span>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369A1', marginTop: '2px' }}>
                  Kondisi fisik unit saat diambil awal
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
              onClick={() => setPreviewZoomModal(fotoBeforeRef.dataUrl || fotoBeforeRef)}
            >
              <Eye size={13} />
              <span>Lihat Foto Awal</span>
            </button>
          </div>
        )}

        {/* DOKUMENTASI FOTO FISIK ALAT SAAT DIKEMBALIKAN (AFTER) */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Camera size={18} color="#059669" />
              <span>Foto Fisik Alat / Gear Saat Dikembalikan (AFTER) *</span>
            </label>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0' }}>
              KAMERA HP / GALERI
            </span>
          </div>

          <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0 0 0.65rem 0' }}>
            Ambil foto kondisi fisik unit alat/gear saat dikembalikan ke studio sebagai bukti rekaman akhir (AFTER).
          </p>

          {!fotoAfterFile ? (
            <div style={{
              border: '2px dashed #A7F3D0',
              borderRadius: '10px',
              padding: '1.25rem 1rem',
              textAlign: 'center',
              background: '#F0FDF4'
            }}>
              <Camera size={30} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065F46', marginBottom: '0.2rem' }}>
                Ambil Foto Kondisi Alat Saat Pengembalian (AFTER)
              </div>
              <p style={{ fontSize: '0.75rem', color: '#047857', marginBottom: '0.85rem' }}>
                Bisa langsung jepret dengan Kamera HP atau pilih foto dari galeri perangkat Anda.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                {/* 1. Tombol Buka Kamera HP Langsung */}
                <label
                  className="btn btn-primary btn-sm"
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: '#059669',
                    borderColor: '#047857'
                  }}
                  id="btn-return-camera"
                >
                  <Camera size={15} />
                  <span>Buka Kamera HP</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* 2. Tombol Pilih dari Galeri */}
                <label
                  className="btn btn-secondary btn-sm"
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                  id="btn-return-gallery"
                >
                  <Upload size={14} />
                  <span>Pilih dari Galeri Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoCapture}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#0F172A',
                    flexShrink: 0,
                    border: '1.5px solid #059669',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPreviewZoomModal(fotoAfterFile.dataUrl)}
                  title="Klik untuk melihat foto lebih besar"
                >
                  <img
                    src={fotoAfterFile.dataUrl}
                    alt="Foto Fisik Alat (After)"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#059669', color: '#FFFFFF', padding: '1px 7px', borderRadius: '4px', fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    <CheckCircle size={11} />
                    <span>Foto AFTER (Kondisi Pengembalian)</span>
                  </div>
                  <strong style={{ fontSize: '0.825rem', color: '#065F46', display: 'block' }}>
                    {fotoAfterFile.name}
                  </strong>
                  <div style={{ fontSize: '0.725rem', color: '#059669' }}>
                    {fotoAfterFile.size} • Siap Diverifikasi Admin
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPreviewZoomModal(fotoAfterFile.dataUrl)}
                  style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
                >
                  <Eye size={13} />
                  <span>Lihat Foto</span>
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setFotoAfterFile(null)}
                  style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
                >
                  <Trash2 size={13} />
                  <span>Foto Ulang</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Modal Pratinjau Zoom Foto */}
      {previewZoomModal && (
        <Modal
          isOpen={Boolean(previewZoomModal)}
          onClose={() => setPreviewZoomModal(null)}
          title="Pratinjau Foto Kondisi Fisik Alat"
          footer={
            <button type="button" className="btn btn-secondary" onClick={() => setPreviewZoomModal(null)}>
              Tutup
            </button>
          }
        >
          <div style={{ textAlign: 'center', background: '#0F172A', borderRadius: '8px', padding: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
            <img
              src={previewZoomModal}
              alt="Foto Fisik Alat"
              style={{ maxWidth: '100%', maxHeight: '460px', objectFit: 'contain', borderRadius: '4px' }}
            />
          </div>
        </Modal>
      )}
    </Modal>
  );
};

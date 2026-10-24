import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStudio } from '../../context/StudioContext';
import { FORMAT_SURAT_PEMINJAMAN_TEXT } from '../../data/seedData';
import { downloadLoanLetterDocx, downloadLoanLetterPdf } from '../../utils/documentGenerator';
import { 
  ClipboardCheck, 
  Camera, 
  CheckCircle2, 
  ShieldAlert, 
  Upload, 
  Download, 
  FileText, 
  FileCheck, 
  Eye, 
  Trash2 
} from 'lucide-react';

export const PickupInspectionModal = ({ isOpen, onClose, targetEvent, prefilledEquipmentIds = [] }) => {
  const { equipment, activeMemberId, members, submitPickupInspection } = useStudio();

  const currentMember = members.find((m) => m.id === activeMemberId) || members[0];

  // Equipment selection
  const [selectedEqIds, setSelectedEqIds] = useState(
    prefilledEquipmentIds.length > 0
      ? prefilledEquipmentIds
      : targetEvent?.peralatanTerkunciIds?.length > 0
      ? targetEvent.peralatanTerkunciIds
      : []
  );

  // Form Fields (Hanya: Kondisi Fisik dan Keterangan Alat)
  const [kondisiFisik, setKondisiFisik] = useState('Baik, mulus tanpa lecet');
  const [keteranganAlat, setKeteranganAlat] = useState('Lengkap dan normal siap pakai');
  const [batasWaktuKembali, setBatasWaktuKembali] = useState(targetEvent?.waktuSelesai || '16:00');

  // Bukti Surat Peminjaman (Foto / Dokumen)
  const [buktiSuratFile, setBuktiSuratFile] = useState(null);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);

  // Unduh Dokumen Format Surat Peminjaman (.DOCX & .PDF)
  const handleDownloadDocx = () => {
    downloadLoanLetterDocx({
      namaPeminjam: currentMember?.nama,
      kelas: currentMember?.kelas || currentMember?.divisi,
      kontak: currentMember?.kontak || '0812-3456-7890',
      keperluan: targetEvent ? `Liputan Event: ${targetEvent.judul}` : 'Peminjaman Alat Studio Creative Corner',
      tanggalPinjam: targetEvent?.tanggal || new Date().toISOString().split('T')[0],
      targetKembali: `${batasWaktuKembali || '16:00'} WIB`,
      daftarAlat: equipment
        .filter((eq) => selectedEqIds.includes(eq.id))
        .map((eq, i) => ({
          no: i + 1,
          nama: eq.nama,
          kode: eq.id,
          jumlah: '1 Unit',
          kondisi: eq.kondisiFisik || 'Baik'
        }))
    });
  };

  const handleDownloadPdf = () => {
    downloadLoanLetterPdf({
      namaPeminjam: currentMember?.nama,
      kelas: currentMember?.kelas || currentMember?.divisi,
      kontak: currentMember?.kontak || '0812-3456-7890',
      keperluan: targetEvent ? `Liputan Event: ${targetEvent.judul}` : 'Peminjaman Alat Studio Creative Corner',
      tanggalPinjam: targetEvent?.tanggal || new Date().toISOString().split('T')[0],
      targetKembali: `${batasWaktuKembali || '16:00'} WIB`,
      daftarAlat: equipment
        .filter((eq) => selectedEqIds.includes(eq.id))
        .map((eq, i) => ({
          no: i + 1,
          nama: eq.nama,
          kode: eq.id,
          jumlah: '1 Unit',
          kondisi: eq.kondisiFisik || 'Baik'
        }))
    });
  };

  const handleDownloadFormatSurat = handleDownloadDocx;

  // Upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setBuktiSuratFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'document',
        isImage: file.type.startsWith('image/'),
        dataUrl: event.target.result,
        uploadedAt: new Date().toLocaleString('id-ID')
      });
    };
    reader.readAsDataURL(file);
  };

  const handleToggleEq = (id) => {
    setSelectedEqIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedEqIds.length === 0) {
      alert('Pilihlah minimal satu alat/ruangan yang diambil untuk inspeksi.');
      return;
    }

    if (!buktiSuratFile && !targetEvent) {
      alert('Wajib melampirkan foto lembar surat peminjaman atau berkas dokumen perizinan resmi! Jika Anda belum memiliki format suratnya, silakan klik tombol "Unduh Format Resmi (.TXT)" yang telah disediakan.');
      return;
    }

    submitPickupInspection({
      eventId: targetEvent?.id || null,
      anggotaId: currentMember.id,
      peminjamNama: currentMember.nama,
      peminjamKelas: currentMember.kelas,
      peminjamWa: currentMember.nomorWa,
      peralatanIds: selectedEqIds,
      keperluan: targetEvent ? `Liputan: ${targetEvent.judul}` : 'Peminjaman Mandiri',
      batasWaktuKembali,
      buktiSurat: buktiSuratFile,
      inspeksiData: {
        kondisiFisik,
        keteranganAlat,
        fungsiTombol: 'Normal',
        kebersihanLensa: 'Bersih',
        bateraiPersen: 100,
        kelengkapanAksesori: keteranganAlat,
        kebersihanRuang: 'Bersih',
        petugasPemeriksa: `${currentMember.nama} (Inspeksi Mandiri Siswa)`
      }
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      title="Formulir Inspeksi Pengambilan (Cek Fisik & Pemicu Tugas)"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSubmit}
            id="btn-submit-pickup"
          >
            <CheckCircle2 size={16} />
            <span>Kirim Inspeksi & Ambil Alat</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Dokumen Format Surat Peminjaman Resmi (.DOCX & .PDF) */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #BFDBFE',
          borderRadius: '10px',
          padding: '1rem 1.15rem',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 8px rgba(30, 58, 138, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                background: '#EFF6FF',
                color: '#1E3A8A',
                padding: '0.6rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
                flexShrink: 0
              }}>
                <FileText size={22} color="#1E3A8A" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.925rem', color: '#0F172A' }}>
                    Dokumen Format Surat Peminjaman Resmi Studio
                  </span>
                  <span className="badge badge-blue" style={{ fontSize: '0.685rem' }}>CC-FORM-01/RESMI</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.25rem 0 0 0', lineHeight: '1.4' }}>
                  Unduh format resmi draf permohonan dalam bentuk <strong>Word (.docx)</strong> atau <strong>PDF (.pdf)</strong> untuk dicetak, ditandatangani, dan diunggah kembali sebagai berkas sah peminjaman.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleDownloadDocx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderColor: '#3B82F6',
                  color: '#1E3A8A',
                  background: '#F0F9FF',
                  fontWeight: 700,
                  fontSize: '0.785rem'
                }}
              >
                <Download size={14} color="#2563EB" />
                <span>Unduh .DOCX (Word)</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleDownloadPdf}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 700,
                  fontSize: '0.785rem'
                }}
              >
                <Download size={14} />
                <span>Unduh .PDF</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsFormatModalOpen(true)}
                title="Pratinjau draf surat"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.785rem' }}
              >
                <Eye size={14} />
                <span>Pratinjau</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informasi Peminjam & Event */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label className="form-label">Nama Siswa / Anggota</label>
            <input 
              type="text" 
              className="form-input" 
              value={`${currentMember.nama} (${currentMember.kelas})`} 
              disabled 
              style={{ background: '#F8FAFC' }}
            />
          </div>
          <div>
            <label className="form-label">Terkait Agenda / Event</label>
            <input 
              type="text" 
              className="form-input" 
              value={targetEvent ? targetEvent.judul : 'Peminjaman Mandiri Creative Corner'} 
              disabled 
              style={{ background: '#F8FAFC' }}
            />
          </div>
        </div>

        {/* Pemilihan Alat yang Diambil */}
        <div className="form-group">
          <label className="form-label">Pilih Unit Peralatan / Ruang yang Diperiksa & Diambil *</label>
          {equipment.length === 0 ? (
            <div style={{ padding: '1rem', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', fontSize: '0.825rem', color: '#64748B' }}>
              Belum ada inventaris alat/ruang yang terdaftar. Administrator dapat menambahkan unit terlebih dahulu di Portal Pengelola.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.65rem',
              maxHeight: '170px',
              overflowY: 'auto',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.75rem',
              background: '#FAFAFA'
            }}>
              {equipment.map((item) => {
                const isSelected = selectedEqIds.includes(item.id);
                return (
                  <label 
                    key={item.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isSelected ? '1px solid #3B82F6' : '1px solid #E2E8F0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.825rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleEq(item.id)}
                      style={{ accentColor: '#1E3A8A' }}
                    />
                    <div>
                      <strong style={{ color: '#0F172A' }}>{item.nama}</strong>
                      <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{item.kategori} • {item.lokasiRak}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Cek Fisik dan Keterangan Alat */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Kondisi Fisik Alat *</label>
            <input
              type="text"
              className="form-input"
              value={kondisiFisik}
              onChange={(e) => setKondisiFisik(e.target.value)}
              placeholder="Contoh: Baik, mulus tanpa lecet, normal"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Keterangan Alat *</label>
            <input
              type="text"
              className="form-input"
              value={keteranganAlat}
              onChange={(e) => setKeteranganAlat(e.target.value)}
              placeholder="Contoh: Lengkap cap/strap/tas, fungsi siap pakai"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Target Batas Waktu Pengembalian (WIB) *</label>
          <input
            type="time"
            className="form-input"
            value={batasWaktuKembali}
            onChange={(e) => setBatasWaktuKembali(e.target.value)}
            required
            style={{ maxWidth: '220px' }}
          />
        </div>

        {/* WAJIB: BUKTI SURAT PEMINJAMAN RESMI (FOTO / DOKUMEN) */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileCheck size={18} color="#1E3A8A" />
              <span>Bukti Surat Peminjaman / Penugasan Resmi (Foto / Dokumen) {!targetEvent && '*'}</span>
            </label>
            <span className="badge badge-rose" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              {targetEvent ? 'OPSIONAL (SUDAH ADA EVENT)' : 'WAJIB DILAMPIRKAN'}
            </span>
          </div>

          {/* Banner Pengunduhan Format */}
          <div style={{
            background: '#EFF6FF',
            border: '1.5px dashed #3B82F6',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <FileText size={20} color="#1E3A8A" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E3A8A' }}>
                  Belum punya format surat permohonan peminjaman?
                </div>
                <div style={{ fontSize: '0.725rem', color: '#334155' }}>
                  Unduh draf resmi Creative Corner dalam format <strong>Word (.docx)</strong> atau <strong>PDF (.pdf)</strong> untuk dicetak dan ditandatangani.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleDownloadDocx}
                style={{ fontSize: '0.725rem', borderColor: '#3B82F6', color: '#1E3A8A', background: '#FFFFFF' }}
              >
                <Download size={13} color="#2563EB" />
                <span>Unduh .DOCX</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleDownloadPdf}
                style={{ fontSize: '0.725rem' }}
              >
                <Download size={13} />
                <span>Unduh .PDF</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsFormatModalOpen(true)}
                style={{ fontSize: '0.725rem' }}
              >
                <Eye size={13} />
                <span>Lihat Format</span>
              </button>
            </div>
          </div>

          {/* Upload Input */}
          {!buktiSuratFile ? (
            <div style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
              background: '#FAFAFA'
            }}>
              <Upload size={24} color="#64748B" style={{ margin: '0 auto 0.4rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                Unggah Foto Lembar Surat atau File Dokumen
              </div>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                <Upload size={13} />
                <span>Pilih Foto / Dokumen</span>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : (
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <div>
                  <strong style={{ fontSize: '0.8rem', color: '#166534' }}>{buktiSuratFile.name}</strong>
                  <div style={{ fontSize: '0.7rem', color: '#15803D' }}>{buktiSuratFile.size} • Siap Dilampirkan</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setBuktiSuratFile(null)}
                style={{ fontSize: '0.725rem' }}
              >
                <Trash2 size={12} />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Modal Format Surat */}
      {isFormatModalOpen && (
        <Modal
          isOpen={isFormatModalOpen}
          onClose={() => setIsFormatModalOpen(false)}
          size="large"
          title="Format Resmi Surat Perizinan Peminjaman Alat"
          footer={
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={handleDownloadDocx}>
                <Download size={14} color="#2563EB" />
                <span>Unduh Format .DOCX (Word)</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={handleDownloadPdf}>
                <Download size={14} />
                <span>Unduh Format .PDF</span>
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsFormatModalOpen(false)}>
                Tutup
              </button>
            </div>
          }
        >
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '8px',
            padding: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.825rem',
            lineHeight: '1.6',
            color: '#0F172A',
            whiteSpace: 'pre-wrap',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {FORMAT_SURAT_PEMINJAMAN_TEXT}
          </div>
        </Modal>
      )}
    </Modal>
  );
};

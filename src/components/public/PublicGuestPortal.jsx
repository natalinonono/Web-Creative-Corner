import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { FORMAT_SURAT_PEMINJAMAN_TEXT } from '../../data/seedData';
import { downloadLoanLetterDocx, downloadLoanLetterPdf } from '../../utils/documentGenerator';
import { 
  Camera, 
  Clock, 
  CheckCircle, 
  Search, 
  Send, 
  Monitor, 
  User, 
  HelpCircle, 
  ExternalLink, 
  FileText, 
  CheckSquare, 
  AlertCircle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Download,
  Upload,
  Image,
  Eye,
  Trash2,
  Paperclip,
  FileCheck
} from 'lucide-react';

export const PublicGuestPortal = ({ onOpenLoginModal }) => {
  const { equipment, borrowings, submitPublicLoan, setCurrentRole } = useStudio();

  // Active Tab di Portal Publik ('form' | 'katalog' | 'status')
  const [activeTab, setActiveTab] = useState('form');

  // Form State Peminjaman Mandiri (Tanpa Login Email)
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [kelasInstansi, setKelasInstansi] = useState('');
  const [nomorWa, setNomorWa] = useState('');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);
  const [keperluan, setKeperluan] = useState('');
  const [batasKembali, setBatasKembali] = useState('16:00');
  const [catatan, setCatatan] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Bukti Surat Peminjaman (Foto / Dokumen) & Unduh Format
  const [buktiSuratFile, setBuktiSuratFile] = useState(null);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [previewBuktiModal, setPreviewBuktiModal] = useState(null);

  // Status Pencarian Resi Tiket
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedLoan, setSubmittedLoan] = useState(null);

  // Unduh Format Surat Peminjaman Resmi Creative Corner (.DOCX & .PDF)
  const handleDownloadDocx = () => {
    downloadLoanLetterDocx({
      namaPeminjam: namaPeminjam || '[NAMA PEMINJAM]',
      kelas: kelasInstansi || '[KELAS / INSTANSI / ORGANISASI]',
      kontak: kontakHp || '[NOMOR WHATSAPP]',
      keperluan: keperluan || 'Peminjaman Alat Studio Creative Corner',
      tanggalPinjam: tanggalMulai || new Date().toISOString().split('T')[0],
      targetKembali: `${tanggalSelesai || new Date().toISOString().split('T')[0]} (17:00 WIB)`,
      daftarAlat: equipment
        .filter((eq) => selectedEquipmentIds.includes(eq.id))
        .map((eq, i) => ({
          no: i + 1,
          nama: eq.nama,
          kode: eq.id,
          jumlah: '1 Unit',
          kondisi: eq.kondisiFisik || 'Baik & Normal'
        }))
    });
  };

  const handleDownloadPdf = () => {
    downloadLoanLetterPdf({
      namaPeminjam: namaPeminjam || '[NAMA PEMINJAM]',
      kelas: kelasInstansi || '[KELAS / INSTANSI / ORGANISASI]',
      kontak: kontakHp || '[NOMOR WHATSAPP]',
      keperluan: keperluan || 'Peminjaman Alat Studio Creative Corner',
      tanggalPinjam: tanggalMulai || new Date().toISOString().split('T')[0],
      targetKembali: `${tanggalSelesai || new Date().toISOString().split('T')[0]} (17:00 WIB)`,
      daftarAlat: equipment
        .filter((eq) => selectedEquipmentIds.includes(eq.id))
        .map((eq, i) => ({
          no: i + 1,
          nama: eq.nama,
          kode: eq.id,
          jumlah: '1 Unit',
          kondisi: eq.kondisiFisik || 'Baik & Normal'
        }))
    });
  };

  const handleDownloadFormatSurat = handleDownloadDocx;

  // Handler Upload File Foto atau Dokumen
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

  // Toggle pilihan alat yang dipinjam
  const handleToggleEquipment = (id) => {
    setSelectedEquipmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit Peminjaman Tamu (Tanpa Email)
  const handleSubmitLoan = (e) => {
    e.preventDefault();
    if (!namaPeminjam.trim() || !kelasInstansi.trim() || !nomorWa.trim()) {
      alert('Nama peminjam, kelas/unit, dan nomor WhatsApp wajib diisi.');
      return;
    }

    if (selectedEquipmentIds.length === 0) {
      alert('Silakan pilih minimal 1 unit peralatan atau ruangan yang ingin dipinjam.');
      return;
    }

    if (!buktiSuratFile) {
      alert('Wajib melampirkan foto lembar surat peminjaman atau berkas dokumen perizinan resmi! Jika Anda belum memiliki format suratnya, silakan klik tombol "Unduh Format Resmi (.TXT)" yang telah disediakan pada formulir.');
      return;
    }

    if (!isAgreed) {
      alert('Anda wajib menyetujui ketentuan pemeliharaan dan pengembalian studio.');
      return;
    }

    const newLoan = submitPublicLoan({
      peminjamNama: namaPeminjam.trim(),
      peminjamKelas: kelasInstansi.trim(),
      peminjamWa: nomorWa.replace(/[^0-9]/g, ''),
      peralatanIds: selectedEquipmentIds,
      keperluan: keperluan.trim() || 'Peminjaman Tugas Siswa/Guru Non-Anggota',
      batasWaktuKembali: batasKembali,
      catatan: catatan.trim(),
      buktiSurat: buktiSuratFile
    });

    if (newLoan) {
      setSubmittedLoan(newLoan);
      // Reset Form
      setNamaPeminjam('');
      setKelasInstansi('');
      setNomorWa('');
      setSelectedEquipmentIds([]);
      setKeperluan('');
      setCatatan('');
      setBuktiSuratFile(null);
      setIsAgreed(false);
    }
  };

  // Filter daftar peminjaman publik
  const filteredBorrowings = borrowings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.peminjamNama && b.peminjamNama.toLowerCase().includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.peralatanNama && b.peralatanNama.toLowerCase().includes(q))
    );
  });

  const availableEquipment = equipment.filter((eq) => eq.status === 'Tersedia');

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* 1. HERO BANNER KHUSUS VERSI PUBLIK / TANPA LOGIN */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        color: '#FFFFFF',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <span>🌐 Versi Terbuka — Tanpa Login Email</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.025em', marginBottom: '0.75rem', lineHeight: '1.2' }}>
            Layanan Peminjaman Studio Creative Corner
          </h1>

          <p style={{ fontSize: '0.975rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Dikhususkan bagi <strong>Siswa, Guru, OSIS, dan Warga Sekolah (Bukan Anggota Creative Corner)</strong> yang membutuhkan kamera, lighting, mikrofon, atau reservasi ruang studio untuk keperluan tugas sekolah maupun kegiatan resmi. <strong>Bisa langsung meminjam tanpa perlu membuat akun email!</strong>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: '#2563EB', borderColor: '#3B82F6', padding: '0.65rem 1.25rem' }}
              onClick={() => setActiveTab('form')}
            >
              <CheckSquare size={18} />
              <span>Formulir Pinjam Langsung</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)', color: '#FFFFFF' }}
              onClick={() => setCurrentRole('kiosk')}
            >
              <Monitor size={18} />
              <span>Gunakan PC Kiosk Studio</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ background: 'transparent', borderColor: 'rgba(255, 255, 255, 0.3)', color: '#FFFFFF' }}
              onClick={onOpenLoginModal}
            >
              <User size={18} />
              <span>Masuk sebagai Anggota / Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGASI TAB VERSI PUBLIK */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E2E8F0', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FileText size={16} />
          <span>Formulir Peminjaman Mandiri (Tanpa Email)</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'katalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('katalog')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Camera size={16} />
          <span>Katalog Ketersediaan Studio Real-Time</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Search size={16} />
          <span>Lacak Resi / Status Peminjaman Tamu</span>
        </button>
      </div>

      {/* MODAL / KARTU BUKTI TIKET PEMINJAMAN BERHASIL */}
      {submittedLoan && (
        <div style={{
          background: '#F0FDF4',
          border: '2px solid #86EFAC',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle size={32} color="#16A34A" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                  Peminjaman Mandiri Berhasil Diajukan!
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#15803D' }}>
                  Nomor Tiket Anda: <strong>{submittedLoan.id}</strong> • Peminjam: <strong>{submittedLoan.peminjamNama}</strong> ({submittedLoan.peminjamKelas})
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSubmittedLoan(null)}
              style={{ fontSize: '0.75rem' }}
            >
              Tutup Pengumuman
            </button>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #DCFCE7', borderRadius: '8px', padding: '1rem', fontSize: '0.85rem', color: '#334155', marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div><strong>Alat / Ruang:</strong> {submittedLoan.peralatanNama}</div>
              <div><strong>Tanggal Pinjam:</strong> {submittedLoan.tanggalPinjam} (Pukul {submittedLoan.jamPinjam})</div>
              <div><strong>Batas Waktu Pengembalian:</strong> Pukul {submittedLoan.batasWaktuKembali} WIB</div>
              <div><strong>Bukti Surat:</strong> <span style={{ color: '#15803D', fontWeight: 700 }}>✓ {submittedLoan.buktiSurat?.name || 'Terlampir'}</span></div>
              <div><strong>Status:</strong> <span className="badge badge-amber">Aktif Dipinjam</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/6281200000000?text=${encodeURIComponent(
                `Halo Pengelola Creative Corner, saya *${submittedLoan.peminjamNama}* (${submittedLoan.peminjamKelas}) telah mengajukan peminjaman mandiri dengan Kode Tiket: *${submittedLoan.id}* untuk alat: *${submittedLoan.peralatanNama}*. Batas kembali: *${submittedLoan.batasWaktuKembali} WIB*. Mohon verifikasi pengambilan di studio. Terima kasih!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ textDecoration: 'none' }}
            >
              <Send size={15} />
              <span>Konfirmasi ke Admin via WhatsApp</span>
            </a>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(submittedLoan.id);
                alert(`Nomor tiket ${submittedLoan.id} berhasil disalin ke clipboard!`);
              }}
            >
              <span>Salin Nomor Tiket</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. KONTEN TAB: 1. FORMULIR PEMINJAMAN MANDIRI */}
      {activeTab === 'form' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '2rem' }}>
          {/* Kolom Kiri: Formulir */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <CheckSquare size={20} color="#1E3A8A" />
                  <span>Formulir Pengajuan Peminjaman Mandiri</span>
                </h2>
                <div className="card-subtitle">
                  Isi data identitas diri Anda di bawah ini secara lengkap tanpa perlu akun email.
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitLoan}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap Peminjam *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={namaPeminjam}
                    onChange={(e) => setNamaPeminjam(e.target.value)}
                    placeholder="Contoh: Muhammad Rizky / Ibu Siti Rahmawati"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kelas / Unit / Ekskul *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={kelasInstansi}
                    onChange={(e) => setKelasInstansi(e.target.value)}
                    placeholder="Contoh: XI MIPA 2 / OSIS / Guru Bahasa"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Nomor WhatsApp Aktif *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={nomorWa}
                    onChange={(e) => setNomorWa(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    required
                  />
                  <div className="form-hint">Digunakan untuk konfirmasi jadwal pengembalian alat.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Batas Jam Kembali (WIB) *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={batasKembali}
                    onChange={(e) => setBatasKembali(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Pemilihan Peralatan / Ruangan */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Pilih Peralatan / Ruang Studio yang Ingin Dipinjam *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#1E3A8A', fontWeight: 700 }}>
                    {selectedEquipmentIds.length} Unit Dipilih
                  </span>
                </div>

                {equipment.length === 0 ? (
                  <div style={{ padding: '1.5rem', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                    <Camera size={24} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                    <div>Belum ada data unit inventaris yang diinput oleh Administrator.</div>
                    <div style={{ fontSize: '0.75rem' }}>Silakan hubungi pengelola Creative Corner di studio.</div>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '0.65rem',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    background: '#FAFAFA'
                  }}>
                    {equipment.map((item) => {
                      const isAvailable = item.status === 'Tersedia';
                      const isSelected = selectedEquipmentIds.includes(item.id);

                      return (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.6rem',
                            padding: '0.5rem 0.65rem',
                            background: !isAvailable ? '#F1F5F9' : isSelected ? '#EFF6FF' : '#FFFFFF',
                            border: isSelected ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            borderRadius: '6px',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            opacity: isAvailable ? 1 : 0.65,
                            fontSize: '0.825rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!isAvailable}
                            onChange={() => handleToggleEquipment(item.id)}
                            style={{ marginTop: '3px', accentColor: '#1E3A8A' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: '#0F172A', lineHeight: '1.3' }}>
                              {item.nama}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: '#64748B' }}>
                              {item.kategori} • {item.lokasiRak}
                            </div>
                            <div style={{ marginTop: '0.25rem' }}>
                              <StatusBadge status={item.status} />
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Keperluan Peminjaman *</label>
                <input
                  type="text"
                  className="form-input"
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Contoh: Pembuatan Video Pembelajaran Biologi, Dokumentasi Classmeeting"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Tambahan / Kebutuhan Aksesori (Opsional)</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Membutuhkan baterai cadangan dan tripod video..."
                ></textarea>
              </div>

              {/* WAJIB: BUKTI SURAT PEMINJAMAN (FOTO / DOKUMEN) */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCheck size={18} color="#1E3A8A" />
                    <span>Bukti Surat Peminjaman Resmi (Foto / Dokumen) *</span>
                  </label>
                  <span className="badge badge-rose" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    WAJIB DILAMPIRKAN
                  </span>
                </div>

                {/* Banner Arahkan Pengunduhan Format jika Belum Memiliki Surat */}
                <div style={{
                  background: '#EFF6FF',
                  border: '1.5px dashed #3B82F6',
                  borderRadius: '10px',
                  padding: '0.9rem 1.15rem',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={22} color="#1E3A8A" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#1E3A8A' }}>
                        Belum memiliki format surat peminjaman resmi?
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#334155', marginTop: '2px' }}>
                        Unduh format resmi Creative Corner dalam bentuk <strong>Word (.docx)</strong> atau <strong>PDF (.pdf)</strong> untuk dicetak dan ditandatangani.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleDownloadDocx}
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', borderColor: '#3B82F6', color: '#1E3A8A', background: '#FFFFFF', fontWeight: 700 }}
                      id="btn-download-loan-format-docx"
                    >
                      <Download size={14} color="#2563EB" />
                      <span>Unduh .DOCX (Word)</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleDownloadPdf}
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', fontWeight: 700 }}
                      id="btn-download-loan-format-pdf"
                    >
                      <Download size={14} />
                      <span>Unduh .PDF</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsFormatModalOpen(true)}
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                    >
                      <Eye size={14} />
                      <span>Lihat Format</span>
                    </button>
                  </div>
                </div>

                {/* Upload Box Foto / Dokumen */}
                {!buktiSuratFile ? (
                  <div style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: '#FAFAFA',
                    cursor: 'pointer'
                  }}>
                    <Upload size={28} color="#64748B" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.25rem' }}>
                      Unggah Foto Lembar Surat atau File Dokumen Bukti Izin
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.75rem' }}>
                      Mendukung format Foto Kamera (JPG, PNG, WebP) atau Dokumen (PDF, Word, TXT) maks. 10MB
                    </p>
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={14} />
                      <span>Pilih Foto / Dokumen</span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="file-input-loan-proof"
                      />
                    </label>
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
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {buktiSuratFile.isImage ? (
                        <img
                          src={buktiSuratFile.dataUrl}
                          alt="Bukti Surat"
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #86EFAC' }}
                        />
                      ) : (
                        <div style={{ width: '48px', height: '48px', background: '#DCFCE7', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={24} color="#16A34A" />
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle size={15} color="#16A34A" />
                          <span>{buktiSuratFile.name}</span>
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#15803D' }}>
                          Ukuran: {buktiSuratFile.size} • Diunggah: {buktiSuratFile.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setPreviewBuktiModal(buktiSuratFile)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <Eye size={13} />
                        <span>Pratinjau Bukti</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setBuktiSuratFile(null)}
                        style={{ fontSize: '0.75rem' }}
                        title="Hapus dan pilih file lain"
                      >
                        <Trash2 size={13} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pernyataan Tanggung Jawab */}
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#92400E', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    style={{ marginTop: '2px', accentColor: '#D97706' }}
                    required
                  />
                  <span>
                    <strong>Pernyataan Tanggung Jawab Studio:</strong> Saya bersedia menjaga keutuhan, kebersihan, dan kelengkapan alat yang dipinjam, serta mengembalikannya tepat waktu sebelum batas jam kembali berakhir.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
              >
                <Send size={16} />
                <span>Kirim Permohonan Peminjaman (Tanpa Perlu Email)</span>
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Panduan & Informasi Studio */}
          <div>
            {/* Kartu Panduan */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: '1rem' }}>
                  <HelpCircle size={18} color="#1E3A8A" />
                  <span>Alur Peminjaman Bukan Anggota</span>
                </h3>
              </div>
              <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.825rem', color: '#475569', lineHeight: '1.7' }}>
                <li>Pilih unit kamera, lensa, atau ruangan yang berstatus <strong>"Tersedia"</strong>.</li>
                <li>Isi identitas diri, kelas/instansi, dan nomor WhatsApp.</li>
                <li>Tekan tombol kirim untuk memperoleh <strong>Kode Resi Tiket Digital</strong>.</li>
                <li>Datang ke Studio Creative Corner untuk mengambil alat dan melakukan cek fisik bersama petugas piket.</li>
                <li>Kembalikan alat tepat waktu sebelum studio tutup.</li>
              </ol>
            </div>

            {/* Kartu Komputer Kiosk */}
            <div className="card" style={{ marginBottom: '1.5rem', background: '#F8FAFC' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: '1rem' }}>
                  <Monitor size={18} color="#10B981" />
                  <span>Pakai PC Workstation Studio</span>
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', marginBottom: '1rem' }}>
                Butuh mengedit video tugas sekolah, membuat presentasi, atau rendering karya? Gunakan 6 unit PC Workstation studio langsung tanpa akun email.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setCurrentRole('kiosk')}
              >
                <Monitor size={15} />
                <span>Buka Layar Kiosk PC Sekarang</span>
              </button>
            </div>

            {/* Ajakan Masuk Anggota */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 800, color: '#1E3A8A', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                Apakah Anda Anggota Creative Corner?
              </div>
              <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                Bagi anggota tim dan pengurus studio, silakan masuk dengan akun email untuk mengakses Papan Tugas Kreatif, Kalender Liputan, dan Roster Piket.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={onOpenLoginModal}
              >
                <User size={14} />
                <span>Masuk Akun Anggota / Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. KONTEN TAB: 2. KATALOG KETERSEDIAAN STUDIO */}
      {activeTab === 'katalog' && (
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <Camera size={20} color="#1E3A8A" />
                  <span>Katalog Unit Peralatan & Ruangan Studio</span>
                </h2>
                <div className="card-subtitle">
                  Pantau unit yang sedang berstatus Tersedia, Dipinjam, atau Terkunci Agenda Liputan.
                </div>
              </div>
              <span className="badge badge-emerald">
                {availableEquipment.length} Unit Siap Pakai
              </span>
            </div>

            {equipment.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                <Camera size={42} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#334155' }}>
                  Belum Ada Unit Peralatan / Ruang
                </div>
                <p style={{ fontSize: '0.85rem' }}>
                  Administrator studio belum menambahkan daftar aset inventaris.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', padding: '1.5rem' }}>
                {equipment.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      background: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1E3A8A', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>
                          {item.kode}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>

                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                        {item.nama}
                      </h4>
                      <div style={{ fontSize: '0.775rem', color: '#64748B', marginBottom: '0.75rem' }}>
                        {item.kategori} • Lokasi: {item.lokasiRak}
                      </div>

                      <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', marginBottom: '1rem' }}>
                        {item.spesifikasi}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Baterai: <strong>{item.baterai ? `${item.baterai}%` : '-'}</strong>
                      </span>
                      {item.status === 'Tersedia' ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedEquipmentIds([item.id]);
                            setActiveTab('form');
                          }}
                        >
                          Pinjam Ini
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.725rem', color: '#EF4444', fontWeight: 600 }}>
                          Sedang Tidak Tersedia
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. KONTEN TAB: 3. LACAK STATUS PEMINJAMAN TAMU */}
      {activeTab === 'status' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <Search size={20} color="#1E3A8A" />
                <span>Lacak Status & Riwayat Peminjaman Tamu</span>
              </h2>
              <div className="card-subtitle">
                Ketik nama Anda atau nomor tiket untuk memeriksa status pengembalian alat.
              </div>
            </div>

            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari nama Anda / kode tiket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem' }}
              />
            </div>
          </div>

          {filteredBorrowings.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
              <Search size={36} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Tidak Ditemukan Riwayat Peminjaman</div>
              <p style={{ fontSize: '0.825rem' }}>Belum ada permohonan peminjaman yang cocok dengan pencarian Anda.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Tiket</th>
                    <th>Nama Peminjam</th>
                    <th>Kelas / Unit</th>
                    <th>Alat Dipinjam</th>
                    <th>Waktu Pinjam</th>
                    <th>Batas Pengembalian</th>
                    <th>Bukti Surat</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBorrowings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E3A8A' }}>
                        {b.id}
                      </td>
                      <td style={{ fontWeight: 700 }}>{b.peminjamNama}</td>
                      <td>{b.peminjamKelas}</td>
                      <td style={{ maxWidth: '240px' }}>{b.peralatanNama}</td>
                      <td>{b.tanggalPinjam} • {b.jamPinjam} WIB</td>
                      <td style={{ color: '#D97706', fontWeight: 600 }}>{b.batasWaktuKembali} WIB</td>
                      <td>
                        {b.buktiSurat ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setPreviewBuktiModal(b.buktiSurat)}
                            style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Eye size={12} />
                            <span>Lihat Surat</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.725rem', color: '#94A3B8' }}>-</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: FORMAT RESMI SURAT PEMINJAMAN ALAT */}
      {isFormatModalOpen && (
        <Modal
          isOpen={isFormatModalOpen}
          onClose={() => setIsFormatModalOpen(false)}
          size="large"
          title="Format Resmi Surat Perizinan Peminjaman Alat"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={handleDownloadDocx}>
                <Download size={14} color="#2563EB" />
                <span>Unduh .DOCX (Word)</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={handleDownloadPdf}>
                <Download size={14} />
                <span>Unduh .PDF</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(FORMAT_SURAT_PEMINJAMAN_TEXT);
                  alert('Teks format surat berhasil disalin ke clipboard!');
                }}
              >
                <span>Salin Teks</span>
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsFormatModalOpen(false)}>
                Tutup
              </button>
            </>
          }
        >
          <div>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.825rem', color: '#1E3A8A' }}>
              💡 <strong>Petunjuk:</strong> Unduh atau salin format surat ini, lengkapi data permohonan peminjaman alat, mintakan tanda tangan penanggung jawab / guru pembina, lalu foto / pindai berkas tersebut untuk diunggah pada formulir peminjaman di atas.
            </div>

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
          </div>
        </Modal>
      )}

      {/* MODAL 2: PRATINJAU BUKTI SURAT PEMINJAMAN (FOTO / DOKUMEN) */}
      {previewBuktiModal && (
        <Modal
          isOpen={Boolean(previewBuktiModal)}
          onClose={() => setPreviewBuktiModal(null)}
          size="large"
          title={`Bukti Surat: ${previewBuktiModal.name || 'Dokumen Surat'}`}
          footer={
            <button type="button" className="btn btn-secondary" onClick={() => setPreviewBuktiModal(null)}>
              Tutup
            </button>
          }
        >
          <div style={{ textAlign: 'center' }}>
            {previewBuktiModal.isImage ? (
              <div style={{ maxHeight: '520px', overflowY: 'auto', background: '#0F172A', borderRadius: '8px', padding: '1rem' }}>
                <img
                  src={previewBuktiModal.dataUrl}
                  alt="Bukti Surat Peminjaman"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                />
              </div>
            ) : (
              <div style={{ padding: '2.5rem 1.5rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <FileText size={48} color="#1E3A8A" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                  {previewBuktiModal.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
                  Tipe File: {previewBuktiModal.type} • Ukuran: {previewBuktiModal.size}
                </p>
                {previewBuktiModal.dataUrl && (
                  <a
                    href={previewBuktiModal.dataUrl}
                    download={previewBuktiModal.name}
                    className="btn btn-primary btn-sm"
                  >
                    <Download size={14} />
                    <span>Unduh Dokumen Bukti</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
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
  FileText, 
  CheckSquare, 
  AlertCircle,
  Download,
  Upload,
  Eye,
  Trash2,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  Phone,
  Layers,
  ArrowRight,
  X,
  BatteryCharging,
  HardDrive
} from 'lucide-react';
import { getCameraRequirements, isEquipmentCompatible } from '../../utils/cameraCompatibility';

export const PublicGuestPortal = () => {
  const { 
    equipment, 
    borrowings, 
    submitPublicLoan, 
    setCurrentRole, 
    publicTab, 
    setPublicTab 
  } = useStudio();

  // Form State Peminjaman Mandiri (Tanpa Login Email)
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [kelasInstansi, setKelasInstansi] = useState('');
  const [nomorWa, setNomorWa] = useState('');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);
  const [keperluan, setKeperluan] = useState('');
  const [tanggalPinjam, setTanggalPinjam] = useState(() => new Date().toISOString().split('T')[0]);
  const [batasKembali, setBatasKembali] = useState('16:00');
  const [catatan, setCatatan] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Bukti Surat Peminjaman
  const [buktiSuratFile, setBuktiSuratFile] = useState(null);
  const [previewBuktiModal, setPreviewBuktiModal] = useState(null);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);

  // Search & Filter Alat
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Status Pencarian Resi Tiket
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedLoan, setSubmittedLoan] = useState(null);

  // Handler Download Format Dokumen Resmi Word & PDF
  const handleDownloadDocx = () => {
    downloadLoanLetterDocx({
      namaPeminjam: namaPeminjam || '[NAMA LENGKAP PEMINJAM]',
      kelas: kelasInstansi || '[KELAS / INSTANSI / ORGANISASI]',
      kontak: nomorWa || '[NOMOR WHATSAPP]',
      keperluan: keperluan || 'Peminjaman Alat Studio Creative Corner',
      tanggalPinjam: tanggalPinjam || new Date().toISOString().split('T')[0],
      targetKembali: `${batasKembali} WIB`,
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
      namaPeminjam: namaPeminjam || '[NAMA LENGKAP PEMINJAM]',
      kelas: kelasInstansi || '[KELAS / INSTANSI / ORGANISASI]',
      kontak: nomorWa || '[NOMOR WHATSAPP]',
      keperluan: keperluan || 'Peminjaman Alat Studio Creative Corner',
      tanggalPinjam: tanggalPinjam || new Date().toISOString().split('T')[0],
      targetKembali: `${batasKembali} WIB`,
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

  // Upload File Foto atau Dokumen
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

  // Toggle pilihan alat
  const handleToggleEquipment = (id) => {
    setSelectedEquipmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit Peminjaman
  const handleSubmitLoan = (e) => {
    e.preventDefault();
    if (!namaPeminjam.trim() || !kelasInstansi.trim() || !nomorWa.trim()) {
      alert('Nama peminjam, kelas/instansi, dan nomor WhatsApp wajib diisi.');
      return;
    }

    if (selectedEquipmentIds.length === 0) {
      alert('Silakan pilih minimal 1 unit peralatan atau ruangan yang ingin dipinjam.');
      return;
    }

    if (!buktiSuratFile) {
      alert('Wajib melampirkan foto lembar surat peminjaman atau berkas dokumen resmi! Jika belum memiliki format suratnya, silakan klik tombol "Unduh Format .DOCX / .PDF" yang telah disediakan.');
      return;
    }

    if (!isAgreed) {
      alert('Anda wajib menyetujui pernyataan tanggung jawab pemeliharaan studio.');
      return;
    }

    const newLoan = submitPublicLoan({
      peminjamNama: namaPeminjam.trim(),
      peminjamKelas: kelasInstansi.trim(),
      peminjamWa: nomorWa.replace(/[^0-9]/g, ''),
      peralatanIds: selectedEquipmentIds,
      keperluan: keperluan.trim() || 'Peminjaman Tugas Siswa / Kegiatan Sekolah',
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Deteksi Kamera yang dipilih saat peminjaman untuk kompatibilitas otomatis
  const selectedCamera = equipment.find(
    (eq) => selectedEquipmentIds.includes(eq.id) && (
      (eq.kategori || '').toLowerCase().includes('kamera') || 
      (eq.nama || '').toLowerCase().includes('canon') ||
      (eq.nama || '').toLowerCase().includes('eos')
    )
  );
  const cameraReq = selectedCamera ? getCameraRequirements(selectedCamera) : null;

  // Filter kategori unik (Termasuk Baterai & Memory Card)
  const categories = ['Semua', 'Kamera', 'Lensa', 'Baterai', 'Memory Card', 'Audio & Mic', 'Lighting & Rig', 'Ruangan'];

  const filteredEquipment = equipment.filter((eq) => {
    // 1. FILTER KOMPATIBILITAS OTOMATIS: Jika kamera terpilih, sembunyikan lensa dan baterai yang tidak kompatibel!
    if (cameraReq && !isEquipmentCompatible(eq, cameraReq)) {
      return false;
    }

    const matchesSearch = 
      eq.nama.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (eq.kategori && eq.kategori.toLowerCase().includes(catalogSearch.toLowerCase())) ||
      (eq.lokasiRak && eq.lokasiRak.toLowerCase().includes(catalogSearch.toLowerCase())) ||
      (eq.spesifikasi && eq.spesifikasi.toLowerCase().includes(catalogSearch.toLowerCase()));
    
    if (selectedCategory === 'Semua') return matchesSearch;
    if (selectedCategory === 'Kamera') {
      return matchesSearch && (eq.kategori || '').toLowerCase().includes('kamera');
    }
    if (selectedCategory === 'Lensa') {
      return matchesSearch && (eq.kategori || '').toLowerCase().includes('lensa');
    }
    if (selectedCategory === 'Baterai') {
      return matchesSearch && ((eq.kategori || '').toLowerCase().includes('baterai') || (eq.kategori || '').toLowerCase().includes('battery'));
    }
    if (selectedCategory === 'Memory Card') {
      return matchesSearch && ((eq.kategori || '').toLowerCase().includes('memory') || (eq.kategori || '').toLowerCase().includes('sd card') || (eq.nama || '').toLowerCase().includes('sd card') || (eq.nama || '').toLowerCase().includes('memory'));
    }
    if (selectedCategory === 'Audio & Mic') {
      return matchesSearch && ((eq.kategori || '').toLowerCase().includes('audio') || (eq.kategori || '').toLowerCase().includes('mic'));
    }
    if (selectedCategory === 'Lighting & Rig') {
      return matchesSearch && ((eq.kategori || '').toLowerCase().includes('light') || (eq.kategori || '').toLowerCase().includes('aksesori') || (eq.kategori || '').toLowerCase().includes('tripod'));
    }
    if (selectedCategory === 'Ruangan') {
      return matchesSearch && ((eq.kategori || '').toLowerCase().includes('ruang') || (eq.kategori || '').toLowerCase().includes('studio'));
    }
    return matchesSearch;
  });

  const availableEquipment = equipment.filter((eq) => eq.status === 'Tersedia');
  const selectedItemsDetails = equipment.filter((eq) => selectedEquipmentIds.includes(eq.id));

  // Filter pencarian resi
  const filteredBorrowings = borrowings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.peminjamNama && b.peminjamNama.toLowerCase().includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.peralatanNama && b.peralatanNama.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ paddingBottom: '3.5rem' }}>
      {/* 1. INSTITUTIONAL CLEAN HEADER (BUKAN AI-SLOP NEON BANNER) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '2rem 2.25rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#1E3A8A',
            marginBottom: '0.75rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
            <span>Layanan Publik Terbuka • Tanpa Perlu Login Akun</span>
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.025em',
            marginBottom: '0.5rem',
            lineHeight: '1.25'
          }}>
            Peminjaman Fasilitas & Peralatan Studio Creative Corner
          </h1>

          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
            Layanan peminjaman kamera, mikrofon, lighting, dan reservasi studio khusus bagi <strong>siswa, guru, pengurus OSIS, dan perwakilan kelas</strong> untuk keperluan tugas multimedia maupun kegiatan sekolah resmi.
          </p>
        </div>

        {/* Quick Info Badges */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '0.75rem 1.15rem',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Alat Siap Pakai</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669' }}>
              {availableEquipment.length}
            </div>
          </div>

          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '0.75rem 1.15rem',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Inventaris</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E3A8A' }}>
              {equipment.length}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGASI TAB */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '2px solid #E2E8F0',
        marginBottom: '1.75rem',
        flexWrap: 'wrap'
      }}>
        <button
          className={`tab-btn ${publicTab === 'form' ? 'active' : ''}`}
          onClick={() => setPublicTab('form')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          id="tab-public-form"
        >
          <FileText size={16} />
          <span>Formulir Peminjaman Mandiri</span>
        </button>

        <button
          className={`tab-btn ${publicTab === 'katalog' ? 'active' : ''}`}
          onClick={() => setPublicTab('katalog')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          id="tab-public-katalog"
        >
          <Camera size={16} />
          <span>Katalog Fasilitas & Ketersediaan</span>
        </button>

        <button
          className={`tab-btn ${publicTab === 'status' ? 'active' : ''}`}
          onClick={() => setPublicTab('status')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          id="tab-public-status"
        >
          <Search size={16} />
          <span>Status Peminjaman</span>
        </button>
      </div>

      {/* 3. NOTIFIKASI TIKET BERHASIL DIAJUKAN */}
      {submittedLoan && (
        <div style={{
          background: '#F0FDF4',
          border: '1.5px solid #86EFAC',
          borderRadius: '14px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={26} color="#16A34A" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                  Permohonan Peminjaman Berhasil Diajukan!
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#15803D', marginTop: '2px' }}>
                  Nomor Resi: <strong style={{ letterSpacing: '0.5px' }}>{submittedLoan.id}</strong> • Peminjam: <strong>{submittedLoan.peminjamNama}</strong> ({submittedLoan.peminjamKelas})
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSubmittedLoan(null)}
              style={{ fontSize: '0.75rem' }}
            >
              Tutup Notifikasi
            </button>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #DCFCE7', borderRadius: '10px', padding: '1rem', fontSize: '0.85rem', color: '#334155', marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div><strong>Alat / Ruangan:</strong> {submittedLoan.peralatanNama}</div>
              <div><strong>Jadwal Ambil:</strong> Hari Ini ({submittedLoan.jamPinjam} WIB)</div>
              <div><strong>Batas Waktu Kembali:</strong> Pukul {submittedLoan.batasWaktuKembali} WIB</div>
              <div><strong>Surat Izin:</strong> <span style={{ color: '#15803D', fontWeight: 700 }}>✓ {submittedLoan.buktiSurat?.name || 'Terlampir'}</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/6281200000000?text=${encodeURIComponent(
                `Halo Admin Creative Corner, saya *${submittedLoan.peminjamNama}* (${submittedLoan.peminjamKelas}) telah mengajukan permohonan peminjaman mandiri dengan Resi: *${submittedLoan.id}* untuk: *${submittedLoan.peralatanNama}*. Batas kembali: *${submittedLoan.batasWaktuKembali} WIB*. Mohon verifikasi pengambilan di studio. Terima kasih!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
            >
              <Send size={14} />
              <span>Konfirmasi Pengambilan via WhatsApp Petugas</span>
            </a>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(submittedLoan.id);
                alert(`Nomor resi tiket ${submittedLoan.id} berhasil disalin ke clipboard!`);
              }}
            >
              Salin Nomor Resi
            </button>
          </div>
        </div>
      )}

      {/* 4. TAB KONTEN 1: FORMULIR PEMINJAMAN */}
      {publicTab === 'form' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '1.75rem', alignItems: 'start' }}>
          {/* Kolom Kiri: Formulir */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <CheckSquare size={20} color="#1E3A8A" />
                <span>Formulir Permohonan Peminjaman</span>
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '4px', margin: 0 }}>
                Silakan isi data peminjam secara lengkap. Tidak memerlukan akun email.
              </p>
            </div>

            <form onSubmit={handleSubmitLoan}>
              {/* BAGIAN 1: IDENTITAS */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#1E3A8A', letterSpacing: '0.03em', marginBottom: '0.75rem' }}>
                  1. Identitas Peminjam
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nama Lengkap Peminjam *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={namaPeminjam}
                      onChange={(e) => setNamaPeminjam(e.target.value)}
                      placeholder="Contoh: Muhammad Rizky / Ibu Ratna"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Kelas / Unit Kerja / OSIS *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={kelasInstansi}
                      onChange={(e) => setKelasInstansi(e.target.value)}
                      placeholder="Contoh: XI MIPA 2 / Pengurus OSIS"
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={nomorWa}
                    onChange={(e) => setNomorWa(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    required
                  />
                  <div className="form-hint">Digunakan petugas piket untuk konfirmasi dan verifikasi pengembalian.</div>
                </div>
              </div>

              {/* BAGIAN 2: PILIH PERALATAN & RUANGAN */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#1E3A8A', letterSpacing: '0.03em' }}>
                    2. Pilih Peralatan / Fasilitas Studio *
                  </div>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#1E3A8A' }}>
                    {selectedEquipmentIds.length} Unit Dipilih
                  </span>
                </div>

                {/* Filter Kategori & Pencarian */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Cari alat (contoh: Sony, Mic, Tripod)..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          border: selectedCategory === cat ? '1px solid #1E3A8A' : '1px solid #CBD5E1',
                          background: selectedCategory === cat ? '#EFF6FF' : '#FFFFFF',
                          color: selectedCategory === cat ? '#1E3A8A' : '#475569',
                          fontSize: '0.75rem',
                          fontWeight: selectedCategory === cat ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner Kompatibilitas Otomatis Jika Kamera Dipilih */}
                {cameraReq && (
                  <div style={{
                    marginBottom: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    background: '#EFF6FF',
                    border: '1.5px solid #3B82F6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    color: '#1E40AF',
                    fontSize: '0.775rem'
                  }}>
                    <Sparkles size={16} color="#2563EB" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, lineHeight: 1.45 }}>
                      <div style={{ fontWeight: 800, color: '#1E3A8A' }}>
                        Filter Kompatibilitas Otomatis Aktif ({selectedCamera.nama}):
                      </div>
                      <div style={{ marginTop: '2px', color: '#1E40AF' }}>
                        {cameraReq.needsAdapter ? (
                          <>🔍 Wajib pakai <strong>Adapter EF-M to EF</strong> dan hanya bisa pakai <strong>Lensa EF (DSLR)</strong>.</>
                        ) : (
                          <>🔍 Menggunakan <strong>{cameraReq.lensLabel}</strong>.</>
                        )}
                        <span style={{ display: 'block', fontSize: '0.725rem', marginTop: '3px', color: '#B45309', fontWeight: 600 }}>
                          ⚠️ Kamera berstatus Body Only (belum termasuk baterai & lensa). Jika perlu baterai, pilih {cameraReq.batteryLabel} di kategori Baterai.
                        </span>
                      </div>
                      <div style={{ color: '#2563EB', fontSize: '0.7rem', marginTop: '2px', fontStyle: 'italic' }}>
                        * Lensa dan baterai yang tidak kompatibel dengan kamera ini otomatis disembunyikan.
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid Peralatan */}
                {equipment.length === 0 ? (
                  <div style={{ padding: '2rem', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '10px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                    <Camera size={28} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                    <div>Belum ada unit peralatan yang didaftarkan dalam inventaris.</div>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                    gap: '0.65rem',
                    maxHeight: '280px',
                    overflowY: 'auto',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    background: '#FAFAFA'
                  }}>
                    {filteredEquipment.map((item) => {
                      const isAvailable = item.status === 'Tersedia';
                      const isSelected = selectedEquipmentIds.includes(item.id);

                      // Info Kompatibilitas Item
                      const itemCat = (item.kategori || '').toLowerCase();
                      const itemReq = itemCat.includes('kamera') || item.nama.toLowerCase().includes('canon') ? getCameraRequirements(item) : null;
                      const isBattery = itemCat.includes('baterai') || item.nama.toLowerCase().includes('baterai') || item.nama.toLowerCase().includes('battery');
                      const isMemoryCard = itemCat.includes('memory') || itemCat.includes('sd card') || item.nama.toLowerCase().includes('sd card') || item.nama.toLowerCase().includes('memory');

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (isAvailable) handleToggleEquipment(item.id);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem',
                            padding: '0.65rem',
                            background: !isAvailable ? '#F1F5F9' : isSelected ? '#EFF6FF' : '#FFFFFF',
                            border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                            borderRadius: '8px',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            opacity: isAvailable ? 1 : 0.65,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!isAvailable}
                            onChange={() => {}}
                            style={{ marginTop: '3px', accentColor: '#1E3A8A' }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontWeight: 700,
                              fontSize: '0.825rem',
                              color: '#0F172A',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {item.nama}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '2px' }}>
                              {item.kategori} • {item.lokasiRak || 'Studio'}
                            </div>

                            {/* Badge Panduan Lensa Kamera (Baterai sengaja TIDAK ditampilkan agar tidak dikira sudah include baterai) */}
                            {itemReq && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                                <span style={{
                                  fontSize: '0.685rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: itemReq.needsAdapter ? '#FEF3C7' : '#EFF6FF',
                                  color: itemReq.needsAdapter ? '#92400E' : '#1E40AF',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  width: 'fit-content'
                                }}>
                                  🔍 {itemReq.needsAdapter ? 'Wajib Adapter EF-M→EF' : itemReq.lensLabel}
                                </span>
                              </div>
                            )}

                            {/* Badge Kategori Baterai */}
                            {isBattery && (
                              <div style={{ marginTop: '4px' }}>
                                <span style={{
                                  fontSize: '0.685rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: (item.nama + item.spesifikasi).toLowerCase().includes('lp-e10') ? '#FEE2E2' : '#F0FDF4',
                                  color: (item.nama + item.spesifikasi).toLowerCase().includes('lp-e10') ? '#991B1B' : '#166534',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}>
                                  🔋 {(item.nama + item.spesifikasi).toLowerCase().includes('lp-e10') ? 'Khusus 1500D (LP-E10)' : 'Baterai LP-E17'}
                                </span>
                              </div>
                            )}

                            {/* Badge Kategori Memory Card */}
                            {isMemoryCard && (
                              <div style={{ marginTop: '4px' }}>
                                <span style={{
                                  fontSize: '0.685rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: '#F0F9FF',
                                  color: '#0369A1',
                                  border: '1px solid #BAE6FD',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}>
                                  💾 Memory Card
                                </span>
                              </div>
                            )}

                            {/* Spesifikasi / Keterangan Alat jika ada */}
                            {!itemReq && !isBattery && !isMemoryCard && item.spesifikasi && (
                              <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.spesifikasi}
                              </div>
                            )}

                            <div style={{ marginTop: '0.35rem' }}>
                              <StatusBadge status={item.status} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Strip Badge Unit Terpilih */}
                {selectedItemsDetails.length > 0 && (
                  <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>Terpilih:</span>
                    {selectedItemsDetails.map((eq) => (
                      <span
                        key={eq.id}
                        style={{
                          background: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          color: '#1E3A8A',
                          borderRadius: '9999px',
                          padding: '2px 8px',
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <span>{eq.nama}</span>
                        <X 
                          size={12} 
                          style={{ cursor: 'pointer' }} 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleEquipment(eq.id);
                          }} 
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* BAGIAN 3: WAKTU & KEPERLUAN */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#1E3A8A', letterSpacing: '0.03em', marginBottom: '0.75rem' }}>
                  3. Waktu & Keperluan
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Tanggal Penggunaan *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={tanggalPinjam}
                      onChange={(e) => setTanggalPinjam(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
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

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Keperluan Peminjaman *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                    placeholder="Contoh: Pembuatan Video Tugas Bahasa Indonesia / Liputan Porseni"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Catatan Aksesori Tambahan (Opsional)</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Memerlukan 2 baterai cadangan, tripod video, dan SD card 64GB..."
                  ></textarea>
                </div>
              </div>

              {/* BAGIAN 4: BUKTI SURAT RESMI (WAJIB) */}
              <div style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#1E3A8A', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCheck size={16} color="#1E3A8A" />
                    <span>4. Surat Peminjaman Resmi (Wajib)</span>
                  </div>
                  <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                    WAJIB DILAMPIRKAN
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.5', marginBottom: '0.85rem' }}>
                  Peminjam wajib melampirkan lembar surat izin/peminjaman resmi yang telah ditandatangani oleh guru pembimbing atau penanggung jawab kegiatan.
                </p>

                {/* Box Unduh Format Resmi Dokumen */}
                <div style={{
                  background: '#EFF6FF',
                  border: '1px dashed #3B82F6',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <FileText size={22} color="#1E3A8A" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E3A8A' }}>
                        Belum memiliki format surat peminjaman?
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#475569', marginTop: '2px' }}>
                        Unduh format resmi Creative Corner, cetak, dan minta tanda tangan guru pembimbing:
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleDownloadDocx}
                      style={{ fontSize: '0.75rem', borderColor: '#3B82F6', color: '#1E3A8A', background: '#FFFFFF', fontWeight: 700 }}
                      id="btn-download-docx"
                      title="Unduh format dokumen Microsoft Word (.docx)"
                    >
                      <Download size={13} color="#2563EB" />
                      <span>Unduh .DOCX (Word)</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleDownloadPdf}
                      style={{ fontSize: '0.75rem', fontWeight: 700 }}
                      id="btn-download-pdf"
                      title="Unduh format dokumen PDF (.pdf)"
                    >
                      <Download size={13} />
                      <span>Unduh .PDF</span>
                    </button>
                  </div>
                </div>

                {/* Area Upload File */}
                {!buktiSuratFile ? (
                  <div style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: '#FFFFFF'
                  }}>
                    <Upload size={26} color="#64748B" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.825rem', color: '#0F172A', marginBottom: '0.25rem' }}>
                      Unggah Foto Lembar Surat atau File Dokumen Izin
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.75rem' }}>
                      Format Foto (JPG, PNG, WebP) atau Berkas (PDF, DOCX) maksimal 10MB
                    </p>
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={13} />
                      <span>Pilih Foto / Dokumen</span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="input-file-surat"
                      />
                    </label>
                  </div>
                ) : (
                  <div style={{
                    background: '#F0FDF4',
                    border: '1px solid #86EFAC',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {buktiSuratFile.isImage ? (
                        <img
                          src={buktiSuratFile.dataUrl}
                          alt="Bukti Surat"
                          style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #86EFAC' }}
                        />
                      ) : (
                        <div style={{ width: '42px', height: '42px', background: '#DCFCE7', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={22} color="#16A34A" />
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle size={14} color="#16A34A" />
                          <span>{buktiSuratFile.name}</span>
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#15803D' }}>
                          Ukuran: {buktiSuratFile.size} • Diunggah: {buktiSuratFile.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setPreviewBuktiModal(buktiSuratFile)}
                        style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem' }}
                      >
                        <Eye size={12} />
                        <span>Pratinjau</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setBuktiSuratFile(null)}
                        style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem' }}
                        title="Hapus dan pilih file lain"
                      >
                        <Trash2 size={12} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* BAGIAN 5: PERSETUJUAN */}
              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '8px',
                padding: '0.85rem',
                marginBottom: '1.25rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#92400E', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    style={{ marginTop: '2px', accentColor: '#D97706' }}
                    required
                  />
                  <span>
                    <strong>Pernyataan Tanggung Jawab:</strong> Saya bersedia merawat dan menjaga kebersihan seluruh peralatan studio yang dipinjam, serta mengembalikannya tepat waktu sesuai batas jam pengembalian yang disepakati.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700 }}
              >
                <Send size={16} />
                <span>Kirim Permohonan Peminjaman (Tanpa Perlu Email)</span>
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Ringkasan & Panduan */}
          <div>
            {/* Box Ringkasan Peminjaman */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckSquare size={16} color="#1E3A8A" />
                <span>Ringkasan Pengajuan</span>
              </div>

              <div style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #E2E8F0' }}>
                  <span>Peminjam:</span>
                  <strong style={{ color: '#0F172A' }}>{namaPeminjam || '-'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #E2E8F0' }}>
                  <span>Kelas / Instansi:</span>
                  <strong style={{ color: '#0F172A' }}>{kelasInstansi || '-'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #E2E8F0' }}>
                  <span>Batas Waktu Kembali:</span>
                  <strong style={{ color: '#1E3A8A' }}>{batasKembali} WIB</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #E2E8F0' }}>
                  <span>Surat Izin:</span>
                  <strong style={{ color: buktiSuratFile ? '#059669' : '#D97706' }}>
                    {buktiSuratFile ? '✓ Terlampir' : 'Belum Dilampirkan'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                  <span>Unit Fasilitas:</span>
                  <strong style={{ color: selectedEquipmentIds.length > 0 ? '#1E3A8A' : '#64748B' }}>
                    {selectedEquipmentIds.length} Unit Dipilih
                  </strong>
                </div>
              </div>

              {selectedItemsDetails.length > 0 && (
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '0.65rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Daftar Alat yang Dipilih:
                  </div>
                  <ul style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.775rem', color: '#334155' }}>
                    {selectedItemsDetails.map((eq) => (
                      <li key={eq.id}>{eq.nama}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: '#64748B', background: '#F1F5F9', padding: '0.65rem', borderRadius: '6px' }}>
                <strong>Catatan Pengambilan:</strong> Bawa surat izin fisik bertandatangan saat mengambil alat di studio untuk diverifikasi bersama petugas piket.
              </div>
            </div>

            {/* SOP Alur Peminjaman */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <HelpCircle size={16} color="#1E3A8A" />
                <span>Alur Pengambilan & Pengembalian</span>
              </div>

              <ol style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.7' }}>
                <li>Pilih alat yang berstatus <strong>"Tersedia"</strong>.</li>
                <li>Isi identitas diri dan lampirkan surat peminjaman.</li>
                <li>Dapatkan <strong>Kode Resi Tiket</strong> setelah formulir dikirim.</li>
                <li>Kunjungi Studio Creative Corner di Gedung B Lt. 2 untuk serah terima fisik.</li>
                <li>Kembalikan peralatan tepat waktu sebelum jam layanan berakhir.</li>
              </ol>
            </div>

            {/* Card Klien PC Kiosk */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Monitor size={16} color="#10B981" />
                <span>PC Workstation Editing Studio</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: '1.5', marginBottom: '0.85rem' }}>
                Perlu menggunakan komputer studio untuk editing video, rendering animasi, atau desain poster?
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setCurrentRole('kiosk')}
              >
                <Monitor size={14} />
                <span>Buka Mode Kiosk PC</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB KONTEN 2: KATALOG FASILITAS */}
      {publicTab === 'katalog' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Katalog Fasilitas & Inventaris Studio
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '4px', margin: 0 }}>
                Pantau ketersediaan real-time peralatan multimedia, lensa, audio, dan ruang studio Creative Corner.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Cari nama alat / ruangan..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                style={{ width: '220px', fontSize: '0.825rem' }}
              />
            </div>
          </div>

          {/* Filter Kategori untuk Katalog */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={`katalog-cat-${cat}`}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  border: selectedCategory === cat ? '1px solid #1E3A8A' : '1px solid #CBD5E1',
                  background: selectedCategory === cat ? '#EFF6FF' : '#FFFFFF',
                  color: selectedCategory === cat ? '#1E3A8A' : '#475569',
                  fontSize: '0.785rem',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {filteredEquipment.map((eq) => {
              const isAvailable = eq.status === 'Tersedia';
              const itemCat = (eq.kategori || '').toLowerCase();
              const itemReq = itemCat.includes('kamera') || eq.nama.toLowerCase().includes('canon') ? getCameraRequirements(eq) : null;
              const isBattery = itemCat.includes('baterai') || eq.nama.toLowerCase().includes('baterai') || eq.nama.toLowerCase().includes('battery');
              const isMemoryCard = itemCat.includes('memory') || itemCat.includes('sd card') || eq.nama.toLowerCase().includes('sd card') || eq.nama.toLowerCase().includes('memory');

              return (
                <div
                  key={eq.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.725rem', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                        {eq.kategori}
                      </span>
                      <StatusBadge status={eq.status} />
                    </div>

                    <h3 style={{ fontSize: '0.975rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                      {eq.nama}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.75rem' }}>
                      Kode Aset: <strong>{eq.id}</strong> • Lokasi: {eq.lokasiRak || 'Studio'}
                    </div>

                    {/* Badge Panduan Lensa Kamera (Baterai sengaja TIDAK ditampilkan agar tidak dikira sudah include baterai) */}
                    {itemReq && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '0.65rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: itemReq.needsAdapter ? '#FEF3C7' : '#EFF6FF',
                          color: itemReq.needsAdapter ? '#92400E' : '#1E40AF',
                          fontWeight: 700,
                          width: 'fit-content'
                        }}>
                          🔍 {itemReq.needsAdapter ? 'Wajib Adapter EF-M to EF (Hanya Lensa EF/DSLR)' : itemReq.lensLabel}
                        </span>
                      </div>
                    )}

                    {/* Badge Kategori Baterai */}
                    {isBattery && (
                      <div style={{ marginBottom: '0.65rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: (eq.nama + eq.spesifikasi).toLowerCase().includes('lp-e10') ? '#FEE2E2' : '#F0FDF4',
                          color: (eq.nama + eq.spesifikasi).toLowerCase().includes('lp-e10') ? '#991B1B' : '#166534',
                          fontWeight: 700,
                          width: 'fit-content'
                        }}>
                          🔋 {(eq.nama + eq.spesifikasi).toLowerCase().includes('lp-e10') ? 'Khusus 1500D (LP-E10)' : 'Baterai LP-E17'}
                        </span>
                      </div>
                    )}

                    {/* Badge Kategori Memory Card */}
                    {isMemoryCard && (
                      <div style={{ marginBottom: '0.65rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#F0F9FF',
                          color: '#0369A1',
                          border: '1px solid #BAE6FD',
                          fontWeight: 700,
                          width: 'fit-content'
                        }}>
                          💾 Memory Card
                        </span>
                      </div>
                    )}

                    <div style={{ fontSize: '0.775rem', color: '#334155', background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
                      <div><strong>Kondisi Fisik:</strong> {eq.kondisiFisik || 'Baik & Normal'}</div>
                      <div><strong>Keterangan:</strong> {eq.spesifikasi || '-'}</div>
                      <div><strong>Status:</strong> {isAvailable ? 'Siap Dipinjam' : 'Sedang Digunakan'}</div>
                    </div>
                  </div>

                  {isAvailable ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        if (!selectedEquipmentIds.includes(eq.id)) {
                          setSelectedEquipmentIds((prev) => [...prev, eq.id]);
                        }
                        setPublicTab('form');
                      }}
                    >
                      <span>Pilih & Ajukan Peminjaman</span>
                      <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled
                      style={{ width: '100%', justifyContent: 'center', opacity: 0.6 }}
                    >
                      <span>Sedang Tidak Tersedia</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. TAB KONTEN 3: STATUS PEMINJAMAN */}
      {publicTab === 'status' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Status Peminjaman Alat & Fasilitas
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '4px', margin: 0 }}>
              Masukkan kode peminjaman atau nama Anda untuk mengecek status verifikasi dan pengembalian.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', maxWidth: '480px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: LOAN-2026 atau nama peminjam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="btn btn-primary">
              <Search size={15} />
              <span>Cari</span>
            </button>
          </div>

          {filteredBorrowings.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '10px' }}>
              <Search size={32} color="#CBD5E1" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 700, color: '#334155' }}>Tidak Ada Data Peminjaman</div>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                Pastikan nomor resi atau nama peminjam sudah diketik dengan benar.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredBorrowings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E3A8A' }}>{b.id}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                      {b.peralatanNama}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '2px' }}>
                      Peminjam: <strong>{b.peminjamNama}</strong> ({b.peminjamKelas}) • Batas: <strong>{b.batasWaktuKembali || '-'} WIB</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {b.buktiSurat && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setPreviewBuktiModal(b.buktiSurat)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <FileText size={13} />
                        <span>Lihat Bukti Surat</span>
                      </button>
                    )}

                    <a
                      href={`https://wa.me/6281200000000?text=${encodeURIComponent(
                        `Halo Petugas Creative Corner, saya ingin menanyakan status resi tiket saya: *${b.id}* atas nama *${b.peminjamNama}*. Terima kasih.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm"
                      style={{ textDecoration: 'none', fontSize: '0.75rem' }}
                    >
                      <Phone size={13} />
                      <span>Hubungi Petugas</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL PRATINJAU BUKTI SURAT */}
      {previewBuktiModal && (
        <Modal
          isOpen={!!previewBuktiModal}
          onClose={() => setPreviewBuktiModal(null)}
          title={`Pratinjau Bukti Surat: ${previewBuktiModal.name}`}
          footer={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPreviewBuktiModal(null)}
            >
              Tutup Pratinjau
            </button>
          }
        >
          {previewBuktiModal.isImage ? (
            <div style={{ textAlign: 'center', background: '#0F172A', padding: '1rem', borderRadius: '8px' }}>
              <img
                src={previewBuktiModal.dataUrl}
                alt="Bukti Surat"
                style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '4px' }}
              />
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px' }}>
              <FileText size={48} color="#1E3A8A" style={{ margin: '0 auto 1rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                {previewBuktiModal.name}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>
                Ukuran berkas: {previewBuktiModal.size} • Tipe: {previewBuktiModal.type}
              </p>
              <div style={{ marginTop: '1.25rem' }}>
                <a
                  href={previewBuktiModal.dataUrl}
                  download={previewBuktiModal.name}
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Download size={14} />
                  <span>Unduh Berkas Lampiran</span>
                </a>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

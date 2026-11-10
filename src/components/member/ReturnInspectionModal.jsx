import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  CheckCircle2,
  ShieldCheck, 
  Camera, 
  Upload, 
  Trash2, 
  Eye,
  Printer,
  X,
  Clock,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';
import { BuktiPeminjamanModal } from '../common/BuktiPeminjamanModal';
import sonyLensPhoto from '../../assets/stitch/sony-fe-24-70-gm2.jpg';

export const ReturnInspectionModal = ({ isOpen, onClose, targetBorrowing }) => {
  const { submitReturnInspection } = useStudio();

  if (!isOpen || !targetBorrowing) return null;

  // Form Fields - Kondisi Fisik (Stitch Radio Options)
  const [kondisiFisikAkhir, setKondisiFisikAkhir] = useState('Baik & Berfungsi Normal');
  const [keteranganAlat, setKeteranganAlat] = useState(
    'Kondisi optik depan dan belakang telah dibersihkan dengan blower & lens pen. Seluruh switch AF/MF dan de-click aperture berfungsi sempurna. Unit siap dimasukkan ke Dry Cabinet 1.'
  );

  // Aksesori Checklist (2x2 Grid)
  const [accessories, setAccessories] = useState({
    frontRearCap: true,
    lensHood: true,
    pouchKain: true,
    uvFilter: true
  });

  const toggleAccessory = (key) => {
    setAccessories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedAccessoriesCount = Object.values(accessories).filter(Boolean).length;

  // Foto Kondisi Fisik Alat Saat Dikembalikan (AFTER)
  const [fotoAfterFile, setFotoAfterFile] = useState(null);
  const [previewZoomModal, setPreviewZoomModal] = useState(null);
  const [isBuktiModalOpen, setIsBuktiModalOpen] = useState(false);

  // Ambil referensi Foto BEFORE dari peminjaman jika tersedia
  const fotoBeforeRef = targetBorrowing.fotoBefore || targetBorrowing.inspeksiPengambilan?.fotoBefore || targetBorrowing.buktiSurat;

  // Upload & Kamera HP Handler dengan Kompresi Otomatis
  const handlePhotoCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, { maxWidth: 1280, maxHeight: 1280, quality: 0.82 });
      setFotoAfterFile(compressed);
    } catch (err) {
      console.error('Gagal mengompresi gambar:', err);
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
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!fotoAfterFile) {
      if (!window.confirm('PERHATIAN: Anda belum melampirkan foto fisik live capture saat dikembalikan (AFTER). Apakah Anda yakin ingin menyelesaikan pengembalian dengan foto inspeksi studio standar?')) {
        return;
      }
    }

    const accessoriesSummary = Object.entries(accessories)
      .map(([k, v]) => `${k}: ${v ? 'Lengkap' : 'Tidak Ada'}`)
      .join(', ');

    submitReturnInspection({
      borrowingId: targetBorrowing.id,
      fotoAfter: fotoAfterFile || { dataUrl: sonyLensPhoto, name: 'studio-inspection-verified.jpg', size: '617 KB' },
      returnInspectionData: {
        kondisiFisikAkhir,
        keteranganAlat,
        fungsiTombol: 'Normal',
        kebersihanLensa: 'Bersih',
        sisaBateraiPersen: 100,
        kelengkapanAksesori: `Aksesori (${completedAccessoriesCount}/4): ${accessoriesSummary}. Catatan: ${keteranganAlat}`,
        kebersihanRuang: 'Bersih',
        catatanKendala: keteranganAlat || 'Tidak ada kendala. Alat dikembalikan dalam kondisi normal.',
        petugasPemeriksa: `${targetBorrowing.peminjamNama} (Inspeksi Pengembalian Mandiri)`,
        fotoAfter: fotoAfterFile || { dataUrl: sonyLensPhoto, name: 'studio-inspection-verified.jpg', size: '617 KB' }
      }
    });

    onClose();
  };

  // Borrower Initials
  const getInitials = (name) => {
    if (!name) return 'CC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const activePhotoPreview = fotoAfterFile?.dataUrl || sonyLensPhoto;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B192C]/75 backdrop-blur-sm overflow-y-auto"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(11, 25, 44, 0.72)',
          backdropFilter: 'blur(4px)',
          padding: '1rem'
        }}
      >
        <div 
          className="bg-white w-full max-w-[800px] rounded-[14px] modal-shadow border border-[#CBD5E1] text-slate-800 flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200"
          style={{
            background: '#FFFFFF',
            width: '100%',
            maxWidth: '820px',
            borderRadius: '14px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 25px 50px -12px rgba(11, 25, 44, 0.35), 0 0 0 1px #CBD5E1',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* HEADER SECTION */}
          <header style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1E3A8A',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={22} color="#1E3A8A" />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                    Verifikasi Pengembalian Alat Studio
                  </h1>
                  <p style={{ fontSize: '0.785rem', color: '#64748B', margin: '3px 0 0 0' }}>
                    Pemeriksaan fisik komparatif sebelum unit masuk kembali ke lemari aset Creative Corner.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Tutup Dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* TARGET UNIT BANNER PILL */}
            <div style={{
              marginTop: '1rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#1E3A8A',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.725rem'
                }}>
                  #EQ-{targetBorrowing.peralatanKode || targetBorrowing.id?.slice(0, 7) || 'AST-002'}
                </span>
                <strong style={{ color: '#0F172A', fontSize: '0.85rem' }}>
                  {targetBorrowing.peralatanNama}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#475569', flexWrap: 'wrap' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#1E3A8A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.625rem',
                  fontWeight: 700
                }}>
                  {getInitials(targetBorrowing.peminjamNama)}
                </div>
                <span>
                  Peminjam: <strong style={{ color: '#0F172A' }}>{targetBorrowing.peminjamNama}</strong> ({targetBorrowing.peminjamKelas})
                </span>
                <span style={{
                  background: '#E2E8F0',
                  color: '#334155',
                  fontSize: '0.685rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  {targetBorrowing.keperluan || 'Liputan Acara Utama'}
                </span>
              </div>
            </div>
          </header>

          {/* BODY 2-COLUMN COMPARISON SECTION */}
          <main style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(85vh - 160px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              
              {/* LEFT COLUMN: KOMPARASI BUKTI FOTO */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: 0 }}>
                    Komparasi Bukti Foto
                  </h2>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#059669',
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle2 size={12} color="#059669" />
                    <span>Elemen Optik Depan Bersih</span>
                  </span>
                </div>

                {/* Top: Foto Kondisi Awal (BEFORE) */}
                <div style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  background: '#F8FAFC'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={13} color="#64748B" />
                      <span>Foto Kondisi Awal (Saat Pengambilan)</span>
                    </span>
                    <span style={{ fontSize: '0.675rem', background: '#E2E8F0', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      Kondisi: Mulus / Lengkap
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div 
                      style={{
                        width: '76px',
                        height: '62px',
                        borderRadius: '8px',
                        background: '#0F172A',
                        border: '1px solid #CBD5E1',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                        cursor: 'pointer'
                      }}
                      onClick={() => setPreviewZoomModal(fotoBeforeRef?.dataUrl || fotoBeforeRef || sonyLensPhoto)}
                      title="Klik untuk memperbesar foto awal (BEFORE)"
                    >
                      <img
                        src={fotoBeforeRef?.dataUrl || fotoBeforeRef || sonyLensPhoto}
                        alt="Foto checkout awal"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.65)',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '8px',
                        textAlign: 'center',
                        padding: '1px 0'
                      }}>
                        CHECKOUT
                      </span>
                    </div>

                    <div style={{ fontSize: '0.725rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div><span style={{ color: '#94A3B8' }}>Timestamp:</span> <strong style={{ fontFamily: 'var(--font-mono)', color: '#0F172A' }}>{targetBorrowing.tanggalPinjam || 'Hari ini'} 08:30 WIB</strong></div>
                      <div><span style={{ color: '#94A3B8' }}>Inspektor:</span> <strong>{targetBorrowing.peminjamNama} (QC Lab)</strong></div>
                      <div style={{ color: '#059669', fontWeight: 600, fontSize: '0.7rem' }}>Grade Fisik A+ (Bebas Dust/Fungus)</div>
                    </div>
                  </div>
                </div>

                {/* Bottom: Foto Kondisi Akhir (AFTER Live Capture) */}
                <div style={{
                  border: '2px dashed #93C5FD',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  background: '#EFF6FF'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                      <span>Foto Kondisi Akhir (Saat Ini)</span>
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.675rem',
                      color: '#1E40AF',
                      background: '#DBEAFE',
                      border: '1px solid #BFDBFE',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      Hari ini (Live Capture)
                    </span>
                  </div>

                  {/* High-Resolution Inspection Image Canvas */}
                  <div 
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #CBD5E1',
                      position: 'relative',
                      aspectRatio: '4 / 3',
                      background: '#0F172A',
                      cursor: 'pointer'
                    }}
                    onClick={() => setPreviewZoomModal(activePhotoPreview)}
                    title="Klik untuk memperbesar pratinjau"
                  >
                    <img
                      src={activePhotoPreview}
                      alt="High-resolution close-up product photo of equipment"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(11, 25, 44, 0.8)',
                      backdropFilter: 'blur(4px)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.685rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <CheckCircle2 size={12} color="#34D399" />
                      <span>Optik Depan: Bersih Terkalibrasi</span>
                    </div>
                  </div>

                  {/* Action buttons under photo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem' }}>
                    <label
                      className="btn btn-primary btn-sm"
                      style={{
                        flex: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        fontSize: '0.75rem',
                        padding: '0.4rem 0.6rem'
                      }}
                      id="btn-trigger-camera"
                    >
                      <Camera size={14} />
                      <span>Ambil via Kamera HP</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoCapture}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <label
                      className="btn btn-secondary btn-sm"
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        padding: '0.4rem 0.6rem'
                      }}
                      id="btn-trigger-gallery"
                    >
                      <Upload size={13} />
                      <span>Ganti Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoCapture}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </section>

              {/* RIGHT COLUMN: STATUS KONDISI FISIK, CHECKLIST & CATATAN */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* 1. Status Kondisi Fisik Radio Group */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.4rem' }}>
                    Status Kondisi Fisik
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    
                    {/* Option 1: Baik & Berfungsi Normal */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      border: kondisiFisikAkhir.includes('Baik') ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                      background: kondisiFisikAkhir.includes('Baik') ? '#ECFDF5' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}>
                      <input
                        type="radio"
                        name="kondisi_fisik_radio"
                        checked={kondisiFisikAkhir.includes('Baik')}
                        onChange={() => setKondisiFisikAkhir('Baik & Berfungsi Normal')}
                        style={{ marginTop: '3px' }}
                      />
                      <div style={{ fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>Baik & Berfungsi Normal</span>
                          <span style={{ color: '#059669', fontSize: '0.8rem' }}>✓</span>
                        </div>
                        <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '2px 0 0 0' }}>
                          Tidak ada goresan atau jamur, fungsi autofocus/manual normal
                        </p>
                      </div>
                    </label>

                    {/* Option 2: Lecet Pemakaian Ringan */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      border: kondisiFisikAkhir.includes('Lecet') ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                      background: kondisiFisikAkhir.includes('Lecet') ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}>
                      <input
                        type="radio"
                        name="kondisi_fisik_radio"
                        checked={kondisiFisikAkhir.includes('Lecet')}
                        onChange={() => setKondisiFisikAkhir('Lecet Pemakaian Ringan')}
                        style={{ marginTop: '3px' }}
                      />
                      <div style={{ fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>
                          Lecet Pemakaian Ringan
                        </div>
                        <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '2px 0 0 0' }}>
                          Tanda pakai kosmetik wajar pada bodi luar atau lens hood
                        </p>
                      </div>
                    </label>

                    {/* Option 3: Terdapat Kerusakan / Error */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      border: kondisiFisikAkhir.includes('Kerusakan') ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
                      background: kondisiFisikAkhir.includes('Kerusakan') ? '#FEF2F2' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}>
                      <input
                        type="radio"
                        name="kondisi_fisik_radio"
                        checked={kondisiFisikAkhir.includes('Kerusakan')}
                        onChange={() => setKondisiFisikAkhir('Terdapat Kerusakan / Error')}
                        style={{ marginTop: '3px' }}
                      />
                      <div style={{ fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 700, color: '#B91C1C' }}>
                          Terdapat Kerusakan / Error
                        </div>
                        <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '2px 0 0 0' }}>
                          Optik baret, autofocus macet, jatuh, atau tombol tidak merespon
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 2. Accessories Completeness Checklist (2x2 Grid) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: 0 }}>
                      Kelengkapan Aksesori
                    </label>
                    <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#059669' }}>
                      Lengkap {completedAccessoriesCount}/4 Item
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem',
                    background: '#F8FAFC',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.775rem'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={accessories.frontRearCap}
                        onChange={() => toggleAccessory('frontRearCap')}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <span style={{ color: '#334155', fontWeight: 500 }}>Front & Rear Cap</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={accessories.lensHood}
                        onChange={() => toggleAccessory('lensHood')}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <span style={{ color: '#334155', fontWeight: 500 }}>Lens Hood (Original)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={accessories.pouchKain}
                        onChange={() => toggleAccessory('pouchKain')}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <span style={{ color: '#334155', fontWeight: 500 }}>Pouch / Tas Unit</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={accessories.uvFilter}
                        onChange={() => toggleAccessory('uvFilter')}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <span style={{ color: '#334155', fontWeight: 500 }}>UV Filter / Baterai Cadangan</span>
                    </label>
                  </div>
                </div>

                {/* 3. QC Condition Notes */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: 0 }}>
                      Catatan Kondisi / Kelengkapan
                    </label>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.675rem', color: '#94A3B8' }}>
                      {keteranganAlat.length} / 500 karakter
                    </span>
                  </div>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={keteranganAlat}
                    onChange={(e) => setKeteranganAlat(e.target.value.slice(0, 500))}
                    placeholder="Tuliskan catatan detail jika ada kendala fisik atau fungsi..."
                    style={{
                      width: '100%',
                      fontSize: '0.785rem',
                      lineHeight: '1.4',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '8px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </section>
            </div>
          </main>

          {/* FOOTER ACTIONS BAR */}
          <footer style={{
            padding: '0.85rem 1.5rem',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            {/* Left: Dismiss */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              style={{ fontSize: '0.785rem', padding: '0.5rem 0.85rem' }}
            >
              Batal / Periksa Nanti
            </button>

            {/* Right: Print Receipt & Submit Sign-off */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsBuktiModalOpen(true)}
                style={{
                  fontSize: '0.785rem',
                  padding: '0.5rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#FFFFFF'
                }}
              >
                <Printer size={14} color="#64748B" />
                <span>Cetak Bukti Serah Terima</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSubmit}
                id="btn-confirm-return"
                style={{
                  fontSize: '0.785rem',
                  padding: '0.55rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 700,
                  background: '#1E3A8A'
                }}
              >
                <CheckCircle size={15} color="#34D399" />
                <span>Simpan & Setujui Pengembalian</span>
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Modal Zoom Preview */}
      {previewZoomModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(6px)',
            padding: '1rem'
          }}
          onClick={() => setPreviewZoomModal(null)}
        >
          <div 
            style={{
              background: '#0F172A',
              padding: '0.75rem',
              borderRadius: '12px',
              maxWidth: '90vw',
              maxHeight: '85vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewZoomModal}
              alt="Pratinjau inspeksi pembesaran"
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px' }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setPreviewZoomModal(null)}
              style={{ marginTop: '0.75rem' }}
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

      {/* Bukti Peminjaman Modal for Printing Receipt */}
      {isBuktiModalOpen && (
        <BuktiPeminjamanModal
          isOpen={isBuktiModalOpen}
          onClose={() => setIsBuktiModalOpen(false)}
          loanData={{
            ...targetBorrowing,
            status: 'Dikembalikan (Verifikasi Fisik Selesai)'
          }}
        />
      )}
    </>
  );
};

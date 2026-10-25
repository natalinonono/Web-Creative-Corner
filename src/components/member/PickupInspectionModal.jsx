import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStudio } from '../../context/StudioContext';
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
  Trash2,
  Sparkles,
  BatteryCharging
} from 'lucide-react';
import { getCameraRequirements, isEquipmentCompatible, isCameraItem, isLensItem, isBatteryItem, isMemoryCardItem, getLensMountType } from '../../utils/cameraCompatibility';
import { compressImage } from '../../utils/imageCompression';

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

  // Deteksi Kamera yang dipilih saat inspeksi pengambilan untuk kompatibilitas otomatis
  const selectedCamera = equipment.find(
    (eq) => selectedEqIds.includes(eq.id) && isCameraItem(eq)
  );
  const cameraReq = selectedCamera ? getCameraRequirements(selectedCamera) : null;

  // Filter: Lensa & Baterai yang tidak kompatibel TIDAK MUNCUL
  const displayedEquipment = equipment.filter((item) => {
    if (cameraReq && !isEquipmentCompatible(item, cameraReq)) {
      return false;
    }
    return true;
  });

  // Form Fields (Hanya: Kondisi Fisik dan Keterangan Alat)
  const [kondisiFisik, setKondisiFisik] = useState('Baik, mulus tanpa lecet');
  const [keteranganAlat, setKeteranganAlat] = useState('Lengkap dan normal siap pakai');
  const [batasWaktuKembali, setBatasWaktuKembali] = useState(targetEvent?.waktuSelesai || '16:00');

  // Foto Kondisi Fisik Alat / Gear Sebelum Dipakai (BEFORE)
  const [fotoBeforeFile, setFotoBeforeFile] = useState(null);
  const [previewZoomModal, setPreviewZoomModal] = useState(null);

  // Upload & Kamera HP Handler dengan Kompresi Otomatis
  const handlePhotoCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, { maxWidth: 1280, maxHeight: 1280, quality: 0.82 });
      setFotoBeforeFile(compressed);
    } catch (err) {
      console.error('Gagal mengompresi gambar:', err);
      // Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoBeforeFile({
          name: file.name || `foto-before-${Date.now()}.jpg`,
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

  const handleToggleEq = (id) => {
    setSelectedEqIds((prev) => {
      const willSelect = !prev.includes(id);
      if (!willSelect) {
        return prev.filter((i) => i !== id);
      }

      const targetItem = equipment.find((e) => e.id === id);
      // Jika memilih kamera, bersihkan alat yang tidak kompatibel yang sebelumnya sempat tercentang
      if (targetItem && isCameraItem(targetItem)) {
        const req = getCameraRequirements(targetItem);
        const filteredPrev = prev.filter((prevId) => {
          const prevItem = equipment.find((e) => e.id === prevId);
          if (!prevItem) return true;
          return isEquipmentCompatible(prevItem, req);
        });
        return [...filteredPrev, id];
      }

      return [...prev, id];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedEqIds.length === 0) {
      alert('Pilihlah minimal satu alat/ruangan yang diambil untuk inspeksi.');
      return;
    }

    if (!fotoBeforeFile) {
      if (!window.confirm('PERHATIAN: Anda belum melampirkan foto fisik alat sebelum diambil (BEFORE). Apakah Anda ingin melanjutkan tanpa foto bukti fisik awal?')) {
        return;
      }
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
      buktiSurat: fotoBeforeFile,
      fotoBefore: fotoBeforeFile,
      inspeksiData: {
        kondisiFisik,
        keteranganAlat,
        fungsiTombol: 'Normal',
        kebersihanLensa: 'Bersih',
        bateraiPersen: 100,
        kelengkapanAksesori: keteranganAlat,
        kebersihanRuang: 'Bersih',
        fotoBefore: fotoBeforeFile,
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

        {/* Informasi Peminjam & Event */}
        <div className="form-grid-dual">
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Pilih Unit Peralatan / Ruang yang Diperiksa & Diambil *
            </label>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E3A8A' }}>
              {selectedEqIds.length} Unit Dipilih
            </span>
          </div>

          {/* Banner Kompatibilitas Otomatis Jika Kamera Dipilih */}
          {cameraReq && (
            <div style={{
              marginBottom: '0.65rem',
              padding: '0.55rem 0.75rem',
              background: '#EFF6FF',
              border: '1.5px solid #3B82F6',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Sparkles size={16} color="#2563EB" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 800, color: '#1E3A8A' }}>Filter Kompatibilitas Otomatis:</span> Kamera <strong>{selectedCamera.nama}</strong> terpilih.{' '}
                {cameraReq.needsAdapter ? 'Wajib pakai Adapter EF-M to EF & Lensa EF (DSLR).' : `Menggunakan ${cameraReq.lensLabel}.`}{' '}
                Rekomendasi Baterai: <strong>{cameraReq.batteryLabel}</strong>.
                <span style={{ color: '#2563EB', display: 'block', fontSize: '0.685rem', marginTop: '1px', fontStyle: 'italic' }}>
                  * Lensa dan baterai yang tidak kompatibel dengan kamera ini otomatis disembunyikan.
                </span>
              </div>
            </div>
          )}

          {equipment.length === 0 ? (
            <div style={{ padding: '1rem', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', fontSize: '0.825rem', color: '#64748B' }}>
              Belum ada inventaris alat/ruang yang terdaftar. Administrator dapat menambahkan unit terlebih dahulu di Portal Pengelola.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.65rem',
              maxHeight: '180px',
              overflowY: 'auto',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.75rem',
              background: '#FAFAFA'
            }}>
              {displayedEquipment.map((item) => {
                const isSelected = selectedEqIds.includes(item.id);
                const itemCat = (item.kategori || '').toLowerCase();
                const isCam = isCameraItem(item);
                const itemReq = isCam ? getCameraRequirements(item) : null;
                const isLens = isLensItem(item);
                const lensMount = isLens ? getLensMountType(item) : null;
                const isBattery = isBatteryItem(item);
                const isMemoryCard = isMemoryCardItem(item);

                return (
                  <label 
                    key={item.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      padding: '0.5rem 0.65rem',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isSelected ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.825rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleEq(item.id)}
                      style={{ marginTop: '3px', accentColor: '#1E3A8A' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ color: '#0F172A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.nama}
                      </strong>
                      <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{item.kategori}</div>

                      {/* Badge Panduan Lensa Kamera (Baterai sengaja TIDAK ditampilkan agar tidak dikira sudah include baterai) */}
                      {itemReq && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '3px' }}>
                          <span style={{
                            fontSize: '0.675rem',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: itemReq.needsAdapter ? '#FEF3C7' : '#EFF6FF',
                            color: itemReq.needsAdapter ? '#92400E' : '#1E40AF',
                            fontWeight: 700,
                            width: 'fit-content'
                          }}>
                            🔍 {itemReq.needsAdapter ? 'Wajib Adapter EF-M→EF' : itemReq.lensLabel}
                          </span>
                        </div>
                      )}

                      {/* Badge Panduan Mount Lensa */}
                      {isLens && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '3px' }}>
                          <span style={{
                            fontSize: '0.675rem',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: lensMount === 'EF-M' ? '#FAF5FF' : '#EEF2FF',
                            color: lensMount === 'EF-M' ? '#7E22CE' : '#4338CA',
                            border: `1px solid ${lensMount === 'EF-M' ? '#E9D5FF' : '#C7D2FE'}`,
                            fontWeight: 700,
                            width: 'fit-content'
                          }}>
                            🔍 {lensMount === 'EF-M' ? 'Mount: Lensa EF-M (Mirrorless)' : 'Mount: Lensa EF (DSLR)'}
                          </span>
                        </div>
                      )}

                      {/* Badge Kategori Baterai */}
                      {isBattery && (
                        <div style={{ marginTop: '3px' }}>
                          <span style={{
                            fontSize: '0.675rem',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: (item.nama + (item.spesifikasi || '')).toLowerCase().includes('lp-e10') ? '#FEE2E2' : '#F0FDF4',
                            color: (item.nama + (item.spesifikasi || '')).toLowerCase().includes('lp-e10') ? '#991B1B' : '#166534',
                            fontWeight: 700
                          }}>
                            🔋 {(item.nama + (item.spesifikasi || '')).toLowerCase().includes('lp-e10') ? 'Khusus 1500D (LP-E10)' : 'Baterai LP-E17'}
                          </span>
                        </div>
                      )}

                      {/* Badge Kategori Memory Card */}
                      {isMemoryCard && (
                        <div style={{ marginTop: '3px' }}>
                          <span style={{
                            fontSize: '0.675rem',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: '#F0F9FF',
                            color: '#0369A1',
                            border: '1px solid #BAE6FD',
                            fontWeight: 700
                          }}>
                            💾 Memory Card
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Cek Fisik dan Keterangan Alat */}
        <div className="form-grid-dual">
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

        {/* DOKUMENTASI FOTO FISIK ALAT / GEAR SEBELUM DIPAKAI (BEFORE) */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Camera size={18} color="#1E3A8A" />
              <span>Foto Fisik Alat / Gear Sebelum Dipakai (BEFORE) *</span>
            </label>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              KAMERA HP / GALERI
            </span>
          </div>

          <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0 0 0.65rem 0' }}>
            Ambil foto kondisi fisik unit alat/gear saat ini sebelum dibawa keluar studio sebagai bukti rekaman awal (BEFORE).
          </p>

          {!fotoBeforeFile ? (
            <div style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '10px',
              padding: '1.25rem 1rem',
              textAlign: 'center',
              background: '#FAFAFA'
            }}>
              <Camera size={30} color="#1E3A8A" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                Ambil Foto Kondisi Alat Sebelum Digunakan (BEFORE)
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.85rem' }}>
                Bisa langsung jepret dengan Kamera HP atau pilih foto yang sudah diambil dari galeri perangkat.
              </p>

              <div className="camera-action-group" style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                {/* 1. Tombol Buka Kamera HP Langsung */}
                <label
                  className="btn btn-primary btn-sm"
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: '#1E3A8A'
                  }}
                  id="btn-pickup-camera"
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
                  id="btn-pickup-gallery"
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
              background: '#F0F9FF',
              border: '1.5px solid #7DD3FC',
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
                    border: '1.5px solid #0284C7',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPreviewZoomModal(fotoBeforeFile.dataUrl)}
                  title="Klik untuk melihat foto lebih besar"
                >
                  <img
                    src={fotoBeforeFile.dataUrl}
                    alt="Foto Fisik Alat (Before)"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#0284C7', color: '#FFFFFF', padding: '1px 7px', borderRadius: '4px', fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    <Camera size={11} />
                    <span>Foto BEFORE (Kondisi Awal)</span>
                  </div>
                  <strong style={{ fontSize: '0.825rem', color: '#0369A1', display: 'block' }}>
                    {fotoBeforeFile.name}
                  </strong>
                  <div style={{ fontSize: '0.725rem', color: '#0284C7' }}>
                    Ukuran: <strong>{fotoBeforeFile.size}</strong> {fotoBeforeFile.originalSize && `(dikompresi dari ${fotoBeforeFile.originalSize})`} • Siap Diverifikasi Sistem
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPreviewZoomModal(fotoBeforeFile.dataUrl)}
                  style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
                >
                  <Eye size={13} />
                  <span>Lihat Foto</span>
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setFotoBeforeFile(null)}
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

      {/* Modal Pratinjau Zoom Foto BEFORE */}
      {previewZoomModal && (
        <Modal
          isOpen={Boolean(previewZoomModal)}
          onClose={() => setPreviewZoomModal(null)}
          title="Pratinjau Foto Kondisi Fisik Alat (BEFORE)"
          footer={
            <button type="button" className="btn btn-secondary" onClick={() => setPreviewZoomModal(null)}>
              Tutup
            </button>
          }
        >
          <div style={{ textAlign: 'center', background: '#0F172A', borderRadius: '8px', padding: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
            <img
              src={previewZoomModal}
              alt="Foto Fisik Alat (Before)"
              style={{ maxWidth: '100%', maxHeight: '460px', objectFit: 'contain', borderRadius: '4px' }}
            />
          </div>
        </Modal>
      )}
    </Modal>
  );
};

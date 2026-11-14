import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
  X, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Compass, 
  FileText, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink,
  Layers,
  Archive,
  Maximize2
} from 'lucide-react';
import { STUDIO_SOP_RULES, STUDIO_STORAGE_SYSTEM } from '../../data/seedData';

export const StorageGuideModal = ({ isOpen, onClose, initialTab = 'sop' }) => {
  const { 
    batteryCharges, 
    startBatteryCharge, 
    stopBatteryCharge, 
    deleteBatteryCharge,
    equipment
  } = useStudio();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Form input cas baterai baru
  const [inputBatteryName, setInputBatteryName] = useState('Baterai Takara #1 (LP-E17)');
  const [inputChargerName, setInputChargerName] = useState('Charger Canon LC-E17E (EQ-33)');
  const [inputPetugas, setInputPetugas] = useState('');
  const [inputLokasi, setInputLokasi] = useState('Stopkontak Studio Utama Lt. 2');
  const [inputCatatan, setInputCatatan] = useState('');

  // Live timer tick untuk baterai yang sedang dicas
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const handleStartChargeSubmit = (e) => {
    e.preventDefault();
    if (!inputBatteryName) return;
    startBatteryCharge({
      batteryName: inputBatteryName,
      chargerName: inputChargerName,
      petugas: inputPetugas.trim() || 'Kru Studio',
      lokasiColokan: inputLokasi,
      catatan: inputCatatan.trim()
    });
    setInputCatatan('');
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : now;
    const diffMin = Math.max(1, Math.round((end - start) / 60000));
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    if (hours > 0) return `${hours} jam ${mins} mnt`;
    return `${mins} menit`;
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 110 }}>
      <div 
        className="modal-content modal-content-lg" 
        style={{ 
          maxWidth: '920px', 
          maxHeight: '92vh',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.35)',
          border: '1px solid #E2E8F0'
        }}
      >
        {/* MODAL HEADER */}
        <div 
          className="modal-header" 
          style={{ 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
            borderBottom: '1px solid #E2E8F0',
            padding: '1.25rem 1.65rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Camera size={22} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                Panduan Tata Letak & SOP Sarana Prasarana Kamera
              </h2>
              <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <span style={{ color: '#1E3A8A', fontWeight: 700 }}>Creative Corner Studio OS</span>
                <span>•</span>
                <span>Lemari Utama, Box Coklat & Box Biru (Lantai 2)</span>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '34px', height: '34px', padding: 0 }}
            title="Tutup Panduan"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL NAVIGATION SUB-TABS */}
        <div 
          style={{ 
            display: 'flex', 
            background: '#F8FAFC', 
            borderBottom: '1px solid #E2E8F0', 
            padding: '0.5rem 1.25rem 0',
            gap: '0.4rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none'
          }}
        >
          <button
            type="button"
            className={`tab-btn ${activeTab === 'sop' ? 'active' : ''}`}
            onClick={() => setActiveTab('sop')}
            style={{ padding: '0.6rem 0.95rem', fontSize: '0.825rem' }}
          >
            <ShieldCheck size={16} />
            <span>4 SOP Perawatan</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'boxCoklat' ? 'active' : ''}`}
            onClick={() => setActiveTab('boxCoklat')}
            style={{ padding: '0.6rem 0.95rem', fontSize: '0.825rem' }}
          >
            <Archive size={16} color="#B45309" />
            <span>Box Coklat (Kamera)</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'boxBiru' ? 'active' : ''}`}
            onClick={() => setActiveTab('boxBiru')}
            style={{ padding: '0.6rem 0.95rem', fontSize: '0.825rem' }}
          >
            <Archive size={16} color="#1D4ED8" />
            <span>Box Biru (Lensa & Daya)</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'lemariStudio' ? 'active' : ''}`}
            onClick={() => setActiveTab('lemariStudio')}
            style={{ padding: '0.6rem 0.95rem', fontSize: '0.825rem' }}
          >
            <Layers size={16} color="#1E3A8A" />
            <span>Lemari Studio (Rak 1-8)</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'batteryTracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('batteryTracker')}
            style={{ padding: '0.6rem 0.95rem', fontSize: '0.825rem' }}
          >
            <Zap size={16} color="#D97706" />
            <span>Rekam Cas Baterai</span>
            {batteryCharges.filter(c => c.status === 'Sedang Cas').length > 0 && (
              <span className="tab-pill-count" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#FDE68A' }}>
                {batteryCharges.filter(c => c.status === 'Sedang Cas').length} Cas
              </span>
            )}
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="modal-body" style={{ padding: '1.5rem', maxHeight: 'calc(92vh - 150px)', overflowY: 'auto' }}>
          
          {/* =========================================================================
              TAB 1: 4 SOP PERAWATAN SARANA PRASARANA CAMERA
          ========================================================================= */}
          {activeTab === 'sop' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', 
                  border: '1px solid #BFDBFE', 
                  borderRadius: '16px', 
                  padding: '1.25rem 1.5rem' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#1E3A8A', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <Sparkles size={16} />
                  <span>Pedoman Standar Operasional Prosedur Studio (SOP)</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                  📸 Tata Tertib & Perawatan Sarana Prasarana Kamera Creative Corner
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#475569', margin: '0.35rem 0 0', lineHeight: 1.5 }}>
                  Wajib dipatuhi oleh seluruh kru Creative Corner, siswa, guru pembina, dan perwakilan kelas demi menjaga umur sensor kamera, optik lensa, dan baterai studio tetap prima.
                </p>
              </div>

              {/* 4 Aturan SOP Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {STUDIO_SOP_RULES.map((rule) => {
                  const isCritical = rule.nomor === 4;
                  return (
                    <div 
                      key={rule.nomor}
                      className="card"
                      style={{
                        padding: '1.25rem',
                        borderLeft: isCritical ? '4px solid #DC2626' : '4px solid #1E3A8A',
                        background: isCritical ? '#FFF1F2' : '#FFFFFF',
                        borderColor: isCritical ? '#FECDD3' : '#F1F5F9'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span 
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: isCritical ? '#FEE2E2' : '#EFF6FF',
                            color: isCritical ? '#DC2626' : '#1E3A8A',
                            border: `1px solid ${isCritical ? '#FCA5A5' : '#BFDBFE'}`
                          }}
                        >
                          ATURAN #{rule.nomor} • {rule.badge}
                        </span>
                        <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>
                          {rule.kategori}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isCritical ? '#991B1B' : '#0F172A', marginBottom: '0.45rem' }}>
                        {rule.judul}
                      </h4>

                      <p style={{ fontSize: '0.825rem', color: isCritical ? '#7F1D1D' : '#475569', lineHeight: 1.5, margin: 0 }}>
                        {rule.deskripsi}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Banner Penekanan Aturan #4 */}
              <div 
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #F87171',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <AlertTriangle size={22} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#991B1B' }}>
                    ⚠️ Peringatan Keras: JANGAN TINGGALKAN BOX TERBUKA DI LUAR LEMARI!
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7F1D1D', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    Setelah mengambil atau menata kamera, lensa, dan baterai, <strong>Box Coklat dan Box Biru WAJIB ditutup rapat dengan klip pengunci</strong> dan segera dimasukkan kembali ke <strong>Rak 6 Lemari Studio</strong>. Jangan biarkan box terbuka di atas meja karena rentan debu studio dan risiko jatuh.
                  </div>
                </div>
              </div>

              {/* Pintasan Aksi Cepat */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('boxCoklat')}
                >
                  <Archive size={14} color="#B45309" />
                  <span>Lihat Isi Box Coklat</span>
                </button>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('boxBiru')}
                >
                  <Archive size={14} color="#1D4ED8" />
                  <span>Lihat Isi Box Biru</span>
                </button>
                <button 
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveTab('batteryTracker')}
                >
                  <Zap size={14} />
                  <span>Catat Waktu Cas Baterai</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: BOX COKLAT (KAMERA UTAMA & CLEANING KIT)
          ========================================================================= */}
          {activeTab === 'boxCoklat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div 
                style={{ 
                  background: '#FFFBEB', 
                  border: '1px solid #FDE68A', 
                  borderRadius: '16px', 
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>
                    Wadah Kamera Studio // Dry Box Coklat
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350F', margin: '0.2rem 0 0' }}>
                    {STUDIO_STORAGE_SYSTEM.boxCoklat.nama}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#92400E', marginTop: '0.25rem' }}>
                    📍 <strong>Lokasi:</strong> {STUDIO_STORAGE_SYSTEM.boxCoklat.lokasiLemari}
                  </div>
                </div>

                <span 
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: '#FEF3C7',
                    border: '1px solid #F59E0B',
                    color: '#B45309',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  6 Item Khusus Kamera & Perawatan
                </span>
              </div>

              {/* Foto Acuan Tata Letak Box Coklat */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Camera size={18} color="#B45309" />
                      <span>Foto Acuan Posisi Tata Letak Box Coklat (Label No. 1 - 6)</span>
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.15rem' }}>
                      Setiap kamera & kit perawatan wajib dikembalikan pada posisi nomor aslinya seperti foto di bawah.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.725rem', color: '#2563EB', fontWeight: 600, background: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>
                    🔍 Klik gambar untuk memperbesar
                  </span>
                </div>

                <div 
                  style={{ 
                    position: 'relative', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    maxHeight: '340px',
                    cursor: 'pointer',
                    background: '#0F172A',
                    border: '2px solid #FDE68A'
                  }}
                  onClick={() => setSelectedPhoto(STUDIO_STORAGE_SYSTEM.boxCoklat.fotoUrl || '/storage-photos/box-coklat-annotated.jpg')}
                  title="Klik untuk melihat foto beresolusi penuh"
                >
                  <img 
                    src={STUDIO_STORAGE_SYSTEM.boxCoklat.fotoUrl || '/storage-photos/box-coklat-annotated.jpg'} 
                    alt="Tata Letak Box Coklat Kamera Resmi" 
                    style={{ width: '100%', height: '340px', objectFit: 'contain', background: '#0F172A' }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Maximize2 size={13} />
                    <span>Perbesar Foto Layout</span>
                  </div>
                </div>
              </div>

              {/* Tabel Daftar Barang di Box Coklat */}
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                      <th>Nama Barang / Alat</th>
                      <th>Kategori</th>
                      <th>Kode Inventaris</th>
                      <th>Keterangan & Posisi Sesuai Foto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STUDIO_STORAGE_SYSTEM.boxCoklat.daftarBarang.map((item) => (
                      <tr key={item.nomor}>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: item.warnaLabel || '#B45309',
                            color: item.warnaLabel === '#EAB308' ? '#000000' : '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }}>
                            {item.nomor}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: '#0F172A' }}>{item.nama}</td>
                        <td>
                          <span className="badge badge-amber">{item.kategori}</span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {item.kodeAlat || '-'}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#475569' }}>{item.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: BOX BIRU (LENSA, BATERAI & CHARGER)
          ========================================================================= */}
          {activeTab === 'boxBiru' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div 
                style={{ 
                  background: '#EFF6FF', 
                  border: '1px solid #BFDBFE', 
                  borderRadius: '16px', 
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase' }}>
                    Wadah Lensa & Daya // Dry Box Biru
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E3A8A', margin: '0.2rem 0 0' }}>
                    {STUDIO_STORAGE_SYSTEM.boxBiru.nama}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#1E40AF', marginTop: '0.25rem' }}>
                    📍 <strong>Lokasi:</strong> {STUDIO_STORAGE_SYSTEM.boxBiru.lokasiLemari}
                  </div>
                </div>

                <span 
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: '#DBEAFE',
                    border: '1px solid #3B82F6',
                    color: '#1D4ED8',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  8 Item Lensa, Charger & Daya
                </span>
              </div>

              {/* Foto Acuan Tata Letak Box Biru */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Camera size={16} color="#1D4ED8" />
                    <span>Foto Acuan Posisi Tata Letak Box Biru</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Klik gambar untuk memperbesar</span>
                </div>

                <div 
                  style={{ 
                    position: 'relative', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    maxHeight: '260px',
                    cursor: 'pointer',
                    background: '#0F172A'
                  }}
                  onClick={() => setSelectedPhoto('/storage-photos/storage-layout-4.jpeg')}
                >
                  <img 
                    src="/storage-photos/storage-layout-4.jpeg" 
                    alt="Tata Letak Box Biru Lensa & Baterai" 
                    style={{ width: '100%', height: '260px', objectFit: 'cover' }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Maximize2 size={12} />
                    <span>Perbesar Foto</span>
                  </div>
                </div>
              </div>

              {/* Tabel Daftar Barang di Box Biru */}
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>No</th>
                      <th>Nama Barang / Perlengkapan</th>
                      <th>Kategori</th>
                      <th>Kode Inventaris</th>
                      <th>Keterangan / Panduan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STUDIO_STORAGE_SYSTEM.boxBiru.daftarBarang.map((item) => (
                      <tr key={item.nomor}>
                        <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>#{item.nomor}</td>
                        <td style={{ fontWeight: 700, color: '#0F172A' }}>{item.nama}</td>
                        <td>
                          <span className="badge badge-blue">{item.kategori}</span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {item.kodeAlat || '-'}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#475569' }}>{item.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: LEMARI STUDIO (RAK 1 S/D 8)
          ========================================================================= */}
          {activeTab === 'lemariStudio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div 
                style={{ 
                  background: '#EFF6FF', 
                  border: '1px solid #BFDBFE', 
                  borderRadius: '16px', 
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1E3A8A', textTransform: 'uppercase' }}>
                    Lemari Fasilitas Studio Utama // Lantai 2
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#172554', margin: '0.2rem 0 0' }}>
                    {STUDIO_STORAGE_SYSTEM.lemariStudio.nama}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#1E40AF', marginTop: '0.25rem' }}>
                    📍 <strong>Lokasi:</strong> {STUDIO_STORAGE_SYSTEM.lemariStudio.lokasiLemari}
                  </div>
                </div>

                <span 
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: '#DBEAFE',
                    border: '1px solid #93C5FD',
                    color: '#1E3A8A',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  8 Zona Rak & Kompartemen
                </span>
              </div>

              {/* Foto Acuan Lemari Studio */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Layers size={16} color="#1E3A8A" />
                    <span>Foto Acuan Lemari Studio & Penempatan Rak</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Klik gambar untuk memperbesar</span>
                </div>

                <div 
                  style={{ 
                    position: 'relative', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    maxHeight: '260px',
                    cursor: 'pointer',
                    background: '#0F172A'
                  }}
                  onClick={() => setSelectedPhoto('/storage-photos/storage-layout-9.jpeg')}
                >
                  <img 
                    src="/storage-photos/storage-layout-9.jpeg" 
                    alt="Tata Letak Lemari Studio" 
                    style={{ width: '100%', height: '260px', objectFit: 'cover' }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Maximize2 size={12} />
                    <span>Perbesar Foto</span>
                  </div>
                </div>
              </div>

              {/* Grid 8 Rak Lemari Studio */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
                {STUDIO_STORAGE_SYSTEM.lemariStudio.daftarRak.map((rak) => (
                  <div 
                    key={rak.rak}
                    className="card"
                    style={{ 
                      padding: '1.15rem',
                      borderLeft: rak.rak === 6 ? '4px solid #1E3A8A' : '4px solid #64748B',
                      background: rak.rak === 6 ? '#EFF6FF' : '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: rak.rak === 6 ? '#1E3A8A' : '#0F172A' }}>
                        {rak.namaRak}
                      </span>
                      <span className="badge badge-blue" style={{ fontSize: '0.675rem' }}>
                        {rak.kategori}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.45, margin: 0 }}>
                      {rak.isi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: REKAM CAS BATERAI (SOP ATURAN #1 - WAKTU CAS & DICABUT)
          ========================================================================= */}
          {activeTab === 'batteryTracker' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)', 
                  border: '1px solid #FDE68A', 
                  borderRadius: '16px', 
                  padding: '1.15rem 1.35rem' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#B45309', fontWeight: 800, fontSize: '0.725rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <Zap size={15} />
                  <span>SOP Aturan #1 // Rekam Waktu Mulai Cas & Kapan Dicabut</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350F', margin: '0.2rem 0 0' }}>
                  Log Waktu Pengisian Daya Baterai Studio
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#92400E', margin: '0.25rem 0 0', lineHeight: 1.45 }}>
                  Wajib dicatat setiap kali mengecas baterai LP-E17, LP-E10, maupun NP-F Godox agar tidak terjadi pengisian berlebih (*overcharge*) yang merusak sel baterai.
                </p>
              </div>

              {/* Form Mulai Cas Baterai Baru */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Plus size={16} color="#1E3A8A" />
                  <span>Catat Baterai yang Mulai Dicas Sekarang</span>
                </h4>

                <form onSubmit={handleStartChargeSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label">Pilih Baterai yang Dicas</label>
                      <select 
                        className="form-select"
                        value={inputBatteryName}
                        onChange={(e) => setInputBatteryName(e.target.value)}
                        required
                      >
                        <option value="Baterai Takara #1 (LP-E17)">Baterai Takara #1 (LP-E17 - Box Biru)</option>
                        <option value="Baterai Takara #2 (LP-E17)">Baterai Takara #2 (LP-E17 - Box Biru)</option>
                        <option value="Baterai Canon LP-E10">Baterai Canon LP-E10 (1500D - Box Biru)</option>
                        <option value="Baterai NP-F980 #1 (Lighting)">Baterai NP-F980 #1 (Lighting - Rak 5)</option>
                        <option value="Baterai NP-F980 #2 (Lighting)">Baterai NP-F980 #2 (Lighting - Rak 5)</option>
                        <option value="Baterai NP-F570 #1 (Lighting)">Baterai NP-F570 #1 (Lighting - Rak 5)</option>
                        <option value="Baterai NP-F570 #2 (Lighting)">Baterai NP-F570 #2 (Lighting - Rak 5)</option>
                        <option value="Baterai NP-F570 #3 (Lighting)">Baterai NP-F570 #3 (Lighting - Rak 5)</option>
                        <option value="Baterai NP-F570 #4 (Lighting)">Baterai NP-F570 #4 (Lighting - Rak 5)</option>
                        <option value="Baterai Li-ion20">Baterai Li-ion20 (Rak 5)</option>
                        <option value="Charging Case Hollyland Lark M2">Case Mic Hollyland Lark M2 (Rak 5)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label">Charger yang Digunakan</label>
                      <select 
                        className="form-select"
                        value={inputChargerName}
                        onChange={(e) => setInputChargerName(e.target.value)}
                        required
                      >
                        <option value="Charger Canon LC-E17E (EQ-33)">Charger Original Canon LC-E17E (Box Biru)</option>
                        <option value="Charger Canon LC-E10E (EQ-34)">Charger Original Canon LC-E10E (Box Biru)</option>
                        <option value="Charger Power Fast DS-LPE17 (EQ-32)">Charger Power Fast DS-LPE17 + USB (Box Biru)</option>
                        <option value="Charger Sony Seri NP-F">Charger Khusus Baterai Seri NP-F Godox</option>
                        <option value="Kabel USB-C Studio">Kabel USB-C Charging Langsung</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label">Nama Petugas / Kru</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="Nama kru yang mencolok charger..."
                        value={inputPetugas}
                        onChange={(e) => setInputPetugas(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label">Lokasi Colokan / Stopkontak</label>
                      <input 
                        type="text"
                        className="form-input"
                        value={inputLokasi}
                        onChange={(e) => setInputLokasi(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: '0.85rem' }}>
                    <label className="form-label">Catatan Tambahan (Opsional)</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Contoh: Baterai habis total setelah syuting, dicas untuk kegiatan besok"
                      value={inputCatatan}
                      onChange={(e) => setInputCatatan(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Zap size={14} />
                      <span>Mulai Rekam Waktu Cas Sekarang</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Rekaman Cas Baterai */}
              <div className="card" style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Clock size={16} color="#1E3A8A" />
                  <span>Daftar Baterai yang Sedang Dicas & Riwayat Pencabutan</span>
                </h4>

                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Baterai</th>
                        <th>Charger</th>
                        <th>Mulai Cas</th>
                        <th>Dicabut / Selesai</th>
                        <th>Durasi</th>
                        <th>Petugas</th>
                        <th style={{ textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batteryCharges.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '1.5rem', color: '#64748B' }}>
                            Belum ada riwayat pengecasan baterai yang tercatat.
                          </td>
                        </tr>
                      ) : (
                        batteryCharges.map((chg) => {
                          const isCharging = chg.status === 'Sedang Cas';
                          const durasiText = calculateDuration(chg.waktuMulai, chg.waktuSelesai);
                          return (
                            <tr key={chg.id} style={{ background: isCharging ? '#FEF3C7' : '#FFFFFF' }}>
                              <td>
                                {isCharging ? (
                                  <span className="badge badge-amber" style={{ animation: 'pulse 2s infinite' }}>
                                    ⚡ Sedang Cas
                                  </span>
                                ) : (
                                  <span className="badge badge-emerald">
                                    ✓ Selesai Dicabut
                                  </span>
                                )}
                              </td>
                              <td style={{ fontWeight: 700, color: '#0F172A' }}>{chg.batteryName}</td>
                              <td style={{ fontSize: '0.8rem', color: '#475569' }}>{chg.chargerName}</td>
                              <td style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)' }}>
                                {new Date(chg.waktuMulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                              </td>
                              <td style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)' }}>
                                {chg.waktuSelesai ? (
                                  `${new Date(chg.waktuSelesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
                                ) : (
                                  <span style={{ color: '#B45309', fontWeight: 600 }}>Masih Colok</span>
                                )}
                              </td>
                              <td style={{ fontWeight: 700, color: isCharging ? '#B45309' : '#15803D', fontFamily: 'var(--font-mono)' }}>
                                {durasiText}
                              </td>
                              <td style={{ fontSize: '0.8rem' }}>{chg.petugas}</td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                                  {isCharging && (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem', background: '#15803D', borderColor: '#166534' }}
                                      onClick={() => stopBatteryCharge(chg.id, { persentase: 100 })}
                                      title="Tandai baterai sudah dicabut dari stopkontak"
                                    >
                                      <CheckCircle2 size={13} />
                                      <span>Cabut Charger</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '0.25rem 0.45rem', color: '#DC2626' }}
                                    onClick={() => deleteBatteryCharge(chg.id)}
                                    title="Hapus riwayat cas"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div 
          className="modal-footer" 
          style={{ 
            background: '#F8FAFC', 
            borderTop: '1px solid #E2E8F0',
            padding: '1rem 1.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.775rem', color: '#64748B' }}>
            Creative Corner Studio System • Lemari & Box Storage Standard
          </div>
          <button 
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onClose}
          >
            Tutup Panduan
          </button>
        </div>
      </div>

      {/* POPUP LIGHTBOX FOTO */}
      {selectedPhoto && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 120,
            padding: '1.5rem'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div style={{ maxWidth: '1000px', width: '100%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem'
              }}
            >
              <X size={20} />
              <span>Tutup</span>
            </button>
            <img 
              src={selectedPhoto} 
              alt="Detail Tata Letak Studio" 
              style={{ width: '100%', maxHeight: '82vh', objectFit: 'contain', borderRadius: '12px' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

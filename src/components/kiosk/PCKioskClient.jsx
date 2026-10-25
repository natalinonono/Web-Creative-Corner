import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
  Monitor, 
  Lock, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Layers, 
  Play, 
  ShieldAlert,
  FastForward,
  Maximize,
  Minimize
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const PCKioskClient = () => {
  const { 
    pcClients, 
    startPCSession, 
    extendPCSession, 
    simulatePCTimeout, 
    endPCSession, 
    creativeTasks, 
    members,
    currentUser
  } = useStudio();

  // Selected PC tab (otomatis dari parameter URL ?pc=PC-01 jika mode startup)
  const [selectedPCId, setSelectedPCId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pcParam = params.get('pc') || params.get('kiosk');
      if (pcParam && pcParam.toUpperCase().startsWith('PC-')) {
        return pcParam.toUpperCase();
      }
    }
    return 'PC-01';
  });

  const isUnitLockedByUrl = typeof window !== 'undefined' && Boolean(new URLSearchParams(window.location.search).get('pc'));

  // Form State untuk Sesi Masuk (Bersih dari data dummy)
  const [namaSiswa, setNamaSiswa] = useState(() => currentUser?.nama || '');
  const [kelas, setKelas] = useState(() => currentUser?.kelas || '');
  const [keperluan, setKeperluan] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [durasiMenit, setDurasiMenit] = useState(60);

  // Modal konfirmasi selesai sesi
  const [endSessionModalOpen, setEndSessionModalOpen] = useState(false);

  // Modal peringatan waktu habis otomatis
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningDismissedForId, setWarningDismissedForId] = useState(null);

  // State Fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Ambil data PC yang sedang dilihat
  const currentPC = pcClients.find((pc) => pc.id === selectedPCId) || pcClients[0];
  const isActive = currentPC.status === 'Aktif' && currentPC.penggunaAktif;

  // Window beforeunload lock protection simulation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isActive) {
        e.preventDefault();
        e.returnValue = 'Sesi Klien PC Creative Corner sedang aktif. Meninggalkan halaman akan mengunci workstation!';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isActive]);

  // Otomatis deteksi sisa durasi <= 5 menit (300 detik) untuk memunculkan modal peringatan
  useEffect(() => {
    if (isActive) {
      const sisaDetik = currentPC.penggunaAktif.sisaDetik;
      if (sisaDetik > 0 && sisaDetik <= 300 && warningDismissedForId !== selectedPCId) {
        setShowWarningModal(true);
      }
    }
  }, [isActive, currentPC?.penggunaAktif?.sisaDetik, warningDismissedForId, selectedPCId]);

  // Handle pergantian siswa pada form masuk jika ada daftar anggota
  const handleMemberSelect = (e) => {
    const selectedVal = e.target.value;
    if (selectedVal === 'MANUAL') {
      setNamaSiswa('');
      setKelas('');
    } else {
      const foundMember = members.find((m) => m.nama === selectedVal);
      if (foundMember) {
        setNamaSiswa(foundMember.nama);
        setKelas(foundMember.kelas);
      } else {
        setNamaSiswa(selectedVal);
      }
    }
  };

  // Tugas aktif yang belum selesai untuk dropdown keperluan dinamis
  const activeTasks = creativeTasks.filter(
    (t) => t.status === 'Belum Dimulai' || t.status === 'Dalam Proses'
  );

  const handleStartSession = (e) => {
    e.preventDefault();
    if (!namaSiswa.trim()) {
      alert('Nama anggota / siswa wajib diisi.');
      return;
    }

    const finalKeperluan = keperluan.trim() || 'Editing Video & Produksi Kreatif';

    startPCSession({
      pcId: selectedPCId,
      namaSiswa,
      kelas: kelas || 'Umum',
      keperluan: finalKeperluan,
      tugasTerkaitId: selectedTaskId || null,
      durasiMenit: Number(durasiMenit)
    });

    setWarningDismissedForId(null);
  };

  // Format detik menjadi MM:SS
  const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Hitung persentase progress
  const totalDetik = (currentPC.penggunaAktif?.durasiMenit || 60) * 60;
  const sisaDetik = currentPC.penggunaAktif?.sisaDetik || 0;
  const percentRemaining = Math.max(0, Math.min(100, (sisaDetik / totalDetik) * 100));
  const isNearTimeout = sisaDetik <= 300;

  return (
    <div className="kiosk-canvas">
      {/* Tombol Toggle Layar Penuh (Fullscreen / F11) */}
      <button
        type="button"
        onClick={toggleFullscreen}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#F8FAFC',
          padding: '0.45rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease'
        }}
        title="Buka / Tutup Layar Penuh (F11)"
      >
        {isFullscreen ? <Minimize size={14} color="#60A5FA" /> : <Maximize size={14} color="#60A5FA" />}
        <span>{isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh (F11)'}</span>
      </button>

      {/* Top Kiosk Header Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <img 
          src="/logo-creative-corner.png" 
          alt="Creative Corner" 
          style={{ 
            width: '68px', 
            height: '68px', 
            objectFit: 'contain', 
            marginBottom: '0.75rem', 
            background: '#FFFFFF', 
            padding: '6px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)' 
          }} 
        />
        <div className="kiosk-badge-secure">
          <Lock size={14} />
          <span>Klien PC Creative Corner • Mode Kiosk Terproteksi</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Workstation Editing Studio Creative Corner
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.875rem', maxWidth: '600px' }}>
          Sistem pembatasan waktu operasional PC studio terpadu dengan perlindungan jendela dan integrasi tugas kreatif otomatis.
        </p>

        {/* Pemilih Unit PC Studio atau Indikator Terkunci Startup */}
        {isUnitLockedByUrl ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(30, 58, 138, 0.85)',
            border: '2px solid #60A5FA',
            padding: '0.6rem 1.5rem',
            borderRadius: '9999px',
            marginTop: '1.25rem',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
          }}>
            <Lock size={18} color="#93C5FD" />
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.925rem', letterSpacing: '0.02em' }}>
              Workstation Ini Terkunci Otomatis: <span style={{ color: '#93C5FD' }}>{selectedPCId}</span>
            </span>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '6px',
            borderRadius: '12px',
            marginTop: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
          {pcClients.map((pc) => {
            const isPcActive = pc.status === 'Aktif';
            const isSelected = pc.id === selectedPCId;

            return (
              <button
                key={pc.id}
                type="button"
                onClick={() => {
                  setSelectedPCId(pc.id);
                  setShowWarningModal(false);
                }}
                id={`btn-select-${pc.id}`}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #60A5FA' : '1px solid transparent',
                  background: isSelected ? '#1E3A8A' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <Monitor size={15} />
                <span>{pc.id}</span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isPcActive ? '#10B981' : '#94A3B8',
                  boxShadow: isPcActive ? '0 0 8px #10B981' : 'none'
                }}></span>
              </button>
            );
          })}
        </div>
        )}
      </div>

      {/* KIOSK CARD: LAYAR KUNCI ATAU SESI AKTIF */}
      {!isActive ? (
        /* =======================================================
           1. FORMULIR SESI MASUK (TERKUNCI DI LAYAR UTAMA)
        ======================================================= */
        <div className="kiosk-card">
          <div className="kiosk-card-header">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              background: '#FFFFFF',
              margin: '0 auto 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)'
            }}>
              <img 
                src="/logo-creative-corner.png" 
                alt="Creative Corner Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              Formulir Sesi Masuk {currentPC.id}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#BFDBFE', marginTop: '0.25rem' }}>
              Workstation ini terkunci. Lengkapi identitas & pilih durasi pakai untuk membuka layar.
            </p>
          </div>

          <div className="kiosk-card-body">
            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.775rem',
              color: '#1E3A8A',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Layers size={16} />
              <span>
                <strong>Spesifikasi {currentPC.id}:</strong> {currentPC.spesifikasi}
              </span>
            </div>

            <form onSubmit={handleStartSession}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Nama Anggota / Siswa *</label>
                  {members.length > 0 ? (
                    <div>
                      <select
                        className="form-select"
                        value={namaSiswa}
                        onChange={handleMemberSelect}
                        style={{ marginBottom: '0.4rem' }}
                      >
                        <option value="">-- Pilih dari Anggota Terdaftar --</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.nama}>
                            {m.nama} ({m.kelas})
                          </option>
                        ))}
                        <option value="MANUAL">+ Ketik Nama Manual...</option>
                      </select>

                      {(!members.some((m) => m.nama === namaSiswa) || namaSiswa === '') && (
                        <input
                          type="text"
                          className="form-input"
                          value={namaSiswa}
                          onChange={(e) => setNamaSiswa(e.target.value)}
                          placeholder="Ketikkan nama siswa..."
                          required
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="form-input"
                      value={namaSiswa}
                      onChange={(e) => setNamaSiswa(e.target.value)}
                      placeholder="Ketikkan nama siswa..."
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="form-label">Kelas *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Contoh: XII Multimedia 1"
                    required
                  />
                </div>
              </div>

              {/* KEPERLUAN: DROPDOWN DINAMIS (JIKA ADA TUGAS) ATAU INPUT TEKS */}
              <div className="form-group">
                <label className="form-label">
                  Pilih Keperluan Proyek Kreatif *
                </label>
                <select
                  className="form-select"
                  value={selectedTaskId}
                  onChange={(e) => {
                    const tId = e.target.value;
                    setSelectedTaskId(tId);
                    const taskObj = creativeTasks.find((t) => t.id === tId);
                    if (taskObj) {
                      setKeperluan(taskObj.judul);
                    } else if (tId === 'UMUM-1') {
                      setKeperluan('Editing Video Mandiri / Teaser');
                    } else if (tId === 'UMUM-2') {
                      setKeperluan('Desain Grafis / Poster Mading');
                    } else if (tId === 'UMUM-3') {
                      setKeperluan('Color Grading & Audio Mastering');
                    } else if (tId === 'UMUM-4') {
                      setKeperluan('Render / Export Project Kreatif');
                    } else if (tId === 'MANUAL') {
                      setKeperluan('');
                    }
                  }}
                  id="select-kiosk-task"
                  required
                >
                  <option value="">-- Pilih Keperluan / Proyek --</option>
                  {activeTasks.length > 0 && (
                    <optgroup label="Tugas Kreatif Aktif (State-Machine Trigger 3)">
                      {activeTasks.map((t) => (
                        <option key={t.id} value={t.id}>
                          [{t.kategori}] {t.judul} (PJ: {t.penanggungJawabNama})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Keperluan Standar Studio">
                    <option value="UMUM-1">Editing Video Mandiri / Teaser</option>
                    <option value="UMUM-2">Desain Grafis / Poster Mading</option>
                    <option value="UMUM-3">Color Grading & Audio Mastering</option>
                    <option value="UMUM-4">Render / Export Project Kreatif</option>
                    <option value="MANUAL">+ Tulis Keperluan Lainnya...</option>
                  </optgroup>
                </select>

                {(selectedTaskId === 'MANUAL' || (!selectedTaskId && activeTasks.length === 0)) && (
                  <input
                    type="text"
                    className="form-input"
                    style={{ marginTop: '0.5rem' }}
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                    placeholder="Ketikkan judul proyek atau kebutuhan editing Anda..."
                    required
                  />
                )}
                
                <div className="form-hint">
                  {selectedTaskId && selectedTaskId.startsWith('TSK') ? (
                    <span>Saat sesi dimulai, tugas ini otomatis ditandai <strong>"Dalam Proses"</strong> dan dihubungkan ke {currentPC.id}.</span>
                  ) : (
                    <span>Keperluan akan tercatat resmi pada Arsip Log Aktivitas Admin.</span>
                  )}
                </div>
              </div>

              {/* ESTIMASI DURASI PAKAI DENGAN PILIHAN MANUAL */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Estimasi Durasi Pakai (Menit) *</label>
                  <span style={{ fontSize: '0.75rem', color: '#1E3A8A', fontWeight: 700 }}>
                    Dipilih: {durasiMenit} Menit
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {[30, 60, 90, 120].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      className={`btn ${Number(durasiMenit) === dur ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.55rem 0.25rem', fontSize: '0.825rem' }}
                      onClick={() => setDurasiMenit(dur)}
                    >
                      {dur} Menit
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`btn ${![30, 60, 90, 120].includes(Number(durasiMenit)) ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.55rem 0.25rem', fontSize: '0.825rem' }}
                    onClick={() => {
                      if ([30, 60, 90, 120].includes(Number(durasiMenit))) {
                        setDurasiMenit(45);
                      }
                    }}
                  >
                    + Tulis Manual
                  </button>
                </div>

                {/* Input Manual Durasi */}
                {(![30, 60, 90, 120].includes(Number(durasiMenit))) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      className="form-input"
                      value={durasiMenit}
                      onChange={(e) => setDurasiMenit(Math.max(1, Number(e.target.value)))}
                      placeholder="Masukkan menit durasi pemakaian (misal: 45, 150)..."
                      style={{ maxWidth: '240px' }}
                      required
                    />
                    <span style={{ fontSize: '0.8rem', color: '#475569' }}>Menit pemakaian workstation</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.75rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', gap: '0.75rem' }}
                  id="btn-start-kiosk-session"
                >
                  <Play size={18} />
                  <span>Buka Layar & Mulai Sesi Editing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* =======================================================
           2. SESI AKTIF & JENDELA TERKUNCI (LIVE WORKSTATION)
        ======================================================= */
        <div className="kiosk-card" style={{ maxWidth: '640px' }}>
          <div className="kiosk-card-header" style={{ background: '#0F172A', borderBottom: '2px solid #1E3A8A' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 10px #10B981'
                }}></span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
                  SESI AKTIF: {currentPC.id}
                </span>
              </div>
              <span style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#93C5FD'
              }}>
                Workstation Terproteksi
              </span>
            </div>
          </div>

          <div className="kiosk-card-body" style={{ textAlign: 'center' }}>
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              fontSize: '0.8rem',
              color: '#92400E',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textAlign: 'left'
            }}>
              <ShieldAlert size={20} color="#D97706" style={{ flexShrink: 0 }} />
              <div>
                <strong>Perhatian:</strong> Jendela peramban terproteksi selama sesi aktif. Anda tidak dapat menutup tab sebelum mengakhiri sesi secara resmi.
              </div>
            </div>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '0.75rem',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Pengguna Workstation:</span>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
                  {currentPC.penggunaAktif.nama}
                </div>
                <div style={{ color: '#475569', fontSize: '0.8rem' }}>{currentPC.penggunaAktif.kelas}</div>
              </div>

              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Proyek Kreatif Terhubung:</span>
                <div style={{ fontWeight: 700, color: '#1E3A8A' }}>
                  {currentPC.penggunaAktif.keperluan}
                </div>
                <div style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>
                  ● Status: Sesi Berjalan
                </div>
              </div>
            </div>

            {/* LIVE COUNTDOWN TIMER */}
            <div className="countdown-container">
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isNearTimeout ? '#E11D48' : '#1E3A8A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {isNearTimeout ? 'Sisa Waktu Pemakaian Kritis!' : 'Sisa Waktu Sesi Editing'}
              </div>

              <div className={`countdown-digits ${isNearTimeout ? 'warning' : ''}`} id="kiosk-live-timer">
                {formatTime(sisaDetik)}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                Menit : Detik (Dimulai pukul {currentPC.penggunaAktif.waktuMulai})
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${isNearTimeout ? 'warning' : ''}`}
                  style={{ width: `${percentRemaining}%` }}
                ></div>
              </div>
            </div>

            {/* Tombol Aksi Kontrol Sesi */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginTop: '1.5rem',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '1.25rem'
            }}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, borderColor: '#FDE68A', background: '#FFFBEB', color: '#B45309' }}
                  onClick={() => simulatePCTimeout(selectedPCId)}
                  id="btn-simulate-timeout"
                  title="Setel sisa waktu menjadi 4 menit untuk menguji pop-up peringatan waktu habis otomatis"
                >
                  <FastForward size={14} />
                  <span>Simulasi Waktu Hampir Habis (4 Menit)</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => extendPCSession(selectedPCId, 15)}
                >
                  <span>+15 Menit</span>
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#0F172A', borderColor: '#0F172A', width: '100%', padding: '0.75rem' }}
                onClick={() => setEndSessionModalOpen(true)}
                id="btn-end-session"
              >
                <Lock size={16} />
                <span>Selesai Pakai & Kunci Kembali PC</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERINGATAN WAKTU HAMPIR HABIS */}
      {showWarningModal && isActive && (
        <Modal
          isOpen={showWarningModal}
          onClose={() => {
            setShowWarningModal(false);
            setWarningDismissedForId(selectedPCId);
          }}
          title="Peringatan Waktu Pemakaian Hampir Habis"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningDismissedForId(selectedPCId);
                }}
              >
                Tutup Notifikasi
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ color: '#E11D48', borderColor: '#FECDD3' }}
                onClick={() => {
                  setShowWarningModal(false);
                  endPCSession(selectedPCId);
                }}
              >
                Akhiri Sesi Sekarang
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  extendPCSession(selectedPCId, 15);
                  setShowWarningModal(false);
                }}
                id="btn-extend-time-15"
              >
                Perpanjang Waktu (+15 Menit)
              </button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FFF1F2',
              color: '#E11D48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Sisa Durasi Kurang dari 5 Menit!
            </h3>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
              Halo <strong>{currentPC.penggunaAktif.nama}</strong>, durasi pemakaian Anda pada <strong>{currentPC.id}</strong> tersisa <strong>{formatTime(sisaDetik)}</strong>. Harap simpan file editing Anda atau pilih perpanjangan durasi.
            </p>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontSize: '0.825rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Pilihan Perpanjangan Waktu:</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      extendPCSession(selectedPCId, 15);
                      setShowWarningModal(false);
                    }}
                  >
                    +15 Menit
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      extendPCSession(selectedPCId, 30);
                      setShowWarningModal(false);
                    }}
                  >
                    +30 Menit
                  </button>
                </div>
              </div>

              {/* Opsi Tambah Manual Durasi Kustom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', color: '#475569' }}>Atau ketik durasi kustom:</span>
                <input
                  type="number"
                  min="1"
                  max="240"
                  placeholder="Menit..."
                  id="custom-extension-input"
                  style={{ width: '90px', padding: '0.25rem 0.5rem', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const inputEl = document.getElementById('custom-extension-input');
                    const val = Number(inputEl?.value);
                    if (val > 0) {
                      extendPCSession(selectedPCId, val);
                      setShowWarningModal(false);
                    } else {
                      alert('Masukkan jumlah menit perpanjangan yang valid.');
                    }
                  }}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL KONFIRMASI PENYELESAIAN SESI */}
      {endSessionModalOpen && (
        <Modal
          isOpen={endSessionModalOpen}
          onClose={() => setEndSessionModalOpen(false)}
          title="Konfirmasi Selesai Pakai Workstation"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEndSessionModalOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#0F172A' }}
                onClick={() => {
                  setEndSessionModalOpen(false);
                  endPCSession(selectedPCId);
                }}
                id="btn-confirm-end-session"
              >
                <Lock size={15} />
                <span>Ya, Selesaikan & Kunci PC</span>
              </button>
            </>
          }
        >
          <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '0.75rem' }}>
              Apakah Anda telah menyimpan seluruh file proyek di <strong>{currentPC.id}</strong> dan siap untuk mengunci kembali layar workstation ini?
            </p>
            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.8rem',
              color: '#1E3A8A'
            }}>
              • Riwayat sesi ini akan otomatis dicatat ke dalam <strong>Arsip Log Aktivitas Admin</strong>.<br />
              • Kaitan tugas kreatif akan dilepas dan PC dikembalikan ke mode layar kunci siap pakai.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

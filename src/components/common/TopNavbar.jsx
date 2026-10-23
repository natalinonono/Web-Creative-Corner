import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
  Camera, 
  Monitor, 
  ShieldCheck, 
  User, 
  RotateCcw, 
  Clock, 
  LogIn,
  LogOut,
  KeyRound,
  CheckCircle2,
  Globe,
  Sparkles,
  Users
} from 'lucide-react';
import { Modal } from './Modal';

export const TopNavbar = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    switchOrLoginUser, 
    logoutUser,
    clearAllData,
    pcClients,
    isAdminEmail,
    ADMIN_KEYWORD
  } = useStudio();

  // Clock state
  const [timeStr, setTimeStr] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Form Login Akun
  const [inputEmail, setInputEmail] = useState('');
  const [inputNama, setInputNama] = useState('');
  const [inputKelas, setInputKelas] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
      };
      setTimeStr(new Intl.DateTimeFormat('id-ID', options).format(now) + ' WIB');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!inputEmail.trim()) {
      alert('Silakan masukkan alamat email.');
      return;
    }

    switchOrLoginUser({
      email: inputEmail.trim(),
      nama: inputNama.trim() || inputEmail.split('@')[0],
      kelas: inputKelas.trim() || 'Kelas Anggota'
    });

    setIsLoginModalOpen(false);
    setInputEmail('');
    setInputNama('');
    setInputKelas('');
  };

  const handleQuickLogin = (email, nama, kelas) => {
    switchOrLoginUser({ email, nama, kelas });
    setIsLoginModalOpen(false);
    setInputEmail('');
    setInputNama('');
    setInputKelas('');
  };

  const activePCs = pcClients.filter((p) => p.status === 'Aktif').length;
  const isUserAdmin = currentUser && isAdminEmail(currentUser.email);

  return (
    <header className="top-navbar">
      {/* Brand & Logo */}
      <div className="brand-section">
        <div style={{
          width: '42px',
          height: '42px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
        }}>
          <img 
            src="/logo-creative-corner.png" 
            alt="Creative Corner Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
        <div>
          <div className="brand-title">Creative Corner</div>
          <div className="brand-subtitle">Sistem Manajemen Studio Terpadu</div>
        </div>
      </div>

      {/* Role / View Switcher (Dibagi 2 Versi Utama + Kiosk & Admin) */}
      <nav className="role-switcher-container" aria-label="Pengalih Tampilan Antarmuka">
        {/* VERSI 1: PUBLIK / BUKAN ANGGOTA (TANPA LOGIN) */}
        <button
          id="btn-switch-public"
          className={`role-switcher-btn ${currentRole === 'public' ? 'active' : ''}`}
          onClick={() => setCurrentRole('public')}
          title="Beralih ke Versi Publik (Tanpa Email) untuk Bukan Anggota yang meminjam alat/ruang"
        >
          <Globe size={15} />
          <span>Versi Publik (Tanpa Login)</span>
        </button>

        {/* VERSI 2: ANGGOTA CREATIVE CORNER (PERLU LOGIN) */}
        <button
          id="btn-switch-member"
          className={`role-switcher-btn ${currentRole === 'member' ? 'active' : ''}`}
          onClick={() => {
            if (!currentUser) {
              setIsLoginModalOpen(true);
            } else {
              setCurrentRole('member');
            }
          }}
          title="Beralih ke Portal Anggota Creative Corner (Perlu Login Email)"
        >
          <Users size={15} />
          <span>Portal Anggota Tim</span>
        </button>

        {/* KLIEN PC KIOSK STUDIO */}
        <button
          id="btn-switch-kiosk"
          className={`role-switcher-btn ${currentRole === 'kiosk' ? 'active' : ''}`}
          onClick={() => setCurrentRole('kiosk')}
          title="Beralih ke Klien PC Creative Corner (Mode Kiosk)"
        >
          <Monitor size={15} />
          <span>Klien PC Kiosk</span>
          {activePCs > 0 && (
            <span style={{
              background: '#10B981',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              padding: '1px 6px',
              borderRadius: '9999px',
              marginLeft: '4px'
            }}>
              {activePCs} Aktif
            </span>
          )}
        </button>

        {/* PORTAL PENGELOLA / ADMIN */}
        <button
          id="btn-switch-admin"
          className={`role-switcher-btn ${currentRole === 'admin' ? 'active' : ''}`}
          onClick={() => {
            if (!currentUser || !isUserAdmin) {
              setIsLoginModalOpen(true);
            } else {
              setCurrentRole('admin');
            }
          }}
          title="Beralih ke Portal Pengelola / Admin (Khusus Email mengandung 'creativecorner')"
        >
          <ShieldCheck size={15} />
          <span>Portal Pengelola / Admin</span>
        </button>
      </nav>

      {/* Top Navbar Right Tools & Login */}
      <div className="top-navbar-right">
        {/* Status Akun & Tombol Ganti / Masuk Akun */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.785rem'
              }}
              title="Klik untuk mengganti akun pengguna"
            >
              {isUserAdmin ? (
                <ShieldCheck size={15} color="#93C5FD" />
              ) : (
                <User size={15} color="#A7F3D0" />
              )}
              <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.email}
              </span>
              <span style={{
                fontSize: '0.675rem',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontWeight: 700,
                background: isUserAdmin ? '#1E3A8A' : '#059669',
                color: '#FFFFFF'
              }}>
                {isUserAdmin ? 'Admin' : 'Anggota'}
              </span>
            </button>

            <button
              type="button"
              onClick={logoutUser}
              className="btn btn-secondary btn-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#FECACA',
                padding: '0.35rem 0.65rem'
              }}
              title="Keluar dari sesi login (Kembali ke Versi Publik)"
            >
              <LogOut size={13} />
              <span style={{ fontSize: '0.725rem' }}>Keluar</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{
              background: '#2563EB',
              borderColor: '#3B82F6',
              padding: '0.35rem 0.85rem',
              fontSize: '0.785rem'
            }}
          >
            <LogIn size={14} />
            <span>Login Akun Anggota / Admin</span>
          </button>
        )}

        {/* Live Clock */}
        <div className="live-clock-badge" title="Waktu Nyata Server Creative Corner (WIB)">
          <Clock size={14} />
          <span>{timeStr || '10:45:00 WIB'}</span>
        </div>

        {/* Kosongkan Seluruh Data (Zero Data Reset) */}
        <button
          className="btn btn-secondary btn-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            padding: '0.35rem 0.75rem'
          }}
          onClick={clearAllData}
          title="Kosongkan seluruh data studio agar admin dapat mengisi dari awal"
        >
          <RotateCcw size={14} />
          <span style={{ fontSize: '0.75rem' }}>Kosongkan Data</span>
        </button>
      </div>

      {/* MODAL GANTI / MASUK AKUN EMAIL */}
      {isLoginModalOpen && (
        <Modal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          title="Masuk Akun Creative Corner (Versi Login)"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setIsLoginModalOpen(false)}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleLoginSubmit}>
                <LogIn size={15} />
                <span>Masuk Sekarang</span>
              </button>
            </>
          }
        >
          <form onSubmit={handleLoginSubmit}>
            {/* Banner Aturan Email Admin */}
            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.825rem',
              color: '#1E3A8A'
            }}>
              <div style={{ fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <KeyRound size={16} />
                <span>Aturan Hak Akses Akun:</span>
              </div>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: '1.5' }}>
                <li>
                  <strong>Akun Pengelola / Admin:</strong> Hanya bisa diakses dengan email yang mengandung kata <code>creativecorner</code> (contoh: <code>admin1.creativecorner@gmail.com</code>).
                </li>
                <li>
                  <strong>Akun Anggota Creative Corner:</strong> Masuk dengan email pribadi / sekolah (contoh: <code>siswa@gmail.com</code> atau <code>member@sch.id</code>).
                </li>
                <li>
                  <strong>Bukan Anggota Studio:</strong> Tidak perlu login! Silakan gunakan <em>Versi Publik (Tanpa Login)</em> untuk meminjam alat.
                </li>
              </ul>
            </div>

            {/* Quick Demo Login Presets */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.775rem', color: '#64748B' }}>
                Tombol Cepat Pengujian:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', justifyContent: 'center', background: '#F8FAFC' }}
                  onClick={() => handleQuickLogin('admin1.creativecorner@gmail.com', 'Admin Creative Corner', 'Pengelola Studio')}
                >
                  <ShieldCheck size={14} color="#1E3A8A" />
                  <span>Admin (admin1.creativecorner@...)</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', justifyContent: 'center', background: '#F8FAFC' }}
                  onClick={() => handleQuickLogin('anggota@creativecorner.sch.id', 'Siswa Anggota', 'XII Multimedia 1')}
                >
                  <User size={14} color="#059669" />
                  <span>Anggota (anggota@...)</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Email Pengguna *</label>
              <input
                type="email"
                className="form-input"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="Contoh: admin1.creativecorner@gmail.com"
                required
              />
              <div className="form-hint">
                Jika email mengandung kata <code>creativecorner</code>, Anda otomatis masuk sebagai Admin.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nama Lengkap (Opsional)</label>
              <input
                type="text"
                className="form-input"
                value={inputNama}
                onChange={(e) => setInputNama(e.target.value)}
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kelas / Jabatan (Opsional)</label>
              <input
                type="text"
                className="form-input"
                value={inputKelas}
                onChange={(e) => setInputKelas(e.target.value)}
                placeholder="Contoh: XII Multimedia 2 / Koordinator Studio"
              />
            </div>
          </form>
        </Modal>
      )}
    </header>
  );
};

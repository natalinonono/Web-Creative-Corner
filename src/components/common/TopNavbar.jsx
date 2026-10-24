import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
  FileText,
  Camera, 
  Search,
  Monitor, 
  ShieldCheck, 
  User, 
  LogIn,
  LogOut,
  KeyRound,
  CheckCircle2,
  Users,
  ChevronRight
} from 'lucide-react';
import { Modal } from './Modal';

export const TopNavbar = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    publicTab,
    setPublicTab,
    currentUser, 
    switchOrLoginUser, 
    logoutUser,
    pcClients,
    isAdminEmail
  } = useStudio();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState('member'); // 'member' | 'admin'

  // Form State Login
  const [inputEmail, setInputEmail] = useState('');
  const [inputNama, setInputNama] = useState('');
  const [inputDivisi, setInputDivisi] = useState('Editor');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = inputEmail.trim();
    if (!email) {
      alert('Silakan masukkan alamat email Anda.');
      return;
    }

    if (loginType === 'admin') {
      if (!isAdminEmail(email)) {
        alert("Akses Admin Ditolak: Email administrator wajib mengandung kata 'creativecorner' (contoh: creativecorner@gmail.com atau admin1.creativecorner@gmail.com).");
        return;
      }
      switchOrLoginUser({
        email,
        nama: inputNama.trim() || 'Administrator Studio',
        kelas: 'Pengelola Studio'
      });
      setCurrentRole('admin');
    } else {
      switchOrLoginUser({
        email,
        nama: inputNama.trim() || email.split('@')[0],
        kelas: inputDivisi || 'Anggota Tim Studio'
      });
      setCurrentRole('member');
    }

    setIsLoginModalOpen(false);
    setInputEmail('');
    setInputNama('');
  };

  const isUserAdmin = currentUser && isAdminEmail(currentUser.email);
  const activePCs = pcClients.filter((p) => p.status === 'Aktif').length;

  return (
    <header className="top-navbar">
      {/* Brand & Logo */}
      <div 
        className="brand-section" 
        onClick={() => { setCurrentRole('public'); setPublicTab('form'); }}
        style={{ cursor: 'pointer' }}
        title="Kembali ke Beranda Peminjaman"
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: '#FFFFFF',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          flexShrink: 0
        }}>
          <img 
            src="/logo-creative-corner.png" 
            alt="Creative Corner Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
        <div>
          <div className="brand-title">Creative Corner</div>
          <div className="brand-subtitle">Studio Multimedia & Produksi Kreatif</div>
        </div>
      </div>

      {/* Navigasi Utama */}
      <nav className="role-switcher-container" aria-label="Navigasi Utama Studio">
        {/* Link 1: Formulir Peminjaman */}
        <button
          id="nav-peminjaman"
          className={`role-switcher-btn ${currentRole === 'public' && publicTab === 'form' ? 'active' : ''}`}
          onClick={() => {
            setCurrentRole('public');
            setPublicTab('form');
          }}
          title="Layanan Peminjaman Alat & Ruang Studio (Tanpa Perlu Login)"
        >
          <FileText size={15} />
          <span>Formulir Peminjaman</span>
        </button>

        {/* Link 2: Katalog Fasilitas */}
        <button
          id="nav-katalog"
          className={`role-switcher-btn ${currentRole === 'public' && publicTab === 'katalog' ? 'active' : ''}`}
          onClick={() => {
            setCurrentRole('public');
            setPublicTab('katalog');
          }}
          title="Katalog Ketersediaan Kamera, Lighting, Audio & Ruangan"
        >
          <Camera size={15} />
          <span>Katalog Fasilitas</span>
        </button>

        {/* Link 3: Lacak Status Resi */}
        <button
          id="nav-lacak-resi"
          className={`role-switcher-btn ${currentRole === 'public' && publicTab === 'status' ? 'active' : ''}`}
          onClick={() => {
            setCurrentRole('public');
            setPublicTab('status');
          }}
          title="Cek Status Pengajuan & Resi Peminjaman Anda"
        >
          <Search size={15} />
          <span>Lacak Resi</span>
        </button>

        {/* Link 4: Klien PC Kiosk */}
        <button
          id="nav-kiosk"
          className={`role-switcher-btn ${currentRole === 'kiosk' ? 'active' : ''}`}
          onClick={() => setCurrentRole('kiosk')}
          title="Mode Kiosk PC Workstation Studio"
        >
          <Monitor size={15} />
          <span>PC Kiosk</span>
          {activePCs > 0 && (
            <span style={{
              background: '#10B981',
              color: '#FFFFFF',
              fontSize: '0.675rem',
              padding: '1px 6px',
              borderRadius: '9999px',
              fontWeight: 700
            }}>
              {activePCs} Aktif
            </span>
          )}
        </button>

        {/* Link 5: Portal Anggota (Jika Login sebagai Anggota) */}
        {currentUser && !isUserAdmin && (
          <button
            id="nav-member-portal"
            className={`role-switcher-btn ${currentRole === 'member' ? 'active' : ''}`}
            onClick={() => setCurrentRole('member')}
            title="Papan Tugas & Jadwal Piket Anggota"
          >
            <Users size={15} />
            <span>Portal Anggota</span>
          </button>
        )}

        {/* Link 6: Panel Pengelola (Jika Login sebagai Admin) */}
        {currentUser && isUserAdmin && (
          <button
            id="nav-admin-portal"
            className={`role-switcher-btn ${currentRole === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentRole('admin')}
            title="Pusat Kendali Administrator Studio"
          >
            <ShieldCheck size={15} />
            <span>Panel Pengelola</span>
          </button>
        )}
      </nav>

      {/* Sisi Kanan: Status Akun & Tombol Masuk */}
      <div className="top-navbar-right">
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem'
              }}
            >
              {isUserAdmin ? (
                <ShieldCheck size={15} color="#93C5FD" />
              ) : (
                <User size={15} color="#A7F3D0" />
              )}
              <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.nama || currentUser.email}
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
            </div>

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
              title="Keluar dari sesi akun"
            >
              <LogOut size={13} />
              <span style={{ fontSize: '0.75rem' }}>Keluar</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setLoginType('member');
              setIsLoginModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              padding: '0.4rem 0.95rem',
              fontSize: '0.8rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <LogIn size={14} />
            <span>Masuk Tim Studio</span>
          </button>
        )}
      </div>

      {/* MODAL MASUK AKUN ANGGOTA / ADMIN */}
      {isLoginModalOpen && (
        <Modal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          title="Masuk Akun Studio Creative Corner"
          footer={
            <>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsLoginModalOpen(false)}
              >
                Batal
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleLoginSubmit}
              >
                <LogIn size={15} />
                <span>Masuk Sekarang</span>
              </button>
            </>
          }
        >
          {/* Tab Pilihan Jenis Akun */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => setLoginType('member')}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '8px',
                background: loginType === 'member' ? '#FFFFFF' : 'transparent',
                color: loginType === 'member' ? '#0F172A' : '#64748B',
                fontWeight: loginType === 'member' ? 700 : 500,
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: loginType === 'member' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Users size={15} color={loginType === 'member' ? '#059669' : '#64748B'} />
              <span>Anggota Tim Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginType('admin')}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '8px',
                background: loginType === 'admin' ? '#FFFFFF' : 'transparent',
                color: loginType === 'admin' ? '#0F172A' : '#64748B',
                fontWeight: loginType === 'admin' ? 700 : 500,
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: loginType === 'admin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <ShieldCheck size={15} color={loginType === 'admin' ? '#1E3A8A' : '#64748B'} />
              <span>Administrator Studio</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit}>
            {loginType === 'member' ? (
              <>
                <div style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  color: '#166534',
                  lineHeight: '1.5'
                }}>
                  Untuk anggota tim Creative Corner (Public Relation, Editor, Desain Grafis, Content Creator, Admin) guna melihat papan tugas liputan dan roster piket harian.
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Email Anggota *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="nama@gmail.com / siswa@sekolah.sch.id"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Lengkap (Opsional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    placeholder="Contoh: Muhammad Rizky"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Divisi di Creative Corner</label>
                  <select
                    className="form-select"
                    value={inputDivisi}
                    onChange={(e) => setInputDivisi(e.target.value)}
                  >
                    <option value="Editor">Editor</option>
                    <option value="Desain Grafis">Desain Grafis</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="Public Relation">Public Relation</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  color: '#1E3A8A',
                  lineHeight: '1.5'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <KeyRound size={14} />
                    <span>Ketentuan Akun Administrator:</span>
                  </div>
                  Email admin wajib mengandung kata <strong>creativecorner</strong> (contoh: <code>creativecorner@gmail.com</code> atau <code>admin1.creativecorner@gmail.com</code>).
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Email Administrator *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="creativecorner@gmail.com"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Penanggung Jawab (Opsional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    placeholder="Contoh: Koordinator Pembina Studio"
                  />
                </div>
              </>
            )}

            <div style={{
              marginTop: '1.25rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid #E2E8F0',
              fontSize: '0.775rem',
              color: '#64748B',
              textAlign: 'center'
            }}>
              Bukan anggota tim studio dan hanya ingin meminjam alat?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setCurrentRole('public');
                  setPublicTab('form');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Gunakan Formulir Peminjaman Mandiri (Tanpa Login)
              </button>
            </div>
          </form>
        </Modal>
      )}
    </header>
  );
};

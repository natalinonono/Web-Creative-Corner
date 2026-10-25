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
  ChevronRight,
  UserPlus,
  Sparkles
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
    registerMember,
    logoutUser,
    pcClients,
    isAdminEmail,
    members
  } = useStudio();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState('member'); // 'member' | 'admin'
  const [memberAction, setMemberAction] = useState('login'); // 'login' | 'register'

  // Form State Login & Registrasi
  const [inputEmail, setInputEmail] = useState('');
  const [inputNama, setInputNama] = useState('');
  const [inputWa, setInputWa] = useState('');
  const [inputAngkatan, setInputAngkatan] = useState('25');
  const [inputDivisi, setInputDivisi] = useState('Public Relation');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = inputEmail.trim();
    if (!email) {
      alert('Silakan masukkan alamat email Anda.');
      return;
    }

    if (loginType === 'admin') {
      if (!isAdminEmail(email)) {
        alert("Akses Admin Ditolak: Alamat email ini tidak terdaftar sebagai Administrator Studio.");
        return;
      }
      switchOrLoginUser({
        email,
        nama: inputNama.trim() || 'Administrator Studio',
        kelas: 'Pengelola Studio'
      });
      setCurrentRole('admin');
      setIsLoginModalOpen(false);
      setInputEmail('');
      setInputNama('');
    } else {
      // Member Flow (Khusus Anggota Creative Corner)
      if (memberAction === 'login') {
        const existing = members.find((m) => m.email?.toLowerCase().trim() === email.toLowerCase().trim());
        if (!existing) {
          alert("Alamat email belum terdaftar sebagai anggota Creative Corner.\n\nJika kamu adalah anggota baru di Creative Corner, silakan klik opsi '+ Daftar Anggota Baru'.");
          return;
        }
        switchOrLoginUser({
          email: existing.email,
          nama: existing.nama,
          kelas: existing.kelas,
          nomorWa: existing.nomorWa,
          divisi: existing.divisi,
          angkatan: existing.angkatan
        });
        setCurrentRole('member');
        setIsLoginModalOpen(false);
        setInputEmail('');
        setInputNama('');
      } else {
        // Registrasi Anggota Baru Creative Corner
        if (!inputNama.trim()) {
          alert('Silakan masukkan Nama Lengkap Anda.');
          return;
        }
        if (!inputWa.trim()) {
          alert('Silakan masukkan Nomor WhatsApp aktif Anda.');
          return;
        }
        registerMember({
          nama: inputNama.trim(),
          email,
          nomorWa: inputWa.trim(),
          angkatan: inputAngkatan,
          divisi: inputDivisi
        });
        setIsLoginModalOpen(false);
        setInputEmail('');
        setInputNama('');
        setInputWa('');
      }
    }
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
          <div className="brand-subtitle">Be Creative, Be Brave, Be Smart.</div>
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

        {/* Link 3: Status Peminjaman */}
        <button
          id="nav-lacak-resi"
          className={`role-switcher-btn ${currentRole === 'public' && publicTab === 'status' ? 'active' : ''}`}
          onClick={() => {
            setCurrentRole('public');
            setPublicTab('status');
          }}
          title="Cek Status Pengajuan Peminjaman Anda"
        >
          <Search size={15} />
          <span>Status Peminjaman</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div 
              className="navbar-user-badge"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                padding: '0.3rem 0.65rem',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.785rem'
              }}
            >
              {isUserAdmin ? (
                <ShieldCheck size={14} color="#93C5FD" style={{ flexShrink: 0 }} />
              ) : (
                <User size={14} color="#A7F3D0" style={{ flexShrink: 0 }} />
              )}
              <span className="navbar-user-name">
                {currentUser.nama || currentUser.email}
              </span>
              <span style={{
                fontSize: '0.65rem',
                padding: '1px 5px',
                borderRadius: '9999px',
                fontWeight: 700,
                background: isUserAdmin ? '#1E3A8A' : '#059669',
                color: '#FFFFFF',
                flexShrink: 0
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
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem'
              }}
              title="Keluar dari sesi akun"
            >
              <LogOut size={13} />
              <span className="navbar-logout-text">Keluar</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setLoginType('member');
              setMemberAction('login');
              setIsLoginModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              padding: '0.35rem 0.75rem',
              fontSize: '0.785rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            id="btn-open-member-login"
            title="Masuk atau Daftar Akun Anggota Creative Corner / Admin"
          >
            <LogIn size={14} />
            <span className="nav-login-label-desktop">Masuk / Daftar</span>
            <span className="nav-login-label-mobile">Masuk</span>
          </button>
        )}
      </div>

      {/* MODAL MASUK / DAFTAR AKUN ANGGOTA ATAU ADMIN */}
      {isLoginModalOpen && (
        <Modal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          title={
            loginType === 'admin'
              ? 'Akses Administrator Studio'
              : memberAction === 'login'
              ? 'Masuk Portal Anggota Creative Corner'
              : 'Daftar Anggota Baru Creative Corner'
          }
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
                {loginType === 'admin' ? (
                  <>
                    <ShieldCheck size={15} />
                    <span>Masuk Administrator</span>
                  </>
                ) : memberAction === 'login' ? (
                  <>
                    <LogIn size={15} />
                    <span>Masuk Portal Anggota</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={15} />
                    <span>Daftar Jadi Anggota</span>
                  </>
                )}
              </button>
            </>
          }
        >
          {/* Tab Pilihan Jenis Akun (Anggota vs Admin) */}
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
              <span>Anggota Creative Corner</span>
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
                {/* Sub-tab: Masuk vs Daftar Anggota Baru */}
                <div style={{
                  display: 'flex',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '3px',
                  marginBottom: '1rem',
                  gap: '4px'
                }}>
                  <button
                    type="button"
                    onClick={() => setMemberAction('login')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: memberAction === 'login' ? '#1E3A8A' : 'transparent',
                      color: memberAction === 'login' ? '#FFFFFF' : '#64748B',
                      fontWeight: memberAction === 'login' ? 700 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <LogIn size={14} />
                    <span>Masuk (Sudah Terdaftar)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMemberAction('register')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: memberAction === 'register' ? '#059669' : 'transparent',
                      color: memberAction === 'register' ? '#FFFFFF' : '#64748B',
                      fontWeight: memberAction === 'register' ? 700 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <UserPlus size={14} />
                    <span>+ Daftar Anggota Baru</span>
                  </button>
                </div>

                {/* Banner Penjelasan Khusus Anggota */}
                <div style={{
                  background: memberAction === 'register' ? '#F0FDF4' : '#EFF6FF',
                  border: `1px solid ${memberAction === 'register' ? '#BBF7D0' : '#BFDBFE'}`,
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  color: memberAction === 'register' ? '#166534' : '#1E3A8A',
                  lineHeight: '1.5'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} color={memberAction === 'register' ? '#059669' : '#1E3A8A'} />
                    <span>Khusus Anggota Creative Corner:</span>
                  </div>
                  {memberAction === 'register'
                    ? 'Pendaftaran ini khusus untuk siswa/anggota resmi Creative Corner (Divisi PR, Editor, Desain Grafis, Content Creator, Dokumentasi). Akun Anda akan langsung aktif untuk melihat kalender liputan & penugasan tugas kreatif.'
                    : 'Masukkan alamat email yang telah Anda daftarkan di Creative Corner untuk mengakses Papan Tugas Liputan, Kalender Acara & Roster Piket Studio.'}
                </div>

                {memberAction === 'login' ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Alamat Email Anggota Terdaftar *</label>
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

                    <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748B' }}>
                      Belum mendaftar sebagai anggota Creative Corner?{' '}
                      <button
                        type="button"
                        onClick={() => setMemberAction('register')}
                        style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        Daftar Anggota Baru di Sini
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nama Lengkap Anggota *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={inputNama}
                        onChange={(e) => setInputNama(e.target.value)}
                        placeholder="Contoh: Muhammad Rizky"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alamat Email Aktif *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder="nama@gmail.com / siswa@sekolah.sch.id"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nomor WhatsApp Aktif *</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={inputWa}
                        onChange={(e) => setInputWa(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        required
                      />
                    </div>

                    <div className="form-grid-dual">
                      <div className="form-group">
                        <label className="form-label">Angkatan Berapa?</label>
                        <select
                          className="form-select"
                          value={inputAngkatan}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInputAngkatan(val);
                            if (val !== '25' && inputDivisi === 'Dokumentasi') {
                              setInputDivisi('Editor');
                            }
                          }}
                        >
                          <option value="25">Angkatan 25</option>
                          <option value="26">Angkatan 26</option>
                          <option value="27">Angkatan 27</option>
                          <option value="28">Angkatan 28</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Divisi Anggota di Creative Corner</label>
                        <select
                          className="form-select"
                          value={inputDivisi}
                          onChange={(e) => setInputDivisi(e.target.value)}
                        >
                          <option value="Public Relation">Public Relation</option>
                          <option value="Editor">Editor</option>
                          <option value="Desain Grafis">Desain Grafis</option>
                          <option value="Content Creator">Content Creator</option>
                          {inputAngkatan === '25' && (
                            <option value="Dokumentasi">Dokumentasi (Khusus Angkatan 25)</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748B' }}>
                      Sudah pernah mendaftar sebelumnya?{' '}
                      <button
                        type="button"
                        onClick={() => setMemberAction('login')}
                        style={{ background: 'none', border: 'none', color: '#1E3A8A', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        Masuk Akun di Sini
                      </button>
                    </div>
                  </>
                )}
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
                    <span>Autentikasi Administrator:</span>
                  </div>
                  Silakan masukkan alamat email resmi Administrator Studio yang telah terdaftar.
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Email Administrator *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="Masukkan email administrator..."
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
              Bukan anggota Creative Corner dan hanya ingin meminjam alat?{' '}
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

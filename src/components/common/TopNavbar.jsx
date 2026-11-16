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
  Sparkles,
  Lock,
  Eye,
  EyeOff
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
    authenticateUser,
    registerMember,
    logoutUser,
    pcClients,
    isAdminEmail,
    members,
    openStorageGuide,
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginType,
    setLoginType,
    openLoginModal
  } = useStudio();

  const [memberAction, setMemberAction] = useState('login'); // 'login' | 'register'

  // Form State Login & Registrasi
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputNama, setInputNama] = useState('');
  const [inputWa, setInputWa] = useState('');
  const [inputAngkatan, setInputAngkatan] = useState('25');
  const [inputDivisi, setInputDivisi] = useState('Public Relation');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const query = inputEmail.trim();
    if (!query) {
      alert('Silakan masukkan alamat email atau nama Anda.');
      return;
    }

    if (memberAction === 'register' && loginType !== 'admin') {
      if (!inputNama.trim()) {
        alert('Silakan masukkan Nama Lengkap Anda.');
        return;
      }
      if (!inputWa.trim()) {
        alert('Silakan masukkan Nomor WhatsApp aktif Anda.');
        return;
      }
      if (!inputPassword.trim()) {
        alert('Silakan buat kata sandi untuk akun Anda.');
        return;
      }
      registerMember({
        nama: inputNama.trim(),
        email: query,
        nomorWa: inputWa.trim(),
        angkatan: inputAngkatan,
        divisi: inputDivisi,
        password: inputPassword.trim()
      });
      setIsLoginModalOpen(false);
      setInputEmail('');
      setInputNama('');
      setInputWa('');
      setInputPassword('');
      return;
    }

    if (!inputPassword.trim()) {
      alert('Silakan masukkan kata sandi akun Anda.');
      return;
    }

    if (loginType === 'admin') {
      if (!isAdminEmail(query)) {
        alert("Akses Admin Ditolak: Alamat email ini tidak terdaftar sebagai Administrator Studio.");
        return;
      }
    }

    const authResult = authenticateUser({
      emailOrQuery: query,
      password: inputPassword.trim()
    });

    if (!authResult.success) {
      alert(authResult.message);
      return;
    }

    setIsLoginModalOpen(false);
    setInputEmail('');
    setInputNama('');
    setInputPassword('');
  };

  const isUserAdmin = currentUser && isAdminEmail(currentUser.email);
  const activePCs = pcClients.filter((p) => p.status === 'Aktif').length;

  return (
    <header className="top-navbar">
      {/* Brand & Logo + Facility Indicator */}
      <div 
        className="brand-section" 
        onClick={() => { setCurrentRole('public'); setPublicTab('form'); }}
        style={{ cursor: 'pointer', order: 1 }}
        title="Kembali ke Beranda Peminjaman"
      >
        <div className="brand-logo-icon" title="Creative Corner Studio OS">
          <img 
            src="/logo-creative-corner.png" 
            alt="Creative Corner Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
          />
        </div>
        <div>
          <div className="brand-title" style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, letterSpacing: '-0.02em' }}>Creative Corner</div>
          <div className="brand-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="brand-status-dot"></span>
            <span style={{ color: '#90A8FF' }}>Studio OS</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span style={{ color: '#85F8C4' }}>v4.2-LTS</span>
          </div>
        </div>

        {/* Studio Branch Indicator (Hanya tampil di layar lebar) */}
        <div className="studio-branch-pill" style={{ marginLeft: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#90A8FF' }}>meeting_room</span>
          <span style={{ fontWeight: 600 }}>Studio Utama - Lantai 2</span>
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
        {/* Tombol Akses Cepat SOP & Lokasi Lemari */}
        <button
          type="button"
          onClick={() => openStorageGuide('sop')}
          className="btn btn-secondary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '0.35rem 0.75rem',
            fontWeight: 600,
            fontSize: '0.775rem'
          }}
          id="btn-open-storage-sop"
          title="Buka SOP Kamera, Lokasi Lemari, Box Coklat & Box Biru"
        >
          <Camera size={14} color="#90A8FF" />
          <span className="nav-login-label-desktop">SOP & Lokasi Lemari</span>
          <span className="nav-login-label-mobile">SOP</span>
        </button>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.25rem 0.65rem'
              }}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: isUserAdmin ? '#1E3A8A' : '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}
              >
                {isUserAdmin ? (
                  <ShieldCheck size={16} />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>
                  {currentUser.nama || currentUser.email}
                </span>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: isUserAdmin ? '#90A8FF' : '#85F8C4', lineHeight: 1 }}>
                  {isUserAdmin ? 'Pengelola Studio' : 'Kru Studio'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logoutUser}
              className="btn btn-secondary btn-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#FECACA',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: '6px'
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
              borderRadius: '8px',
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
                      <label className="form-label">Email Anggota atau Nama Lengkap Kamu *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder="Contoh: akbar.cc25@gmail.com atau Muhammad Akbar"
                        required
                        autoFocus
                      />
                      <div className="form-hint" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem' }}>
                        💡 Tip: Kamu bisa login langsung dengan memasukkan email resmi atau nama lengkapmu.
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Kata Sandi Akun *</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 'normal' }}>
                          Format: [panggilan]#cc[angkatan]
                        </span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-input"
                          style={{ paddingRight: '2.5rem' }}
                          value={inputPassword}
                          onChange={(e) => setInputPassword(e.target.value)}
                          placeholder="Masukkan kata sandi..."
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748B',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
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

                    <div className="form-group">
                      <label className="form-label">Buat Kata Sandi Akun *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-input"
                          style={{ paddingRight: '2.5rem' }}
                          value={inputPassword}
                          onChange={(e) => setInputPassword(e.target.value)}
                          placeholder="Contoh: password123 atau nama#cc26"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748B',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
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
                          <option value="Videografer">Videografer</option>
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
                  <label className="form-label">Kata Sandi Administrator *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      style={{ paddingRight: '2.5rem' }}
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="Masukkan kata sandi administrator..."
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748B',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
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

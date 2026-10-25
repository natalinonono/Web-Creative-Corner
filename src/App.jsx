import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { TopNavbar } from './components/common/TopNavbar';
import { PublicGuestPortal } from './components/public/PublicGuestPortal';
import { MemberPortal } from './components/member/MemberPortal';
import { PCKioskClient } from './components/kiosk/PCKioskClient';
import { AdminPortal } from './components/admin/AdminPortal';
import { CheckCircle2, AlertTriangle, ShieldCheck, User, LogIn, ArrowRight, KeyRound, UserPlus, Sparkles } from 'lucide-react';

// Tampilan Saat Akses Admin Belum Terverifikasi Email 'creativecorner'
const AdminAccessRestricted = ({ onGoPublic }) => {
  const [emailInput, setEmailInput] = useState('');
  const { switchOrLoginUser, isAdminEmail } = useStudio();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!isAdminEmail(emailInput.trim())) {
      alert("Akses ditolak: Alamat email ini tidak terdaftar sebagai Administrator Studio.");
      return;
    }
    switchOrLoginUser({ 
      email: emailInput.trim(), 
      nama: 'Admin Creative Corner', 
      kelas: 'Pengelola Studio' 
    });
  };

  return (
    <div style={{ maxWidth: '620px', margin: '3.5rem auto', textAlign: 'center', padding: '2.5rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ width: '64px', height: '64px', background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <ShieldCheck size={36} color="#1E3A8A" />
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
        Akses Khusus Administrator / Pengelola
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        Portal Pengelola hanya dapat diakses oleh akun email resmi Administrator Studio yang telah terdaftar.
      </p>

      <form onSubmit={handleAdminLogin} style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Masukkan Email Administrator *</label>
          <input
            type="email"
            className="form-input"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Masukkan email administrator..."
            required
            autoFocus
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
          <ShieldCheck size={16} />
          <span>Verifikasi & Masuk Portal Pengelola</span>
        </button>
      </form>

      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onGoPublic}
        >
          Kembali ke Formulir Peminjaman (Tanpa Login)
        </button>
      </div>
    </div>
  );
};

// Tampilan Saat Masuk ke Portal Anggota tapi Belum Login (Disediakan Pilihan Masuk & Daftar)
const MemberLoginPrompt = ({ onGoPublic }) => {
  const [memberAction, setMemberAction] = useState('login'); // 'login' | 'register'
  const [emailInput, setEmailInput] = useState('');
  const [namaInput, setNamaInput] = useState('');
  const [waInput, setWaInput] = useState('');
  const [angkatanInput, setAngkatanInput] = useState('25');
  const [divisiInput, setDivisiInput] = useState('Public Relation');
  const { switchOrLoginUser, registerMember, members } = useStudio();

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) {
      alert('Silakan masukkan alamat email Anda.');
      return;
    }

    if (memberAction === 'login') {
      const existing = members.find((m) => m.email?.toLowerCase().trim() === email.toLowerCase());
      if (!existing) {
        alert("Alamat email belum terdaftar sebagai anggota Creative Corner.\n\nJika kamu adalah anggota baru di Creative Corner, silakan pilih tab '+ Daftar Anggota Baru'.");
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
    } else {
      // Registrasi Baru Khusus Anggota Creative Corner
      if (!namaInput.trim()) {
        alert('Silakan masukkan Nama Lengkap Anda.');
        return;
      }
      if (!waInput.trim()) {
        alert('Silakan masukkan Nomor WhatsApp aktif Anda.');
        return;
      }
      registerMember({
        nama: namaInput.trim(),
        email,
        nomorWa: waInput.trim(),
        angkatan: angkatanInput,
        divisi: divisiInput
      });
    }
  };

  return (
    <div style={{ maxWidth: '620px', margin: '3rem auto', textAlign: 'center', padding: '2.5rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ width: '64px', height: '64px', background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <User size={36} color="#059669" />
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
        Portal Resmi Anggota Creative Corner
      </h2>
      <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', marginBottom: '1.5rem' }}>
        Akses khusus anggota tim internal Creative Corner untuk melihat kalender liputan, papan tugas kreatif, dan roster piket studio.
      </p>

      {/* Subtab Toggle Masuk vs Daftar */}
      <div style={{
        display: 'flex',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '4px',
        marginBottom: '1.25rem',
        gap: '4px'
      }}>
        <button
          type="button"
          onClick={() => setMemberAction('login')}
          style={{
            flex: 1,
            padding: '0.55rem',
            borderRadius: '8px',
            border: 'none',
            background: memberAction === 'login' ? '#1E3A8A' : 'transparent',
            color: memberAction === 'login' ? '#FFFFFF' : '#64748B',
            fontWeight: memberAction === 'login' ? 700 : 500,
            fontSize: '0.825rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s'
          }}
        >
          <LogIn size={15} />
          <span>Masuk (Sudah Terdaftar)</span>
        </button>

        <button
          type="button"
          onClick={() => setMemberAction('register')}
          style={{
            flex: 1,
            padding: '0.55rem',
            borderRadius: '8px',
            border: 'none',
            background: memberAction === 'register' ? '#059669' : 'transparent',
            color: memberAction === 'register' ? '#FFFFFF' : '#64748B',
            fontWeight: memberAction === 'register' ? 700 : 500,
            fontSize: '0.825rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s'
          }}
        >
          <UserPlus size={15} />
          <span>+ Daftar Anggota Baru</span>
        </button>
      </div>

      {/* Banner Penjelasan Khusus Anggota */}
      <div style={{
        background: memberAction === 'register' ? '#F0FDF4' : '#EFF6FF',
        border: `1px solid ${memberAction === 'register' ? '#BBF7D0' : '#BFDBFE'}`,
        borderRadius: '10px',
        padding: '0.85rem 1rem',
        marginBottom: '1.5rem',
        fontSize: '0.8rem',
        color: memberAction === 'register' ? '#166534' : '#1E3A8A',
        textAlign: 'left',
        lineHeight: '1.5'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={15} color={memberAction === 'register' ? '#059669' : '#1E3A8A'} />
          <span>Khusus Anggota Creative Corner:</span>
        </div>
        {memberAction === 'register'
          ? 'Formulir pendaftaran ini diperuntukkan khusus bagi anggota resmi Creative Corner (Divisi PR, Editor, Desain Grafis, Content Creator, Dokumentasi). Untuk peminjam umum/guru/siswa lain, Anda dapat langsung menggunakan formulir peminjaman tanpa perlu mendaftar.'
          : 'Masukkan alamat email yang telah Anda daftarkan di Creative Corner untuk mengakses Papan Tugas Liputan, Kalender Acara & Roster Piket Studio.'}
      </div>

      <form onSubmit={handleMemberSubmit} style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        {memberAction === 'login' ? (
          <>
            <div className="form-group">
              <label className="form-label">Alamat Email Anggota Terdaftar *</label>
              <input
                type="email"
                className="form-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nama@gmail.com / siswa@sekolah.sch.id"
                required
                autoFocus
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}>
              <LogIn size={16} />
              <span>Masuk Portal Anggota</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.8rem', color: '#64748B' }}>
              Belum terdaftar sebagai anggota Creative Corner?{' '}
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
                value={namaInput}
                onChange={(e) => setNamaInput(e.target.value)}
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
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nama@gmail.com / siswa@sekolah.sch.id"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nomor WhatsApp Aktif *</label>
              <input
                type="tel"
                className="form-input"
                value={waInput}
                onChange={(e) => setWaInput(e.target.value)}
                placeholder="Contoh: 081234567890"
                required
              />
            </div>

            <div className="form-grid-dual">
              <div className="form-group">
                <label className="form-label">Angkatan Berapa?</label>
                <select
                  className="form-select"
                  value={angkatanInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAngkatanInput(val);
                    if (val !== '25' && divisiInput === 'Dokumentasi') {
                      setDivisiInput('Editor');
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
                  value={divisiInput}
                  onChange={(e) => setDivisiInput(e.target.value)}
                >
                  <option value="Public Relation">Public Relation</option>
                  <option value="Editor">Editor</option>
                  <option value="Desain Grafis">Desain Grafis</option>
                  <option value="Content Creator">Content Creator</option>
                  {angkatanInput === '25' && (
                    <option value="Dokumentasi">Dokumentasi (Khusus Angkatan 25)</option>
                  )}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', background: '#059669', borderColor: '#059669' }}>
              <UserPlus size={16} />
              <span>Daftar Jadi Anggota Creative Corner</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.8rem', color: '#64748B' }}>
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
      </form>

      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onGoPublic}
        >
          Bukan Anggota Creative Corner? Buka Formulir Peminjaman (Tanpa Login)
        </button>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { currentRole, setCurrentRole, currentUser, isAdminEmail, toast } = useStudio();
  const [isLoginModalTrigger, setIsLoginModalTrigger] = useState(false);

  return (
    <div className="app-container">
      {/* Top Navbar dengan Brand Creative Corner dan Role Switcher */}
      <TopNavbar />

      {/* Main Content Area */}
      <main className="main-content">
        {currentRole === 'public' && (
          <PublicGuestPortal onOpenLoginModal={() => setCurrentRole('member')} />
        )}

        {currentRole === 'member' && (
          currentUser ? <MemberPortal /> : <MemberLoginPrompt onGoPublic={() => setCurrentRole('public')} />
        )}

        {currentRole === 'kiosk' && <PCKioskClient />}

        {currentRole === 'admin' && (
          (currentUser && isAdminEmail(currentUser.email)) ? (
            <AdminPortal />
          ) : (
            <AdminAccessRestricted onGoPublic={() => setCurrentRole('public')} />
          )
        )}
      </main>

      {/* Toast Notification Pop-up */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-xl)',
          background: toast.type === 'warning' ? '#FFFBEB' : '#FFFFFF',
          border: toast.type === 'warning' ? '1px solid #FDE68A' : '1px solid #CBD5E1',
          color: toast.type === 'warning' ? '#92400E' : '#0F172A',
          animation: 'fadeIn 0.2s ease-out',
          maxWidth: '480px',
          fontSize: '0.875rem',
          lineHeight: '1.4'
        }}>
          {toast.type === 'warning' ? (
            <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0 }} />
          )}
          <div>
            <strong>Creative Corner Notifikasi:</strong>
            <div>{toast.message}</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '1.25rem 2rem',
        marginTop: 'auto',
        fontSize: '0.8rem',
        color: '#64748B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img src="/logo-creative-corner.png" alt="Creative Corner Logo" style={{ height: '22px', objectFit: 'contain' }} />
          <strong style={{ color: '#0F172A' }}>Creative Corner</strong> — Be Creative, Be Brave, Be Smart.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <AppContent />
    </StudioProvider>
  );
}

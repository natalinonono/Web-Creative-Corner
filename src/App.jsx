import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { TopNavbar } from './components/common/TopNavbar';
import { PublicGuestPortal } from './components/public/PublicGuestPortal';
import { MemberPortal } from './components/member/MemberPortal';
import { PCKioskClient } from './components/kiosk/PCKioskClient';
import { AdminPortal } from './components/admin/AdminPortal';
import { CheckCircle2, AlertTriangle, ShieldCheck, User, LogIn, ArrowRight, KeyRound } from 'lucide-react';

// Tampilan Saat Akses Admin Belum Terverifikasi Email 'creativecorner'
const AdminAccessRestricted = ({ onGoPublic }) => {
  const [emailInput, setEmailInput] = useState('');
  const { switchOrLoginUser, isAdminEmail } = useStudio();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!isAdminEmail(emailInput.trim())) {
      alert("Akses ditolak: Alamat email wajib mengandung kata 'creativecorner' (contoh: admin1.creativecorner@gmail.com)");
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
        Portal Pengelola hanya dapat diakses oleh akun email yang mengandung kata <strong style={{ color: '#1E3A8A' }}>creativecorner</strong> (contoh: <code>admin1.creativecorner@gmail.com</code>).
      </p>

      <form onSubmit={handleAdminLogin} style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Masukkan Email Administrator *</label>
          <input
            type="email"
            className="form-input"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="admin1.creativecorner@gmail.com"
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

// Tampilan Saat Masuk ke Portal Anggota tapi Belum Login
const MemberLoginPrompt = ({ onGoPublic }) => {
  const [emailInput, setEmailInput] = useState('');
  const [namaInput, setNamaInput] = useState('');
  const { switchOrLoginUser } = useStudio();

  const handleMemberLogin = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    switchOrLoginUser({
      email: emailInput.trim(),
      nama: namaInput.trim() || emailInput.split('@')[0],
      kelas: 'Anggota Tim Studio'
    });
  };

  return (
    <div style={{ maxWidth: '620px', margin: '3.5rem auto', textAlign: 'center', padding: '2.5rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ width: '64px', height: '64px', background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <User size={36} color="#059669" />
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
        Masuk ke Portal Anggota Creative Corner
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        Halaman ini diperuntukkan bagi anggota tim internal Creative Corner. Masukkan akun email Anda untuk mengakses Papan Tugas Kreatif, Kalender Liputan Resmi, dan Roster Piket Studio.
      </p>

      <form onSubmit={handleMemberLogin} style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Alamat Email Anggota *</label>
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
        <div className="form-group">
          <label className="form-label">Nama Lengkap (Opsional)</label>
          <input
            type="text"
            className="form-input"
            value={namaInput}
            onChange={(e) => setNamaInput(e.target.value)}
            placeholder="Contoh: Budi Santoso"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
          <LogIn size={16} />
          <span>Masuk sebagai Anggota</span>
        </button>
      </form>

      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onGoPublic}
        >
          Bukan Anggota? Buka Formulir Peminjaman (Tanpa Login)
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

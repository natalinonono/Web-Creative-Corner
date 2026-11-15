import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
  FileText, 
  Camera, 
  Monitor, 
  Archive, 
  User, 
  Users, 
  ShieldCheck 
} from 'lucide-react';

export const MobileBottomNav = () => {
  const {
    currentRole,
    setCurrentRole,
    publicTab,
    setPublicTab,
    currentUser,
    isUserAdmin: isUserAdminFn,
    isAdminEmail,
    pcClients,
    openStorageGuide,
    openLoginModal
  } = useStudio();

  const isUserAdmin = currentUser && (
    (typeof isUserAdminFn === 'function' && isUserAdminFn(currentUser.email)) ||
    (typeof isAdminEmail === 'function' && isAdminEmail(currentUser.email)) ||
    currentUser.role === 'admin' ||
    currentUser.divisi === 'Admin'
  );

  const activePCs = pcClients.filter((p) => p.status === 'Aktif').length;

  const isFormActive = currentRole === 'public' && publicTab === 'form';
  const isKatalogActive = currentRole === 'public' && publicTab === 'katalog';
  const isKioskActive = currentRole === 'kiosk';
  const isPortalActive = currentRole === 'member' || currentRole === 'admin';

  return (
    <nav className="mobile-bottom-nav" aria-label="Navigasi Bawah Layar HP">
      <div className="mobile-bottom-nav-inner">
        {/* 1. Formulir Peminjaman */}
        <button
          type="button"
          className={`mobile-nav-item ${isFormActive ? 'active' : ''}`}
          onClick={() => {
            setCurrentRole('public');
            setPublicTab('form');
          }}
          aria-label="Formulir Peminjaman Alat"
        >
          <div className="mobile-nav-icon-box">
            <FileText size={20} strokeWidth={isFormActive ? 2.5 : 2} />
          </div>
          <span className="mobile-nav-label">Pinjam</span>
        </button>

        {/* 2. Katalog Fasilitas */}
        <button
          type="button"
          className={`mobile-nav-item ${isKatalogActive ? 'active' : ''}`}
          onClick={() => {
            setCurrentRole('public');
            setPublicTab('katalog');
          }}
          aria-label="Katalog Alat & Ruang"
        >
          <div className="mobile-nav-icon-box">
            <Camera size={20} strokeWidth={isKatalogActive ? 2.5 : 2} />
          </div>
          <span className="mobile-nav-label">Katalog</span>
        </button>

        {/* 3. PC Kiosk */}
        <button
          type="button"
          className={`mobile-nav-item ${isKioskActive ? 'active' : ''}`}
          onClick={() => setCurrentRole('kiosk')}
          aria-label="Kiosk PC Studio"
        >
          <div className="mobile-nav-icon-box" style={{ position: 'relative' }}>
            <Monitor size={20} strokeWidth={isKioskActive ? 2.5 : 2} />
            {activePCs > 0 && (
              <span className="mobile-nav-pc-badge" title={`${activePCs} PC sedang aktif`}>
                {activePCs}
              </span>
            )}
          </div>
          <span className="mobile-nav-label">PC Kiosk</span>
        </button>

        {/* 4. SOP & Lokasi Lemari */}
        <button
          type="button"
          className="mobile-nav-item"
          onClick={() => openStorageGuide('sop')}
          aria-label="SOP Kamera & Tata Letak Lemari"
        >
          <div className="mobile-nav-icon-box">
            <Archive size={20} strokeWidth={2} />
          </div>
          <span className="mobile-nav-label">SOP & Box</span>
        </button>

        {/* 5. Akun / Portal Anggota / Panel Admin */}
        <button
          type="button"
          className={`mobile-nav-item ${isPortalActive ? 'active' : ''}`}
          onClick={() => {
            if (currentUser) {
              if (isUserAdmin) {
                setCurrentRole('admin');
              } else {
                setCurrentRole('member');
              }
            } else {
              openLoginModal('member');
            }
          }}
          aria-label="Portal Akun Pengguna"
        >
          <div className="mobile-nav-icon-box">
            {isUserAdmin ? (
              <ShieldCheck size={20} strokeWidth={isPortalActive ? 2.5 : 2} color={isPortalActive ? '#90A8FF' : 'currentColor'} />
            ) : currentUser ? (
              <Users size={20} strokeWidth={isPortalActive ? 2.5 : 2} color={isPortalActive ? '#85F8C4' : 'currentColor'} />
            ) : (
              <User size={20} strokeWidth={isPortalActive ? 2.5 : 2} />
            )}
          </div>
          <span className="mobile-nav-label">
            {isUserAdmin ? 'Admin' : currentUser ? 'Portal' : 'Masuk'}
          </span>
        </button>
      </div>
    </nav>
  );
};

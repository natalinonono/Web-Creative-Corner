import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Camera, 
  Layers, 
  CheckCircle, 
  Lock, 
  Clock, 
  RotateCcw, 
  ClipboardCheck, 
  ShieldAlert,
  Search,
  Plus,
  BatteryCharging,
  Sparkles,
  Tag,
  Eye,
  MapPin,
  QrCode,
  Timer,
  AlertTriangle
} from 'lucide-react';
import { PickupInspectionModal } from './PickupInspectionModal';
import { ReturnInspectionModal } from './ReturnInspectionModal';
import { getCameraRequirements, isCameraItem, isLensItem, isBatteryItem, isMemoryCardItem, getLensMountType } from '../../utils/cameraCompatibility';
import { checkLoanOverdue } from '../../utils/loanOverdue';
import sonyLensImg from '../../assets/stitch/sony-fe-24-70-gm2.jpg';

export const EquipmentLoanTab = () => {
  const { equipment, borrowings, activeMemberId, members, currentUser } = useStudio();
  const currentMember = currentUser || members.find((m) => m.id === activeMemberId) || members[0] || { nama: 'Anggota Kru' };

  const [activeKategori, setActiveKategori] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [prefilledEqIds, setPrefilledEqIds] = useState([]);
  const [selectedBorrowingForReturn, setSelectedBorrowingForReturn] = useState(null);

  const getRemainingTimeLabel = (borrowing) => {
    try {
      const todayStr = borrowing.tanggalPinjam || new Date().toISOString().split('T')[0];
      const timeStr = (borrowing.batasWaktuKembali || '16:00').replace(/\s*WIB/i, '').trim();
      const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);
      const deadline = new Date(`${todayStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
      const diffMs = deadline.getTime() - Date.now();
      if (diffMs <= 0) return null;
      const mins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      if (hrs > 24) return `${Math.floor(hrs / 24)} hari ${hrs % 24} jam`;
      if (hrs >= 1) return rem > 0 ? `${hrs} jam ${rem} menit` : `${hrs} jam`;
      return `${mins} menit`;
    } catch {
      return null;
    }
  };

  // Filter peralatan
  const filteredEquipment = equipment.filter((item) => {
    const matchCategory = activeKategori === 'Semua' || item.kategori === activeKategori;
    const matchSearch = (item.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.kode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.spesifikasi || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Peminjaman aktif yang relevan
  const myActiveBorrowings = borrowings.filter(
    (b) => b.status === 'Dipinjam' && (b.anggotaId === activeMemberId || b.peminjamNama === currentMember.nama)
  );

  const myHistoryBorrowings = borrowings.filter(
    (b) => b.status === 'Selesai' && (b.anggotaId === activeMemberId || b.peminjamNama === currentMember.nama)
  );

  const handleOpenPickupForTool = (toolId) => {
    setPrefilledEqIds([toolId]);
    setPickupModalOpen(true);
  };

  const availableCount = equipment.filter((e) => e.status === 'Tersedia').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. TOP CREW CONTEXT & GREETING (STITCH SCREEN 6) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            position: 'relative',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E3A8A',
            border: '2px solid #DBEAFE',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>account_circle</span>
            <span style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #FFFFFF'
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Halo, {currentMember.nama}!
              </h2>
              <span style={{
                fontSize: '0.675rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: '#DBEAFE',
                color: '#1E40AF',
                padding: '1px 6px',
                borderRadius: '9999px'
              }}>
                CREW STUDIO
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', fontSize: '0.8rem', color: '#64748B' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              <span>Creative Corner Studio • <strong style={{ color: '#059669' }}>Aktif Beroperasi</strong></span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setPrefilledEqIds([]);
            setPickupModalOpen(true);
          }}
          id="btn-open-general-pickup"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
        >
          <Plus size={16} />
          <span>Inspeksi Pengambilan Mandiri</span>
        </button>
      </div>

      {/* 2. ACTIVE LOAN REMINDER BANNER (STITCH SCREEN 6) */}
      {myActiveBorrowings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.04em' }}>
            Pinjaman Aktif Kamu ({myActiveBorrowings.length} Unit)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {myActiveBorrowings.map((b) => {
              const overdueCheck = checkLoanOverdue(b);
              const isOverdue = overdueCheck.isOverdue;
              const remainingLabel = !isOverdue ? getRemainingTimeLabel(b) : null;

              return (
                <div
                  key={b.id}
                  style={{
                    background: '#FFFFFF',
                    border: `1.5px solid ${isOverdue ? '#FDA4AF' : '#BFDBFE'}`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div>
                    {/* Top Tag & Urgency Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        background: '#EFF6FF',
                        color: '#1E3A8A',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700
                      }}>
                        <Clock size={12} />
                        <span>PINJAMAN AKTIF KAMU</span>
                      </span>

                      <span style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono)', color: isOverdue ? '#E11D48' : '#64748B', fontWeight: 600 }}>
                        Batas {b.batasWaktuKembali || '16:00'} WIB
                      </span>
                    </div>

                    {/* Gear Info */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                          {b.peralatanNama}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-mono)',
                            color: '#1E40AF',
                            background: '#EFF6FF',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontWeight: 600
                          }}>
                            {b.id}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={12} />
                            Studio Utama CC
                          </span>
                        </div>
                        <div style={{ fontSize: '0.775rem', color: '#475569' }}>
                          <div><strong>Keperluan:</strong> {b.keperluan || '-'}</div>
                          <div><strong>Diambil:</strong> {b.tanggalPinjam} {b.jamPinjam ? `pukul ${b.jamPinjam} WIB` : ''}</div>
                        </div>
                      </div>

                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1E3A8A',
                        flexShrink: 0
                      }}>
                        <Camera size={20} />
                      </div>
                    </div>

                    {/* Ringkasan Inspeksi Pengambilan Awal */}
                    {b.inspeksiPengambilan && (
                      <div style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '0.6rem 0.75rem',
                        marginBottom: '0.85rem',
                        fontSize: '0.75rem',
                        color: '#334155'
                      }}>
                        <div style={{ fontWeight: 700, color: '#1E3A8A', marginBottom: '0.2rem' }}>
                          Catatan Inspeksi Awal (BEFORE):
                        </div>
                        <div>• Fisik: {b.inspeksiPengambilan.kondisiFisik || 'Baik'}</div>
                        <div>• Keterangan: {b.inspeksiPengambilan.keteranganAlat || b.inspeksiPengambilan.kelengkapanAksesori || '-'}</div>
                      </div>
                    )}

                    {/* Urgency Countdown Strip */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      background: isOverdue ? '#FFF1F2' : '#EFF6FF',
                      border: `1px solid ${isOverdue ? '#FECDD3' : '#DBEAFE'}`,
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                      color: isOverdue ? '#BE123C' : '#1E40AF'
                    }}>
                      <Timer size={16} />
                      <span style={{ fontWeight: 600 }}>
                        {isOverdue ? (
                          <>Waktu pinjam telah lewat: <span style={{ fontWeight: 800 }}>{overdueCheck.label}</span></>
                        ) : remainingLabel ? (
                          <>Harus kembali dalam <span style={{ fontWeight: 800 }}>{remainingLabel}</span></>
                        ) : (
                          <>Wajib dikembalikan sebelum batas waktu operasional.</>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        background: '#059669',
                        borderColor: '#047857',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        fontWeight: 700
                      }}
                      onClick={() => setSelectedBorrowingForReturn(b)}
                      id={`btn-return-${b.id}`}
                    >
                      <RotateCcw size={16} />
                      <span>Mulai Verifikasi Pengembalian & Foto After</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. KATALOG ALAT CEPAT (2-COLUMN / MULTI-COLUMN FEED - STITCH SCREEN 6) */}
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header" style={{ borderBottom: '1px solid #E2E8F0', padding: '1.15rem 1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 className="card-title" style={{ fontSize: '1.1rem', margin: 0 }}>
                Peralatan Siap Pinjam Studio
              </h3>
              <span style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                background: '#ECFDF5',
                color: '#059669',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #A7F3D0'
              }}>
                {availableCount} Unit Siap
              </span>
            </div>
            <div className="card-subtitle" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Tersedia untuk checkout cepat kru liputan Creative Corner via barcode / checklist fisik.
            </div>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Cari kamera, lensa, kode..."
              style={{ paddingLeft: '2.1rem', fontSize: '0.825rem', height: '36px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tab Kategori (Pills) */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.65rem 1.25rem',
          borderBottom: '1px solid #E2E8F0',
          background: '#F8FAFC',
          overflowX: 'auto',
          alignItems: 'center'
        }}>
          {['Semua', 'Kamera', 'Lensa', 'Baterai', 'Memory Card', 'Audio & Mikrofon', 'Lighting & Tata Cahaya', 'Tripod & Aksesori', 'Ruang Studio'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${activeKategori === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveKategori(cat)}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', flexShrink: 0 }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Katalog Alat (Stitch Screen 6 Cards) */}
        {filteredEquipment.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B' }}>
            <Camera size={38} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
              Tidak Ada Peralatan yang Sesuai
            </h4>
            <p style={{ fontSize: '0.825rem' }}>
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori di atas.
            </p>
          </div>
        ) : (
          <div style={{
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {filteredEquipment.map((tool) => {
              const isLockedByEvent = tool.status === 'Terkunci Event';
              const isBorrowed = tool.status === 'Dipinjam';
              const isAvailable = tool.status === 'Tersedia';

              const isCam = isCameraItem(tool);
              const toolReq = isCam ? getCameraRequirements(tool) : null;
              const isLens = isLensItem(tool);
              const lensMount = isLens ? getLensMountType(tool) : null;
              const isBattery = isBatteryItem(tool);
              const isMemoryCard = isMemoryCardItem(tool);

              // Decoded Stitch Screen 3 Sony FE 24-70mm GM II Photo
              const is2470 = (tool.nama || '').toLowerCase().includes('24-70');

              return (
                <div
                  key={tool.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'border-color 0.15s ease'
                  }}
                  className="hover:border-blue-300"
                >
                  <div>
                    {/* Thumbnail Container (Aspect 4:3) */}
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '140px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      marginBottom: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {is2470 ? (
                        <img
                          src={sonyLensImg}
                          alt={tool.nama}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ color: '#1E3A8A' }}>
                          <Camera size={36} />
                        </div>
                      )}

                      {/* Status Tag on Top-Left */}
                      <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                        <StatusBadge status={tool.status} />
                      </div>
                    </div>

                    {/* Meta & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#64748B', fontWeight: 600 }}>
                        {tool.kode || `#EQ-${tool.id}`}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500 }}>
                        {tool.lokasiRak || 'Dry Cab 01'}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      lineHeight: 1.3,
                      marginBottom: '0.4rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }} title={tool.nama}>
                      {tool.nama}
                    </h4>

                    {/* Lens Mount or Camera Spec Badge */}
                    {toolReq && (
                      <div style={{ marginBottom: '0.45rem' }}>
                        <span style={{
                          fontSize: '0.675rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: toolReq.needsAdapter ? '#FEF3C7' : '#EFF6FF',
                          color: toolReq.needsAdapter ? '#92400E' : '#1E40AF',
                          fontWeight: 700,
                          display: 'inline-block'
                        }}>
                          {toolReq.needsAdapter ? 'Wajib Adapter EF' : toolReq.lensLabel}
                        </span>
                      </div>
                    )}

                    {isLens && (
                      <div style={{ marginBottom: '0.45rem' }}>
                        <span style={{
                          fontSize: '0.675rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: lensMount === 'EF-M' ? '#FAF5FF' : '#EEF2FF',
                          color: lensMount === 'EF-M' ? '#7E22CE' : '#4338CA',
                          border: `1px solid ${lensMount === 'EF-M' ? '#E9D5FF' : '#C7D2FE'}`,
                          fontWeight: 700,
                          display: 'inline-block'
                        }}>
                          {lensMount === 'EF-M' ? 'Mount: Lensa EF-M (Mirrorless)' : 'Mount: Lensa EF (DSLR)'}
                        </span>
                      </div>
                    )}

                    {isBattery && (
                      <div style={{ marginBottom: '0.45rem' }}>
                        <span style={{
                          fontSize: '0.675rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: (tool.nama + (tool.spesifikasi || '')).toLowerCase().includes('lp-e10') ? '#FEE2E2' : '#F0FDF4',
                          color: (tool.nama + (tool.spesifikasi || '')).toLowerCase().includes('lp-e10') ? '#991B1B' : '#166534',
                          fontWeight: 700,
                          display: 'inline-block'
                        }}>
                          {(tool.nama + (tool.spesifikasi || '')).toLowerCase().includes('lp-e10') ? 'Khusus 1500D (LP-E10)' : 'Baterai LP-E17'}
                        </span>
                      </div>
                    )}

                    {isMemoryCard && (
                      <div style={{ marginBottom: '0.45rem' }}>
                        <span style={{
                          fontSize: '0.675rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#F0F9FF',
                          color: '#0369A1',
                          border: '1px solid #BAE6FD',
                          fontWeight: 700,
                          display: 'inline-block'
                        }}>
                          Memory Card
                        </span>
                      </div>
                    )}

                    <div style={{ fontSize: '0.75rem', color: '#475569', background: '#F8FAFC', padding: '0.45rem 0.6rem', borderRadius: '6px', marginBottom: '0.85rem', lineHeight: 1.35 }}>
                      <div><strong>Kondisi:</strong> {tool.kondisiFisik || 'Baik'}</div>
                      <div style={{ color: '#64748B', marginTop: '2px' }}>{tool.spesifikasi || '-'}</div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div>
                    {isAvailable ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{
                          width: '100%',
                          height: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          fontWeight: 700
                        }}
                        onClick={() => handleOpenPickupForTool(tool.id)}
                        id={`btn-borrow-${tool.id}`}
                      >
                        <Plus size={15} />
                        <span>Pinjam Unit</span>
                      </button>
                    ) : isLockedByEvent ? (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ width: '100%', height: '38px', cursor: 'not-allowed', opacity: 0.8 }}
                        disabled
                        title="Unit ini otomatis dikunci untuk agenda liputan resmi sekolah"
                      >
                        <Lock size={14} />
                        <span>Terkunci Event Sekolah</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', height: '38px', cursor: 'not-allowed', color: '#D97706', borderColor: '#FDE68A' }}
                        disabled
                      >
                        <Clock size={14} />
                        <span>Sedang Dipinjam ({tool.peminjamAktif || 'Anggota'})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. RIWAYAT PEMINJAMAN SELESAI */}
      {myHistoryBorrowings.length > 0 && (
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0' }}>
            <h3 className="card-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <CheckCircle size={18} color="#059669" />
              <span>Riwayat Pengembalian & Penugasan Selesai</span>
            </h3>
          </div>
          <div className="table-container" style={{ margin: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No. Dokumen</th>
                  <th>Alat / Ruang</th>
                  <th>Tanggal Pinjam</th>
                  <th>Kondisi Akhir</th>
                  <th>Status Tugas</th>
                </tr>
              </thead>
              <tbody>
                {myHistoryBorrowings.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>{h.id}</td>
                    <td><strong>{h.peralatanNama}</strong></td>
                    <td>{h.tanggalPinjam}</td>
                    <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {h.inspeksiPengembalian?.kondisiFisikAkhir || 'Kembali normal'}
                    </td>
                    <td>
                      <StatusBadge status="Sudah Melaksanakan Tugas" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Cek Fisik Pengambilan */}
      {pickupModalOpen && (
        <PickupInspectionModal
          isOpen={pickupModalOpen}
          onClose={() => {
            setPickupModalOpen(false);
            setPrefilledEqIds([]);
          }}
          prefilledEquipmentIds={prefilledEqIds}
        />
      )}

      {/* Modal Verifikasi Pengembalian (Stitch Screen 4 Layout) */}
      {selectedBorrowingForReturn && (
        <ReturnInspectionModal
          isOpen={Boolean(selectedBorrowingForReturn)}
          onClose={() => setSelectedBorrowingForReturn(null)}
          targetBorrowing={selectedBorrowingForReturn}
        />
      )}

    </div>
  );
};

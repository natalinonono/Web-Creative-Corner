import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  Camera, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  ClipboardCheck, 
  Eye, 
  ShieldAlert,
  Layers,
  Inbox,
  FileText,
  Download,
  Mic,
  Sun,
  Video,
  Sliders,
  FolderTree,
  Tag,
  BatteryCharging,
  Battery,
  Sparkles,
  HardDrive,
  LayoutGrid,
  List,
  Clock,
  QrCode,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { getCameraRequirements, CAMERA_RULES, isCameraItem, isLensItem, getLensMountType } from '../../utils/cameraCompatibility';
import { checkLoanOverdue } from '../../utils/loanOverdue';
import sonyLensImg from '../../assets/stitch/sony-fe-24-70-gm2.jpg';

export const STANDARD_CATEGORIES = [
  'Kamera',
  'Lensa',
  'Baterai',
  'Memory Card',
  'Audio & Mikrofon',
  'Lighting & Tata Cahaya',
  'Tripod & Aksesori',
  'Ruang Studio'
];

export const InventoryMasterTab = () => {
  const { 
    equipment, 
    addEquipment, 
    updateEquipment, 
    deleteEquipment, 
    borrowings 
  } = useStudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [viewMode, setViewMode] = useState('matrix'); // 'matrix' | 'grouped' | 'flat'

  // Modal State untuk Tambah / Edit Alat Master
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Kamera');
  const [customKategori, setCustomKategori] = useState('');
  const [kondisiFisik, setKondisiFisik] = useState('Sangat Baik');
  const [spesifikasi, setSpesifikasi] = useState('');
  const [lokasiRak, setLokasiRak] = useState('');

  // Modal State untuk Validasi Laporan Fisik (Side-by-Side)
  const [selectedBorrowingForCompare, setSelectedBorrowingForCompare] = useState(null);
  const [previewProofModal, setPreviewProofModal] = useState(null);

  // Helper Ikon dan Warna Kategori
  const getCategoryMeta = (cat) => {
    if (!cat) return { icon: Layers, color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', label: 'Peralatan Umum' };
    const lower = cat.toLowerCase();
    if (lower.includes('kamera')) {
      return { icon: Camera, color: '#1E3A8A', bg: '#EFF6FF', border: '#BFDBFE', label: 'Kamera' };
    }
    if (lower.includes('lensa')) {
      return { icon: Eye, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', label: 'Lensa' };
    }
    if (lower.includes('baterai') || lower.includes('battery')) {
      return { icon: BatteryCharging, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', label: 'Baterai' };
    }
    if (lower.includes('memory') || lower.includes('sd card')) {
      return { icon: HardDrive, color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', label: 'Memory Card' };
    }
    if (lower.includes('audio') || lower.includes('mic')) {
      return { icon: Mic, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Audio & Mikrofon' };
    }
    if (lower.includes('light')) {
      return { icon: Sun, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Lighting & Tata Cahaya' };
    }
    if (lower.includes('tripod') || lower.includes('aksesori') || lower.includes('rig')) {
      return { icon: Video, color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', label: 'Tripod & Aksesori' };
    }
    if (lower.includes('ruang') || lower.includes('studio')) {
      return { icon: Layers, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Ruang Studio' };
    }
    return { icon: Layers, color: '#475569', bg: '#F8FAFC', border: '#E2E8F0', label: cat };
  };

  // Metrik Eksekutif (Stitch Screen 2 KPI Cards)
  const totalAssets = equipment.length;
  const primeCount = equipment.filter((e) => {
    const k = (e.kondisiFisik || '').toLowerCase();
    return k.includes('baik') || k.includes('prima') || k.includes('normal') || k.includes('bersih') || k.includes('100%');
  }).length;
  const primePercentage = totalAssets > 0 ? Math.round((primeCount / totalAssets) * 100) : 100;
  
  const activeLoans = borrowings.filter((b) => b.status === 'Dipinjam');
  const borrowedCount = activeLoans.length;

  const overdueList = borrowings.filter((b) => b.status === 'Terlambat' || checkLoanOverdue(b).isOverdue);
  const overdueCount = overdueList.length;

  const inspectableBorrowings = borrowings.filter((b) => b.inspeksiPengambilan || b.buktiSurat || b.inspeksiPengembalian);
  const pendingInspectionCount = inspectableBorrowings.filter((b) => !b.inspeksiPengembalian?.verifikasiAdminSelesai).length;

  // Filter Alat berdasarkan pencarian, kategori, dan status
  const filteredAssets = equipment.filter((eq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      (eq.nama || '').toLowerCase().includes(q) ||
      (eq.kode || '').toLowerCase().includes(q) ||
      (eq.kategori || '').toLowerCase().includes(q) ||
      (eq.kondisiFisik || '').toLowerCase().includes(q) ||
      (eq.spesifikasi || '').toLowerCase().includes(q) ||
      (eq.lokasiRak || '').toLowerCase().includes(q)
    );
    const matchesCategory = activeCategoryFilter === 'Semua' || eq.kategori === activeCategoryFilter;
    const matchesStatus = statusFilter === 'Semua' || eq.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Kategori-kategori yang tersedia dalam sistem
  const allAvailableCategories = Array.from(
    new Set([
      ...STANDARD_CATEGORIES,
      ...equipment.map((e) => e.kategori).filter(Boolean)
    ])
  );

  // Pengelompokan alat berdasarkan kategori
  const groupedByCategoryAssets = filteredAssets.reduce((acc, item) => {
    const cat = item.kategori || 'Peralatan Umum';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const handleOpenAddModal = (presetKategori) => {
    setEditingAssetId(null);
    setKode(`EQ-${String(equipment.length + 1).padStart(2, '0')}`);
    setNama('');
    const targetCat = typeof presetKategori === 'string' && presetKategori !== 'Semua' ? presetKategori : 'Kamera';
    setKategori(targetCat);
    setCustomKategori('');
    setKondisiFisik('Sangat Baik');
    setSpesifikasi('');
    setLokasiRak('Loker A-01 (Dry Cabinet 1)');
    setIsAssetModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingAssetId(item.id);
    setKode(item.kode || item.id);
    setNama(item.nama);
    const isStandard = STANDARD_CATEGORIES.includes(item.kategori);
    if (isStandard) {
      setKategori(item.kategori || 'Kamera');
      setCustomKategori('');
    } else {
      setKategori('Lainnya');
      setCustomKategori(item.kategori || '');
    }
    setKondisiFisik(item.kondisiFisik || 'Sangat Baik');
    setSpesifikasi(item.spesifikasi || '');
    setLokasiRak(item.lokasiRak || 'Loker A-01 (Dry Cabinet 1)');
    setIsAssetModalOpen(true);
  };

  const handleSaveAsset = (e) => {
    e.preventDefault();
    if (!nama.trim() || !kondisiFisik.trim() || !spesifikasi.trim()) {
      alert('Nama alat, kondisi fisik, dan keterangan alat wajib diisi.');
      return;
    }

    const finalKategori = kategori === 'Lainnya'
      ? (customKategori.trim() || 'Peralatan Umum')
      : kategori;

    if (editingAssetId) {
      updateEquipment(editingAssetId, {
        kode: kode || `EQ-${String(equipment.length + 1).padStart(2, '0')}`,
        nama: nama.trim(),
        kategori: finalKategori,
        kondisiFisik: kondisiFisik.trim(),
        spesifikasi: spesifikasi.trim(),
        baterai: null,
        lokasiRak: lokasiRak.trim() || 'Loker A-01 (Dry Cabinet 1)'
      });
    } else {
      addEquipment({
        kode: kode || `EQ-${String(equipment.length + 1).padStart(2, '0')}`,
        nama: nama.trim(),
        kategori: finalKategori,
        kondisiFisik: kondisiFisik.trim(),
        spesifikasi: spesifikasi.trim(),
        baterai: null,
        lokasiRak: lokasiRak.trim() || 'Loker A-01 (Dry Cabinet 1)'
      });
    }

    setIsAssetModalOpen(false);
  };

  const handleDeleteAsset = (id) => {
    if (window.confirm('Yakin ingin menghapus unit aset ini dari database studio?')) {
      deleteEquipment(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. TOP CONTEXT & EXECUTIVE ACTION BAR */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>CONSOLE</span>
            <span>/</span>
            <span style={{ color: '#1E3A8A', fontWeight: 700 }}>ASSET INVENTORY</span>
            <span>/</span>
            <span>CREATIVE CORNER</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Inventaris Alat & Status Operasional
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#475569', margin: '0.2rem 0 0 0' }}>
            Manajemen armada gear kamera, lensa, pencahayaan, dan unit live streaming studio
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Live Sync Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.75rem',
            background: '#F1F5F9',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: '#1E293B',
            border: '1px solid #E2E8F0'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)' }} />
            <span>Live Sync: Aktif</span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenAddModal(activeCategoryFilter)}
            id="btn-add-asset-top"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.95rem' }}
          >
            <Plus size={16} />
            <span>Tambah Alat Baru</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE METRIC BAR (4 HIGH-DENSITY KPI CARDS - STITCH SCREEN 2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {/* KPI 1: Total Aset Studio */}
        <div className="card" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.04em' }}>
                Total Aset Studio
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{totalAssets}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Unit Terdaftar</span>
              </div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A' }}>
              <Camera size={20} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                {primePercentage}% Kondisi Prima
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#64748B' }}>
                {primeCount}/{totalAssets}
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${primePercentage}%`, background: '#059669', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>

        {/* KPI 2: Sedang Dipinjam */}
        <div className="card" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.04em' }}>
                Sedang Dipinjam
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{borrowedCount}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Unit Lapangan</span>
              </div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              background: '#F1F5F9',
              fontSize: '0.725rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: '#334155'
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#64748B' }} />
              {activeLoans.length} Peminjaman Aktif
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Siap Pantau</span>
          </div>
        </div>

        {/* KPI 3: Jatuh Tempo Hari Ini / Overdue */}
        <div className="card" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: overdueCount > 0 ? '#E11D48' : '#64748B', fontWeight: 700, letterSpacing: '0.04em' }}>
                Jatuh Tempo / Overdue
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: overdueCount > 0 ? '#E11D48' : '#0F172A', lineHeight: 1 }}>{overdueCount}</span>
                <span style={{ fontSize: '0.8rem', color: overdueCount > 0 ? '#E11D48' : '#64748B', fontWeight: 600 }}>
                  {overdueCount > 0 ? 'Perlu Tindakan' : 'Semua Tepat Waktu'}
                </span>
              </div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: overdueCount > 0 ? '#FFE4E6' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: overdueCount > 0 ? '#E11D48' : '#64748B' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: overdueCount > 0 ? '#E11D48' : '#64748B', fontSize: '0.75rem', fontWeight: 600 }}>
              <Clock size={13} />
              <span>Batas Standar: 16:00 WIB</span>
            </div>
            {overdueCount > 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: '#FFE4E6', color: '#BE123C', fontWeight: 700 }}>
                {overdueCount} OVERDUE
              </span>
            )}
          </div>
        </div>

        {/* KPI 4: Perlu Inspeksi Fisik */}
        <div className="card" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.04em' }}>
                Perlu Inspeksi Fisik
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{pendingInspectionCount}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Pengembalian Baru</span>
              </div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A' }}>
              <ClipboardCheck size={20} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1E3A8A' }} />
              Verifikasi Foto Before / After
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#1E3A8A' }}>
              {inspectableBorrowings.length} Total
            </span>
          </div>
        </div>
      </div>

      {/* 3. SEKSI VALIDASI LAPORAN FISIK (KOMPARASI BEFORE / AFTER) */}
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header" style={{ borderBottom: '1px solid #E2E8F0', padding: '1rem 1.25rem' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardCheck size={18} color="#1E3A8A" />
              <span>Validasi Laporan Fisik & Komparasi Foto Before / After</span>
            </h3>
            <div className="card-subtitle" style={{ fontSize: '0.8rem' }}>
              Bandingkan catatan kondisi fisik serta foto visual alat saat diambil (BEFORE) vs saat dikembalikan (AFTER).
            </div>
          </div>
          <span style={{
            fontSize: '0.725rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            background: inspectableBorrowings.length > 0 ? '#EFF6FF' : '#F1F5F9',
            color: inspectableBorrowings.length > 0 ? '#1E40AF' : '#64748B'
          }}>
            {inspectableBorrowings.length} Laporan
          </span>
        </div>

        {inspectableBorrowings.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B' }}>
            <ClipboardCheck size={32} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Belum Ada Laporan Fisik Peminjaman</div>
            <p style={{ fontSize: '0.8rem', maxWidth: '480px', margin: '0.25rem auto 0' }}>
              Saat siswa menyerahkan formulir pengambilan atau pengembalian dengan foto Before/After, verifikator dapat memeriksa komparasi fisik di sini.
            </p>
          </div>
        ) : (
          <div className="table-container" style={{ margin: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No. Peminjaman</th>
                  <th>Peminjam & Siswa</th>
                  <th>Peralatan</th>
                  <th>Foto Fisik (Before / After)</th>
                  <th>Status</th>
                  <th>Temuan Fisik</th>
                  <th style={{ textAlign: 'right' }}>Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {inspectableBorrowings.slice(0, 5).map((b) => {
                  const hasReturnInspection = Boolean(b.inspeksiPengembalian);
                  const hasAnomaly = b.inspeksiPengembalian?.anomaliTerdeteksi;
                  const beforePhoto = b.fotoBefore || b.inspeksiPengambilan?.fotoBefore || b.buktiSurat;
                  const afterPhoto = b.fotoAfter || b.inspeksiPengembalian?.fotoAfter;

                  return (
                    <tr key={b.id} style={{ background: hasAnomaly ? '#FFF1F2' : 'transparent' }}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>{b.id}</td>
                      <td>
                        <strong>{b.peminjamNama}</strong>
                        <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{b.peminjamKelas}</div>
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        <strong style={{ fontSize: '0.85rem' }}>{b.peralatanNama}</strong>
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {beforePhoto ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setPreviewProofModal({
                                name: `Foto BEFORE: ${b.peralatanNama}`,
                                isImage: true,
                                dataUrl: beforePhoto.dataUrl || beforePhoto
                              })}
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#1E40AF', background: '#EFF6FF', borderColor: '#BFDBFE' }}
                              title="Lihat Foto Fisik Awal (BEFORE)"
                            >
                              <Camera size={11} />
                              <span>Before</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>-</span>
                          )}

                          {afterPhoto ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setPreviewProofModal({
                                name: `Foto AFTER: ${b.peralatanNama}`,
                                isImage: true,
                                dataUrl: afterPhoto.dataUrl || afterPhoto
                              })}
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#166534', background: '#F0FDF4', borderColor: '#BBF7D0' }}
                              title="Lihat Foto Fisik Pengembalian (AFTER)"
                            >
                              <CheckCircle size={11} />
                              <span>After</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>-</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        {hasAnomaly ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#E11D48', fontSize: '0.75rem', fontWeight: 700 }}>
                            <AlertTriangle size={13} />
                            Ada Anomali Fisik
                          </span>
                        ) : hasReturnInspection ? (
                          <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>
                            Kondisi Sesuai Awal
                          </span>
                        ) : (
                          <span style={{ color: '#D97706', fontSize: '0.75rem' }}>
                            Menunggu Pengembalian
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedBorrowingForCompare(b)}
                          style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem' }}
                        >
                          <Eye size={13} />
                          <span>Bandingkan</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. OPERATIONAL CONTROL & FILTER RIBBON */}
      <div className="card" style={{ margin: 0, overflow: 'visible' }}>
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Baris Atas: Search + Dropdown Filter Status + View Switcher */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            
            {/* Search Input dengan ⌘K */}
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari gear, kode aset, serial no, spesifikasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem', paddingRight: '2.5rem', fontSize: '0.825rem', width: '100%', height: '36px', background: '#F8FAFC' }}
              />
              <span style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.675rem',
                fontFamily: 'var(--font-mono)',
                color: '#64748B',
                background: '#E2E8F0',
                padding: '1px 5px',
                borderRadius: '4px',
                pointerEvents: 'none'
              }}>
                ⌘K
              </span>
            </div>

            {/* Filter Status & Urutan */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', height: '36px', width: 'auto', background: '#F8FAFC' }}
              >
                <option value="Semua">Status: Semua ({equipment.length})</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjam">Sedang Dipinjam</option>
                <option value="Maintenance">Maintenance / Perbaikan</option>
              </select>

              {/* View Mode Switcher: Matrix Grid vs Grouped per Kategori vs Tabel Rata */}
              <div style={{
                display: 'inline-flex',
                background: '#F1F5F9',
                padding: '2px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                gap: '2px'
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('matrix')}
                  title="Tampilan Matrix Grid Kartu Telemetri (Stitch UI)"
                  style={{
                    border: 'none',
                    background: viewMode === 'matrix' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'matrix' ? '#1E3A8A' : '#64748B',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: viewMode === 'matrix' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <LayoutGrid size={14} />
                  <span>Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('grouped')}
                  title="Tampilan Dikelompokkan per Kategori"
                  style={{
                    border: 'none',
                    background: viewMode === 'grouped' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'grouped' ? '#1E3A8A' : '#64748B',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: viewMode === 'grouped' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <FolderTree size={14} />
                  <span>Kelompok</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('flat')}
                  title="Tampilan Tabel Rata (Dense Table)"
                  style={{
                    border: 'none',
                    background: viewMode === 'flat' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'flat' ? '#1E3A8A' : '#64748B',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: viewMode === 'flat' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <List size={14} />
                  <span>Tabel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Baris Bawah: Category Pills */}
          <div style={{
            display: 'flex',
            gap: '0.35rem',
            overflowX: 'auto',
            paddingBottom: '2px',
            alignItems: 'center'
          }}>
            <button
              type="button"
              className={`btn btn-sm ${activeCategoryFilter === 'Semua' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCategoryFilter('Semua')}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', flexShrink: 0 }}
            >
              <span>Semua</span>
              <span style={{
                marginLeft: '0.35rem',
                padding: '1px 5px',
                borderRadius: '9999px',
                fontSize: '0.675rem',
                background: activeCategoryFilter === 'Semua' ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                color: activeCategoryFilter === 'Semua' ? '#FFFFFF' : '#475569'
              }}>
                {equipment.length}
              </span>
            </button>

            {allAvailableCategories.map((cat) => {
              const count = equipment.filter((e) => e.kategori === cat).length;
              const meta = getCategoryMeta(cat);
              const Icon = meta.icon;
              const isActive = activeCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveCategoryFilter(cat)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    flexShrink: 0
                  }}
                >
                  <Icon size={13} />
                  <span>{cat}</span>
                  <span style={{
                    marginLeft: '0.2rem',
                    padding: '1px 5px',
                    borderRadius: '9999px',
                    fontSize: '0.675rem',
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                    color: isActive ? '#FFFFFF' : '#475569'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. CONTENT AREA: Empty State / Matrix Grid / Grouped / Flat Table */}
        {equipment.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B' }}>
            <Inbox size={44} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
              Database Alat Studio Masih Kosong
            </h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
              Belum ada data unit aset kamera, lensa, baterai, audio, atau tata cahaya studio terdaftar.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleOpenAddModal('Kamera')}
            >
              <Plus size={16} />
              <span>Tambah Alat Pertama</span>
            </button>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B' }}>
            <Search size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
              Tidak Ada Alat Ditemukan
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#64748B' }}>
              Tidak ada data alat yang cocok dengan kata kunci atau filter yang dipilih.
            </p>
          </div>
        ) : viewMode === 'matrix' ? (
          
          /* MODE A: MATRIX GRID (HIGH-DENSITY GEAR CARDS - STITCH SCREEN 2) */
          <div style={{
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.15rem'
          }}>
            {filteredAssets.map((item) => {
              const meta = getCategoryMeta(item.kategori);
              const CatIcon = meta.icon;
              const isCam = isCameraItem(item);
              const camReq = isCam ? getCameraRequirements(item) : null;
              const isLens = isLensItem(item);
              const lensMount = isLens ? getLensMountType(item) : null;
              
              // Smart illustration or decoded Stitch photo
              const is2470Lens = (item.nama || '').toLowerCase().includes('24-70');
              const hasStitchPhoto = is2470Lens;

              return (
                <div
                  key={item.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
                  }}
                  className="hover:border-blue-400 hover:shadow-md"
                >
                  {/* Card Body */}
                  <div style={{ padding: '1.15rem' }}>
                    {/* Head Code & Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          background: '#EFF6FF',
                          color: '#1E40AF',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          border: '1px solid #DBEAFE'
                        }}>
                          {item.kode || `#EQ-${item.id}`}
                        </span>
                        <span style={{
                          fontSize: '0.725rem',
                          color: meta.color,
                          fontWeight: 600,
                          background: meta.bg,
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {item.kategori || 'Gear'}
                        </span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Thumbnail & Title */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '8px',
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {hasStitchPhoto ? (
                          <img
                            src={sonyLensImg}
                            alt={item.nama}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ color: meta.color }}>
                            <CatIcon size={26} />
                          </div>
                        )}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '0.925rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }} title={item.nama}>
                          {item.nama}
                        </h4>
                        <div style={{ fontSize: '0.725rem', color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
                          Kondisi: <strong style={{ color: '#334155' }}>{item.kondisiFisik || 'Baik'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Telemetry Box */}
                    <div style={{
                      background: '#F8FAFC',
                      border: '1px solid #F1F5F9',
                      borderRadius: '8px',
                      padding: '0.65rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      fontSize: '0.75rem'
                    }}>
                      {/* Compatibility / Mount Note */}
                      {camReq && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Eye size={12} color="#1E40AF" />
                            Kebutuhan Lensa
                          </span>
                          <span style={{ fontWeight: 700, color: camReq.lensType === 'EF-M' ? '#6D28D9' : '#1E40AF' }}>
                            {camReq.needsAdapter ? 'Adapter + EF' : camReq.lensLabel}
                          </span>
                        </div>
                      )}

                      {isLens && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Tag size={12} color="#7C3AED" />
                            Tipe Mount
                          </span>
                          <span style={{ fontWeight: 700, color: lensMount === 'EF-M' ? '#7E22CE' : '#4338CA' }}>
                            {lensMount === 'EF-M' ? 'Mount EF-M' : 'Mount EF'}
                          </span>
                        </div>
                      )}

                      {/* Spesifikasi / Keterangan Singkat */}
                      <div style={{ color: '#475569', fontSize: '0.725rem', lineHeight: 1.35 }}>
                        <span style={{ color: '#94A3B8' }}>Keterangan: </span>
                        {item.spesifikasi || '-'}
                      </div>
                    </div>

                    {/* Physical Location Metadata */}
                    <div style={{
                      marginTop: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.725rem',
                      color: '#64748B'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FolderTree size={12} color="#94A3B8" />
                        <span>{item.lokasiRak || 'Loker A-01 (Dry Cabinet 1)'}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.675rem', color: '#94A3B8' }}>
                        Verifikasi QC
                      </span>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div style={{
                    padding: '0.55rem 1rem',
                    background: '#F8FAFC',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEditModal(item)}
                      style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Edit size={12} />
                      <span>Edit Gear</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteAsset(item.id)}
                        style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}
                        title="Hapus Alat"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        ) : viewMode === 'grouped' ? (
          
          /* MODE B: GROUPED BY CATEGORY */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem' }}>
            {Object.keys(groupedByCategoryAssets).map((catName) => {
              const items = groupedByCategoryAssets[catName];
              const meta = getCategoryMeta(catName);
              const CatIcon = meta.icon;

              return (
                <div key={catName} style={{
                  background: '#FFFFFF',
                  border: `1px solid ${meta.border}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  {/* Category Header Banner */}
                  <div style={{
                    background: meta.bg,
                    borderBottom: `1px solid ${meta.border}`,
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        border: `1px solid ${meta.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: meta.color
                      }}>
                        <CatIcon size={16} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                        {catName}
                      </h4>
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        color: meta.color,
                        background: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: `1px solid ${meta.border}`
                      }}>
                        {items.length} Unit
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenAddModal(catName)}
                      style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Plus size={13} />
                      <span>Tambah di {catName}</span>
                    </button>
                  </div>

                  {/* Table per Category */}
                  <div className="table-container" style={{ margin: 0 }}>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Nama Alat & Kode</th>
                          <th>Kondisi Fisik</th>
                          <th>Keterangan Alat</th>
                          <th>Lokasi Penyimpanan</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => {
                          const isCam = isCameraItem(item);
                          const camReq = isCam ? getCameraRequirements(item) : null;
                          const isLens = isLensItem(item);
                          const lensMount = isLens ? getLensMountType(item) : null;
                          return (
                            <tr key={item.id}>
                              <td>
                                <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{item.nama}</strong>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                                  {item.kode || item.id}
                                </div>
                                {camReq && (
                                  <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                    <span style={{
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      color: camReq.lensType === 'EF-M' ? '#6D28D9' : '#1E40AF',
                                      background: camReq.lensType === 'EF-M' ? '#F5F3FF' : '#EFF6FF',
                                      border: `1px solid ${camReq.lensType === 'EF-M' ? '#DDD6FE' : '#BFDBFE'}`,
                                      padding: '1px 6px',
                                      borderRadius: '4px'
                                    }}>
                                      {camReq.needsAdapter ? 'Adapter EF-M to EF + ' : ''}{camReq.lensLabel}
                                    </span>
                                  </div>
                                )}
                                {isLens && (
                                  <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                    <span style={{
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      color: lensMount === 'EF-M' ? '#7E22CE' : '#4338CA',
                                      background: lensMount === 'EF-M' ? '#FAF5FF' : '#EEF2FF',
                                      border: `1px solid ${lensMount === 'EF-M' ? '#E9D5FF' : '#C7D2FE'}`,
                                      padding: '1px 6px',
                                      borderRadius: '4px'
                                    }}>
                                      {lensMount === 'EF-M' ? 'Mount: Lensa EF-M' : 'Mount: Lensa EF'}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>
                                  {item.kondisiFisik || 'Baik'}
                                </span>
                              </td>
                              <td style={{ maxWidth: '300px', fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>
                                {item.spesifikasi || '-'}
                              </td>
                              <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                                {item.lokasiRak || 'Dry Cabinet 1'}
                              </td>
                              <td>
                                <StatusBadge status={item.status} />
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleOpenEditModal(item)}
                                    title="Edit Data Alat"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteAsset(item.id)}
                                    title="Hapus Data Alat"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (
          
          /* MODE C: FLAT TABLE (DENSE TABLE) */
          <div className="table-container" style={{ margin: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Alat</th>
                  <th>Kategori</th>
                  <th>Kondisi Fisik</th>
                  <th>Keterangan Alat</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((item) => {
                  const meta = getCategoryMeta(item.kategori);
                  const CatIcon = meta.icon;
                  const isCam = isCameraItem(item);
                  const camReq = isCam ? getCameraRequirements(item) : null;
                  const isLens = isLensItem(item);
                  const lensMount = isLens ? getLensMountType(item) : null;
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong style={{ fontSize: '0.9rem' }}>{item.nama}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                          {item.kode || item.id}
                        </div>
                        {camReq && (
                          <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: camReq.lensType === 'EF-M' ? '#6D28D9' : '#1E40AF',
                              background: camReq.lensType === 'EF-M' ? '#F5F3FF' : '#EFF6FF',
                              border: `1px solid ${camReq.lensType === 'EF-M' ? '#DDD6FE' : '#BFDBFE'}`,
                              padding: '1px 6px',
                              borderRadius: '4px'
                            }}>
                              {camReq.needsAdapter ? 'Adapter EF-M to EF + ' : ''}{camReq.lensLabel}
                            </span>
                          </div>
                        )}
                        {isLens && (
                          <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: lensMount === 'EF-M' ? '#7E22CE' : '#4338CA',
                              background: lensMount === 'EF-M' ? '#FAF5FF' : '#EEF2FF',
                              border: `1px solid ${lensMount === 'EF-M' ? '#E9D5FF' : '#C7D2FE'}`,
                              padding: '1px 6px',
                              borderRadius: '4px'
                            }}>
                              {lensMount === 'EF-M' ? 'Mount: Lensa EF-M' : 'Mount: Lensa EF'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: meta.color,
                          background: meta.bg,
                          border: `1px solid ${meta.border}`,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <CatIcon size={12} />
                          <span>{item.kategori || 'Peralatan'}</span>
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>
                          {item.kondisiFisik || 'Baik'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '300px', fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>
                        {item.spesifikasi || '-'}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                        {item.lokasiRak || 'Dry Cabinet 1'}
                      </td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Data Alat"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteAsset(item.id)}
                            title="Hapus Data Alat"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL KOMPARASI INSPEKSI FISIK BERDAMPINGAN (SIDE-BY-SIDE) */}
      {selectedBorrowingForCompare && (
        <Modal
          isOpen={Boolean(selectedBorrowingForCompare)}
          onClose={() => setSelectedBorrowingForCompare(null)}
          size="large"
          title={`Validasi Perbandingan Fisik (Peminjaman: ${selectedBorrowingForCompare.id})`}
          footer={
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setSelectedBorrowingForCompare(null)}
            >
              Selesai Validasi
            </button>
          }
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#475569' }}>
              Peminjam: <strong>{selectedBorrowingForCompare.peminjamNama}</strong> ({selectedBorrowingForCompare.peminjamKelas}) • Unit: <strong>{selectedBorrowingForCompare.peralatanNama}</strong>
            </div>
          </div>

          <div className="inspection-comparison-grid">
            <div className="inspection-column pickup">
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E3A8A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ClipboardCheck size={18} />
                <span>1. Kondisi Saat Diambil (BEFORE)</span>
              </div>

              {/* FOTO BEFORE */}
              {(() => {
                const beforePhoto = selectedBorrowingForCompare.fotoBefore || selectedBorrowingForCompare.inspeksiPengambilan?.fotoBefore || selectedBorrowingForCompare.buktiSurat;
                if (!beforePhoto) return null;
                const src = beforePhoto.dataUrl || beforePhoto;
                return (
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1E40AF', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                      <Camera size={11} />
                      <span>FOTO FISIK AWAL (BEFORE)</span>
                    </div>
                    <div
                      style={{ height: '160px', borderRadius: '8px', overflow: 'hidden', background: '#0F172A', cursor: 'pointer', border: '1.5px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => setPreviewProofModal({ name: `Foto BEFORE: ${selectedBorrowingForCompare.peralatanNama}`, isImage: true, dataUrl: src })}
                      title="Klik untuk memperbesar foto awal (BEFORE)"
                    >
                      <img src={src} alt="Foto Before" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  </div>
                );
              })()}

              {selectedBorrowingForCompare.inspeksiPengambilan ? (
                <>
                  <div className="inspection-item">
                    <span>Kondisi Fisik:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengambilan.kondisiFisik}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Keterangan Alat:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengambilan.keteranganAlat || selectedBorrowingForCompare.inspeksiPengambilan.kelengkapanAksesori || '-'}</strong>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.5rem' }}>
                    Diperiksa pada: {selectedBorrowingForCompare.inspeksiPengambilan.tanggalInspeksi}
                  </div>
                </>
              ) : (
                <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Data awal tidak tersedia</div>
              )}
            </div>

            <div className="inspection-column return">
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#059669', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={18} />
                <span>2. Kondisi Saat Dikembalikan (AFTER)</span>
              </div>

              {/* FOTO AFTER */}
              {(() => {
                const afterPhoto = selectedBorrowingForCompare.fotoAfter || selectedBorrowingForCompare.inspeksiPengembalian?.fotoAfter;
                if (afterPhoto) {
                  const src = afterPhoto.dataUrl || afterPhoto;
                  return (
                    <div style={{ marginBottom: '0.85rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                        <CheckCircle size={11} />
                        <span>FOTO FISIK PENGEMBALIAN (AFTER)</span>
                      </div>
                      <div
                        style={{ height: '160px', borderRadius: '8px', overflow: 'hidden', background: '#0F172A', cursor: 'pointer', border: '1.5px solid #86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setPreviewProofModal({ name: `Foto AFTER: ${selectedBorrowingForCompare.peralatanNama}`, isImage: true, dataUrl: src })}
                        title="Klik untuk memperbesar foto akhir (AFTER)"
                      >
                        <img src={src} alt="Foto After" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    </div>
                  );
                }
                return (
                  <div style={{ padding: '0.75rem', background: '#FFFBEB', border: '1px dashed #FDE68A', borderRadius: '6px', fontSize: '0.75rem', color: '#B45309', textAlign: 'center', marginBottom: '0.75rem' }}>
                    Belum ada foto fisik pengembalian (AFTER)
                  </div>
                );
              })()}

              {selectedBorrowingForCompare.inspeksiPengembalian ? (
                <>
                  <div className={`inspection-item ${selectedBorrowingForCompare.inspeksiPengembalian.anomaliTerdeteksi ? 'discrepancy' : ''}`}>
                    <span>Kondisi Fisik Akhir:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengembalian.kondisiFisikAkhir}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Keterangan Alat:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengembalian.keteranganAlat || selectedBorrowingForCompare.inspeksiPengembalian.catatanKendala || '-'}</strong>
                  </div>

                  {selectedBorrowingForCompare.inspeksiPengembalian.catatanKendala && (
                    <div style={{
                      marginTop: '0.75rem',
                      background: '#FFF1F2',
                      border: '1px solid #FECDD3',
                      borderRadius: '6px',
                      padding: '0.65rem',
                      color: '#9F1239',
                      fontSize: '0.8rem'
                    }}>
                      <strong>Catatan Kendala Peminjam:</strong><br />
                      {selectedBorrowingForCompare.inspeksiPengembalian.catatanKendala}
                    </div>
                  )}

                  <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.5rem' }}>
                    Dikembalikan pada: {selectedBorrowingForCompare.inspeksiPengembalian.tanggalInspeksi}
                  </div>
                </>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#D97706', fontSize: '0.85rem' }}>
                  ⏳ Peminjam belum menyerahkan formulir inspeksi pengembalian di sistem.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL TAMBAH / EDIT ALAT (PRESETS & MOUNT CONTROLS) */}
      <Modal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        title={editingAssetId ? 'Edit Data Alat' : 'Tambah Data Alat Baru'}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAssetModalOpen(false)}>
              Batal
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveAsset}>
              Simpan Data Alat
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAsset}>
          {/* Pilihan Kategori Alat */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Kategori Alat *</span>
              <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 500 }}>Dikelompokkan ke inventaris studio</span>
            </label>
            <select
              className="form-select"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              required
            >
              <option value="Kamera">Kamera (Body Only / Mirrorless / DSLR)</option>
              <option value="Lensa">Lensa (Prime / Zoom / Tele / Wide)</option>
              <option value="Baterai">Baterai (LP-E17, LP-E10, dll.)</option>
              <option value="Memory Card">Memory Card (SD Card / Micro SD / CF)</option>
              <option value="Audio & Mikrofon">Audio & Mikrofon (Wireless / Shotgun / Recorder)</option>
              <option value="Lighting & Tata Cahaya">Lighting & Tata Cahaya (LED / Softbox / Continuous)</option>
              <option value="Tripod & Aksesori">Tripod & Aksesori (Gimbal / Rig / Stand)</option>
              <option value="Ruang Studio">Ruang Studio (Podcast / Green Screen / Audio Suite)</option>
              <option value="Lainnya">Lainnya (Kategori Kustom...)</option>
            </select>
          </div>

          {kategori === 'Lainnya' && (
            <div className="form-group" style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <label className="form-label">Nama Kategori Kustom *</label>
              <input
                type="text"
                className="form-input"
                value={customKategori}
                onChange={(e) => setCustomKategori(e.target.value)}
                placeholder="Contoh: Drone / Teleprompter / Properti..."
                required={kategori === 'Lainnya'}
              />
            </div>
          )}

          {/* Presets Kamera Resmi */}
          {kategori === 'Kamera' && (
            <div style={{ marginBottom: '1rem', background: '#EFF6FF', border: '1px dashed #93C5FD', borderRadius: '8px', padding: '0.65rem 0.75rem' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#1E40AF', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={13} color="#2563EB" />
                <span>Preset Kamera Resmi Creative Corner:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => {
                    setNama('CANON EOS M6 II');
                    setKondisiFisik('Sangat Baik');
                    setSpesifikasi('WAJIB PAKAI ADAPTER EOS EF-M TO EOS EF DAN CUMA BISA PAKAI LENSA DSLR (EF).');
                  }}
                >
                  Canon EOS M6 II (Adapter + EF)
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => {
                    setNama('CANON EOS M6 I');
                    setKondisiFisik('Sangat Baik');
                    setSpesifikasi('PAKAI LENSA EOS EF-M (Mirrorless Murni).');
                  }}
                >
                  Canon EOS M6 I (EF-M)
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => {
                    setNama('CANON EOS 250D');
                    setKondisiFisik('Sangat Baik');
                    setSpesifikasi('PAKAI LENSA EOS EF.');
                  }}
                >
                  Canon EOS 250D (EF)
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => {
                    setNama('CANON EOS 1500D');
                    setKondisiFisik('Sangat Baik');
                    setSpesifikasi('PAKAI LENSA EOS EF.');
                  }}
                >
                  Canon EOS 1500D (EF)
                </button>
              </div>
            </div>
          )}

          {/* Presets Lensa Resmi & Toggle Mount */}
          {kategori === 'Lensa' && (() => {
            const lensText = `${(nama || '').toLowerCase()} ${(spesifikasi || '').toLowerCase()}`;
            const isAdapterMentioned = 
              lensText.includes('ef-m to ef') || 
              lensText.includes('ef-m ke ef') || 
              lensText.includes('adapter ef-m') ||
              lensText.includes('+ adapter');
            
            const isEfmActive = (lensText.includes('ef-m') || lensText.includes('efm')) && !isAdapterMentioned;
            const isEfActive = !isEfmActive && (
              lensText.includes('tipe ef') || 
              lensText.includes('mount: lensa ef') || 
              lensText.includes('lensa ef') || 
              lensText.includes('ef-s') || 
              lensText.includes('dslr') ||
              (spesifikasi || '').includes('Lensa EF')
            );

            const handleToggleMount = (targetMount) => {
              const efSpec = 'Mount: Lensa EF (Cocok untuk 250D, 1500D, & M6 II + Adapter)';
              const efmSpec = 'Mount: Lensa EF-M (Khusus Canon EOS M6 I)';

              let clean = (spesifikasi || '')
                .replace(/•?\s*Mount:\s*Lensa\s*(EF-M|EF)[^•\n]*/gi, '')
                .replace(/•?\s*Tipe\s*Lensa\s*(EF-M|EF)[^•\n]*/gi, '')
                .replace(/•?\s*Lensa\s*Canon\s*(EF-M|EF)\s*(\/|Mirrorless)[^•\n]*/gi, '')
                .trim()
                .replace(/^•\s*/, '')
                .replace(/\s*•$/, '');

              const newMount = targetMount === 'EF' ? efSpec : efmSpec;
              if (!clean) {
                setSpesifikasi(newMount);
              } else {
                setSpesifikasi(`${clean} • ${newMount}`);
              }
            };

            return (
              <div style={{ marginBottom: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Eye size={14} color="#7C3AED" />
                    <span>Pilihan Tipe Mount Lensa:</span>
                  </div>
                  {(isEfActive || isEfmActive) && (
                    <span style={{ fontSize: '0.675rem', fontWeight: 600, color: isEfActive ? '#4338CA' : '#7E22CE', background: isEfActive ? '#EEF2FF' : '#FAF5FF', padding: '0.1rem 0.45rem', borderRadius: '10px', border: `1px solid ${isEfActive ? '#C7D2FE' : '#E9D5FF'}` }}>
                      Terpilih: {isEfActive ? 'Tipe EF (DSLR)' : 'Tipe EF-M (Mirrorless)'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleMount('EF')}
                    style={{
                      textAlign: 'left',
                      background: isEfActive ? '#EEF2FF' : '#FFFFFF',
                      border: isEfActive ? '2px solid #6366F1' : '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '0.5rem 0.65rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.775rem', color: isEfActive ? '#4338CA' : '#1E293B' }}>
                        Tipe Lensa EF (DSLR)
                      </span>
                      {isEfActive && <CheckCircle size={12} color="#4F46E5" />}
                    </div>
                    <div style={{ fontSize: '0.675rem', color: isEfActive ? '#3730A3' : '#64748B' }}>
                      Cocok: 250D, 1500D, & M6 II (+ adapter)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleMount('EF-M')}
                    style={{
                      textAlign: 'left',
                      background: isEfmActive ? '#FAF5FF' : '#FFFFFF',
                      border: isEfmActive ? '2px solid #A855F7' : '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '0.5rem 0.65rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.775rem', color: isEfmActive ? '#7E22CE' : '#1E293B' }}>
                        Tipe Lensa EF-M (Mirrorless)
                      </span>
                      {isEfmActive && <CheckCircle size={12} color="#9333EA" />}
                    </div>
                    <div style={{ fontSize: '0.675rem', color: isEfmActive ? '#6B21A8' : '#64748B' }}>
                      Khusus untuk: Canon EOS M6 I
                    </div>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', borderTop: '1px dashed #E2E8F0', paddingTop: '0.45rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.675rem', padding: '0.2rem 0.45rem' }}
                    onClick={() => {
                      setNama('Lensa Canon EF 50mm f/1.8 STM');
                      setKondisiFisik('100% Optik Bersih & Normal');
                      setSpesifikasi('Mount: Lensa EF (Cocok untuk EOS 250D, 1500D, & M6 II + Adapter)');
                    }}
                  >
                    Canon EF 50mm f/1.8
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.675rem', padding: '0.2rem 0.45rem' }}
                    onClick={() => {
                      setNama('Sony FE 24-70mm f/2.8 GM II');
                      setKondisiFisik('100% Optik Prima & UV Filter');
                      setSpesifikasi('Mount: Sony E-Mount (G Master Standard Zoom Lens)');
                    }}
                  >
                    Sony FE 24-70mm GM II
                  </button>
                </div>
              </div>
            );
          })()}

          <div className="form-group">
            <label className="form-label">Nama Alat *</label>
            <input
              type="text"
              className="form-input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: CANON EOS M6 II, Sony FE 24-70mm GM II..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Kode / Barcode *</label>
              <input
                type="text"
                className="form-input"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="EQ-CAM-004"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lokasi Penyimpanan *</label>
              <input
                type="text"
                className="form-input"
                value={lokasiRak}
                onChange={(e) => setLokasiRak(e.target.value)}
                placeholder="Loker A-02 (Dry Cabinet 1)"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kondisi Fisik *</label>
            <input
              type="text"
              className="form-input"
              value={kondisiFisik}
              onChange={(e) => setKondisiFisik(e.target.value)}
              placeholder="Contoh: Sangat Baik, Sensor bersih, Shutter normal..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Keterangan Alat *</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={spesifikasi}
              onChange={(e) => setSpesifikasi(e.target.value)}
              placeholder="Contoh: Kelengkapan unit, strap, cap sensor, nomor seri..."
              required
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* MODAL PRATINJAU BUKTI SURAT PEMINJAMAN */}
      {previewProofModal && (
        <Modal
          isOpen={Boolean(previewProofModal)}
          onClose={() => setPreviewProofModal(null)}
          size="large"
          title={`Bukti Surat / Foto: ${previewProofModal.name || 'Dokumen'}`}
          footer={
            <button type="button" className="btn btn-secondary" onClick={() => setPreviewProofModal(null)}>
              Tutup
            </button>
          }
        >
          <div style={{ textAlign: 'center' }}>
            {previewProofModal.isImage ? (
              <div style={{ maxHeight: '520px', overflowY: 'auto', background: '#0F172A', borderRadius: '8px', padding: '1rem' }}>
                <img
                  src={previewProofModal.dataUrl}
                  alt="Bukti Foto"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                />
              </div>
            ) : (
              <div style={{ padding: '2.5rem 1.5rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <FileText size={48} color="#1E3A8A" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                  {previewProofModal.name}
                </h4>
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};

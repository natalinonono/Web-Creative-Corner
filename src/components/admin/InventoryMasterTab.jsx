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
  Tag
} from 'lucide-react';

export const STANDARD_CATEGORIES = [
  'Kamera',
  'Lensa',
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
  const [groupByCategory, setGroupByCategory] = useState(true);

  // Modal State untuk Tambah / Edit Alat Master (Nama, Kategori, Kondisi Fisik, Keterangan)
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Kamera');
  const [customKategori, setCustomKategori] = useState('');
  const [kondisiFisik, setKondisiFisik] = useState('Sangat Baik');
  const [spesifikasi, setSpesifikasi] = useState('');

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

  // Filter Alat berdasarkan pencarian dan kategori terpilih
  const filteredAssets = equipment.filter((eq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      (eq.nama || '').toLowerCase().includes(q) ||
      (eq.kode || '').toLowerCase().includes(q) ||
      (eq.kategori || '').toLowerCase().includes(q) ||
      (eq.kondisiFisik || '').toLowerCase().includes(q) ||
      (eq.spesifikasi || '').toLowerCase().includes(q)
    );
    const matchesCategory = activeCategoryFilter === 'Semua' || eq.kategori === activeCategoryFilter;
    return matchesSearch && matchesCategory;
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
        lokasiRak: 'Creative Corner Studio'
      });
    } else {
      addEquipment({
        kode: `EQ-${String(equipment.length + 1).padStart(2, '0')}`,
        nama: nama.trim(),
        kategori: finalKategori,
        kondisiFisik: kondisiFisik.trim(),
        spesifikasi: spesifikasi.trim(),
        baterai: null,
        lokasiRak: 'Creative Corner Studio'
      });
    }

    setIsAssetModalOpen(false);
  };

  const handleDeleteAsset = (id) => {
    if (window.confirm('Yakin ingin menghapus unit aset ini dari database studio?')) {
      deleteEquipment(id);
    }
  };

  const inspectableBorrowings = borrowings.filter((b) => b.inspeksiPengambilan || b.buktiSurat);

  return (
    <div>
      {/* 1. SEKSI VALIDASI LAPORAN FISIK (PERBANDINGAN INSPEKSI BERDAMPINGAN) */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ClipboardCheck size={20} color="#1E3A8A" />
              <span>Validasi Laporan Fisik & Surat Peminjaman (Side-by-Side)</span>
            </h3>
            <div className="card-subtitle">
              Bandingkan catatan kondisi fisik saat alat diambil vs dikembalikan, serta verifikasi kelengkapan berkas bukti surat peminjaman resmi.
            </div>
          </div>
        </div>

        {inspectableBorrowings.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B' }}>
            <ClipboardCheck size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600, color: '#334155' }}>Belum Ada Laporan Fisik Peminjaman</div>
            <p style={{ fontSize: '0.8rem' }}>
              Saat siswa mengisi Formulir Peminjaman dan Inspeksi, data komparasi fisik & bukti surat resmi akan muncul di sini untuk divalidasi.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No. Peminjaman</th>
                  <th>Peminjam & Siswa</th>
                  <th>Peralatan</th>
                  <th>Bukti Surat</th>
                  <th>Status Pengembalian</th>
                  <th>Catatan Temuan / Anomali</th>
                  <th>Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {inspectableBorrowings.map((b) => {
                  const hasReturnInspection = Boolean(b.inspeksiPengembalian);
                  const hasAnomaly = b.inspeksiPengembalian?.anomaliTerdeteksi;

                  return (
                    <tr key={b.id} style={{ background: hasAnomaly ? '#FFF1F2' : 'transparent' }}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{b.id}</td>
                      <td>
                        <strong>{b.peminjamNama}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{b.peminjamKelas}</div>
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <strong>{b.peralatanNama}</strong>
                      </td>
                      <td>
                        {b.buktiSurat ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setPreviewProofModal(b.buktiSurat)}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Eye size={12} />
                            <span>Lihat Surat</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Tanpa Berkas</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        {hasAnomaly ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: '#E11D48',
                            fontSize: '0.775rem',
                            fontWeight: 700
                          }}>
                            <AlertTriangle size={14} />
                            Perlu Validasi: Ada Catatan Kendala Fisik
                          </span>
                        ) : hasReturnInspection ? (
                          <span style={{ color: '#059669', fontSize: '0.775rem', fontWeight: 600 }}>
                            ✓ Kondisi Fisik Normal Sesuai Awal
                          </span>
                        ) : (
                          <span style={{ color: '#D97706', fontSize: '0.775rem' }}>
                            Menunggu formulir pengembalian siswa
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedBorrowingForCompare(b)}
                          id={`btn-compare-${b.id}`}
                        >
                          <Eye size={14} />
                          <span>Bandingkan Fisik</span>
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

      {/* 2. MASTER DATA ASET (CRUD LENGKAP) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Camera size={20} color="#1E3A8A" />
              <span>Daftar Data Alat Studio Creative Corner</span>
            </h3>
            <div className="card-subtitle">
              Kelola daftar nama alat, kondisi fisik, dan keterangan alat studio.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari nama alat / keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem', fontSize: '0.825rem', width: '220px' }}
              />
            </div>

            {/* View Mode Toggle: Grouped vs Flat */}
            <button
              type="button"
              className={`btn btn-sm ${groupByCategory ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setGroupByCategory(!groupByCategory)}
              title={groupByCategory ? "Tampilan Dikelompokkan per Kategori (Aktif)" : "Beralih ke Tampilan Tabel Rata"}
              style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FolderTree size={14} />
              <span>{groupByCategory ? 'Kelompok Kategori: Aktif' : 'Tabel Rata'}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleOpenAddModal(activeCategoryFilter)}
              id="btn-add-asset-master"
            >
              <Plus size={16} />
              <span>Tambah Alat Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Tab Kategori Alat */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.65rem 1.25rem',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          overflowX: 'auto',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Kategori:
          </span>
          <button
            type="button"
            className={`btn btn-sm ${activeCategoryFilter === 'Semua' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveCategoryFilter('Semua')}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            <span>Semua</span>
            <span style={{
              marginLeft: '0.35rem',
              padding: '1px 6px',
              borderRadius: '9999px',
              fontSize: '0.7rem',
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
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Icon size={13} />
                <span>{cat}</span>
                <span style={{
                  marginLeft: '0.15rem',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                  color: isActive ? '#FFFFFF' : '#475569'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Master Table atau Empty State */}
        {equipment.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B' }}>
            <Inbox size={42} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
              Database Alat Studio Masih Kosong
            </h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
              Belum ada data alat studio. Silakan klik tombol di bawah untuk menambah data alat berdasarkan kategori (Kamera, Lensa, Audio, Lighting, Tripod/Aksesori, Ruang Studio).
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
          <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B' }}>
            <Search size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
              Tidak Ada Alat Ditemukan
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#64748B' }}>
              Tidak ada data alat yang cocok dengan kata kunci atau kategori yang dipilih.
            </p>
          </div>
        ) : groupByCategory ? (
          /* TAMPILAN DIKELOMPOKKAN PER KATEGORI */
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
                          <th>Nama Alat</th>
                          <th>Kondisi Fisik</th>
                          <th>Keterangan Alat</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{item.nama}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                                {item.kode || item.id}
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>
                                {item.kondisiFisik || 'Baik'}
                              </span>
                            </td>
                            <td style={{ maxWidth: '340px', fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>
                              {item.spesifikasi || '-'}
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TAMPILAN TABEL RATA (FLAT TABLE) */
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Alat</th>
                  <th>Kategori</th>
                  <th>Kondisi Fisik</th>
                  <th>Keterangan Alat</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((item) => {
                  const meta = getCategoryMeta(item.kategori);
                  const CatIcon = meta.icon;
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong style={{ fontSize: '0.9rem' }}>{item.nama}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                          {item.kode || item.id}
                        </div>
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
                      <td style={{ maxWidth: '320px', fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>
                        {item.spesifikasi || '-'}
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
                <span>1. Kondisi Saat Diambil (Awal)</span>
              </div>

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
                <span>2. Kondisi Saat Dikembalikan (Akhir)</span>
              </div>

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

      {/* MODAL TAMBAH / EDIT ALAT (DIKELOMPOKKAN BERDASARKAN KATEGORI) */}
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
              <option value="Kamera">📷 Kamera (Body Only / Mirrorless / DSLR)</option>
              <option value="Lensa">🔍 Lensa (Prime / Zoom / Tele / Wide)</option>
              <option value="Audio & Mikrofon">🎙️ Audio & Mikrofon (Wireless / Shotgun / Recorder)</option>
              <option value="Lighting & Tata Cahaya">💡 Lighting & Tata Cahaya (LED / Softbox / Continuous)</option>
              <option value="Tripod & Aksesori">🎬 Tripod & Aksesori (Gimbal / Rig / Stand / Memori)</option>
              <option value="Ruang Studio">🏢 Ruang Studio (Podcast / Green Screen / Audio Suite)</option>
              <option value="Lainnya">📦 Lainnya (Kategori Kustom...)</option>
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

          <div className="form-group">
            <label className="form-label">Nama Alat *</label>
            <input
              type="text"
              className="form-input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder={
                kategori === 'Kamera' ? 'Contoh: Sony Alpha 7 IV, Canon EOS R6...' :
                kategori === 'Lensa' ? 'Contoh: Sony FE 24-70mm f/2.8 GM, Sigma 35mm f/1.4...' :
                kategori === 'Audio & Mikrofon' ? 'Contoh: DJI Mic 2 Wireless, Rode VideoMic Pro...' :
                kategori === 'Lighting & Tata Cahaya' ? 'Contoh: Godox SL-60W, Amaran 200d, Ring Light...' :
                kategori === 'Ruang Studio' ? 'Contoh: Studio Podcast Utama, Studio Green Screen...' :
                'Contoh: Tripod E-Image Heavy Duty, Gimbal DJI RS3...'
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {kategori === 'Kamera' ? 'Kondisi Fisik Kamera *' :
               kategori === 'Lensa' ? 'Kondisi Fisik Lensa *' :
               kategori === 'Audio & Mikrofon' ? 'Kondisi Fisik Audio *' :
               kategori === 'Ruang Studio' ? 'Kondisi Fisik Ruangan *' : 'Kondisi Fisik *'}
            </label>
            <input
              type="text"
              className="form-input"
              value={kondisiFisik}
              onChange={(e) => setKondisiFisik(e.target.value)}
              placeholder={
                kategori === 'Kamera' ? 'Contoh: Sangat Baik, Sensor bersih tanpa jamur, Shutter normal...' :
                kategori === 'Lensa' ? 'Contoh: Optik bening tanpa jamur/goresan, Autofokus responsif...' :
                kategori === 'Ruang Studio' ? 'Contoh: AC dingin, Kedap suara optimal, Rapi & bersih...' :
                'Contoh: Sangat Baik (100%), Mulus, Siap pakai...'
              }
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
              placeholder={
                kategori === 'Kamera' ? 'Contoh: Body only, kelengkapan strap & cap sensor, nomor seri, catatan pemakaian...' :
                kategori === 'Lensa' ? 'Contoh: Lensa mount E-mount, kelengkapan cap depan-belakang & hood, nomor seri...' :
                'Contoh: Kelengkapan unit, tas, strap, kabel, nomor seri, catatan pemakaian...'
              }
              required
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* MODAL PRATINJAU BUKTI SURAT PEMINJAMAN RESMI */}
      {previewProofModal && (
        <Modal
          isOpen={Boolean(previewProofModal)}
          onClose={() => setPreviewProofModal(null)}
          size="large"
          title={`Bukti Surat Peminjaman: ${previewProofModal.name || 'Dokumen Surat'}`}
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
                  alt="Bukti Surat Peminjaman"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                />
              </div>
            ) : (
              <div style={{ padding: '2.5rem 1.5rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <FileText size={48} color="#1E3A8A" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                  {previewProofModal.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
                  Tipe File: {previewProofModal.type} • Ukuran: {previewProofModal.size} • Diunggah: {previewProofModal.uploadedAt}
                </p>
                {previewProofModal.dataUrl && (
                  <a
                    href={previewProofModal.dataUrl}
                    download={previewProofModal.name}
                    className="btn btn-primary btn-sm"
                  >
                    <Download size={14} />
                    <span>Unduh Berkas Surat</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

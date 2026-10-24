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
  Download
} from 'lucide-react';

export const InventoryMasterTab = () => {
  const { 
    equipment, 
    addEquipment, 
    updateEquipment, 
    deleteEquipment, 
    borrowings 
  } = useStudio();

  const [activeKategori, setActiveKategori] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State untuk Tambah / Edit Aset Master
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Kamera');
  const [spesifikasi, setSpesifikasi] = useState('');
  const [kondisiFisik, setKondisiFisik] = useState('Sangat Baik (100%)');
  const [baterai, setBaterai] = useState(100);
  const [lokasiRak, setLokasiRak] = useState('');

  // Modal State untuk Validasi Laporan Fisik (Side-by-Side)
  const [selectedBorrowingForCompare, setSelectedBorrowingForCompare] = useState(null);
  const [previewProofModal, setPreviewProofModal] = useState(null);

  // Filter Aset
  const filteredAssets = equipment.filter((eq) => {
    const matchCat = activeKategori === 'Semua' || eq.kategori === activeKategori;
    const matchSearch = eq.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        eq.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        eq.spesifikasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAddModal = () => {
    setEditingAssetId(null);
    setKode(`EQ-${String(equipment.length + 1).padStart(2, '0')}`);
    setNama('');
    setKategori('Kamera');
    setSpesifikasi('');
    setKondisiFisik('Sangat Baik (100%)');
    setBaterai(100);
    setLokasiRak('Lemari Kering Studio A-1');
    setIsAssetModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingAssetId(item.id);
    setKode(item.kode);
    setNama(item.nama);
    setKategori(item.kategori);
    setSpesifikasi(item.spesifikasi);
    setKondisiFisik(item.kondisiFisik);
    setBaterai(item.baterai !== null ? item.baterai : 100);
    setLokasiRak(item.lokasiRak);
    setIsAssetModalOpen(true);
  };

  const getKondisiFieldInfo = (cat) => {
    switch (cat) {
      case 'Kamera':
        return {
          label: 'Kondisi Kamera & Sensor *',
          placeholder: 'Contoh: Sensor bersih bebas debu, fungsi shutter normal, bodi mulus tanpa lecet, tombol & dial berfungsi optimal...'
        };
      case 'Lensa':
        return {
          label: 'Kondisi Lensa & Optik *',
          placeholder: 'Contoh: Elemen kaca optik jernih bebas jamur/scratch, ring fokus & zoom mulus, autofokus presisi, mount kokoh...'
        };
      case 'Aksesori':
        return {
          label: 'Kondisi Aksesori / Perlengkapan *',
          placeholder: 'Contoh: Baut & engsel kencang, pengunci kokoh, kabel utuh tanpa terkelupas, tas pembungkus lengkap...'
        };
      case 'Ruang Studio':
        return {
          label: 'Kondisi & Kelayakan Ruang Studio *',
          placeholder: 'Contoh: AC dingin, peredam suara rapi, sistem kelistrikan & lighting gantung normal, kebersihan ruangan terjaga...'
        };
      default:
        return {
          label: `Kondisi Barang / ${cat || 'Peralatan'} *`,
          placeholder: `Kondisi fisik ${cat || 'barang'}, kelayakan fungsi operasional, kelengkapan pendukung...`
        };
    }
  };

  const handleSaveAsset = (e) => {
    e.preventDefault();
    if (!nama.trim() || !spesifikasi.trim()) {
      alert('Nama unit dan spesifikasi wajib diisi.');
      return;
    }

    if (editingAssetId) {
      updateEquipment(editingAssetId, {
        kode,
        nama,
        kategori,
        spesifikasi,
        kondisiFisik,
        baterai: kategori === 'Ruang Studio' || kategori === 'Lensa' ? null : Number(baterai),
        lokasiRak: lokasiRak || 'Ruang Studio Creative Corner'
      });
    } else {
      addEquipment({
        kode,
        nama,
        kategori,
        spesifikasi,
        kondisiFisik,
        baterai: kategori === 'Ruang Studio' || kategori === 'Lensa' ? null : Number(baterai),
        lokasiRak: lokasiRak || 'Ruang Studio Creative Corner'
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
              <span>Master Data Inventaris & Ruang Studio Creative Corner</span>
            </h3>
            <div className="card-subtitle">
              Admin dapat menambah, memperbarui spesifikasi teknis, atau menghapus inventaris studio (Kamera, Lensa, Aksesori, dan Ruang Studio).
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari aset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem', fontSize: '0.825rem', width: '180px' }}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenAddModal}
              id="btn-add-asset-master"
            >
              <Plus size={16} />
              <span>Tambah Aset Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
          {['Semua', 'Kamera', 'Lensa', 'Aksesori', 'Ruang Studio'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${activeKategori === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveKategori(cat)}
              style={{ fontSize: '0.775rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Master Table atau Empty State */}
        {equipment.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B' }}>
            <Inbox size={42} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
              Database Inventaris Studio Masih Kosong
            </h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
              Belum ada data kamera, lensa, aksesori, atau ruangan. Silakan klik tombol di bawah untuk mulai menginput unit perlengkapan studio yang sebenarnya.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenAddModal}
            >
              <Plus size={16} />
              <span>Tambah Unit Inventaris Pertama</span>
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Kode & Nama Unit</th>
                  <th>Kategori</th>
                  <th>Kondisi & Spesifikasi</th>
                  <th>Lokasi Rak / Studio</th>
                  <th>Kondisi & Baterai</th>
                  <th>Status Kuota</th>
                  <th>Aksi Kelola</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.nama}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>{item.kode}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.kategori}</span>
                    </td>
                    <td style={{ maxWidth: '280px', fontSize: '0.8rem', color: '#334155' }}>
                      {item.spesifikasi}
                    </td>
                    <td>{item.lokasiRak}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{item.kondisiFisik}</div>
                      {item.baterai !== null && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: item.baterai <= 20 ? '#E11D48' : '#059669', fontWeight: 700 }}>
                          ⚡ {item.baterai}%
                        </span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit data aset"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteAsset(item.id)}
                          title="Hapus aset"
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
                    <span>Fisik Bodi:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengambilan.kondisiFisik}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Fungsi Tombol:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengambilan.fungsiTombol}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Kebersihan Lensa:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengambilan.kebersihanLensa}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Kapasitas Baterai:</span>
                    <strong style={{ color: '#1E3A8A' }}>
                      ⚡ {selectedBorrowingForCompare.inspeksiPengambilan.bateraiPersen}%
                    </strong>
                  </div>
                  <div className="inspection-item">
                    <span>Kelengkapan Aksesori:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengambilan.kelengkapanAksesori}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Kebersihan Ruang:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengambilan.kebersihanRuang}</strong>
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
                    <span>Fisik Akhir:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengembalian.kondisiFisikAkhir}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Fungsi Tombol:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengembalian.fungsiTombol}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Kebersihan Lensa:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengembalian.kebersihanLensa}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Sisa Baterai:</span>
                    <strong style={{ color: selectedBorrowingForCompare.inspeksiPengembalian.sisaBateraiPersen <= 25 ? '#E11D48' : '#059669' }}>
                      ⚡ {selectedBorrowingForCompare.inspeksiPengembalian.sisaBateraiPersen}%
                    </strong>
                  </div>
                  <div className="inspection-item">
                    <span>Kelengkapan:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengembalian.kelengkapanAksesori}</strong>
                  </div>
                  <div className="inspection-item">
                    <span>Kebersihan Ruang:</span>
                    <strong>{selectedBorrowingForCompare.inspeksiPengembalian.kebersihanRuang}</strong>
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

      {/* MODAL TAMBAH / EDIT ASET MASTER */}
      <Modal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        title={editingAssetId ? 'Edit Data Aset Master Studio' : 'Tambah Unit Aset Master Baru'}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAssetModalOpen(false)}>
              Batal
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveAsset}>
              Simpan Data Aset
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAsset}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kode Unit *</label>
              <input
                type="text"
                className="form-input"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="CAM-01 / LENS-01"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select
                className="form-select"
                value={['Kamera', 'Lensa', 'Aksesori', 'Ruang Studio'].includes(kategori) ? kategori : 'MANUAL'}
                onChange={(e) => {
                  if (e.target.value === 'MANUAL') {
                    setKategori('');
                  } else {
                    setKategori(e.target.value);
                  }
                }}
              >
                <option value="Kamera">Kamera</option>
                <option value="Lensa">Lensa</option>
                <option value="Aksesori">Aksesori</option>
                <option value="Ruang Studio">Ruang Studio</option>
                <option value="MANUAL">+ Kategori Lainnya (Tulis Manual)...</option>
              </select>
              {(!['Kamera', 'Lensa', 'Aksesori', 'Ruang Studio'].includes(kategori)) && (
                <input
                  type="text"
                  className="form-input"
                  style={{ marginTop: '0.4rem' }}
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  placeholder="Ketik nama kategori (misal: Drone, Audio Mic, Lighting)..."
                  required
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Peralatan / Ruang *</label>
            <input
              type="text"
              className="form-input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Sony Alpha 7 IV, Lensa 24-70mm f/2.8, Ruang Studio Utama"
              required
            />
          </div>

          {(() => {
            const fieldInfo = getKondisiFieldInfo(kategori);
            return (
              <div className="form-group">
                <label className="form-label">{fieldInfo.label}</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={spesifikasi}
                  onChange={(e) => setSpesifikasi(e.target.value)}
                  placeholder={fieldInfo.placeholder}
                  required
                ></textarea>
              </div>
            );
          })()}

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kondisi Fisik Standar</label>
              <input
                type="text"
                className="form-input"
                value={kondisiFisik}
                onChange={(e) => setKondisiFisik(e.target.value)}
                placeholder="Contoh: Sangat Baik (100%)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lokasi Rak / Penyimpanan</label>
              <input
                type="text"
                className="form-input"
                value={lokasiRak}
                onChange={(e) => setLokasiRak(e.target.value)}
                placeholder="Contoh: Lemari Kering A-1 / Studio Lt. 2"
              />
            </div>
          </div>

          {kategori !== 'Ruang Studio' && kategori !== 'Lensa' && (
            <div className="form-group">
              <label className="form-label">Daya Baterai Saat Ini (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="form-input"
                value={baterai}
                onChange={(e) => setBaterai(e.target.value)}
              />
            </div>
          )}
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

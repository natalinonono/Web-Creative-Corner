import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStudio } from '../../context/StudioContext';
import { FORMAT_SURAT_PEMINJAMAN_TEXT } from '../../data/seedData';
import { 
  ClipboardCheck, 
  Camera, 
  CheckCircle2, 
  ShieldAlert, 
  Upload, 
  Download, 
  FileText, 
  FileCheck, 
  Eye, 
  Trash2 
} from 'lucide-react';

export const PickupInspectionModal = ({ isOpen, onClose, targetEvent, prefilledEquipmentIds = [] }) => {
  const { equipment, activeMemberId, members, submitPickupInspection } = useStudio();

  const currentMember = members.find((m) => m.id === activeMemberId) || members[0];

  // Equipment selection
  const [selectedEqIds, setSelectedEqIds] = useState(
    prefilledEquipmentIds.length > 0
      ? prefilledEquipmentIds
      : targetEvent?.peralatanTerkunciIds?.length > 0
      ? targetEvent.peralatanTerkunciIds
      : []
  );

  // Form Fields
  const [kondisiFisik, setKondisiFisik] = useState('Mulus, tidak ada lecet atau retak pada bodi');
  const [fungsiTombol, setFungsiTombol] = useState('Semua tombol shutter, tombol menu, dan dial bekerja responsif');
  const [kebersihanLensa, setKebersihanLensa] = useState('Optik depan dan belakang bersih, bebas jamur dan debu tebal');
  const [bateraiPersen, setBateraiPersen] = useState(95);
  const [kelengkapanAksesori, setKelengkapanAksesori] = useState('Lengkap: Lens cap depan/belakang, strap, baterai terpasang, dan tas');
  const [kebersihanRuang, setKebersihanRuang] = useState('Ruang studio bersih dan tertata rapi');
  const [batasWaktuKembali, setBatasWaktuKembali] = useState(targetEvent?.waktuSelesai || '16:00');

  // Bukti Surat Peminjaman (Foto / Dokumen)
  const [buktiSuratFile, setBuktiSuratFile] = useState(null);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);

  // Unduh Format Resmi Surat Peminjaman
  const handleDownloadFormatSurat = () => {
    const blob = new Blob([FORMAT_SURAT_PEMINJAMAN_TEXT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Format_Surat_Peminjaman_Alat_Creative_Corner.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setBuktiSuratFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'document',
        isImage: file.type.startsWith('image/'),
        dataUrl: event.target.result,
        uploadedAt: new Date().toLocaleString('id-ID')
      });
    };
    reader.readAsDataURL(file);
  };

  const handleToggleEq = (id) => {
    setSelectedEqIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedEqIds.length === 0) {
      alert('Pilihlah minimal satu alat/ruangan yang diambil untuk inspeksi.');
      return;
    }

    if (!buktiSuratFile && !targetEvent) {
      alert('Wajib melampirkan foto lembar surat peminjaman atau berkas dokumen perizinan resmi! Jika Anda belum memiliki format suratnya, silakan klik tombol "Unduh Format Resmi (.TXT)" yang telah disediakan.');
      return;
    }

    submitPickupInspection({
      eventId: targetEvent?.id || null,
      anggotaId: currentMember.id,
      peminjamNama: currentMember.nama,
      peminjamKelas: currentMember.kelas,
      peminjamWa: currentMember.nomorWa,
      peralatanIds: selectedEqIds,
      keperluan: targetEvent ? `Liputan: ${targetEvent.judul}` : 'Peminjaman Mandiri',
      batasWaktuKembali,
      buktiSurat: buktiSuratFile,
      inspeksiData: {
        kondisiFisik,
        fungsiTombol,
        kebersihanLensa,
        bateraiPersen: Number(bateraiPersen),
        kelengkapanAksesori,
        kebersihanRuang,
        petugasPemeriksa: `${currentMember.nama} (Inspeksi Mandiri Siswa)`
      }
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      title="Formulir Inspeksi Pengambilan (Cek Fisik & Pemicu Tugas)"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSubmit}
            id="btn-submit-pickup"
          >
            <CheckCircle2 size={16} />
            <span>Kirim Inspeksi & Ambil Alat</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <ClipboardCheck size={22} color="#1E3A8A" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E3A8A' }}>
              Alur Otomatis Creative Corner (State-Machine Trigger 2)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '2px' }}>
              Menyerahkan formulir ini akan <strong>otomatis mengubah status penugasan Anda</strong> dari <em>"Belum Mengambil Alat"</em> menjadi <strong>"Sedang Melaksanakan Tugas"</strong> dan menandai status alat menjadi <strong>"Dipinjam"</strong>.
            </p>
          </div>
        </div>

        {/* Informasi Peminjam & Event */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label className="form-label">Nama Siswa / Anggota</label>
            <input 
              type="text" 
              className="form-input" 
              value={`${currentMember.nama} (${currentMember.kelas})`} 
              disabled 
              style={{ background: '#F8FAFC' }}
            />
          </div>
          <div>
            <label className="form-label">Terkait Agenda / Event</label>
            <input 
              type="text" 
              className="form-input" 
              value={targetEvent ? targetEvent.judul : 'Peminjaman Mandiri Creative Corner'} 
              disabled 
              style={{ background: '#F8FAFC' }}
            />
          </div>
        </div>

        {/* Pemilihan Alat yang Diambil */}
        <div className="form-group">
          <label className="form-label">Pilih Unit Peralatan / Ruang yang Diperiksa & Diambil *</label>
          {equipment.length === 0 ? (
            <div style={{ padding: '1rem', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', fontSize: '0.825rem', color: '#64748B' }}>
              Belum ada inventaris alat/ruang yang terdaftar. Administrator dapat menambahkan unit terlebih dahulu di Portal Pengelola.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.65rem',
              maxHeight: '170px',
              overflowY: 'auto',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.75rem',
              background: '#FAFAFA'
            }}>
              {equipment.map((item) => {
                const isSelected = selectedEqIds.includes(item.id);
                return (
                  <label 
                    key={item.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isSelected ? '1px solid #3B82F6' : '1px solid #E2E8F0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.825rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleEq(item.id)}
                      style={{ accentColor: '#1E3A8A' }}
                    />
                    <div>
                      <strong style={{ color: '#0F172A' }}>{item.nama}</strong>
                      <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{item.kategori} • {item.lokasiRak}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Cek Fisik Berkelanjutan */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">1. Catatan Kondisi Fisik Bodi *</label>
            <input
              type="text"
              className="form-input"
              value={kondisiFisik}
              onChange={(e) => setKondisiFisik(e.target.value)}
              placeholder="Contoh: Mulus tanpa lecet, baut kencang"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">2. Fungsi Tombol & Shutter *</label>
            <input
              type="text"
              className="form-input"
              value={fungsiTombol}
              onChange={(e) => setFungsiTombol(e.target.value)}
              placeholder="Contoh: Shutter responsif, dial berputar lancar"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">3. Kebersihan Lensa & Sensor *</label>
            <input
              type="text"
              className="form-input"
              value={kebersihanLensa}
              onChange={(e) => setKebersihanLensa(e.target.value)}
              placeholder="Contoh: Optik jernih, filter bersih bebas debu"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">4. Kapasitas Baterai Awal (%) *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={bateraiPersen}
                onChange={(e) => setBateraiPersen(e.target.value)}
                style={{ flex: 1, accentColor: '#1E3A8A' }}
              />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.9rem',
                minWidth: '45px',
                textAlign: 'right',
                color: '#1E3A8A'
              }}>
                {bateraiPersen}%
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">5. Kelengkapan Aksesori & Tas *</label>
            <input
              type="text"
              className="form-input"
              value={kelengkapanAksesori}
              onChange={(e) => setKelengkapanAksesori(e.target.value)}
              placeholder="Contoh: Lens cap depan/belakang, strap, tas, charger"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">6. Kebersihan Ruang / Studio *</label>
            <input
              type="text"
              className="form-input"
              value={kebersihanRuang}
              onChange={(e) => setKebersihanRuang(e.target.value)}
              placeholder="Contoh: Studio bersih / N/A jika hanya alat"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Target Batas Waktu Pengembalian (WIB) *</label>
          <input
            type="time"
            className="form-input"
            value={batasWaktuKembali}
            onChange={(e) => setBatasWaktuKembali(e.target.value)}
            required
            style={{ maxWidth: '220px' }}
          />
        </div>

        {/* WAJIB: BUKTI SURAT PEMINJAMAN RESMI (FOTO / DOKUMEN) */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileCheck size={18} color="#1E3A8A" />
              <span>Bukti Surat Peminjaman / Penugasan Resmi (Foto / Dokumen) {!targetEvent && '*'}</span>
            </label>
            <span className="badge badge-rose" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              {targetEvent ? 'OPSIONAL (SUDAH ADA EVENT)' : 'WAJIB DILAMPIRKAN'}
            </span>
          </div>

          {/* Banner Pengunduhan Format */}
          <div style={{
            background: '#EFF6FF',
            border: '1.5px dashed #3B82F6',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <FileText size={20} color="#1E3A8A" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E3A8A' }}>
                  Belum punya format surat permohonan peminjaman?
                </div>
                <div style={{ fontSize: '0.725rem', color: '#334155' }}>
                  Unduh templat resmi Creative Corner (.TXT) untuk dicetak dan ditandatangani.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleDownloadFormatSurat}
                style={{ fontSize: '0.725rem' }}
              >
                <Download size={13} />
                <span>Unduh Format (.TXT)</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsFormatModalOpen(true)}
                style={{ fontSize: '0.725rem' }}
              >
                <Eye size={13} />
                <span>Lihat Format</span>
              </button>
            </div>
          </div>

          {/* Upload Input */}
          {!buktiSuratFile ? (
            <div style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
              background: '#FAFAFA'
            }}>
              <Upload size={24} color="#64748B" style={{ margin: '0 auto 0.4rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                Unggah Foto Lembar Surat atau File Dokumen
              </div>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                <Upload size={13} />
                <span>Pilih Foto / Dokumen</span>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : (
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <div>
                  <strong style={{ fontSize: '0.8rem', color: '#166534' }}>{buktiSuratFile.name}</strong>
                  <div style={{ fontSize: '0.7rem', color: '#15803D' }}>{buktiSuratFile.size} • Siap Dilampirkan</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setBuktiSuratFile(null)}
                style={{ fontSize: '0.725rem' }}
              >
                <Trash2 size={12} />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Modal Format Surat */}
      {isFormatModalOpen && (
        <Modal
          isOpen={isFormatModalOpen}
          onClose={() => setIsFormatModalOpen(false)}
          size="large"
          title="Format Resmi Surat Perizinan Peminjaman Alat"
          footer={
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormatModalOpen(false)}>
              Tutup
            </button>
          }
        >
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '8px',
            padding: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.825rem',
            lineHeight: '1.6',
            color: '#0F172A',
            whiteSpace: 'pre-wrap',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {FORMAT_SURAT_PEMINJAMAN_TEXT}
          </div>
        </Modal>
      )}
    </Modal>
  );
};

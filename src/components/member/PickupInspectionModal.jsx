import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStudio } from '../../context/StudioContext';
import { ClipboardCheck, Camera, CheckCircle2, ShieldAlert } from 'lucide-react';

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

    submitPickupInspection({
      eventId: targetEvent?.id || null,
      anggotaId: currentMember.id,
      peminjamNama: currentMember.nama,
      peminjamKelas: currentMember.kelas,
      peminjamWa: currentMember.nomorWa,
      peralatanIds: selectedEqIds,
      keperluan: targetEvent ? `Liputan: ${targetEvent.judul}` : 'Peminjaman Mandiri',
      batasWaktuKembali,
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

        <div className="form-group">
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
      </form>
    </Modal>
  );
};

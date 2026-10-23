import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Camera, 
  Clock, 
  CheckCircle, 
  Search, 
  Send, 
  Monitor, 
  User, 
  HelpCircle, 
  ExternalLink, 
  FileText, 
  CheckSquare, 
  AlertCircle,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const PublicGuestPortal = ({ onOpenLoginModal }) => {
  const { equipment, borrowings, submitPublicLoan, setCurrentRole } = useStudio();

  // Active Tab di Portal Publik ('form' | 'katalog' | 'status')
  const [activeTab, setActiveTab] = useState('form');

  // Form State Peminjaman Mandiri (Tanpa Login Email)
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [kelasInstansi, setKelasInstansi] = useState('');
  const [nomorWa, setNomorWa] = useState('');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);
  const [keperluan, setKeperluan] = useState('');
  const [batasKembali, setBatasKembali] = useState('16:00');
  const [catatan, setCatatan] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Status Pencarian Resi Tiket
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedLoan, setSubmittedLoan] = useState(null);

  // Toggle pilihan alat yang dipinjam
  const handleToggleEquipment = (id) => {
    setSelectedEquipmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit Peminjaman Tamu (Tanpa Email)
  const handleSubmitLoan = (e) => {
    e.preventDefault();
    if (!namaPeminjam.trim() || !kelasInstansi.trim() || !nomorWa.trim()) {
      alert('Nama peminjam, kelas/unit, dan nomor WhatsApp wajib diisi.');
      return;
    }

    if (selectedEquipmentIds.length === 0) {
      alert('Silakan pilih minimal 1 unit peralatan atau ruangan yang ingin dipinjam.');
      return;
    }

    if (!isAgreed) {
      alert('Anda wajib menyetujui ketentuan pemeliharaan dan pengembalian studio.');
      return;
    }

    const newLoan = submitPublicLoan({
      peminjamNama: namaPeminjam.trim(),
      peminjamKelas: kelasInstansi.trim(),
      peminjamWa: nomorWa.replace(/[^0-9]/g, ''),
      peralatanIds: selectedEquipmentIds,
      keperluan: keperluan.trim() || 'Peminjaman Tugas Siswa/Guru Non-Anggota',
      batasWaktuKembali: batasKembali,
      catatan: catatan.trim()
    });

    if (newLoan) {
      setSubmittedLoan(newLoan);
      // Reset Form
      setNamaPeminjam('');
      setKelasInstansi('');
      setNomorWa('');
      setSelectedEquipmentIds([]);
      setKeperluan('');
      setCatatan('');
      setIsAgreed(false);
    }
  };

  // Filter daftar peminjaman publik
  const filteredBorrowings = borrowings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.peminjamNama && b.peminjamNama.toLowerCase().includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.peralatanNama && b.peralatanNama.toLowerCase().includes(q))
    );
  });

  const availableEquipment = equipment.filter((eq) => eq.status === 'Tersedia');

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* 1. HERO BANNER KHUSUS VERSI PUBLIK / TANPA LOGIN */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        color: '#FFFFFF',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <span>🌐 Versi Terbuka — Tanpa Login Email</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.025em', marginBottom: '0.75rem', lineHeight: '1.2' }}>
            Layanan Peminjaman Studio Creative Corner
          </h1>

          <p style={{ fontSize: '0.975rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Dikhususkan bagi <strong>Siswa, Guru, OSIS, dan Warga Sekolah (Bukan Anggota Creative Corner)</strong> yang membutuhkan kamera, lighting, mikrofon, atau reservasi ruang studio untuk keperluan tugas sekolah maupun kegiatan resmi. <strong>Bisa langsung meminjam tanpa perlu membuat akun email!</strong>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: '#2563EB', borderColor: '#3B82F6', padding: '0.65rem 1.25rem' }}
              onClick={() => setActiveTab('form')}
            >
              <CheckSquare size={18} />
              <span>Formulir Pinjam Langsung</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)', color: '#FFFFFF' }}
              onClick={() => setCurrentRole('kiosk')}
            >
              <Monitor size={18} />
              <span>Gunakan PC Kiosk Studio</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ background: 'transparent', borderColor: 'rgba(255, 255, 255, 0.3)', color: '#FFFFFF' }}
              onClick={onOpenLoginModal}
            >
              <User size={18} />
              <span>Masuk sebagai Anggota / Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGASI TAB VERSI PUBLIK */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E2E8F0', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FileText size={16} />
          <span>Formulir Peminjaman Mandiri (Tanpa Email)</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'katalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('katalog')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Camera size={16} />
          <span>Katalog Ketersediaan Studio Real-Time</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Search size={16} />
          <span>Lacak Resi / Status Peminjaman Tamu</span>
        </button>
      </div>

      {/* MODAL / KARTU BUKTI TIKET PEMINJAMAN BERHASIL */}
      {submittedLoan && (
        <div style={{
          background: '#F0FDF4',
          border: '2px solid #86EFAC',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle size={32} color="#16A34A" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                  Peminjaman Mandiri Berhasil Diajukan!
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#15803D' }}>
                  Nomor Tiket Anda: <strong>{submittedLoan.id}</strong> • Peminjam: <strong>{submittedLoan.peminjamNama}</strong> ({submittedLoan.peminjamKelas})
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSubmittedLoan(null)}
              style={{ fontSize: '0.75rem' }}
            >
              Tutup Pengumuman
            </button>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #DCFCE7', borderRadius: '8px', padding: '1rem', fontSize: '0.85rem', color: '#334155', marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div><strong>Alat / Ruang:</strong> {submittedLoan.peralatanNama}</div>
              <div><strong>Tanggal Pinjam:</strong> {submittedLoan.tanggalPinjam} (Pukul {submittedLoan.jamPinjam})</div>
              <div><strong>Batas Waktu Pengembalian:</strong> Pukul {submittedLoan.batasWaktuKembali} WIB</div>
              <div><strong>Status:</strong> <span className="badge badge-amber">Aktif Dipinjam</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/6281200000000?text=${encodeURIComponent(
                `Halo Pengelola Creative Corner, saya *${submittedLoan.peminjamNama}* (${submittedLoan.peminjamKelas}) telah mengajukan peminjaman mandiri dengan Kode Tiket: *${submittedLoan.id}* untuk alat: *${submittedLoan.peralatanNama}*. Batas kembali: *${submittedLoan.batasWaktuKembali} WIB*. Mohon verifikasi pengambilan di studio. Terima kasih!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ textDecoration: 'none' }}
            >
              <Send size={15} />
              <span>Konfirmasi ke Admin via WhatsApp</span>
            </a>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(submittedLoan.id);
                alert(`Nomor tiket ${submittedLoan.id} berhasil disalin ke clipboard!`);
              }}
            >
              <span>Salin Nomor Tiket</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. KONTEN TAB: 1. FORMULIR PEMINJAMAN MANDIRI */}
      {activeTab === 'form' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '2rem' }}>
          {/* Kolom Kiri: Formulir */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <CheckSquare size={20} color="#1E3A8A" />
                  <span>Formulir Pengajuan Peminjaman Mandiri</span>
                </h2>
                <div className="card-subtitle">
                  Isi data identitas diri Anda di bawah ini secara lengkap tanpa perlu akun email.
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitLoan}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap Peminjam *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={namaPeminjam}
                    onChange={(e) => setNamaPeminjam(e.target.value)}
                    placeholder="Contoh: Muhammad Rizky / Ibu Siti Rahmawati"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kelas / Unit / Ekskul *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={kelasInstansi}
                    onChange={(e) => setKelasInstansi(e.target.value)}
                    placeholder="Contoh: XI MIPA 2 / OSIS / Guru Bahasa"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Nomor WhatsApp Aktif *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={nomorWa}
                    onChange={(e) => setNomorWa(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    required
                  />
                  <div className="form-hint">Digunakan untuk konfirmasi jadwal pengembalian alat.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Batas Jam Kembali (WIB) *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={batasKembali}
                    onChange={(e) => setBatasKembali(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Pemilihan Peralatan / Ruangan */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Pilih Peralatan / Ruang Studio yang Ingin Dipinjam *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#1E3A8A', fontWeight: 700 }}>
                    {selectedEquipmentIds.length} Unit Dipilih
                  </span>
                </div>

                {equipment.length === 0 ? (
                  <div style={{ padding: '1.5rem', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                    <Camera size={24} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                    <div>Belum ada data unit inventaris yang diinput oleh Administrator.</div>
                    <div style={{ fontSize: '0.75rem' }}>Silakan hubungi pengelola Creative Corner di studio.</div>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '0.65rem',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    background: '#FAFAFA'
                  }}>
                    {equipment.map((item) => {
                      const isAvailable = item.status === 'Tersedia';
                      const isSelected = selectedEquipmentIds.includes(item.id);

                      return (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.6rem',
                            padding: '0.5rem 0.65rem',
                            background: !isAvailable ? '#F1F5F9' : isSelected ? '#EFF6FF' : '#FFFFFF',
                            border: isSelected ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            borderRadius: '6px',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            opacity: isAvailable ? 1 : 0.65,
                            fontSize: '0.825rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!isAvailable}
                            onChange={() => handleToggleEquipment(item.id)}
                            style={{ marginTop: '3px', accentColor: '#1E3A8A' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: '#0F172A', lineHeight: '1.3' }}>
                              {item.nama}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: '#64748B' }}>
                              {item.kategori} • {item.lokasiRak}
                            </div>
                            <div style={{ marginTop: '0.25rem' }}>
                              <StatusBadge status={item.status} />
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Keperluan Peminjaman *</label>
                <input
                  type="text"
                  className="form-input"
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Contoh: Pembuatan Video Pembelajaran Biologi, Dokumentasi Classmeeting"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Tambahan / Kebutuhan Aksesori (Opsional)</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Membutuhkan baterai cadangan dan tripod video..."
                ></textarea>
              </div>

              {/* Pernyataan Tanggung Jawab */}
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#92400E', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    style={{ marginTop: '2px', accentColor: '#D97706' }}
                    required
                  />
                  <span>
                    <strong>Pernyataan Tanggung Jawab Studio:</strong> Saya bersedia menjaga keutuhan, kebersihan, dan kelengkapan alat yang dipinjam, serta mengembalikannya tepat waktu sebelum batas jam kembali berakhir.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
              >
                <Send size={16} />
                <span>Kirim Permohonan Peminjaman (Tanpa Perlu Email)</span>
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Panduan & Informasi Studio */}
          <div>
            {/* Kartu Panduan */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: '1rem' }}>
                  <HelpCircle size={18} color="#1E3A8A" />
                  <span>Alur Peminjaman Bukan Anggota</span>
                </h3>
              </div>
              <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.825rem', color: '#475569', lineHeight: '1.7' }}>
                <li>Pilih unit kamera, lensa, atau ruangan yang berstatus <strong>"Tersedia"</strong>.</li>
                <li>Isi identitas diri, kelas/instansi, dan nomor WhatsApp.</li>
                <li>Tekan tombol kirim untuk memperoleh <strong>Kode Resi Tiket Digital</strong>.</li>
                <li>Datang ke Studio Creative Corner untuk mengambil alat dan melakukan cek fisik bersama petugas piket.</li>
                <li>Kembalikan alat tepat waktu sebelum studio tutup.</li>
              </ol>
            </div>

            {/* Kartu Komputer Kiosk */}
            <div className="card" style={{ marginBottom: '1.5rem', background: '#F8FAFC' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: '1rem' }}>
                  <Monitor size={18} color="#10B981" />
                  <span>Pakai PC Workstation Studio</span>
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', marginBottom: '1rem' }}>
                Butuh mengedit video tugas sekolah, membuat presentasi, atau rendering karya? Gunakan 6 unit PC Workstation studio langsung tanpa akun email.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setCurrentRole('kiosk')}
              >
                <Monitor size={15} />
                <span>Buka Layar Kiosk PC Sekarang</span>
              </button>
            </div>

            {/* Ajakan Masuk Anggota */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 800, color: '#1E3A8A', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                Apakah Anda Anggota Creative Corner?
              </div>
              <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                Bagi anggota tim dan pengurus studio, silakan masuk dengan akun email untuk mengakses Papan Tugas Kreatif, Kalender Liputan, dan Roster Piket.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={onOpenLoginModal}
              >
                <User size={14} />
                <span>Masuk Akun Anggota / Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. KONTEN TAB: 2. KATALOG KETERSEDIAAN STUDIO */}
      {activeTab === 'katalog' && (
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <Camera size={20} color="#1E3A8A" />
                  <span>Katalog Unit Peralatan & Ruangan Studio</span>
                </h2>
                <div className="card-subtitle">
                  Pantau unit yang sedang berstatus Tersedia, Dipinjam, atau Terkunci Agenda Liputan.
                </div>
              </div>
              <span className="badge badge-emerald">
                {availableEquipment.length} Unit Siap Pakai
              </span>
            </div>

            {equipment.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                <Camera size={42} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#334155' }}>
                  Belum Ada Unit Peralatan / Ruang
                </div>
                <p style={{ fontSize: '0.85rem' }}>
                  Administrator studio belum menambahkan daftar aset inventaris.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', padding: '1.5rem' }}>
                {equipment.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      background: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1E3A8A', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>
                          {item.kode}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>

                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                        {item.nama}
                      </h4>
                      <div style={{ fontSize: '0.775rem', color: '#64748B', marginBottom: '0.75rem' }}>
                        {item.kategori} • Lokasi: {item.lokasiRak}
                      </div>

                      <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', marginBottom: '1rem' }}>
                        {item.spesifikasi}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Baterai: <strong>{item.baterai ? `${item.baterai}%` : '-'}</strong>
                      </span>
                      {item.status === 'Tersedia' ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedEquipmentIds([item.id]);
                            setActiveTab('form');
                          }}
                        >
                          Pinjam Ini
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.725rem', color: '#EF4444', fontWeight: 600 }}>
                          Sedang Tidak Tersedia
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. KONTEN TAB: 3. LACAK STATUS PEMINJAMAN TAMU */}
      {activeTab === 'status' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <Search size={20} color="#1E3A8A" />
                <span>Lacak Status & Riwayat Peminjaman Tamu</span>
              </h2>
              <div className="card-subtitle">
                Ketik nama Anda atau nomor tiket untuk memeriksa status pengembalian alat.
              </div>
            </div>

            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari nama Anda / kode tiket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem' }}
              />
            </div>
          </div>

          {filteredBorrowings.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
              <Search size={36} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Tidak Ditemukan Riwayat Peminjaman</div>
              <p style={{ fontSize: '0.825rem' }}>Belum ada permohonan peminjaman yang cocok dengan pencarian Anda.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Tiket</th>
                    <th>Nama Peminjam</th>
                    <th>Kelas / Unit</th>
                    <th>Alat Dipinjam</th>
                    <th>Waktu Pinjam</th>
                    <th>Batas Pengembalian</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBorrowings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E3A8A' }}>
                        {b.id}
                      </td>
                      <td style={{ fontWeight: 700 }}>{b.peminjamNama}</td>
                      <td>{b.peminjamKelas}</td>
                      <td style={{ maxWidth: '240px' }}>{b.peralatanNama}</td>
                      <td>{b.tanggalPinjam} • {b.jamPinjam} WIB</td>
                      <td style={{ color: '#D97706', fontWeight: 600 }}>{b.batasWaktuKembali} WIB</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

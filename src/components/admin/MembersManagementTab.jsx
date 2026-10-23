import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  Users, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  User, 
  KeyRound, 
  Mail, 
  Phone,
  Search,
  CheckCircle2
} from 'lucide-react';

export const MembersManagementTab = () => {
  const { members, addMember, deleteMember, ADMIN_EMAIL_SUFFIX, isAdminEmail } = useStudio();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [kelas, setKelas] = useState('');
  const [nomorWa, setNomorWa] = useState('');
  const [peranUtama, setPeranUtama] = useState('Fotografer');
  const [manualPeran, setManualPeran] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim()) {
      alert('Nama dan alamat email wajib diisi.');
      return;
    }

    const finalPeran = peranUtama === 'MANUAL' ? (manualPeran.trim() || 'Anggota Kreatif') : peranUtama;

    addMember({
      nama,
      email: email.trim(),
      kelas: kelas.trim() || 'Anggota Tim Studio',
      nomorWa: nomorWa.replace(/[^0-9]/g, '') || '6281200000000',
      peranUtama: finalPeran
    });

    setNama('');
    setEmail('');
    setKelas('');
    setNomorWa('');
    setManualPeran('');
    setIsAddModalOpen(false);
  };

  const filteredMembers = members.filter((m) => {
    return (
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kelas.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={22} color="#1E3A8A" />
              <span>Manajemen Anggota & Penetapan Hak Akses Akun</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Kelola daftar personil tim studio Creative Corner dan registrasi akun siswa maupun admin.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
            id="btn-add-member"
          >
            <Plus size={16} />
            <span>Daftarkan Anggota Baru</span>
          </button>
        </div>
      </div>

      {/* Ketentuan Email Admin & Anggota */}
      <div style={{
        background: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <KeyRound size={22} color="#1E3A8A" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1E3A8A', marginBottom: '0.25rem' }}>
            Ketentuan Hak Akses & Pembagian 2 Versi Sistem:
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#334155', lineHeight: '1.5' }}>
            • <strong>Administrator / Pengelola:</strong> Alamat email <strong>WAJIB mengandung kata <code>creativecorner</code></strong> (contoh: <code>admin1.creativecorner@gmail.com</code>). Akun ini memiliki akses penuh ke Portal Pengelola (CRUD inventaris, approval pinjaman, log Kiosk, dsb).<br />
            • <strong>Anggota Creative Corner:</strong> Masuk dengan email pribadi/sekolah (tanpa kata creativecorner) untuk mengakses Portal Anggota (Tugas Kreatif, Kalender Liputan, Roster Piket).<br />
            • <strong>Bukan Anggota (Tamu / Siswa Umum):</strong> Bisa langsung meminjam alat/ruang dan memakai PC di <em>Versi Publik (Tanpa Email)</em>.
          </p>
        </div>
      </div>

      {/* Tabel Anggota */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Users size={20} color="#1E3A8A" />
              <span>Daftar Akun Terdaftar ({members.length} Akun)</span>
            </h3>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Cari anggota / email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2rem', fontSize: '0.8rem', width: '220px' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID & Nama Pengguna</th>
                <th>Alamat Email</th>
                <th>Hak Akses</th>
                <th>Kelas / Jabatan</th>
                <th>Peran Studio</th>
                <th>Nomor WhatsApp</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => {
                const isAdmin = isAdminEmail(m.email);
                return (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isAdmin ? '#1E3A8A' : '#E2E8F0',
                          color: isAdmin ? '#FFFFFF' : '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {m.avatar || m.nama.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong>{m.nama}</strong>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>{m.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: isAdmin ? '#1E3A8A' : '#334155', fontWeight: isAdmin ? 700 : 400 }}>
                        {m.email}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isAdmin ? 'badge-emerald' : 'badge-blue'}`}>
                        {isAdmin ? '🛡️ Administrator' : '👤 Anggota Siswa'}
                      </span>
                    </td>
                    <td>{m.kelas}</td>
                    <td>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{m.peranUtama}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.8rem', color: '#059669' }}>+{m.nomorWa}</code>
                    </td>
                    <td>
                      {m.id !== 'ADM-01' ? (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`Hapus akun ${m.nama}?`)) {
                              deleteMember(m.id);
                            }
                          }}
                          title="Hapus akun"
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.725rem', color: '#94A3B8' }}>Akun Utama</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DAFTARKAN ANGGOTA / ADMIN BARU */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Daftarkan Anggota / Admin Baru"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddSubmit}>
                Simpan Akun
              </button>
            </>
          }
        >
          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap *</label>
              <input
                type="text"
                className="form-input"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Muhammad Rizky"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Email *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com atau admin1.creativecorner@gmail.com"
                required
              />
              <div className="form-hint">
                💡 <strong>Catatan:</strong> Jika email mengandung kata <code>creativecorner</code> (contoh: <code>admin1.creativecorner@gmail.com</code>), akun akan otomatis memiliki hak akses <strong>Administrator</strong>.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Kelas / Unit</label>
                <input
                  type="text"
                  className="form-input"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: XI DKV 1 / XII Multimedia"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nomor WhatsApp Aktif *</label>
                <input
                  type="text"
                  className="form-input"
                  value={nomorWa}
                  onChange={(e) => setNomorWa(e.target.value)}
                  placeholder="6281234567890"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Peran Utama di Studio</label>
              <select
                className="form-select"
                value={peranUtama}
                onChange={(e) => setPeranUtama(e.target.value)}
              >
                <option value="Fotografer">Fotografer Lapangan</option>
                <option value="Videografer">Videografer Lapangan</option>
                <option value="Video Editor">Video Editor</option>
                <option value="Desainer Grafis">Desainer Grafis</option>
                <option value="Penulis Naskah">Penulis Naskah & Konseptor</option>
                <option value="Koordinator Studio">Koordinator Studio / Administrator</option>
                <option value="MANUAL">+ Peran Lainnya (Tulis Manual)...</option>
              </select>
              {peranUtama === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualPeran}
                    onChange={(e) => setManualPeran(e.target.value)}
                    placeholder="Ketik nama peran/keahlian manual (mis: Pilot Drone, Teknisi Audio)..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

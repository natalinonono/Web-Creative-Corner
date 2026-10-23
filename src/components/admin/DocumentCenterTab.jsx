import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Modal } from '../common/Modal';
import { 
  FileText, 
  Edit, 
  Plus, 
  Eye, 
  Calendar, 
  CheckCircle, 
  Upload, 
  Save,
  Layers
} from 'lucide-react';

export const DocumentCenterTab = () => {
  const { documents, updateDocumentTemplate, addDocumentTemplate } = useStudio();

  const [editingDoc, setEditingDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form Fields untuk Edit
  const [editJudul, setEditJudul] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const [editKonten, setEditKonten] = useState('');
  const [editVersi, setEditVersi] = useState('');

  // Form Fields untuk Tambah Baru
  const [newKode, setNewKode] = useState(`CC-FORM-03/X/2026`);
  const [newJudul, setNewJudul] = useState('');
  const [newKategori, setNewKategori] = useState('Peminjaman Alat');
  const [manualKategori, setManualKategori] = useState('');
  const [newDeskripsi, setNewDeskripsi] = useState('');
  const [newKonten, setNewKonten] = useState('');

  const handleOpenEdit = (doc) => {
    setEditingDoc(doc);
    setEditJudul(doc.judul);
    setEditDeskripsi(doc.deskripsi);
    setEditKonten(doc.kontenTemplat);
    setEditVersi(doc.versi);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDoc) return;

    updateDocumentTemplate(editingDoc.id, {
      judul: editJudul,
      deskripsi: editDeskripsi,
      kontenTemplat: editKonten,
      versi: editVersi
    });

    setEditingDoc(null);
  };

  const handleCreateNewDoc = (e) => {
    e.preventDefault();
    if (!newJudul.trim() || !newKonten.trim()) {
      alert('Judul dan format templat wajib diisi.');
      return;
    }

    const finalKategori = newKategori === 'MANUAL' ? (manualKategori.trim() || 'Dokumen Umum') : newKategori;

    addDocumentTemplate({
      kodeSurat: newKode,
      judul: newJudul,
      kategori: finalKategori,
      deskripsi: newDeskripsi,
      kontenTemplat: newKonten,
      versi: '1.0'
    });

    setNewJudul('');
    setNewDeskripsi('');
    setNewKonten('');
    setManualKategori('');
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} color="#1E3A8A" />
              <span>Pusat Berkas Administrasi Resmi Creative Corner</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Kelola dan perbarui draf format templat surat perizinan peminjaman alat dan penggunaan ruang studio Creative Corner.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
            id="btn-add-doc-template"
          >
            <Plus size={16} />
            <span>Unggah Format Berkas Baru</span>
          </button>
        </div>
      </div>

      {/* Grid Dokumen Resmi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {documents.map((doc) => (
          <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#1E3A8A',
                  background: '#EFF6FF',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>
                  {doc.kodeSurat}
                </span>

                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Versi {doc.versi} (Diperbarui: {doc.tanggalUpdate})
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {doc.judul}
              </h3>

              <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                {doc.deskripsi}
              </p>

              {/* Snippet Template */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.85rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#334155',
                maxHeight: '120px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '1rem',
                whiteSpace: 'pre-wrap'
              }}>
                {doc.kontenTemplat}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40px',
                  background: 'linear-gradient(transparent, #F8FAFC)'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setPreviewDoc(doc)}
              >
                <Eye size={15} />
                <span>Pratinjau Surat</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => handleOpenEdit(doc)}
                id={`btn-edit-doc-${doc.id}`}
              >
                <Edit size={15} />
                <span>Ubah Templat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDIT TEMPLAT DOKUMEN */}
      {editingDoc && (
        <Modal
          isOpen={Boolean(editingDoc)}
          onClose={() => setEditingDoc(null)}
          size="large"
          title={`Edit Templat: ${editingDoc.judul}`}
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingDoc(null)}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                <Save size={16} />
                <span>Simpan Perubahan Dokumen</span>
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveEdit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Judul Dokumen Resmi *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editJudul}
                  onChange={(e) => setEditJudul(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nomor Versi *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editVersi}
                  onChange={(e) => setEditVersi(e.target.value)}
                  placeholder="Contoh: 1.5"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi & Peruntukan Dokumen</label>
              <input
                type="text"
                className="form-input"
                value={editDeskripsi}
                onChange={(e) => setEditDeskripsi(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Isi Format Surat Resmi (Gunakan tag seperti [NAMA_PEMINJAM], [DAFTAR_PERALATAN], dll.) *
              </label>
              <textarea
                className="form-textarea"
                rows="14"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: '1.5' }}
                value={editKonten}
                onChange={(e) => setEditKonten(e.target.value)}
                required
              ></textarea>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL TAMBAH FORMAT BARU */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        size="large"
        title="Unggah / Tambah Format Dokumen Resmi Baru"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreateNewDoc}>
              <Plus size={16} />
              <span>Simpan Dokumen Baru</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateNewDoc}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kode Dokumen Surat *</label>
              <input
                type="text"
                className="form-input"
                value={newKode}
                onChange={(e) => setNewKode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori Berkas *</label>
              <select
                className="form-select"
                value={newKategori}
                onChange={(e) => setNewKategori(e.target.value)}
              >
                <option value="Peminjaman Alat">Peminjaman Alat</option>
                <option value="Penggunaan Ruangan">Penggunaan Ruangan</option>
                <option value="Berita Acara">Berita Acara Kerusakan / Hilang</option>
                <option value="Surat Tugas">Surat Tugas Peliputan</option>
                <option value="Laporan Kegiatan">Laporan Kegiatan</option>
                <option value="MANUAL">+ Kategori Lainnya (Tulis Manual)...</option>
              </select>
              {newKategori === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualKategori}
                    onChange={(e) => setManualKategori(e.target.value)}
                    placeholder="Ketik kategori dokumen manual..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Judul Dokumen *</label>
            <input
              type="text"
              className="form-input"
              value={newJudul}
              onChange={(e) => setNewJudul(e.target.value)}
              placeholder="Contoh: Berita Acara Kerusakan / Hilang Aksesori"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <input
              type="text"
              className="form-input"
              value={newDeskripsi}
              onChange={(e) => setNewDeskripsi(e.target.value)}
              placeholder="Peruntukan dokumen ini bagi tim studio..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Konten Templat Berkas *</label>
            <textarea
              className="form-textarea"
              rows="10"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              value={newKonten}
              onChange={(e) => setNewKonten(e.target.value)}
              placeholder="Ketikkan isi draf resmi surat Creative Corner..."
              required
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* MODAL PRATINJAU DOKUMEN */}
      {previewDoc && (
        <Modal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          size="large"
          title={`Pratinjau Format: ${previewDoc.judul}`}
          footer={
            <button type="button" className="btn btn-secondary" onClick={() => setPreviewDoc(null)}>
              Tutup
            </button>
          }
        >
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #CBD5E1',
            borderRadius: '8px',
            padding: '1.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.825rem',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            color: '#1E293B'
          }}>
            {previewDoc.kontenTemplat}
          </div>
        </Modal>
      )}
    </div>
  );
};

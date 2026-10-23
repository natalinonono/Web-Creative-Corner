import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Palette, 
  FileText, 
  Video, 
  Clock, 
  Calendar, 
  Monitor, 
  Plus, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const CreativeTasksTab = () => {
  const { creativeTasks, updateCreativeTaskStage, addCreativeTask, activeMemberId, members } = useStudio();
  const currentMember = members.find((m) => m.id === activeMemberId) || members[0] || {
    id: 'user-default',
    nama: 'Anggota Creative Corner',
    kelas: 'Studio',
    nomorWa: '6281234567890'
  };

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State untuk Tambah Tugas
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Editing Video');
  const [manualKategori, setManualKategori] = useState('');
  const [selectedPjId, setSelectedPjId] = useState('');
  const [manualPjName, setManualPjName] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tenggatDraf, setTenggatDraf] = useState('2026-10-25 18:00');
  const [tenggatKaryaAkhir, setTenggatKaryaAkhir] = useState('2026-10-27 12:00');

  const categories = ['Semua', 'Pembuatan Naskah/Konsep', 'Desain Grafis', 'Editing Video', 'Fotografi & Retouching', 'Animasi & Motion Graphics'];
  const stages = ['Belum Dimulai', 'Dalam Proses', 'Peninjauan', 'Selesai'];

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Pembuatan Naskah/Konsep':
        return <FileText size={16} color="#1E3A8A" />;
      case 'Desain Grafis':
        return <Palette size={16} color="#059669" />;
      case 'Editing Video':
        return <Video size={16} color="#D97706" />;
      default:
        return <Layers size={16} />;
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!judul.trim()) return;

    const finalKategori = kategori === 'MANUAL' ? (manualKategori.trim() || 'Kreatif Umum') : kategori;

    let pjData = {
      penanggungJawabId: currentMember.id,
      penanggungJawabNama: currentMember.nama,
      penanggungJawabKelas: currentMember.kelas,
      penanggungJawabWa: currentMember.nomorWa
    };

    if (selectedPjId === 'MANUAL' && manualPjName.trim()) {
      pjData = {
        penanggungJawabId: `pj-manual-${Date.now()}`,
        penanggungJawabNama: manualPjName.trim(),
        penanggungJawabKelas: 'Anggota Tim',
        penanggungJawabWa: '6281234567890'
      };
    } else if (selectedPjId && selectedPjId !== 'current') {
      const found = members.find((m) => m.id === selectedPjId);
      if (found) {
        pjData = {
          penanggungJawabId: found.id,
          penanggungJawabNama: found.nama,
          penanggungJawabKelas: found.kelas,
          penanggungJawabWa: found.nomorWa
        };
      }
    }

    addCreativeTask({
      judul,
      kategori: finalKategori,
      deskripsi,
      ...pjData,
      tenggatDraf,
      tenggatKaryaAkhir,
      catatanRevisi: null
    });

    setJudul('');
    setDeskripsi('');
    setManualKategori('');
    setSelectedPjId('');
    setManualPjName('');
    setIsAddModalOpen(false);
  };

  const filteredTasks = creativeTasks.filter((t) => {
    if (activeCategoryFilter === 'Semua') return true;
    return t.kategori === activeCategoryFilter;
  });

  return (
    <div>
      {/* Header & Filter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={22} color="#1E3A8A" />
            <span>Manajemen Proyek & Tugas Kreatif</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#475569' }}>
            Papan pengerjaan Naskah, Desain Grafis, dan Video Editing dengan Indikator Batas Waktu Ganda.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${activeCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveCategoryFilter(cat)}
                style={{ fontSize: '0.775rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
            id="btn-add-creative-task"
          >
            <Plus size={16} />
            <span>Buat Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD 4 KOLOM */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {stages.map((stage) => {
          const tasksInStage = filteredTasks.filter((t) => t.status === stage);

          return (
            <div
              key={stage}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '400px'
              }}
            >
              {/* Column Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #E2E8F0'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0F172A' }}>
                  {stage}
                </div>
                <span style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {tasksInStage.length}
                </span>
              </div>

              {/* Task Cards in this stage */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {tasksInStage.map((task) => (
                  <div
                    key={task.id}
                    className="card"
                    style={{
                      padding: '1rem',
                      boxShadow: 'var(--shadow-sm)',
                      borderLeft: task.pcTerhubungId ? '4px solid #10B981' : '1px solid #E2E8F0'
                    }}
                  >
                    {/* Header Card: Category & Connected PC */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        color: '#1E3A8A',
                        background: '#EFF6FF',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {getCategoryIcon(task.kategori)}
                        {task.kategori}
                      </span>

                      {task.pcTerhubungId && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.7rem',
                          background: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          fontWeight: 700
                        }}>
                          <Monitor size={12} />
                          {task.pcTerhubungId}
                        </span>
                      )}
                    </div>

                    {/* Judul & Deskripsi */}
                    <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                      {task.judul}
                    </h4>

                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                      {task.deskripsi}
                    </p>

                    {/* Penanggung Jawab */}
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.75rem' }}>
                      👤 <strong>{task.penanggungJawabNama}</strong> ({task.penanggungJawabKelas})
                    </div>

                    {/* INDIKATOR BATAS WAKTU GANDA */}
                    <div style={{
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '0.5rem 0.65rem',
                      marginBottom: '0.85rem',
                      fontSize: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D97706', fontWeight: 600 }}>
                        <span>⏱️ Tenggat Draf:</span>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{task.tenggatDraf} WIB</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E11D48', fontWeight: 700 }}>
                        <span>🎯 Tenggat Akhir:</span>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{task.tenggatKaryaAkhir} WIB</span>
                      </div>
                    </div>

                    {/* Catatan Revisi jika ada */}
                    {task.catatanRevisi && (
                      <div style={{
                        fontSize: '0.725rem',
                        color: '#B45309',
                        background: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        borderRadius: '4px',
                        padding: '0.4rem',
                        marginBottom: '0.75rem'
                      }}>
                        <strong>Catatan:</strong> {task.catatanRevisi}
                      </div>
                    )}

                    {/* Pembaruan Tahapan Progres Interaktif */}
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.725rem', color: '#64748B' }}>Pindah Tahap:</span>
                      <select
                        value={task.status}
                        onChange={(e) => updateCreativeTaskStage(task.id, e.target.value)}
                        className="form-select"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          width: 'auto',
                          background: '#FFFFFF',
                          borderColor: '#CBD5E1'
                        }}
                      >
                        {stages.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {tasksInStage.length === 0 && (
                  <div style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: '#94A3B8',
                    fontSize: '0.8rem',
                    border: '1px dashed #CBD5E1',
                    borderRadius: '8px'
                  }}>
                    Tidak ada tugas di tahap ini
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Tugas Baru */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Buat Tugas Kreatif Baru"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreateTask}>
              Simpan & Tetapkan Tugas
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label className="form-label">Judul Proyek / Tugas *</label>
            <input
              type="text"
              className="form-input"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Editing Video Highlight Pekan Olahraga"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kategori Kreatif *</label>
              <select
                className="form-select"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
              >
                <option value="Editing Video">Editing Video</option>
                <option value="Desain Grafis">Desain Grafis</option>
                <option value="Pembuatan Naskah/Konsep">Pembuatan Naskah/Konsep</option>
                <option value="Fotografi & Retouching">Fotografi & Retouching</option>
                <option value="Animasi & Motion Graphics">Animasi & Motion Graphics</option>
                <option value="MANUAL">+ Kategori Lainnya (Tulis Manual)...</option>
              </select>
              {kategori === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualKategori}
                    onChange={(e) => setManualKategori(e.target.value)}
                    placeholder="Ketik kategori kreatif manual..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Penanggung Jawab Tugas *</label>
              <select
                className="form-select"
                value={selectedPjId}
                onChange={(e) => setSelectedPjId(e.target.value)}
              >
                <option value="">{currentMember?.nama || 'Saya'} ({currentMember?.kelas || 'Studio'})</option>
                {members.filter(m => m.id !== currentMember?.id).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kelas})
                  </option>
                ))}
                <option value="MANUAL">+ Tulis Nama Penanggung Jawab Manual...</option>
              </select>
              {selectedPjId === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualPjName}
                    onChange={(e) => setManualPjName(e.target.value)}
                    placeholder="Ketik nama penanggung jawab..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Pekerjaan & Arahan Visual</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Tuliskan format resolusi, durasi, aspek rasio, atau poin utama karya..."
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tenggat Pengumpulan Draf (Tanggal & Jam) *</label>
              <input
                type="text"
                className="form-input"
                value={tenggatDraf}
                onChange={(e) => setTenggatDraf(e.target.value)}
                placeholder="YYYY-MM-DD HH:MM"
                required
              />
              <span className="form-hint">Batas pengajuan draf pertama untuk peninjauan</span>
            </div>

            <div className="form-group">
              <label className="form-label">Tenggat Karya Akhir (Final Deadline) *</label>
              <input
                type="text"
                className="form-input"
                value={tenggatKaryaAkhir}
                onChange={(e) => setTenggatKaryaAkhir(e.target.value)}
                placeholder="YYYY-MM-DD HH:MM"
                required
              />
              <span className="form-hint">Batas mutlak karya siap tayang / cetak</span>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

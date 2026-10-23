import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Calendar, 
  Camera, 
  Video, 
  Users, 
  Clock, 
  Plus, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const EventCoverageTab = () => {
  const { 
    events, 
    scheduleEvent, 
    equipment, 
    members, 
    dutyRoster, 
    addDutyRoster,
    updateDutyRoster, 
    creativeTasks 
  } = useStudio();

  // Modal State untuk Penjadwalan Liputan Sekolah
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form Fields Liputan
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [waktuMulai, setWaktuMulai] = useState('08:00');
  const [waktuSelesai, setWaktuSelesai] = useState('15:00');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedToolIds, setSelectedToolIds] = useState([]);
  const [assignedPhotographerId, setAssignedPhotographerId] = useState('');
  const [manualPhotoName, setManualPhotoName] = useState('');
  const [assignedVideographerId, setAssignedVideographerId] = useState('');
  const [manualVideoName, setManualVideoName] = useState('');
  const [assignedEditorId, setAssignedEditorId] = useState('');
  const [manualEditorName, setManualEditorName] = useState('');

  // Modal State untuk Tambah / Edit Roster Piket
  const [isAddDutyModalOpen, setIsAddDutyModalOpen] = useState(false);
  const [editingDuty, setEditingDuty] = useState(null);
  const [dutyHari, setDutyHari] = useState('Senin');
  const [manualHari, setManualHari] = useState('');
  const [dutyTanggal, setDutyTanggal] = useState('');
  const [dutyStaffText, setDutyStaffText] = useState('');
  const [dutyHoursText, setDutyHoursText] = useState('14:00 - 17:00');
  const [dutyDescText, setDutyDescText] = useState('');

  // Toggle selection of equipment to lock
  const handleToggleTool = (toolId) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  // Submit Penjadwalan Liputan Sekolah (State-Machine Trigger 1)
  // Submit Penjadwalan Liputan Sekolah (Dipilih Manual oleh Admin creativecorner@gmail.com)
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!judul.trim() || !tanggal) {
      alert('Judul liputan sekolah dan tanggal pelaksanaan wajib diisi.');
      return;
    }

    const DITUGASKAN_ADMIN = 'creativecorner@gmail.com (Administrator Studio)';
    const personil = [];

    // 1. Fotografer Lapangan (Dipilih Manual oleh Admin)
    if (assignedPhotographerId === 'MANUAL' && manualPhotoName.trim()) {
      personil.push({
        anggotaId: `photo-manual-${Date.now()}`,
        nama: manualPhotoName.trim(),
        peran: 'Fotografer',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: 'Belum Mengambil Alat'
      });
    } else if (assignedPhotographerId) {
      const photoMember = members.find((m) => m.id === assignedPhotographerId);
      if (photoMember) {
        personil.push({
          anggotaId: photoMember.id,
          nama: photoMember.nama,
          peran: 'Fotografer',
          divisi: photoMember.divisi || photoMember.peranUtama || 'Public Relation',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: 'Belum Mengambil Alat'
        });
      }
    }

    // 2. Videografer Lapangan (Dipilih Manual oleh Admin)
    if (assignedVideographerId === 'MANUAL' && manualVideoName.trim()) {
      personil.push({
        anggotaId: `video-manual-${Date.now()}`,
        nama: manualVideoName.trim(),
        peran: 'Videografer',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: 'Belum Mengambil Alat'
      });
    } else if (assignedVideographerId) {
      const videoMember = members.find((m) => m.id === assignedVideographerId);
      if (videoMember) {
        personil.push({
          anggotaId: videoMember.id,
          nama: videoMember.nama,
          peran: 'Videografer',
          divisi: videoMember.divisi || videoMember.peranUtama || 'Editor',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: 'Belum Mengambil Alat'
        });
      }
    }

    // 3. Petugas Dokumentasi & Editor Liputan Tambahan
    if (assignedEditorId === 'MANUAL' && manualEditorName.trim()) {
      personil.push({
        anggotaId: `editor-manual-${Date.now()}`,
        nama: manualEditorName.trim(),
        peran: 'Petugas Liputan / Editor',
        divisi: 'Editor & Media',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: 'Belum Mengambil Alat'
      });
    } else if (assignedEditorId) {
      const editorMember = members.find((m) => m.id === assignedEditorId);
      if (editorMember) {
        personil.push({
          anggotaId: editorMember.id,
          nama: editorMember.nama,
          peran: 'Petugas Liputan / Editor',
          divisi: editorMember.divisi || editorMember.peranUtama || 'Editor',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: 'Belum Mengambil Alat'
        });
      }
    }

    scheduleEvent({
      judul,
      tanggal,
      waktuMulai,
      waktuSelesai,
      lokasi: lokasi || 'Area Sekolah',
      deskripsi,
      peralatanTerkunciIds: selectedToolIds,
      ditugaskanOleh: DITUGASKAN_ADMIN,
      personil
    });

    // Reset Form
    setJudul('');
    setTanggal('');
    setLokasi('');
    setDeskripsi('');
    setSelectedToolIds([]);
    setAssignedPhotographerId('');
    setManualPhotoName('');
    setAssignedVideographerId('');
    setManualVideoName('');
    setAssignedEditorId('');
    setManualEditorName('');
    setIsScheduleModalOpen(false);
  };

  // Submit Tambah Roster Piket Baru
  const handleAddDutySubmit = (e) => {
    e.preventDefault();
    if (!dutyStaffText.trim()) {
      alert('Nama petugas piket wajib diisi.');
      return;
    }

    const finalHari = dutyHari === 'MANUAL' ? (manualHari.trim() || 'Senin') : dutyHari;

    addDutyRoster({
      hari: finalHari,
      tanggal: dutyTanggal || 'Mingguan',
      jamOperasional: dutyHoursText,
      petugas: dutyStaffText.split(',').map((s) => s.trim()).filter(Boolean),
      tanggungJawab: dutyDescText || 'Pemeliharaan kebersihan dan inventarisasi studio'
    });

    setDutyStaffText('');
    setDutyDescText('');
    setManualHari('');
    setIsAddDutyModalOpen(false);
  };

  // Hitung agregat personil lapangan
  let totalBelumAmbil = 0;
  let totalSedangTugas = 0;
  let totalSudahSelesai = 0;

  events.forEach((ev) => {
    ev.personil.forEach((p) => {
      if (p.statusTugas === 'Belum Mengambil Alat') totalBelumAmbil++;
      else if (p.statusTugas === 'Sedang Melaksanakan Tugas') totalSedangTugas++;
      else if (p.statusTugas === 'Sudah Melaksanakan Tugas') totalSudahSelesai++;
    });
  });

  return (
    <div>
      {/* 1. LIVE TRACKER STATUS LAPANGAN (PERSONIL DOKUMENTASI) */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={22} color="#1E3A8A" />
              <span>Pelacakan Status Personil Lapangan (Live Tracker)</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Pemantauan real-time status tim dokumentasi di lapangan dari pengambilan alat hingga penutupan tugas.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsScheduleModalOpen(true)}
            id="btn-open-schedule-modal"
          >
            <Plus size={16} />
            <span>Jadwalkan Liputan & Kunci Alat</span>
          </button>
        </div>

        {/* 3 Indikator Counter Status Lapangan */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #1E3A8A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E3A8A', textTransform: 'uppercase' }}>
              Belum Mengambil Alat
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
              {totalBelumAmbil} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>Personil</span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748B' }}>
              Menunggu siswa mengisi Formulir Inspeksi Pengambilan di studio.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #D97706', background: '#FFFFFF' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
              Sedang Melaksanakan Tugas
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#D97706', margin: '0.25rem 0' }}>
              {totalSedangTugas} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>Personil</span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748B' }}>
              Alat telah diambil dan tim aktif mendokumentasikan kegiatan.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #10B981', background: '#FFFFFF' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              Sudah Melaksanakan Tugas
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>
              {totalSudahSelesai} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>Personil</span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748B' }}>
              Alat dan ruang telah dikembalikan melalui Formulir Inspeksi Pengembalian.
            </p>
          </div>
        </div>

        {/* Tabel Agenda Liputan Sekolah */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Camera size={20} color="#1E3A8A" />
              <span>Daftar Agenda Liputan Sekolah & Alokasi Alat</span>
            </h3>
          </div>

          {events.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B' }}>
              <Calendar size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>
                Belum Ada Agenda Liputan Sekolah
              </div>
              <p style={{ fontSize: '0.825rem', marginBottom: '1rem' }}>
                Silakan jadwalkan liputan kegiatan sekolah dan tentukan kamera/lensa yang otomatis dikunci kuotanya.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsScheduleModalOpen(true)}
              >
                <Plus size={15} />
                <span>Buat Jadwal Liputan Pertama</span>
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Agenda Liputan</th>
                    <th>Tanggal & Jam</th>
                    <th>Lokasi</th>
                    <th>Personil Lapangan & Status</th>
                    <th>Alat yang Dikunci Otomatis</th>
                    <th>Status Event</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => {
                    const lockedList = equipment.filter((eq) => ev.peralatanTerkunciIds?.includes(eq.id));
                    return (
                      <tr key={ev.id}>
                        <td>
                          <strong>{ev.judul}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{ev.deskripsi}</div>
                        </td>
                        <td>
                          <div>{ev.tanggal}</div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                            {ev.waktuMulai} - {ev.waktuSelesai} WIB
                          </span>
                        </td>
                        <td>{ev.lokasi}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ fontSize: '0.7rem', color: '#0369A1', background: '#E0F2FE', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, width: 'fit-content' }}>
                              📋 Ditugaskan manual: creativecorner@gmail.com
                            </div>
                            {ev.personil.map((p, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: '#F8FAFC', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                  {p.nama} ({p.peran})
                                </span>
                                <StatusBadge status={p.statusTugas} />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          {lockedList.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              {lockedList.map((tool) => (
                                <span key={tool.id} style={{ fontSize: '0.775rem', color: '#1E3A8A', fontWeight: 600 }}>
                                  🔒 {tool.nama}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Tanpa penguncian alat</span>
                          )}
                        </td>
                        <td>
                          <StatusBadge status={ev.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 2. DASBOR PROYEK TIM & PENGAWASAN KONTEN KREATIF */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Layers size={20} color="#1E3A8A" />
              <span>Dasbor Proyek Tim & Tenggat Waktu Konten</span>
            </h3>
            <div className="card-subtitle">
              Pusat monitoring seluruh pengerjaan Naskah, Desain Grafis, dan Video Editing dengan Indikator Batas Waktu Ganda.
            </div>
          </div>
        </div>

        {creativeTasks.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B' }}>
            <div style={{ fontWeight: 600, color: '#334155' }}>Belum Ada Tugas Konten Kreatif Terdaftar</div>
            <p style={{ fontSize: '0.8rem' }}>
              Tugas kreatif baru dapat dibuat oleh Admin atau Siswa melalui Portal Anggota.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Judul Proyek Konten</th>
                  <th>Kategori</th>
                  <th>Penanggung Jawab</th>
                  <th>Tenggat Draf (WIB)</th>
                  <th>Tenggat Karya Akhir (WIB)</th>
                  <th>Workstation PC</th>
                  <th>Tahapan Progres</th>
                </tr>
              </thead>
              <tbody>
                {creativeTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.judul}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.deskripsi}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E3A8A' }}>
                        {t.kategori}
                      </span>
                    </td>
                    <td>
                      <strong>{t.penanggungJawabNama}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.penanggungJawabKelas}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#D97706', fontWeight: 600 }}>
                        {t.tenggatDraf}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#E11D48', fontWeight: 700 }}>
                        {t.tenggatKaryaAkhir}
                      </span>
                    </td>
                    <td>
                      {t.pcTerhubungId ? (
                        <span style={{ background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {t.pcTerhubungId} (Aktif)
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>-</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. PENGATURAN GILIRAN PIKET STUDIO */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Clock size={20} color="#1E3A8A" />
              <span>Pengaturan Roster Giliran Piket Jaga Studio Creative Corner</span>
            </h3>
            <div className="card-subtitle">
              Atur jadwal jaga harian anggota untuk memastikan kerapian dan inventarisasi studio terjaga.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddDutyModalOpen(true)}
          >
            <Plus size={15} />
            <span>Tambah Roster Piket</span>
          </button>
        </div>

        {dutyRoster.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B' }}>
            <div style={{ fontWeight: 600, color: '#334155' }}>Belum Ada Roster Piket Studio</div>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              Klik tombol 'Tambah Roster Piket' di atas untuk menyusun jadwal jaga anggota studio.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Hari & Tanggal</th>
                  <th>Jam Piket</th>
                  <th>Daftar Anggota Bertugas</th>
                  <th>Tugas Operasional</th>
                  <th>Aksi Kelola</th>
                </tr>
              </thead>
              <tbody>
                {dutyRoster.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong>{d.hari}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{d.tanggal}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}>
                      {d.jamOperasional} WIB
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', color: '#0F172A', fontWeight: 600 }}>
                        {d.petugas.join(' • ')}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#334155' }}>
                      {d.tanggungJawab}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingDuty(d);
                          setDutyStaffText(d.petugas.join(', '));
                          setDutyHoursText(d.jamOperasional);
                        }}
                      >
                        Ubah Roster
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PENJADWALAN LIPUTAN SEKOLAH (TRIGGER 1) */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        size="large"
        title="Penjadwalan Liputan Sekolah & Penguncian Kuota Otomatis"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsScheduleModalOpen(false)}>
              Batal
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleScheduleSubmit}
              id="btn-save-event-schedule"
            >
              <CheckCircle size={16} />
              <span>Simpan Jadwal & Kunci Alat</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleScheduleSubmit}>
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
            <Lock size={22} color="#1E3A8A" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E3A8A' }}>
                Alur Otomatis Creative Corner (State-Machine Trigger 1)
              </div>
              <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '2px' }}>
                Peralatan yang Anda centang di bawah akan <strong>otomatis terkunci kuotanya pada kalender utama</strong> (status menjadi <em>"Terkunci Event"</em>) sehingga siswa lain tidak dapat meminjam unit tersebut secara mandiri di jam terkait.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Acara / Agenda Liputan Sekolah *</label>
            <input
              type="text"
              className="form-input"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Liputan Upacara Peringatan Hari Pahlawan & Pensi"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Tanggal Pelaksanaan *</label>
              <input
                type="date"
                className="form-input"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Jam Mulai (WIB) *</label>
              <input
                type="time"
                className="form-input"
                value={waktuMulai}
                onChange={(e) => setWaktuMulai(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Jam Selesai (WIB) *</label>
              <input
                type="time"
                className="form-input"
                value={waktuSelesai}
                onChange={(e) => setWaktuSelesai(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lokasi Kegiatan di Sekolah *</label>
            <input
              type="text"
              className="form-input"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Plaza Upacara Utama, Lapangan Basket Indoor"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi & Arahan Liputan</label>
            <textarea
              className="form-textarea"
              rows="2"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Instruksi shot list, angle video, wawancara, atau dress code personil..."
            ></textarea>
          </div>

          {/* Penetapan Personil Dokumentasi - Dipilih Manual oleh creativecorner@gmail.com */}
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderRadius: '10px',
            padding: '0.85rem 1.15rem',
            marginBottom: '1.25rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <CheckCircle size={22} color="#16A34A" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#166534' }}>
                Penetapan Petugas Dokumentasi Dipilih Manual oleh Akun: <code>creativecorner@gmail.com</code>
              </div>
              <p style={{ fontSize: '0.775rem', color: '#15803D', margin: '2px 0 0' }}>
                Admin studio berhak menentukan siswa/petugas dokumentasi lapangan (Fotografer, Videografer, Editor) berdasarkan divisi masing-masing.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Fotografer */}
            <div className="form-group">
              <label className="form-label">Tugaskan Fotografer Lapangan *</label>
              <select
                className="form-select"
                value={assignedPhotographerId}
                onChange={(e) => setAssignedPhotographerId(e.target.value)}
              >
                <option value="">-- Pilih Fotografer Terdaftar --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kelas} • Divisi: {m.divisi || m.peranUtama})
                  </option>
                ))}
                <option value="MANUAL">+ Tulis Nama Fotografer Manual...</option>
              </select>
              {assignedPhotographerId === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualPhotoName}
                    onChange={(e) => setManualPhotoName(e.target.value)}
                    placeholder="Ketik nama lengkap fotografer..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            {/* Videografer */}
            <div className="form-group">
              <label className="form-label">Tugaskan Videografer Lapangan *</label>
              <select
                className="form-select"
                value={assignedVideographerId}
                onChange={(e) => setAssignedVideographerId(e.target.value)}
              >
                <option value="">-- Pilih Videografer Terdaftar --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kelas} • Divisi: {m.divisi || m.peranUtama})
                  </option>
                ))}
                <option value="MANUAL">+ Tulis Nama Videografer Manual...</option>
              </select>
              {assignedVideographerId === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualVideoName}
                    onChange={(e) => setManualVideoName(e.target.value)}
                    placeholder="Ketik nama lengkap videografer..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            {/* Petugas Tambahan / Editor Liputan */}
            <div className="form-group">
              <label className="form-label">Petugas Dokumentasi & Editor Tambahan (Opsional)</label>
              <select
                className="form-select"
                value={assignedEditorId}
                onChange={(e) => setAssignedEditorId(e.target.value)}
              >
                <option value="">-- Tanpa Petugas Tambahan --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kelas} • Divisi: {m.divisi || m.peranUtama})
                  </option>
                ))}
                <option value="MANUAL">+ Tulis Nama Petugas Manual...</option>
              </select>
              {assignedEditorId === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualEditorName}
                    onChange={(e) => setManualEditorName(e.target.value)}
                    placeholder="Ketik nama petugas tambahan..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pemilihan Peralatan yang Otomatis Terkunci Kuotanya */}
          <div className="form-group">
            <label className="form-label">
              Pilih Unit Peralatan / Ruang yang Otomatis Dikunci Kuotanya:
            </label>
            {equipment.length === 0 ? (
              <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1', fontSize: '0.8rem', color: '#64748B' }}>
                Belum ada peralatan terdaftar di database. Anda dapat menambahkan kamera/lensa terlebih dahulu di tab <strong>Inventaris & Validasi Laporan Fisik</strong>.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '0.65rem',
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.75rem',
                background: '#FAFAFA'
              }}>
                {equipment.map((item) => {
                  const isSelected = selectedToolIds.includes(item.id);
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
                        onChange={() => handleToggleTool(item.id)}
                        style={{ accentColor: '#1E3A8A' }}
                      />
                      <div>
                        <strong style={{ color: '#0F172A' }}>{item.nama}</strong>
                        <div style={{ fontSize: '0.725rem', color: '#64748B' }}>
                          {item.kategori} • Status: {item.status}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* MODAL TAMBAH ROSTER PIKET BARU */}
      {isAddDutyModalOpen && (
        <Modal
          isOpen={isAddDutyModalOpen}
          onClose={() => setIsAddDutyModalOpen(false)}
          title="Tambah Roster Giliran Piket Studio Baru"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddDutyModalOpen(false)}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddDutySubmit}>
                Simpan Roster
              </button>
            </>
          }
        >
          <form onSubmit={handleAddDutySubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Hari *</label>
                <select
                  className="form-select"
                  value={dutyHari}
                  onChange={(e) => setDutyHari(e.target.value)}
                >
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                  <option value="MANUAL">+ Tulis Hari / Jadwal Manual...</option>
                </select>
                {dutyHari === 'MANUAL' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={manualHari}
                      onChange={(e) => setManualHari(e.target.value)}
                      placeholder="Contoh: Minggu, Libur Nasional, H-1 Acara..."
                      autoFocus
                      required
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="form-label">Tanggal Pelaksanaan (Opsional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={dutyTanggal}
                  onChange={(e) => setDutyTanggal(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Jam Operasional Piket (WIB) *</label>
              <input
                type="text"
                className="form-input"
                value={dutyHoursText}
                onChange={(e) => setDutyHoursText(e.target.value)}
                placeholder="14:00 - 17:00"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Petugas Bertugas (Pisahkan dengan koma) *</label>
              <input
                type="text"
                className="form-input"
                value={dutyStaffText}
                onChange={(e) => setDutyStaffText(e.target.value)}
                placeholder="Nama Anggota 1, Nama Anggota 2"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tanggung Jawab Operasional</label>
              <input
                type="text"
                className="form-input"
                value={dutyDescText}
                onChange={(e) => setDutyDescText(e.target.value)}
                placeholder="Contoh: Pembersihan dry cabinet dan stand by peminjaman alat"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Edit Roster Piket */}
      {editingDuty && (
        <Modal
          isOpen={Boolean(editingDuty)}
          onClose={() => setEditingDuty(null)}
          title={`Ubah Jadwal Piket: ${editingDuty.hari}`}
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingDuty(null)}>
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  updateDutyRoster(editingDuty.id, {
                    petugas: dutyStaffText.split(',').map((s) => s.trim()).filter(Boolean),
                    jamOperasional: dutyHoursText
                  });
                  setEditingDuty(null);
                }}
              >
                Simpan Perubahan
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Daftar Nama Petugas Piket (Pisahkan dengan koma)</label>
            <input
              type="text"
              className="form-input"
              value={dutyStaffText}
              onChange={(e) => setDutyStaffText(e.target.value)}
              placeholder="Contoh: Rizky Ramadhan, Clara Aurelia"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Jam Operasional Jaga Studio</label>
            <input
              type="text"
              className="form-input"
              value={dutyHoursText}
              onChange={(e) => setDutyHoursText(e.target.value)}
              placeholder="Contoh: 14:00 - 17:00"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

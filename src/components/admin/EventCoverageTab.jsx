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
  CheckCircle2,
  AlertCircle,
  Layers,
  MapPin,
  Sparkles,
  Smartphone,
  Send,
  MessageSquare,
  Trash2,
  Play,
  RotateCcw,
  Edit3,
  Filter,
  XCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { WhatsAppModal } from '../common/WhatsAppModal';

export const EventCoverageTab = () => {
  const { 
    events, 
    scheduleEvent, 
    completeEvent,
    deleteEvent,
    updateEventStatus,
    updateEvent,
    equipment, 
    members, 
    dutyRoster, 
    addDutyRoster,
    updateDutyRoster, 
    creativeTasks 
  } = useStudio();

  // Filter Status Agenda Liputan
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Modal State untuk Penjadwalan Liputan Sekolah
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form Fields Liputan Baru
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [waktuMulai, setWaktuMulai] = useState('08:00');
  const [waktuSelesai, setWaktuSelesai] = useState('15:00');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedToolIds, setSelectedToolIds] = useState([]);
  // 4 Petugas Dokumentasi Lapangan: Kamera Foto 1, Foto 2, Video, Live Report (HP)
  const [assignedFoto1Id, setAssignedFoto1Id] = useState('');
  const [manualFoto1Name, setManualFoto1Name] = useState('');
  const [assignedFoto2Id, setAssignedFoto2Id] = useState('');
  const [manualFoto2Name, setManualFoto2Name] = useState('');
  const [assignedVideoId, setAssignedVideoId] = useState('');
  const [manualVideoName, setManualVideoName] = useState('');
  const [assignedLiveReportId, setAssignedLiveReportId] = useState('');
  const [manualLiveReportName, setManualLiveReportName] = useState('');

  // Modal State untuk Edit Agenda Liputan
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editJudul, setEditJudul] = useState('');
  const [editTanggal, setEditTanggal] = useState('');
  const [editWaktuMulai, setEditWaktuMulai] = useState('08:00');
  const [editWaktuSelesai, setEditWaktuSelesai] = useState('15:00');
  const [editLokasi, setEditLokasi] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const [editStatus, setEditStatus] = useState('Akan Datang');
  const [editSelectedToolIds, setEditSelectedToolIds] = useState([]);
  const [editAssignedFoto1Id, setEditAssignedFoto1Id] = useState('');
  const [editManualFoto1Name, setEditManualFoto1Name] = useState('');
  const [editAssignedFoto2Id, setEditAssignedFoto2Id] = useState('');
  const [editManualFoto2Name, setEditManualFoto2Name] = useState('');
  const [editAssignedVideoId, setEditAssignedVideoId] = useState('');
  const [editManualVideoName, setEditManualVideoName] = useState('');
  const [editAssignedLiveReportId, setEditAssignedLiveReportId] = useState('');
  const [editManualLiveReportName, setEditManualLiveReportName] = useState('');

  // Modal State untuk Pratinjau WhatsApp Pengingat Lapangan
  const [waModalData, setWaModalData] = useState(null);

  // Trigger One-Click WA Penugasan Dokumentasi Lapangan
  const handleSendCoverageReminder = (event, personil) => {
    const foundMember = members.find(
      (m) => m.id === personil.anggotaId || m.nama?.toLowerCase().trim() === personil.nama?.toLowerCase().trim()
    );
    const phone = foundMember?.nomorWa || '6281234567890';

    const lockedNames = equipment
      .filter((eq) => event.peralatanTerkunciIds?.includes(eq.id))
      .map((eq) => eq.nama)
      .join(', ');

    const actionText = personil.statusTugas === 'Belum Mengambil Alat'
      ? '*MOHON SEGERA*: Hadir di Studio Creative Corner sebelum acara dimulai untuk mengambil perlengkapan alat dan mengisi *Formulir Inspeksi Pengambilan* di sistem.'
      : personil.statusTugas === 'Sedang Melaksanakan Tugas'
        ? 'Pastikan seluruh momen penting acara terdokumentasikan dengan baik. Setelah agenda selesai, segera kembalikan unit alat ke studio dan mengisi *Formulir Inspeksi Pengembalian*.'
        : 'Terima kasih telah menyelesaikan seluruh rangkaian dokumentasi lapangan dan inspeksi pengembalian alat dengan baik.';

    const rawMessage = `Halo *${personil.nama}*, pengingat penugasan liputan lapangan dari *Creative Corner*.

Anda ditugaskan sebagai *${personil.peran}* pada agenda kegiatan berikut:
- *Acara*: ${event.judul}
- *Lokasi*: ${event.lokasi || 'Area Sekolah'}
- *Tanggal*: ${event.tanggal}
- *Waktu*: ${event.waktuMulai} - ${event.waktuSelesai} WIB
- *Peralatan Dialokasikan*: ${lockedNames || 'Peralatan Dokumentasi Lapangan'}

Status Tugas Anda: *${personil.statusTugas}*.
${actionText}

Semangat bertugas & terima kasih!
_Tim Pengelola Studio Creative Corner_`;

    setWaModalData({
      recipientName: `${personil.nama} (${personil.peran})`,
      phoneNumber: phone,
      messageText: rawMessage,
      title: `Pengingat Dokumentasi: ${personil.nama} (${personil.peran})`
    });
  };

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

    // 1. Kamera Foto 1
    if (assignedFoto1Id === 'MANUAL' && manualFoto1Name.trim()) {
      personil.push({
        anggotaId: `foto1-manual-${Date.now()}`,
        nama: manualFoto1Name.trim(),
        peran: 'Kamera Foto 1',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: 'Belum Mengambil Alat'
      });
    } else if (assignedFoto1Id) {
      const m1 = members.find((m) => m.id === assignedFoto1Id);
      if (m1) {
        personil.push({
          anggotaId: m1.id,
          nama: m1.nama,
          peran: 'Kamera Foto 1',
          divisi: m1.divisi || m1.peranUtama || 'Dokumentasi',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: 'Belum Mengambil Alat'
        });
      }
    }

    // 2. Foto 2
    if (assignedFoto2Id === 'MANUAL' && manualFoto2Name.trim()) {
      personil.push({
        anggotaId: `foto2-manual-${Date.now()}`,
        nama: manualFoto2Name.trim(),
        peran: 'Foto 2',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: 'Belum Mengambil Alat'
      });
    } else if (assignedFoto2Id) {
      const m2 = members.find((m) => m.id === assignedFoto2Id);
      if (m2) {
        personil.push({
          anggotaId: m2.id,
          nama: m2.nama,
          peran: 'Foto 2',
          divisi: m2.divisi || m2.peranUtama || 'Dokumentasi',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: 'Belum Mengambil Alat'
        });
      }
    }

    // 3. Video
    if (assignedVideoId === 'MANUAL' && manualVideoName.trim()) {
      personil.push({
        anggotaId: `video-manual-${Date.now()}`,
        nama: manualVideoName.trim(),
        peran: 'Video',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: 'Belum Mengambil Alat'
      });
    } else if (assignedVideoId) {
      const mVideo = members.find((m) => m.id === assignedVideoId);
      if (mVideo) {
        personil.push({
          anggotaId: mVideo.id,
          nama: mVideo.nama,
          peran: 'Video',
          divisi: mVideo.divisi || mVideo.peranUtama || 'Editor',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: 'Belum Mengambil Alat'
        });
      }
    }

    // 4. Live Report (HP)
    if (assignedLiveReportId === 'MANUAL' && manualLiveReportName.trim()) {
      personil.push({
        anggotaId: `livereport-manual-${Date.now()}`,
        nama: manualLiveReportName.trim(),
        peran: 'Live Report (HP)',
        divisi: 'Public Relation & Social Media',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: 'Belum Mengambil Alat'
      });
    } else if (assignedLiveReportId) {
      const mLive = members.find((m) => m.id === assignedLiveReportId);
      if (mLive) {
        personil.push({
          anggotaId: mLive.id,
          nama: mLive.nama,
          peran: 'Live Report (HP)',
          divisi: mLive.divisi || mLive.peranUtama || 'Public Relation',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: 'Belum Mengambil Alat'
        });
      }
    }

    if (personil.length === 0) {
      alert('Silakan pilih minimal 1 petugas dokumentasi lapangan (Kamera Foto 1, Foto 2, Video, atau Live Report HP).');
      return;
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
    setAssignedFoto1Id('');
    setManualFoto1Name('');
    setAssignedFoto2Id('');
    setManualFoto2Name('');
    setAssignedVideoId('');
    setManualVideoName('');
    setAssignedLiveReportId('');
    setManualLiveReportName('');
    setIsScheduleModalOpen(false);
  };

  // Buka Modal Edit Agenda Liputan
  const handleOpenEditModal = (ev) => {
    setEditingEventId(ev.id);
    setEditJudul(ev.judul || '');
    setEditTanggal(ev.tanggal || '');
    setEditWaktuMulai(ev.waktuMulai || '08:00');
    setEditWaktuSelesai(ev.waktuSelesai || '15:00');
    setEditLokasi(ev.lokasi || '');
    setEditDeskripsi(ev.deskripsi || '');
    setEditStatus(ev.status || 'Akan Datang');
    setEditSelectedToolIds(ev.peralatanTerkunciIds || []);

    const foto1 = ev.personil?.find((p) => p.peran === 'Kamera Foto 1');
    if (foto1) {
      const m = members.find((x) => x.id === foto1.anggotaId);
      if (m) {
        setEditAssignedFoto1Id(m.id);
        setEditManualFoto1Name('');
      } else {
        setEditAssignedFoto1Id('MANUAL');
        setEditManualFoto1Name(foto1.nama || '');
      }
    } else {
      setEditAssignedFoto1Id('');
      setEditManualFoto1Name('');
    }

    const foto2 = ev.personil?.find((p) => p.peran === 'Foto 2' || p.peran === 'Kamera Foto 2');
    if (foto2) {
      const m = members.find((x) => x.id === foto2.anggotaId);
      if (m) {
        setEditAssignedFoto2Id(m.id);
        setEditManualFoto2Name('');
      } else {
        setEditAssignedFoto2Id('MANUAL');
        setEditManualFoto2Name(foto2.nama || '');
      }
    } else {
      setEditAssignedFoto2Id('');
      setEditManualFoto2Name('');
    }

    const video = ev.personil?.find((p) => p.peran === 'Video' || p.peran === 'Videografer');
    if (video) {
      const m = members.find((x) => x.id === video.anggotaId);
      if (m) {
        setEditAssignedVideoId(m.id);
        setEditManualVideoName('');
      } else {
        setEditAssignedVideoId('MANUAL');
        setEditManualVideoName(video.nama || '');
      }
    } else {
      setEditAssignedVideoId('');
      setEditManualVideoName('');
    }

    const liveReport = ev.personil?.find((p) => p.peran?.includes('Live Report'));
    if (liveReport) {
      const m = members.find((x) => x.id === liveReport.anggotaId);
      if (m) {
        setEditAssignedLiveReportId(m.id);
        setEditManualLiveReportName('');
      } else {
        setEditAssignedLiveReportId('MANUAL');
        setEditManualLiveReportName(liveReport.nama || '');
      }
    } else {
      setEditAssignedLiveReportId('');
      setEditManualLiveReportName('');
    }

    setIsEditModalOpen(true);
  };

  const handleToggleEditTool = (toolId) => {
    setEditSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleEditSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editJudul.trim() || !editTanggal) {
      alert('Judul liputan sekolah dan tanggal pelaksanaan wajib diisi.');
      return;
    }

    const personil = [];
    if (editAssignedFoto1Id === 'MANUAL' && editManualFoto1Name.trim()) {
      personil.push({
        anggotaId: `foto1-manual-${Date.now()}`,
        nama: editManualFoto1Name.trim(),
        peran: 'Kamera Foto 1',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: editStatus === 'Selesai' ? 'Sudah Melaksanakan Tugas' : 'Belum Mengambil Alat'
      });
    } else if (editAssignedFoto1Id && editAssignedFoto1Id !== 'MANUAL') {
      const m1 = members.find((m) => m.id === editAssignedFoto1Id);
      if (m1) {
        personil.push({
          anggotaId: m1.id,
          nama: m1.nama,
          peran: 'Kamera Foto 1',
          divisi: m1.divisi || m1.peranUtama || 'Dokumentasi',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: editStatus === 'Selesai' ? 'Sudah Melaksanakan Tugas' : 'Belum Mengambil Alat'
        });
      }
    }

    if (editAssignedFoto2Id === 'MANUAL' && editManualFoto2Name.trim()) {
      personil.push({
        anggotaId: `foto2-manual-${Date.now()}`,
        nama: editManualFoto2Name.trim(),
        peran: 'Foto 2',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: editStatus === 'Selesai' ? 'Sudah Melaksanakan Tugas' : 'Belum Mengambil Alat'
      });
    } else if (editAssignedFoto2Id && editAssignedFoto2Id !== 'MANUAL') {
      const m2 = members.find((m) => m.id === editAssignedFoto2Id);
      if (m2) {
        personil.push({
          anggotaId: m2.id,
          nama: m2.nama,
          peran: 'Foto 2',
          divisi: m2.divisi || m2.peranUtama || 'Dokumentasi',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: editStatus === 'Selesai' ? 'Sudah Melaksanakan Tugas' : 'Belum Mengambil Alat'
        });
      }
    }

    if (editAssignedVideoId === 'MANUAL' && editManualVideoName.trim()) {
      personil.push({
        anggotaId: `video-manual-${Date.now()}`,
        nama: editManualVideoName.trim(),
        peran: 'Video',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: editStatus === 'Selesai' ? 'Sudah Melaksanakan Tugas' : 'Belum Mengambil Alat'
      });
    } else if (editAssignedVideoId && editAssignedVideoId !== 'MANUAL') {
      const mv = members.find((m) => m.id === editAssignedVideoId);
      if (mv) {
        personil.push({
          anggotaId: mv.id,
          nama: mv.nama,
          peran: 'Video',
          divisi: mv.divisi || mv.peranUtama || 'Dokumentasi',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: editStatus === 'Selesai' ? 'Sudah Melaksanakan Tugas' : 'Belum Mengambil Alat'
        });
      }
    }

    if (editAssignedLiveReportId === 'MANUAL' && editManualLiveReportName.trim()) {
      personil.push({
        anggotaId: `live-manual-${Date.now()}`,
        nama: editManualLiveReportName.trim(),
        peran: 'Live Report (HP)',
        divisi: 'Dokumentasi',
        ditugaskanOleh: 'creativecorner@gmail.com',
        statusTugas: editStatus === 'Selesai' ? 'Sudah Melaksanakan Tugas' : 'Belum Mengambil Alat'
      });
    } else if (editAssignedLiveReportId && editAssignedLiveReportId !== 'MANUAL') {
      const ml = members.find((m) => m.id === editAssignedLiveReportId);
      if (ml) {
        personil.push({
          anggotaId: ml.id,
          nama: ml.nama,
          peran: 'Live Report (HP)',
          divisi: ml.divisi || ml.peranUtama || 'Public Relation',
          ditugaskanOleh: 'creativecorner@gmail.com',
          statusTugas: editStatus === 'Selesai' ? 'Sudah Melaksanakan Tugas' : 'Belum Mengambil Alat'
        });
      }
    }

    if (personil.length === 0) {
      alert('Silakan pilih minimal 1 petugas dokumentasi lapangan.');
      return;
    }

    updateEvent(editingEventId, {
      judul: editJudul.trim(),
      tanggal: editTanggal,
      waktuMulai: editWaktuMulai,
      waktuSelesai: editWaktuSelesai,
      lokasi: editLokasi.trim() || 'Area Sekolah',
      deskripsi: editDeskripsi.trim() || 'Liputan kegiatan resmi sekolah.',
      status: editStatus,
      peralatanTerkunciIds: editSelectedToolIds,
      personil
    });

    setIsEditModalOpen(false);
  };

  // Tandai Agenda Selesai
  const handleCompleteEvent = (ev) => {
    if (window.confirm(`Tandai agenda liputan "${ev.judul}" sebagai SELESAI?\n\nPeralatan yang terkunci untuk agenda ini akan otomatis dibuka kembali ke status 'Tersedia' dan tugas personil ditandai tuntas.`)) {
      completeEvent(ev.id);
    }
  };

  // Hapus Agenda Liputan
  const handleDeleteEvent = (ev) => {
    if (window.confirm(`HAPUS AGENDA LIPUTAN:\nApakah Anda yakin ingin menghapus agenda "${ev.judul}"?\n\nAlat yang terkunci otomatis akan dilepaskan kembali ke status 'Tersedia'.`)) {
      deleteEvent(ev.id);
    }
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
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div>
              <h3 className="card-title">
                <Camera size={20} color="#1E3A8A" />
                <span>Daftar Agenda Liputan Sekolah & Alokasi Alat</span>
              </h3>
              <div className="card-subtitle">
                Pantau penugasan personil, alokasi alat otomatis, dan kelola status liputan (Akan Datang, Berlangsung, Selesai, Hapus).
              </div>
            </div>

            {/* Filter Status Agenda */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'Semua' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('Semua')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Semua ({events.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'Akan Datang' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('Akan Datang')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Akan Datang ({events.filter((e) => e.status === 'Akan Datang').length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'Sedang Berlangsung' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('Sedang Berlangsung')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Sedang Berlangsung ({events.filter((e) => e.status === 'Sedang Berlangsung').length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'Selesai' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('Selesai')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Selesai ({events.filter((e) => e.status === 'Selesai').length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'Dibatalkan' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('Dibatalkan')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Dibatalkan ({events.filter((e) => e.status === 'Dibatalkan').length})
              </button>
            </div>
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
              {events.filter((ev) => statusFilter === 'Semua' || ev.status === statusFilter).length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', color: '#64748B', fontSize: '0.85rem' }}>
                  Tidak ada agenda liputan dengan filter status <strong>"{statusFilter}"</strong>.
                </div>
              ) : (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Agenda Liputan</th>
                      <th>Tanggal & Jam</th>
                      <th>Lokasi</th>
                      <th>Personil Lapangan & Status</th>
                      <th>Alat yang Dikunci Otomatis</th>
                      <th>Status Event</th>
                      <th style={{ minWidth: '190px' }}>Aksi Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events
                      .filter((ev) => statusFilter === 'Semua' || ev.status === statusFilter)
                      .map((ev) => {
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
                                  Ditugaskan manual: creativecorner@gmail.com
                                </div>
                                {ev.personil.map((p, idx) => {
                                  const getRoleBadge = (role) => {
                                    if (role === 'Kamera Foto 1') return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', Icon: Camera };
                                    if (role === 'Foto 2') return { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD', Icon: Camera };
                                    if (role === 'Video') return { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', Icon: Video };
                                    if (role?.includes('Live Report')) return { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', Icon: Smartphone };
                                    return { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0', Icon: Camera };
                                  };
                                  const roleMeta = getRoleBadge(p.peran);
                                  const RoleIcon = roleMeta.Icon;

                                  return (
                                    <div key={idx} style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: '0.5rem',
                                      background: roleMeta.bg,
                                      border: `1px solid ${roleMeta.border}`,
                                      padding: '0.3rem 0.55rem',
                                      borderRadius: '6px'
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <RoleIcon size={13} color={roleMeta.text} />
                                        <span style={{ fontSize: '0.785rem', fontWeight: 700, color: roleMeta.text }}>
                                          {p.nama}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>({p.peran})</span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <StatusBadge status={p.statusTugas} />
                                        <button
                                          type="button"
                                          className="btn btn-whatsapp btn-sm"
                                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                          onClick={() => handleSendCoverageReminder(ev, p)}
                                          title={`Kirim pengingat WhatsApp ke ${p.nama}`}
                                          id={`btn-live-wa-${ev.id}-${idx}`}
                                        >
                                          <Send size={11} />
                                          <span>WA</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                            <td>
                              {lockedList.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                  {lockedList.map((tool) => (
                                    <span key={tool.id} style={{ fontSize: '0.775rem', color: '#1E3A8A', fontWeight: 600 }}>
                                      {tool.nama}
                                    </span>
                                  ))}
                                  {ev.status === 'Selesai' && (
                                    <span style={{ fontSize: '0.7rem', color: '#059669', fontStyle: 'italic', marginTop: '2px' }}>
                                      (Telah dibuka kembali)
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Tanpa penguncian alat</span>
                              )}
                            </td>
                            <td>
                              <StatusBadge status={ev.status} />
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                {/* Selector Ubah Status Cepat */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <select
                                    className="form-select form-select-sm"
                                    value={ev.status}
                                    onChange={(e) => updateEventStatus(ev.id, e.target.value)}
                                    style={{
                                      padding: '0.25rem 0.45rem',
                                      fontSize: '0.725rem',
                                      borderRadius: '6px',
                                      fontWeight: 700,
                                      background: ev.status === 'Selesai' ? '#ECFDF5' : ev.status === 'Sedang Berlangsung' ? '#FFFBEB' : '#F8FAFC',
                                      color: ev.status === 'Selesai' ? '#059669' : ev.status === 'Sedang Berlangsung' ? '#B45309' : '#1E293B',
                                      borderColor: ev.status === 'Selesai' ? '#A7F3D0' : ev.status === 'Sedang Berlangsung' ? '#FDE68A' : '#CBD5E1',
                                      width: '100%'
                                    }}
                                    title="Pilih status agenda langsung"
                                    id={`select-status-${ev.id}`}
                                  >
                                    <option value="Akan Datang">Akan Datang</option>
                                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Dibatalkan">Dibatalkan</option>
                                  </select>
                                </div>

                                {/* Tombol Aksi Langsung */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                                  {ev.status !== 'Selesai' ? (
                                    <button
                                      type="button"
                                      className="btn btn-sm"
                                      style={{
                                        background: '#ECFDF5',
                                        color: '#059669',
                                        border: '1px solid #A7F3D0',
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.725rem',
                                        fontWeight: 700
                                      }}
                                      onClick={() => handleCompleteEvent(ev)}
                                      title="Tandai Selesai & Buka Kuota Alat"
                                      id={`btn-complete-${ev.id}`}
                                    >
                                      <CheckCircle2 size={13} />
                                      <span>Selesai</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-sm"
                                      style={{
                                        background: '#F8FAFC',
                                        color: '#475569',
                                        border: '1px solid #CBD5E1',
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.725rem'
                                      }}
                                      onClick={() => updateEventStatus(ev.id, 'Akan Datang')}
                                      title="Kembalikan status ke Akan Datang"
                                      id={`btn-reset-${ev.id}`}
                                    >
                                      <RotateCcw size={12} />
                                      <span>Reset</span>
                                    </button>
                                  )}

                                  {ev.status === 'Akan Datang' && (
                                    <button
                                      type="button"
                                      className="btn btn-sm"
                                      style={{
                                        background: '#EFF6FF',
                                        color: '#1E40AF',
                                        border: '1px solid #BFDBFE',
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.725rem',
                                        fontWeight: 600
                                      }}
                                      onClick={() => updateEventStatus(ev.id, 'Sedang Berlangsung')}
                                      title="Mulai Liputan Lapangan"
                                      id={`btn-start-${ev.id}`}
                                    >
                                      <Play size={11} fill="#1E40AF" />
                                      <span>Mulai</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                                    onClick={() => handleOpenEditModal(ev)}
                                    title="Edit Detail Agenda & Alokasi Alat"
                                    id={`btn-edit-${ev.id}`}
                                  >
                                    <Edit3 size={13} />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                                    onClick={() => handleDeleteEvent(ev)}
                                    title="Hapus Agenda Liputan & Lepas Kuota Alat"
                                    id={`btn-delete-${ev.id}`}
                                  >
                                    <Trash2 size={13} />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
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

          {/* Penetapan Personil Dokumentasi - 4 Petugas Dokumentasi Lapangan */}
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
                4 Petugas Dokumentasi di Lapangan (Dipilih Manual oleh Administrator)
              </div>
              <p style={{ fontSize: '0.775rem', color: '#15803D', margin: '2px 0 0' }}>
                Admin studio menentukan petugas dokumentasi: <strong>Kamera Foto 1</strong>, <strong>Foto 2</strong>, <strong>Video</strong>, dan <strong>Live Report (HP)</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* 1. Kamera Foto 1 */}
            <div className="form-group" style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1E3A8A', fontWeight: 700 }}>
                <Camera size={15} color="#2563EB" />
                <span>1. Kamera Foto 1</span>
              </label>
              <select
                className="form-select"
                value={assignedFoto1Id}
                onChange={(e) => setAssignedFoto1Id(e.target.value)}
              >
                <option value="">-- Tanpa Kamera Foto 1 --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kelas} • {m.divisi || m.peranUtama})
                  </option>
                ))}
                <option value="MANUAL">+ Tulis Nama Manual...</option>
              </select>
              {assignedFoto1Id === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualFoto1Name}
                    onChange={(e) => setManualFoto1Name(e.target.value)}
                    placeholder="Nama lengkap Kamera Foto 1..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            {/* 2. Foto 2 */}
            <div className="form-group" style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0369A1', fontWeight: 700 }}>
                <Camera size={15} color="#0284C7" />
                <span>2. Foto 2</span>
              </label>
              <select
                className="form-select"
                value={assignedFoto2Id}
                onChange={(e) => setAssignedFoto2Id(e.target.value)}
              >
                <option value="">-- Tanpa Foto 2 --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kelas} • {m.divisi || m.peranUtama})
                  </option>
                ))}
                <option value="MANUAL">+ Tulis Nama Manual...</option>
              </select>
              {assignedFoto2Id === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualFoto2Name}
                    onChange={(e) => setManualFoto2Name(e.target.value)}
                    placeholder="Nama lengkap Foto 2..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            {/* 3. Video */}
            <div className="form-group" style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B45309', fontWeight: 700 }}>
                <Video size={15} color="#D97706" />
                <span>3. Video</span>
              </label>
              <select
                className="form-select"
                value={assignedVideoId}
                onChange={(e) => setAssignedVideoId(e.target.value)}
              >
                <option value="">-- Tanpa Petugas Video --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kelas} • {m.divisi || m.peranUtama})
                  </option>
                ))}
                <option value="MANUAL">+ Tulis Nama Manual...</option>
              </select>
              {assignedVideoId === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualVideoName}
                    onChange={(e) => setManualVideoName(e.target.value)}
                    placeholder="Nama lengkap petugas Video..."
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            {/* 4. Live Report (HP) */}
            <div className="form-group" style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 700 }}>
                <Smartphone size={15} color="#059669" />
                <span>4. Live Report (HP)</span>
              </label>
              <select
                className="form-select"
                value={assignedLiveReportId}
                onChange={(e) => setAssignedLiveReportId(e.target.value)}
              >
                <option value="">-- Tanpa Live Report (HP) --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kelas} • {m.divisi || m.peranUtama})
                  </option>
                ))}
                <option value="MANUAL">+ Tulis Nama Manual...</option>
              </select>
              {assignedLiveReportId === 'MANUAL' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={manualLiveReportName}
                    onChange={(e) => setManualLiveReportName(e.target.value)}
                    placeholder="Nama lengkap Live Report (HP)..."
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

      {/* MODAL EDIT AGENDA LIPUTAN SEKOLAH */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          size="large"
          title="Edit Agenda Liputan Sekolah & Alokasi Alat"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Batal
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleEditSubmit}
                id="btn-update-event"
              >
                <CheckCircle size={16} />
                <span>Simpan Perubahan Agenda</span>
              </button>
            </>
          }
        >
          <form onSubmit={handleEditSubmit}>
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>Status Agenda Saat Ini:</strong>
                <p style={{ fontSize: '0.775rem', color: '#64748B', margin: 0 }}>
                  Perubahan status ke 'Selesai' atau 'Dibatalkan' otomatis membuka kembali kuota alat yang terkunci.
                </p>
              </div>
              <select
                className="form-select"
                style={{ width: 'auto', fontWeight: 700 }}
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="Akan Datang">Akan Datang</option>
                <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nama Acara / Agenda Liputan Sekolah *</label>
              <input
                type="text"
                className="form-input"
                value={editJudul}
                onChange={(e) => setEditJudul(e.target.value)}
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
                  value={editTanggal}
                  onChange={(e) => setEditTanggal(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Jam Mulai (WIB) *</label>
                <input
                  type="time"
                  className="form-input"
                  value={editWaktuMulai}
                  onChange={(e) => setEditWaktuMulai(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Jam Selesai (WIB) *</label>
                <input
                  type="time"
                  className="form-input"
                  value={editWaktuSelesai}
                  onChange={(e) => setEditWaktuSelesai(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lokasi Kegiatan di Sekolah *</label>
              <input
                type="text"
                className="form-input"
                value={editLokasi}
                onChange={(e) => setEditLokasi(e.target.value)}
                placeholder="Contoh: Plaza Upacara Utama, Lapangan Basket Indoor"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi & Arahan Liputan</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={editDeskripsi}
                onChange={(e) => setEditDeskripsi(e.target.value)}
                placeholder="Instruksi shot list, angle video, wawancara, atau dress code personil..."
              ></textarea>
            </div>

            {/* Penetapan Personil Dokumentasi */}
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
                  Petugas Dokumentasi di Lapangan (4 Posisi)
                </div>
                <p style={{ fontSize: '0.775rem', color: '#15803D', margin: '2px 0 0' }}>
                  Sesuaikan personil untuk Kamera Foto 1, Foto 2, Video, dan Live Report (HP).
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* 1. Kamera Foto 1 */}
              <div className="form-group" style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1E3A8A', fontWeight: 700 }}>
                  <Camera size={15} color="#2563EB" />
                  <span>1. Kamera Foto 1</span>
                </label>
                <select
                  className="form-select"
                  value={editAssignedFoto1Id}
                  onChange={(e) => setEditAssignedFoto1Id(e.target.value)}
                >
                  <option value="">-- Tanpa Kamera Foto 1 --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.kelas} • {m.divisi || m.peranUtama})
                    </option>
                  ))}
                  <option value="MANUAL">+ Tulis Nama Manual...</option>
                </select>
                {editAssignedFoto1Id === 'MANUAL' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editManualFoto1Name}
                      onChange={(e) => setEditManualFoto1Name(e.target.value)}
                      placeholder="Nama lengkap Kamera Foto 1..."
                    />
                  </div>
                )}
              </div>

              {/* 2. Foto 2 */}
              <div className="form-group" style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0369A1', fontWeight: 700 }}>
                  <Camera size={15} color="#0284C7" />
                  <span>2. Foto 2</span>
                </label>
                <select
                  className="form-select"
                  value={editAssignedFoto2Id}
                  onChange={(e) => setEditAssignedFoto2Id(e.target.value)}
                >
                  <option value="">-- Tanpa Foto 2 --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.kelas} • {m.divisi || m.peranUtama})
                    </option>
                  ))}
                  <option value="MANUAL">+ Tulis Nama Manual...</option>
                </select>
                {editAssignedFoto2Id === 'MANUAL' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editManualFoto2Name}
                      onChange={(e) => setEditManualFoto2Name(e.target.value)}
                      placeholder="Nama lengkap Foto 2..."
                    />
                  </div>
                )}
              </div>

              {/* 3. Video */}
              <div className="form-group" style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B45309', fontWeight: 700 }}>
                  <Video size={15} color="#D97706" />
                  <span>3. Video</span>
                </label>
                <select
                  className="form-select"
                  value={editAssignedVideoId}
                  onChange={(e) => setEditAssignedVideoId(e.target.value)}
                >
                  <option value="">-- Tanpa Petugas Video --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.kelas} • {m.divisi || m.peranUtama})
                    </option>
                  ))}
                  <option value="MANUAL">+ Tulis Nama Manual...</option>
                </select>
                {editAssignedVideoId === 'MANUAL' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editManualVideoName}
                      onChange={(e) => setEditManualVideoName(e.target.value)}
                      placeholder="Nama lengkap petugas Video..."
                    />
                  </div>
                )}
              </div>

              {/* 4. Live Report (HP) */}
              <div className="form-group" style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 700 }}>
                  <Smartphone size={15} color="#059669" />
                  <span>4. Live Report (HP)</span>
                </label>
                <select
                  className="form-select"
                  value={editAssignedLiveReportId}
                  onChange={(e) => setEditAssignedLiveReportId(e.target.value)}
                >
                  <option value="">-- Tanpa Live Report (HP) --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.kelas} • {m.divisi || m.peranUtama})
                    </option>
                  ))}
                  <option value="MANUAL">+ Tulis Nama Manual...</option>
                </select>
                {editAssignedLiveReportId === 'MANUAL' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editManualLiveReportName}
                      onChange={(e) => setEditManualLiveReportName(e.target.value)}
                      placeholder="Nama lengkap Live Report (HP)..."
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
                  Belum ada peralatan terdaftar di database.
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
                  background: '#F8FAFC'
                }}>
                  {equipment.map((item) => {
                    const isSelected = editSelectedToolIds.includes(item.id);
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
                          onChange={() => handleToggleEditTool(item.id)}
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
      )}

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

      {/* Modal Pratinjau WhatsApp Pengingat Dokumentasi Lapangan */}
      {waModalData && (
        <WhatsAppModal
          isOpen={Boolean(waModalData)}
          onClose={() => setWaModalData(null)}
          recipientName={waModalData.recipientName}
          phoneNumber={waModalData.phoneNumber}
          messageText={waModalData.messageText}
          title={waModalData.title}
        />
      )}
    </div>
  );
};

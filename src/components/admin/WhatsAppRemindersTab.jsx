import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { WhatsAppModal } from '../common/WhatsAppModal';
import { 
  MessageSquare, 
  Clock, 
  Send, 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  User, 
  Camera,
  Layers,
  Video,
  Smartphone,
  MapPin,
  Users
} from 'lucide-react';
import { checkLoanOverdue } from '../../utils/loanOverdue';

export const WhatsAppRemindersTab = () => {
  const { borrowings, creativeTasks, dutyRoster, members, events, equipment } = useStudio();

  // Modal State untuk Pratinjau WhatsApp
  const [waModalData, setWaModalData] = useState(null);

  // Filter peminjam aktif
  const activeBorrowers = borrowings.filter((b) => b.status === 'Dipinjam');

  // Trigger One-Click WA Penugasan Dokumentasi Lapangan (Liputan Event)
  const handleSendEventCoverageReminder = (event, personil) => {
    // Cari kontak WA personil di daftar members
    const foundMember = members.find(
      (m) => m.id === personil.anggotaId || m.nama?.toLowerCase().trim() === personil.nama?.toLowerCase().trim()
    );
    const phone = foundMember?.nomorWa || '6281234567890';

    // Daftar nama peralatan yang dikunci untuk event ini
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

  // Trigger WA Broadcast Tim Dokumentasi Lapangan
  const handleSendEventTeamBroadcast = (event) => {
    const lockedNames = equipment
      .filter((eq) => event.peralatanTerkunciIds?.includes(eq.id))
      .map((eq) => eq.nama)
      .join(', ');

    const personilListText = event.personil && event.personil.length > 0
      ? event.personil.map((p, idx) => `${idx + 1}. *${p.nama}* (${p.peran}) - [${p.statusTugas}]`).join('\n')
      : 'Belum ada personil yang ditugaskan';

    const firstPersonil = event.personil?.[0];
    const firstMember = members.find(
      (m) => m.id === firstPersonil?.anggotaId || m.nama?.toLowerCase().trim() === firstPersonil?.nama?.toLowerCase().trim()
    );
    const phone = firstMember?.nomorWa || '6281234567890';

    const rawMessage = `*PENGINGAT PENUGASAN TIM DOKUMENTASI LAPANGAN*
*Creative Corner Studio*

Kepada seluruh rekan tim dokumentasi pada agenda:
- *Acara*: ${event.judul}
- *Lokasi*: ${event.lokasi || 'Area Sekolah'}
- *Tanggal*: ${event.tanggal}
- *Waktu*: ${event.waktuMulai} - ${event.waktuSelesai} WIB
- *Peralatan Dialokasikan*: ${lockedNames || 'Peralatan Dokumentasi Lapangan'}

*Susunan Petugas Dokumentasi Lapangan*:
${personilListText}

Mohon seluruh personil hadir tepat waktu di Studio Creative Corner sebelum jadwal pelaksanaan untuk mengambil unit alat dan mengisi *Formulir Inspeksi Pengambilan*.

Semangat bertugas rekan-rekan!
_Tim Pengelola Studio Creative Corner_`;

    setWaModalData({
      recipientName: `Tim Liputan: ${event.judul}`,
      phoneNumber: phone,
      messageText: rawMessage,
      title: `Broadcast Tim Liputan: ${event.judul}`
    });
  };

  // Trigger One-Click WA Pengembalian Alat (Otomatis Mendeteksi Terlambat)
  const handleSendReturnReminder = (b) => {
    const overdueInfo = checkLoanOverdue(b);
    const rawMessage = overdueInfo.isOverdue
      ? `*PERINGATAN PENGEMBALIAN TERLAMBAT*: Halo Sdr. *${b.peminjamNama}* (${b.peminjamKelas}), peminjaman alat: *${b.peralatanNama}* dengan No. Resi *${b.id}* telah *MELEWATI BATAS WAKTU PENGEMBALIAN* (${b.batasWaktuKembali} WIB - *${overdueInfo.label}*). Mohon agar unit segera diserahkan ke ruang studio Creative Corner untuk verifikasi inspeksi fisik pengembalian. Terima kasih atas kerja samanya!`
      : `Halo *${b.peminjamNama}*, pengingat dari *Creative Corner*. Peminjaman alat: *${b.peralatanNama}* memiliki batas waktu pengembalian pada pukul *${b.batasWaktuKembali} WIB*. Mohon segera mengembalikan alat ke studio, memastikan kebersihan ruang/alat, mengecek kelengkapan aksesori, serta mengisi *Formulir Inspeksi Pengembalian* di sistem Creative Corner agar status tugas Anda tercatat Selesai. Terima kasih!`;

    setWaModalData({
      recipientName: b.peminjamNama,
      phoneNumber: b.peminjamWa || '6281234567890',
      messageText: rawMessage,
      title: overdueInfo.isOverdue ? `TEGURAN TERLAMBAT: ${b.peminjamNama}` : `Pengingat Pengembalian Alat: ${b.peminjamNama}`
    });
  };

  // Trigger One-Click WA Tenggat Tugas Kreatif
  const handleSendTaskReminder = (task) => {
    const rawMessage = `Halo *${task.penanggungJawabNama}*, pengingat dari *Creative Corner*. Tugas proyek kreatif Anda: *"${task.judul}"* memiliki batas *Tenggat Draf* pada *${task.tenggatDraf} WIB* dan *Tenggat Karya Akhir* pada *${task.tenggatKaryaAkhir} WIB*. Mohon memastikan progres editing/desain berjalan lancar dan perbarui status pengerjaan Anda di sistem Creative Corner. Semangat berkarya!`;

    setWaModalData({
      recipientName: task.penanggungJawabNama,
      phoneNumber: task.penanggungJawabWa || '6281234567890',
      messageText: rawMessage,
      title: `Pengingat Tenggat Tugas: ${task.penanggungJawabNama}`
    });
  };

  // Trigger One-Click WA Giliran Piket Jaga Studio
  const handleSendDutyReminder = (duty) => {
    // Ambil nomor WA anggota pertama
    const firstStaffName = duty.petugas[0]?.split('(')[0]?.trim();
    const foundMember = members.find((m) => m.nama.toLowerCase().includes(firstStaffName?.toLowerCase() || ''));
    const phone = foundMember?.nomorWa || '6281234567890';

    const rawMessage = `Halo rekan tim *Creative Corner*, pengingat giliran piket studio untuk hari *${duty.hari}, ${duty.tanggal}* pada pukul *${duty.jamOperasional} WIB*. Petugas: *${duty.petugas.join(', ')}*. Mohon hadir tepat waktu untuk menjalankan pemeliharaan inventaris studio dan pelayanan peminjaman alat. Terima kasih!`;

    setWaModalData({
      recipientName: duty.petugas.join(', '),
      phoneNumber: phone,
      messageText: rawMessage,
      title: `Pengingat Piket Jaga Studio: ${duty.hari}`
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={22} color="#10B981" />
            <span>Pengingat WhatsApp Instan (One-Click WA Reminder)</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
            Kirim notifikasi otomatis terformat resmi ke WhatsApp anggota untuk penugasan dokumentasi lapangan, pengembalian alat, tenggat draf proyek, atau giliran jaga piket studio.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-whatsapp"
          onClick={() => {
            setWaModalData({
              recipientName: 'Anggota / Siswa',
              phoneNumber: '6281234567890',
              messageText: 'Halo rekan Creative Corner,\n\nBerikut pengumuman / instruksi penting dari Pengelola Studio:\n...\n\nSalam,\nAdmin Creative Corner',
              title: 'Tulis Pesan WhatsApp Manual'
            });
          }}
        >
          <MessageSquare size={16} />
          <span>+ Tulis Pesan WhatsApp Manual</span>
        </button>
      </div>

      {/* 1. TABEL PENGINGAT PENUGASAN DOKUMENTASI LAPANGAN (LIPUTAN EVENT) */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Camera size={20} color="#1E3A8A" />
              <span>Pengingat Penugasan Dokumentasi Lapangan (Liputan Event)</span>
            </h3>
            <div className="card-subtitle">
              Format otomatis siap kirim ke 4 petugas liputan (Kamera Foto 1, Foto 2, Video, Live Report HP) untuk konfirmasi jadwal, alokasi kamera, dan instruksi inspeksi pengambilan.
            </div>
          </div>
          <span className="badge badge-primary">
            {events.length} Agenda Liputan Terdata
          </span>
        </div>

        {events.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', background: '#F8FAFC' }}>
            <Calendar size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600 }}>Belum Ada Agenda Liputan Lapangan Terjadwal</div>
            <p style={{ fontSize: '0.8rem' }}>Jadwalkan liputan baru pada menu "Penjadwalan & Live Tracker Lapangan" untuk mulai mengalokasikan personil & alat.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Agenda Liputan & Lokasi</th>
                  <th>Jadwal Pelaksanaan</th>
                  <th>Alat yang Dialokasikan</th>
                  <th>Petugas Lapangan & Status Tugas</th>
                  <th>Aksi Satu-Klik</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const lockedList = equipment.filter((eq) => ev.peralatanTerkunciIds?.includes(eq.id));
                  return (
                    <tr key={ev.id}>
                      <td style={{ maxWidth: '240px' }}>
                        <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.9rem' }}>{ev.judul}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.775rem', color: '#64748B', marginTop: '0.2rem' }}>
                          <MapPin size={12} color="#94A3B8" />
                          <span>{ev.lokasi || 'Area Sekolah'}</span>
                        </div>
                        {ev.deskripsi && (
                          <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '0.25rem' }}>{ev.deskripsi}</div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>{ev.tanggal}</div>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#1E3A8A',
                          background: '#EFF6FF',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginTop: '0.2rem'
                        }}>
                          {ev.waktuMulai} - {ev.waktuSelesai} WIB
                        </span>
                        <div style={{ marginTop: '0.35rem' }}>
                          <StatusBadge status={ev.status} />
                        </div>
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        {lockedList.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {lockedList.map((tool) => (
                              <span key={tool.id} style={{
                                fontSize: '0.75rem',
                                color: '#1E3A8A',
                                fontWeight: 600,
                                background: '#F0F9FF',
                                border: '1px solid #BAE6FD',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                display: 'inline-block'
                              }}>
                                {tool.nama}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Tanpa alokasi alat khusus</span>
                        )}
                      </td>
                      <td style={{ minWidth: '320px' }}>
                        {(!ev.personil || ev.personil.length === 0) ? (
                          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Belum ada personil ditugaskan</span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '0.5rem',
                                    background: roleMeta.bg,
                                    border: `1px solid ${roleMeta.border}`,
                                    padding: '0.35rem 0.6rem',
                                    borderRadius: '6px'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <RoleIcon size={14} color={roleMeta.text} />
                                    <div>
                                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: roleMeta.text }}>
                                        {p.nama}
                                      </span>
                                      <span style={{ fontSize: '0.72rem', color: '#64748B', marginLeft: '0.3rem' }}>
                                        ({p.peran})
                                      </span>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <StatusBadge status={p.statusTugas} />
                                    <button
                                      type="button"
                                      className="btn btn-whatsapp btn-sm"
                                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                                      onClick={() => handleSendEventCoverageReminder(ev, p)}
                                      title={`Kirim pengingat WhatsApp ke ${p.nama}`}
                                      id={`btn-wa-personil-${ev.id}-${idx}`}
                                    >
                                      <Send size={11} />
                                      <span>Kirim WA</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-whatsapp btn-sm"
                            onClick={() => handleSendEventTeamBroadcast(ev)}
                            id={`btn-wa-event-broadcast-${ev.id}`}
                            title="Kirim pesan ringkasan seluruh tim ke WhatsApp grup / koordinator"
                          >
                            <Send size={13} />
                            <span>Broadcast Tim Liputan</span>
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

      {/* 2. TABEL PENGINGAT PENGEMBALIAN ALAT (FORMAT RESMI WAJIB) */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Camera size={20} color="#1E3A8A" />
              <span>Pengingat Pengembalian Alat Aktif</span>
            </h3>
            <div className="card-subtitle">
              Format otomatis memuat batas jam pengembalian, pengecekan kebersihan, kelengkapan aksesori, dan instruksi pengisian formulir inspeksi.
            </div>
          </div>
          <span className="badge badge-amber">
            {activeBorrowers.length} Peminjaman Sedang Berjalan
          </span>
        </div>

        {activeBorrowers.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', background: '#F8FAFC' }}>
            <CheckCircle size={36} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600 }}>Semua Peralatan Telah Dikembalikan ke Studio</div>
            <p style={{ fontSize: '0.8rem' }}>Tidak ada peminjaman yang sedang aktif saat ini.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Peminjam & Kelas</th>
                  <th>Nomor WhatsApp</th>
                  <th>Peralatan yang Dipinjam</th>
                  <th>Batas Waktu Pengembalian</th>
                  <th>Keperluan</th>
                  <th>Aksi Satu-Klik</th>
                </tr>
              </thead>
              <tbody>
                {activeBorrowers.map((b) => {
                  const overdueInfo = checkLoanOverdue(b);

                  return (
                    <tr key={b.id} style={{ background: overdueInfo.isOverdue ? '#FFF5F5' : 'transparent' }}>
                      <td>
                        <strong>{b.peminjamNama}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{b.peminjamKelas}</div>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.8rem', color: '#1E3A8A' }}>+{b.peminjamWa}</code>
                      </td>
                      <td style={{ maxWidth: '260px' }}>
                        <strong style={{ color: '#0F172A' }}>{b.peralatanNama}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            color: overdueInfo.isOverdue ? '#E11D48' : '#0F172A',
                            background: overdueInfo.isOverdue ? '#FFF1F2' : '#F1F5F9',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            width: 'fit-content'
                          }}>
                            Pukul {b.batasWaktuKembali} WIB
                          </span>
                          {overdueInfo.isOverdue && (
                            <StatusBadge status="Terlambat" isOverdue={true} overdueLabel={overdueInfo.label} />
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                        {b.keperluan}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`btn ${overdueInfo.isOverdue ? 'btn-danger' : 'btn-whatsapp'} btn-sm`}
                          onClick={() => handleSendReturnReminder(b)}
                          id={`btn-wa-return-${b.id}`}
                        >
                          {overdueInfo.isOverdue ? <AlertCircle size={14} /> : <Send size={14} />}
                          <span>{overdueInfo.isOverdue ? 'Kirim Teguran Terlambat' : 'Kirim WA Pengembalian'}</span>
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

      {/* 3. TABEL PENGINGAT TENGGAT WAKTU TUGAS KREATIF */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Layers size={20} color="#1E3A8A" />
              <span>Pengingat Tenggat Tugas Kreatif (Draf & Final)</span>
            </h3>
            <div className="card-subtitle">
              Kirimkan pengingat kepada Video Editor, Desainer Grafis, atau Penulis Naskah yang mendekati tenggat waktu pengumpulan.
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Judul Proyek Konten</th>
                <th>Kategori</th>
                <th>Penanggung Jawab</th>
                <th>Tenggat Draf</th>
                <th>Tenggat Karya Akhir</th>
                <th>Status Saat Ini</th>
                <th>Aksi Satu-Klik</th>
              </tr>
            </thead>
            <tbody>
              {creativeTasks.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.judul}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#1E3A8A', fontWeight: 600 }}>{t.kategori}</span>
                  </td>
                  <td>
                    <strong>{t.penanggungJawabNama}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>+{t.penanggungJawabWa}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#D97706', fontWeight: 600 }}>
                      {t.tenggatDraf} WIB
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#E11D48', fontWeight: 700 }}>
                      {t.tenggatKaryaAkhir} WIB
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-whatsapp btn-sm"
                      onClick={() => handleSendTaskReminder(t)}
                      id={`btn-wa-task-${t.id}`}
                    >
                      <Send size={14} />
                      <span>Kirim WA Pengingat</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. TABEL PENGINGAT GILIRAN PIKET STUDIO */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Clock size={20} color="#1E3A8A" />
              <span>Pengingat Giliran Jaga Piket Studio</span>
            </h3>
            <div className="card-subtitle">
              Kirim notifikasi ke nomor WhatsApp anggota piket menjelang jam operasional jaga studio.
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Hari & Tanggal</th>
                <th>Jam Piket</th>
                <th>Anggota Bertugas</th>
                <th>Tanggung Jawab</th>
                <th>Aksi Satu-Klik</th>
              </tr>
            </thead>
            <tbody>
              {dutyRoster.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.hari}</strong> ({d.tanggal})
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', fontWeight: 600 }}>
                    {d.jamOperasional} WIB
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{d.petugas.join(' • ')}</div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                    {d.tanggungJawab}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-whatsapp btn-sm"
                      onClick={() => handleSendDutyReminder(d)}
                      id={`btn-wa-duty-${d.id}`}
                    >
                      <Send size={14} />
                      <span>Kirim WA Piket</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pratinjau WhatsApp */}
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

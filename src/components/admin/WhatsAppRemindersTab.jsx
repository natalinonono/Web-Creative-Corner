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
  Layers
} from 'lucide-react';

export const WhatsAppRemindersTab = () => {
  const { borrowings, creativeTasks, dutyRoster, members } = useStudio();

  // Modal State untuk Pratinjau WhatsApp
  const [waModalData, setWaModalData] = useState(null);

  // Filter peminjam aktif
  const activeBorrowers = borrowings.filter((b) => b.status === 'Dipinjam');

  // Trigger One-Click WA Pengembalian Alat
  const handleSendReturnReminder = (b) => {
    const rawMessage = `Halo *${b.peminjamNama}*, pengingat dari *Creative Corner*. Peminjaman alat: *${b.peralatanNama}* memiliki batas waktu pengembalian pada pukul *${b.batasWaktuKembali}*. Mohon segera mengembalikan alat ke studio, memastikan kebersihan ruang/alat, mengecek kelengkapan aksesori, serta mengisi *Formulir Inspeksi Pengembalian* di sistem Creative Corner agar status tugas Anda tercatat Selesai. Terima kasih!`;

    setWaModalData({
      recipientName: b.peminjamNama,
      phoneNumber: b.peminjamWa || '6281234567890',
      messageText: rawMessage,
      title: `Pengingat Pengembalian Alat: ${b.peminjamNama}`
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
            Kirim notifikasi otomatis terformat resmi ke WhatsApp anggota untuk pengembalian alat, tenggat draf proyek, atau giliran jaga piket studio.
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

      {/* 1. TABEL PENGINGAT PENGEMBALIAN ALAT (FORMAT RESMI WAJIB) */}
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
                {activeBorrowers.map((b) => (
                  <tr key={b.id}>
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
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#E11D48',
                        background: '#FFF1F2',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        Pukul {b.batasWaktuKembali} WIB
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {b.keperluan}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-whatsapp btn-sm"
                        onClick={() => handleSendReturnReminder(b)}
                        id={`btn-wa-return-${b.id}`}
                      >
                        <Send size={14} />
                        <span>Kirim WA Pengembalian</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. TABEL PENGINGAT TENGGAT WAKTU TUGAS KREATIF */}
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

      {/* 3. TABEL PENGINGAT GILIRAN PIKET STUDIO */}
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

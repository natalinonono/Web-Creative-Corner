import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Calendar as CalendarIcon, 
  Camera, 
  Video, 
  Clock, 
  MapPin, 
  UserCheck, 
  Filter, 
  ClipboardCheck, 
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Inbox
} from 'lucide-react';
import { PickupInspectionModal } from './PickupInspectionModal';

export const CalendarTab = () => {
  const { events, dutyRoster, equipment, activeMemberId, members } = useStudio();
  const currentMember = members.find((m) => m.id === activeMemberId) || members[0] || {
    id: 'USR',
    nama: 'Anggota Creative Corner',
    kelas: 'Siswa'
  };

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Semua');
  const [selectedEventForPickup, setSelectedEventForPickup] = useState(null);

  // Filter kategori
  const categories = ['Semua', 'Event Sekolah', 'Kamera', 'Lensa', 'Aksesori', 'Ruang Studio', 'Piket Studio'];

  // Penugasan dokumentasi pribadi siswa aktif
  const myPersonalAssignments = [];
  events.forEach((ev) => {
    const assigned = ev.personil.find((p) => p.anggotaId === activeMemberId || p.nama === currentMember.nama);
    if (assigned) {
      myPersonalAssignments.push({
        event: ev,
        personnel: assigned
      });
    }
  });

  const filteredEq = equipment.filter((eq) => activeCategoryFilter === 'Semua' || eq.kategori === activeCategoryFilter);

  return (
    <div>
      {/* 1. SEKSI JADWAL DOKUMENTASI PRIBADI SISWA */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={22} color="#1E3A8A" />
              <span>Jadwal Dokumentasi Pribadi ({currentMember.nama})</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Daftar penugasan liputan event resmi sekolah yang dimandatkan kepada Anda.
            </p>
          </div>
        </div>

        {myPersonalAssignments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: '#F8FAFC' }}>
            <CalendarDays size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 600, color: '#334155' }}>Tidak Ada Penugasan Aktif Saat Ini</div>
            <p style={{ fontSize: '0.825rem', color: '#64748B' }}>
              Anda belum ditugaskan pada agenda liputan sekolah mendatang.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {myPersonalAssignments.map(({ event, personnel }) => {
              const lockedTools = equipment.filter((eq) => event.peralatanTerkunciIds?.includes(eq.id));

              return (
                <div key={event.id} className="card" style={{ borderLeft: '4px solid #1E3A8A', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#EFF6FF',
                      color: '#1E3A8A',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {personnel.peran === 'Videografer' ? <Video size={14} /> : <Camera size={14} />}
                      Peran: {personnel.peran}
                    </div>
                    <StatusBadge status={personnel.statusTugas} />
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                    {event.judul}
                  </h3>

                  <div style={{ fontSize: '0.825rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CalendarIcon size={14} color="#64748B" />
                      <span>{event.tanggal}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="#64748B" />
                      <span>{event.waktuMulai} - {event.waktuSelesai} WIB</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} color="#64748B" />
                      <span>{event.lokasi}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: '#1E3A8A',
                      marginTop: '0.25rem'
                    }}>
                      <ShieldCheck size={14} color="#1E3A8A" />
                      <span>Petugas Dokumentasi Ditetapkan oleh: <strong>{event.ditugaskanOleh || 'creativecorner@gmail.com'}</strong></span>
                    </div>
                  </div>

                  {lockedTools.length > 0 && (
                    <div style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.65rem',
                      marginBottom: '1rem',
                      fontSize: '0.785rem'
                    }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                        Peralatan yang Disediakan & Terkunci Otomatis:
                      </div>
                      <ul style={{ paddingLeft: '1.2rem', color: '#334155', margin: 0 }}>
                        {lockedTools.map((t) => (
                          <li key={t.id}>{t.nama} ({t.lokasiRak})</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
                    {personnel.statusTugas === 'Belum Mengambil Alat' ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelectedEventForPickup(event)}
                        id={`btn-pickup-event-${event.id}`}
                      >
                        <ClipboardCheck size={15} />
                        <span>Isi Formulir Inspeksi Pengambilan</span>
                      </button>
                    ) : personnel.statusTugas === 'Sedang Melaksanakan Tugas' ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.825rem',
                        color: '#D97706',
                        fontWeight: 600
                      }}>
                        <Clock size={16} />
                        <span>Sedang Berjalan di Lapangan</span>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.825rem',
                        color: '#059669',
                        fontWeight: 700
                      }}>
                        <ShieldCheck size={16} />
                        <span>Tugas Liputan Tuntas</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. KALENDER TERPADU & KETERSEDIAAN ASET (TRANSPARAN) */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <CalendarDays size={20} color="#1E3A8A" />
              <span>Kalender Terpadu Ketersediaan & Kegiatan Creative Corner</span>
            </h3>
            <div className="card-subtitle">
              Peta ketersediaan real-time seluruh kamera, lensa, ruang studio, dan jadwal agenda sekolah.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${activeCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveCategoryFilter(cat)}
                style={{ fontSize: '0.775rem', padding: '0.3rem 0.75rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Agenda Sekolah */}
        {(activeCategoryFilter === 'Semua' || activeCategoryFilter === 'Event Sekolah') && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E3A8A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Camera size={16} /> Agenda Liputan Resmi Sekolah
            </h4>

            {events.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px', color: '#64748B', fontSize: '0.825rem' }}>
                Belum ada agenda liputan sekolah yang dijadwalkan oleh Administrator.
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Agenda Kegiatan</th>
                      <th>Tanggal & Waktu</th>
                      <th>Lokasi</th>
                      <th>Personil Ditugaskan</th>
                      <th>Alat Terkunci</th>
                      <th>Status Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          <strong>{ev.judul}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{ev.deskripsi}</div>
                        </td>
                        <td>
                          <div>{ev.tanggal}</div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{ev.waktuMulai} - {ev.waktuSelesai} WIB</span>
                        </td>
                        <td>{ev.lokasi}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {ev.personil.map((p, idx) => (
                              <span key={idx} style={{ fontSize: '0.8rem' }}>
                                <strong>{p.nama}</strong> ({p.peran}) - <StatusBadge status={p.statusTugas} />
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: '#1E3A8A', fontWeight: 600 }}>
                            {ev.peralatanTerkunciIds.length} Unit Terkunci
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={ev.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tabel Ketersediaan Unit */}
        {(activeCategoryFilter === 'Semua' || activeCategoryFilter === 'Kamera' || activeCategoryFilter === 'Lensa' || activeCategoryFilter === 'Aksesori' || activeCategoryFilter === 'Ruang Studio') && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E3A8A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} /> Status Ketersediaan Unit Studio
            </h4>

            {filteredEq.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px', color: '#64748B', fontSize: '0.825rem' }}>
                Belum ada peralatan atau ruang terdaftar pada kategori ini.
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Kode & Nama Aset</th>
                      <th>Kategori</th>
                      <th>Spesifikasi Ringkas</th>
                      <th>Lokasi Rak / Studio</th>
                      <th>Baterai / Kondisi</th>
                      <th>Status Kuota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEq.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.nama}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>{item.kode}</div>
                        </td>
                        <td>{item.kategori}</td>
                        <td style={{ maxWidth: '280px', fontSize: '0.8rem', color: '#334155' }}>
                          {item.spesifikasi}
                        </td>
                        <td>{item.lokasiRak}</td>
                        <td>
                          {item.baterai !== null && item.kategori !== 'Kamera' && item.kategori !== 'Lensa' && item.kategori !== 'Ruang Studio' ? (
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: item.baterai <= 20 ? '#E11D48' : '#059669' }}>
                              ⚡ {item.baterai}%
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              {item.kategori === 'Kamera' ? 'Body Only' : item.kategori === 'Lensa' ? 'Manual/Optik' : item.kategori === 'Ruang Studio' ? 'Fasilitas Ruang' : 'AC Power / Manual'}
                            </span>
                          )}
                        </td>
                        <td>
                          <StatusBadge status={item.status} />
                          {item.status === 'Terkunci Event' && (
                            <div style={{ fontSize: '0.7rem', color: '#E11D48', marginTop: '2px' }}>
                              Terkunci Liputan Sekolah
                            </div>
                          )}
                          {item.status === 'Dipinjam' && item.peminjamAktif && (
                            <div style={{ fontSize: '0.7rem', color: '#D97706', marginTop: '2px' }}>
                              Dipakai: {item.peminjamAktif}
                            </div>
                          )}
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

      {/* 3. JADWAL PIKET STUDIO */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Clock size={20} color="#1E3A8A" />
              <span>Jadwal Piket Jaga Studio Creative Corner</span>
            </h3>
            <div className="card-subtitle">
              Giliran piket operasional rutin kebersihan dan inventarisasi peralatan studio.
            </div>
          </div>
        </div>

        {dutyRoster.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px', color: '#64748B', fontSize: '0.825rem' }}>
            Belum ada jadwal piket jaga studio terdaftar.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Hari & Tanggal</th>
                  <th>Jam Jaga</th>
                  <th>Petugas yang Bertugas</th>
                  <th>Tanggung Jawab Operasional</th>
                  <th>Status Roster</th>
                </tr>
              </thead>
              <tbody>
                {dutyRoster.map((duty) => (
                  <tr key={duty.id}>
                    <td>
                      <strong>{duty.hari}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{duty.tanggal}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{duty.jamOperasional} WIB</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {duty.petugas.map((p, idx) => (
                          <span key={idx} style={{ fontSize: '0.825rem', color: '#0F172A', fontWeight: 600 }}>
                            • {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: '#334155' }}>
                      {duty.tanggungJawab}
                    </td>
                    <td>
                      <StatusBadge status={duty.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Cek Fisik Pengambilan jika dibuka dari jadwal pribadi */}
      {selectedEventForPickup && (
        <PickupInspectionModal
          isOpen={Boolean(selectedEventForPickup)}
          onClose={() => setSelectedEventForPickup(null)}
          targetEvent={selectedEventForPickup}
          prefilledEquipmentIds={selectedEventForPickup.peralatanTerkunciIds}
        />
      )}
    </div>
  );
};

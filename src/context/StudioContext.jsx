import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ADMIN_KEYWORD,
  ADMIN_EMAIL_SUFFIX,
  STUDENT_EMAIL_SUFFIX,
  DEFAULT_ADMIN_USER,
  SEED_MEMBERS,
  SEED_EQUIPMENT,
  SEED_EVENTS,
  SEED_BORROWINGS,
  SEED_CREATIVE_TASKS,
  SEED_DUTY_ROSTER,
  SEED_PC_CLIENTS,
  SEED_PC_LOGS,
  SEED_OFFICIAL_DOCUMENTS
} from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const StudioContext = createContext();

// Storage keys (Hanya untuk sesi login akun pengguna aktif, database data 100% di Supabase Cloud)
const STORAGE_KEYS = {
  CURRENT_USER: 'cc_current_user_v4',
  CURRENT_ROLE: 'cc_current_role_v4'
};

export const StudioProvider = ({ children }) => {
  // Hanya email resmi Administrator atau akun yang telah terdaftar dengan role/divisi Admin
  const isAdminEmail = (email) => {
    if (!email) return false;
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'admin1.creativecorner@gmail.com' || cleanEmail === 'creativecorner@gmail.com') {
      return true;
    }
    const foundMember = members.find((m) => m.email?.toLowerCase().trim() === cleanEmail);
    return Boolean(foundMember && (foundMember.role === 'admin' || foundMember.divisi === 'Admin' || foundMember.peranUtama === 'Admin'));
  };

  // Akun Pengguna Aktif yang Sedang Masuk (Sesi login akun)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed?.email === 'admin.studio@creativecorner.com' || parsed?.email === 'admin@creativecorner.com') {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Tampilan Antarmuka Aktif ('public' | 'member' | 'kiosk' | 'admin')
  const [currentRole, setCurrentRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode') || params.get('role');
      if (modeParam === 'kiosk' || params.get('kiosk') || params.get('pc')) return 'kiosk';
      if (modeParam === 'admin') return 'admin';
      if (modeParam === 'member') return 'member';
      if (modeParam === 'public') return 'public';
    }
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    if (!saved || saved === 'admin') return 'public';
    return saved;
  });

  // Tab aktif pada portal publik ('form' | 'katalog' | 'status')
  const [publicTab, setPublicTab] = useState('form');

  // DATABASE STATE (100% In-Memory dihidrasi dari Supabase Cloud, TANPA LocalStorage)
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [equipment, setEquipment] = useState(SEED_EQUIPMENT);
  const [events, setEvents] = useState(SEED_EVENTS);
  const [borrowings, setBorrowings] = useState(SEED_BORROWINGS);
  const [creativeTasks, setCreativeTasks] = useState(SEED_CREATIVE_TASKS);
  const [dutyRoster, setDutyRoster] = useState(SEED_DUTY_ROSTER);
  const [pcClients, setPcClients] = useState(SEED_PC_CLIENTS);
  const [pcLogs, setPcLogs] = useState(SEED_PC_LOGS);
  const [documents, setDocuments] = useState(SEED_OFFICIAL_DOCUMENTS);

  // Active Member ID untuk Portal Anggota
  const [activeMemberId, setActiveMemberId] = useState(() => {
    return currentUser?.id || 'ADM-01';
  });

  // Status Sinkronisasi Supabase Database
  const [supabaseStatus, setSupabaseStatus] = useState(
    isSupabaseConfigured ? 'connecting' : 'not_configured'
  );

  // Fungsi Pengambilan Data Lengkap dari Supabase Cloud
  const fetchSupabaseData = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setSupabaseStatus('not_configured');
      return;
    }

    try {
      setSupabaseStatus('connecting');

      // 1. Data Inventaris Peralatan & Ruang
      const { data: eq, error: eqErr } = await supabase.from('equipment').select('*');
      if (!eqErr && Array.isArray(eq)) {
        const mappedEq = eq.map((item) => ({
          id: item.id,
          nama: item.nama,
          kategori: item.kategori,
          nomorSeri: item.nomor_seri || '',
          lokasiRak: item.lokasi_rak || 'Ruang Studio Creative Corner',
          spesifikasi: item.spesifikasi || '',
          status: item.status || 'Tersedia',
          kondisiFisik: item.kondisi_fisik || 'Baik & Terawat',
          baterai: (item.kategori === 'Ruang Studio' || item.kategori === 'Lensa' || item.kategori === 'Kamera')
            ? null
            : (item.baterai !== undefined && item.baterai !== null ? item.baterai : item.baterai_persen),
          terkunciOlehEventId: null
        }));
        setEquipment(mappedEq);
      }

      // 2. Data Anggota Creative Corner
      const { data: mems, error: memErr } = await supabase.from('members').select('*');
      if (!memErr && Array.isArray(mems)) {
        const formattedMems = mems.map((m) => ({
          id: m.id,
          nama: m.nama,
          kelas: m.kelas || 'Angkatan 25',
          angkatan: m.angkatan || m.kelas || 'Angkatan 25',
          divisi: m.divisi || m.peran_utama || 'Public Relation',
          peranUtama: m.peran_utama || m.divisi || 'Public Relation',
          email: m.email || '',
          nomorWa: m.whatsapp || m.nomorWa || '6281200000000',
          avatar: m.avatar || (m.nama ? m.nama.slice(0, 2).toUpperCase() : 'CC'),
          role: (m.divisi === 'Admin' || m.peran_utama === 'Admin' || isAdminEmail(m.email)) ? 'admin' : 'member',
          status: m.status || 'Tersedia'
        }));
        if (!formattedMems.some((m) => m.email?.toLowerCase().trim() === DEFAULT_ADMIN_USER.email.toLowerCase().trim())) {
          formattedMems.unshift(DEFAULT_ADMIN_USER);
        }
        setMembers(formattedMems);
      }

      // 3. Agenda Liputan & Event Sekolah
      const { data: evts, error: evErr } = await supabase.from('events').select('*');
      if (!evErr && Array.isArray(evts)) {
        const mappedEvts = evts.map((e) => ({
          id: e.id,
          judul: e.judul,
          lokasi: e.lokasi,
          tanggal: e.tanggal,
          waktuMulai: e.waktu_mulai,
          waktuSelesai: e.waktu_selesai,
          deskripsi: e.deskripsi,
          status: e.status || 'Akan Datang',
          peralatanTerkunciIds: e.peralatan_terkunci_ids || [],
          personil: e.penugasan || []
        }));
        setEvents(mappedEvts);
      }

      // 4. Rekaman Peminjaman Alat (Loan Records)
      const { data: loans, error: loanErr } = await supabase.from('loan_records').select('*').order('tanggal_pengajuan', { ascending: false });
      if (!loanErr && Array.isArray(loans)) {
        const mappedLoans = loans.map((l) => ({
          id: l.id,
          isGuest: l.tipe === 'Publik',
          peminjamNama: l.peminjam,
          peminjamKelas: l.kelas_instansi,
          peminjamWa: l.kontak,
          keperluan: l.keperluan,
          tanggalPinjam: l.tanggal_pinjam,
          batasWaktuKembali: l.target_kembali,
          status: l.status,
          peralatanIds: l.peralatan_ids || [],
          peralatanNama: Array.isArray(l.peralatan_nama) ? l.peralatan_nama.join(', ') : (l.peralatan_nama || ''),
          buktiSurat: l.bukti_surat,
          inspeksiPengambilan: {
            kondisiFisik: 'Baik',
            tanggalInspeksi: l.tanggal_pinjam || ''
          },
          inspeksiPengembalian: null
        }));
        setBorrowings(mappedLoans);
      }

      // 5. Tugas Kreatif
      const { data: tasks, error: taskErr } = await supabase.from('creative_tasks').select('*').order('created_at', { ascending: false });
      if (!taskErr && Array.isArray(tasks)) {
        const mappedTasks = tasks.map((t) => ({
          id: t.id,
          judul: t.judul,
          divisi: t.divisi,
          penanggungJawabNama: t.penanggung_jawab,
          tenggatWaktu: t.batas_waktu,
          status: t.status || 'Belum Dimulai',
          deskripsi: t.deskripsi
        }));
        setCreativeTasks(mappedTasks);
      }

      // 6. Workstation PC Kiosk
      const { data: pcs, error: pcErr } = await supabase.from('pc_clients').select('*').order('id', { ascending: true });
      if (!pcErr && Array.isArray(pcs) && pcs.length > 0) {
        const mappedPCs = pcs.map((pc) => ({
          id: pc.id,
          namaUnit: pc.nama_unit,
          spesifikasi: pc.spesifikasi,
          status: pc.status,
          penggunaAktif: pc.pengguna_aktif
        }));
        setPcClients(mappedPCs);
      }

      // 7. Log Pemakaian PC
      const { data: logs, error: logErr } = await supabase.from('pc_logs').select('*').order('created_at', { ascending: false });
      if (!logErr && Array.isArray(logs)) {
        const mappedLogs = logs.map((lg) => ({
          id: lg.id,
          pcId: lg.pc_id,
          namaSiswa: lg.nama_siswa,
          kelas: lg.kelas,
          keperluan: lg.keperluan,
          durasiMenit: lg.durasi_menit,
          waktuMulai: lg.waktu_mulai,
          waktuSelesai: lg.waktu_selesai,
          statusSesi: lg.status
        }));
        setPcLogs(mappedLogs);
      }

      // 8. Roster Piket (Jika tabel ada di Supabase)
      try {
        const { data: duties, error: dutyErr } = await supabase.from('duty_roster').select('*');
        if (!dutyErr && Array.isArray(duties) && duties.length > 0) {
          setDutyRoster(duties);
        }
      } catch {}

      // 9. Dokumen Resmi (Jika tabel ada di Supabase)
      try {
        const { data: docs, error: docErr } = await supabase.from('official_documents').select('*');
        if (!docErr && Array.isArray(docs) && docs.length > 0) {
          const mappedDocs = docs.map((d) => ({
            id: d.id,
            kodeSurat: d.kode_surat,
            judul: d.judul,
            kategori: d.kategori,
            versi: d.versi,
            tanggalUpdate: d.tanggal_update,
            deskripsi: d.deskripsi,
            kontenTemplat: d.konten_templat
          }));
          setDocuments(mappedDocs);
        }
      } catch {}

      setSupabaseStatus('connected');
    } catch (err) {
      console.warn('Gagal sinkronisasi data Supabase Cloud:', err);
      setSupabaseStatus('error');
    }
  };

  // Bersihkan LocalStorage database lama & Inisialisasi Sinkronisasi Realtime Supabase
  useEffect(() => {
    // 1. Bersihkan seluruh cache database tabel lama dari localStorage browser
    try {
      const dbKeysToClean = [
        'cc_members_v4', 'cc_equipment_v4', 'cc_events_v4', 'cc_borrowings_v4',
        'cc_tasks_v4', 'cc_duty_v4', 'cc_pc_clients_v4', 'cc_pc_logs_v4', 'cc_documents_v4',
        'cc_members', 'cc_equipment', 'cc_events', 'cc_borrowings', 'cc_tasks', 'cc_duty',
        'cc_pc_clients', 'cc_pc_logs', 'cc_documents'
      ];
      dbKeysToClean.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Clean localStorage keys error:', e);
    }

    if (!isSupabaseConfigured || !supabase) {
      setSupabaseStatus('not_configured');
      return;
    }

    // 2. Muat data terbaru langsung dari Supabase
    fetchSupabaseData();

    // 3. Pasang Realtime Subscription (Perubahan di Supabase langsung update web tanpa refresh)
    const channel = supabase
      .channel('cc-cloud-realtime')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchSupabaseData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -------------------------------------------------------------
  // FUNGSI SINKRONISASI LATAR KE SUPABASE CLOUD (POSTGRESQL)
  // -------------------------------------------------------------
  const syncLoanToSupabase = (loan) => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from('loan_records').upsert([{
      id: loan.id,
      tipe: loan.isGuest ? 'Publik' : 'Anggota',
      peminjam: loan.peminjamNama,
      kelas_instansi: loan.peminjamKelas,
      kontak: loan.peminjamWa,
      keperluan: loan.keperluan,
      tanggal_pinjam: loan.tanggalPinjam,
      target_kembali: loan.batasWaktuKembali,
      status: loan.status,
      peralatan_ids: loan.peralatanIds,
      peralatan_nama: [loan.peralatanNama],
      bukti_surat: loan.buktiSurat
    }]).then(() => {}).catch((err) => console.warn('Supabase loan sync error:', err));
  };

  const syncEquipmentToSupabase = (item) => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from('equipment').upsert([{
      id: item.id,
      nama: item.nama,
      kategori: item.kategori,
      nomor_seri: item.nomorSeri || null,
      lokasi_rak: item.lokasiRak || null,
      spesifikasi: item.spesifikasi || null,
      status: item.status,
      kondisi_fisik: item.kondisiFisik || 'Baik & Terawat',
      baterai_persen: (item.kategori === 'Ruang Studio' || item.kategori === 'Lensa' || item.kategori === 'Kamera')
        ? null
        : (item.baterai !== undefined && item.baterai !== null ? item.baterai : null)
    }]).then(() => {}).catch((err) => console.warn('Supabase equipment sync error:', err));
  };

  const syncEventToSupabase = (evt) => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from('events').upsert([{
      id: evt.id,
      judul: evt.judul,
      lokasi: evt.lokasi,
      tanggal: evt.tanggal,
      waktu_mulai: evt.waktuMulai,
      waktu_selesai: evt.waktuSelesai,
      deskripsi: evt.deskripsi,
      status: evt.status,
      peralatan_terkunci_ids: evt.peralatanTerkunciIds || [],
      penugasan: evt.personil || []
    }]).then(() => {}).catch((err) => console.warn('Supabase event sync error:', err));
  };

  const syncMemberToSupabase = (mem) => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from('members').upsert([{
      id: mem.id,
      nama: mem.nama,
      kelas: mem.kelas,
      divisi: mem.divisi || mem.peranUtama || 'Admin',
      email: mem.email,
      whatsapp: mem.nomorWa,
      avatar: mem.avatar,
      status: mem.status || 'Tersedia'
    }]).then(() => {}).catch((err) => console.warn('Supabase member sync error:', err));
  };

  const syncPCToSupabase = (pc) => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from('pc_clients').upsert([{
      id: pc.id,
      nama_unit: pc.namaUnit,
      spesifikasi: pc.spesifikasi,
      status: pc.status,
      pengguna_aktif: pc.penggunaAktif || null
    }]).then(() => {}).catch((err) => console.warn('Supabase PC sync error:', err));
  };

  const syncPCLogToSupabase = (log) => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from('pc_logs').upsert([{
      id: log.id,
      pc_id: log.pcId,
      nama_siswa: log.namaSiswa,
      kelas: log.kelas,
      keperluan: log.keperluan,
      durasi_menit: log.durasiMenit,
      waktu_mulai: log.waktuMulai,
      waktu_selesai: log.waktuSelesai,
      status: log.status
    }]).then(() => {}).catch((err) => console.warn('Supabase PC log sync error:', err));
  };

  const syncTaskToSupabase = (task) => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from('creative_tasks').upsert([{
      id: task.id,
      judul: task.judul,
      divisi: task.divisi,
      penanggung_jawab: task.penanggungJawabNama || task.penanggung_jawab || '',
      batas_waktu: task.tenggatWaktu || task.batas_waktu || '',
      status: task.status || 'Belum Dimulai',
      deskripsi: task.deskripsi || ''
    }]).then(() => {}).catch((err) => console.warn('Supabase task sync error:', err));
  };

  // Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4500);
  };

  // Simpan Sesi Login Akun Pengguna Aktif (Bukan data tabel database)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, currentRole);
  }, [currentRole]);

  // -------------------------------------------------------------
  // HITUNG MUNDUR DETIK LIVE KIOSK PC
  // -------------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setPcClients((prevClients) => {
        let hasChanges = false;
        const updated = prevClients.map((pc) => {
          if (pc.status === 'Aktif' && pc.penggunaAktif && pc.penggunaAktif.sisaDetik > 0) {
            hasChanges = true;
            return {
              ...pc,
              penggunaAktif: {
                ...pc.penggunaAktif,
                sisaDetik: pc.penggunaAktif.sisaDetik - 1
              }
            };
          }
          return pc;
        });
        return hasChanges ? updated : prevClients;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // FUNGSI GANTI / LOGIN PENGGUNA DENGAN ATURAN EMAIL
  // -------------------------------------------------------------
  const switchOrLoginUser = ({ email, nama, kelas, nomorWa, divisi, peranUtama, angkatan }) => {
    const cleanEmail = email.toLowerCase().trim();
    const isTargetAdmin = isAdminEmail(cleanEmail);
    const existing = members.find((m) => m.email?.toLowerCase().trim() === cleanEmail);

    const userDivisi = isTargetAdmin ? 'Admin' : (divisi || peranUtama || 'Public Relation');

    let targetUser;
    if (existing) {
      targetUser = existing;
    } else {
      targetUser = {
        id: isTargetAdmin ? `ADM-${Date.now().toString().slice(-4)}` : `MEM-${Date.now().toString().slice(-4)}`,
        nama: nama || (isTargetAdmin ? 'Admin Studio' : 'Anggota Studio'),
        email: cleanEmail,
        kelas: kelas || (isTargetAdmin ? 'Pengelola Studio' : 'Anggota Tim Studio'),
        angkatan: angkatan ? (angkatan.includes('Angkatan') ? angkatan : `Angkatan ${angkatan}`) : 'Angkatan 25',
        nomorWa: nomorWa || '6281200000000',
        divisi: userDivisi,
        peranUtama: userDivisi,
        role: isTargetAdmin ? 'admin' : 'member',
        avatar: (nama || 'CC').slice(0, 2).toUpperCase()
      };
      setMembers((prev) => [targetUser, ...prev]);
      syncMemberToSupabase(targetUser);
    }

    setCurrentUser(targetUser);
    setActiveMemberId(targetUser.id);

    if (isTargetAdmin) {
      setCurrentRole('admin');
      showToast(`Login berhasil sebagai Administrator (${targetUser.email}). Akses penuh Portal Pengelola aktif.`, 'success');
    } else {
      setCurrentRole('member');
      showToast(`Login berhasil sebagai Anggota Creative Corner (${targetUser.nama}). Beralih ke Portal Anggota.`, 'success');
    }
  };

  // Pendaftaran Anggota Baru khusus Creative Corner
  const registerMember = ({ nama, email, nomorWa, angkatan, divisi }) => {
    const cleanEmail = email.toLowerCase().trim();
    const isTargetAdmin = isAdminEmail(cleanEmail);
    const existing = members.find((m) => m.email?.toLowerCase().trim() === cleanEmail);

    if (existing) {
      setCurrentUser(existing);
      setActiveMemberId(existing.id);
      setCurrentRole(existing.role === 'admin' ? 'admin' : 'member');
      showToast(`Email ${cleanEmail} sudah terdaftar atas nama ${existing.nama}. Anda langsung dialihkan ke Portal Anggota.`, 'info');
      return { success: true, member: existing, isNew: false };
    }

    const finalAngkatan = angkatan ? (angkatan.includes('Angkatan') ? angkatan : `Angkatan ${angkatan}`) : 'Angkatan 25';
    const userDivisi = isTargetAdmin ? 'Admin' : (divisi || 'Public Relation');

    const newMember = {
      id: isTargetAdmin ? `ADM-${Date.now().toString().slice(-4)}` : `MEM-${Date.now().toString().slice(-4)}`,
      nama: nama.trim() || 'Anggota Creative Corner',
      email: cleanEmail,
      kelas: finalAngkatan,
      angkatan: finalAngkatan,
      nomorWa: (nomorWa || '').replace(/[^0-9]/g, '') || '6281200000000',
      divisi: userDivisi,
      peranUtama: userDivisi,
      role: isTargetAdmin ? 'admin' : 'member',
      status: 'Tersedia',
      avatar: (nama.trim() || 'CC').slice(0, 2).toUpperCase()
    };

    setMembers((prev) => [newMember, ...prev]);
    syncMemberToSupabase(newMember);
    setCurrentUser(newMember);
    setActiveMemberId(newMember.id);
    setCurrentRole(newMember.role === 'admin' ? 'admin' : 'member');
    showToast(`Pendaftaran berhasil! Selamat bergabung di Creative Corner, ${newMember.nama}.`, 'success');
    return { success: true, member: newMember, isNew: true };
  };

  // Logout akun (Kembali ke Versi Publik / Tamu)
  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentRole('public');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'public');
    showToast('Anda telah keluar dari sesi login. Beralih ke Versi Publik (Tanpa Email).', 'info');
  };

  // Peminjaman Alat Mandiri untuk Bukan Anggota (Tanpa Login Email)
  const submitPublicLoan = ({
    peminjamNama,
    peminjamKelas,
    peminjamWa,
    peralatanIds,
    keperluan,
    batasWaktuKembali,
    catatan,
    buktiSurat
  }) => {
    if (!peralatanIds || peralatanIds.length === 0) {
      alert('Pilihlah minimal satu alat/ruang yang ingin dipinjam.');
      return null;
    }

    // 1. Ubah status peralatan jadi "Dipinjam"
    setEquipment((prev) =>
      prev.map((item) => {
        if (peralatanIds.includes(item.id)) {
          return {
            ...item,
            status: 'Dipinjam',
            peminjamAktif: `${peminjamNama} (${peminjamKelas})`
          };
        }
        return item;
      })
    );

    const namaAlatList = equipment
      .filter((e) => peralatanIds.includes(e.id))
      .map((e) => e.nama)
      .join(', ') || 'Peralatan Studio';

    const borrowingId = `PINJAM-TAMU-${Date.now().toString().slice(-4)}`;
    const newBorrowing = {
      id: borrowingId,
      eventId: null,
      anggotaId: 'GUEST',
      peminjamNama,
      peminjamKelas,
      peminjamWa,
      peralatanIds,
      peralatanNama: namaAlatList,
      tanggalPinjam: new Date().toISOString().split('T')[0],
      jamPinjam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      batasWaktuKembali: batasWaktuKembali || '16:00',
      keperluan: keperluan || 'Peminjaman Mandiri Siswa/Guru (Bukan Anggota)',
      status: 'Dipinjam',
      isGuest: true,
      catatan: catatan || 'Peminjaman langsung tanpa login email',
      buktiSurat: buktiSurat || null,
      inspeksiPengambilan: {
        kondisiFisik: 'Baik (Pemeriksaan Mandiri Tamu)',
        fungsiTombol: 'Normal',
        kebersihanLensa: 'Bersih',
        kelengkapanAksesori: 'Lengkap',
        tanggalInspeksi: new Date().toLocaleString('id-ID')
      },
      inspeksiPengembalian: null
    };

    setBorrowings((prev) => [newBorrowing, ...prev]);
    syncLoanToSupabase(newBorrowing);
    if (isSupabaseConfigured && supabase) {
      supabase.from('equipment').update({ status: 'Dipinjam' }).in('id', peralatanIds).then(() => {});
    }
    showToast(`Peminjaman alat berhasil diajukan! Tiket: ${borrowingId}. Silakan ambil di studio.`, 'success');
    return newBorrowing;
  };

  // -------------------------------------------------------------
  // 4 ALUR KERJA OTOMATIS (STATE-MACHINE TRIGGERS)
  // -------------------------------------------------------------

  // TRIGGER 1: Penguncian Kuota Otomatis saat Penjadwalan Event
  const scheduleEvent = (newEventData) => {
    const eventId = `EVT-${String(events.length + 1).padStart(2, '0')}`;
    const newEvent = {
      ...newEventData,
      id: eventId,
      ditugaskanOleh: newEventData.ditugaskanOleh || 'creativecorner@gmail.com (Administrator Studio)',
      status: 'Akan Datang'
    };

    const lockedIds = newEventData.peralatanTerkunciIds || [];
    setEquipment((prev) =>
      prev.map((item) => {
        if (lockedIds.includes(item.id)) {
          return {
            ...item,
            status: 'Terkunci Event',
            terkunciOlehEventId: eventId
          };
        }
        return item;
      })
    );

    setEvents((prev) => [newEvent, ...prev]);
    syncEventToSupabase(newEvent);
    if (lockedIds.length > 0 && isSupabaseConfigured && supabase) {
      supabase.from('equipment').update({ status: 'Terkunci Event' }).in('id', lockedIds).then(() => {});
    }
    showToast(`Agenda liputan "${newEvent.judul}" berhasil disimpan & ${lockedIds.length} unit alat otomatis terkunci event.`, 'success');
    return newEvent;
  };

  // TRIGGER 2: Pemicu Status Tugas dari Inspeksi Pengambilan (Awal)
  const submitPickupInspection = ({
    eventId,
    anggotaId,
    peminjamNama,
    peminjamKelas,
    peminjamWa,
    peralatanIds,
    keperluan,
    batasWaktuKembali,
    inspeksiData,
    buktiSurat
  }) => {
    // 1. Ubah status peralatan jadi "Dipinjam"
    setEquipment((prev) =>
      prev.map((item) => {
        if (peralatanIds.includes(item.id)) {
          return {
            ...item,
            status: 'Dipinjam',
            peminjamAktif: peminjamNama,
            baterai: inspeksiData.bateraiPersen || item.baterai
          };
        }
        return item;
      })
    );

    // Sinkronisasi status peralatan ke Supabase Cloud
    if (isSupabaseConfigured && supabase && peralatanIds.length > 0) {
      supabase.from('equipment').update({ status: 'Dipinjam' }).in('id', peralatanIds).then(() => {}).catch(() => {});
    }

    // 2. Ubah status personil jadi "Sedang Melaksanakan Tugas"
    if (eventId) {
      setEvents((prev) =>
        prev.map((ev) => {
          if (ev.id === eventId) {
            const updatedPersonil = ev.personil.map((p) => {
              if (p.anggotaId === anggotaId || p.nama === peminjamNama) {
                return { ...p, statusTugas: 'Sedang Melaksanakan Tugas' };
              }
              return p;
            });
            const updatedEv = { ...ev, personil: updatedPersonil };
            syncEventToSupabase(updatedEv);
            return updatedEv;
          }
          return ev;
        })
      );
    }

    const namaAlatList = equipment
      .filter((e) => peralatanIds.includes(e.id))
      .map((e) => e.nama)
      .join(', ') || 'Unit Peralatan Terpilih';

    // 3. Catat peminjaman aktif
    const borrowingId = `BORR-${String(borrowings.length + 1).padStart(2, '0')}`;
    const newBorrowing = {
      id: borrowingId,
      eventId: eventId || null,
      anggotaId: anggotaId || currentUser?.id,
      peminjamNama,
      peminjamKelas,
      peminjamWa,
      peralatanIds,
      peralatanNama: namaAlatList,
      tanggalPinjam: new Date().toISOString().split('T')[0],
      jamPinjam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      batasWaktuKembali: batasWaktuKembali || '17:00',
      keperluan: keperluan || 'Penugasan Liputan Studio',
      status: 'Dipinjam',
      buktiSurat: buktiSurat || null,
      inspeksiPengambilan: {
        ...inspeksiData,
        tanggalInspeksi: new Date().toLocaleString('id-ID')
      },
      inspeksiPengembalian: null
    };

    setBorrowings((prev) => [newBorrowing, ...prev]);
    syncLoanToSupabase(newBorrowing);
    showToast(`Inspeksi Pengambilan selesai! Status tugas kini "Sedang Melaksanakan Tugas" & alat berstatus "Dipinjam".`, 'success');
    return newBorrowing;
  };

  // TRIGGER 3: Integrasi Sesi Masuk PC dengan Tugas Kreatif Aktif
  const startPCSession = ({ pcId, namaSiswa, kelas, keperluan, tugasTerkaitId, durasiMenit }) => {
    const sisaDetik = durasiMenit * 60;
    const waktuMulai = new Date().toLocaleString('id-ID');

    const sessionData = {
      nama: namaSiswa,
      kelas,
      keperluan,
      tugasTerkaitId: tugasTerkaitId || null,
      durasiMenit,
      waktuMulai,
      sisaDetik
    };

    setPcClients((prev) =>
      prev.map((pc) => {
        if (pc.id === pcId) {
          return {
            ...pc,
            status: 'Aktif',
            penggunaAktif: sessionData
          };
        }
        return pc;
      })
    );

    // Sinkronkan sesi aktif ke Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      supabase.from('pc_clients').update({
        status: 'Aktif',
        pengguna_aktif: sessionData
      }).eq('id', pcId).then(() => {}).catch(() => {});
    }

    if (tugasTerkaitId) {
      setCreativeTasks((prev) =>
        prev.map((task) => {
          if (task.id === tugasTerkaitId) {
            return {
              ...task,
              status: 'Dalam Proses',
              pcTerhubungId: pcId
            };
          }
          return task;
        })
      );
      if (isSupabaseConfigured && supabase) {
        supabase.from('creative_tasks').update({ status: 'Dalam Proses' }).eq('id', tugasTerkaitId).then(() => {}).catch(() => {});
      }
    }

    showToast(`Workstation ${pcId} aktif untuk ${namaSiswa}! Tugas kreatif otomatis "Dalam Proses".`, 'success');
  };

  const extendPCSession = (pcId, additionalMinutes) => {
    setPcClients((prev) =>
      prev.map((pc) => {
        if (pc.id === pcId && pc.penggunaAktif) {
          const updatedSession = {
            ...pc.penggunaAktif,
            durasiMenit: pc.penggunaAktif.durasiMenit + additionalMinutes,
            sisaDetik: pc.penggunaAktif.sisaDetik + additionalMinutes * 60
          };
          if (isSupabaseConfigured && supabase) {
            supabase.from('pc_clients').update({ pengguna_aktif: updatedSession }).eq('id', pcId).then(() => {}).catch(() => {});
          }
          return {
            ...pc,
            penggunaAktif: updatedSession
          };
        }
        return pc;
      })
    );
    showToast(`Durasi sesi pada ${pcId} diperpanjang +${additionalMinutes} menit!`, 'success');
  };

  const simulatePCTimeout = (pcId) => {
    setPcClients((prev) =>
      prev.map((pc) => {
        if (pc.id === pcId && pc.penggunaAktif) {
          return {
            ...pc,
            penggunaAktif: {
              ...pc.penggunaAktif,
              sisaDetik: 240
            }
          };
        }
        return pc;
      })
    );
    showToast(`Simulasi waktu kritis aktif: Sisa durasi ${pcId} disetel ke 4 menit.`, 'warning');
  };

  const endPCSession = (pcId, catatan = 'Selesai Tepat Waktu') => {
    const targetPC = pcClients.find((pc) => pc.id === pcId);
    if (!targetPC || !targetPC.penggunaAktif) return;

    const sessionData = targetPC.penggunaAktif;

    const newLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      pcId,
      namaSiswa: sessionData.nama,
      kelas: sessionData.kelas,
      keperluan: sessionData.keperluan,
      durasiMenit: sessionData.durasiMenit,
      waktuMulai: sessionData.waktuMulai,
      waktuSelesai: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: catatan
    };

    setPcLogs((prev) => [newLog, ...prev]);
    syncPCLogToSupabase(newLog);

    setPcClients((prev) =>
      prev.map((pc) => {
        if (pc.id === pcId) {
          return {
            ...pc,
            status: 'Tersedia',
            penggunaAktif: null
          };
        }
        return pc;
      })
    );

    // Kembalikan status PC ke Tersedia di Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      supabase.from('pc_clients').update({
        status: 'Tersedia',
        pengguna_aktif: null
      }).eq('id', pcId).then(() => {}).catch(() => {});
    }

    if (sessionData.tugasTerkaitId) {
      setCreativeTasks((prev) =>
        prev.map((task) => {
          if (task.id === sessionData.tugasTerkaitId) {
            return {
              ...task,
              pcTerhubungId: null
            };
          }
          return task;
        })
      );
    }

    showToast(`Sesi ${pcId} selesai & PC dikunci kembali. Log tersimpan ke arsip admin.`, 'success');
  };

  // Modifikasi Spesifikasi & Data Workstation PC oleh Admin (Sinkron ke Supabase Cloud)
  const updatePCClient = (pcId, updatedData) => {
    setPcClients((prev) => {
      const updated = prev.map((pc) => (pc.id === pcId ? { ...pc, ...updatedData } : pc));
      const target = updated.find((pc) => pc.id === pcId);
      if (target) syncPCToSupabase(target);
      return updated;
    });
    showToast(`Spesifikasi workstation ${pcId} berhasil diperbarui!`, 'success');
  };

  const addPCClient = ({ id, namaUnit, spesifikasi }) => {
    const newId = id?.trim() || `PC-0${pcClients.length + 1}`;
    if (pcClients.some((p) => p.id.toLowerCase() === newId.toLowerCase())) {
      alert(`Unit ${newId} sudah terdaftar.`);
      return;
    }
    const newPC = {
      id: newId,
      namaUnit: namaUnit || `${newId} (Editing Station)`,
      spesifikasi: spesifikasi || 'Intel Core i7 / RAM 32GB / GPU RTX / Monitor Full HD',
      status: 'Tersedia',
      penggunaAktif: null
    };
    setPcClients((prev) => [...prev, newPC]);
    syncPCToSupabase(newPC);
    showToast(`Unit workstation baru ${newId} berhasil ditambahkan!`, 'success');
  };

  const deletePCClient = async (pcId) => {
    const targetPC = pcClients.find((pc) => pc.id === pcId);
    if (targetPC?.status === 'Aktif') {
      alert(`Tidak dapat menghapus ${pcId} karena sedang aktif digunakan.`);
      return;
    }
    setPcClients((prev) => prev.filter((pc) => pc.id !== pcId));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('pc_clients').delete().eq('id', pcId);
      } catch (err) {
        console.warn('Gagal menghapus PC dari Supabase:', err);
      }
    }
    showToast(`Unit workstation ${pcId} berhasil dihapus dari sistem.`, 'info');
  };

  // TRIGGER 4: Penyelesaian Tugas Otomatis dari Inspeksi Pengembalian (Akhir)
  const submitReturnInspection = ({ borrowingId, returnInspectionData }) => {
    const borrowing = borrowings.find((b) => b.id === borrowingId);
    if (!borrowing) return;

    // 1. Reset peralatan ke status "Tersedia"
    setEquipment((prev) =>
      prev.map((item) => {
        if (borrowing.peralatanIds.includes(item.id)) {
          return {
            ...item,
            status: 'Tersedia',
            peminjamAktif: null,
            terkunciOlehEventId: null,
            baterai: returnInspectionData.sisaBateraiPersen || item.baterai
          };
        }
        return item;
      })
    );

    // Sinkronkan peralatan ke Supabase Cloud
    if (isSupabaseConfigured && supabase && borrowing.peralatanIds?.length > 0) {
      supabase.from('equipment').update({ status: 'Tersedia' }).in('id', borrowing.peralatanIds).then(() => {}).catch(() => {});
    }

    const anomaliTerdeteksi = Boolean(
      returnInspectionData.catatanKendala &&
      returnInspectionData.catatanKendala.trim().length > 0 &&
      !returnInspectionData.catatanKendala.toLowerCase().includes('tidak ada')
    );

    // 2. Set status peminjaman ke "Selesai"
    const updatedBorrowing = {
      ...borrowing,
      status: 'Selesai',
      inspeksiPengembalian: {
        ...returnInspectionData,
        tanggalInspeksi: new Date().toLocaleString('id-ID'),
        anomaliTerdeteksi
      }
    };

    setBorrowings((prev) =>
      prev.map((b) => (b.id === borrowingId ? updatedBorrowing : b))
    );

    // Sinkronkan rekaman pinjaman ke Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      supabase.from('loan_records').update({ status: 'Selesai' }).eq('id', borrowingId).then(() => {}).catch(() => {});
    }

    // 3. Update status personil di jadwal event jika terkait
    setEvents((prev) =>
      prev.map((ev) => {
        const hasMember = ev.personil.some(
          (p) => p.anggotaId === borrowing.anggotaId || p.nama === borrowing.peminjamNama
        );
        if (hasMember) {
          const updatedPersonil = ev.personil.map((p) => {
            if (p.anggotaId === borrowing.anggotaId || p.nama === borrowing.peminjamNama) {
              return { ...p, statusTugas: 'Sudah Melaksanakan Tugas' };
            }
            return p;
          });
          const updatedEv = { ...ev, personil: updatedPersonil };
          syncEventToSupabase(updatedEv);
          return updatedEv;
        }
        return ev;
      })
    );

    showToast(`Inspeksi Pengembalian selesai! Alat kembali "Tersedia" & penugasan personil "Sudah Melaksanakan Tugas".`, 'success');
  };

  // -------------------------------------------------------------
  // CRUD MASTER UNTUK ADMIN MENGISI DATA BARU (FULL SUPABASE CLOUD)
  // -------------------------------------------------------------

  // CRUD Inventaris Alat & Ruang
  const addEquipment = (newItem) => {
    const id = `EQ-${String(equipment.length + 1).padStart(2, '0')}`;
    const item = { ...newItem, id, status: 'Tersedia', terkunciOlehEventId: null };
    setEquipment((prev) => [...prev, item]);
    syncEquipmentToSupabase(item);
    showToast(`Aset baru "${item.nama}" berhasil ditambahkan ke inventaris studio.`, 'success');
  };

  const updateEquipment = (id, updatedFields) => {
    setEquipment((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      const target = updated.find((item) => item.id === id);
      if (target) syncEquipmentToSupabase(target);
      return updated;
    });
    showToast(`Data aset berhasil diperbarui.`, 'success');
  };

  const deleteEquipment = async (id) => {
    const item = equipment.find((e) => e.id === id);
    setEquipment((prev) => prev.filter((e) => e.id !== id));
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('equipment').delete().eq('id', id);
      } catch (err) {
        console.warn('Gagal menghapus aset dari Supabase:', err);
      }
    }
    showToast(`Aset "${item?.nama || id}" telah dihapus.`, 'warning');
  };

  // CRUD Anggota / Siswa
  const addMember = (newMem) => {
    const isTargetAdmin = newMem.divisi === 'Admin' || newMem.role === 'admin' || (newMem.email?.toLowerCase().trim() === 'admin1.creativecorner@gmail.com');
    const id = isTargetAdmin ? `ADM-${String(members.length + 1).padStart(2, '0')}` : `MEM-${String(members.length + 1).padStart(2, '0')}`;
    const memDivisi = isTargetAdmin ? 'Admin' : (newMem.divisi || newMem.peranUtama || 'Public Relation');
    const mem = {
      ...newMem,
      id,
      divisi: memDivisi,
      peranUtama: memDivisi,
      role: isTargetAdmin ? 'admin' : 'member',
      avatar: (newMem.nama || 'MB').slice(0, 2).toUpperCase()
    };
    setMembers((prev) => [...prev, mem]);
    syncMemberToSupabase(mem);
    showToast(`Akun ${mem.nama} (${mem.email}) [Divisi: ${memDivisi}] berhasil didaftarkan.`, 'success');
  };

  const deleteMember = async (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('members').delete().eq('id', id);
      } catch (err) {
        console.warn('Gagal menghapus anggota dari Supabase:', err);
      }
    }
    showToast(`Anggota telah dihapus.`, 'warning');
  };

  // CRUD Tugas Kreatif
  const addCreativeTask = (newTask) => {
    const id = `TSK-${String(creativeTasks.length + 1).padStart(2, '0')}`;
    const task = {
      ...newTask,
      id,
      status: 'Belum Dimulai',
      pcTerhubungId: null
    };
    setCreativeTasks((prev) => [task, ...prev]);
    syncTaskToSupabase(task);
    showToast(`Tugas kreatif "${task.judul}" berhasil dibuat.`, 'success');
  };

  const updateCreativeTaskStage = (taskId, newStage) => {
    setCreativeTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStage } : task))
    );
    if (isSupabaseConfigured && supabase) {
      supabase.from('creative_tasks').update({ status: newStage }).eq('id', taskId).then(() => {}).catch(() => {});
    }
    showToast(`Tahapan tugas diubah menjadi "${newStage}".`, 'success');
  };

  const deleteCreativeTask = async (taskId) => {
    setCreativeTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('creative_tasks').delete().eq('id', taskId);
      } catch (err) {
        console.warn('Gagal menghapus tugas dari Supabase:', err);
      }
    }
    showToast(`Tugas kreatif berhasil dihapus.`, 'warning');
  };

  // CRUD Roster Piket
  const addDutyRoster = (newDuty) => {
    const id = `DUTY-${String(dutyRoster.length + 1).padStart(2, '0')}`;
    const dutyItem = { ...newDuty, id, status: 'Terjadwal' };
    setDutyRoster((prev) => [...prev, dutyItem]);
    if (isSupabaseConfigured && supabase) {
      supabase.from('duty_roster').upsert([dutyItem]).then(() => {}).catch(() => {});
    }
    showToast(`Jadwal piket baru berhasil ditambahkan.`, 'success');
  };

  const updateDutyRoster = (dutyId, updatedRoster) => {
    setDutyRoster((prev) =>
      prev.map((item) => (item.id === dutyId ? { ...item, ...updatedRoster } : item))
    );
    if (isSupabaseConfigured && supabase) {
      const target = dutyRoster.find((d) => d.id === dutyId);
      if (target) {
        supabase.from('duty_roster').upsert([{ ...target, ...updatedRoster }]).then(() => {}).catch(() => {});
      }
    }
    showToast(`Jadwal piket studio berhasil diperbarui.`, 'success');
  };

  // CRUD Templat Dokumen
  const updateDocumentTemplate = (docId, updatedDoc) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, ...updatedDoc, tanggalUpdate: new Date().toISOString().split('T')[0] } : doc
      )
    );
    showToast(`Templat dokumen resmi berhasil disimpan.`, 'success');
  };

  const addDocumentTemplate = (newDoc) => {
    const id = `DOC-${String(documents.length + 1).padStart(2, '0')}`;
    const doc = {
      ...newDoc,
      id,
      tanggalUpdate: new Date().toISOString().split('T')[0]
    };
    setDocuments((prev) => [...prev, doc]);
    showToast(`Dokumen resmi "${doc.judul}" berhasil ditambahkan.`, 'success');
  };

  // Kosongkan Seluruh Data (Zero Data Reset langsung ke Supabase Cloud)
  const clearAllData = async () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mengosongkan seluruh data studio? Semua inventaris alat, agenda liputan, catatan pinjam, tugas, dan log PC di Supabase Cloud akan dihapus bersih.')) {
      try {
        if (isSupabaseConfigured && supabase) {
          await supabase.from('equipment').delete().neq('id', 'KEEP_NONE');
          await supabase.from('events').delete().neq('id', 'KEEP_NONE');
          await supabase.from('loan_records').delete().neq('id', 'KEEP_NONE');
          await supabase.from('creative_tasks').delete().neq('id', 'KEEP_NONE');
          await supabase.from('pc_logs').delete().neq('id', 'KEEP_NONE');
          await supabase.from('members').delete().neq('email', 'admin1.creativecorner@gmail.com');
          await supabase.from('pc_clients').update({ status: 'Tersedia', pengguna_aktif: null }).neq('id', 'KEEP_NONE');
        }
      } catch (err) {
        console.warn('Gagal reset data di Supabase Cloud:', err);
      }

      // Bersihkan seluruh data localStorage
      try {
        localStorage.clear();
      } catch {}

      // Reset state memori
      setMembers([DEFAULT_ADMIN_USER]);
      setEquipment([]);
      setEvents([]);
      setBorrowings([]);
      setCreativeTasks([]);
      setDutyRoster([]);
      setPcClients(SEED_PC_CLIENTS);
      setPcLogs([]);
      setCurrentUser(DEFAULT_ADMIN_USER);
      setCurrentRole('admin');
      setActiveMemberId(DEFAULT_ADMIN_USER.id);
      showToast('Seluruh data di Supabase Cloud & memori berhasil dikosongkan. Sistem siap diisi data riil oleh Admin.', 'warning');
    }
  };

  return (
    <StudioContext.Provider
      value={{
        ADMIN_KEYWORD,
        ADMIN_EMAIL_SUFFIX,
        STUDENT_EMAIL_SUFFIX,
        isAdminEmail,
        isSupabaseConfigured,
        supabaseStatus,
        currentUser,
        currentRole,
        setCurrentRole,
        publicTab,
        setPublicTab,
        switchOrLoginUser,
        registerMember,
        logoutUser,
        submitPublicLoan,
        members,
        equipment,
        events,
        borrowings,
        creativeTasks,
        dutyRoster,
        pcClients,
        pcLogs,
        documents,
        activeMemberId,
        setActiveMemberId,
        toast,
        showToast,
        // State Machine Triggers
        scheduleEvent,
        submitPickupInspection,
        startPCSession,
        extendPCSession,
        simulatePCTimeout,
        endPCSession,
        submitReturnInspection,
        // Admin CRUD
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addMember,
        deleteMember,
        addCreativeTask,
        updateCreativeTaskStage,
        deleteCreativeTask,
        addDutyRoster,
        updateDutyRoster,
        updateDocumentTemplate,
        addDocumentTemplate,
        updatePCClient,
        addPCClient,
        deletePCClient,
        clearAllData
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio harus digunakan di dalam StudioProvider');
  }
  return context;
};

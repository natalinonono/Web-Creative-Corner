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

const StudioContext = createContext();

// Storage keys v4 (Clean, tanpa data dummy)
const STORAGE_KEYS = {
  MEMBERS: 'cc_members_v4',
  EQUIPMENT: 'cc_equipment_v4',
  EVENTS: 'cc_events_v4',
  BORROWINGS: 'cc_borrowings_v4',
  TASKS: 'cc_tasks_v4',
  DUTY: 'cc_duty_v4',
  PC_CLIENTS: 'cc_pc_clients_v4',
  PC_LOGS: 'cc_pc_logs_v4',
  DOCUMENTS: 'cc_documents_v4',
  CURRENT_USER: 'cc_current_user_v4',
  CURRENT_ROLE: 'cc_current_role_v4'
};

export const StudioProvider = ({ children }) => {
  // Fungsi penentu apakah email berhak menjadi Admin (mengandung kata 'creativecorner')
  const isAdminEmail = (email) => {
    if (!email) return false;
    return email.toLowerCase().trim().includes('creativecorner');
  };

  // Akun Pengguna Aktif yang Sedang Masuk
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_USER;
  });

  // Tampilan Antarmuka Aktif ('admin' | 'member' | 'kiosk')
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    return saved || 'admin'; // Mulai dari Portal Pengelola agar Admin langsung bisa input data
  });

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : SEED_MEMBERS;
  });

  const [equipment, setEquipment] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    return saved ? JSON.parse(saved) : SEED_EQUIPMENT;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : SEED_EVENTS;
  });

  const [borrowings, setBorrowings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BORROWINGS);
    return saved ? JSON.parse(saved) : SEED_BORROWINGS;
  });

  const [creativeTasks, setCreativeTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : SEED_CREATIVE_TASKS;
  });

  const [dutyRoster, setDutyRoster] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DUTY);
    return saved ? JSON.parse(saved) : SEED_DUTY_ROSTER;
  });

  const [pcClients, setPcClients] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PC_CLIENTS);
    return saved ? JSON.parse(saved) : SEED_PC_CLIENTS;
  });

  const [pcLogs, setPcLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PC_LOGS);
    return saved ? JSON.parse(saved) : SEED_PC_LOGS;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return saved ? JSON.parse(saved) : SEED_OFFICIAL_DOCUMENTS;
  });

  // Active Member ID untuk simulasi di Portal Anggota
  const [activeMemberId, setActiveMemberId] = useState(() => {
    return currentUser?.id || 'ADM-01';
  });

  // Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4500);
  };

  // -------------------------------------------------------------
  // SIMPAN STATE KE LOCALSTORAGE
  // -------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(borrowings));
  }, [borrowings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(creativeTasks));
  }, [creativeTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DUTY, JSON.stringify(dutyRoster));
  }, [dutyRoster]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PC_CLIENTS, JSON.stringify(pcClients));
  }, [pcClients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PC_LOGS, JSON.stringify(pcLogs));
  }, [pcLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

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
  const switchOrLoginUser = ({ email, nama, kelas, nomorWa, divisi, peranUtama }) => {
    const isTargetAdmin = isAdminEmail(email);
    const existing = members.find((m) => m.email?.toLowerCase() === email.toLowerCase());

    const userDivisi = isTargetAdmin ? 'Admin' : (divisi || peranUtama || 'Content Creator');

    let targetUser;
    if (existing) {
      targetUser = existing;
    } else {
      targetUser = {
        id: isTargetAdmin ? `ADM-${Date.now().toString().slice(-4)}` : `MEM-${Date.now().toString().slice(-4)}`,
        nama: nama || (isTargetAdmin ? 'Admin Studio' : 'Anggota Studio'),
        email,
        kelas: kelas || (isTargetAdmin ? 'Pengelola Studio' : 'Kelas Siswa'),
        nomorWa: nomorWa || '6281200000000',
        divisi: userDivisi,
        peranUtama: userDivisi,
        role: isTargetAdmin ? 'admin' : 'member',
        avatar: (nama || 'CC').slice(0, 2).toUpperCase()
      };
      setMembers((prev) => [targetUser, ...prev]);
    }

    setCurrentUser(targetUser);
    setActiveMemberId(targetUser.id);

    if (isTargetAdmin) {
      setCurrentRole('admin');
      showToast(`Login berhasil sebagai Administrator (${targetUser.email}). Akses penuh Portal Pengelola aktif.`, 'success');
    } else {
      setCurrentRole('member');
      showToast(`Login berhasil sebagai Anggota (${targetUser.nama}). Beralih ke Portal Anggota.`, 'success');
    }
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

    // 2. Ubah status personil jadi "Sedang Melaksanakan Tugas"
    if (eventId) {
      setEvents((prev) =>
        prev.map((ev) => {
          if (ev.id === eventId) {
            return {
              ...ev,
              personil: ev.personil.map((p) => {
                if (p.anggotaId === anggotaId || p.nama === peminjamNama) {
                  return { ...p, statusTugas: 'Sedang Melaksanakan Tugas' };
                }
                return p;
              })
            };
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
    showToast(`Inspeksi Pengambilan selesai! Status tugas kini "Sedang Melaksanakan Tugas" & alat berstatus "Dipinjam".`, 'success');
    return newBorrowing;
  };

  // TRIGGER 3: Integrasi Sesi Masuk PC dengan Tugas Kreatif Aktif
  const startPCSession = ({ pcId, namaSiswa, kelas, keperluan, tugasTerkaitId, durasiMenit }) => {
    const sisaDetik = durasiMenit * 60;
    const waktuMulai = new Date().toLocaleString('id-ID');

    setPcClients((prev) =>
      prev.map((pc) => {
        if (pc.id === pcId) {
          return {
            ...pc,
            status: 'Aktif',
            penggunaAktif: {
              nama: namaSiswa,
              kelas,
              keperluan,
              tugasTerkaitId: tugasTerkaitId || null,
              durasiMenit,
              waktuMulai,
              sisaDetik
            }
          };
        }
        return pc;
      })
    );

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
    }

    showToast(`Workstation ${pcId} aktif untuk ${namaSiswa}! Tugas kreatif otomatis "Dalam Proses".`, 'success');
  };

  const extendPCSession = (pcId, additionalMinutes) => {
    setPcClients((prev) =>
      prev.map((pc) => {
        if (pc.id === pcId && pc.penggunaAktif) {
          return {
            ...pc,
            penggunaAktif: {
              ...pc.penggunaAktif,
              durasiMenit: pc.penggunaAktif.durasiMenit + additionalMinutes,
              sisaDetik: pc.penggunaAktif.sisaDetik + additionalMinutes * 60
            }
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
      id: `LOG-${String(pcLogs.length + 1).padStart(2, '0')}`,
      pcId,
      namaSiswa: sessionData.nama,
      kelas: sessionData.kelas,
      keperluan: sessionData.keperluan,
      durasiMenit: sessionData.durasiMenit,
      waktuMulai: sessionData.waktuMulai,
      waktuSelesai: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      statusSesi: catatan
    };

    setPcLogs((prev) => [newLog, ...prev]);

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

  // Modifikasi Spesifikasi & Data Workstation PC oleh Admin
  const updatePCClient = (pcId, updatedData) => {
    setPcClients((prev) =>
      prev.map((pc) => {
        if (pc.id === pcId) {
          return {
            ...pc,
            ...updatedData
          };
        }
        return pc;
      })
    );
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
    showToast(`Unit workstation baru ${newId} berhasil ditambahkan!`, 'success');
  };

  const deletePCClient = (pcId) => {
    const targetPC = pcClients.find((pc) => pc.id === pcId);
    if (targetPC?.status === 'Aktif') {
      alert(`Tidak dapat menghapus ${pcId} karena sedang aktif digunakan.`);
      return;
    }
    setPcClients((prev) => prev.filter((pc) => pc.id !== pcId));
    showToast(`Unit workstation ${pcId} berhasil dihapus dari sistem.`, 'info');
  };

  // TRIGGER 4: Penyelesaian Tugas Otomatis dari Inspeksi Pengembalian (Akhir)
  const submitReturnInspection = ({ borrowingId, returnInspectionData }) => {
    const borrowing = borrowings.find((b) => b.id === borrowingId);
    if (!borrowing) return;

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

    const anomaliTerdeteksi = Boolean(
      returnInspectionData.catatanKendala &&
      returnInspectionData.catatanKendala.trim().length > 0 &&
      !returnInspectionData.catatanKendala.toLowerCase().includes('tidak ada')
    );

    setBorrowings((prev) =>
      prev.map((b) => {
        if (b.id === borrowingId) {
          return {
            ...b,
            status: 'Selesai',
            inspeksiPengembalian: {
              ...returnInspectionData,
              tanggalInspeksi: new Date().toLocaleString('id-ID'),
              anomaliTerdeteksi
            }
          };
        }
        return b;
      })
    );

    setEvents((prev) =>
      prev.map((ev) => {
        const hasMember = ev.personil.some(
          (p) => p.anggotaId === borrowing.anggotaId || p.nama === borrowing.peminjamNama
        );
        if (hasMember) {
          return {
            ...ev,
            personil: ev.personil.map((p) => {
              if (p.anggotaId === borrowing.anggotaId || p.nama === borrowing.peminjamNama) {
                return { ...p, statusTugas: 'Sudah Melaksanakan Tugas' };
              }
              return p;
            })
          };
        }
        return ev;
      })
    );

    showToast(`Inspeksi Pengembalian selesai! Alat kembali "Tersedia" & penugasan personil "Sudah Melaksanakan Tugas".`, 'success');
  };

  // -------------------------------------------------------------
  // CRUD MASTER UNTUK ADMIN MENGISI DATA BARU
  // -------------------------------------------------------------

  // CRUD Inventaris Alat & Ruang
  const addEquipment = (newItem) => {
    const id = `EQ-${String(equipment.length + 1).padStart(2, '0')}`;
    const item = { ...newItem, id, status: 'Tersedia', terkunciOlehEventId: null };
    setEquipment((prev) => [...prev, item]);
    showToast(`Aset baru "${item.nama}" berhasil ditambahkan ke inventaris studio.`, 'success');
  };

  const updateEquipment = (id, updatedFields) => {
    setEquipment((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast(`Data aset berhasil diperbarui.`, 'success');
  };

  const deleteEquipment = (id) => {
    const item = equipment.find((e) => e.id === id);
    setEquipment((prev) => prev.filter((e) => e.id !== id));
    showToast(`Aset "${item?.nama || id}" telah dihapus.`, 'warning');
  };

  // CRUD Anggota / Siswa
  const addMember = (newMem) => {
    const isTargetAdmin = isAdminEmail(newMem.email);
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
    showToast(`Akun ${mem.nama} (${mem.email}) [Divisi: ${memDivisi}] berhasil didaftarkan.`, 'success');
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
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
    showToast(`Tugas kreatif "${task.judul}" berhasil dibuat.`, 'success');
  };

  const updateCreativeTaskStage = (taskId, newStage) => {
    setCreativeTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStage } : task))
    );
    showToast(`Tahapan tugas diubah menjadi "${newStage}".`, 'success');
  };

  // CRUD Roster Piket
  const addDutyRoster = (newDuty) => {
    const id = `DUTY-${String(dutyRoster.length + 1).padStart(2, '0')}`;
    setDutyRoster((prev) => [...prev, { ...newDuty, id, status: 'Terjadwal' }]);
    showToast(`Jadwal piket baru berhasil ditambahkan.`, 'success');
  };

  const updateDutyRoster = (dutyId, updatedRoster) => {
    setDutyRoster((prev) =>
      prev.map((item) => (item.id === dutyId ? { ...item, ...updatedRoster } : item))
    );
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

  // Kosongkan Seluruh Data (Zero Data Reset)
  const clearAllData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh data? Semua alat, jadwal liputan, peminjaman, dan tugas kreatif akan dikosongkan untuk diisi manual oleh Admin.')) {
      localStorage.clear();
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
      showToast('Seluruh data berhasil dikosongkan. Sistem siap diisi data riil oleh Admin.', 'warning');
    }
  };

  return (
    <StudioContext.Provider
      value={{
        ADMIN_KEYWORD,
        ADMIN_EMAIL_SUFFIX,
        STUDENT_EMAIL_SUFFIX,
        isAdminEmail,
        currentUser,
        currentRole,
        setCurrentRole,
        switchOrLoginUser,
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

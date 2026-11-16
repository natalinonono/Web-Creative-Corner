// ====================================================================
// KONFIGURASI OTENTIKASI & DATA AWAL SISTEM CREATIVE CORNER
// - Akun Pengelola / Admin: Akun resmi terdaftar (admin1.creativecorner@gmail.com)
// - Akun Anggota Creative Corner: Akun email siswa / anggota terdaftar
// - Bukan Anggota: Peminjaman mandiri & PC Kiosk tanpa perlu email
// ====================================================================

export const ADMIN_KEYWORD = '';
export const ADMIN_EMAIL_SUFFIX = '';
export const STUDENT_EMAIL_SUFFIX = '';

export const isAdminEmail = (email) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return clean === 'admin1.creativecorner@gmail.com' || 
         clean === 'creativecorner@gmail.com' || 
         clean === 'admin2.creativecorner@gmail.com';
};

// Akun Admin Utama Resmi
export const DEFAULT_ADMIN_USER = {
  id: 'ADM-01',
  nama: 'Pengelola Creative Corner',
  email: 'admin1.creativecorner@gmail.com',
  password: 'admin1#creativecorner',
  acceptedPasswords: ['admin1#creativecorner', 'admin1#cc', 'creativecorner123', 'admin123'],
  kelas: 'Guru Pembina & Koordinator Studio',
  nomorWa: '6281200000000',
  divisi: 'Admin',
  peranUtama: 'Admin',
  role: 'admin',
  avatar: 'CC'
};

// Akun Administrator Kedua (Satrio)
export const ADMIN_2_USER = {
  id: 'ADM-02',
  nama: 'Satrio Ernesto Utomo (Admin 2)',
  email: 'admin2.creativecorner@gmail.com',
  password: 'admin2#creativecorner',
  acceptedPasswords: ['admin2#creativecorner', 'admin2#cc', 'satrio#cc25'],
  kelas: 'XI PPLG-B',
  nomorWa: '6281200000002',
  divisi: 'Admin',
  peranUtama: 'Admin',
  role: 'admin',
  avatar: 'AD'
};

// Data Master Anggota Resmi Creative Corner (Angkatan 25 & Angkatan 26)
export const SEED_MEMBERS = [
  DEFAULT_ADMIN_USER,
  ADMIN_2_USER,

  // ==============================================================
  // ANGKATAN 25 (KELAS XI)
  // ==============================================================
  {
    id: 'MEM-01',
    nama: 'Muhammad Akbar Ramadhani',
    kelas: 'XI PPLG-A',
    angkatan: 'Angkatan 25',
    divisi: 'Dokumentasi',
    peranUtama: 'Dokumentasi',
    email: 'akbar.cc25@gmail.com',
    password: 'akbar#cc25',
    acceptedPasswords: ['akbar#cc25', 'akbar123'],
    nomorWa: '6281200000001',
    role: 'member',
    avatar: 'AR',
    status: 'Tersedia'
  },
  {
    id: 'MEM-02',
    nama: 'Satrio Ernesto Utomo',
    kelas: 'XI PPLG-B',
    angkatan: 'Angkatan 25',
    divisi: 'Editor',
    peranUtama: 'Editor',
    email: 'satrio.cc25@gmail.com',
    altEmail: 'admin2.creativecorner@gmail.com',
    password: 'satrio#cc25',
    acceptedPasswords: ['satrio#cc25', 'admin2#creativecorner', 'admin2#cc'],
    nomorWa: '6281200000002',
    role: 'member',
    avatar: 'SE',
    status: 'Tersedia'
  },
  {
    id: 'MEM-03',
    nama: 'Stefanus Natalino Putra Pratama',
    kelas: 'XI PPLG-B',
    angkatan: 'Angkatan 25',
    divisi: 'Dokumentasi',
    peranUtama: 'Dokumentasi',
    email: 'stefanus.cc25@gmail.com',
    altEmail: 'anggota1.creativecorner@gmail.com',
    password: 'stefanus#cc25',
    acceptedPasswords: ['stefanus#cc25', 'anggota1#cc', 'natalino#cc25'],
    nomorWa: '6281228788912',
    role: 'member',
    avatar: 'SN',
    status: 'Tersedia'
  },
  {
    id: 'MEM-04',
    nama: 'Jatmiko Bayu Pamungkas',
    kelas: 'XI PPLG-B',
    angkatan: 'Angkatan 25',
    divisi: 'Editor',
    peranUtama: 'Editor',
    email: 'bayu.cc25@gmail.com',
    password: 'bayu#cc25',
    acceptedPasswords: ['bayu#cc25', 'jatmiko#cc25'],
    nomorWa: '6281200000003',
    role: 'member',
    avatar: 'JB',
    status: 'Tersedia'
  },
  {
    id: 'MEM-05',
    nama: 'Virillos Galih Priatmadja',
    kelas: 'XI PPLG-B',
    angkatan: 'Angkatan 25',
    divisi: 'Editor',
    peranUtama: 'Editor',
    email: 'virillos.cc25@gmail.com',
    password: 'virillos#cc25',
    acceptedPasswords: ['virillos#cc25', 'galih#cc25'],
    nomorWa: '6281200000004',
    role: 'member',
    avatar: 'VG',
    status: 'Tersedia'
  },
  {
    id: 'MEM-06',
    nama: 'Ubai Hafidzul Ilmi',
    kelas: 'XI PPLG-B',
    angkatan: 'Angkatan 25',
    divisi: 'Desain Grafis',
    peranUtama: 'Desain Grafis',
    email: 'ubai.cc25@gmail.com',
    password: 'ubai#cc25',
    acceptedPasswords: ['ubai#cc25', 'hafidzul#cc25'],
    nomorWa: '6281200000005',
    role: 'member',
    avatar: 'UH',
    status: 'Tersedia'
  },
  {
    id: 'MEM-07',
    nama: 'Vania Augusta Ramadhani',
    kelas: 'XI PPLG-B',
    angkatan: 'Angkatan 25',
    divisi: 'Desain Grafis',
    peranUtama: 'Desain Grafis',
    email: 'vania.cc25@gmail.com',
    password: 'vania#cc25',
    acceptedPasswords: ['vania#cc25', 'augusta#cc25'],
    nomorWa: '6281200000006',
    role: 'member',
    avatar: 'VA',
    status: 'Tersedia'
  },

  // ==============================================================
  // ANGKATAN 26 (KELAS X)
  // ==============================================================
  {
    id: 'MEM-08',
    nama: 'Muhammad Ilham Nur Hayat',
    kelas: 'X PPLG-A',
    angkatan: 'Angkatan 26',
    divisi: 'Videografer',
    peranUtama: 'Videografer',
    email: 'ilham.cc26@gmail.com',
    password: 'ilham#cc26',
    acceptedPasswords: ['ilham#cc26', 'ilham123'],
    nomorWa: '6281200000011',
    role: 'member',
    avatar: 'MI',
    status: 'Tersedia'
  },
  {
    id: 'MEM-09',
    nama: 'Gladis Elysia Salsabila',
    kelas: 'X PPLG-A',
    angkatan: 'Angkatan 26',
    divisi: 'Desain Grafis',
    peranUtama: 'Desain Grafis',
    email: 'gladis.cc26@gmail.com',
    password: 'gladis#cc26',
    acceptedPasswords: ['gladis#cc26', 'elys#cc26', 'gladis123'],
    nomorWa: '6281200000012',
    role: 'member',
    avatar: 'GE',
    status: 'Tersedia'
  },
  {
    id: 'MEM-10',
    nama: 'Arya Mustofa',
    kelas: 'X PPLG-A',
    angkatan: 'Angkatan 26',
    divisi: 'Desain Grafis',
    peranUtama: 'Desain Grafis',
    email: 'arya.cc26@gmail.com',
    password: 'arya#cc26',
    acceptedPasswords: ['arya#cc26', 'mustofa#cc26'],
    nomorWa: '6281200000013',
    role: 'member',
    avatar: 'AM',
    status: 'Tersedia'
  },
  {
    id: 'MEM-11',
    nama: 'Grindra Felix Suryawijaya',
    kelas: 'X PPLG-A',
    angkatan: 'Angkatan 26',
    divisi: 'Editor',
    peranUtama: 'Editor',
    email: 'felix.cc26@gmail.com',
    password: 'felix#cc26',
    acceptedPasswords: ['felix#cc26', 'pelik#cc26', 'grindra#cc26'],
    nomorWa: '6281200000014',
    role: 'member',
    avatar: 'GF',
    status: 'Tersedia'
  },
  {
    id: 'MEM-12',
    nama: 'Faiz Romadhon Nur Wijanarko',
    kelas: 'X PPLG-A',
    angkatan: 'Angkatan 26',
    divisi: 'Desain Grafis',
    peranUtama: 'Desain Grafis',
    email: 'faiz.cc26@gmail.com',
    password: 'faiz#cc26',
    acceptedPasswords: ['faiz#cc26', 'romadhon#cc26'],
    nomorWa: '6281200000015',
    role: 'member',
    avatar: 'FR',
    status: 'Tersedia'
  },
  {
    id: 'MEM-13',
    nama: 'Abiyyudhia Falah',
    kelas: 'X TJKT-B',
    angkatan: 'Angkatan 26',
    divisi: 'Editor',
    peranUtama: 'Editor',
    email: 'abiyyudhia.cc26@gmail.com',
    password: 'abiyyu#cc26',
    acceptedPasswords: ['abiyyu#cc26', 'biyu#cc26', 'abiyyudhia#cc26'],
    nomorWa: '6281200000016',
    role: 'member',
    avatar: 'AF',
    status: 'Tersedia'
  },
  {
    id: 'MEM-14',
    nama: 'Zidney Fata El Faza',
    kelas: 'X TJKT-B',
    angkatan: 'Angkatan 26',
    divisi: 'Editor',
    peranUtama: 'Editor',
    email: 'zidney.cc26@gmail.com',
    password: 'zidney#cc26',
    acceptedPasswords: ['zidney#cc26', 'fata#cc26'],
    nomorWa: '6281200000017',
    role: 'member',
    avatar: 'ZF',
    status: 'Tersedia'
  },
  {
    id: 'MEM-15',
    nama: 'Abrariy Kumara Arkananta',
    kelas: 'X TJKT-B',
    angkatan: 'Angkatan 26',
    divisi: 'Content Creator',
    peranUtama: 'Content Creator',
    email: 'abrariy.cc26@gmail.com',
    password: 'arka#cc26',
    acceptedPasswords: ['arka#cc26', 'abrariy#cc26'],
    nomorWa: '6281200000018',
    role: 'member',
    avatar: 'AK',
    status: 'Tersedia'
  },
  {
    id: 'MEM-16',
    nama: 'Alfiano Syahri Alfredo',
    kelas: 'X TJKT-B',
    angkatan: 'Angkatan 26',
    divisi: 'Editor',
    peranUtama: 'Editor',
    email: 'alfiano.cc26@gmail.com',
    password: 'redo#cc26',
    acceptedPasswords: ['redo#cc26', 'alfiano#cc26', 'alfredo#cc26'],
    nomorWa: '6281200000019',
    role: 'member',
    avatar: 'AS',
    status: 'Tersedia'
  },
  {
    id: 'MEM-17',
    nama: 'Alif Castar Kenta Wicaksono',
    kelas: 'X TJKT-B',
    angkatan: 'Angkatan 26',
    divisi: 'Videografer',
    peranUtama: 'Videografer',
    email: 'alifkenta.cc26@gmail.com',
    password: 'alifkenta#cc26',
    acceptedPasswords: ['alifkenta#cc26', 'alip#cc26', 'kenta#cc26'],
    nomorWa: '6281200000020',
    role: 'member',
    avatar: 'AC',
    status: 'Tersedia'
  },
  {
    id: 'MEM-18',
    nama: 'Dwi Aditya Wibowo',
    kelas: 'X TJKT-A',
    angkatan: 'Angkatan 26',
    divisi: 'Desain Grafis',
    peranUtama: 'Desain Grafis',
    email: 'dwi.aditya.cc26@gmail.com',
    password: 'dwi#cc26',
    acceptedPasswords: ['dwi#cc26', 'aditya#cc26'],
    nomorWa: '6281200000021',
    role: 'member',
    avatar: 'DA',
    status: 'Tersedia'
  },
  {
    id: 'MEM-19',
    nama: 'Aesar Abi Febrian',
    kelas: 'X TJKT-A',
    angkatan: 'Angkatan 26',
    divisi: 'Videografer',
    peranUtama: 'Videografer',
    email: 'aesar.cc26@gmail.com',
    password: 'aesar#cc26',
    acceptedPasswords: ['aesar#cc26', 'abi#cc26'],
    nomorWa: '6281200000022',
    role: 'member',
    avatar: 'AA',
    status: 'Tersedia'
  },
  {
    id: 'MEM-20',
    nama: 'Jonathan Surya Kristiawan',
    kelas: 'X GEO',
    angkatan: 'Angkatan 26',
    divisi: 'Content Creator',
    peranUtama: 'Content Creator',
    email: 'jonathan.cc26@gmail.com',
    password: 'jonathan#cc26',
    acceptedPasswords: ['jonathan#cc26', 'surya#cc26'],
    nomorWa: '6281200000023',
    role: 'member',
    avatar: 'JK',
    status: 'Tersedia'
  },
  {
    id: 'MEM-21',
    nama: 'Malika Anindita Kiyasatina',
    kelas: 'X GEO',
    angkatan: 'Angkatan 26',
    divisi: 'Public Relation',
    peranUtama: 'Public Relation',
    email: 'malika.cc26@gmail.com',
    password: 'kiyasa#cc26',
    acceptedPasswords: ['kiyasa#cc26', 'malika#cc26', 'anindita#cc26'],
    nomorWa: '6281200000024',
    role: 'member',
    avatar: 'MK',
    status: 'Tersedia'
  },
  {
    id: 'MEM-22',
    nama: 'Alif Arrohman',
    kelas: 'X TKL-B',
    angkatan: 'Angkatan 26',
    divisi: 'Desain Grafis',
    peranUtama: 'Desain Grafis',
    email: 'alif.arrohman.cc26@gmail.com',
    password: 'tulip#cc26',
    acceptedPasswords: ['tulip#cc26', 'alif#cc26', 'arrohman#cc26'],
    nomorWa: '6281200000025',
    role: 'member',
    avatar: 'AR',
    status: 'Tersedia'
  },

  // ==============================================================
  // AKUN WORKSTATION PC KIOSK STUDIO (4 UNIT RESMI)
  // ==============================================================
  {
    id: 'PC-ACC-01',
    nama: 'PC1-STUDIO (Editor Video #1)',
    kelas: 'Workstation Studio (Dekat Pintu)',
    angkatan: 'Studio PC',
    divisi: 'Editor Video Workstation',
    peranUtama: 'Editor Video',
    email: 'pc1.editor@gmail.com',
    password: 'pc1#editor',
    acceptedPasswords: ['pc1#editor', 'editorpc1', 'pc1editor'],
    nomorWa: '6281200000091',
    role: 'member',
    isPC: true,
    pcId: 'PC-01',
    avatar: 'P1',
    status: 'Tersedia'
  },
  {
    id: 'PC-ACC-02',
    nama: 'DEKSTOP-7TVS43B (Editor Video #2)',
    kelas: 'Workstation Studio (Backup)',
    angkatan: 'Studio PC',
    divisi: 'Editor Video Workstation',
    peranUtama: 'Editor Video',
    email: 'pc2.editor@gmail.com',
    password: 'pc2#editor',
    acceptedPasswords: ['pc2#editor', 'editorpc2', 'pc2editor'],
    nomorWa: '6281200000092',
    role: 'member',
    isPC: true,
    pcId: 'PC-02',
    avatar: 'P2',
    status: 'Tersedia'
  },
  {
    id: 'PC-ACC-03',
    nama: 'PC3-STUDIO (Desain Grafis #1 - PC Tengah A)',
    kelas: 'Workstation Studio (PC Tengah A)',
    angkatan: 'Studio PC',
    divisi: 'Desain Grafis Workstation',
    peranUtama: 'Desain Grafis',
    email: 'pc3.desain@gmail.com',
    password: 'pc3#desain',
    acceptedPasswords: ['pc3#desain', 'desainpc3', 'pc3desain'],
    nomorWa: '6281200000093',
    role: 'member',
    isPC: true,
    pcId: 'PC-03',
    avatar: 'P3',
    status: 'Tersedia'
  },
  {
    id: 'PC-ACC-04',
    nama: 'PC4-STUDIO (Desain Grafis #2 - PC Tengah B)',
    kelas: 'Workstation Studio (PC Tengah B)',
    angkatan: 'Studio PC',
    divisi: 'Desain Grafis Workstation',
    peranUtama: 'Desain Grafis',
    email: 'pc4.desain@gmail.com',
    password: 'pc4#desain',
    acceptedPasswords: ['pc4#desain', 'desainpc4', 'pc4desain'],
    nomorWa: '6281200000094',
    role: 'member',
    isPC: true,
    pcId: 'PC-04',
    avatar: 'P4',
    status: 'Tersedia'
  }
];

// Master Peralatan & Perlengkapan Resmi Studio Creative Corner (34 Unit)
export const SEED_EQUIPMENT = [
  // Kamera (3 Unit)
  {
    id: 'EQ-01',
    kode: 'EQ-01',
    nama: 'Canon EOS M6 Mk I',
    kategori: 'Kamera',
    lokasiRak: 'Box Coklat (Dalam Lemari)',
    wadah: 'Box Coklat',
    spesifikasi: 'Body Only Mirrorless. Memakai Lensa Canon EF-M (tanpa adapter). Tersimpan di Box Coklat Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-02',
    kode: 'EQ-02',
    nama: 'Canon EOS M6 Mk II',
    kategori: 'Kamera',
    lokasiRak: 'Box Coklat (Dalam Lemari)',
    wadah: 'Box Coklat',
    spesifikasi: 'Body Only Mirrorless. WAJIB PAKAI ADAPTER EOS EF-M TO EF dan Lensa Canon EF/EF-S. Tersimpan di Box Coklat Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-03',
    kode: 'EQ-03',
    nama: 'Canon EOS 1500D',
    kategori: 'Kamera',
    lokasiRak: 'Box Coklat (Dalam Lemari)',
    wadah: 'Box Coklat',
    spesifikasi: 'Body Only DSLR (WKS). Memakai Lensa Canon EF/EF-S dan Baterai LP-E10. Tersimpan di Box Coklat Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  // Lensa (4 Unit)
  {
    id: 'EQ-04',
    kode: 'EQ-04',
    nama: 'Canon Zoom Lens EF-M 18-150mm',
    kategori: 'Lensa',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Mount: Lensa EF-M (Khusus Canon EOS M6 Mk I). Dilengkapi Lens Hood. Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Optik Bersih',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-05',
    kode: 'EQ-05',
    nama: 'Canon Zoom Lens EF-S 18-55mm #1',
    kategori: 'Lensa',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Mount: Lensa EF (Cocok untuk EOS 1500D & M6 Mk II + Adapter EF-M to EF). Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Optik Bersih',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-06',
    kode: 'EQ-06',
    nama: 'Canon Zoom Lens EF-M 15-45mm',
    kategori: 'Lensa',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Mount: Lensa EF-M (Khusus Canon EOS M6 Mk I). Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Optik Bersih',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-07',
    kode: 'EQ-07',
    nama: 'Canon Zoom Lens EF-S 18-55mm #2',
    kategori: 'Lensa',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Mount: Lensa EF (Cocok untuk EOS 1500D & M6 Mk II + Adapter EF-M to EF). Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Optik Bersih',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  // Lighting (3 Unit)
  {
    id: 'EQ-08',
    kode: 'EQ-08',
    nama: 'Godox LEDP120C #1',
    kategori: 'Lighting & Tata Cahaya',
    lokasiRak: 'Lemari Studio - Rak 5',
    wadah: 'Lemari Studio',
    spesifikasi: 'Panel LED Bi-Color Godox LEDP120C (Unit 1 - Daya baterai seri NP-F). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-09',
    kode: 'EQ-09',
    nama: 'Godox LEDP120C #2',
    kategori: 'Lighting & Tata Cahaya',
    lokasiRak: 'Lemari Studio - Rak 5',
    wadah: 'Lemari Studio',
    spesifikasi: 'Panel LED Bi-Color Godox LEDP120C (Unit 2 - Daya baterai seri NP-F). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-10',
    kode: 'EQ-10',
    nama: 'Godox LEDP120C #3',
    kategori: 'Lighting & Tata Cahaya',
    lokasiRak: 'Lemari Studio - Rak 5',
    wadah: 'Lemari Studio',
    spesifikasi: 'Panel LED Bi-Color Godox LEDP120C (Unit 3 - Daya baterai seri NP-F). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  // SD Card / Memory Card (1 Unit)
  {
    id: 'EQ-11',
    kode: 'EQ-11',
    nama: 'SD Card SanDisk Extreme 64GB (170MB/s)',
    kategori: 'Memory Card',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'SDXC UHS-I 64GB Kecepatan hingga 170MB/s (V30 U3 C10 4K UHD). Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Kosong',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  // Speaker & Mic / Audio (3 Unit)
  {
    id: 'EQ-12',
    kode: 'EQ-12',
    nama: 'Speaker MAX15MH #1',
    kategori: 'Audio & Mikrofon',
    lokasiRak: 'Lemari Studio - Rak 8',
    wadah: 'Lemari Studio',
    spesifikasi: 'Speaker Aktif Studio / Event MAX15MH (Unit 1). Tersimpan di Rak 8 / Bawah Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-13',
    kode: 'EQ-13',
    nama: 'Speaker MAX15MH #2',
    kategori: 'Audio & Mikrofon',
    lokasiRak: 'Lemari Studio - Rak 8',
    wadah: 'Lemari Studio',
    spesifikasi: 'Speaker Aktif Studio / Event MAX15MH (Unit 2). Tersimpan di Rak 8 / Bawah Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-14',
    kode: 'EQ-14',
    nama: 'Mic Wireless Hollyland Lark M2',
    kategori: 'Audio & Mikrofon',
    lokasiRak: 'Lemari Studio - Rak 5 (Box Hollyland)',
    wadah: 'Lemari Studio',
    spesifikasi: 'Mikrofon Wireless Lavalier Hollyland Lark M2 + Charging Case. Tersimpan di dalam Box Hollyland Rak 5 Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  // Gimbal & Tripod / Aksesori (5 Unit)
  {
    id: 'EQ-15',
    kode: 'EQ-15',
    nama: 'DJI Ronin-SC Gimbal Stabilizer',
    kategori: 'Tripod & Aksesori',
    lokasiRak: 'Lemari Studio - Rak 8',
    wadah: 'Lemari Studio',
    spesifikasi: '3-Axis Motorized Camera Gimbal Stabilizer untuk Mirrorless. Tersimpan di Rak 8 Lemari Studio bersama XD Cam & LAN.',
    kondisiFisik: 'Sangat Baik',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-16',
    kode: 'EQ-16',
    nama: 'Tripod Zomei Q111 #1',
    kategori: 'Tripod & Aksesori',
    lokasiRak: 'Lemari Studio - Rak 7',
    wadah: 'Lemari Studio',
    spesifikasi: 'Tripod Kamera Zomei Q111 (Unit 1 - Kondisi Baik). Tersimpan di Rak 7 Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-17',
    kode: 'EQ-17',
    nama: 'Tripod Zomei Q111 #2',
    kategori: 'Tripod & Aksesori',
    lokasiRak: 'Lemari Studio - Rak 7',
    wadah: 'Lemari Studio',
    spesifikasi: 'Tripod Kamera Zomei Q111 (Unit 2 - Kondisi Baik). Tersimpan di Rak 7 Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-18',
    kode: 'EQ-18',
    nama: 'Tripod Zomei Q111 #3',
    kategori: 'Tripod & Aksesori',
    lokasiRak: 'Lemari Studio - Rak 7',
    wadah: 'Lemari Studio',
    spesifikasi: 'Tripod Kamera Zomei Q111 (Unit 3 - Kondisi Baik). Tersimpan di Rak 7 Lemari Studio.',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-19',
    kode: 'EQ-19',
    nama: 'Tripod Zomei Q111 #4',
    kategori: 'Tripod & Aksesori',
    lokasiRak: 'Lemari Studio - Rak 7',
    wadah: 'Lemari Studio',
    spesifikasi: 'Tripod Kamera Zomei Q111 (Unit 4) - Catatan: Rusak 1 unit, butuh perbaikan sparepart.',
    kondisiFisik: 'Rusak 1 (Butuh Perbaikan)',
    baterai: null,
    status: 'Perbaikan',
    terkunciOlehEventId: null
  },
  // Baterai & Charger (15 Unit)
  {
    id: 'EQ-20',
    kode: 'EQ-20',
    nama: 'Baterai Takara #1',
    kategori: 'Baterai',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Baterai Takara Studio tipe LP-E17 (Unit 1). Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-21',
    kode: 'EQ-21',
    nama: 'Baterai Takara #2',
    kategori: 'Baterai',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Baterai Takara Studio tipe LP-E17 (Unit 2). Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-22',
    kode: 'EQ-22',
    nama: 'Baterai NP-F980 #1',
    kategori: 'Baterai',
    lokasiRak: 'Lemari Studio - Rak 5 (Baterai Godox)',
    wadah: 'Lemari Studio',
    spesifikasi: 'Baterai Seri Sony NP-F980 Kapasitas Tinggi untuk LED/Monitor (Unit 1). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-23',
    kode: 'EQ-23',
    nama: 'Baterai NP-F980 #2',
    kategori: 'Baterai',
    lokasiRak: 'Lemari Studio - Rak 5 (Baterai Godox)',
    wadah: 'Lemari Studio',
    spesifikasi: 'Baterai Seri Sony NP-F980 Kapasitas Tinggi untuk LED/Monitor (Unit 2). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-24',
    kode: 'EQ-24',
    nama: 'Baterai NP-F570 #1',
    kategori: 'Baterai',
    lokasiRak: 'Lemari Studio - Rak 5 (Baterai Godox)',
    wadah: 'Lemari Studio',
    spesifikasi: 'Baterai Seri Sony NP-F570 untuk Lighting Godox LEDP120C (Unit 1). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-25',
    kode: 'EQ-25',
    nama: 'Baterai NP-F570 #2',
    kategori: 'Baterai',
    lokasiRak: 'Lemari Studio - Rak 5 (Baterai Godox)',
    wadah: 'Lemari Studio',
    spesifikasi: 'Baterai Seri Sony NP-F570 untuk Lighting Godox LEDP120C (Unit 2). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-26',
    kode: 'EQ-26',
    nama: 'Baterai NP-F570 #3',
    kategori: 'Baterai',
    lokasiRak: 'Lemari Studio - Rak 5 (Baterai Godox)',
    wadah: 'Lemari Studio',
    spesifikasi: 'Baterai Seri Sony NP-F570 untuk Lighting Godox LEDP120C (Unit 3). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-27',
    kode: 'EQ-27',
    nama: 'Baterai NP-F570 #4',
    kategori: 'Baterai',
    lokasiRak: 'Lemari Studio - Rak 5 (Baterai Godox)',
    wadah: 'Lemari Studio',
    spesifikasi: 'Baterai Seri Sony NP-F570 untuk Lighting Godox LEDP120C (Unit 4). Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-28',
    kode: 'EQ-28',
    nama: 'Baterai Li-ion20',
    kategori: 'Baterai',
    lokasiRak: 'Lemari Studio - Rak 5 (Baterai Godox)',
    wadah: 'Lemari Studio',
    spesifikasi: 'Baterai Li-ion20 Studio. Tersimpan di Rak 5 Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-29',
    kode: 'EQ-29',
    nama: 'Baterai Canon LP-E10',
    kategori: 'Baterai',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Baterai Canon LP-E10 khusus untuk Kamera Canon EOS 1500D. Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: '100% Sehat & Normal',
    baterai: 100,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-30',
    kode: 'EQ-30',
    nama: 'Baterai Dummy #1',
    kategori: 'Baterai',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Baterai Dummy Adapter Sumber Daya Listrik Langsung (Unit 1). Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Normal',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-31',
    kode: 'EQ-31',
    nama: 'Baterai Dummy #2',
    kategori: 'Baterai',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Baterai Dummy Adapter Sumber Daya Listrik Langsung (Unit 2). Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Normal',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-32',
    kode: 'EQ-32',
    nama: 'Charger Power Fast DS-LPE17',
    kategori: 'Baterai',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Charger Power Fast DS-LPE17 + USB Cable untuk Baterai LP-E17. Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Normal',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-33',
    kode: 'EQ-33',
    nama: 'Charger Canon LC-E17E',
    kategori: 'Baterai',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Charger Original Canon LC-E17E untuk Baterai LP-E17 (M6 Mk I / Mk II) + Kabel AC. Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Normal',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  {
    id: 'EQ-34',
    kode: 'EQ-34',
    nama: 'Charger Canon LC-E10E',
    kategori: 'Baterai',
    lokasiRak: 'Box Biru (Dalam Lemari)',
    wadah: 'Box Biru',
    spesifikasi: 'Charger Original Canon LC-E10E khusus Baterai LP-E10 (Canon EOS 1500D) + Kabel AC. Tersimpan di Box Biru Lemari Studio.',
    kondisiFisik: 'Sangat Baik & Normal',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  }
];


// ====================================================================
// SOP PERAWATAN SARANA PRASARANA CAMERA CREATIVE CORNER
// ====================================================================
export const STUDIO_SOP_RULES = [
  {
    nomor: 1,
    judul: 'WAJIB INPUT DI WEBSITE',
    kategori: 'Pencatatan & Tracking Waktu',
    icon: 'FileText',
    badge: 'Wajib',
    deskripsi: 'Setiap mau memakai & mengembalikan WAJIB input di website. Termasuk rekam waktu cas baterai: kapan mulai cas & kapan dicabut.'
  },
  {
    nomor: 2,
    judul: 'PERHATIKAN POSISI AWAL',
    kategori: 'Tata Letak Sesuai Foto',
    icon: 'Compass',
    badge: 'Disiplin',
    deskripsi: 'Saat mengambil & mengembalikan, posisikan sesuai foto baik di Lemari atau BOX coklat dan biru. Jangan sampai tertukar / salah tempat.'
  },
  {
    nomor: 3,
    judul: 'BERSIHKAN SETELAH PAKAI',
    kategori: 'Perawatan & Kebersihan Optik',
    icon: 'Sparkles',
    badge: 'Kebersihan',
    deskripsi: 'Setelah selesai memakai, jika kotor WAJIB dibersihkan menggunakan cleaning kit yang tersedia di Box Coklat.'
  },
  {
    nomor: 4,
    judul: '⚠️ PALING PENTING - JANGAN TINGGALKAN BOX TERBUKA!',
    kategori: 'Aturan Utama Keamanan',
    icon: 'AlertTriangle',
    badge: 'Kritis',
    deskripsi: 'JANGAN tinggalkan box dalam keadaan terbuka dan di luar lemari. Setelah mengambil, tata kembali dengan baik agar tidak acak-acakan. PASTIKAN box masuk kembali ke dalam lemari.'
  }
];

// ====================================================================
// PEMETAAN MASTER TATA LETAK & WADAH PENYIMPANAN STUDIO
// ====================================================================
export const STUDIO_STORAGE_SYSTEM = {
  boxCoklat: {
    id: 'box-coklat',
    nama: 'Box Coklat (Kamera Utama & Kit Perawatan)',
    lokasiLemari: 'Lemari Studio Lantai 2 — Rak 6',
    warnaTema: '#B45309',
    badgeBg: '#FEF3C7',
    badgeBorder: '#FDE68A',
    fotoUrl: '/storage-photos/box-coklat-annotated.jpg',
    daftarBarang: [
      { nomor: 1, warnaLabel: '#06B6D4', nama: 'Cleaning Kit (Pouch TaffSTUDIO)', kategori: 'Perawatan', keterangan: 'Pouch abu-abu: kuas lensa, blower debu, cairan pembersih, kain microfiber' },
      { nomor: 2, warnaLabel: '#D946EF', nama: 'Strap Camera', kategori: 'Aksesori', keterangan: 'Tali strap leher kamera studio' },
      { nomor: 3, warnaLabel: '#3B82F6', nama: 'Canon EOS 250D', kategori: 'Kamera', keterangan: 'DSLR Body Canon EOS 250D (Bawah kiri)' },
      { nomor: 4, warnaLabel: '#22C55E', nama: 'Canon EOS M6 Mark I', kodeAlat: 'EQ-01', kategori: 'Kamera', keterangan: 'Mirrorless Body Silver (Atas kanan)' },
      { nomor: 5, warnaLabel: '#EAB308', nama: 'Canon EOS 1500D (WKS)', kodeAlat: 'EQ-03', kategori: 'Kamera', keterangan: 'DSLR Body Studio (Tengah kanan)' },
      { nomor: 6, warnaLabel: '#F472B6', nama: 'Canon EOS M6 Mark II', kodeAlat: 'EQ-02', kategori: 'Kamera', keterangan: 'Mirrorless Body Hitam (Bawah kanan)' }
    ]
  },
  boxBiru: {
    id: 'box-biru',
    nama: 'Box Biru (Lensa, Baterai & Charger Kamera)',
    lokasiLemari: 'Lemari Studio Lantai 2 — Rak 6',
    warnaTema: '#1D4ED8',
    badgeBg: '#EFF6FF',
    badgeBorder: '#BFDBFE',
    fotoUrl: '/storage-photos/storage-layout-4.jpeg',
    daftarBarang: [
      { nomor: 1, nama: 'SD Card SanDisk Extreme 64GB', kodeAlat: 'EQ-11', kategori: 'Memory Card', keterangan: 'SDXC 170MB/s 4K UHD' },
      { nomor: 2, nama: 'Charger Canon LC-E17E & LC-E10E', kodeAlat: 'EQ-33 / EQ-34', kategori: 'Charger', keterangan: 'Charger original E17 (M6) & E10 (1500D)' },
      { nomor: 3, nama: 'Kabel Charger AC', kategori: 'Kabel', keterangan: 'Kabel colokan AC untuk charger Canon LC-E17E & LC-E10E' },
      { nomor: 4, nama: 'Baterai LP-E17 (Takara) & LP-E10', kodeAlat: 'EQ-20, EQ-21, EQ-29', kategori: 'Baterai', keterangan: 'Baterai Takara x2 (E17), Canon LP-E10 x1, Baterai Dummy x2' },
      { nomor: 5, nama: 'Charger Power Fast DS-LPE17 + Kabel USB', kodeAlat: 'EQ-32', kategori: 'Charger', keterangan: 'Charger dual/USB untuk baterai LP-E17' },
      { nomor: 6, nama: 'Lensa Kamera Canon (4 Unit)', kodeAlat: 'EQ-04 s/d EQ-07', kategori: 'Lensa', keterangan: 'EF-M 18-150mm, EF-S 18-55mm #1, EF-M 15-45mm, EF-S 18-55mm #2' },
      { nomor: 7, nama: 'Lens Hood', kategori: 'Aksesori Lensa', keterangan: 'Hood pelindung flare cahaya lensa' },
      { nomor: 8, nama: 'Adapter Lensa DSLR to Mirrorless Canon', kategori: 'Adapter', keterangan: 'Mount Adapter Canon EF-EOS M' }
    ]
  },
  lemariStudio: {
    id: 'lemari-studio',
    nama: 'Lemari Penyimpanan Utama Studio (Lantai 2)',
    lokasiLemari: 'Studio Utama Creative Corner Lantai 2',
    warnaTema: '#1E3A8A',
    badgeBg: '#EFF6FF',
    badgeBorder: '#BFDBFE',
    fotoUrl: '/storage-photos/storage-layout-9.jpeg',
    daftarRak: [
      { rak: 1, namaRak: 'Rak 1 (Atas)', isi: 'Box Dus Canon EOS 1500D', kategori: 'Kardus & Kemasan' },
      { rak: 2, namaRak: 'Rak 2', isi: 'Headset, barang jarang kepake (Charger sekunder, HDD Eksternal 2.5"), Converter VGA to HDMI', kategori: 'Aksesori Komputer & Cadangan' },
      { rak: 3, namaRak: 'Rak 3', isi: 'Tas Kamera Studio (2x)', kategori: 'Tas & Mobilitas' },
      { rak: 4, namaRak: 'Rak 4', isi: 'HDD 3.5" Penyimpanan Arsip Studio, Kabel Random', kategori: 'Penyimpanan Data' },
      { rak: 5, namaRak: 'Rak 5 (Tengah)', isi: 'Minum, Box Hollyland (EQ-14 Lark M2), Baterai Godox (EQ-22, EQ-23 NP-F980 x2, EQ-24-27 NP-F570 x4, EQ-28 Li-ion20), Lampu Godox (EQ-08..EQ-10 LEDP120C x3), Holder HP, Baterai Badak', kategori: 'Lighting & Audio' },
      { rak: 6, namaRak: 'Rak 6 (Khusus Box)', isi: 'Box Biru dan Box Coklat (WAJIB dimasukkan kembali ke rak ini dalam keadaan tertutup rapat)', kategori: 'Zona Box Kamera' },
      { rak: 7, namaRak: 'Rak 7 (Samping)', isi: 'Tripod Zomei Q111 4x (EQ-16..EQ-19, Catatan: Rusak 1 unit dalam perbaikan)', kategori: 'Tripod Studio' },
      { rak: 8, namaRak: 'Rak 8 (Bawah)', isi: 'Kabel LAN Jaringan, Gimbal Ronin-SC (EQ-15), Sony / Panasonic XD Cam, Speaker Aktif MAX15MH 2x (EQ-12, EQ-13)', kategori: 'Gimbal, Video & Audio Berat' }
    ]
  }
};

// ====================================================================
// LOG PENCATATAN CAS BATERAI STUDIO (SOP ATURAN #1)
// ====================================================================
export const SEED_BATTERY_CHARGES = [
  {
    id: 'CHG-01',
    batteryId: 'EQ-20',
    batteryName: 'Baterai Takara #1 (LP-E17)',
    chargerName: 'Charger Canon LC-E17E (EQ-33)',
    lokasiColokan: 'Stopkontak Studio Utama Lt. 2',
    waktuMulai: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    waktuSelesai: null,
    durasiMenit: 45,
    estimasiPenuhMenit: 120,
    status: 'Sedang Cas',
    petugas: 'Kru Piket Studio',
    catatan: 'Dicas persiapan liputan besok pagi'
  },
  {
    id: 'CHG-02',
    batteryId: 'EQ-22',
    batteryName: 'Baterai NP-F980 #1 (Lighting)',
    chargerName: 'Charger Power Fast DS-LPE17 / NP-F (EQ-32)',
    lokasiColokan: 'Stopkontak Meja Kios Studio',
    waktuMulai: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    waktuSelesai: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    durasiMenit: 140,
    estimasiPenuhMenit: 140,
    status: 'Selesai',
    petugas: 'Kru Divisi Dokumentasi',
    catatan: 'Baterai sudah penuh 100% dan dicabut, disimpan kembali di Rak 5'
  }
];

export const SEED_EVENTS = [];

// Rekaman Peminjaman Alat (Dimulai Kosong)
export const SEED_BORROWINGS = [];

// Dasbor Tugas Kreatif (Dimulai Kosong - Diisi oleh Admin/Siswa)
export const SEED_CREATIVE_TASKS = [];

// Roster Piket Studio Creative Corner: 2 Versi (Piket 5S & Piket Kebersihan Studio)
export const SEED_DUTY_ROSTER = [
  // ==============================================================
  // 1. JADWAL PIKET 5S (SENYUM, SALAM, SAPA, SOPAN, SANTUN)
  // Dilaksanakan Tiap Hari Kamis Jam 06.30 - 06.55 WIB di Depan Gerbang Sekolah
  // Menyambut Siswa-Siswi yang Hendak Masuk Sekolah
  // ==============================================================
  {
    id: 'DUTY-5S-01',
    jenisPiket: 'Piket 5S',
    hari: 'Kamis (Grup 1)',
    tanggal: 'Rotasi Tiap Kamis Pagi',
    jamOperasional: '06:30 - 06:55',
    petugas: [
      'Malika Anindita Kiyasatina (Kiyasa)',
      'Aesar Abi Febrian (Aesar)',
      'Grindra Felix Suryawijaya (Felix)'
    ],
    tanggungJawab: 'Piket 5S Gerbang Sekolah: Berdiri di depan gerbang sekolah menyambut siswa-siswi yang hendak masuk sekolah dengan Senyum, Salam, Sapa, Sopan, dan Santun (06:30 - 06:55 WIB).',
    status: 'Terjadwal'
  },
  {
    id: 'DUTY-5S-02',
    jenisPiket: 'Piket 5S',
    hari: 'Kamis (Grup 2)',
    tanggal: 'Rotasi Tiap Kamis Pagi',
    jamOperasional: '06:30 - 06:55',
    petugas: [
      'Alfiano Syahri Alfredo (Redo)',
      'Alif Castar Kenta Wicaksono (Alif)',
      'Alif Arrohman (Tulip)'
    ],
    tanggungJawab: 'Piket 5S Gerbang Sekolah: Berdiri di depan gerbang sekolah menyambut siswa-siswi yang hendak masuk sekolah dengan Senyum, Salam, Sapa, Sopan, dan Santun (06:30 - 06:55 WIB).',
    status: 'Terjadwal'
  },
  {
    id: 'DUTY-5S-03',
    jenisPiket: 'Piket 5S',
    hari: 'Kamis (Grup 3)',
    tanggal: 'Rotasi Tiap Kamis Pagi',
    jamOperasional: '06:30 - 06:55',
    petugas: [
      'Gladis Elysia Salsabila (Elys)',
      'Dwi Aditya Wibowo (Dwi)',
      'Faiz Romadhon Nur Wijanarko (Faiz)'
    ],
    tanggungJawab: 'Piket 5S Gerbang Sekolah: Berdiri di depan gerbang sekolah menyambut siswa-siswi yang hendak masuk sekolah dengan Senyum, Salam, Sapa, Sopan, dan Santun (06:30 - 06:55 WIB).',
    status: 'Terjadwal'
  },
  {
    id: 'DUTY-5S-04',
    jenisPiket: 'Piket 5S',
    hari: 'Kamis (Grup 4)',
    tanggal: 'Rotasi Tiap Kamis Pagi',
    jamOperasional: '06:30 - 06:55',
    petugas: [
      'Zidney Fata El Faza (Zidney)',
      'Jonathan Surya Kristiawan (Jonathan)',
      'Arya Mustofa (Arya)'
    ],
    tanggungJawab: 'Piket 5S Gerbang Sekolah: Berdiri di depan gerbang sekolah menyambut siswa-siswi yang hendak masuk sekolah dengan Senyum, Salam, Sapa, Sopan, dan Santun (06:30 - 06:55 WIB).',
    status: 'Terjadwal'
  },
  {
    id: 'DUTY-5S-05',
    jenisPiket: 'Piket 5S',
    hari: 'Kamis (Grup 5)',
    tanggal: 'Rotasi Tiap Kamis Pagi',
    jamOperasional: '06:30 - 06:55',
    petugas: [
      'Abiyyudhia Falah (Abiyyu)',
      'Abrariy Kumara Arkananta (Arka)',
      'Muhammad Ilham Nur Hayat (Ilham)'
    ],
    tanggungJawab: 'Piket 5S Gerbang Sekolah: Berdiri di depan gerbang sekolah menyambut siswa-siswi yang hendak masuk sekolah dengan Senyum, Salam, Sapa, Sopan, dan Santun (06:30 - 06:55 WIB).',
    status: 'Terjadwal'
  },

  // ==============================================================
  // 2. JADWAL PIKET KEBERSIHAN STUDIO
  // Dilaksanakan Tiap 2 Minggu Sekali (Sore 15:00 - 17:00 WIB)
  // ==============================================================
  {
    id: 'DUTY-KB-01',
    jenisPiket: 'Piket Kebersihan Studio',
    hari: 'Jadwal Pertama (Grup 1)',
    tanggal: 'Rotasi Tiap 2 Minggu',
    jamOperasional: '15:00 - 17:00',
    petugas: [
      'Abrariy Kumara Arkananta (Arka)',
      'Jonathan Surya Kristiawan (Jonathan)',
      'Malika Anindita Kiyasatina (Kiyasa)',
      'Faiz Romadhon Nur Wijanarko (Faiz)',
      'Arya Mustofa (Arya)'
    ],
    tanggungJawab: 'Piket Kebersihan Studio: Menyapu & mengepel lantai, sanitasi workstation PC editing, membersihkan dry cabinet dengan cleaning kit, dan cek baterai kamera.',
    status: 'Terjadwal'
  },
  {
    id: 'DUTY-KB-02',
    jenisPiket: 'Piket Kebersihan Studio',
    hari: 'Jadwal Kedua (Grup 2)',
    tanggal: 'Rotasi Tiap 2 Minggu',
    jamOperasional: '15:00 - 17:00',
    petugas: [
      'Muhammad Ilham Nur Hayat (Ilham)',
      'Alif Arrohman (Tulip)',
      'Alfiano Syahri Alfredo (Redo)',
      'Dwi Aditya Wibowo (Dwi)',
      'Gladis Elysia Salsabila (Elys)'
    ],
    tanggungJawab: 'Piket Kebersihan Studio: Sanitasi meja workstation PC editing, merapikan keyboard/mouse, menata kabel floor, sanitasi sofa studio, dan lap meja.',
    status: 'Terjadwal'
  },
  {
    id: 'DUTY-KB-03',
    jenisPiket: 'Piket Kebersihan Studio',
    hari: 'Jadwal Ketiga (Grup 3)',
    tanggal: 'Rotasi Tiap 2 Minggu',
    jamOperasional: '15:00 - 17:00',
    petugas: [
      'Abiyyudhia Falah (Biyu)',
      'Grindra Felix Suryawijaya (Pelik)',
      'Zidney Fata El Faza (Zidney)',
      'Alif Castar Kenta Wicaksono (Alip)',
      'Aesar Abi Febrian (Aesar)'
    ],
    tanggungJawab: 'Piket Kebersihan Studio: Inspeksi kerapian Box Coklat & Box Biru di dalam lemari, pastikan box tidak terbuka di luar, sapu/pel lantai, dan buang sampah studio.',
    status: 'Terjadwal'
  }
];

// Slot Klien Workstation PC Resmi Creative Corner (4 Unit Aktif Studio: 2 Editor Video & 2 Desain Grafis PC Tengah)
export const SEED_PC_CLIENTS = [
  {
    id: 'PC-01',
    namaUnit: 'PC1-STUDIO (Editor Video #1 - Dekat Pintu)',
    peruntukan: 'Editor Video',
    posisi: 'Dekat Pintu Studio',
    emailAkun: 'pc1.editor@gmail.com',
    passwordAkun: 'pc1#editor',
    spesifikasi: 'Intel Core i5-8400 @ 2.80GHz | RAM 32GB | NVIDIA GeForce GT 1030 2GB | Storage 2,75 TB | Windows 11 Pro',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-02',
    namaUnit: 'DEKSTOP-7TVS43B (Editor Video #2 - Backup)',
    peruntukan: 'Editor Video',
    posisi: 'Baris Editor Studio',
    emailAkun: 'pc2.editor@gmail.com',
    passwordAkun: 'pc2#editor',
    spesifikasi: 'Intel Core i7-9700 @ 3.00GHz | RAM 8GB | NVIDIA GeForce GT 730 5,9GB & Intel UHD Graphics 630 3,9GB | Storage 1,38 TB',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-03',
    namaUnit: 'PC3-STUDIO (PC Tengah A - Desain Grafis #1)',
    peruntukan: 'Desain Grafis',
    posisi: 'Meja Tengah A',
    emailAkun: 'pc3.desain@gmail.com',
    passwordAkun: 'pc3#desain',
    spesifikasi: 'Intel Core i5-10400F @ 2.90GHz | RAM 16GB | NVIDIA GeForce GTX 1650 4GB | Storage SSD NVMe 1 TB | Workstation Desain & Ilustrasi',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-04',
    namaUnit: 'PC4-STUDIO (PC Tengah B - Desain Grafis #2)',
    peruntukan: 'Desain Grafis',
    posisi: 'Meja Tengah B',
    emailAkun: 'pc4.desain@gmail.com',
    passwordAkun: 'pc4#desain',
    spesifikasi: 'AMD Ryzen 5 3600 @ 3.60GHz | RAM 16GB | AMD Radeon RX 580 8GB | Storage SSD NVMe 1 TB | Workstation Layout & Desain Vektor',
    status: 'Tersedia',
    penggunaAktif: null
  }
];

// Helper Verifikasi Password Akun Creative Corner (Exact Match & Toleransi Bersahabat)
export const verifyPassword = (inputPass, expectedPass, member) => {
  if (!inputPass) return false;
  const cleanInput = inputPass.trim().toLowerCase();
  if (expectedPass && expectedPass.toLowerCase() === cleanInput) return true;
  if (member?.password && member.password.toLowerCase() === cleanInput) return true;
  if (Array.isArray(member?.acceptedPasswords)) {
    if (member.acceptedPasswords.some((p) => p.toLowerCase() === cleanInput)) return true;
  }
  // Toleransi jika user lupa menulis tanda '#'
  if (expectedPass && expectedPass.toLowerCase().replace(/#/g, '') === cleanInput) return true;
  if (member?.password && member.password.toLowerCase().replace(/#/g, '') === cleanInput) return true;
  return false;
};

// Arsip Log Aktivitas PC (Dimulai Kosong)
export const SEED_PC_LOGS = [];

// Format Standar Surat Peminjaman Alat yang Disediakan Web
export const FORMAT_SURAT_PEMINJAMAN_TEXT = `KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
SMK / SMA NEGERI UNGGULAN
KOMUNITAS KREATIF & MULTIMEDIA "CREATIVE CORNER"
Jl. Pendidikan No. 45, Kota Pelajar. Telp: (021) 7654321

SURAT PERIZINAN PEMINJAMAN ALAT
Nomor: CC-FORM-01/RESMI

Yang bertanda tangan di bawah ini:
Nama Peminjam / Anggota : [NAMA_PEMINJAM]
Kelas / NIS / Instansi  : [KELAS_PEMINJAM]
Divisi / Peran di Tim   : [DIVISI_ANGGOTA]
Nomor WhatsApp          : [NOMOR_WHATSAPP]

Dengan ini mengajukan permohonan peminjaman peralatan studio Creative Corner:
Daftar Alat             : [DAFTAR_PERALATAN]
Keperluan Peminjaman    : [KEPERLUAN_LIPUTAN]
Hari / Tanggal          : [TANGGAL_PINJAM]
Waktu Peminjaman        : [WAKTU_PINJAM] s/d [WAKTU_KEMBALI] WIB

SYARAT & KETENTUAN PEMINJAMAN:
1. Peminjam bertanggung jawab penuh atas keamanan, kebersihan, dan keutuhan unit alat.
2. Wajib melampirkan bukti surat perizinan yang telah ditandatangani saat mengajukan peminjaman.
3. Wajib mengisi formulir inspeksi pengambilan (awal) dan pengembalian (akhir) pada sistem Creative Corner.
4. Segala bentuk kelalaian yang menyebabkan kerusakan fisik atau hilangnya aksesori wajib diganti sesuai spesifikasi unit.
5. Peralatan wajib dikembalikan tepat waktu sesuai batas jam yang disetujui.

Mengetahui,                                     Peminjam,
Koordinator Alat Creative Corner                

(                                 )            ( [NAMA_PEMINJAM] )`;

// Templat Dokumen Resmi Creative Corner (Bentuk Format Standar Surat)
export const SEED_OFFICIAL_DOCUMENTS = [
  {
    id: 'DOC-01',
    kodeSurat: 'CC-FORM-01/RESMI',
    judul: 'Surat Perizinan Peminjaman Alat Creative Corner',
    kategori: 'Peminjaman Alat',
    deskripsi: 'Format standar permohonan peminjaman unit kamera, lensa, dan perlengkapan studio untuk penugasan dokumentasi sekolah.',
    kontenTemplat: FORMAT_SURAT_PEMINJAMAN_TEXT,
    tanggalUpdate: '2026-10-23',
    versi: '1.0'
  },
  {
    id: 'DOC-02',
    kodeSurat: 'CC-FORM-02/RESMI',
    judul: 'Surat Izin Penggunaan Ruang Creative Corner',
    kategori: 'Penggunaan Ruangan',
    deskripsi: 'Format standar permohonan pemakaian Ruang Studio Utama atau Ruang Editing & Podcast untuk kebutuhan produksi visual.',
    kontenTemplat: `KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
SMK / SMA NEGERI UNGGULAN
KOMUNITAS KREATIF & MULTIMEDIA "CREATIVE CORNER"
Jl. Pendidikan No. 45, Kota Pelajar. Telp: (021) 7654321

SURAT IZIN PENGGUNAAN RUANG CREATIVE CORNER
Nomor: CC-FORM-02/RESMI

Yang bertanda tangan di bawah ini:
Nama Penanggung Jawab : [NAMA_PEMINJAM]
Kelas / Jabatan       : [KELAS_PEMINJAM]
Jumlah Anggota Tim    : [JUMLAH_ORANG] Orang
Nomor WhatsApp        : [NOMOR_WHATSAPP]

Mengajukan permohonan penggunaan ruangan studio:
Ruangan yang Diajukan : [NAMA_RUANGAN_STUDIO]
Agenda Kegiatan       : [KEPERLUAN_PRODUKSI]
Hari / Tanggal        : [TANGGAL_PINJAM]
Durasi Penggunaan     : [WAKTU_PINJAM] s/d [WAKTU_KEMBALI] WIB

TATA TERTIB PENGGUNAAN RUANGAN:
1. Menjaga ketertiban, kebersihan, dan larangan membawa makanan berkuah ke dalam ruang studio.
2. Mematikan AC, lampu pencahayaan studio, dan mengunci pintu saat sesi selesai.
3. Mengembalikan posisi perlengkapan lighting, stand, dan cyclorama ke posisi semula.

Menyetujui,                                     Pemohon,
Pembina Creative Corner                         

( Guru Pembina Multimedia )                    ( [NAMA_PEMINJAM] )`,
    tanggalUpdate: '2026-10-23',
    versi: '1.0'
  }
];

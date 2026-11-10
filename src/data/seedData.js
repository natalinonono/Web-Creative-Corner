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
  return clean === 'admin1.creativecorner@gmail.com' || clean === 'creativecorner@gmail.com';
};

// Akun Admin Utama Resmi
export const DEFAULT_ADMIN_USER = {
  id: 'ADM-01',
  nama: 'Pengelola Creative Corner',
  email: 'admin1.creativecorner@gmail.com',
  kelas: 'Guru Pembina & Koordinator Studio',
  nomorWa: '6281200000000',
  divisi: 'Admin',
  peranUtama: 'Admin',
  role: 'admin',
  avatar: 'CC'
};

// Data Master Anggota (Dimulai hanya dengan akun Admin Resmi, tanpa data dummy siswa)
export const SEED_MEMBERS = [
  DEFAULT_ADMIN_USER
];

// Master Peralatan & Perlengkapan Resmi Studio Creative Corner (34 Unit)
export const SEED_EQUIPMENT = [
  // Kamera (3 Unit)
  {
    id: 'EQ-01',
    kode: 'EQ-01',
    nama: 'Canon EOS M6 Mk I',
    kategori: 'Kamera',
    lokasiRak: 'Dry Cabinet Studio',
    spesifikasi: 'Body Only Mirrorless. Memakai Lensa Canon EF-M (tanpa adapter).',
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
    lokasiRak: 'Dry Cabinet Studio',
    spesifikasi: 'Body Only Mirrorless. WAJIB PAKAI ADAPTER EOS EF-M TO EF dan Lensa Canon EF/EF-S.',
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
    lokasiRak: 'Dry Cabinet Studio',
    spesifikasi: 'Body Only DSLR. Memakai Lensa Canon EF/EF-S dan Baterai LP-E10.',
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
    lokasiRak: 'Dry Cabinet Studio',
    spesifikasi: 'Mount: Lensa EF-M (Khusus Canon EOS M6 Mk I)',
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
    lokasiRak: 'Dry Cabinet Studio',
    spesifikasi: 'Mount: Lensa EF (Cocok untuk EOS 1500D & M6 Mk II + Adapter EF-M to EF)',
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
    lokasiRak: 'Dry Cabinet Studio',
    spesifikasi: 'Mount: Lensa EF-M (Khusus Canon EOS M6 Mk I)',
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
    lokasiRak: 'Dry Cabinet Studio',
    spesifikasi: 'Mount: Lensa EF (Cocok untuk EOS 1500D & M6 Mk II + Adapter EF-M to EF)',
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
    lokasiRak: 'Rak Lighting Studio',
    spesifikasi: 'Panel LED Bi-Color Godox LEDP120C (Unit 1 - Daya baterai seri NP-F)',
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
    lokasiRak: 'Rak Lighting Studio',
    spesifikasi: 'Panel LED Bi-Color Godox LEDP120C (Unit 2 - Daya baterai seri NP-F)',
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
    lokasiRak: 'Rak Lighting Studio',
    spesifikasi: 'Panel LED Bi-Color Godox LEDP120C (Unit 3 - Daya baterai seri NP-F)',
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
    lokasiRak: 'Box Memory Studio',
    spesifikasi: 'SDXC UHS-I 64GB Kecepatan hingga 170MB/s (V30 U3 C10 4K UHD)',
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
    lokasiRak: 'Area Audio Studio',
    spesifikasi: 'Speaker Aktif Studio / Event MAX15MH (Unit 1)',
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
    lokasiRak: 'Area Audio Studio',
    spesifikasi: 'Speaker Aktif Studio / Event MAX15MH (Unit 2)',
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
    lokasiRak: 'Rak Audio Studio',
    spesifikasi: 'Mikrofon Wireless Lavalier Hollyland Lark M2 + Charging Case',
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
    lokasiRak: 'Rak Gimbal Studio',
    spesifikasi: '3-Axis Motorized Camera Gimbal Stabilizer untuk Mirrorless',
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
    lokasiRak: 'Rak Tripod Studio',
    spesifikasi: 'Tripod Kamera Zomei Q111 (Unit 1)',
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
    lokasiRak: 'Rak Tripod Studio',
    spesifikasi: 'Tripod Kamera Zomei Q111 (Unit 2)',
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
    lokasiRak: 'Rak Tripod Studio',
    spesifikasi: 'Tripod Kamera Zomei Q111 (Unit 3)',
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
    lokasiRak: 'Rak Tripod Studio',
    spesifikasi: 'Tripod Kamera Zomei Q111 (Unit 4)',
    kondisiFisik: 'Sangat Baik',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  },
  // Baterai & Charger (15 Unit)
  {
    id: 'EQ-20',
    kode: 'EQ-20',
    nama: 'Baterai Takara #1',
    kategori: 'Baterai',
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Takara Studio (Unit 1)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Takara Studio (Unit 2)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Seri Sony NP-F980 Kapasitas Tinggi untuk LED/Monitor (Unit 1)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Seri Sony NP-F980 Kapasitas Tinggi untuk LED/Monitor (Unit 2)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Seri Sony NP-F570 untuk Lighting Godox LEDP120C (Unit 1)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Seri Sony NP-F570 untuk Lighting Godox LEDP120C (Unit 2)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Seri Sony NP-F570 untuk Lighting Godox LEDP120C (Unit 3)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Seri Sony NP-F570 untuk Lighting Godox LEDP120C (Unit 4)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Li-ion20 Studio',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Canon LP-E10 khusus untuk Kamera Canon EOS 1500D',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Dummy Adapter Sumber Daya Listrik Langsung (Unit 1)',
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
    lokasiRak: 'Drybox Baterai',
    spesifikasi: 'Baterai Dummy Adapter Sumber Daya Listrik Langsung (Unit 2)',
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
    lokasiRak: 'Rak Charger Studio',
    spesifikasi: 'Charger Power Fast DS-LPE17 untuk Baterai LP-E17 (M6 Mk I / Mk II)',
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
    lokasiRak: 'Rak Charger Studio',
    spesifikasi: 'Charger Original Canon LC-E17E untuk Baterai LP-E17 (M6 Mk I / Mk II)',
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
    lokasiRak: 'Rak Charger Studio',
    spesifikasi: 'Charger Original Canon LC-E10E khusus Baterai LP-E10 (Canon EOS 1500D)',
    kondisiFisik: 'Sangat Baik & Normal',
    baterai: null,
    status: 'Tersedia',
    terkunciOlehEventId: null
  }
];

// Agenda Liputan Sekolah (Dimulai Kosong - Diisi oleh Admin)
export const SEED_EVENTS = [];

// Rekaman Peminjaman Alat (Dimulai Kosong)
export const SEED_BORROWINGS = [];

// Dasbor Tugas Kreatif (Dimulai Kosong - Diisi oleh Admin/Siswa)
export const SEED_CREATIVE_TASKS = [];

// Roster Piket Studio (Dimulai Kosong - Diisi oleh Admin)
export const SEED_DUTY_ROSTER = [];

// Slot Klien Workstation PC Resmi Creative Corner (2 Unit Aktif Studio)
export const SEED_PC_CLIENTS = [
  {
    id: 'PC-01',
    namaUnit: 'PC1-STUDIO (Dekat Pintu)',
    spesifikasi: 'Intel Core i5-8400 @ 2.80GHz | RAM 32GB | NVIDIA GeForce GT 1030 2GB | Storage 2,75 TB | Windows 11 Pro',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-02',
    namaUnit: 'DEKSTOP-7TVS43B (Backup)',
    spesifikasi: 'Intel Core i7-9700 @ 3.00GHz | RAM 8GB | NVIDIA GeForce GT 730 5,9GB & Intel UHD Graphics 630 3,9GB | Storage 1,38 TB',
    status: 'Tersedia',
    penggunaAktif: null
  }
];

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

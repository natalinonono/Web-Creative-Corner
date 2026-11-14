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
    fotoUrl: '/storage-photos/storage-layout-3.jpeg',
    daftarBarang: [
      { nomor: 1, nama: 'Cleaning Kit', kategori: 'Perawatan', keterangan: 'Kuas lensa, blower debu, cairan pembersih, kain microfiber' },
      { nomor: 2, nama: 'Strap Camera', kategori: 'Aksesori', keterangan: 'Tali strap leher kamera studio' },
      { nomor: 3, nama: 'Canon 250D', kategori: 'Kamera', keterangan: 'Kamera DSLR Canon EOS 250D Body' },
      { nomor: 4, nama: 'Canon EOS M6 Mark I', kodeAlat: 'EQ-01', kategori: 'Kamera', keterangan: 'Mirrorless Body (Lensa EF-M)' },
      { nomor: 5, nama: 'Canon EOS 1500D (WKS)', kodeAlat: 'EQ-03', kategori: 'Kamera', keterangan: 'DSLR Body Studio (Lensa EF/EF-S)' },
      { nomor: 6, nama: 'Canon EOS M6 Mark II', kodeAlat: 'EQ-02', kategori: 'Kamera', keterangan: 'Mirrorless Body (Wajib Adapter EF-M)' }
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
    warnaTema: '#9333EA',
    badgeBg: '#FAF5FF',
    badgeBorder: '#E9D5FF',
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

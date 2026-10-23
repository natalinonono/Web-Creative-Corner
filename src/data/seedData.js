// ====================================================================
// KONFIGURASI OTENTIKASI & DATA AWAL SISTEM CREATIVE CORNER
// ATURAN EMAIL:
// - Akun Pengelola / Admin HANYA bisa diakses dengan email yang mengandung kata: creativecorner
//   (contoh: admin1.creativecorner@gmail.com, pengelola.creativecorner@sch.id)
// - Akun Anggota Creative Corner: Menggunakan akun email siswa / anggota terdaftar
// - Bukan Anggota Creative Corner: Bisa langsung meminjam & memakai PC tanpa perlu email
// ====================================================================

export const ADMIN_KEYWORD = 'creativecorner';
export const ADMIN_EMAIL_SUFFIX = 'creativecorner'; // Alias untuk kompabilitas
export const STUDENT_EMAIL_SUFFIX = '';

export const isAdminEmail = (email) => {
  if (!email) return false;
  return email.toLowerCase().trim().includes(ADMIN_KEYWORD);
};

// Akun Admin Utama Resmi
export const DEFAULT_ADMIN_USER = {
  id: 'ADM-01',
  nama: 'Pengelola Creative Corner',
  email: 'admin1.creativecorner@gmail.com',
  kelas: 'Guru Pembina & Koordinator Studio',
  nomorWa: '6281200000000',
  peranUtama: 'Administrator Studio',
  role: 'admin',
  avatar: 'CC'
};

// Data Master Anggota (Dimulai hanya dengan akun Admin Resmi, tanpa data dummy siswa)
export const SEED_MEMBERS = [
  DEFAULT_ADMIN_USER
];

// Master Peralatan & Ruangan Studio (Dimulai Kosong - Diisi oleh Admin)
export const SEED_EQUIPMENT = [];

// Agenda Liputan Sekolah (Dimulai Kosong - Diisi oleh Admin)
export const SEED_EVENTS = [];

// Rekaman Peminjaman Alat (Dimulai Kosong)
export const SEED_BORROWINGS = [];

// Dasbor Tugas Kreatif (Dimulai Kosong - Diisi oleh Admin/Siswa)
export const SEED_CREATIVE_TASKS = [];

// Roster Piket Studio (Dimulai Kosong - Diisi oleh Admin)
export const SEED_DUTY_ROSTER = [];

// Slot Klien Workstation PC Creative Corner (6 Unit Siap Pakai, Status Kosong/Tersedia)
export const SEED_PC_CLIENTS = [
  {
    id: 'PC-01',
    namaUnit: 'PC-01 (Editing Workstation)',
    spesifikasi: 'Intel Core i9 / RAM 64GB / GPU RTX Series / Monitor 4K Color Accurate',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-02',
    namaUnit: 'PC-02 (Design & Motion Station)',
    spesifikasi: 'AMD Ryzen 9 / RAM 32GB / GPU RTX Series / Pen Tablet Drawing',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-03',
    namaUnit: 'PC-03 (Color Grading & Audio Studio)',
    spesifikasi: 'Intel Core i7 / RAM 32GB / Audio Interface Studio Monitor',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-04',
    namaUnit: 'PC-04 (General Creative Workstation)',
    spesifikasi: 'AMD Ryzen 7 / RAM 32GB / Dual Display 27-inch',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-05',
    namaUnit: 'PC-05 (General Creative Workstation)',
    spesifikasi: 'Intel Core i5 / RAM 32GB / Dual Display 27-inch',
    status: 'Tersedia',
    penggunaAktif: null
  },
  {
    id: 'PC-06',
    namaUnit: 'PC-06 (Podcast & Streaming Control)',
    spesifikasi: 'Intel Core i7 / RAM 32GB / CamLink 4K Quad & Stream Controller',
    status: 'Tersedia',
    penggunaAktif: null
  }
];

// Arsip Log Aktivitas PC (Dimulai Kosong)
export const SEED_PC_LOGS = [];

// Templat Dokumen Resmi Creative Corner (Bentuk Format Standar Surat)
export const SEED_OFFICIAL_DOCUMENTS = [
  {
    id: 'DOC-01',
    kodeSurat: 'CC-FORM-01/RESMI',
    judul: 'Surat Perizinan Peminjaman Alat Creative Corner',
    kategori: 'Peminjaman Alat',
    deskripsi: 'Format standar permohonan peminjaman unit kamera, lensa, dan perlengkapan studio untuk penugasan dokumentasi sekolah.',
    kontenTemplat: `KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
SMK / SMA NEGERI UNGGULAN
KOMUNITAS KREATIF & MULTIMEDIA "CREATIVE CORNER"
Jl. Pendidikan No. 45, Kota Pelajar. Telp: (021) 7654321

SURAT PERIZINAN PEMINJAMAN ALAT
Nomor: CC-FORM-01/RESMI

Yang bertanda tangan di bawah ini:
Nama Anggota        : [NAMA_PEMINJAM]
Kelas / NIS         : [KELAS_PEMINJAM]
Peran di Tim        : [PERAN_ANGGOTA]
Nomor WhatsApp      : [NOMOR_WHATSAPP]

Dengan ini mengajukan permohonan peminjaman peralatan studio Creative Corner:
Daftar Alat         : [DAFTAR_PERALATAN]
Keperluan           : [KEPERLUAN_LIPUTAN]
Hari / Tanggal      : [TANGGAL_PINJAM]
Waktu Peminjaman    : [WAKTU_PINJAM] s/d [WAKTU_KEMBALI] WIB

SYARAT & KETENTUAN PEMINJAMAN:
1. Peminjam bertanggung jawab penuh atas keamanan, kebersihan, dan keutuhan unit alat.
2. Wajib mengisi formulir inspeksi pengambilan (awal) dan pengembalian (akhir) pada sistem Creative Corner.
3. Segala bentuk kelalaian yang menyebabkan kerusakan fisik atau hilangnya aksesori wajib diganti sesuai spesifikasi unit.
4. Peralatan wajib dikembalikan tepat waktu sesuai jadwal yang telah disetujui.

Mengetahui,                                     Peminjam,
Koordinator Alat Creative Corner                

(                                 )            ( [NAMA_PEMINJAM] )`,
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

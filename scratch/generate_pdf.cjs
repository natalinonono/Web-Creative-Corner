const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = 210;
const pageHeight = 297;
const margin = 16;
const contentWidth = pageWidth - (margin * 2); // 178 mm
const totalPages = 5;

// Helper: Header & Footer yang Rapi, Elegan, dan Presisi
function drawHeaderFooter(doc, pageNum) {
  // Top Navbar Bar
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 12, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('CREATIVE CORNER STUDIO  •  PANDUAN & DOKUMENTASI SISTEM (V3.0)', margin, 7.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text('SMK NEGERI 2 SURAKARTA', pageWidth - margin, 7.8, { align: 'right' });

  // Bottom Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  // Bottom Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Sistem Informasi & Tata Kelola Operasional Studio Multimedia SMKN 2 Surakarta', margin, pageHeight - 7);
  doc.text(`Halaman ${pageNum} dari ${totalPages}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
  doc.text('Status: 100% Production Ready', pageWidth - margin, pageHeight - 7, { align: 'right' });
}

// ============================================================================
// HALAMAN 1: COVER EKSEKUTIF & PROFIL PLATFORM
// ============================================================================
drawHeaderFooter(doc, 1);

// Hero Card Banner
doc.setFillColor(30, 58, 138); // Royal Blue
doc.roundedRect(margin, 16, contentWidth, 54, 2.5, 2.5, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.setTextColor(255, 255, 255);
doc.text('BUKU DOKUMENTASI RESMI SISTEM', margin + 6, 27);
doc.text('& TATA KELOLA STUDIO MULTIMEDIA', margin + 6, 35);

doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(250, 204, 21); // Yellow Gold
doc.text('CREATIVE CORNER  •  SMK NEGERI 2 SURAKARTA', margin + 6, 44);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.2);
doc.setTextColor(224, 231, 255);
doc.text('Platform Terpadu Tata Kelola Inventaris, Agenda Liputan, & Workstation Editing Studio', margin + 6, 51);
doc.text('Rilis: Versi 3.0 Production  •  Domain Resmi: https://web-creative-corner.vercel.app', margin + 6, 56.5);
doc.text('Teknologi: React 18, Vite, Supabase Real-time Cloud PostgreSQL, & Windows Guardian Daemon', margin + 6, 62);

// Status Badge
doc.setFillColor(240, 253, 244);
doc.setDrawColor(187, 247, 208);
doc.roundedRect(margin, 74, contentWidth, 10.5, 2, 2, 'FD');
doc.setFont('helvetica', 'bold');
doc.setFontSize(8.2);
doc.setTextColor(22, 101, 52);
doc.text('STATUS SISTEM: 100% TERUJI, TERVERIFIKASI & BERJALAN SEMPURNA DI PRODUCTION CLOUD', margin + 5, 81);

// 1. Ringkasan Eksekutif
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(15, 23, 42);
doc.text('1. Ringkasan Eksekutif & Latar Belakang Pengembangan', margin, 93);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(51, 65, 85);
const p1 = 'Website Creative Corner adalah platform operasional cerdas yang dirancang khusus untuk memodernisasi tata kelola sarana prasarana multimedia, inventaris kamera, agenda liputan sekolah, tugas kreatif siswa, serta proteksi workstation PC editing di SMK Negeri 2 Surakarta. Website ini menggantikan sistem pencatatan buku fisik konvensional yang lambat, rentan selisih data, dan sulit ditelusuri riwayat penggunaannya.';
doc.text(doc.splitTextToSize(p1, contentWidth), margin, 99);

const p2 = 'Melalui integrasi cloud database real-time (Supabase) dan script proteksi desktop Windows (Kiosk Guardian), platform ini memastikan seluruh sarana prasarana studio terpelihara rapi, jadwal liputan terkoordinasi jelas sesuai spesialisasi peran anggota, dan hasil karya siswa terlindungi dengan aman.';
doc.text(doc.splitTextToSize(p2, contentWidth), margin, 114);

// 2. Metrik Kapasitas Studio
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(15, 23, 42);
doc.text('2. Metrik Kapasitas & Jangkauan Operasional Studio', margin, 134);

const metrics = [
  { val: '34 Unit', label: 'Inventaris Resmi Studio', sub: 'Kamera, Lensa, Audio, Tripod, Baterai (EQ-01 s/d EQ-34)' },
  { val: '4 Unit', label: 'Workstation PC Studio', sub: 'PC Editing Video & Desain Grafis (PC-01 s/d PC-04)' },
  { val: '22 Siswa', label: 'Anggota Aktif Terdaftar', sub: 'Kru Dokumentasi Kelas XI (Angk. 25) & X (Angk. 26)' },
  { val: '8 Rak', label: 'Denah Lemari SOP', sub: 'Tata Letak Aset Standar Industri Anti Salah Rak' }
];

let mX = margin;
const mWidth = (contentWidth - 9) / 4;
metrics.forEach((m) => {
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(mX, 140, mWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 58, 138);
  doc.text(m.val, mX + 4, 150);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(m.label, mX + 4, 156);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  const splSub = doc.splitTextToSize(m.sub, mWidth - 7);
  doc.text(splSub, mX + 4, 160.5);

  mX += mWidth + 3;
});

// 3. Hak Kepemilikan & Etika Sarana Prasarana
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('3. Batasan Sarana Prasarana & Penegasan Kepemilikan Aset', margin, 175);

doc.setFillColor(254, 242, 242);
doc.setDrawColor(254, 202, 202);
doc.roundedRect(margin, 180, contentWidth, 22, 2, 2, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(8.2);
doc.setTextColor(153, 27, 27);
doc.text('PENEGASAN KEPEMILIKAN ASET PINJAMAN RESMI:', margin + 4, 186);

doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(185, 28, 28);
const assertTxt = 'Peralatan yang tersedia untuk peminjaman studio HANYA 34 unit inventaris resmi sekolah (Kamera Canon, Lensa, Godox LED, Mic Lark M2, Tripod Zomei, Baterai, dan Charger). Perangkat komputer/laptop pribadi milik administrator, pengurus, maupun guru pembina (seperti Laptop Pribadi Admin) BUKAN MERUPAKAN ASET PINJAMAN UMUM, berstatus hak milik pribadi mutlak, dan tidak dapat dipinjam oleh pihak luar.';
doc.text(doc.splitTextToSize(assertTxt, contentWidth - 8), margin + 4, 191.5);

// 4. Pilar Keunggulan Sistem
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('4. Tiga Pilar Keunggulan Transformasi Digital Studio', margin, 211);

const pillars = [
  { title: 'A. Efisiensi Birokrasi 100%', desc: 'Peminjaman alat dan izin studio dilakukan tanpa kertas fisik, riwayat terekam otomatis, dan dokumen surat resmi tercetak otomatis.' },
  { title: 'B. Akuntabilitas & Keamanan Aset', desc: 'Sistem inspeksi foto sebelum & sesudah memastikan kondisi fisik alat dan baterai termonitor, mencegah kerusakan tanpa pertanggungjawaban.' },
  { title: 'C. Proteksi Workstation Kiosk', desc: 'Komputer editing terlindungi dari akses ilegal melalui sistem penguncian layar otomatis terintegrasi cloud database real-time.' }
];

let pilX = margin;
const pilW = (contentWidth - 6) / 3;
pillars.forEach((p) => {
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pilX, 216, pilW, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 58, 138);
  doc.text(p.title, pilX + 3.5, 223);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(p.desc, pilW - 7), pilX + 3.5, 229);

  pilX += pilW + 3;
});


// ============================================================================
// HALAMAN 2: ARSITEKTUR 4 SUB-SISTEM & ALUR OPERASIONAL
// ============================================================================
doc.addPage();
drawHeaderFooter(doc, 2);

doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(15, 23, 42);
doc.text('5. Arsitektur Empat Sub-Sistem Terpadu', margin, 21);

const portals = [
  {
    title: 'A. Portal Publik / Tamu (Guest Portal)',
    route: 'Akses: /',
    color: [30, 58, 138],
    bg: [239, 246, 255],
    border: [191, 219, 254],
    desc: 'Layanan terbuka bagi siswa umum, guru pengajar, ekstrakurikuler lain, atau pihak sekolah yang membutuhkan peminjaman alat multimedia atau pemakaian ruang studio.',
    bullets: [
      'Formulir peminjaman online: Pengisian tanggal, jam mulai/selesai, keperluan kegiatan, dan upload berkas izin.',
      'Katalog interaktif 34 unit alat studio lengkap dengan foto unit dan keterangan letak rak penyimpanan.',
      'Fitur Lacak Status Mandiri: Peminjam dapat mengecek langsung apakah pengajuan sudah disetujui atau masih ditinjau.'
    ]
  },
  {
    title: 'B. Portal Anggota Tim Studio (Member Portal)',
    route: 'Akses: ?role=member',
    color: [22, 101, 52],
    bg: [240, 253, 244],
    border: [187, 247, 208],
    desc: 'Pusat operasional 22 anggota resmi Creative Corner untuk koordinasi lapangan, produksi materi, dan perawatan peralatan.',
    bullets: [
      'Kalender Agenda Liputan: Jadwal resmi dokumentasi kegiatan sekolah lengkap dengan rincian kru bertugas.',
      'Inspeksi Fisik Mandiri: Mengunggah foto bukti kamera & persentase baterai saat mengambil dan mengembalikan alat.',
      'Papan Tugas Kreatif: Manajemen proyek (Video, Desain, Naskah) dengan indikator batas waktu ganda (Draf & Final).',
      'Jadwal Piket 5S: Pelaksanaan piket kebersihan studio secara bergilir.'
    ]
  },
  {
    title: 'C. Portal Administrator Studio (Admin Portal)',
    route: 'Akses: ?role=admin',
    color: [180, 83, 9],
    bg: [254, 243, 199],
    border: [253, 224, 71],
    desc: 'Panel kontrol penuh bagi Guru Pembina dan Administrator Studio untuk mengawasi seluruh aktivitas dan aset.',
    bullets: [
      'Approval 1-Klik: Persetujuan atau penolakan pengajuan peminjaman dengan sistem pencegahan bentrok kuota alat.',
      'Penjadwalan Kru Liputan dengan Aturan Ketat: Pembagian peran kamera foto, live report, dan video secara eksklusif.',
      'Manajemen Inventaris Master: Mengubah kondisi alat, menonaktifkan unit rusak, dan memantau cas baterai.',
      'Generator WhatsApp: Pembuat template pesan WA rapi yang otomatis terhubung ke aplikasi WhatsApp Web/HP.'
    ]
  },
  {
    title: 'D. Sistem Workstation Kiosk Client (PC-01 s/d PC-04)',
    route: 'Akses: ?mode=kiosk&pc=PC-XX',
    color: [71, 85, 105],
    bg: [248, 250, 252],
    border: [203, 213, 225],
    desc: 'Sistem penguncian desktop terintegrasi yang terpasang di komputer workstation editing studio Creative Corner.',
    bullets: [
      'Layar penuh otomatis saat Windows booting; komputer terkunci sebelum siswa mengisi formulir sesi pemakaian.',
      'Auto-close saat mulai sesi, peringatan pop-up Windows 2 menit sebelum habis, dan auto-lock aman tanpa menutup software editing.'
    ]
  }
];

let pY = 27;
portals.forEach((p) => {
  doc.setFillColor(...p.bg);
  doc.setDrawColor(...p.border);
  doc.roundedRect(margin, pY, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...p.color);
  doc.text(p.title, margin + 4, pY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(p.route, margin + contentWidth - 42, pY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(p.desc, contentWidth - 8), margin + 4, pY + 12);

  let bY = pY + 19;
  p.bullets.forEach((b) => {
    doc.text(`• ${b}`, margin + 5, bY, { maxWidth: contentWidth - 10 });
    bY += 5.2;
  });

  pY += 41.5;
});

// Alur Peminjaman
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('6. Alur Prosedur Peminjaman & Pengembalian Terstandarisasi', margin, pY + 4);

doc.setFillColor(241, 245, 249);
doc.roundedRect(margin, pY + 8, contentWidth, 23, 2, 2, 'F');
doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(71, 85, 105);
doc.text('1. Pengajuan: Siswa mengisi formulir online di portal publik atau anggota mengajukan peminjaman cepat.', margin + 4, pY + 13);
doc.text('2. Verifikasi & Approval: Admin menyetujui jadwal sewa. Kuota alat pada tanggal bersangkutan otomatis terkunci.', margin + 4, pY + 18);
doc.text('3. Inspeksi Ambil & Kembali: Peminjam memotret fisik alat & daya baterai. Admin memverifikasi sebelum status selesai.', margin + 4, pY + 23);
doc.text('4. Penataan Rak: Alat masuk kembali ke rak lemari SOP studio dan baterai wajib langsung dicas.', margin + 4, pY + 28);


// ============================================================================
// HALAMAN 3: MASTER INVENTARIS (34 UNIT) & TATA LETAK LEMARI RAK 1-8
// ============================================================================
doc.addPage();
drawHeaderFooter(doc, 3);

doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(15, 23, 42);
doc.text('7. Master Inventaris Peralatan Resmi Studio (34 Unit Aset)', margin, 21);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.2);
doc.setTextColor(71, 85, 105);
doc.text('Tabel resmi 34 unit peralatan inventaris multimedia milik studio Creative Corner SMKN 2 Surakarta:', margin, 26);

// Tabel Kategori 34 Unit
const eqList = [
  ['EQ-01 s/d EQ-03', 'Kamera Studio (3 Unit)', 'Canon EOS M6 Mk I (Body Silver), Canon EOS M6 Mk II (Body Hitam), Canon EOS 1500D DSLR (WKS)'],
  ['EQ-04 s/d EQ-07', 'Lensa Kamera (4 Unit)', 'Canon Zoom Lens EF-M 18-150mm, EF-S 18-55mm #1, EF-M 15-45mm, EF-S 18-55mm #2 + Adapter Mount'],
  ['EQ-08 s/d EQ-10', 'Tata Cahaya / LED (3 Unit)', 'Godox LEDP120C Bi-Color (Unit 1, 2, dan 3 - Daya baterai seri Sony NP-F)'],
  ['EQ-11', 'Memory Card (1 Unit)', 'SD Card SanDisk Extreme 64GB 170MB/s V30 4K UHD'],
  ['EQ-12 s/d EQ-14', 'Audio & Speaker (3 Unit)', 'Speaker Aktif MAX15MH (2 Unit) dan Wireless Microphone Hollyland Lark M2 Studio'],
  ['EQ-15 s/d EQ-19', 'Stabilizer & Tripod (5 Unit)', 'Gimbal Ronin-SC Studio dan 4 Unit Tripod Zomei Q111 (Unit 1, 2, 3 Normal; Unit 4 Servis)'],
  ['EQ-20 s/d EQ-31', 'Baterai Studio (12 Unit)', 'Baterai Takara LP-E17 (2x), Sony NP-F980 (2x), Sony NP-F570 (4x), Li-ion20 (1x), LP-E10 (1x), Dummy (2x)'],
  ['EQ-32 s/d EQ-34', 'Charger Baterai (3 Unit)', 'Charger Dual Power Fast DS-LPE17, Charger Original Canon LC-E17E, Charger Canon LC-E10E']
];

let eqY = 30;
doc.setFillColor(15, 23, 42);
doc.rect(margin, eqY, contentWidth, 6, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(7.5);
doc.setTextColor(255, 255, 255);
doc.text('Kode Aset', margin + 3, eqY + 4.2);
doc.text('Kategori & Nama Alat', margin + 35, eqY + 4.2);
doc.text('Spesifikasi Fisik & Kompatibilitas', margin + 92, eqY + 4.2);

eqY += 6;
eqList.forEach((row, i) => {
  doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
  doc.rect(margin, eqY, contentWidth, 8, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, eqY + 8, margin + contentWidth, eqY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(30, 58, 138);
  doc.text(row[0], margin + 3, eqY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(row[1], margin + 35, eqY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(row[2], contentWidth - 95), margin + 92, eqY + 3.8);

  eqY += 8;
});

// 8. Denah Penyimpanan Lemari Studio (Rak 1 - 8)
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('8. Denah Penyimpanan Resmi Lemari Studio (Rak 1 s/d Rak 8)', margin, eqY + 6);

const racks = [
  { rak: 'Rak 1 (Atas)', isi: 'Kardus & Kemasan Box Dus Canon EOS 1500D' },
  { rak: 'Rak 2', isi: 'Headset, Charger cadangan, HDD Eksternal 2.5", Converter VGA to HDMI' },
  { rak: 'Rak 3', isi: 'Tas Kamera Studio (2x) & Tas Perlengkapan Liputan' },
  { rak: 'Rak 4', isi: 'HDD 3.5" Penyimpanan Master Arsip Video/Foto Studio & Kabel Display' },
  { rak: 'Rak 5 (Tengah)', isi: 'Box Hollyland Lark M2, Baterai Godox (NP-F), Lampu Godox LEDP120C (3x), Holder HP' },
  { rak: 'Rak 6 (Khusus Box)', isi: 'Box Biru (Lensa & Baterai Takara LP-E17) dan Box Coklat (Body Kamera Canon M6 & 1500D)' },
  { rak: 'Rak 7 (Samping)', isi: '4 Unit Tripod Zomei Q111 (Unit 1, 2, 3 Baik; Unit 4 Servis)' },
  { rak: 'Rak 8 (Bawah)', isi: 'Kabel LAN Jaringan, Gimbal Ronin-SC, Kamera Video Berat & Speaker MAX15MH (2x)' }
];

let rY = eqY + 11;
racks.forEach((r) => {
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, rY, contentWidth, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(30, 58, 138);
  doc.text(r.rak, margin + 3, rY + 4.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text(r.isi, margin + 40, rY + 4.2);

  rY += 6;
});

// SOP Aturan Utama
doc.setFillColor(254, 242, 242);
doc.setDrawColor(254, 202, 202);
doc.roundedRect(margin, rY + 4, contentWidth, 16, 2, 2, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(7.8);
doc.setTextColor(153, 27, 27);
doc.text('SOP WAJIB STUDIO #1: ATURAN PENGISIAN DAYA BATERAI KAMERA', margin + 4, rY + 9);

doc.setFont('helvetica', 'normal');
doc.setFontSize(7.2);
doc.setTextColor(185, 28, 28);
doc.text('Setiap baterai yang telah digunakan WAJIB langsung ditancapkan ke charger pada stopkontak studio (Maksimal pengisian 3-4 jam) dan dicatat pada sistem log cas agar selalu berdaya 100% dan siap dipakai untuk agenda liputan berikutnya.', margin + 4, rY + 14, { maxWidth: contentWidth - 8 });


// ============================================================================
// HALAMAN 4: AGENDA LIPUTAN SEKOLAH & TUGAS KREATIF (DUAL DEADLINE)
// ============================================================================
doc.addPage();
drawHeaderFooter(doc, 4);

doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(15, 23, 42);
doc.text('9. Agenda Liputan & Aturan Pembagian Peran Kru Dokumentasi', margin, 21);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.2);
doc.setTextColor(71, 85, 105);
doc.text('Studio menerapkan aturan spesialisasi penugasan kru dokumentasi secara sistematis pada sistem:', margin, 26);

// Box Aturan Kru Liputan
doc.setFillColor(254, 243, 199);
doc.setDrawColor(252, 211, 77);
doc.roundedRect(margin, 30, contentWidth, 42, 2, 2, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(146, 64, 14);
doc.text('ATURAN SPESIALISASI PERAN DOKUMENTASI SEKOLAH:', margin + 4, 36);

const rules = [
  '1. Petugas 3. Video: HANYA anggota dengan divisi / spesialisasi VIDEOGRAFER yang dapat dipilih (Muhammad Ilham Nur Hayat, Alif Castar Kenta Wicaksono, dan Aesar Abi Febrian). Anggota di luar divisi Videografer otomatis dinonaktifkan (disabled) dengan label "⛔ Bukan Videografer (Khusus Foto / Live Report)".',
  '2. Petugas 1 & 2 Foto: HANYA anggota SELAIN Videografer yang dapat dipilih. Anggota divisi Videografer otomatis dinonaktifkan (disabled) dengan label "⛔ (Khusus Video Saja)" agar tetap fokus penuh pada perekaman video liputan.',
  '3. Petugas 4. Live Report (HP): HANYA anggota SELAIN Videografer yang dapat dipilih untuk siaran langsung media sosial sekolah.',
  '4. Proteksi Validasi Ganda: Form menolak penyimpanan dan memunculkan pop-up peringatan jika admin memaksakan penugasan di luar aturan.'
];

let rlY = 42;
rules.forEach((r) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(120, 53, 15);
  doc.text(doc.splitTextToSize(r, contentWidth - 8), margin + 4, rlY);
  rlY += 7.8;
});

// 10. Papan Tugas Kreatif dengan Dual Deadline
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('10. Papan Manajemen Tugas Kreatif dengan Indikator Batas Waktu Ganda', margin, 79);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.2);
doc.setTextColor(51, 65, 85);
const tkDesc = 'Setiap tugas kreatif siswa (Editing Video Highlight, Desain Grafis, Naskah/Konsep, Retouching Foto) dipantau melalui kartu proyek dengan dua tenggat waktu independen:';
doc.text(doc.splitTextToSize(tkDesc, contentWidth), margin, 85);

// Kartu Dual Deadline
const ddCards = [
  {
    title: 'Tenggat Draf Karya (Evaluasi Internal)',
    color: [217, 119, 6],
    bg: [254, 243, 199],
    desc: 'Waktu maksimal penyerahan versi draf kasar (rough cut/sketsa awal). Digunakan oleh guru pembina atau koordinator divisi untuk memberikan catatan revisi sebelum materi difinalisasi.'
  },
  {
    title: 'Tenggat Karya Akhir (Publikasi Resmi)',
    color: [225, 29, 72],
    bg: [255, 241, 242],
    desc: 'Batas mutlak penyerahan karya final yang siap tayang atau dicetak. Dihitung mundur secara otomatis dan terintegrasi dengan status workstation PC studio.'
  }
];

let ddX = margin;
const ddWidth = (contentWidth - 6) / 2;
ddCards.forEach((c) => {
  doc.setFillColor(...c.bg);
  doc.setDrawColor(...c.color);
  doc.roundedRect(ddX, 92, ddWidth, 27, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(...c.color);
  doc.text(c.title, ddX + 4, 99);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(c.desc, ddWidth - 8), ddX + 4, 105);

  ddX += ddWidth + 6;
});

// 11. Otomasi Komunikasi WhatsApp & Format Surat
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('11. Otomasi Komunikasi WhatsApp & Dokumen Resmi', margin, 126);

const docItems = [
  { title: '• WhatsApp Reminder Blaster:', desc: 'Menghasilkan pesan WhatsApp resmi siap kirim ke 4 kru dokumentasi (Foto 1, Foto 2, Video, Live Report) memuat nama agenda, waktu briefing, lokasi liputan, dan perlengkapan kamera yang harus disiapkan.' },
  { title: '• Ekspor Surat Peminjaman (.DOCX & .PDF):', desc: 'Menghasilkan dokumen resmi dengan kop surat SMKN 2 Surakarta, tabel rincian kode alat, nomor seri, identitas peminjam, persetujuan pembina, dan tembusan kepala sekolah.' },
  { title: '• Cetak Bukti Peminjaman Mandiri:', desc: 'Peminjam dapat mencetak struk peminjaman digital berformat ringkas sebagai bukti sah saat membawa unit peralatan ke luar studio.' }
];

let dcY = 132;
docItems.forEach((di) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(30, 58, 138);
  doc.text(di.title, margin, dcY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(di.desc, contentWidth), margin, dcY + 4.8);

  dcY += 15;
});


// ============================================================================
// HALAMAN 5: SISTEM KIOSK GUARDIAN & DIREKTORI KREDENSIAL ANGGOTA
// ============================================================================
doc.addPage();
drawHeaderFooter(doc, 5);

doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(15, 23, 42);
doc.text('12. Sistem Workstation Kiosk & Proteksi Windows Guardian', margin, 21);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.2);
doc.setTextColor(71, 85, 105);
doc.text('Teknologi penguncian workstation studio bekerja melalui 5 lapisan perlindungan aktif:', margin, 26);

// 5 Proteksi Kiosk
const kioskProt = [
  { n: '1', title: 'Auto-Startup Fullscreen Saat Booting', desc: 'Browser otomatis terbuka dalam mode --kiosk fullscreen tanpa address bar saat Windows menyala. Komputer langsung terkunci di ID unitnya (?mode=kiosk&pc=PC-XX).' },
  { n: '2', title: 'Proteksi Anti Alt+F4', desc: 'Jika jendela ditutup paksa sebelum mengisi form, script background mendeteksi hilangnya browser dalam 400ms dan seketika membuka kembali layar Kiosk.' },
  { n: '3', title: 'Auto-Close Saat Sesi Dimulai', desc: 'Setelah siswa mengisi nama, keperluan, dan durasi menit lalu klik "Mulai Sesi", jendela Kiosk otomatis menutup sendiri dan desktop siap digunakan.' },
  { n: '4', title: 'Peringatan Native Pop-Up Windows (Sisa 2 Menit)', desc: 'Tepat 2 menit sebelum durasi habis, muncul pop-up System Modal di atas layar berbunyi alarm: "Sisa waktu 2 menit! Segera SIMPAN (Ctrl+S) file proyek Anda!".' },
  { n: '5', title: 'Auto-Lock Aman Tanpa Menutup Software Editing', desc: 'Saat waktu habis (00:00), layar Kiosk muncul kembali mengunci PC. Seluruh software (Adobe Premiere / Photoshop) TETAP AMAN dan TIDAK DITUTUP PAKSA.' }
];

let kpY = 30;
kioskProt.forEach((kp) => {
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, kpY, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setFillColor(30, 58, 138);
  doc.circle(margin + 5, kpY + 5.5, 3.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(kp.n, margin + 4.2, kpY + 7.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(kp.title, margin + 11, kpY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(kp.desc, contentWidth - 14), margin + 11, kpY + 10);

  kpY += 16;
});

// 13. Daftar 4 Workstation Studio Resmi
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('Daftar 4 Unit Komputer Workstation Resmi Studio:', margin, kpY + 4);

const pcs = [
  ['PC-01', 'Editor Video #1 (Dekat Pintu)', 'i5-8400 / RAM 32GB / GT 1030 2GB / Storage 2,75TB', 'pc1.editor@gmail.com'],
  ['PC-02', 'Editor Video #2 (Backup)', 'i7-9700 / RAM 8GB / GT 730 6GB / Storage 1,38TB', 'pc2.editor@gmail.com'],
  ['PC-03', 'PC Tengah A (Desain Grafis #1)', 'i5-10400F / RAM 16GB / GTX 1650 4GB / SSD NVMe 1TB', 'pc3.desain@gmail.com'],
  ['PC-04', 'PC Tengah B (Desain Grafis #2)', 'Ryzen 5 3600 / RAM 16GB / Radeon RX 580 8GB / SSD NVMe 1TB', 'pc4.desain@gmail.com']
];

let pcTableY = kpY + 8;
doc.setFillColor(15, 23, 42);
doc.rect(margin, pcTableY, contentWidth, 5.5, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(7);
doc.setTextColor(255, 255, 255);
doc.text('ID PC', margin + 3, pcTableY + 3.8);
doc.text('Nama Workstation', margin + 20, pcTableY + 3.8);
doc.text('Spesifikasi Hardware Kunci', margin + 74, pcTableY + 3.8);
doc.text('Email Kredensial', margin + 140, pcTableY + 3.8);

pcTableY += 5.5;
pcs.forEach((row, idx) => {
  doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
  doc.rect(margin, pcTableY, contentWidth, 6, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pcTableY + 6, margin + contentWidth, pcTableY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 58, 138);
  doc.text(row[0], margin + 3, pcTableY + 4.2);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(row[1], margin + 20, pcTableY + 4.2);
  doc.text(row[2], margin + 74, pcTableY + 4.2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text(row[3], margin + 140, pcTableY + 4.2);

  pcTableY += 6;
});

// 14. Direktori Akun & Pengesahan Dokumen
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('14. Direktori Akun Pengurus & Lembar Pengesahan', margin, pcTableY + 6);

doc.setFillColor(254, 243, 199);
doc.setDrawColor(252, 211, 77);
doc.roundedRect(margin, pcTableY + 10, contentWidth, 14, 1.5, 1.5, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(7.8);
doc.setTextColor(146, 64, 14);
doc.text('KREDENSIAL UTAMA ADMINISTRATOR STUDIO:', margin + 4, pcTableY + 15);

doc.setFont('helvetica', 'normal');
doc.setFontSize(7.2);
doc.setTextColor(120, 53, 15);
doc.text('• Guru Pembina : creativecorner@gmail.com        (Sandi: creativecorner123 / admin123)', margin + 4, pcTableY + 20);
doc.text('• Admin Utama  : admin1.creativecorner@gmail.com (Sandi: creativecorner123 / admin123)', margin + 92, pcTableY + 20);

// Lembar Tanda Tangan
let signY = pcTableY + 28;
doc.setFillColor(248, 250, 252);
doc.setDrawColor(203, 213, 225);
doc.roundedRect(margin, signY, contentWidth, 32, 2, 2, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(15, 23, 42);
doc.text('LEMBAR PENGESAHAN DOKUMEN SISTEM CREATIVE CORNER:', margin + 4, signY + 6);

doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(71, 85, 105);
doc.text('Mengetahui & Menyetujui,', margin + 6, signY + 12);
doc.text('Guru Pembina & Koordinator Studio', margin + 6, signY + 16);
doc.text('( ........................................................................ )', margin + 6, signY + 28);

doc.text('Surakarta, 16 November 2026', margin + 105, signY + 12);
doc.text('Administrator & Lead Developer Studio', margin + 105, signY + 16);
doc.text('( Stefanus Natalino / Tim IT Creative Corner )', margin + 105, signY + 28);

// Simpan File Master PDF
const outMaster = path.join('D:', '. ANJAYY PROJECT WEB CC', 'V3', 'DOKUMENTASI_RESMI_CREATIVE_CORNER.pdf');
const outPublic = path.join('D:', '. ANJAYY PROJECT WEB CC', 'V3', 'public', 'DOKUMENTASI_RESMI_CREATIVE_CORNER.pdf');

const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(outMaster, Buffer.from(pdfBytes));
fs.writeFileSync(outPublic, Buffer.from(pdfBytes));

console.log('Clean PDF generated successfully at:', outMaster);
console.log('Public copy updated at:', outPublic);

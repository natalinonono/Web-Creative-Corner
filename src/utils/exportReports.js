/**
 * Utility Ekspor Data Laporan Studio ke File CSV / Excel
 * Menggunakan prefix UTF-8 BOM (\uFEFF) agar Microsoft Excel membuka karakter & tanggal secara otomatis dan rapi.
 */

const downloadCSV = (filename, csvContent) => {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 1. Ekspor Rekap Riwayat Peminjaman Alat
export const exportBorrowingsToCSV = (borrowings = []) => {
  const headers = [
    'No Resi',
    'Tanggal Pinjam',
    'Jam Pinjam',
    'Batas Waktu Kembali',
    'Nama Peminjam',
    'Kelas / Instansi',
    'Nomor WhatsApp',
    'Unit Peralatan / Ruang',
    'Keperluan Kegiatan',
    'Status Peminjaman',
    'Inspeksi Fisik Awal (BEFORE)',
    'Inspeksi Fisik Akhir (AFTER)',
    'Petugas Pemeriksa',
    'Catatan / Kendala'
  ];

  const rows = borrowings.map((b) => [
    `"${b.id || ''}"`,
    `"${b.tanggalPinjam || ''}"`,
    `"${b.jamPinjam || ''}"`,
    `"${b.batasWaktuKembali || ''}"`,
    `"${(b.peminjamNama || '').replace(/"/g, '""')}"`,
    `"${(b.peminjamKelas || '').replace(/"/g, '""')}"`,
    `"'+${b.peminjamWa || ''}"`,
    `"${(b.peralatanNama || '').replace(/"/g, '""')}"`,
    `"${(b.keperluan || '').replace(/"/g, '""')}"`,
    `"${b.status || ''}"`,
    `"${b.inspeksiPengambilan?.kondisiFisik || 'Baik/Siap Pakai'}"`,
    `"${b.inspeksiPengembalian?.kondisiFisik || (b.status === 'Selesai' ? 'Baik/Normal' : 'Sedang Dipakai')}"`,
    `"${b.inspeksiPengambilan?.petugasPemeriksa || 'Petugas Studio'}"`,
    `"${(b.catatan || b.inspeksiPengembalian?.catatanKendala || '-').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Rekap_Peminjaman_Studio_Creative_Corner_${dateStr}.csv`, csvContent);
};

// 2. Ekspor Rekap Agenda Liputan Dokumentasi Lapangan
export const exportEventsToCSV = (events = [], members = [], equipment = []) => {
  const headers = [
    'ID Event',
    'Judul Kegiatan / Acara',
    'Lokasi Pelaksanaan',
    'Tanggal',
    'Waktu Mulai',
    'Waktu Selesai',
    'Status Liputan',
    'Petugas Kamera Foto 1',
    'Petugas Kamera Foto 2',
    'Petugas Video',
    'Petugas Live Report (HP)',
    'Peralatan Dialokasikan'
  ];

  const rows = events.map((ev) => {
    const getPersonnelName = (rolePattern) => {
      const p = ev.personil?.find((item) => item.peran?.toLowerCase().includes(rolePattern));
      return p ? `${p.nama} (${p.statusTugas})` : '-';
    };

    const foto1 = getPersonnelName('foto 1') || getPersonnelName('fotografer 1');
    const foto2 = getPersonnelName('foto 2') || getPersonnelName('fotografer 2');
    const video = getPersonnelName('video');
    const liveHp = getPersonnelName('live report') || getPersonnelName('hp');

    const toolNames = (equipment || [])
      .filter((eq) => ev.peralatanTerkunciIds?.includes(eq.id))
      .map((eq) => eq.nama)
      .join('; ');

    return [
      `"${ev.id || ''}"`,
      `"${(ev.judul || '').replace(/"/g, '""')}"`,
      `"${(ev.lokasi || '').replace(/"/g, '""')}"`,
      `"${ev.tanggal || ''}"`,
      `"${ev.waktuMulai || ''}"`,
      `"${ev.waktuSelesai || ''}"`,
      `"${ev.status || ''}"`,
      `"${foto1.replace(/"/g, '""')}"`,
      `"${foto2.replace(/"/g, '""')}"`,
      `"${video.replace(/"/g, '""')}"`,
      `"${liveHp.replace(/"/g, '""')}"`,
      `"${toolNames.replace(/"/g, '""')}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Rekap_Liputan_Event_Creative_Corner_${dateStr}.csv`, csvContent);
};

// 3. Ekspor Katalog Master Inventaris Alat & Fasilitas
export const exportInventoryToCSV = (equipment = []) => {
  const headers = [
    'ID Aset',
    'Kode Alat',
    'Nama Peralatan / Fasilitas',
    'Kategori',
    'Status Ketersediaan',
    'Kondisi Fisik',
    'Spesifikasi Teknis'
  ];

  const rows = equipment.map((eq) => [
    `"${eq.id || ''}"`,
    `"${eq.kode || ''}"`,
    `"${(eq.nama || '').replace(/"/g, '""')}"`,
    `"${eq.kategori || ''}"`,
    `"${eq.status || ''}"`,
    `"${eq.kondisiFisik || 'Baik'}"`,
    `"${(eq.spesifikasi || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Master_Inventaris_Creative_Corner_${dateStr}.csv`, csvContent);
};

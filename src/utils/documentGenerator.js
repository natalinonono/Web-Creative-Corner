import { jsPDF } from 'jspdf';
import { FORMAT_SURAT_PEMINJAMAN_TEXT } from '../data/seedData';

/**
 * Utilitas Pembuatan & Pengunduhan Dokumen Resmi Creative Corner
 * Mendukung format:
 * 1. Microsoft Word (.docx / .doc)
 * 2. Dokumen Cetak / Adobe PDF (.pdf)
 */

// Format HTML Resmi untuk Dokumen Microsoft Word
const generateWordDocumentHtml = (data = {}) => {
  const peminjam = data.namaPeminjam || '[NAMA LENGKAP PEMINJAM]';
  const kelas = data.kelas || '[KELAS / INSTANSI / DIVISI]';
  const kontak = data.kontak || '[NO. WHATSAPP / HP]';
  const keperluan = data.keperluan || 'Dokumentasi & Produksi Konten Kreatif Studio';
  const tanggalPinjam = data.tanggalPinjam || new Date().toISOString().split('T')[0];
  const targetKembali = data.targetKembali || '17:00 WIB';
  const daftarAlat = data.daftarAlat && data.daftarAlat.length > 0 
    ? data.daftarAlat 
    : [
        { no: 1, nama: 'Kamera Utama (Sony A7 IV / Canon EOS R6)', kode: 'CAM-01', jumlah: '1 Unit', kondisi: 'Baik & Lengkap' },
        { no: 2, nama: 'Lensa Tambahan (24-70mm f/2.8 G-Master)', kode: 'LNS-01', jumlah: '1 Unit', kondisi: 'Optik Jernih' },
        { no: 3, nama: 'Wireless Microphone Set (DJI Mic Dual)', kode: 'MIC-01', jumlah: '1 Set', kondisi: 'Baterai 100%' },
        { no: 4, nama: 'Tripod & Aksesori Tas Lengkap', kode: 'ACC-01', jumlah: '1 Unit', kondisi: 'Kaki & Plate Kencang' }
      ];

  const rowsHtml = daftarAlat.map((item, idx) => `
    <tr>
      <td style="text-align: center; border: 1px solid #000; padding: 6px;">${item.no || idx + 1}</td>
      <td style="border: 1px solid #000; padding: 6px;"><strong>${item.nama}</strong></td>
      <td style="text-align: center; border: 1px solid #000; padding: 6px;">${item.kode || '-'}</td>
      <td style="text-align: center; border: 1px solid #000; padding: 6px;">${item.jumlah || '1 Unit'}</td>
      <td style="border: 1px solid #000; padding: 6px;">${item.kondisi || 'Baik'}</td>
    </tr>
  `).join('');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Surat Perizinan Peminjaman Alat Creative Corner</title>
      <style>
        @page { size: A4; margin: 2cm 2cm 2cm 2cm; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.4; color: #000000; }
        .kop { text-align: center; border-bottom: 3px double #000000; padding-bottom: 8px; margin-bottom: 18px; }
        .kop h3 { margin: 0; font-size: 11pt; font-weight: normal; letter-spacing: 0.5px; }
        .kop h2 { margin: 2px 0; font-size: 13pt; font-weight: bold; }
        .kop h1 { margin: 2px 0; font-size: 15pt; font-weight: bold; }
        .kop p { margin: 2px 0 0 0; font-size: 9pt; font-style: italic; }
        .judul { text-align: center; font-size: 13pt; font-weight: bold; text-decoration: underline; margin-bottom: 2px; }
        .nomor { text-align: center; font-size: 10pt; margin-bottom: 16px; }
        table.meta { width: 100%; border: none; margin-bottom: 12px; }
        table.meta td { padding: 3px 0; font-size: 11pt; vertical-align: top; }
        table.data { width: 100%; border-collapse: collapse; margin: 12px 0 16px 0; }
        table.data th { background-color: #F1F5F9; border: 1px solid #000; padding: 7px; font-size: 10pt; text-align: center; }
        table.data td { border: 1px solid #000; padding: 6px 8px; font-size: 10pt; }
        .pasal { margin-top: 10px; font-size: 9.5pt; text-align: justify; line-height: 1.35; }
        .pasal ol { padding-left: 18px; margin: 4px 0; }
        .pasal li { margin-bottom: 3px; }
        .ttd { width: 100%; margin-top: 24px; border: none; }
        .ttd td { text-align: center; vertical-align: top; width: 33.3%; font-size: 10pt; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h3>KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</h3>
        <h2>SMK / SMA NEGERI UNGGULAN INDONESIA</h2>
        <h1>KOMUNITAS KREATIF & MULTIMEDIA "CREATIVE CORNER"</h1>
        <p>Gedung Creative Corner Lt. 2, Jl. Pendidikan No. 45. Email: creativecorner@gmail.com</p>
      </div>

      <div class="judul">SURAT PERIZINAN PEMINJAMAN ALAT & INVENTARIS</div>
      <div class="nomor">Nomor: 042/CC-LOAN/RESMI/${new Date().getFullYear()}</div>

      <p>Yang bertanda tangan di bawah ini mengajukan permohonan peminjaman unit alat studio Creative Corner:</p>

      <table class="meta">
        <tr>
          <td style="width: 28%;">Nama Lengkap Peminjam</td>
          <td style="width: 2%;">:</td>
          <td style="width: 70%;"><strong>${peminjam}</strong></td>
        </tr>
        <tr>
          <td>Kelas / Instansi / Divisi</td>
          <td>:</td>
          <td>${kelas}</td>
        </tr>
        <tr>
          <td>Kontak / WhatsApp Aktif</td>
          <td>:</td>
          <td>${kontak}</td>
        </tr>
        <tr>
          <td>Tanggal Peminjaman</td>
          <td>:</td>
          <td>${tanggalPinjam}</td>
        </tr>
        <tr>
          <td>Batas Waktu Pengembalian</td>
          <td>:</td>
          <td><strong>${targetKembali}</strong></td>
        </tr>
        <tr>
          <td>Keperluan / Proyek</td>
          <td>:</td>
          <td>${keperluan}</td>
        </tr>
      </table>

      <p style="margin-bottom: 4px;"><strong>Rincian Unit Peralatan / Fasilitas yang Dipinjam:</strong></p>
      <table class="data">
        <thead>
          <tr>
            <th style="width: 6%;">No</th>
            <th style="width: 44%;">Nama Unit / Perlengkapan</th>
            <th style="width: 15%;">Kode Unit</th>
            <th style="width: 12%;">Jumlah</th>
            <th style="width: 23%;">Kondisi Awal Fisik</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="pasal">
        <strong>Pernyataan Tanggung Jawab & Ketentuan Studio Creative Corner:</strong>
        <ol>
          <li>Peminjam bersedia menjaga dan merawat peralatan dengan sebaik-baiknya selama masa peminjaman.</li>
          <li>Kerusakan yang diakibatkan kelalaian pemakaian (jatuh, terkena air, hilang) wajib diperbaiki atau diganti sesuai spesifikasi asli oleh peminjam.</li>
          <li>Peralatan wajib dikembalikan tepat waktu sesuai jadwal yang disepakati dengan baterai terisi dan tas lengkap.</li>
        </ol>
      </div>

      <table class="ttd">
        <tr>
          <td>
            Mengetahui,<br>
            <strong>Pemohon / Peminjam</strong>
            <br><br><br><br>
            ( ${peminjam} )
          </td>
          <td>
            Petugas Verifikasi,<br>
            <strong>Koordinator Logistik CC</strong>
            <br><br><br><br>
            ( .................................... )
          </td>
          <td>
            Menyetujui,<br>
            <strong>Pembina Creative Corner</strong>
            <br><br><br><br>
            <strong>( creativecorner@gmail.com )</strong>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// 1. Ekspor Unduh Format Microsoft Word (.docx / .doc)
export const downloadLoanLetterDocx = (data = {}) => {
  const htmlContent = generateWordDocumentHtml(data);
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Format_Surat_Peminjaman_Creative_Corner_${new Date().toISOString().split('T')[0]}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 2. Ekspor Unduh Format Adobe PDF (.pdf) menggunakan jsPDF
export const downloadLoanLetterPdf = (data = {}) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const peminjam = data.namaPeminjam || '[NAMA LENGKAP PEMINJAM]';
    const kelas = data.kelas || '[KELAS / INSTANSI / DIVISI]';
    const kontak = data.kontak || '[NO. WHATSAPP / HP]';
    const keperluan = data.keperluan || 'Dokumentasi & Produksi Konten Kreatif Studio';
    const tanggalPinjam = data.tanggalPinjam || new Date().toISOString().split('T')[0];
    const targetKembali = data.targetKembali || '17:00 WIB';

    // Kop Surat
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', 105, 18, { align: 'center' });
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('SMK / SMA NEGERI UNGGULAN INDONESIA', 105, 23, { align: 'center' });
    doc.setFontSize(13);
    doc.text('KOMUNITAS KREATIF & MULTIMEDIA "CREATIVE CORNER"', 105, 29, { align: 'center' });
    doc.setFont('times', 'italic');
    doc.setFontSize(8.5);
    doc.text('Gedung Creative Corner Lt. 2, Jl. Pendidikan No. 45. Email: creativecorner@gmail.com', 105, 34, { align: 'center' });

    // Garis Dobel Kop
    doc.setLineWidth(0.8);
    doc.line(20, 37, 190, 37);
    doc.setLineWidth(0.2);
    doc.line(20, 38.2, 190, 38.2);

    // Judul & Nomor Surat
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('SURAT PERIZINAN PEMINJAMAN ALAT & INVENTARIS', 105, 46, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.text(`Nomor: 042/CC-LOAN/RESMI/${new Date().getFullYear()}`, 105, 51, { align: 'center' });

    // Teks Pengantar
    doc.setFontSize(10);
    doc.text('Yang bertanda tangan di bawah ini mengajukan permohonan peminjaman unit alat studio Creative Corner:', 20, 59);

    // Data Meta Peminjam
    let startY = 66;
    const metaItems = [
      ['Nama Lengkap Peminjam', `: ${peminjam}`],
      ['Kelas / Instansi / Divisi', `: ${kelas}`],
      ['Kontak / WhatsApp Aktif', `: ${kontak}`],
      ['Tanggal Peminjaman', `: ${tanggalPinjam}`],
      ['Batas Waktu Pengembalian', `: ${targetKembali}`],
      ['Keperluan Proyek', `: ${keperluan}`]
    ];

    metaItems.forEach(([label, value]) => {
      doc.setFont('times', 'normal');
      doc.text(label, 20, startY);
      doc.setFont('times', 'bold');
      doc.text(value, 75, startY);
      startY += 5.5;
    });

    // Tabel Peralatan
    startY += 3;
    doc.setFont('times', 'bold');
    doc.text('Rincian Unit Peralatan / Fasilitas yang Dipinjam:', 20, startY);
    startY += 4;

    // Header Tabel
    doc.setFillColor(241, 245, 249);
    doc.rect(20, startY, 170, 7, 'F');
    doc.setLineWidth(0.2);
    doc.rect(20, startY, 170, 7, 'S');

    doc.setFontSize(9);
    doc.text('No', 24, startY + 5);
    doc.text('Nama Unit / Perlengkapan', 40, startY + 5);
    doc.text('Kode Unit', 110, startY + 5);
    doc.text('Jumlah', 135, startY + 5);
    doc.text('Kondisi Fisik', 158, startY + 5);
    startY += 7;

    const dummyItems = data.daftarAlat || [
      { no: '1', nama: 'Kamera Utama (Sony A7 IV / Canon EOS R6)', kode: 'CAM-01', jumlah: '1 Unit', kondisi: 'Baik & Normal' },
      { no: '2', nama: 'Lensa Tambahan (24-70mm f/2.8)', kode: 'LNS-01', jumlah: '1 Unit', kondisi: 'Optik Bersih' },
      { no: '3', nama: 'Wireless Microphone Set (DJI Dual)', kode: 'MIC-01', jumlah: '1 Set', kondisi: 'Baterai 100%' },
      { no: '4', nama: 'Tripod Profesional & Tas Lengkap', kode: 'ACC-01', jumlah: '1 Unit', kondisi: 'Kaki Kencang' }
    ];

    doc.setFont('times', 'normal');
    dummyItems.forEach((row, i) => {
      doc.rect(20, startY, 170, 6.5, 'S');
      doc.text(String(row.no || i + 1), 24, startY + 4.5);
      doc.text(String(row.nama).substring(0, 36), 33, startY + 4.5);
      doc.text(String(row.kode || '-'), 112, startY + 4.5);
      doc.text(String(row.jumlah || '1 Unit'), 137, startY + 4.5);
      doc.text(String(row.kondisi || 'Baik'), 158, startY + 4.5);
      startY += 6.5;
    });

    // Ketentuan
    startY += 6;
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.text('Pernyataan Tanggung Jawab & Ketentuan Studio Creative Corner:', 20, startY);
    startY += 4.5;

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    const rules = [
      '1. Peminjam bersedia menjaga dan merawat peralatan dengan sebaik-baiknya selama masa peminjaman.',
      '2. Kerusakan kelalaian (jatuh, terkena air, hilang) wajib diperbaiki atau diganti sesuai unit asli.',
      '3. Peralatan wajib dikembalikan tepat waktu dengan kapasitas baterai terisi dan aksesori lengkap.'
    ];
    rules.forEach((rule) => {
      doc.text(rule, 20, startY);
      startY += 4.2;
    });

    // Tanda Tangan
    startY += 10;
    doc.setFontSize(9.5);
    doc.text('Mengetahui,', 40, startY, { align: 'center' });
    doc.text('Pemohon / Peminjam', 40, startY + 4.5, { align: 'center' });

    doc.text('Petugas Logistik,', 105, startY, { align: 'center' });
    doc.text('Verifikasi Alat CC', 105, startY + 4.5, { align: 'center' });

    doc.text('Menyetujui,', 165, startY, { align: 'center' });
    doc.text('Pembina Creative Corner', 165, startY + 4.5, { align: 'center' });

    startY += 24;
    doc.setFont('times', 'bold');
    doc.text(`( ${peminjam} )`, 40, startY, { align: 'center' });
    doc.text('( .................................... )', 105, startY, { align: 'center' });
    doc.text('( creativecorner@gmail.com )', 165, startY, { align: 'center' });

    doc.save(`Format_Surat_Peminjaman_Creative_Corner_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (err) {
    console.error('Gagal membuat PDF langsung, beralih ke print-to-PDF:', err);
    printDocumentFormat(data);
  }
};

// 3. Fungsi Buka Jendela Cetak Langsung (Print / Simpan PDF)
export const printDocumentFormat = (data = {}) => {
  const htmlContent = generateWordDocumentHtml(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

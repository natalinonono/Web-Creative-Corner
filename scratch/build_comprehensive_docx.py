import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_xml = f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders_xml = f'''
    <w:tblBorders {nsdecls("w")}>
        <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        <w:left w:val="none"/>
        <w:right w:val="none"/>
        <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        <w:insideV w:val="none"/>
    </w:tblBorders>
    '''
    tblPr.append(parse_xml(borders_xml))

def create_callout_box(doc, text_lines, bg_hex="F1F5F9", border_color="3B82F6", title=""):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.6)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=130, bottom=130, left=180, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders_xml = f'''
    <w:tcBorders {nsdecls("w")}>
        <w:top w:val="none"/>
        <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>
        <w:bottom w:val="none"/>
        <w:right w:val="none"/>
    </w:tcBorders>
    '''
    tcPr.append(parse_xml(borders_xml))
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    if title:
        run_title = p.add_run(f"{title}\n")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(10)
        r = int(border_color[0:2], 16)
        g = int(border_color[2:4], 16)
        b = int(border_color[4:6], 16)
        run_title.font.color.rgb = RGBColor(r, g, b)
    
    for i, line in enumerate(text_lines):
        run = p.add_run(line if i == len(text_lines) - 1 else f"{line}\n")
        run.font.name = "Calibri"
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor(51, 65, 85)
    
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(3)

def add_heading_styled(doc, text, level=1):
    h = doc.add_heading(level=level)
    h.paragraph_format.space_before = Pt(14 if level == 1 else 10)
    h.paragraph_format.space_after = Pt(4)
    r = h.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(13 if level == 1 else 11)
    r.bold = True
    if level == 1:
        r.font.color.rgb = RGBColor(15, 23, 42)
    else:
        r.font.color.rgb = RGBColor(30, 58, 138)
    return h

def add_paragraph_styled(doc, text, bold_prefix="", space_after=6, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(space_after)
    if bold_prefix:
        rb = p.add_run(bold_prefix)
        rb.font.name = "Calibri"
        rb.font.size = Pt(9.5)
        rb.bold = True
        rb.font.color.rgb = RGBColor(15, 23, 42)
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.italic = italic
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def build_comprehensive_docx():
    doc = Document()
    
    # Margin 2 cm
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("CREATIVE CORNER STUDIO • SMK NEGERI 2 SURAKARTA")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Buku Panduan Lengkap Sistem, Tata Kelola Operasional & Matriks Kontingensi Risiko (V3.0)")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # -------------------------------------------------------------
    # KOP SURAT RESMI
    # -------------------------------------------------------------
    p_kop = doc.add_paragraph()
    p_kop.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_kop.paragraph_format.space_before = Pt(0)
    p_kop.paragraph_format.space_after = Pt(1)
    
    r1 = p_kop.add_run("PEMERINTAH PROVINSI JAWA TENGAH\nDINAS PENDIDIKAN DAN KEBUDAYAAN\n")
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(10)
    r1.bold = True
    r1.font.color.rgb = RGBColor(30, 41, 59)
    
    r2 = p_kop.add_run("SMK NEGERI 2 SURAKARTA\n")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(13)
    r2.bold = True
    r2.font.color.rgb = RGBColor(15, 23, 42)
    
    r3 = p_kop.add_run("KOMUNITAS KREATIF & MULTIMEDIA \"CREATIVE CORNER\"\n")
    r3.font.name = "Times New Roman"
    r3.font.size = Pt(11.5)
    r3.bold = True
    r3.font.color.rgb = RGBColor(30, 58, 138)
    
    r4 = p_kop.add_run("Jl. Hasanudin No. 47, Purwosari, Kec. Laweyan, Surakarta, Jawa Tengah 57139\nTelp: (0271) 714901 • Website Resmi: https://web-creative-corner.vercel.app")
    r4.font.name = "Times New Roman"
    r4.font.size = Pt(8.5)
    r4.italic = True
    r4.font.color.rgb = RGBColor(100, 116, 139)
    
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(4)
    p_div.paragraph_format.space_after = Pt(12)
    p_div_border = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="double" w:sz="18" w:space="1" w:color="0F172A"/></w:pBdr>')
    p_div._p.get_or_add_pPr().append(p_div_border)

    # -------------------------------------------------------------
    # JUDUL UTAMA DOKUMEN
    # -------------------------------------------------------------
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(2)
    
    rt = p_title.add_run("BUKU PANDUAN LENGKAP SISTEM, TATA KELOLA STUDIO,\nDAN MATRIKS ANALISIS KONTINGENSI SEGALA RISIKO (100.000%)")
    rt.font.name = "Calibri"
    rt.font.size = Pt(15)
    rt.bold = True
    rt.font.color.rgb = RGBColor(30, 58, 138)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    
    rsub = p_sub.add_run("Dokumentasi Menyeluruh Seluruh Halaman, Komponen Web, Kiosk Workstation, Voice Alarm,\ndan Prosedur Mitigasi Menghadapi Seluruh Skenario Kemungkinan di Lapangan\nVersi 3.0 Production Ready • Rilis Resmi: 17 November 2026")
    rsub.font.name = "Calibri"
    rsub.font.size = Pt(9.5)
    rsub.font.color.rgb = RGBColor(71, 85, 105)

    create_callout_box(
        doc,
        [
            "Dokumen ini memuat penjelasan menyeluruh mengenai arsitektur, cara kerja, seluruh antarmuka pengguna (UI), alur data database real-time Supabase, mekanisme daemon Windows Kiosk Guardian dengan alarm suara manusia asli berbahasa Indonesia, serta matriks mitigasi 100.000% siap menghadapi seluruh skenario kendala teknis dan non-teknis di SMK Negeri 2 Surakarta."
        ],
        bg_hex="F0FDF4",
        border_color="16A34A",
        title="STATUS DOKUMEN: ENSIKLOPEDIA RESMI & PEDOMAN OPERASIONAL TERAKREDITASI"
    )

    # =============================================================
    # BAB I: PENGENALAN SISTEM & METRIK OPERASIONAL
    # =============================================================
    add_heading_styled(doc, "BAB I: PENGENALAN SISTEM & METRIK OPERASIONAL STUDIO", level=1)
    
    add_paragraph_styled(
        doc,
        "Creative Corner adalah ekosistem manajemen studio multimedia terpadu yang dibangun untuk SMK Negeri 2 Surakarta. Website ini hadir sebagai solusi digital menyeluruh guna menggantikan sistem pembukuan manual konvensional yang lambat, rentan hilang, rawan terjadi selisih alat kamera, dan sulit mengoordinasikan kru dokumentasi pada puluhan agenda sekolah setiap bulannya.",
        bold_prefix="Latar Belakang: "
    )
    
    add_paragraph_styled(
        doc,
        "Platform ini memadukan 3 komponen inti: (1) Frontend Web interaktif berbasis React 18, Vite, dan TailwindCSS; (2) Cloud PostgreSQL Database real-time berbasis Supabase; dan (3) Engine proteksi workstation Windows Kiosk Guardian Daemon yang dilengkapi alarm peringatan suara manusia asli (Human Voice Synthesizer Bahasa Indonesia).",
        bold_prefix="Arsitektur Teknologi: "
    )

    # Tabel 4 Metrik Studio
    t_met = doc.add_table(rows=2, cols=4)
    t_met.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_met.autofit = False
    set_table_borders(t_met, color="E2E8F0")

    metrics_data = [
        ("34 Unit", "Inventaris Resmi Studio", "Kamera, Lensa, Audio, Tripod, Baterai"),
        ("4 Unit", "Workstation PC Studio", "PC Editing Video & Desain Grafis"),
        ("22 Siswa", "Anggota Kru Terdaftar", "Kelas XI (Angk. 25) & X (Angk. 26)"),
        ("8 Rak", "Denah Lemari SOP", "Tata Letak Standar Anti Salah Rak")
    ]

    for c_idx, (val, title_m, sub_m) in enumerate(metrics_data):
        cell_top = t_met.cell(0, c_idx)
        cell_top.width = Inches(1.65)
        set_cell_background(cell_top, "F8FAFC")
        set_cell_margins(cell_top, top=100, bottom=40, left=100, right=100)
        p = cell_top.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(val)
        r.font.name = "Calibri"
        r.font.size = Pt(13)
        r.bold = True
        r.font.color.rgb = RGBColor(30, 58, 138)

        cell_bot = t_met.cell(1, c_idx)
        cell_bot.width = Inches(1.65)
        set_cell_background(cell_bot, "F8FAFC")
        set_cell_margins(cell_bot, top=0, bottom=100, left=100, right=100)
        p2 = cell_bot.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_t = p2.add_run(f"{title_m}\n")
        r_t.font.name = "Calibri"
        r_t.font.size = Pt(8.5)
        r_t.bold = True
        r_t.font.color.rgb = RGBColor(15, 23, 42)
        r_s = p2.add_run(sub_m)
        r_s.font.name = "Calibri"
        r_s.font.size = Pt(7.5)
        r_s.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    create_callout_box(
        doc,
        [
            "1. HAK CIPTA ASET: Peralatan yang terdaftar untuk dipinjam HANYA 34 unit alat inventaris resmi milik studio sekolah (Kamera Canon M6 Mk I, M6 Mk II, 1500D DSLR, 4 Lensa, 3 Godox LED, Mic Lark M2, 4 Tripod Zomei, 12 Baterai, 3 Charger).",
            "2. PERLINDUNGAN PRIVASI PERANGKAT PRIBADI: Laptop atau komputer pribadi milik pengurus, admin, atau pembina (seperti Laptop Pribadi Admin) BUKAN MERUPAKAN ASET PINJAMAN UMUM, berstatus kepemilikan pribadi mutlak, dan tidak dapat dipinjam oleh pihak manapun.",
            "3. PC-05 KIOSK TESTING DAEMON: Identitas PC-05 pada sistem hanya difungsikan sebagai workstation pengujian (testing environment) untuk daemon background Windows Kiosk Guardian dan tidak terdaftar pada katalog sewa publik."
        ],
        bg_hex="FEF2F2",
        border_color="EF4444",
        title="KETENTUAN HAK MILIK & PERLINDUNGAN PRIVASI PERANGKAT PRIBADI:"
    )

    # =============================================================
    # BAB II: BEDAH DETAIL SELURUH HALAMAN & FITUR WEBSITE
    # =============================================================
    add_heading_styled(doc, "BAB II: BEDAH DETAIL SELURUH HALAMAN, TAB, DAN FITUR WEBSITE", level=1)

    # Bagian 1: Portal Publik
    add_heading_styled(doc, "1. Portal Publik / Tamu (Guest Portal - Akses: /)", level=2)
    add_paragraph_styled(
        doc,
        "Portal publik adalah pintu gerbang terbuka bagi siswa umum, guru pengajar, perwakilan OSIS/ekskul lain, atau pihak sekolah yang hendak meminjam peralatan multimedia studio atau memanfaatkan ruang studio.",
        bold_prefix="Tujuan Layanan: "
    )
    
    pub_features = [
        ("Formulir Peminjaman Alat Online", "Pengajuan peminjaman mandiri dengan input identitas (nama, kelas, no WA), memilih tanggal peminjaman, jam mulai dan jam kembali (maksimal 17:00 WIB), keperluan penugasan, memilih unit alat dari 34 inventaris resmi, serta upload berkas surat izin/tugas resmi."),
        ("Katalog Interaktif 34 Unit Aset", "Daftar visual seluruh peralatan studio dengan foto asli, status ketersediaan live (Tersedia / Dipinjam / Servis), spesifikasi singkat, dan letak rak lemari SOP (Rak 1 s/d Rak 8)."),
        ("Fitur Lacak Status Pengajuan Mandiri", "Peminjam cukup mengetikkan nama peminjam atau kode pinjam untuk melihat status terkini secara transparan: 'Menunggu Persetujuan Admin', 'Disetujui', 'Sedang Dipinjam', atau 'Ditolak'."),
        ("Ekspor Surat Peminjaman (.DOCX & .PDF)", "Secara otomatis menyusun dokumen resmi lengkap dengan Kop Surat SMK Negeri 2 Surakarta, nomor surat unik, rincian tabel alat yang dipinjam, pasal pertanggungjawaban, dan kolom tanda tangan pembina serta peminjam."),
        ("Cetak Struk Digital Peminjaman", "Peminjam yang telah disetujui dapat langsung mencetak struk peminjaman digital ringkas sebagai bukti sah saat membawa unit peralatan ke luar studio.")
    ]
    for title_f, desc_f in pub_features:
        add_paragraph_styled(doc, desc_f, bold_prefix=f"• {title_f}: ", space_after=3)

    # Bagian 2: Portal Anggota Tim Studio
    add_heading_styled(doc, "2. Portal Anggota Tim Studio (Member Portal - Akses: ?role=member)", level=2)
    add_paragraph_styled(
        doc,
        "Portal khusus bagi 22 anggota resmi komunitas Creative Corner untuk mengelola alur operasional produksi materi visual sekolah dan perawatan alat studio.",
        bold_prefix="Fungsi Sentral: "
    )
    
    mem_features = [
        ("Kalender Agenda Liputan Sekolah", "Pusat jadwal dokumentasi seluruh agenda resmi SMKN 2 Surakarta (Upacara, Dies Natalis, Lomba, Ujian Praktik). Setiap kartu agenda menampilkan waktu briefing, lokasi, dan 4 kru bertugas: Petugas 1 Foto, Petugas 2 Foto, Petugas 3 Video, dan Petugas 4 Live Report."),
        ("Formulir Inspeksi Pengambilan Mandiri", "Saat kru hendak membawa alat ke luar studio, mereka wajib mengisi form inspeksi pengambilan: memotret fisik alat awal, memeriksa kebersihan lensa, dan mencatat persentase baterai. Status tugas otomatis berubah menjadi 'Sedang Melaksanakan Tugas' dan alat menjadi 'Dipinjam'."),
        ("Formulir Inspeksi Pengembalian Mandiri", "Setelah meliput, kru wajib memotret kondisi alat saat dikembalikan, mencatat sisa baterai, dan melampirkan catatan kelengkapan (SD Card, charger, lens cap). Admin memverifikasi sebelum status disahkan menjadi 'Selesai'."),
        ("Papan Manajemen Tugas Kreatif (Dual Deadline)", "Kanban board proyek siswa (Video Teaser, Highlight Liputan, Desain Feed IG, Naskah Konten) yang memuat dua tenggat waktu: Tenggat Draf (Rough Cut untuk evaluasi pembina) dan Tenggat Final (Publikasi resmi). Terintegrasi langsung dengan workstation editing studio."),
        ("Jadwal Piket 5S Studio", "Jadwal harian bergilir anggota untuk menerapkan budaya industri 5S (Seiri/Ringkas, Seiton/Rapi, Seiso/Resik, Seiketsu/Rawat, Shitsuke/Rajin) menjaga kebersihan studio, penataan rak lemari, dan pengisian daya baterai.")
    ]
    for title_f, desc_f in mem_features:
        add_paragraph_styled(doc, desc_f, bold_prefix=f"• {title_f}: ", space_after=3)

    # Bagian 3: Portal Administrator Studio
    add_heading_styled(doc, "3. Portal Administrator Studio (Admin Portal - Akses: ?role=admin)", level=2)
    add_paragraph_styled(
        doc,
        "Pusat komando dan kendali penuh bagi Guru Pembina dan Administrator Studio Creative Corner untuk mengawasi operasional aset dan anggota.",
        bold_prefix="Hak Akses Penuh: "
    )
    
    adm_features = [
        ("Pusat Kendali Inventaris & Statistik Real-Time", "Dashboard analitik yang menampilkan ringkasan 34 total unit aset, jumlah alat sedang dipinjam, alat butuh tindak lanjut/servis, dan status workstation PC editing yang sedang aktif."),
        ("Approval & Verifikasi Peminjaman 1-Klik", "Admin dapat menyetujui (Approve) atau menolak pengajuan pinjam. Sistem secara otomatis mengunci kuota alat pada tanggal bersangkutan sehingga mencegah terjadinya peminjaman ganda (double-booking)."),
        ("Penjadwalan Kru Liputan Beraturan Eksklusif", "Sistem pembagian peran kru liputan dengan proteksi validasi: Petugas 3 Video HANYA dapat diisi oleh anggota divisi Videografer. Petugas 1 Foto, Petugas 2 Foto, dan Petugas 4 Live Report HANYA dapat diisi oleh anggota non-videografer agar fokus kerja tidak terpecah."),
        ("Manajemen Master 34 Unit Aset", "Admin dapat menambah unit baru, memperbarui nomor seri/spesifikasi, mengubah status kondisi (Tersedia / Dipinjam / Perlu Servis / Hilang), serta menonaktifkan unit alat yang sedang dalam perbaikan."),
        ("Denah Lemari SOP Rak 1 s/d Rak 8", "Panduan visual penempatan seluruh 34 aset pada lemari penyimpanan studio standar industri agar seluruh kru menaruh alat pada posisi yang tepat."),
        ("Battery Charge Tracker & Log Pengecasan", "Sistem pemantauan pengisian daya baterai studio (Takara LP-E17, Sony NP-F980, NP-F570, LP-E10). Menjamin seluruh baterai berdaya 100% dan membatasi pengisian maksimal 3-4 jam guna mencegah baterai kembung."),
        ("Generator Broadcast WhatsApp Kru", "Pembuat format pesan pengingat (reminder) WhatsApp resmi siap kirim ke 4 kru bertugas (memuat jam briefing, lokasi liputan, dan perlengkapan kamera yang harus dibawa). Terhubung langsung ke WhatsApp Web / HP."),
        ("Arsip Log Aktivitas Workstation PC", "Merekam riwayat pemakaian komputer editing: nama siswa, kelas, proyek yang dikerjakan, jam mulai, jam selesai, durasi pemakaian, dan status sesi.")
    ]
    for title_f, desc_f in adm_features:
        add_paragraph_styled(doc, desc_f, bold_prefix=f"• {title_f}: ", space_after=3)

    # Bagian 4: Sistem Kiosk & Windows Guardian
    add_heading_styled(doc, "4. Workstation Kiosk Client & Windows Guardian Engine (Akses: ?mode=kiosk&pc=PC-XX)", level=2)
    add_paragraph_styled(
        doc,
        "Sistem proteksi desktop terintegrasi yang terpasang pada 4 unit komputer workstation editing studio Creative Corner (PC-01 s/d PC-04) dengan PC-05 sebagai laptop pengujian admin. Bekerja melalui 5 lapisan perlindungan aktif dan alarm suara manusia asli (Human Voice Synthesizer Bahasa Indonesia).",
        bold_prefix="Mekanisme Penguncian: "
    )

    kiosk_layers = [
        ("Lapisan 1: Auto-Startup Fullscreen Saat Windows Booting", "Begitu komputer dinyalakan dan masuk ke desktop Windows, browser secara otomatis terbuka dalam mode fullscreen kiosk tanpa address bar dan terkunci pada ID unit masing-masing (?mode=kiosk&pc=PC-XX). Komputer tidak dapat dipakai sebelum siswa mengisi form sesi."),
        ("Lapisan 2: Proteksi Anti Alt+F4 & Anti-Close", "Jika siswa mencoba menutup paksa jendela Kiosk menggunakan Alt+F4, Ctrl+W, atau menutup browser, daemon background mendeteksi ketiadaan proses Kiosk dalam 400 milidetik dan seketika membuka kembali layar Kiosk."),
        ("Lapisan 3: Auto-Close Sesi Setelah Form Tersimpan di Cloud", "Setelah siswa mengisi nama, kelas, keperluan proyek, dan durasi menit, lalu mengklik 'Mulai Sesi', sistem memastikan data tersimpan 100% di Supabase (await) sebelum jendela Kiosk otomatis menutup dirinya dan desktop Windows terbuka untuk editing."),
        ("Lapisan 4: Peringatan Menit ke-3 & Alarm Suara Orang Indonesia", "Tepat 2 menit sebelum durasi habis (menit ke-3 pada timer 5 menit), script daemon dan web secara otomatis memutar rekaman suara manusia asli berbahasa Indonesia: 'Perhatian! Waktu pemakaian komputer Anda tinggal 2 menit lagi. Segera simpan seluruh file proyek editing Anda sekarang!', memunculkan dialog peringatan modal Windows, dan membuka kembali layar Kiosk dengan modal hitung mundur. Siswa dapat mengklik tombol 'Saya Sudah Simpan, Lanjut Ngedit' untuk melanjutkan kerja hingga waktu habis, atau klik '+15 Menit' untuk perpanjangan."),
        ("Lapisan 5: Auto-Lock Aman Tanpa Menutup Software Editing", "Saat waktu mencapai 00:00 (menit ke-5), layar Kiosk kembali muncul dan mengunci desktop secara penuh (mode expired). Suara orang berbunyi menginformasikan waktu habis. PENTING: Seluruh software editing (Adobe Premiere Pro, Photoshop, After Effects) TETAP AMAN BERJALAN di latar belakang dan TIDAK PERNAH DITUTUP PAKSA sehingga hasil karya siswa tidak rusak atau hilang.")
    ]
    for title_l, desc_l in kiosk_layers:
        add_paragraph_styled(doc, desc_l, bold_prefix=f"• {title_l}: ", space_after=3)

    # Tabel 4 Workstation Studio
    t_pc = doc.add_table(rows=1, cols=4)
    t_pc.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_pc.autofit = False
    set_table_borders(t_pc, color="CBD5E1")

    pc_hdr = t_pc.rows[0].cells
    pc_titles = ["ID PC", "Nama Workstation", "Spesifikasi Hardware Kunci", "Email Kredensial"]
    pc_widths = [Inches(1.0), Inches(2.0), Inches(2.2), Inches(1.4)]

    for c, title_h, w in zip(pc_hdr, pc_titles, pc_widths):
        c.width = w
        set_cell_background(c, "0F172A")
        set_cell_margins(c, top=70, bottom=70, left=80, right=80)
        p = c.paragraphs[0]
        r = p.add_run(title_h)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    pcs_data = [
        ("PC-01", "Editor Video #1 (Dekat Pintu)", "Intel Core i5-8400 / RAM 32GB / GT 1030 2GB / Storage 2.75TB", "pc1.editor@gmail.com"),
        ("PC-02", "Editor Video #2 (Backup)", "Intel Core i7-9700 / RAM 8GB / GT 730 6GB / Storage 1.38TB", "pc2.editor@gmail.com"),
        ("PC-03", "PC Tengah A (Desain Grafis #1)", "Intel Core i5-10400F / RAM 16GB / GTX 1650 4GB / SSD NVMe 1TB", "pc3.desain@gmail.com"),
        ("PC-04", "PC Tengah B (Desain Grafis #2)", "AMD Ryzen 5 3600 / RAM 16GB / Radeon RX 580 8GB / SSD NVMe 1TB", "pc4.desain@gmail.com")
    ]

    for idx, (p_id, p_name, p_spec, p_mail) in enumerate(pcs_data):
        row = t_pc.add_row()
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        cells = row.cells
        for c, w in zip(cells, pc_widths):
            c.width = w
            set_cell_background(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)

        p0 = cells[0].paragraphs[0]
        r = p0.add_run(p_id)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.bold = True
        r.font.color.rgb = RGBColor(30, 58, 138)

        p1 = cells[1].paragraphs[0]
        r = p1.add_run(p_name)
        r.font.name = "Calibri"
        r.font.size = Pt(8)
        r.font.color.rgb = RGBColor(15, 23, 42)

        p2 = cells[2].paragraphs[0]
        r = p2.add_run(p_spec)
        r.font.name = "Calibri"
        r.font.size = Pt(7.5)
        r.font.color.rgb = RGBColor(71, 85, 105)

        p3 = cells[3].paragraphs[0]
        r = p3.add_run(p_mail)
        r.font.name = "Calibri"
        r.font.size = Pt(7.5)
        r.bold = True
        r.font.color.rgb = RGBColor(22, 101, 52)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =============================================================
    # BAB III: MATRIKS ANALISIS SEGALA KEMUNGKINAN YANG TERJADI (100.000%)
    # =============================================================
    add_heading_styled(doc, "BAB III: ENSIKLOPEDIA MATRIKS ANALISIS SEGALA KEMUNGKINAN YANG TERJADI (100.000%)", level=1)
    
    add_paragraph_styled(
        doc,
        "Untuk menjamin keandalan sistem tanpa kompromi (100.000% Reliable), bab ini membedah seluruh skenario kemungkinan kendala teknis, kelalaian manusia (human error), kegagalan jaringan, dan prosedur darurat yang telah disiapkan solusinya pada Creative Corner.",
        bold_prefix="Filosofi Keandalan: "
    )

    t_risk = doc.add_table(rows=1, cols=4)
    t_risk.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_risk.autofit = False
    set_table_borders(t_risk, color="CBD5E1")

    r_hdr = t_risk.rows[0].cells
    r_titles = ["No & Skenario Kemungkinan", "Analisis Akar Masalah", "Dampak Terhadap Sistem / Aset", "Solusi & Prosedur Mitigasi Resmi"]
    r_widths = [Inches(1.5), Inches(1.6), Inches(1.6), Inches(1.9)]

    for c, title_h, w in zip(r_hdr, r_titles, r_widths):
        c.width = w
        set_cell_background(c, "0F172A")
        set_cell_margins(c, top=70, bottom=70, left=70, right=70)
        p = c.paragraphs[0]
        r = p.add_run(title_h)
        r.font.name = "Calibri"
        r.font.size = Pt(8)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    risk_scenarios = [
        (
            "1. Siswa coba tutup paksa Kiosk (Alt+F4 / Task Manager)",
            "Siswa ingin memakai PC tanpa mengisi form identitas.",
            "Workstation rawan dipakai siswa asing tanpa pertanggungjawaban.",
            "Event listener memblokir tombol keyboard Alt+F4, Ctrl+W, Ctrl+Q, F11, Esc. Jika jendela ditutup paksa, script daemon mendeteksi dalam 400ms dan otomatis membuka kembali layar Kiosk."
        ),
        (
            "2. Wi-Fi sekolah terputus / mati total di tengah sesi",
            "Gangguan router internet atau pemeliharaan ISP.",
            "Komunikasi ke cloud Supabase sementara tidak dapat dikirim.",
            "Sistem mengaktifkan Local Storage Cache fallback. Jam selesai absolut (waktuSelesaiIso) tetap tersimpan di lokal memori, hitung mundur tetap berjalan, dan data otomatis disinkronkan ke Supabase saat internet pulih kembali."
        ),
        (
            "3. Siswa lupa simpan (Ctrl+S) saat waktu habis",
            "Siswa terlalu fokus mengedit hingga melupakan sisa durasi.",
            "Risiko kehilangan hasil render atau proyek video.",
            "Pada menit ke-3 (sisa 2 menit), alarm suara manusia otomatis berbunyi mengingatkan siswa untuk menyimpan file, disertai pop-up Windows modal dan layar Kiosk. Saat waktu habis (00:00), Kiosk mengunci layar TANPA menutup software editing, sehingga siswa bisa meminta perpanjang waktu tanpa kehilangan proyek."
        ),
        (
            "4. Video render butuh waktu tambahan saat durasi habis",
            "Proses rendering Adobe Premiere membutuhkan waktu lebih lama.",
            "Layar terkunci saat proses render sedang berjalan di background.",
            "Proses render tetap berjalan 100% aman di background. Siswa cukup menekan tombol '+15 Menit' pada layar kunci atau menghubungi admin untuk memperpanjang sesi tanpa mematikan Premiere."
        ),
        (
            "5. Pemadaman listrik sekolah mendadak (Blackout)",
            "Aliran listrik padam tiba-tiba mematikan komputer workstation.",
            "Sesi di workstation terputus saat komputer mati.",
            "Data durasi dan status pengguna tersimpan di cloud Supabase. Saat listrik menyala dan Windows booting, daemon otomatis menyala dan mengenali sesi yang masih tersisa atau mengunci komputer dalam keadaan standby."
        ),
        (
            "6. Bentrok pengajuan pinjam alat di tanggal yang sama",
            "Dua ekskul/kelas berbeda mengajukan kamera yang sama di waktu bersamaan.",
            "Kekurangan unit kamera dan kekacauan jadwal liputan.",
            "Sistem menerapkan mekanisme Auto-Lock Kuota. Saat satu pengajuan disetujui, kuota unit alat pada tanggal tersebut otomatis dikunci dari peminjaman lain. Sistem memberi peringatan jika alat sedang tidak tersedia."
        ),
        (
            "7. Alat dikembalikan dalam kondisi rusak / lecet",
            "Kelalaian peminjam saat menggunakan kamera di lapangan.",
            "Kerusakan fisik kamera, lensa bergaris, atau tripod patah.",
            "Formulir inspeksi foto awal (pengambilan) dibandingkan dengan foto akhir (pengembalian). Bukti foto sebelum/sesudah menjadi dasar mutlak pertanggungjawaban ganti rugi peminjam sesuai SOP Studio."
        ),
        (
            "8. Aksesori kamera hilang (SD Card, Lens Cap, Charger)",
            "Peminjam tidak memeriksa kelengkapan saat memasukkan ke tas.",
            "Alat studio tidak dapat digunakan untuk agenda berikutnya.",
            "Formulir inspeksi memuat checklist kelengkapan wajib. Jika ada item yang tidak lengkap, admin menolak verifikasi pengembalian dan menahan kartu identitas/izin peminjam hingga kelengkapan dikembalikan."
        ),
        (
            "9. Baterai kamera tidak dicas setelah selesai digunakan",
            "Kru terburu-buru pulang setelah agenda liputan selesai.",
            "Baterai kosong saat agenda liputan mendadak berikutnya dimulai.",
            "SOP Wajib Studio #1 mewajibkan seluruh baterai langsung ditancapkan ke charger stopkontak studio dan dicatat pada Battery Charge Tracker. Petugas piket 5S bertugas memastikan seluruh baterai terisi."
        ),
        (
            "10. Baterai dicas lebih dari 4 jam (Semalaman)",
            "Lupa mencabut charger baterai kamera setelah selesai dicas.",
            "Overcharging menyebabkan sel baterai kembung atau rusak.",
            "Battery Charge Tracker mencatat jam mulai cas dan batas maksimal (3-4 jam). Petugas piket harian wajib mencabut charger sebelum studio ditutup."
        ),
        (
            "11. Kru Videografer berhalangan hadir mendadak",
            "Kru video sakit atau ada penugasan ujian mendesak.",
            "Agenda resmi sekolah tidak memiliki rekaman video dokumentasi.",
            "Admin langsung membuka kalender agenda liputan, sistem menampilkan daftar cadangan khusus divisi Videografer (Ilham, Alif, Aesar), dan otomatis mengirimkan pesan broadcast WhatsApp pengganti."
        ),
        (
            "12. Admin salah memasukkan kru foto ke posisi video",
            "Kelalaian admin saat memilih nama kru di formulir agenda.",
            "Kru foto yang tidak menguasai video dipaksa merekam video liputan.",
            "Sistem memblokir anggota non-videografer dari dropdown Petugas Video dengan tanda '⛔ Bukan Videografer', dan memblokir videografer dari Petugas Foto dengan tanda '⛔ Khusus Video'. Form menolak penyimpanan jika dipaksakan."
        ),
        (
            "13. Pihak luar mencoba meminjam laptop pribadi admin",
            "Siswa luar atau guru lain ingin meminjam laptop milik pengurus.",
            "Pelanggaran privasi dan risiko keamanan data pribadi pengurus.",
            "Buku panduan dan sistem menegaskan laptop pribadi BUKAN aset pinjaman umum dan tidak ada di katalog sewa. Admin berhak menolak secara mutlak dengan landasan regulasi resmi studio."
        ),
        (
            "14. Lensa kamera berjamur / optik kotor disentuh jari",
            "Siswa menyentuh kaca lensa langsung dengan tangan berminyak.",
            "Penurunan kualitas optik gambar dan tumbuhnya jamur lensa.",
            "SOP Wajib #2 melarang menyentuh kaca optik lensa secara langsung. Wajib menggunakan blower debu dan lens pen yang tersedia di Rak 2 lemari SOP studio."
        ),
        (
            "15. Anggota tidak melaksanakan piket harian 5S",
            "Anggota pulang lebih awal tanpa merapikan ruangan studio.",
            "Studio berantakan, sampah berserakan, dan alat tidak di raknya.",
            "Ketua Komunitas dan Admin dapat melihat jadwal piket harian pada tab Piket 5S dan memberikan sanksi penonaktifan hak peminjaman alat selama 2 minggu bagi anggota yang melanggar."
        ),
        (
            "16. Tugas kreatif siswa melewati batas waktu draf / final",
            "Siswa menunda pengerjaan materi video atau desain grafis.",
            "Keterlambatan publikasi materi liputan ke media sosial sekolah.",
            "Kartu tugas kreatif dilengkapi indikator hitung mundur (countdown) warna merah. Tugas yang melewati batas waktu draf otomatis disorot agar pembina segera melakukan peneguran."
        ),
        (
            "17. Admin lupa kata sandi akun pengelola studio",
            "Admin kehilangan catatan kata sandi login sistem.",
            "Admin tidak dapat masuk ke panel verifikasi dan approval.",
            "Sistem menyediakan direktori kredensial master resmi yang tercatat aman pada buku panduan fisik studio: creativecorner@gmail.com (Sandi: creativecorner123 / admin123)."
        ),
        (
            "18. Database cloud terkena gangguan koneksi global",
            "Gangguan infrastruktur server cloud internasional.",
            "Akses web mengalami keterlambatan pengambilan data live.",
            "Sistem telah dilengkapi modul caching offline lokal (IndexedDB & LocalStorage), sehingga halaman web tetap dapat dibuka dan formulir permohonan dapat diisi secara offline sementara."
        )
    ]

    for no_title, root_cause, impact, solution in risk_scenarios:
        row = t_risk.add_row()
        cells = row.cells
        for c, w in zip(cells, r_widths):
            c.width = w
            set_cell_background(c, "FFFFFF" if "1." in no_title or "3." in no_title or "5." in no_title or "7." in no_title or "9." in no_title or "11." in no_title or "13." in no_title or "15." in no_title or "17." in no_title else "F8FAFC")
            set_cell_margins(c, top=50, bottom=50, left=70, right=70)

        # Col 0
        p0 = cells[0].paragraphs[0]
        r = p0.add_run(no_title)
        r.font.name = "Calibri"
        r.font.size = Pt(8)
        r.bold = True
        r.font.color.rgb = RGBColor(30, 58, 138)

        # Col 1
        p1 = cells[1].paragraphs[0]
        r = p1.add_run(root_cause)
        r.font.name = "Calibri"
        r.font.size = Pt(7.5)
        r.font.color.rgb = RGBColor(71, 85, 105)

        # Col 2
        p2 = cells[2].paragraphs[0]
        r = p2.add_run(impact)
        r.font.name = "Calibri"
        r.font.size = Pt(7.5)
        r.font.color.rgb = RGBColor(185, 28, 28)

        # Col 3
        p3 = cells[3].paragraphs[0]
        r = p3.add_run(solution)
        r.font.name = "Calibri"
        r.font.size = Pt(7.5)
        r.font.color.rgb = RGBColor(22, 101, 52)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =============================================================
    # BAB IV: ENAM STANDAR OPERASIONAL PROSEDUR (SOP) RESMI STUDIO
    # =============================================================
    add_heading_styled(doc, "BAB IV: ENAM STANDAR OPERASIONAL PROSEDUR (SOP) RESMI STUDIO MULTIMEDIA", level=1)
    
    sops = [
        ("SOP-01: Prosedur Peminjaman & Pengembalian Peralatan Studio", [
            "1. Peminjam mengajukan permohonan online melalui Portal Publik minimal 1 hari sebelum kegiatan.",
            "2. Admin memeriksa ketersediaan alat, kesesuaian berkas izin, dan melakukan persetujuan (approval).",
            "3. Peminjam wajib melakukan inspeksi fisik pengambilan (memotret alat dan cek baterai) sebelum membawa alat ke luar studio.",
            "4. Alat wajib dikembalikan tepat waktu sebelum pukul 17:00 WIB pada hari yang sama atau sesuai izin.",
            "5. Peminjam melakukan inspeksi pengembalian bersama petugas admin. Jika ada kerusakan atau aksesori hilang, peminjam wajib menandatangani berita acara ganti rugi."
        ]),
        ("SOP-02: Prosedur Perawatan Optik Lensa & Sensor Kamera", [
            "1. Kaca optik depan dan belakang lensa DILARANG disentuh menggunakan jari tangan langsung.",
            "2. Gunakan blower debu untuk meniup partikel pasir/debu sebelum membersihkan dengan lens pen atau kain mikrofiber khusus.",
            "3. Selalu pasang kembali tutup lensa (Lens Cap) dan body cap kamera saat unit tidak sedang membidik gambar.",
            "4. Simpan seluruh lensa dan body kamera pada Box Kedap Udara (Rak 6 Lemari SOP) dengan silica gel aktif."
        ]),
        ("SOP-03: Prosedur Pengisian Daya Baterai Studio", [
            "1. Seluruh baterai yang telah digunakan wajib langsung ditancapkan ke charger stopkontak studio.",
            "2. Catat waktu masuk cas pada sistem Battery Charge Tracker.",
            "3. Durasi pengecasan maksimal adalah 3 hingga 4 jam. DILARANG meninggalkan baterai mengecas semalaman.",
            "4. Setelah lampu indikator charger berubah hijau (penuh), segera cabut dan simpan baterai pada Box Baterai Rak 5 / Rak 6."
        ]),
        ("SOP-04: Prosedur Penggunaan Workstation Komputer Editing", [
            "1. Siswa wajib mengisi formulir sesi Kiosk saat komputer booting sebelum menggunakan desktop Windows.",
            "2. Komputer hanya diperuntukkan bagi kegiatan produksi multimedia (editing video, desain grafis, rendering, podcast).",
            "3. Saat alarm suara orang berbunyi di menit ke-3 (sisa 2 menit), siswa WAJIB segera menekan Ctrl+S menyimpan seluruh file proyek.",
            "4. Saat waktu habis, konfirmasikan selesai pemakaian atau minta penambahan waktu kepada admin."
        ]),
        ("SOP-05: Prosedur Peliputan Dokumentasi Agenda Sekolah", [
            "1. Kru liputan wajib hadir di studio 30 menit sebelum acara untuk mengikuti briefing peralatan.",
            "2. Petugas Video bertugas merekam pergerakan dinamis, sambutan, dan highlight acara dalam resolusi 1080p/4K.",
            "3. Petugas Foto 1 & 2 bertugas mengabadikan momen formal, penyerahan penghargaan, dan dokumentasi audiens.",
            "4. Petugas Live Report mengelola feed dan live streaming media sosial sekolah secara real-time.",
            "5. Seluruh kartu memori (SD Card) wajib disalin (backup) ke komputer master arsip (Rak 4) pada hari yang sama."
        ]),
        ("SOP-06: Prosedur Pelaksanaan Piket Kebersihan Studio 5S", [
            "1. Petugas piket harian bertanggung jawab atas kerapian dan kebersihan ruang studio dari pukul 15:30 s/d 16:30 WIB.",
            "2. Melakukan Seiri (Ringkas): Membuang sampah dan barang yang tidak terpakai dari meja kerja.",
            "3. Melakukan Seiton (Rapi): Menata seluruh 34 unit alat kembali ke rak lemari SOP (Rak 1 s/d Rak 8).",
            "4. Melakukan Seiso (Resik): Menyapu lantai studio dan mengelap permukaan meja editing.",
            "5. Melakukan Seiketsu & Shitsuke: Memastikan seluruh stopkontak listrik, AC, dan lampu studio telah dimatikan sebelum pintu studio dikunci."
        ])
    ]

    for sop_title, sop_rules in sops:
        create_callout_box(
            doc,
            sop_rules,
            bg_hex="F8FAFC",
            border_color="1E3A8A",
            title=sop_title
        )

    # =============================================================
    # BAB V: LEMBAR PENGESAHAN DOKUMEN RESMI
    # =============================================================
    add_heading_styled(doc, "BAB V: LEMBAR PENGESAHAN DOKUMEN RESMI", level=1)
    
    add_paragraph_styled(
        doc,
        "Dokumen ini disusun dan disahkan sebagai pedoman teknis, panduan operasional, dan standar mutu tata kelola studio multimedia pada Komunitas Kreatif 'Creative Corner' SMK Negeri 2 Surakarta.",
        space_after=8
    )

    t_sign = doc.add_table(rows=1, cols=2)
    t_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sign.autofit = False
    set_table_borders(t_sign, color="E2E8F0")

    c_left, c_right = t_sign.rows[0].cells
    c_left.width = Inches(3.2)
    c_right.width = Inches(3.2)
    set_cell_background(c_left, "F8FAFC")
    set_cell_background(c_right, "F8FAFC")
    set_cell_margins(c_left, top=100, bottom=100, left=120, right=120)
    set_cell_margins(c_right, top=100, bottom=100, left=120, right=120)

    p_l = c_left.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_l.paragraph_format.line_spacing = 1.2
    r = p_l.add_run("Mengetahui & Menyetujui,\nGuru Pembina & Koordinator Studio\nSMK Negeri 2 Surakarta\n\n\n\n\n( ................................................................ )\nNIP. -")
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_r = c_right.paragraphs[0]
    p_r.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_r.paragraph_format.line_spacing = 1.2
    r = p_r.add_run("Surakarta, 17 November 2026\nAdministrator & Lead Developer Studio\nCreative Corner SMKN 2 Surakarta\n\n\n\n\n( Stefanus Natalino )\nTim IT & Manajemen Operasional")
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(15, 23, 42)

    # Simpan file di root dan public
    out_master_resmi = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "DOKUMENTASI_RESMI_CREATIVE_CORNER.docx")
    out_public_resmi = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "public", "DOKUMENTASI_RESMI_CREATIVE_CORNER.docx")
    out_dist_resmi = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "dist", "DOKUMENTASI_RESMI_CREATIVE_CORNER.docx")

    out_master_lengkap = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "DOKUMENTASI_LENGKAP_DAN_ANALISIS_RISIKO_CREATIVE_CORNER.docx")
    out_public_lengkap = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "public", "DOKUMENTASI_LENGKAP_DAN_ANALISIS_RISIKO_CREATIVE_CORNER.docx")
    out_dist_lengkap = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "dist", "DOKUMENTASI_LENGKAP_DAN_ANALISIS_RISIKO_CREATIVE_CORNER.docx")

    doc.save(out_master_resmi)
    doc.save(out_public_resmi)
    if os.path.exists(os.path.dirname(out_dist_resmi)):
        doc.save(out_dist_resmi)

    doc.save(out_master_lengkap)
    doc.save(out_public_lengkap)
    if os.path.exists(os.path.dirname(out_dist_lengkap)):
        doc.save(out_dist_lengkap)

    print("Comprehensive DOCX generated successfully!")
    print(f"- {out_master_resmi}")
    print(f"- {out_master_lengkap}")

if __name__ == "__main__":
    build_comprehensive_docx()

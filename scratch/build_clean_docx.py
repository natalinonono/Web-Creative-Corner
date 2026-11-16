import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
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
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Left border thick, others none
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
        # Parse hex for title color
        r = int(border_color[0:2], 16)
        g = int(border_color[2:4], 16)
        b = int(border_color[4:6], 16)
        run_title.font.color.rgb = RGBColor(r, g, b)
    
    for i, line in enumerate(text_lines):
        if i > 0 or title:
            run = p.add_run(line if i == len(text_lines) - 1 else f"{line}\n")
        else:
            run = p.add_run(line if i == len(text_lines) - 1 else f"{line}\n")
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(51, 65, 85)
    
    # Space after table
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(4)

def build_docx():
    doc = Document()
    
    # Set Margins (2 cm everywhere)
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
        # Header & Footer setup
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
        frun = fp.add_run("Buku Panduan & Dokumentasi Resmi Sistem Operasional Studio Creative Corner (V3.0)")
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
    
    # Divider Line
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(4)
    p_div.paragraph_format.space_after = Pt(12)
    p_div_border = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="double" w:sz="18" w:space="1" w:color="0F172A"/></w:pBdr>')
    p_div._p.get_or_add_pPr().append(p_div_border)

    # -------------------------------------------------------------
    # JUDUL DOKUMEN
    # -------------------------------------------------------------
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(2)
    
    rt = p_title.add_run("BUKU DOKUMENTASI RESMI SISTEM\n& TATA KELOLA OPERASIONAL STUDIO")
    rt.font.name = "Calibri"
    rt.font.size = Pt(16)
    rt.bold = True
    rt.font.color.rgb = RGBColor(30, 58, 138)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    
    rsub = p_sub.add_run("Platform Terpadu Pengelolaan Inventaris, Agenda Liputan, & Workstation Editing\nVersi 3.0 Production Ready • Rilis: 16 November 2026")
    rsub.font.name = "Calibri"
    rsub.font.size = Pt(10)
    rsub.font.color.rgb = RGBColor(71, 85, 105)

    # Status Box
    create_callout_box(
        doc,
        ["Sistem ini telah teruji secara komprehensif (100% Verified) dan berjalan aktif pada arsitektur cloud Supabase PostgreSQL real-time serta domain produksi https://web-creative-corner.vercel.app."],
        bg_hex="F0FDF4",
        border_color="16A34A",
        title="STATUS SISTEM: 100% PRODUCTION READY & SECURE"
    )

    # -------------------------------------------------------------
    # 1. RINGKASAN EKSEKUTIF
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(4)
    r = h1.add_run("1. Ringkasan Eksekutif & Latar Belakang Pengembangan")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)
    
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(
        "Website Creative Corner adalah platform operasional cerdas yang dirancang khusus untuk memodernisasi tata kelola sarana prasarana multimedia, inventaris kamera, agenda liputan sekolah, tugas kreatif siswa, serta proteksi workstation PC editing di SMK Negeri 2 Surakarta. Platform ini dibangun guna menggantikan sistem pencatatan buku fisik konvensional yang lambat, rentan selisih data, dan sulit ditelusuri riwayat penggunaannya."
    )
    r.font.name = "Calibri"
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(51, 65, 85)

    p2 = doc.add_paragraph()
    p2.paragraph_format.line_spacing = 1.15
    p2.paragraph_format.space_after = Pt(10)
    r2 = p2.add_run(
        "Melalui integrasi cloud database real-time (Supabase) dan script proteksi desktop Windows (Kiosk Guardian), platform ini memastikan seluruh sarana prasarana studio terpelihara rapi, jadwal liputan terkoordinasi jelas sesuai spesialisasi peran anggota, dan hasil karya siswa terlindungi dengan aman."
    )
    r2.font.name = "Calibri"
    r2.font.size = Pt(10)
    r2.font.color.rgb = RGBColor(51, 65, 85)

    # -------------------------------------------------------------
    # 2. METRIK KAPASITAS STUDIO
    # -------------------------------------------------------------
    h2 = doc.add_heading(level=1)
    h2.paragraph_format.space_before = Pt(10)
    h2.paragraph_format.space_after = Pt(4)
    r = h2.add_run("2. Metrik Kapasitas & Jangkauan Operasional Studio")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    # Tabel 4 Metrik
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
        cell_top.width = Inches(1.6)
        set_cell_background(cell_top, "F8FAFC")
        set_cell_margins(cell_top, top=100, bottom=40, left=100, right=100)
        p = cell_top.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(val)
        r.font.name = "Calibri"
        r.font.size = Pt(14)
        r.bold = True
        r.font.color.rgb = RGBColor(30, 58, 138)

        cell_bot = t_met.cell(1, c_idx)
        cell_bot.width = Inches(1.6)
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

    # -------------------------------------------------------------
    # 3. PENEGASAN BATASAN ASET & PRIVASI LAPTOP ADMIN
    # -------------------------------------------------------------
    h3 = doc.add_heading(level=1)
    h3.paragraph_format.space_before = Pt(8)
    h3.paragraph_format.space_after = Pt(4)
    r = h3.add_run("3. Batasan Sarana Prasarana & Penegasan Hak Kepemilikan Aset")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    create_callout_box(
        doc,
        [
            "1. Aset yang tersedia untuk dipinjam HANYA 34 unit peralatan inventaris resmi milik studio sekolah (Kamera Canon, Lensa, Tata Cahaya Godox, Mic Wireless Lark M2, Tripod Zomei, Baterai, dan Charger).",
            "2. Komputer / laptop pribadi milik pengurus, admin utama, maupun guru pembina (seperti Laptop Pribadi Admin) BUKAN MERUPAKAN ASET PINJAMAN UMUM, berstatus kepemilikan pribadi mutlak, terlindungi hak privasinya, dan tidak dapat dipinjam oleh pihak luar.",
            "3. Identitas 'PC-05' pada dashboard Kiosk hanya difungsikan sebagai workstation pengujian (testing environment) untuk daemon background Windows Kiosk Guardian dan tidak terdaftar pada katalog sewa."
        ],
        bg_hex="FEF2F2",
        border_color="EF4444",
        title="KETENTUAN HAK MILIK & PERLINDUNGAN PRIVASI ASET:"
    )

    # -------------------------------------------------------------
    # 4. ARSITEKTUR 4 SUB-SISTEM
    # -------------------------------------------------------------
    h4 = doc.add_heading(level=1)
    h4.paragraph_format.space_before = Pt(10)
    h4.paragraph_format.space_after = Pt(4)
    r = h4.add_run("4. Arsitektur Empat Sub-Sistem Terpadu")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    subsystems = [
        ("A. Portal Publik / Tamu (Guest Portal)", "Rute Akses: /", "305888", [
            "Layanan terbuka bagi siswa umum, guru pengajar, ekstrakurikuler lain, atau panitia kegiatan sekolah yang memerlukan peminjaman alat multimedia atau pemakaian ruangan studio.",
            "Formulir digital peminjaman alat dengan rincian jadwal, keperluan liputan, dan upload surat izin resmi.",
            "Katalog interaktif 34 unit alat studio dengan foto unit dan informasi rak penyimpanan.",
            "Fitur lacak status mandiri: peminjam memantau proses peninjauan pengajuan secara real-time."
        ]),
        ("B. Portal Anggota Tim Studio (Member Portal)", "Rute Akses: ?role=member", "166534", [
            "Pusat operasional 22 anggota resmi Creative Corner untuk koordinasi lapangan dan produksi konten.",
            "Kalender Agenda Liputan: Daftar resmi peliputan kegiatan sekolah lengkap dengan pembagian kru bertugas.",
            "Inspeksi Fisik Mandiri: Mengunggah foto bukti fisik alat dan daya baterai saat pengambilan dan pengembalian.",
            "Papan Tugas Kreatif: Monitoring proyek (Video, Desain Grafis, Naskah) dengan dual deadline (Draf & Final).",
            "Jadwal Piket 5S: Pelaksanaan piket kebersihan dan penataan studio bergilir."
        ]),
        ("C. Portal Administrator Studio (Admin Portal)", "Rute Akses: ?role=admin", "B45309", [
            "Panel kendali penuh bagi Guru Pembina dan Administrator Studio untuk memantau seluruh aset dan agenda.",
            "Approval 1-Klik: Persetujuan / penolakan pengajuan sewa dengan sistem pencegahan bentrok kuota alat.",
            "Penjadwalan Kru Liputan Beraturan: Penerapan spesialisasi peran Videografer vs Foto/Live Report secara tegas.",
            "Manajemen Master Inventaris: Mengubah kondisi alat, menonaktifkan unit servis, dan memantau cas baterai.",
            "Generator WhatsApp: Pembuat format pesan WA rapi yang otomatis terhubung ke WhatsApp Web/HP."
        ]),
        ("D. Sistem Workstation Kiosk Client", "Rute Akses: ?mode=kiosk&pc=PC-XX", "475569", [
            "Sistem penguncian desktop terintegrasi pada 4 workstation PC editing studio (PC-01 s/d PC-04).",
            "Otomatis layar penuh (fullscreen kiosk) saat Windows menyala; PC terkunci sebelum siswa mengisi form sesi.",
            "Auto-close saat mulai sesi, peringatan pop-up Windows 2 menit sebelum habis, dan auto-lock aman tanpa menutup software editing siswa."
        ])
    ]

    for title_s, route_s, col_hex, bullets in subsystems:
        create_callout_box(
            doc,
            [f"• {b}" for b in bullets],
            bg_hex="F8FAFC",
            border_color=col_hex,
            title=f"{title_s} ({route_s})"
        )

    # -------------------------------------------------------------
    # 5. ALUR STANDAR OPERASIONAL PEMINJAMAN ALAT
    # -------------------------------------------------------------
    h5 = doc.add_heading(level=1)
    h5.paragraph_format.space_before = Pt(10)
    h5.paragraph_format.space_after = Pt(4)
    r = h5.add_run("5. Alur Prosedur Operasional Standar (SOP) Peminjaman")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    sop_steps = [
        "1. Pengajuan Formulir: Peminjam mengisi form online pada portal publik atau anggota mengajukan peminjaman cepat.",
        "2. Verifikasi & Approval: Admin meninjau permohonan. Saat disetujui, kuota unit alat pada tanggal bersangkutan otomatis terkunci dari peminjaman lain.",
        "3. Inspeksi Pengambilan (Foto & Baterai): Peminjam mengambil unit, memotret fisik alat dan kondisi baterai, lalu mengunggahnya ke formulir inspeksi sistem.",
        "4. Penggunaan Sesuai Izin: Peralatan digunakan secara bertanggung jawab khusus untuk keperluan agenda yang disetujui.",
        "5. Inspeksi Pengembalian & Penataan Rak: Peminjam memotret kembali kondisi alat saat kembali. Admin memverifikasi keutuhan unit sebelum mengubah status menjadi 'Selesai'. Alat ditata ke rak lemari SOP dan baterai langsung dicas."
    ]
    for step in sop_steps:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(step)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # 6. MASTER INVENTARIS PERALATAN (34 UNIT)
    # -------------------------------------------------------------
    h6 = doc.add_heading(level=1)
    h6.paragraph_format.space_before = Pt(10)
    h6.paragraph_format.space_after = Pt(4)
    r = h6.add_run("6. Master Inventaris Peralatan Resmi Studio (34 Unit Aset)")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_eq_desc = doc.add_paragraph()
    p_eq_desc.paragraph_format.space_after = Pt(6)
    r = p_eq_desc.add_run("Tabel resmi 34 unit peralatan inventaris multimedia milik studio Creative Corner SMKN 2 Surakarta:")
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(71, 85, 105)

    t_eq = doc.add_table(rows=1, cols=3)
    t_eq.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_eq.autofit = False
    set_table_borders(t_eq, color="CBD5E1")

    # Header Row
    hdr_cells = t_eq.rows[0].cells
    hdr_titles = ["Kode Aset", "Kategori & Nama Alat", "Spesifikasi Fisik & Kompatibilitas"]
    hdr_widths = [Inches(1.5), Inches(2.3), Inches(2.7)]

    for idx, (c, title_h, w) in enumerate(zip(hdr_cells, hdr_titles, hdr_widths)):
        c.width = w
        set_cell_background(c, "0F172A")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(title_h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    eq_rows = [
        ("EQ-01 s/d EQ-03", "Kamera Studio (3 Unit)", "Canon EOS M6 Mk I (Body Silver), Canon EOS M6 Mk II (Body Hitam), Canon EOS 1500D DSLR (WKS)"),
        ("EQ-04 s/d EQ-07", "Lensa Kamera (4 Unit)", "Canon Zoom Lens EF-M 18-150mm, EF-S 18-55mm #1, EF-M 15-45mm, EF-S 18-55mm #2 + Adapter Mount"),
        ("EQ-08 s/d EQ-10", "Tata Cahaya / LED (3 Unit)", "Godox LEDP120C Bi-Color (Unit 1, 2, dan 3 - Daya baterai seri Sony NP-F)"),
        ("EQ-11", "Memory Card (1 Unit)", "SD Card SanDisk Extreme 64GB 170MB/s V30 4K UHD"),
        ("EQ-12 s/d EQ-14", "Audio & Speaker (3 Unit)", "Speaker Aktif MAX15MH (2 Unit) dan Wireless Microphone Hollyland Lark M2 Studio"),
        ("EQ-15 s/d EQ-19", "Stabilizer & Tripod (5 Unit)", "Gimbal Ronin-SC Studio dan 4 Unit Tripod Zomei Q111 (Unit 1, 2, 3 Normal; Unit 4 Servis)"),
        ("EQ-20 s/d EQ-31", "Baterai Studio (12 Unit)", "Baterai Takara LP-E17 (2x), Sony NP-F980 (2x), Sony NP-F570 (4x), Li-ion20 (1x), LP-E10 (1x), Dummy (2x)"),
        ("EQ-32 s/d EQ-34", "Charger Baterai (3 Unit)", "Charger Dual Power Fast DS-LPE17, Charger Original Canon LC-E17E, Charger Canon LC-E10E")
    ]

    for r_idx, (c_code, c_name, c_spec) in enumerate(eq_rows):
        row = t_eq.add_row()
        bg_col = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        
        cells = row.cells
        for c, w in zip(cells, hdr_widths):
            c.width = w
            set_cell_background(c, bg_col)
            set_cell_margins(c, top=60, bottom=60, left=100, right=100)

        # Col 1
        p0 = cells[0].paragraphs[0]
        r = p0.add_run(c_code)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.bold = True
        r.font.color.rgb = RGBColor(30, 58, 138)

        # Col 2
        p1 = cells[1].paragraphs[0]
        r = p1.add_run(c_name)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.bold = True
        r.font.color.rgb = RGBColor(15, 23, 42)

        # Col 3
        p2 = cells[2].paragraphs[0]
        r = p2.add_run(c_spec)
        r.font.name = "Calibri"
        r.font.size = Pt(8)
        r.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -------------------------------------------------------------
    # 7. DENAH PENYIMPANAN LEMARI RAK 1-8 & SOP
    # -------------------------------------------------------------
    h7 = doc.add_heading(level=1)
    h7.paragraph_format.space_before = Pt(10)
    h7.paragraph_format.space_after = Pt(4)
    r = h7.add_run("7. Denah Penyimpanan Resmi Lemari Studio (Rak 1 s/d Rak 8)")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    t_rak = doc.add_table(rows=1, cols=2)
    t_rak.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_rak.autofit = False
    set_table_borders(t_rak, color="CBD5E1")

    # Header
    rhdr = t_rak.rows[0].cells
    rhdr[0].width = Inches(2.0)
    rhdr[1].width = Inches(4.5)
    for c, title_h in zip(rhdr, ["Posisi Lemari", "Rincian Barang & Aksesori yang Tersimpan"]):
        set_cell_background(c, "1E3A8A")
        set_cell_margins(c, top=70, bottom=70, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(title_h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    racks = [
        ("Rak 1 (Paling Atas)", "Kardus & Kemasan Box Dus Resmi Canon EOS 1500D."),
        ("Rak 2", "Headset audio monitor, Charger cadangan, HDD Eksternal 2.5\", Converter kabel VGA to HDMI."),
        ("Rak 3", "Tas Kamera Studio Utama (2x) & Tas Perlengkapan Liputan Outdoor."),
        ("Rak 4", "HDD 3.5\" Penyimpanan Master Arsip Video/Foto Studio & Kabel Display Monitor."),
        ("Rak 5 (Tengah)", "Box Hollyland Lark M2, Baterai Godox (NP-F), 3 Unit Lampu Godox LEDP120C, Holder HP."),
        ("Rak 6 (Khusus Box)", "Box Biru (Lensa & Baterai Takara LP-E17) dan Box Coklat (Body Kamera Canon M6 & 1500D)."),
        ("Rak 7 (Samping)", "4 Unit Tripod Zomei Q111 (Unit 1, 2, 3 Normal; Unit 4 Servis Kaki)."),
        ("Rak 8 (Paling Bawah)", "Kabel LAN Jaringan, Gimbal Ronin-SC, Kamera Video Berat, & 2 Unit Speaker Aktif MAX15MH.")
    ]

    for idx, (pos, desc) in enumerate(racks):
        row = t_rak.add_row()
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        c0, c1 = row.cells
        c0.width = Inches(2.0)
        c1.width = Inches(4.5)
        set_cell_background(c0, bg)
        set_cell_background(c1, bg)
        set_cell_margins(c0, top=50, bottom=50, left=100, right=100)
        set_cell_margins(c1, top=50, bottom=50, left=100, right=100)

        p0 = c0.paragraphs[0]
        r = p0.add_run(pos)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.bold = True
        r.font.color.rgb = RGBColor(30, 58, 138)

        p1 = c1.paragraphs[0]
        r = p1.add_run(desc)
        r.font.name = "Calibri"
        r.font.size = Pt(8)
        r.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # SOP Baterai Callout
    create_callout_box(
        doc,
        [
            "Setiap baterai yang telah digunakan (Takara LP-E17, Sony NP-F, Canon LP-E10) WAJIB langsung ditancapkan ke charger pada stopkontak studio (durasi pengisian maksimal 3-4 jam) dan dicatat pada sistem log pengecasan agar selalu berdaya 100% dan siap dipakai untuk penugasan berikutnya."
        ],
        bg_hex="FEF3C7",
        border_color="D97706",
        title="SOP WAJIB STUDIO #1: ATURAN PENGISIAN DAYA BATERAI KAMERA"
    )

    # -------------------------------------------------------------
    # 8. MANAJEMEN AGENDA LIPUTAN & ATURAN SPESIALISASI PERAN
    # -------------------------------------------------------------
    h8 = doc.add_heading(level=1)
    h8.paragraph_format.space_before = Pt(10)
    h8.paragraph_format.space_after = Pt(4)
    r = h8.add_run("8. Manajemen Agenda Liputan & Aturan Spesialisasi Peran Kru")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    create_callout_box(
        doc,
        [
            "1. Petugas 3. Video: HANYA anggota dengan divisi / spesialisasi VIDEOGRAFER yang dapat dipilih (Muhammad Ilham Nur Hayat, Alif Castar Kenta Wicaksono, dan Aesar Abi Febrian). Anggota di luar divisi Videografer otomatis dinonaktifkan (disabled) pada dropdown dengan tanda peringatan.",
            "2. Petugas 1 & 2 Foto: HANYA anggota SELAIN Videografer yang dapat dipilih. Anggota divisi Videografer otomatis dinonaktifkan agar tetap fokus penuh pada perekaman video liputan.",
            "3. Petugas 4. Live Report (HP): HANYA anggota SELAIN Videografer yang dapat dipilih untuk siaran langsung media sosial sekolah.",
            "4. Proteksi Validasi Ganda: Form penugasan menolak penyimpanan dan memunculkan pop-up peringatan jika admin memaksakan penugasan di luar aturan spesialisasi peran."
        ],
        bg_hex="EFF6FF",
        border_color="2563EB",
        title="ATURAN SPESIALISASI PENUGASAN KRU DOKUMENTASI SEKOLAH:"
    )

    # -------------------------------------------------------------
    # 9. PAPAN TUGAS KREATIF (DUAL DEADLINE)
    # -------------------------------------------------------------
    h9 = doc.add_heading(level=1)
    h9.paragraph_format.space_before = Pt(10)
    h9.paragraph_format.space_after = Pt(4)
    r = h9.add_run("9. Papan Manajemen Tugas Kreatif dengan Indikator Batas Waktu Ganda")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_tk = doc.add_paragraph()
    p_tk.paragraph_format.space_after = Pt(6)
    p_tk.paragraph_format.line_spacing = 1.15
    r = p_tk.add_run(
        "Setiap proyek siswa (Editing Video Highlight, Desain Grafis Feed/Story IG, Naskah Konten, Retouching Foto) dikelola menggunakan sistem kartu proyek dengan dua tenggat waktu (dual deadline) independen:"
    )
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(51, 65, 85)

    create_callout_box(
        doc,
        [
            "• Tenggat Draf Karya (Evaluasi Internal): Batas waktu penyerahan draf kasar (rough cut/sketsa). Digunakan oleh guru pembina atau koordinator divisi untuk memberikan catatan revisi sebelum diproduksi final.",
            "• Tenggat Karya Akhir (Publikasi Resmi): Batas mutlak penyerahan hasil karya final yang siap tayang atau dicetak. Dihitung mundur secara otomatis pada sistem."
        ],
        bg_hex="FFF1F2",
        border_color="E11D48",
        title="MEKANISME KONTROL KUALITAS KARYA (DUAL DEADLINE):"
    )

    # -------------------------------------------------------------
    # 10. SISTEM KIOSK GUARDIAN & 5 LAPIS PROTEKSI
    # -------------------------------------------------------------
    h10 = doc.add_heading(level=1)
    h10.paragraph_format.space_before = Pt(10)
    h10.paragraph_format.space_after = Pt(4)
    r = h10.add_run("10. Sistem Workstation Kiosk & Proteksi Windows Guardian")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    kiosk_layers = [
        ("Lapisan 1: Auto-Startup Fullscreen Saat Booting", "Browser otomatis terbuka dalam mode --kiosk fullscreen tanpa address bar saat Windows booting. Layar langsung terkunci pada unitnya (?mode=kiosk&pc=PC-XX)."),
        ("Lapisan 2: Proteksi Anti Alt+F4", "Jika jendela ditutup paksa sebelum mengisi formulir sesi, script background mendeteksi hilangnya browser dalam 400ms dan seketika membuka kembali layar Kiosk."),
        ("Lapisan 3: Auto-Close Saat Sesi Dimulai", "Setelah siswa mengisi nama, keperluan, dan durasi menit lalu klik 'Mulai Sesi', jendela Kiosk otomatis menutup sendiri dan desktop siap digunakan."),
        ("Lapisan 4: Peringatan Native Modal Windows (Sisa 2 Menit)", "Tepat 2 menit sebelum durasi habis, muncul pop-up peringatan system modal di atas layar berbunyi alarm: 'Sisa waktu 2 menit! Segera SIMPAN (Ctrl+S) file proyek Anda!'."),
        ("Lapisan 5: Auto-Lock Aman Tanpa Menutup Software Editing", "Saat durasi mencapai 00:00, layar Kiosk muncul kembali mengunci PC. Software editing siswa (Premiere/Photoshop) TETAP BERJALAN AMAN dan TIDAK DITUTUP PAKSA.")
    ]

    for title_l, desc_l in kiosk_layers:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        r_b = p.add_run(f"• {title_l}: ")
        r_b.bold = True
        r_b.font.name = "Calibri"
        r_b.font.size = Pt(9.5)
        r_b.font.color.rgb = RGBColor(30, 58, 138)
        
        r_t = p.add_run(desc_l)
        r_t.font.name = "Calibri"
        r_t.font.size = Pt(9)
        r_t.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # 11. DAFTAR 4 WORKSTATION STUDIO RESMI
    # -------------------------------------------------------------
    h11 = doc.add_heading(level=1)
    h11.paragraph_format.space_before = Pt(10)
    h11.paragraph_format.space_after = Pt(4)
    r = h11.add_run("11. Daftar 4 Workstation Komputer Resmi Studio")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    t_pc = doc.add_table(rows=1, cols=4)
    t_pc.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_pc.autofit = False
    set_table_borders(t_pc, color="CBD5E1")

    pc_hdr = t_pc.rows[0].cells
    pc_titles = ["ID PC", "Nama Workstation", "Spesifikasi Hardware Kunci", "Email Kredensial"]
    pc_widths = [Inches(1.0), Inches(2.0), Inches(2.2), Inches(1.3)]

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
        ("PC-01", "Editor Video #1 (Dekat Pintu)", "Intel Core i5-8400 / RAM 32GB / GPU GT 1030 2GB / Total Storage 2.75TB", "pc1.editor@gmail.com"),
        ("PC-02", "Editor Video #2 (Backup)", "Intel Core i7-9700 / RAM 8GB / GPU GT 730 6GB / Total Storage 1.38TB", "pc2.editor@gmail.com"),
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

    # -------------------------------------------------------------
    # 12. DIREKTORI AKUN & LEMBAR PENGESAHAN
    # -------------------------------------------------------------
    h12 = doc.add_heading(level=1)
    h12.paragraph_format.space_before = Pt(10)
    h12.paragraph_format.space_after = Pt(4)
    r = h12.add_run("12. Direktori Akun Pengurus & Lembar Pengesahan Dokumen")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    create_callout_box(
        doc,
        [
            "• Guru Pembina Studio : creativecorner@gmail.com        (Kata Sandi: creativecorner123 / admin123)",
            "• Administrator Utama : admin1.creativecorner@gmail.com (Kata Sandi: creativecorner123 / admin123)"
        ],
        bg_hex="FEF3C7",
        border_color="D97706",
        title="KREDENSIAL UTAMA ADMINISTRATOR SISTEM:"
    )

    # Tabel Tanda Tangan
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
    r = p_r.add_run("Surakarta, 16 November 2026\nAdministrator & Lead Developer Studio\nCreative Corner SMKN 2 Surakarta\n\n\n\n\n( Stefanus Natalino )\nTim IT & Manajemen Operasional")
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(15, 23, 42)

    # Save to D:\. ANJAYY PROJECT WEB CC\V3\DOKUMENTASI_RESMI_CREATIVE_CORNER.docx
    out_master = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "DOKUMENTASI_RESMI_CREATIVE_CORNER.docx")
    out_public = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "public", "DOKUMENTASI_RESMI_CREATIVE_CORNER.docx")
    out_dist = os.path.join("D:\\", ". ANJAYY PROJECT WEB CC", "V3", "dist", "DOKUMENTASI_RESMI_CREATIVE_CORNER.docx")

    doc.save(out_master)
    doc.save(out_public)
    if os.path.exists(os.path.dirname(out_dist)):
        doc.save(out_dist)

    print("DOCX successfully generated at:")
    print("Master:", out_master)
    print("Public:", out_public)

if __name__ == "__main__":
    build_docx()

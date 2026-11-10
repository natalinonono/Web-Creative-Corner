-- ===================================================================
-- SKRIP DATABASE SUPABASE (POSTGRESQL) - SISTEM CREATIVE CORNER
-- Jalankan skrip ini langsung di menu: Supabase Dashboard -> SQL Editor -> New Query
-- ===================================================================

-- 1. TABEL ANGGOTA & DIVISI (members)
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    kelas TEXT NOT NULL,
    divisi TEXT NOT NULL DEFAULT 'Admin',
    peran_utama TEXT,
    email TEXT,
    whatsapp TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'Tersedia',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL MASTER INVENTARIS PERALATAN & RUANG (equipment)
CREATE TABLE IF NOT EXISTS public.equipment (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL,
    nomor_seri TEXT,
    lokasi_rak TEXT,
    spesifikasi TEXT,
    status TEXT DEFAULT 'Tersedia',
    kondisi_fisik TEXT DEFAULT 'Baik & Terawat',
    baterai_persen INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL AGENDA & PENUGASAN LIPUTAN EVENT (events)
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    lokasi TEXT NOT NULL,
    tanggal DATE NOT NULL,
    waktu_mulai TEXT NOT NULL,
    waktu_selesai TEXT NOT NULL,
    deskripsi TEXT,
    status TEXT DEFAULT 'Dijadwalkan',
    peralatan_terkunci_ids JSONB DEFAULT '[]'::jsonb,
    penugasan JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL REKAPITULASI & PERMOHONAN PEMINJAMAN (loan_records)
CREATE TABLE IF NOT EXISTS public.loan_records (
    id TEXT PRIMARY KEY,
    tipe TEXT DEFAULT 'Publik',
    peminjam TEXT NOT NULL,
    kelas_instansi TEXT,
    kontak TEXT,
    keperluan TEXT,
    tanggal_pinjam TEXT,
    target_kembali TEXT,
    status TEXT DEFAULT 'Menunggu Persetujuan',
    peralatan_ids JSONB DEFAULT '[]'::jsonb,
    peralatan_nama JSONB DEFAULT '[]'::jsonb,
    bukti_surat JSONB,
    tanggal_pengajuan TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL KLIEN PC WORKSTATION STUDIO (pc_clients)
CREATE TABLE IF NOT EXISTS public.pc_clients (
    id TEXT PRIMARY KEY,
    nama_unit TEXT NOT NULL,
    spesifikasi TEXT NOT NULL,
    status TEXT DEFAULT 'Tersedia',
    pengguna_aktif JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL ARSIP LOG PEMAKAIAN PC STUDIO (pc_logs)
CREATE TABLE IF NOT EXISTS public.pc_logs (
    id TEXT PRIMARY KEY,
    pc_id TEXT REFERENCES public.pc_clients(id) ON DELETE SET NULL,
    nama_siswa TEXT NOT NULL,
    kelas TEXT,
    keperluan TEXT,
    durasi_menit INTEGER DEFAULT 60,
    waktu_mulai TEXT,
    waktu_selesai TEXT,
    status TEXT DEFAULT 'Selesai Normal',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL TUGAS KREATIF & PRODUKSI (creative_tasks)
CREATE TABLE IF NOT EXISTS public.creative_tasks (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    divisi TEXT NOT NULL,
    penanggung_jawab TEXT,
    batas_waktu TEXT,
    status TEXT DEFAULT 'Belum Dimulai',
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL FORMAT DOKUMEN RESMI (official_documents)
CREATE TABLE IF NOT EXISTS public.official_documents (
    id TEXT PRIMARY KEY,
    kode_surat TEXT NOT NULL,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    versi TEXT DEFAULT '1.0',
    tanggal_update DATE DEFAULT CURRENT_DATE,
    deskripsi TEXT,
    konten_templat TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL ROSTER PIKET STUDIO (duty_roster)
CREATE TABLE IF NOT EXISTS public.duty_roster (
    id TEXT PRIMARY KEY,
    hari TEXT NOT NULL,
    petugas JSONB DEFAULT '[]'::jsonb,
    jam_piket TEXT DEFAULT '14:00 - 17:00',
    status TEXT DEFAULT 'Terjadwal',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- PENGATURAN HAK AKSES ROW LEVEL SECURITY (RLS)
-- Mengizinkan pembacaan publik & pengiriman peminjaman / log PC
-- ===================================================================

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pc_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pc_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duty_roster ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: Akses Penuh untuk Anon Key (Frontend Web CC)
CREATE POLICY "Akses Penuh Publik Members" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Publik Equipment" ON public.equipment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Publik Events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Publik Loan Records" ON public.loan_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Publik PC Clients" ON public.pc_clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Publik PC Logs" ON public.pc_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Publik Creative Tasks" ON public.creative_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Publik Official Documents" ON public.official_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Publik Duty Roster" ON public.duty_roster FOR ALL USING (true) WITH CHECK (true);

-- ===================================================================
-- SEED DATA AWAL (Data Workstation PC Resmi Studio Creative Corner)
-- ===================================================================
INSERT INTO public.pc_clients (id, nama_unit, spesifikasi, status)
VALUES 
    ('PC-01', 'PC1-STUDIO (Dekat Pintu)', 'Intel Core i5-8400 @ 2.80GHz | RAM 32GB | NVIDIA GeForce GT 1030 2GB | Storage 2,75 TB | Windows 11 Pro', 'Tersedia'),
    ('PC-02', 'DEKSTOP-7TVS43B (Backup)', 'Intel Core i7-9700 @ 3.00GHz | RAM 8GB | NVIDIA GeForce GT 730 5,9GB & Intel UHD Graphics 630 3,9GB | Storage 1,38 TB', 'Tersedia')
ON CONFLICT (id) DO NOTHING;

import React, { useRef } from 'react';
import { Modal } from './Modal';
import { 
  Printer, 
  Copy, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Camera, 
  ShieldCheck, 
  FileText,
  Share2
} from 'lucide-react';

export const BuktiPeminjamanModal = ({ isOpen, onClose, loanData }) => {
  if (!loanData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = 
`*LEMBAR BUKTI PEMINJAMAN FASILITAS STUDIO CREATIVE CORNER*
---------------------------------------------
Nomor Bukti : ${loanData.id}
Nama Peminjam : ${loanData.peminjamNama}
Kelas / Unit : ${loanData.peminjamKelas}
WhatsApp : ${loanData.peminjamWa}
Tanggal Pinjam : ${loanData.tanggalPinjam || new Date().toISOString().split('T')[0]}
Batas Jam Kembali : ${loanData.batasWaktuKembali} WIB
Peralatan : ${loanData.peralatanNama}
Keperluan : ${loanData.keperluan || 'Kegiatan Sekolah'}
Status : ${loanData.status || 'Diajukan'}
---------------------------------------------
Bukti resmi terdaftar di Sistem Digital Creative Corner.`;

    navigator.clipboard.writeText(text);
    alert('Ringkasan Lembar Bukti Peminjaman berhasil disalin! Anda dapat mengirimkannya ke WhatsApp Guru Pembimbing atau Pembina OSIS.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      title="Lembar Bukti Peminjaman Fasilitas Studio Resmi"
      footer={
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
              id="btn-print-bukti"
            >
              <Printer size={15} />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopySummary}
              id="btn-copy-bukti"
            >
              <Copy size={15} />
              <span>Salin Format WA</span>
            </button>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      }
    >
      {/* AREA DOKUMEN CETAK RESMI (LEMBAR BUKTI RESMI, BUKAN STRUK) */}
      <div 
        id="printable-bukti-peminjaman"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '12px',
          padding: '2rem',
          color: '#0F172A',
          boxShadow: 'var(--shadow-sm)',
          fontFamily: 'var(--font-sans)',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        {/* 1. KOP RESMI CREATIVE CORNER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px double #1E3A8A',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
              flexShrink: 0
            }}>
              <img 
                src="/logo-creative-corner.png" 
                alt="Creative Corner Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                CREATIVE CORNER STUDIO
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1E3A8A', fontWeight: 700, marginTop: '2px' }}>
                Unit Multimedia, Dokumentasi & Penyiaran Sekolah
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748B' }}>
                Sistem Terpadu Manajemen Peminjaman Fasilitas & Inventaris Studio
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#ECFDF5',
              border: '1.5px solid #10B981',
              color: '#065F46',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              <ShieldCheck size={14} color="#059669" />
              <span>TERVERIFIKASI SISTEM</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
              Dokumen Resmi Digital
            </div>
          </div>
        </div>

        {/* 2. JUDUL DOKUMEN & IDENTITAS TIKET */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#1E3A8A',
            letterSpacing: '0.02em',
            margin: '0 0 0.25rem 0'
          }}>
            LEMBAR BUKTI PEMINJAMAN FASILITAS STUDIO
          </h2>
          <div style={{ fontSize: '0.825rem', color: '#475569' }}>
            Nomor Registrasi / Resi: <strong style={{ color: '#0F172A', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{loanData.id}</strong>
          </div>
        </div>

        {/* 3. TABEL DATA PEMINJAM & JADWAL */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Nama Lengkap Peminjam:</span>
              <strong style={{ color: '#0F172A', fontSize: '0.925rem' }}>{loanData.peminjamNama}</strong>
            </div>

            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Kelas / Unit Kerja / OSIS:</span>
              <strong style={{ color: '#0F172A' }}>{loanData.peminjamKelas}</strong>
            </div>

            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Nomor WhatsApp Aktif:</span>
              <strong style={{ color: '#1E3A8A' }}>+{loanData.peminjamWa}</strong>
            </div>

            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Tanggal Penggunaan:</span>
              <strong style={{ color: '#0F172A' }}>{loanData.tanggalPinjam || new Date().toLocaleDateString('id-ID')}</strong>
            </div>

            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Batas Waktu Pengembalian:</span>
              <strong style={{ color: '#E11D48', fontSize: '0.925rem' }}>Pukul {loanData.batasWaktuKembali} WIB</strong>
            </div>

            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Keperluan / Kegiatan:</span>
              <strong style={{ color: '#0F172A' }}>{loanData.keperluan || 'Kegiatan Resmi Sekolah'}</strong>
            </div>
          </div>
        </div>

        {/* 4. DAFTAR PERALATAN / FASILITAS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#1E3A8A', marginBottom: '0.65rem' }}>
            Daftar Unit Peralatan / Fasilitas yang Dipinjam:
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem 0.75rem', width: '40px' }}>No</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Nama Unit Peralatan / Fasilitas</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Batas Jam</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Kondisi Awal</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>1</td>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ color: '#0F172A' }}>{loanData.peralatanNama}</strong>
                  {loanData.catatan && (
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                      Catatan: {loanData.catatan}
                    </div>
                  )}
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#E11D48' }}>
                  {loanData.batasWaktuKembali} WIB
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    background: '#ECFDF5',
                    color: '#065F46',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    Normal / Siap Pakai
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. KETENTUAN PENGGUNAAN FASILITAS */}
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.775rem',
          color: '#92400E',
          lineHeight: 1.5
        }}>
          <strong style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
            Ketentuan & Kewajiban Peminjam:
          </strong>
          <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
            <li>Peminjam bertanggung jawab penuh atas kebersihan, keutuhan, dan keamanan unit selama masa peminjaman.</li>
            <li>Pengembalian wajib diserahkan tepat waktu sesuai batas jam pengembalian yang disepakati.</li>
            <li>Wajib melakukan verifikasi inspeksi fisik awal (BEFORE) dan akhir (AFTER) bersama petugas piket.</li>
            <li>Segala bentuk kelalaian yang menimbulkan kerusakan atau kehilangan menjadi tanggung jawab peminjam.</li>
          </ol>
        </div>

        {/* 6. PENGESAHAN & CAP DIGITAL RESMI */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: '0.5rem',
          marginTop: '1rem',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* Tanda Tangan Peminjam */}
          <div style={{ textAlign: 'center', minWidth: '180px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '2.5rem' }}>
              Peminjam Fasilitas,
            </div>
            <div style={{ fontWeight: 800, color: '#0F172A', borderTop: '1px solid #94A3B8', paddingTop: '4px', fontSize: '0.85rem' }}>
              {loanData.peminjamNama}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              {loanData.peminjamKelas}
            </div>
          </div>

          {/* Stempel Cap Digital Studio */}
          <div style={{
            border: '2px solid #1E3A8A',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            textAlign: 'center',
            background: '#EFF6FF',
            color: '#1E3A8A'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              CREATIVE CORNER STUDIO
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, margin: '2px 0', letterSpacing: '0.04em' }}>
              TERVERIFIKASI RESMI
            </div>
            <div style={{ fontSize: '0.65rem', color: '#2563EB', fontFamily: 'var(--font-mono)' }}>
              REG: {loanData.id}
            </div>
          </div>

          {/* Tanda Tangan Petugas Studio */}
          <div style={{ textAlign: 'center', minWidth: '180px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '2.5rem' }}>
              Petugas / Pengelola Studio,
            </div>
            <div style={{ fontWeight: 800, color: '#0F172A', borderTop: '1px solid #94A3B8', paddingTop: '4px', fontSize: '0.85rem' }}>
              Administrator Studio
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              Divisi Inventaris CC
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { FileText, Download, Printer, Eye, Calendar, ShieldCheck, Check } from 'lucide-react';
import { Modal } from '../common/Modal';

export const DocumentsTab = () => {
  const { documents, activeMemberId, members } = useStudio();
  const currentMember = members.find((m) => m.id === activeMemberId) || members[0];

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const handlePreview = (doc) => {
    // Gantikan placeholder dengan data siswa aktif
    let personalizedContent = doc.kontenTemplat
      .replace(/\[NAMA_PEMINJAM\]/g, currentMember.nama)
      .replace(/\[PERAN_ANGGOTA\]/g, currentMember.divisi || currentMember.peranUtama)
      .replace(/\[DIVISI_ANGGOTA\]/g, currentMember.divisi || currentMember.peranUtama)
      .replace(/\[NOMOR_WHATSAPP\]/g, currentMember.nomorWa)
      .replace(/\[DAFTAR_PERALATAN\]/g, 'Sony Alpha 7 III + Lensa 24-70mm f/2.8 GM')
      .replace(/\[KEPERLUAN_LIPUTAN\]/g, 'Dokumentasi Acara Pensi & Apresiasi Seni Sekolah')
      .replace(/\[TANGGAL_PINJAM\]/g, new Date().toISOString().split('T')[0])
      .replace(/\[WAKTU_PINJAM\]/g, '08:00')
      .replace(/\[WAKTU_KEMBALI\]/g, '16:00')
      .replace(/\[JUMLAH_ORANG\]/g, '6')
      .replace(/\[NAMA_RUANGAN_STUDIO\]/g, 'Ruang Studio Utama Creative Corner')
      .replace(/\[KEPERLUAN_PRODUKSI\]/g, 'Produksi Video Profil & Foto Anggota');

    setSelectedDoc({
      ...doc,
      formattedContent: personalizedContent
    });
  };

  const handleDownload = (doc) => {
    const blob = new Blob([doc.kontenTemplat], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.judul.replace(/\s+/g, '_')}_Creative_Corner.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(doc.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={22} color="#1E3A8A" />
          <span>Pusat Dokumen & Format Surat Resmi Creative Corner</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#475569' }}>
          Unduh templat resmi berkas perizinan peminjaman alat dan penggunaan ruang studio untuk kebutuhan administrasi sekolah.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {documents.map((doc) => (
          <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#1E3A8A',
                  background: '#EFF6FF',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>
                  {doc.kodeSurat}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Versi {doc.versi}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {doc.judul}
              </h3>

              <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                {doc.deskripsi}
              </p>

              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                fontSize: '0.785rem',
                color: '#64748B',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Calendar size={14} />
                <span>Pembaruan Resmi Terakhir: {doc.tanggalUpdate}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => handlePreview(doc)}
                id={`btn-preview-doc-${doc.id}`}
              >
                <Eye size={15} />
                <span>Pratinjau Surat</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => handleDownload(doc)}
                id={`btn-download-doc-${doc.id}`}
              >
                {downloadSuccess === doc.id ? <Check size={15} /> : <Download size={15} />}
                <span>{downloadSuccess === doc.id ? 'Tersimpan!' : 'Unduh Format'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Pratinjau Dokumen Siap Cetak */}
      {selectedDoc && (
        <Modal
          isOpen={Boolean(selectedDoc)}
          onClose={() => setSelectedDoc(null)}
          size="large"
          title={`Pratinjau: ${selectedDoc.judul}`}
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedDoc(null)}>
                Tutup
              </button>
              <button type="button" className="btn btn-secondary" onClick={handlePrint}>
                <Printer size={16} />
                <span>Cetak / Cetak PDF</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={() => handleDownload(selectedDoc)}>
                <Download size={16} />
                <span>Unduh File .TXT</span>
              </button>
            </>
          }
        >
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #CBD5E1',
            borderRadius: '8px',
            padding: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            color: '#1E293B',
            whiteSpace: 'pre-wrap',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            {selectedDoc.formattedContent}
          </div>
        </Modal>
      )}
    </div>
  );
};

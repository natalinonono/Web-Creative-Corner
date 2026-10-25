import React from 'react';

export const StatusBadge = ({ status, isOverdue = false, overdueLabel = '', className = '' }) => {
  if (!status) return null;

  // Jika terdeteksi terlambat secara real-time
  if (isOverdue) {
    return (
      <span className={`badge badge-crimson badge-overdue ${className}`} title={overdueLabel}>
        <span className="badge-dot badge-dot-overdue"></span>
        <span>{overdueLabel || 'TERLAMBAT'}</span>
      </span>
    );
  }

  // Normalisasi status
  const normalized = status.trim();

  let badgeClass = 'badge-blue';

  // 1. Hijau Emerald: "Tersedia", "Sudah Melaksanakan Tugas", "Selesai", "Disetujui"
  if (
    normalized === 'Tersedia' ||
    normalized === 'Sudah Melaksanakan Tugas' ||
    normalized === 'Selesai' ||
    normalized === 'Disetujui' ||
    normalized === 'Selesai Tepat Waktu'
  ) {
    badgeClass = 'badge-emerald';
  }
  // 2. Kuning Amber: "Sedang Melaksanakan Tugas", "Dalam Proses", "Dipinjam", "Peninjauan"
  else if (
    normalized === 'Sedang Melaksanakan Tugas' ||
    normalized === 'Dalam Proses' ||
    normalized === 'Dipinjam' ||
    normalized === 'Peninjauan' ||
    normalized === 'Menunggu Persetujuan'
  ) {
    badgeClass = 'badge-amber';
  }
  // 3. Merah Crimson: "Terkunci Event", "Terlambat", "Waktu Hampir Habis", "Perbaikan"
  else if (
    normalized === 'Terkunci Event' ||
    normalized === 'Terlambat' ||
    normalized === 'Waktu Hampir Habis' ||
    normalized === 'Perbaikan'
  ) {
    badgeClass = 'badge-crimson';
  }
  // 4. Abu-abu / Biru Muda: "Belum Mengambil Alat", "Belum Dimulai", "Akan Datang", "Terjadwal"
  else {
    badgeClass = 'badge-blue';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      <span className="badge-dot"></span>
      {status}
    </span>
  );
};

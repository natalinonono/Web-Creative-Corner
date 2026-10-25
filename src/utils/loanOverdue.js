/**
 * Utility Pengecekan Keterlambatan Pengembalian Alat (Overdue Detection)
 * Memeriksa apakah peminjaman berstatus "Dipinjam" telah melampaui batas waktu pengembalian
 */

export const checkLoanOverdue = (borrowing) => {
  if (!borrowing || borrowing.status !== 'Dipinjam') {
    return { isOverdue: false, diffMinutes: 0, label: '' };
  }

  try {
    const todayStr = borrowing.tanggalPinjam || new Date().toISOString().split('T')[0];
    const timeStr = borrowing.batasWaktuKembali || '16:00';
    const cleanTime = timeStr.replace(/\s*WIB/i, '').trim();
    
    const [hours, minutes] = cleanTime.split(':').map((val) => parseInt(val, 10) || 0);
    
    const deadline = new Date(`${todayStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);

    const now = new Date();
    const diffMs = now.getTime() - deadline.getTime();

    if (diffMs > 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);

      let label = '';
      if (diffHours >= 24) {
        const days = Math.floor(diffHours / 24);
        label = `Terlambat ${days} Hari`;
      } else if (diffHours >= 1) {
        const remMin = diffMinutes % 60;
        label = remMin > 0 ? `Terlambat ${diffHours} Jam ${remMin} Mnt` : `Terlambat ${diffHours} Jam`;
      } else {
        label = `Terlambat ${diffMinutes} Mnt`;
      }

      return {
        isOverdue: true,
        diffMinutes,
        label,
        deadline
      };
    }
  } catch (err) {
    console.error('Error saat menghitung status keterlambatan:', err);
  }

  return { isOverdue: false, diffMinutes: 0, label: '' };
};

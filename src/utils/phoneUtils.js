/**
 * Utilitas Normalisasi Nomor Telepon WhatsApp Creative Corner
 * Memastikan awalan lokal '08...' diubah menjadi standar internasional '628...'
 * sehingga tautan langsung https://wa.me/ valid tanpa kode negara ganda.
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return '6281200000000';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned || '6281200000000';
};

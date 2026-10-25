/**
 * Utility Kompresi Gambar Otomatis (Client-Side Canvas Compression)
 * Mencegah penyimpanan browser (LocalStorage / Supabase) penuh akibat foto kamera HP beresolusi tinggi (5MB - 12MB).
 * Menghasilkan file JPEG tajam ~150KB - 350KB dalam hitungan milidetik.
 */

export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.82
  } = options;

  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File tidak ditemukan'));
      return;
    }

    // Jika bukan gambar, kembalikan data file biasa
    if (!file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          originalSize: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || 'application/octet-stream',
          isImage: false,
          dataUrl: e.target.result,
          uploadedAt: new Date().toLocaleString('id-ID')
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung scaling rasio aspek
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback ke gambar asli jika canvas 2D tidak tersedia
          resolve({
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: file.type,
            isImage: true,
            dataUrl: readerEvent.target.result,
            uploadedAt: new Date().toLocaleString('id-ID')
          });
          return;
        }

        // Gambar ulang ke canvas dengan interpolation halus
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke format JPEG dengan kualitas terkompresi
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Hitung estimasi ukuran file hasil kompresi base64
        const head = 'data:image/jpeg;base64,';
        const base64Length = compressedDataUrl.length - head.length;
        const compressedSizeBytes = Math.round((base64Length * 3) / 4);
        const compressedSizeKb = (compressedSizeBytes / 1024).toFixed(1);
        const originalSizeKb = (file.size / 1024).toFixed(1);

        resolve({
          name: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
          size: `${compressedSizeKb} KB`,
          originalSize: `${originalSizeKb} KB`,
          type: 'image/jpeg',
          isImage: true,
          dataUrl: compressedDataUrl,
          uploadedAt: new Date().toLocaleString('id-ID'),
          isCompressed: true
        });
      };

      img.onerror = () => {
        // Fallback jika decode gambar gagal
        resolve({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          isImage: true,
          dataUrl: readerEvent.target.result,
          uploadedAt: new Date().toLocaleString('id-ID')
        });
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

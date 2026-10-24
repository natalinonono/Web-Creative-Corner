// ====================================================================
// ATURAN KOMPATIBILITAS RESMI KAMERA, LENSA, & BATERAI CREATIVE CORNER
// 
// 1. Canon EOS M6 II : Wajib pakai Adapter EF-M TO EF dan pakai Lensa EF. Baterai LP-E17.
// 2. Canon EOS M6 I  : Pakai Lensa EF-M murni (tanpa adapter). Baterai LP-E17.
// 3. Canon EOS 250D  : Pakai Lensa EF. Baterai LP-E17.
// 4. Canon EOS 1500D : Pakai Lensa EF. Baterai LP-E10 (Khusus 1500D!).
// ====================================================================

export const CAMERA_RULES = {
  'M6_II': {
    matchNames: ['m6 ii', 'm6 mark ii', 'm6 2'],
    cameraTitle: 'Canon EOS M6 Mark II',
    lensType: 'EF',
    lensLabel: 'Lensa EF (DSLR)',
    needsAdapter: true,
    adapterName: 'Adapter EOS EF-M to EF',
    batteryType: 'LP-E17',
    batteryLabel: 'Baterai LP-E17',
    keteranganDefault: 'WAJIB PAKAI ADAPTER EOS EF-M TO EOS EF DAN CUMA BISA PAKAI LENSA DSLR (EF). Baterai: LP-E17.',
    ruleText: 'Canon EOS M6 II wajib memakai Adapter EF-M to EF dan hanya dapat menggunakan Lensa EF.'
  },
  'M6_I': {
    matchNames: ['m6 i', 'm6 mark i', 'm6 1'],
    cameraTitle: 'Canon EOS M6 Mark I',
    lensType: 'EF-M',
    lensLabel: 'Lensa EF-M (Mirrorless)',
    needsAdapter: false,
    adapterName: null,
    batteryType: 'LP-E17',
    batteryLabel: 'Baterai LP-E17',
    keteranganDefault: 'PAKAI LENSA EOS EF-M (Mirrorless Murni). Baterai: LP-E17.',
    ruleText: 'Canon EOS M6 I hanya dapat menggunakan Lensa EF-M murni (tanpa adapter).'
  },
  'CANON_250D': {
    matchNames: ['250d', 'eos 250d'],
    cameraTitle: 'Canon EOS 250D',
    lensType: 'EF',
    lensLabel: 'Lensa EF',
    needsAdapter: false,
    adapterName: null,
    batteryType: 'LP-E17',
    batteryLabel: 'Baterai LP-E17',
    keteranganDefault: 'PAKAI LENSA EOS EF. Baterai: LP-E17.',
    ruleText: 'Canon EOS 250D menggunakan Lensa EF dan memakai Baterai LP-E17.'
  },
  'CANON_1500D': {
    matchNames: ['1500d', 'eos 1500d'],
    cameraTitle: 'Canon EOS 1500D',
    lensType: 'EF',
    lensLabel: 'Lensa EF',
    needsAdapter: false,
    adapterName: null,
    batteryType: 'LP-E10',
    batteryLabel: 'Baterai LP-E10 (Khusus 1500D)',
    keteranganDefault: 'PAKAI LENSA EOS EF. Khusus Baterai LP-E10.',
    ruleText: 'Canon EOS 1500D menggunakan Lensa EF dan khusus memakai Baterai LP-E10.'
  }
};

/**
 * Deteksi aturan dan kompatibilitas dari objek kamera
 */
export const getCameraRequirements = (cameraItem) => {
  if (!cameraItem) return null;
  const name = (cameraItem.nama || '').toLowerCase().trim();
  const spec = (cameraItem.spesifikasi || '').toLowerCase().trim();
  const fullText = `${name} ${spec}`;

  // 1. Canon EOS M6 Mark II
  if (
    name.includes('m6 ii') || 
    name.includes('m6 mark ii') || 
    name.includes('m6 2') ||
    (name.includes('m6') && (fullText.includes('adapter') || fullText.includes('dslr')))
  ) {
    return {
      ...CAMERA_RULES.M6_II,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  // 2. Canon EOS M6 Mark I
  if (
    name.includes('m6 i') || 
    name.includes('m6 mark i') || 
    (name.includes('m6') && !name.includes('ii') && (fullText.includes('ef-m') || fullText.includes('efm')))
  ) {
    return {
      ...CAMERA_RULES.M6_I,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  // 3. Canon EOS 1500D
  if (name.includes('1500d') || name.includes('1500')) {
    return {
      ...CAMERA_RULES.CANON_1500D,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  // 4. Canon EOS 250D
  if (name.includes('250d') || name.includes('250')) {
    return {
      ...CAMERA_RULES.CANON_250D,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  // Fallback berdasarkan isi keterangan (spesifikasi) yang diketik admin
  if (fullText.includes('ef-m to ef') || (fullText.includes('adapter') && fullText.includes('ef'))) {
    return {
      ...CAMERA_RULES.M6_II,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  if (fullText.includes('ef-m') || fullText.includes('efm')) {
    return {
      ...CAMERA_RULES.M6_I,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  if (fullText.includes('ef')) {
    const is1500 = fullText.includes('1500');
    return is1500
      ? { ...CAMERA_RULES.CANON_1500D, cameraName: cameraItem.nama, cameraId: cameraItem.id }
      : { ...CAMERA_RULES.CANON_250D, cameraName: cameraItem.nama, cameraId: cameraItem.id };
  }

  // Default Canon kamera studio
  return {
    cameraName: cameraItem.nama,
    cameraId: cameraItem.id,
    lensType: 'EF',
    lensLabel: 'Lensa EF',
    needsAdapter: false,
    batteryType: name.includes('1500') ? 'LP-E10' : 'LP-E17',
    batteryLabel: name.includes('1500') ? 'Baterai LP-E10' : 'Baterai LP-E17',
    ruleText: `${cameraItem.nama} menggunakan lensa dan baterai standar Canon.`
  };
};

/**
 * Cek apakah Lensa tertentu kompatibel dengan kamera yang sedang dipilih
 */
export const isLensCompatible = (lensItem, cameraReq) => {
  if (!cameraReq) return true; // Jika tidak ada kamera yang dipilih, semua lensa tampil
  const text = `${lensItem.nama || ''} ${lensItem.spesifikasi || ''}`.toLowerCase();

  const isEfm = text.includes('ef-m') || text.includes('efm');

  if (cameraReq.lensType === 'EF-M') {
    // Kamera M6 I: HANYA LENSA EF-M
    return isEfm;
  }

  if (cameraReq.lensType === 'EF') {
    // Kamera M6 II (pakai adapter), 250D, dan 1500D: HANYA LENSA EF/EF-S
    // Jika lensa bertipe EF-M murni, maka TIDAK BISA DIPAKAI (GAK BAKAL MUNCUL)
    return !isEfm;
  }

  return true;
};

/**
 * Cek apakah Baterai tertentu kompatibel dengan kamera yang sedang dipilih
 */
export const isBatteryCompatible = (batteryItem, cameraReq) => {
  if (!cameraReq) return true; // Jika tidak ada kamera dipilih, semua baterai tampil
  const text = `${batteryItem.nama || ''} ${batteryItem.spesifikasi || ''}`.toLowerCase();

  const isLpE10 = text.includes('lp-e10') || text.includes('lpe10') || text.includes('1500');
  const isLpE17 = text.includes('lp-e17') || text.includes('lpe17');

  if (cameraReq.batteryType === 'LP-E10') {
    // Khusus 1500D: hanya LP-E10, jangan munculkan LP-E17
    if (isLpE17) return false;
    return isLpE10 || (!isLpE17 && !text.includes('lp-e'));
  }

  if (cameraReq.batteryType === 'LP-E17') {
    // M6 II, M6 I, 250D: hanya LP-E17, jangan munculkan LP-E10
    if (isLpE10) return false;
    return isLpE17 || (!isLpE10 && !text.includes('lp-e'));
  }

  return true;
};

/**
 * Cek apakah alat tertentu (lensa / baterai / dll.) kompatibel dengan kamera yang dipilih
 */
export const isEquipmentCompatible = (item, cameraReq) => {
  if (!cameraReq) return true;
  if (!item) return false;

  const cat = (item.kategori || '').toLowerCase();
  const name = (item.nama || '').toLowerCase();

  const isLens = cat === 'lensa' || name.startsWith('lensa') || name.includes('lens');
  if (isLens) {
    return isLensCompatible(item, cameraReq);
  }

  const isBattery = cat === 'baterai' || name.startsWith('baterai') || name.includes('battery');
  if (isBattery) {
    return isBatteryCompatible(item, cameraReq);
  }

  // Alat lain (Audio, Lighting, Tripod, Ruang, Kamera lain) tetap tampil
  return true;
};

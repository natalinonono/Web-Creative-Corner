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
    id: 'M6_II',
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
    id: 'M6_I',
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
    id: 'CANON_250D',
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
    id: 'CANON_1500D',
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
 * Cek apakah sebuah item benar-benar bodi kamera (bukan lensa, baterai, memory card, atau aksesori).
 */
export const isCameraItem = (item) => {
  if (!item) return false;
  const cat = (item.kategori || '').toLowerCase().trim();
  const name = (item.nama || '').toLowerCase().trim();

  // Jika kategorinya jelas bukan kamera, langsung tolak
  if (
    cat === 'lensa' || 
    cat === 'baterai' || 
    cat === 'memory card' || 
    cat === 'audio & mikrofon' || 
    cat === 'lighting & tata cahaya' || 
    cat === 'tripod & aksesori' || 
    cat === 'ruang studio'
  ) {
    return false;
  }

  // Jika nama mengandung kata kunci non-kamera
  if (
    name.startsWith('lensa') || 
    name.includes('lens') || 
    name.startsWith('baterai') || 
    name.includes('battery') || 
    name.includes('sd card') || 
    name.includes('memory') || 
    name.includes('adapter')
  ) {
    return false;
  }

  // Bodi kamera
  return cat.includes('kamera') || name.includes('kamera') || name.includes('camera') || name.includes('eos');
};

/**
 * Deteksi aturan dan kompatibilitas dari objek kamera
 */
export const getCameraRequirements = (cameraItem) => {
  if (!cameraItem || !isCameraItem(cameraItem)) return null;

  const name = (cameraItem.nama || '').toLowerCase().trim();
  const spec = (cameraItem.spesifikasi || '').toLowerCase().trim();
  const fullText = `${name} ${spec}`;

  // 1. Canon EOS M6 Mark II (Wajib Adapter EF-M to EF + Lensa EF DSLR)
  const isM6IIByName = 
    name.includes('m6 ii') || 
    name.includes('m6 mark ii') || 
    name.includes('m6 2') ||
    name.includes('m6-ii');

  const isM6IIBySpec = 
    (name.includes('m6') || fullText.includes('m6')) && 
    (fullText.includes('adapter') || fullText.includes('dslr') || fullText.includes('to ef') || fullText.includes('ke ef'));

  if (isM6IIByName || isM6IIBySpec) {
    return {
      ...CAMERA_RULES.M6_II,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  // 2. Canon EOS M6 Mark I (Lensa EF-M murni tanpa adapter)
  const isM6IByName = 
    name.includes('m6 i') || 
    name.includes('m6 mark i') || 
    name.includes('m6 1') ||
    name.includes('m6-i');

  const isM6IBySpec = 
    (name.includes('m6') || fullText.includes('m6')) && 
    !name.includes('ii') && 
    !fullText.includes('adapter') && 
    (fullText.includes('ef-m') || fullText.includes('efm'));

  if (isM6IByName || isM6IBySpec) {
    return {
      ...CAMERA_RULES.M6_I,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  // 3. Canon EOS 1500D (Lensa EF & Baterai LP-E10)
  if (name.includes('1500d') || name.includes('1500') || fullText.includes('1500d')) {
    return {
      ...CAMERA_RULES.CANON_1500D,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  // 4. Canon EOS 250D (Lensa EF & Baterai LP-E17)
  if (name.includes('250d') || name.includes('250') || fullText.includes('250d')) {
    return {
      ...CAMERA_RULES.CANON_250D,
      cameraName: cameraItem.nama,
      cameraId: cameraItem.id
    };
  }

  // Fallback analisa teks keterangan (spesifikasi)
  if (fullText.includes('ef-m to ef') || fullText.includes('ef-m ke ef') || (fullText.includes('adapter') && fullText.includes('ef'))) {
    return { ...CAMERA_RULES.M6_II, cameraName: cameraItem.nama, cameraId: cameraItem.id };
  }

  if (fullText.includes('ef-m') || fullText.includes('efm')) {
    return { ...CAMERA_RULES.M6_I, cameraName: cameraItem.nama, cameraId: cameraItem.id };
  }

  if (fullText.includes('ef')) {
    return name.includes('1500') 
      ? { ...CAMERA_RULES.CANON_1500D, cameraName: cameraItem.nama, cameraId: cameraItem.id }
      : { ...CAMERA_RULES.CANON_250D, cameraName: cameraItem.nama, cameraId: cameraItem.id };
  }

  // Default fallback jika kamera Canon lain
  return {
    cameraName: cameraItem.nama,
    cameraId: cameraItem.id,
    lensType: 'EF',
    lensLabel: 'Lensa EF',
    needsAdapter: false,
    batteryType: name.includes('1500') ? 'LP-E10' : 'LP-E17',
    batteryLabel: name.includes('1500') ? 'Baterai LP-E10' : 'Baterai LP-E17',
    ruleText: `${cameraItem.nama} menggunakan lensa EF dan baterai standar Canon.`
  };
};

/**
 * Deteksi tipe mount lensa: 'EF' vs 'EF-M'
 */
export const getLensMountType = (lensItem) => {
  if (!lensItem) return 'EF';
  const name = (lensItem.nama || '').toLowerCase();
  const spec = (lensItem.spesifikasi || '').toLowerCase();
  const text = `${name} ${spec}`;

  // Jika teks menyebutkan adapter EF-M to EF (misal "Bisa untuk M6 II pakai adapter EF-M to EF"),
  // maka unit fisiknya adalah lensa DSLR / EF!
  const isAdapterContext = 
    text.includes('ef-m to ef') || 
    text.includes('ef-m ke ef') || 
    text.includes('efm to ef') || 
    text.includes('adapter ef-m');

  // Lensa EF-M murni jika mengandung ef-m / efm dan bukan dalam konteks adapter
  const isNativeEfm = (name.includes('ef-m') || name.includes('efm') || spec.includes('mount: lensa ef-m') || spec.includes('lensa ef-m') || spec.includes('mount ef-m')) && !isAdapterContext;

  if (isNativeEfm) {
    return 'EF-M';
  }

  return 'EF';
};

/**
 * Cek apakah Lensa tertentu kompatibel dengan kamera yang sedang dipilih
 */
export const isLensCompatible = (lensItem, cameraReq) => {
  if (!cameraReq) return true; // Jika tidak ada kamera yang dipilih, semua lensa tampil
  const mountType = getLensMountType(lensItem);

  if (cameraReq.lensType === 'EF-M') {
    // Canon EOS M6 I: HANYA Lensa EF-M murni (tanpa adapter)
    // Lensa EF/DSLR GAK BAKAL MUNCUL
    return mountType === 'EF-M';
  }

  if (cameraReq.lensType === 'EF') {
    // Canon EOS M6 II (wajib adapter), 250D, dan 1500D: HANYA Lensa EF (DSLR)
    // Lensa EF-M murni GAK BAKAL MUNCUL
    return mountType === 'EF';
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

  // Jika item adalah Lensa
  const isLens = cat === 'lensa' || name.startsWith('lensa') || name.includes('lens');
  if (isLens) {
    return isLensCompatible(item, cameraReq);
  }

  // Jika item adalah Baterai
  const isBattery = cat === 'baterai' || name.startsWith('baterai') || name.includes('battery');
  if (isBattery) {
    return isBatteryCompatible(item, cameraReq);
  }

  // Alat lain (Memory Card, Audio, Lighting, Tripod, Ruang, Kamera lain) tetap tampil
  return true;
};

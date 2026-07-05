export const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID

// lastCol includes the 5 rightmost meta columns:
// IS_ACTIVE | INSERTED_BY | INSERTED_DATE | UPDATED_BY | UPDATED_DATE
export const SHEETS = {
  SISWA: { tab: 'Siswa', lastCol: 'AG' },
  KELAS: { tab: 'Kelas', lastCol: 'I' },
  EKSTRA: { tab: 'Ekstrakulikuler', lastCol: 'H' },
  NILAI: { tab: 'Nilai_Ekstra', lastCol: 'J' },
  USER_AKSES: { tab: 'User_Akses', lastCol: 'F' },
  GURU: { tab: 'Guru', lastCol: 'K' },
}

// sheetId integers (needed for deleteDimension) — populated at runtime by sheetsClient.init()
export const sheetIds = {
  Siswa: null,
  Kelas: null,
  Ekstrakulikuler: null,
  Nilai_Ekstra: null,
  User_Akses: null,
  Guru: null,
}

// ── Meta (audit) columns: always the 5 rightmost cells ────────────────────────
// baseLen = number of domain columns before the meta block

export function parseMeta(row, baseLen) {
  return {
    isActive: row[baseLen] ?? '1',
    insertedBy: row[baseLen + 1] ?? '',
    insertedDate: row[baseLen + 2] ?? '',
    updatedBy: row[baseLen + 3] ?? '',
    updatedDate: row[baseLen + 4] ?? '',
  }
}

export function metaToCells(data) {
  return [
    data.isActive ?? '1',
    data.insertedBy ?? '',
    data.insertedDate ?? '',
    data.updatedBy ?? '',
    data.updatedDate ?? '',
  ]
}

// ── Row ↔ Object mappers ──────────────────────────────────────────────────────

export function rowToStudent(row, rowIndex) {
  return {
    _rowIndex: rowIndex,
    kelas: row[0] ?? '',
    waliKelas1: row[1] ?? '',
    waliKelas2: row[2] ?? '',
    nis: row[3] ?? '',
    nisn: row[4] ?? '',
    namaSiswa: row[5] ?? '',
    panggilan: row[6] ?? '',
    jenisKelamin: row[7] ?? '',
    tempat: row[8] ?? '',
    tglLahir: row[9] ?? '',
    usia: row[10] ?? '',
    namaAyah: row[11] ?? '',
    namaBunda: row[12] ?? '',
    ttlAyah: row[13] ?? '',
    ttlBunda: row[14] ?? '',
    pekerjaanAyah: row[15] ?? '',
    pekerjaanBunda: row[16] ?? '',
    alamat: row[17] ?? '',
    asalSekolah: row[18] ?? '',
    noAyah: row[19] ?? '',
    noBunda: row[20] ?? '',
    emailAyah: row[21] ?? '',
    emailBunda: row[22] ?? '',
    saudara: row[23] ?? '',
    keterangan: row[24] ?? '',
    ekstrakulikuler1: row[25] ?? '',
    ekstrakulikuler2: row[26] ?? '',
    status: row[27] ?? 'Aktif',
    ...parseMeta(row, 28),
  }
}

export function studentToRow(data) {
  return [
    data.kelas ?? '',
    data.waliKelas1 ?? '',
    data.waliKelas2 ?? '',
    data.nis ?? '',
    data.nisn ?? '',
    data.namaSiswa ?? '',
    data.panggilan ?? '',
    data.jenisKelamin ?? '',
    data.tempat ?? '',
    data.tglLahir ?? '',
    data.usia ?? '',
    data.namaAyah ?? '',
    data.namaBunda ?? '',
    data.ttlAyah ?? '',
    data.ttlBunda ?? '',
    data.pekerjaanAyah ?? '',
    data.pekerjaanBunda ?? '',
    data.alamat ?? '',
    data.asalSekolah ?? '',
    data.noAyah ?? '',
    data.noBunda ?? '',
    data.emailAyah ?? '',
    data.emailBunda ?? '',
    data.saudara ?? '',
    data.keterangan ?? '',
    data.ekstrakulikuler1 ?? '',
    data.ekstrakulikuler2 ?? '',
    data.status ?? 'Aktif',
    ...metaToCells(data),
  ]
}

export function rowToKelas(row, rowIndex) {
  return {
    _rowIndex: rowIndex,
    id: row[0] ?? '',
    className: row[1] ?? '',
    pic1: row[2] ?? '',
    pic2: row[3] ?? '',
    ...parseMeta(row, 4),
  }
}

export function kelasToRow(data) {
  return [data.id ?? '', data.className ?? '', data.pic1 ?? '', data.pic2 ?? '', ...metaToCells(data)]
}

export function rowToEkstra(row, rowIndex) {
  return {
    _rowIndex: rowIndex,
    name: row[0] ?? '',
    pembina: row[1] ?? '',
    coach: row[2] ?? '',
    ...parseMeta(row, 3),
  }
}

export function ekstraToRow(data) {
  return [data.name ?? '', data.pembina ?? '', data.coach ?? '', ...metaToCells(data)]
}

export function rowToNilai(row, rowIndex) {
  return {
    _rowIndex: rowIndex,
    extracurricular: row[0] ?? '',
    levelClass: row[1] ?? '',
    nisn: row[2] ?? '',
    namaLengkap: row[3] ?? '',
    point: row[4] ?? '',
    ...parseMeta(row, 5),
  }
}

export function nilaiToRow(data) {
  return [
    data.extracurricular ?? '',
    data.levelClass ?? '',
    data.nisn ?? '',
    data.namaLengkap ?? '',
    data.point ?? '',
    ...metaToCells(data),
  ]
}

export function rowToUserAkses(row, rowIndex) {
  return { _rowIndex: rowIndex, email: row[0] ?? '', ...parseMeta(row, 1) }
}

export function rowToGuru(row, rowIndex) {
  return {
    _rowIndex: rowIndex,
    noInduk: row[0] ?? '',
    name: row[1] ?? '',
    titleBeforeName: row[2] ?? '',
    titleAfterName: row[3] ?? '',
    className: row[4] ?? '',
    pic: row[5] ?? '',
    ...parseMeta(row, 6),
  }
}

export function guruToRow(data) {
  return [
    data.noInduk ?? '',
    data.name ?? '',
    data.titleBeforeName ?? '',
    data.titleAfterName ?? '',
    data.className ?? '',
    data.pic ?? '',
    ...metaToCells(data),
  ]
}

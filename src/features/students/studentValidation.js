import * as yup from 'yup'

export const studentSchema = yup.object({
  nis: yup.string().trim().min(1).max(20).required('NIS wajib diisi'),
  nisn: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, 'NISN harus 10 digit angka')
    .required('NISN wajib diisi'),
  namaSiswa: yup.string().trim().min(2, 'Minimal 2 karakter').max(100).required('Nama wajib diisi'),
  panggilan: yup.string().trim().max(50).optional(),
  jenisKelamin: yup.string().oneOf(['Laki-laki', 'Perempuan'], 'Pilih jenis kelamin').required('Wajib diisi'),
  tempat: yup.string().trim().max(100).optional(),
  tglLahir: yup
    .string()
    .required('Tanggal lahir wajib diisi')
    .test('not-future', 'Tanggal lahir tidak boleh di masa depan', (val) => {
      if (!val) return true
      return new Date(val) <= new Date()
    }),
  kelas: yup.string().required('Kelas wajib diisi'),
  ekstrakulikuler: yup.string().optional(),
  status: yup
    .string()
    .oneOf(['Aktif', 'Tidak Aktif', 'Pindah', 'Lulus'])
    .required('Status wajib diisi'),
  namaAyah: yup.string().trim().max(100).optional(),
  namaBunda: yup.string().trim().max(100).optional(),
  ttlAyah: yup.string().trim().max(100).optional(),
  ttlBunda: yup.string().trim().max(100).optional(),
  pekerjaanAyah: yup.string().trim().max(100).optional(),
  pekerjaanBunda: yup.string().trim().max(100).optional(),
  noAyah: yup
    .string()
    .trim()
    .matches(/^(\d{10,15})?$/, 'No. HP harus 10-15 digit')
    .optional(),
  noBunda: yup
    .string()
    .trim()
    .matches(/^(\d{10,15})?$/, 'No. HP harus 10-15 digit')
    .optional(),
  emailAyah: '', // yup.string().trim().email('Format email tidak valid').optional().or(yup.string().trim().length(0)),
  emailBunda: '', // yup.string().trim().email('Format email tidak valid').optional().or(yup.string().trim().length(0)),
  alamat: yup.string().trim().max(255).optional(),
  asalSekolah: yup.string().trim().max(100).optional(),
  saudara: yup.string().trim().max(50).optional(),
  keterangan: yup.string().trim().max(500).optional(),
  waliKelas1: yup.string().trim().max(100).optional(),
  waliKelas2: yup.string().trim().max(100).optional(),
})

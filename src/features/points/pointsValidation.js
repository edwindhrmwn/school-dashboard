import * as yup from 'yup'

export const pointsSchema = yup.object({
  extracurricular: yup.string().required('Ekstrakulikuler wajib dipilih'),
  levelClass: yup.string().required('Kelas wajib dipilih'),
  nisn: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, 'NISN harus 10 digit angka')
    .required('NISN wajib diisi'),
  namaLengkap: yup.string().trim().required('Siswa not found'),
  point: yup
    .number()
    .typeError('Poin harus angka')
    .integer('Poin harus bilangan bulat')
    .min(0, 'Poin minimal 0')
    .max(100, 'Poin maksimal 100')
    .required('Poin wajib diisi'),
})

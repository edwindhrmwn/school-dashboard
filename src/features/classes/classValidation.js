import * as yup from 'yup'

export const classSchema = yup.object({
  className: yup
    .string()
    .trim()
    .min(2, 'Nama kelas minimal 2 karakter')
    .max(50, 'Nama kelas maksimal 50 karakter')
    .required('Nama kelas wajib diisi'),
  noInduk1: yup.string().trim().required('Guru 1 (PIC 1) wajib dipilih'),
  pic1: yup.string().trim().required('Guru 1 (PIC 1) wajib dipilih'),
  noInduk2: yup.string().trim().optional(),
  pic2: yup.string().trim().optional(),
})

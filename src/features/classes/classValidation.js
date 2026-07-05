import * as yup from 'yup'

export const classSchema = yup.object({
  className: yup
    .string()
    .trim()
    .min(2, 'Nama kelas minimal 2 karakter')
    .max(50, 'Nama kelas maksimal 50 karakter')
    .required('Nama kelas wajib diisi'),
  pic1: yup
    .string()
    .trim()
    .min(2, 'Nama guru minimal 2 karakter')
    .max(100, 'Nama guru maksimal 100 karakter')
    .required('Guru 1 (PIC 1) wajib diisi'),
  pic2: yup
    .string()
    .trim()
    .max(100, 'Nama guru maksimal 100 karakter')
    .optional(),
})

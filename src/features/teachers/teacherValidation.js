import * as yup from 'yup'

export const teacherSchema = yup.object({
  noInduk: yup.string().trim().max(30, 'Maksimal 30 karakter').required('No. Induk wajib diisi'),
  name: yup.string().trim().min(2, 'Minimal 2 karakter').max(100).required('Nama wajib diisi'),
  titleBeforeName: yup.string().trim().max(30).optional(),
  titleAfterName: yup.string().trim().max(30).optional(),
  className: yup.string().trim().optional(),
  pic: yup.string().trim().max(50).optional(),
})

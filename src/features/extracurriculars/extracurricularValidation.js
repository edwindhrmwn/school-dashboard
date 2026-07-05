import * as yup from 'yup'

export const extracurricularSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .required('Nama wajib diisi'),
  coach: yup
    .string()
    .trim()
    .min(2, 'Nama pembina minimal 2 karakter')
    .max(100, 'Nama pembina maksimal 100 karakter')
    .required('Nama pembina wajib diisi'),
})

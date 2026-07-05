import * as yup from 'yup'

export const extracurricularSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .required('Nama wajib diisi'),
  pembina: yup.string().trim().max(100).optional(),
  coach: yup
    .string()
    .trim()
    .min(2, 'Nama pelatih minimal 2 karakter')
    .max(100, 'Nama pelatih maksimal 100 karakter')
    .required('Nama pelatih wajib diisi'),
})

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { pointsSchema } from './pointsValidation'
import { FormField, Input, Select } from '../../components/FormField'

export function PointFormView({ initialValues, extracurriculars, classes, students, onSubmit, onCancel }) {
  const isEdit = !!initialValues
  const initialNama = initialValues?.namaLengkap ?? ''

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(pointsSchema),
    defaultValues: initialValues
      ? {
          extracurricular: initialValues.extracurricular,
          levelClass: initialValues.levelClass,
          nisn: initialValues.nisn,
          namaLengkap: initialValues.namaLengkap,
          point: initialValues.point,
        }
      : { extracurricular: '', levelClass: '', nisn: '', namaLengkap: '', point: '' },
  })

  const nisn = watch('nisn')
  const levelClass = watch('levelClass')
  const namaLengkap = watch('namaLengkap')

  // NISN divalidasi ke siswa yang berada di kelas terpilih.
  // Saat edit, fallback ke pencarian NISN saja agar data historis (siswa yg sudah naik kelas) tetap terjaga.
  useEffect(() => {
    let match = students.find((s) => s.nisn === nisn && s.kelas === levelClass)
    if (!match && isEdit) match = students.find((s) => s.nisn === nisn)
    setValue('namaLengkap', match ? match.namaSiswa : isEdit ? initialNama : '', {
      shouldValidate: false,
    })
  }, [nisn, levelClass, students, setValue, isEdit, initialNama])

  const showNotFound = !!levelClass && (nisn?.length ?? 0) > 0 && !namaLengkap

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Ekstrakulikuler" error={errors.extracurricular?.message} required>
        <Select {...register('extracurricular')}>
          <option value="">Pilih ekstrakulikuler...</option>
          {extracurriculars.map((e) => (
            <option key={e._rowIndex} value={e.name}>{e.name}</option>
          ))}
        </Select>
      </FormField>
      <FormField label="Level - Kelas" error={errors.levelClass?.message} required>
        <Select {...register('levelClass')}>
          <option value="">Pilih kelas...</option>
          {classes.map((c) => (
            <option key={c._rowIndex} value={c.className}>{c.className}</option>
          ))}
        </Select>
      </FormField>
      <FormField
        label="NISN"
        error={errors.nisn?.message || (showNotFound ? 'Siswa not found' : undefined)}
        required
      >
        <Input
          {...register('nisn')}
          placeholder={levelClass ? '10 digit' : 'Pilih kelas dulu'}
          maxLength={10}
          disabled={!levelClass}
        />
      </FormField>
      <FormField label="Nama Lengkap" error={errors.namaLengkap?.message}>
        <Input {...register('namaLengkap')} disabled placeholder="Otomatis dari NISN (kelas terpilih)" />
      </FormField>
      <FormField label="Poin (0-100)" error={errors.point?.message} required>
        <Input type="number" {...register('point')} min={0} max={100} />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
          Batal
        </button>
        <button type="submit" disabled={isSubmitting}
          className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">
          {isSubmitting ? 'Menyimpan...' : initialValues ? 'Perbarui' : 'Tambah'}
        </button>
      </div>
    </form>
  )
}

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { pointsSchema } from './pointsValidation'
import { FormField, Input, Select } from '../../components/FormField'

export function PointFormView({ initialValues, extracurriculars, classes, students, onSubmit, onCancel }) {
  const isEdit = !!initialValues

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

  // LOV murid: daftar siswa yang berada di kelas terpilih.
  const studentOptions = useMemo(() => {
    const inClass = students.filter((s) => s.kelas === levelClass)
    // Saat edit, siswa historis bisa sudah pindah kelas — pastikan opsi tersimpan tetap ada.
    if (isEdit && nisn && !inClass.some((s) => s.nisn === nisn)) {
      return [{ nisn, namaSiswa: initialValues.namaLengkap, _rowIndex: `keep-${nisn}` }, ...inClass]
    }
    return inClass
  }, [students, levelClass, isEdit, nisn, initialValues])

  function pickStudent(selectedNisn) {
    const match = studentOptions.find((s) => s.nisn === selectedNisn)
    setValue('nisn', selectedNisn, { shouldValidate: true })
    setValue('namaLengkap', match ? match.namaSiswa : '', { shouldValidate: true })
  }

  function selectClass(cls) {
    setValue('levelClass', cls, { shouldValidate: true })
    // Reset pilihan murid saat kelas berubah (kecuali edit yang membiarkan nilai awal)
    if (!isEdit) {
      setValue('nisn', '')
      setValue('namaLengkap', '')
    }
  }

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
        <Select value={levelClass} onChange={(e) => selectClass(e.target.value)}>
          <option value="">Pilih kelas...</option>
          {classes.map((c) => (
            <option key={c._rowIndex} value={c.className}>{c.className}</option>
          ))}
        </Select>
      </FormField>
      <FormField label="Murid" error={errors.nisn?.message || errors.namaLengkap?.message} required>
        <Select value={nisn} onChange={(e) => pickStudent(e.target.value)} disabled={!levelClass}>
          <option value="">{levelClass ? 'Pilih murid...' : 'Pilih kelas dulu'}</option>
          {studentOptions.map((s) => (
            <option key={s._rowIndex} value={s.nisn}>
              {s.namaSiswa} — {s.nisn}
            </option>
          ))}
        </Select>
      </FormField>
      {levelClass && studentOptions.length === 0 && (
        <p className="text-xs text-amber-600 -mt-2">Tidak ada murid di kelas ini.</p>
      )}
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

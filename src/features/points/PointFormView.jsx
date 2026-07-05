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
  const extracurricular = watch('extracurricular')

  // LOV murid: siswa di kelas terpilih DAN terdaftar di ekstrakulikuler terpilih (Ekstra 1/2).
  const studentOptions = useMemo(() => {
    const inScope = students.filter(
      (s) =>
        s.kelas === levelClass &&
        (!extracurricular ||
          s.ekstrakulikuler1 === extracurricular ||
          s.ekstrakulikuler2 === extracurricular),
    )
    // Saat edit, siswa historis bisa sudah pindah/berubah — pastikan opsi tersimpan tetap ada.
    if (isEdit && nisn && !inScope.some((s) => s.nisn === nisn)) {
      return [{ nisn, namaSiswa: initialValues.namaLengkap, _rowIndex: `keep-${nisn}` }, ...inScope]
    }
    return inScope
  }, [students, levelClass, extracurricular, isEdit, nisn, initialValues])

  function pickStudent(selectedNisn) {
    const match = studentOptions.find((s) => s.nisn === selectedNisn)
    setValue('nisn', selectedNisn, { shouldValidate: true })
    setValue('namaLengkap', match ? match.namaSiswa : '', { shouldValidate: true })
  }

  function resetStudent() {
    if (!isEdit) {
      setValue('nisn', '')
      setValue('namaLengkap', '')
    }
  }
  function selectExtra(name) {
    setValue('extracurricular', name, { shouldValidate: true })
    resetStudent()
  }
  function selectClass(cls) {
    setValue('levelClass', cls, { shouldValidate: true })
    resetStudent()
  }

  const muridReady = !!levelClass && !!extracurricular

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Ekstrakulikuler" error={errors.extracurricular?.message} required>
        <Select value={extracurricular} onChange={(e) => selectExtra(e.target.value)}>
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
        <Select value={nisn} onChange={(e) => pickStudent(e.target.value)} disabled={!muridReady}>
          <option value="">{muridReady ? 'Pilih murid...' : 'Pilih ekstra & kelas dulu'}</option>
          {studentOptions.map((s) => (
            <option key={s._rowIndex} value={s.nisn}>
              {s.namaSiswa} — {s.nisn}
            </option>
          ))}
        </Select>
      </FormField>
      {muridReady && studentOptions.length === 0 && (
        <p className="text-xs text-amber-600 -mt-2">Tidak ada murid di kelas ini yang terdaftar pada ekstrakulikuler tersebut.</p>
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

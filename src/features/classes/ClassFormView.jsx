import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { classSchema } from './classValidation'
import { FormField, Input, Select } from '../../components/FormField'

function teacherLabel(t) {
  return [t.titleBeforeName, t.name, t.titleAfterName].filter(Boolean).join(' ')
}

export function ClassFormView({ initialValues, teachers = [], onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(classSchema),
    defaultValues: initialValues
      ? {
          className: initialValues.className,
          pic1: initialValues.pic1,
          pic2: initialValues.pic2,
          noInduk1: initialValues.noInduk1,
          noInduk2: initialValues.noInduk2,
        }
      : { className: '', pic1: '', pic2: '', noInduk1: '', noInduk2: '' },
  })

  const noInduk1 = watch('noInduk1')
  const noInduk2 = watch('noInduk2')

  // LOV guru berbasis NO_INDUK. Pilih guru → simpan nama (PIC) + NO_INDUK.
  function pickTeacher(slot, selectedNoInduk) {
    const t = teachers.find((x) => String(x.noInduk) === String(selectedNoInduk))
    setValue(`noInduk${slot}`, selectedNoInduk, { shouldValidate: true })
    setValue(`pic${slot}`, t ? teacherLabel(t) : '', { shouldValidate: true })
  }

  // Opsi untuk sebuah slot: semua guru + fallback nilai tersimpan bila gurunya tak ada di daftar
  function optionsFor(slotNoInduk, slotPic) {
    const opts = teachers.map((t) => ({ value: String(t.noInduk), label: `${teacherLabel(t)} — ${t.noInduk}` }))
    if (slotNoInduk && !opts.some((o) => o.value === String(slotNoInduk))) {
      opts.unshift({ value: String(slotNoInduk), label: `${slotPic || 'Tersimpan'} — ${slotNoInduk}` })
    }
    return opts
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {initialValues && (
        <p className="text-xs text-gray-400">ID: {initialValues.id}</p>
      )}
      <FormField label="Nama Kelas" error={errors.className?.message} required>
        <Input {...register('className')} placeholder="cth. 1 MINA" />
      </FormField>
      <FormField label="Guru 1 / PIC 1" error={errors.noInduk1?.message || errors.pic1?.message} required>
        <Select value={noInduk1 ?? ''} onChange={(e) => pickTeacher(1, e.target.value)}>
          <option value="">Pilih guru...</option>
          {optionsFor(noInduk1, initialValues?.pic1).map((o) => (
            <option key={`p1-${o.value}`} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </FormField>
      <FormField label="Guru 2 / PIC 2" error={errors.noInduk2?.message || errors.pic2?.message}>
        <Select value={noInduk2 ?? ''} onChange={(e) => pickTeacher(2, e.target.value)}>
          <option value="">Tidak ada</option>
          {optionsFor(noInduk2, initialValues?.pic2).map((o) => (
            <option key={`p2-${o.value}`} value={o.value}>{o.label}</option>
          ))}
        </Select>
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

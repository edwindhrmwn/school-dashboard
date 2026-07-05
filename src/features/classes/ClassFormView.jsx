import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { classSchema } from './classValidation'
import { FormField, Input } from '../../components/FormField'

export function ClassFormView({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(classSchema),
    defaultValues: initialValues
      ? { className: initialValues.className, pic1: initialValues.pic1, pic2: initialValues.pic2 }
      : { className: '', pic1: '', pic2: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {initialValues && (
        <p className="text-xs text-gray-400">ID: {initialValues.id}</p>
      )}
      <FormField label="Nama Kelas" error={errors.className?.message} required>
        <Input {...register('className')} placeholder="cth. 1 MINA" />
      </FormField>
      <FormField label="Guru 1 (PIC 1)" error={errors.pic1?.message} required>
        <Input {...register('pic1')} placeholder="cth. Budi Santoso" />
      </FormField>
      <FormField label="Guru 2 (PIC 2)" error={errors.pic2?.message}>
        <Input {...register('pic2')} placeholder="cth. Ahmad Fauzi" />
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

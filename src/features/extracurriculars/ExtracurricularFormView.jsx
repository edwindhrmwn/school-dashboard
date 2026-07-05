import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { extracurricularSchema } from './extracurricularValidation'
import { FormField, Input } from '../../components/FormField'

export function ExtracurricularFormView({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(extracurricularSchema),
    defaultValues: initialValues
      ? { name: initialValues.name, coach: initialValues.coach }
      : { name: '', coach: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Nama Ekstrakulikuler" error={errors.name?.message} required>
        <Input {...register('name')} placeholder="cth. Pramuka" />
      </FormField>
      <FormField label="Nama Pembina" error={errors.coach?.message} required>
        <Input {...register('coach')} placeholder="cth. Budi Santoso" />
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

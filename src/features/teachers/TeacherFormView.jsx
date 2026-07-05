import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { teacherSchema } from './teacherValidation'
import { FormField, Input, Select } from '../../components/FormField'

export function TeacherFormView({ initialValues, classes, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(teacherSchema),
    defaultValues: initialValues
      ? {
          noInduk: initialValues.noInduk,
          name: initialValues.name,
          titleBeforeName: initialValues.titleBeforeName,
          titleAfterName: initialValues.titleAfterName,
          className: initialValues.className,
          pic: initialValues.pic,
        }
      : { noInduk: '', name: '', titleBeforeName: '', titleAfterName: '', className: '', pic: '' },
  })

  const grid2 = 'grid grid-cols-1 sm:grid-cols-2 gap-4'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="No. Induk" error={errors.noInduk?.message} required>
        <Input {...register('noInduk')} placeholder="cth. 198501012010011001" />
      </FormField>
      <FormField label="Nama" error={errors.name?.message} required>
        <Input {...register('name')} placeholder="Nama guru" />
      </FormField>
      <div className={grid2}>
        <FormField label="Gelar Depan" error={errors.titleBeforeName?.message}>
          <Input {...register('titleBeforeName')} placeholder="cth. Dr., Drs." />
        </FormField>
        <FormField label="Gelar Belakang" error={errors.titleAfterName?.message}>
          <Input {...register('titleAfterName')} placeholder="cth. S.Pd., M.M." />
        </FormField>
      </div>
      <div className={grid2}>
        <FormField label="Kelas" error={errors.className?.message}>
          <Select {...register('className')}>
            <option value="">Tidak ada</option>
            {classes.map((c) => (
              <option key={c._rowIndex} value={c.className}>{c.className}</option>
            ))}
          </Select>
        </FormField>
        <FormField label="PIC" error={errors.pic?.message}>
          <Input {...register('pic')} placeholder="Peran / penanggung jawab" />
        </FormField>
      </div>
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

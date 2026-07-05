import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { differenceInYears, parseISO } from 'date-fns'
import { studentSchema } from './studentValidation'
import { FormField, Input, Select, Textarea } from '../../components/FormField'

// TTL disimpan tetap 1 kolom "Tempat, YYYY-MM-DD". Helper pisah/gabung untuk UI.
function splitTTL(str) {
  const s = String(str ?? '').trim()
  const m = s.match(/(\d{4}-\d{2}-\d{2})$/)
  if (m) return { tempat: s.slice(0, m.index).replace(/[,\s]+$/, ''), tgl: m[1] }
  return { tempat: s, tgl: '' }
}
function joinTTL(tempat, tgl) {
  return [String(tempat ?? '').trim(), String(tgl ?? '').trim()].filter(Boolean).join(', ')
}
// Hanya izinkan digit (untuk NIS/NISN yang bertipe string tapi numerik)
const digitsOnly = (e) => { e.target.value = e.target.value.replace(/\D/g, '') }

export function StudentFormView({ initialValues, classes, extracurriculars, onSubmit, onCancel }) {
  const ttlA = splitTTL(initialValues?.ttlAyah)
  const ttlB = splitTTL(initialValues?.ttlBunda)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      nis: '', nisn: '', namaSiswa: '', panggilan: '',
      jenisKelamin: '', tempat: '', tglLahir: '', usia: '',
      kelas: '', ekstrakulikuler1: '', ekstrakulikuler2: '', status: 'Aktif',
      namaAyah: '', namaBunda: '', ttlAyah: '', ttlBunda: '',
      pekerjaanAyah: '', pekerjaanBunda: '', alamat: '', asalSekolah: '',
      noAyah: '', noBunda: '', emailAyah: '', emailBunda: '',
      saudara: '', keterangan: '', waliKelas1: '', waliKelas2: '',
      ...(initialValues ?? {}),
      // field UI terpisah untuk TTL (tidak disimpan langsung; digabung saat submit)
      tempatLahirAyah: ttlA.tempat, tglLahirAyah: ttlA.tgl,
      tempatLahirBunda: ttlB.tempat, tglLahirBunda: ttlB.tgl,
    },
  })

  // Gabungkan kembali TTL sebelum diteruskan ke onSubmit.
  // Ambil field split via getValues (bukan dari `data`) agar tidak terpengaruh cast schema.
  const submit = handleSubmit((data) => {
    const v = getValues()
    const { tempatLahirAyah, tglLahirAyah, tempatLahirBunda, tglLahirBunda, ...rest } = data
    onSubmit({
      ...rest,
      ttlAyah: joinTTL(v.tempatLahirAyah, v.tglLahirAyah),
      ttlBunda: joinTTL(v.tempatLahirBunda, v.tglLahirBunda),
    })
  })

  const tglLahir = watch('tglLahir')
  useEffect(() => {
    if (tglLahir) {
      try {
        const age = differenceInYears(new Date(), parseISO(tglLahir))
        setValue('usia', age >= 0 ? String(age) : '')
      } catch {
        setValue('usia', '')
      }
    }
  }, [tglLahir, setValue])

  // Guru 1/2 otomatis dari kelas terpilih (join ke data Kelas)
  const selectedKelas = watch('kelas')
  const matchedClass = classes.find((c) => c.className === selectedKelas)

  // Cegah memilih ekstrakulikuler yang sama di kedua slot
  const selectedEkstra1 = watch('ekstrakulikuler1')
  const selectedEkstra2 = watch('ekstrakulikuler2')

  const section = 'pt-4 border-t border-gray-100 mt-2'
  const grid2 = 'grid grid-cols-1 sm:grid-cols-2 gap-4'

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Data Pokok</p>
      <div className={grid2}>
        <FormField label="NIS" error={errors.nis?.message} required>
          <Input {...register('nis')} inputMode="numeric" onInput={digitsOnly} placeholder="cth. 2024001" maxLength={20} />
        </FormField>
        <FormField label="NISN" error={errors.nisn?.message} required>
          <Input {...register('nisn')} inputMode="numeric" onInput={digitsOnly} placeholder="10 digit angka" maxLength={10} />
        </FormField>
      </div>
      <FormField label="Nama Lengkap Siswa" error={errors.namaSiswa?.message} required>
        <Input {...register('namaSiswa')} placeholder="Nama lengkap sesuai akta" />
      </FormField>
      <div className={grid2}>
        <FormField label="Panggilan" error={errors.panggilan?.message}>
          <Input {...register('panggilan')} />
        </FormField>
        <FormField label="Jenis Kelamin" error={errors.jenisKelamin?.message} required>
          <Select {...register('jenisKelamin')}>
            <option value="">Pilih...</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </Select>
        </FormField>
      </div>
      <div className={grid2}>
        <FormField label="Tempat Lahir" error={errors.tempat?.message}>
          <Input {...register('tempat')} />
        </FormField>
        <FormField label="Tanggal Lahir" error={errors.tglLahir?.message} required>
          <Input type="date" {...register('tglLahir')} />
        </FormField>
      </div>
      <FormField label="Usia (otomatis)" error={errors.usia?.message}>
        <Input {...register('usia')} disabled placeholder="Dihitung otomatis" />
      </FormField>

      <div className={section}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Kelas & Kegiatan</p>
        <div className={grid2}>
          <FormField label="Kelas" error={errors.kelas?.message} required>
            <Select {...register('kelas')}>
              <option value="">Pilih kelas...</option>
              {classes.map((c) => (
                <option key={c._rowIndex} value={c.className}>{c.className}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Status" error={errors.status?.message} required>
            <Select {...register('status')}>
              <option>Aktif</option>
              <option>Tidak Aktif</option>
              <option>Pindah</option>
              <option>Lulus</option>
            </Select>
          </FormField>
        </div>
        <div className={`${grid2} mt-4`}>
          <FormField label="Ekstrakulikuler 1" error={errors.ekstrakulikuler1?.message}>
            <Select {...register('ekstrakulikuler1')}>
              <option value="">Tidak ada</option>
              {extracurriculars
                .filter((e) => e.name !== selectedEkstra2)
                .map((e) => (
                  <option key={e._rowIndex} value={e.name}>{e.name}</option>
                ))}
            </Select>
          </FormField>
          <FormField label="Ekstrakulikuler 2" error={errors.ekstrakulikuler2?.message}>
            <Select {...register('ekstrakulikuler2')}>
              <option value="">Tidak ada</option>
              {extracurriculars
                .filter((e) => e.name !== selectedEkstra1)
                .map((e) => (
                  <option key={e._rowIndex} value={e.name}>{e.name}</option>
                ))}
            </Select>
          </FormField>
        </div>
        <div className={`${grid2} mt-4`}>
          <FormField label="Guru 1 (otomatis dari kelas)">
            <Input value={matchedClass?.pic1 ?? ''} readOnly disabled placeholder="Pilih kelas dulu" />
          </FormField>
          <FormField label="Guru 2 (otomatis dari kelas)">
            <Input value={matchedClass?.pic2 ?? ''} readOnly disabled placeholder="Pilih kelas dulu" />
          </FormField>
        </div>
      </div>

      <div className={section}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Data Orang Tua</p>
        <div className={grid2}>
          <FormField label="Nama Ayah" error={errors.namaAyah?.message}>
            <Input {...register('namaAyah')} />
          </FormField>
          <FormField label="Nama Bunda" error={errors.namaBunda?.message}>
            <Input {...register('namaBunda')} />
          </FormField>
          <FormField label="Tempat Lahir Ayah" error={errors.tempatLahirAyah?.message}>
            <Input {...register('tempatLahirAyah')} placeholder="cth. Jakarta" />
          </FormField>
          <FormField label="Tanggal Lahir Ayah" error={errors.tglLahirAyah?.message}>
            <Input type="date" {...register('tglLahirAyah')} />
          </FormField>
          <FormField label="Tempat Lahir Bunda" error={errors.tempatLahirBunda?.message}>
            <Input {...register('tempatLahirBunda')} placeholder="cth. Bandung" />
          </FormField>
          <FormField label="Tanggal Lahir Bunda" error={errors.tglLahirBunda?.message}>
            <Input type="date" {...register('tglLahirBunda')} />
          </FormField>
          <FormField label="Pekerjaan Ayah" error={errors.pekerjaanAyah?.message}>
            <Input {...register('pekerjaanAyah')} />
          </FormField>
          <FormField label="Pekerjaan Bunda" error={errors.pekerjaanBunda?.message}>
            <Input {...register('pekerjaanBunda')} />
          </FormField>
          <FormField label="No. HP Ayah" error={errors.noAyah?.message}>
            <Input {...register('noAyah')} type="tel" />
          </FormField>
          <FormField label="No. HP Bunda" error={errors.noBunda?.message}>
            <Input {...register('noBunda')} type="tel" />
          </FormField>
          <FormField label="Email Ayah" error={errors.emailAyah?.message}>
            <Input {...register('emailAyah')} type="email" />
          </FormField>
          <FormField label="Email Bunda" error={errors.emailBunda?.message}>
            <Input {...register('emailBunda')} type="email" />
          </FormField>
        </div>
      </div>

      <div className={section}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Keterangan Lain</p>
        <div className={`${grid2} mb-4`}>
          <FormField label="Asal Sekolah" error={errors.asalSekolah?.message}>
            <Input {...register('asalSekolah')} />
          </FormField>
          <FormField label="Jumlah Saudara" error={errors.saudara?.message}>
            <Input {...register('saudara')} />
          </FormField>
        </div>
        <FormField label="Alamat" error={errors.alamat?.message}>
          <Textarea {...register('alamat')} />
        </FormField>
        <div className="mt-4">
          <FormField label="Keterangan" error={errors.keterangan?.message}>
            <Textarea {...register('keterangan')} />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white pb-1">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
          Batal
        </button>
        <button type="submit" disabled={isSubmitting}
          className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">
          {isSubmitting ? 'Menyimpan...' : initialValues ? 'Perbarui' : 'Tambah Siswa'}
        </button>
      </div>
    </form>
  )
}

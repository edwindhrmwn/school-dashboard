# School Dashboard

Dashboard manajemen sekolah berbasis React + Vite dengan **Google Sheets sebagai backend**. Mengelola data siswa, kelas, ekstrakulikuler, nilai, dan proses kenaikan kelas.

## Fitur

- **Data Siswa** — CRUD lengkap + detail, usia otomatis, Guru 1/2 hasil join ke Kelas, pivot riwayat nilai ekstrakulikuler
- **Kelas** — CRUD (ID auto-increment, nama kelas, PIC/guru 1 & 2)
- **Ekstrakulikuler** — CRUD (nama + pembina)
- **Nilai Ekstra** — poin per siswa per kelas, NISN divalidasi ke kelas terpilih
- **Naik Kelas** — kenaikan massal dengan kelas tujuan bebas per siswa (Naik/Tinggal/Lulus)
- **Audit trail** — `IS_ACTIVE`, `INSERTED_BY/DATE`, `UPDATED_BY/DATE` di setiap tabel; hapus = soft delete
- **Auth** — Google OAuth 2.0 (login sekali, token di localStorage)

## Tech Stack

React 18 · Vite 5 · React Router 6 · Tailwind CSS 3 · React Hook Form + Yup · Axios · date-fns · react-hot-toast

Arsitektur: logika di `hooks/`, tampilan di `features/*/XxxView.jsx`, halaman tipis di `XxxPage.jsx`.

## Menjalankan Lokal

Butuh Node.js 20+.

```bash
npm install
cp .env.example .env   # lalu isi kredensial Anda
npm run dev            # http://localhost:5173
```

## Konfigurasi Google

1. **Google Cloud Console** → aktifkan **Google Sheets API**
2. Buat **OAuth 2.0 Client ID** (tipe Web application)
3. Tambahkan `http://localhost:5173` ke **Authorized JavaScript origins**
4. OAuth consent screen → tambahkan email Anda sebagai **Test user**
5. Isi `VITE_GOOGLE_CLIENT_ID` dan `VITE_SPREADSHEET_ID` di `.env`

### Struktur Spreadsheet

Setiap sheet diakhiri 5 kolom meta (paling kanan): `IS_ACTIVE | INSERTED_BY | INSERTED_DATE | UPDATED_BY | UPDATED_DATE`.

| Sheet | Kolom domain |
|---|---|
| `Siswa` | KELAS, WALI KELAS 1/2, NIS, NISN, NAMA SISWA, … , EKSTRAKULIKULER, STATUS |
| `Kelas` | ID, CLASS_NAME, PIC_1, PIC_2 |
| `Ekstrakulikuler` | NAME, COACH |
| `Nilai_Ekstra` | EXTRACURRICULAR, LEVEL_CLASS, NISN, NAMA_LENGKAP, POINT |

## Build

```bash
npm run build     # output ke dist/
npm run preview
```

## Catatan Keamanan

`.env` tidak di-commit (lihat `.gitignore`). Gunakan `.env.example` sebagai templat.

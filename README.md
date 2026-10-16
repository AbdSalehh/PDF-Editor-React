# PDF Editor

Editor PDF berbasis React yang berjalan sepenuhnya di browser. Tidak ada backend, database, maupun akun pengguna: file diproses di perangkat dan tidak pernah dikirim ke server.

## Fitur

| Alat | Fungsi |
| --- | --- |
| **PDF Editor** | Tambah teks, gambar, dan shape; zoom; preview halaman; unduh hasil |
| **Merge PDF** | Gabungkan beberapa PDF dengan urutan yang bisa diatur (drag & drop) |
| **Split PDF** | Pisahkan, hapus, putar, dan susun ulang halaman; unduh satuan atau ZIP |
| **Image to PDF** | Ubah gambar menjadi PDF dengan pilihan ukuran halaman, orientasi, dan margin |

Tema terang dan gelap tersedia, dan pilihannya disimpan di `localStorage`.

## Tech Stack

- React 19, TypeScript, Vite
- Tailwind CSS 4
- [pdf-lib](https://pdf-lib.js.org/) untuk membuat dan mengubah PDF, [react-pdf](https://github.com/wojtekmaj/react-pdf) untuk render
- Zustand untuk state editor, React Router untuk routing
- react-dnd untuk drag & drop, JSZip untuk ekspor ZIP
- Motion untuk animasi, Sonner untuk toast, lucide-react untuk ikon

## Menjalankan

```bash
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Type-check (`tsc -b`) lalu build ke `dist/` |
| `npm run buildOnly` | Build tanpa type-check |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Jalankan ESLint |

Tidak ada file `.env` yang diperlukan.

## Struktur Proyek

Proyek mengikuti [Feature-Sliced Design](https://feature-sliced.design/). Folder layer berada langsung di root, tanpa `src/`.

```text
app/         Entry point, providers, router, global styles
pages/       Halaman per route (home, NotFound)
widgets/     Blok UI besar: tab-bar, tab-content, tab-component, sidebar,
             canvas, preview, draggable, dialog, hero-section, background-effects
features/    Interaksi pengguna: theme-toggle
entities/    State dan logika domain: pdf-editor, pdf-merge, pdf-split,
             image-to-pdf, tab
shared/      Kode generik: ui, components, hooks, lib
public/      Aset statis (font untuk teks di PDF, ikon)
```

Aturan dependensi: sebuah layer hanya boleh mengimpor dari layer di bawahnya.

```text
app → pages → widgets → features → entities → shared
```

Alias `@/` mengarah ke root proyek, misalnya `import { cn } from "@/shared/lib/utils"`.

## Catatan

- **Font di PDF:** teks yang ditambahkan memakai font di `public/fonts` (Roboto, Open Sans, Lato, Georgia, Calibri) yang disematkan ke PDF saat diunduh. Font di luar daftar itu memakai font standar PDF (Helvetica, Times, Courier).
- **Worker pdf.js:** worker diambil dari `unpkg.com`, jadi dibutuhkan koneksi internet saat aplikasi dipakai. Untuk penggunaan offline, worker perlu dibundel lewat Vite.
- **Font antarmuka:** Plus Jakarta Sans, Instrument Serif, dan JetBrains Mono dimuat dari Google Fonts (lihat `index.html`).

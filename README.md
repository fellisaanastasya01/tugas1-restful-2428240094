# Tugas 1 — RESTful API Murni dengan Express.js (SI5B)

**Topik 26 — Toko Gadget: Smartphone**

| | |
|---|---|
| Nama | Fellisa Anastasya |
| NIM | 2428240094 |
| Kelas | SI5B |
| Nomor Topik | 26 |
| Resource | `/smartphones` |
| Filter | `?merek=` |
| Link Deploy Vercel | https://tugas1-restful-2428240094.vercel.app |

---

## Menjalankan Secara Lokal

```bash
npm install       # pasang dependency
npm run dev       # jalankan dengan nodemon (auto-restart)
# atau
npm start         # jalankan dengan node biasa
```

Server berjalan di [http://localhost:3000](http://localhost:3000).

---

## Daftar Endpoint

| No | Method | Endpoint | Fungsi | Sukses | Gagal |
|---|---|---|---|---|---|
| 1 | GET | `/smartphones` | Ambil semua data | 200 | — |
| 2 | GET | `/smartphones/:id` | Ambil satu data | 200 | 404 |
| 3 | POST | `/smartphones` | Tambah data baru | 201 | 400 |
| 4 | PUT | `/smartphones/:id` | Ubah seluruh data | 200 | 400 / 404 |
| 5 | DELETE | `/smartphones/:id` | Hapus data | 200 | 404 |
| 6 | GET | `/smartphones?merek=Xiaomi` | Filter dengan query string | 200 | — |
| — | GET | `/` | Informasi API | 200 | — |
| — | *any* | `/endpoint-hantu` | Catch-all handler | — | 404 |

### Field Data Smartphone

| Field | Tipe | Wajib |
|---|---|---|
| `merek` | string | ya |
| `model` | string | ya |
| `ramGb` | number | ya |
| `penyimpananGb` | number | ya |
| `harga` | number | ya |

`id` dibuat otomatis oleh server dan tidak dikirim di body request.

---

## Contoh Request

### POST /smartphones

```
Content-Type: application/json

{
  "merek": "Xiaomi",
  "model": "Redmi Note 14",
  "ramGb": 8,
  "penyimpananGb": 256,
  "harga": 3299000
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Data berhasil ditambahkan",
  "data": {
    "id": 5,
    "merek": "Xiaomi",
    "model": "Redmi Note 14",
    "ramGb": 8,
    "penyimpananGb": 256,
    "harga": 3299000
  }
}
```

### Response Error 400

```json
{
  "status": "error",
  "message": "Field merek wajib diisi",
  "data": null
}
```

### Response Error 404

```json
{
  "status": "error",
  "message": "Data dengan id 99 tidak ditemukan",
  "data": null
}
```

### DELETE /smartphones/1 (200)

```json
{
  "status": "success",
  "message": "Data smartphone dengan id 1 berhasil dihapus",
  "data": null
}
```

---

## Catatan

- Seluruh response API berupa JSON murni, termasuk response error dan 404.
- Tidak ada template engine, tidak ada database, dan tidak ada file statis.
- Data disimpan pada array di memori. Pada Vercel (serverless), data dapat kembali ke
  data awal setelah beberapa saat — hal ini wajar dan tidak mengurangi nilai.
- Pengujian endpoint dilakukan dengan Postman / Thunder Client / Insomnia, baik di
  localhost maupun pada URL Vercel.

## Deployment

Project dikonfigurasi untuk Vercel lewat `vercel.json` dan `module.exports = app`
pada `app.js`. Import repository ini dari dashboard Vercel
(*Add New → Project*), lalu deploy. Setiap push ke branch `main` akan
otomatis deploy ulang.

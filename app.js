// ============================================================
//  TUGAS 1 - RESTful API Murni dengan Express.js
//  Topik 26 : Toko Gadget - Smartphone
//  Resource  : /smartphones
//  Filter    : ?merek=
//  NIM       : 2428240094
//  Kelas     : SI5B
// ============================================================

// --- 1. impor express dan siapkan aplikasi ---
const express = require("express");
const app = express();

// middleware untuk membaca body JSON (Content-Type: application/json)
app.use(express.json());

// --- 2. data awal (array di memori) + penomoran id otomatis ---
// minimal 3 data awal, id dibuat server (tidak dikirim di body)
const smartphones = [
  {
    id: 1,
    merek: "Xiaomi",
    model: "Redmi Note 14",
    ramGb: 8,
    penyimpananGb: 256,
    harga: 3299000,
  },
  {
    id: 2,
    merek: "Samsung",
    model: "Galaxy A15",
    ramGb: 6,
    penyimpananGb: 128,
    harga: 2799000,
  },
  {
    id: 3,
    merek: "Xiaomi",
    model: "Poco X6 Pro",
    ramGb: 8,
    penyimpananGb: 256,
    harga: 4199000,
  },
  {
    id: 4,
    merek: "Oppo",
    model: "A78",
    ramGb: 8,
    penyimpananGb: 256,
    harga: 3699000,
  },
];

// id untuk data berikutnya (otomatis bertambah 1)
let nextId = 5;

// daftar field wajib pada topik 26
const FIELD_WAJIB = ["merek", "model", "ramGb", "penyimpananGb", "harga"];

// --- 3. route utama: GET / (JSON info API, bukan teks/HTML) ---
app.get("/", (req, res) => {
  res.json({
    nama: "Fellisa Anastasya",
    nim: "2428240094",
    kelas: "SI5B",
    nomorTopik: 26,
    topik: "Toko Gadget: Smartphone",
    resource: "smartphones",
    deskripsi: "RESTful API untuk mengelola data smartphone (Topik 26 - SI5B)",
    endpoint: [
      "GET    /smartphones              -> ambil semua data",
      "GET    /smartphones/:id          -> ambil satu data",
      "POST   /smartphones              -> tambah data baru",
      "PUT    /smartphones/:id          -> ubah seluruh data",
      "DELETE /smartphones/:id          -> hapus data",
      "GET    /smartphones?merek=Xiaomi -> filter data",
    ],
  });
});

// --- 4. GET /smartphones (endpoint 1) dan filter (endpoint 6) ---
// GET /smartphones              -> semua data (array)
// GET /smartphones?merek=Xiaomi -> filter, hasil array langsung (boleh kosong [])
app.get("/smartphones", (req, res) => {
  const merek = req.query.merek;

  // bila ada query string ?merek=... maka lakukan filter
  if (merek !== undefined) {
    const hasil = smartphones.filter((s) => s.merek === merek);
    return res.json(hasil);
  }

  // tanpa query string -> kirim semua data
  res.json(smartphones);
});

// --- 5. GET /smartphones/:id (endpoint 2) ---
// Contoh: GET /smartphones/1
app.get("/smartphones/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = smartphones.find((s) => s.id === id);

  // id tidak ditemukan -> 404
  if (!data) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  // data tunggal dikirim langsung (tanpa status/message)
  res.json(data);
});

// --- helper: ubah string angka menjadi number ---
function keAngka(nilai) {
  const n = Number(nilai);
  return typeof nilai === "string" && nilai.trim() !== "" && !Number.isNaN(n) ? n : nilai;
}

// --- helper: cek apakah sebuah field wajib kosong ---
function fieldKosong(body, daftar) {
  return daftar.filter((f) => {
    const nilai = body[f];
    return (
      nilai === undefined ||
      nilai === null ||
      nilai === "" ||
      (typeof nilai === "string" && nilai.trim() === "")
    );
  });
}

// --- 6. POST /smartphones (endpoint 3) ---
// Body: { "merek": "Xiaomi", "model": "Redmi Note 14", "ramGb": 8, "penyimpananGb": 256, "harga": 3299000 }
app.post("/smartphones", (req, res) => {
  const body = req.body || {};

  // validasi semua field wajib -> 400 bila ada yang kosong
  const kosong = fieldKosong(body, FIELD_WAJIB);

  if (kosong.length > 0) {
    return res.status(400).json({
      status: "error",
      message: `Field ${kosong.join(", ")} wajib diisi`,
      data: null,
    });
  }

  // id dibuat otomatis oleh server, bukan diambil dari body
  const baru = {
    id: nextId++,
    merek: body.merek,
    model: body.model,
    ramGb: keAngka(body.ramGb),
    penyimpananGb: keAngka(body.penyimpananGb),
    harga: keAngka(body.harga),
  };

  smartphones.push(baru);

  // berhasil -> 201 + data yang baru dibuat
  res.status(201).json({
    status: "success",
    message: "Data berhasil ditambahkan",
    data: baru,
  });
});

// --- 7. PUT /smartphones/:id (endpoint 4) ---
// Body: { "merek": "Xiaomi", "model": "Redmi Note 14 Pro", "ramGb": 12, "penyimpananGb": 512, "harga": 4999000 }
// PUT = penggantian penuh, bukan menggabungkan dengan data lama
app.put("/smartphones/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = smartphones.findIndex((s) => s.id === id);

  // id tidak ditemukan -> 404
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  const body = req.body || {};

  // validasi field wajib pada body -> 400 bila ada yang kosong
  const kosong = fieldKosong(body, FIELD_WAJIB);

  if (kosong.length > 0) {
    return res.status(400).json({
      status: "error",
      message: `Field ${kosong.join(", ")} wajib diisi`,
      data: null,
    });
  }

  // ganti seluruh isi data, id tetap sama
  smartphones[index] = {
    id: id,
    merek: body.merek,
    model: body.model,
    ramGb: keAngka(body.ramGb),
    penyimpananGb: keAngka(body.penyimpananGb),
    harga: keAngka(body.harga),
  };

  res.json({
    status: "success",
    message: `Data dengan id ${id} berhasil diperbarui`,
    data: smartphones[index],
  });
});

// --- 8. DELETE /smartphones/:id (endpoint 5) ---
// Contoh: DELETE /smartphones/1
app.delete("/smartphones/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = smartphones.findIndex((s) => s.id === id);

  // id tidak ditemukan -> 404
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  smartphones.splice(index, 1);

  // berhasil -> 200, data null, pesan menyebut id yang dihapus
  res.json({
    status: "success",
    message: `Data smartphone dengan id ${id} berhasil dihapus`,
    data: null,
  });
});

// --- 9. middleware catch-all: endpoint tidak terdaftar -> 404 JSON ---
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null,
  });
});

// --- 10. error handler: pastikan response tetap JSON (tidak HTML) ---
app.use((err, req, res, next) => {
  res.status(400).json({
    status: "error",
    message: "Request tidak valid: body harus berupa JSON",
    data: null,
  });
});

// --- 11. jalankan server (hanya lokal) + export untuk Vercel ---
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di [http://localhost:${PORT}]`);
  });
}

module.exports = app;

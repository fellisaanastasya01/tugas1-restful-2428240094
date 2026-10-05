// Impor Express
const express = require('express');
const app = express();

// Middleware untuk membaca JSON dari body request
app.use(express.json());

// Middleware Logger (Untuk melihat proses di terminal)
app.use((req, res, next) => {
    console.log(`[LOG] Method: ${req.method} | Endpoint: ${req.originalUrl}`);
    next();
});

// Array data awal di memori (Minimal 3 data)
let smartphones = [
    { 
        id: 1, 
        merek: "Xiaomi", 
        model: "Redmi Note 14", 
        ramGb: 8, 
        penyimpananGb: 256, 
        harga: 3299000 
    },
    { id: 2, merek: "Samsung", model: "Galaxy A54", ramGb: 8, penyimpananGb: 256, harga: 5999000 },
    { id: 3, merek: "Apple", model: "iPhone 13", ramGb: 4, penyimpananGb: 128, harga: 9999000 },
    { id: 4, merek: "Infinix", model: "Note 40 Pro", ramGb: 8, penyimpananGb: 130, harga: 3999000 }
];
let nextId = 5;

// GET / -> Mengembalikan JSON info API
app.get('/', (req, res) => {
    res.status(200).json({
        nama: "Fellisa Anastasya",
        nim: "2428240094",
        topik: 26,
        endpoints: [
            "GET /smartphones",
            "GET /smartphones/:id",
            "POST /smartphones",
            "PUT /smartphones/:id",
            "DELETE /smartphones/:id",
            "GET /smartphones?merek=nilai"
        ]
    });
});

// GET /smartphones & Filter (GET /smartphones?merek=nilai)
app.get('/smartphones', (req, res) => {
    // Jika ada query string 'merek'
    if (req.query.merek) {
        const filteredData = smartphones.filter(
            (s) => s.merek.toLowerCase() === req.query.merek.toLowerCase()
        );
        return res.status(200).json(filteredData);
    }
    // Jika tidak ada filter, tampilkan semua
    res.status(200).json(smartphones);
});

// GET /smartphones/:id (Ambil satu data)
app.get('/smartphones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = smartphones.find((s) => s.id === id);

    if (!data) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }
    // Output balasan GET langsung berupa data, tanpa dibungkus status/message
    res.status(200).json(data); 
});

// POST /smartphones (Tambah data baru)
app.post('/smartphones', (req, res) => {
    const { merek, model, ramGb, penyimpananGb, harga } = req.body;

    // Validasi field wajib
    if (!merek || !model || !ramGb || !penyimpananGb || !harga) {
        return res.status(400).json({
            status: "error",
            message: "Field merek, model, ramGb, penyimpananGb, dan harga wajib diisi",
            data: null
        });
    }

    const baru = { id: nextId++, merek, model, ramGb, penyimpananGb, harga };
    smartphones.push(baru);

    res.status(201).json({
        status: "success",
        message: "Data berhasil ditambahkan",
        data: baru
    });
});

// PUT /smartphones/:id (Ubah seluruh data)
app.put('/smartphones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { merek, model, ramGb, penyimpananGb, harga } = req.body;

    // Validasi field wajib
    if (!merek || !model || !ramGb || !penyimpananGb || !harga) {
        return res.status(400).json({
            status: "error",
            message: "Field merek, model, ramGb, penyimpananGb, dan harga wajib diisi",
            data: null
        });
    }

    const index = smartphones.findIndex((s) => s.id === id);
    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    // Mengganti penuh data pada index tersebut
    smartphones[index] = { id, merek, model, ramGb, penyimpananGb, harga };

    res.status(200).json({
        status: "success",
        message: "Data berhasil diubah",
        data: smartphones[index]
    });
});

// DELETE /smartphones/:id (Hapus data)
app.delete('/smartphones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = smartphones.findIndex((s) => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    smartphones.splice(index, 1);

    res.status(200).json({
        status: "success",
        message: `Data smartphone dengan id ${id} berhasil dihapus`,
        data: null
    });
});

// Middleware catch-all 404 (Untuk route tidak dikenal)
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Endpoint tidak ditemukan",
        data: null
    });
});

// Menjalankan server (Hanya lokal + ekspor untuk Vercel)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
}

module.exports = app;
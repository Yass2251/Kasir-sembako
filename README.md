# FreshMart POS 🛒
### Sistem Kasir & Manajemen Stok Toko Sembako / Minimarket

FreshMart POS adalah aplikasi sistem kasir (*Point of Sale*) dan manajemen inventaris stok modern, minimalis, dan responsif yang dirancang untuk toko sembako atau minimarket retail. Aplikasi ini dibangun dengan kode bersih dan mudah dipahami oleh siswa SMK jurusan Pengembangan Perangkat Lunak dan GIM (PPLG).

---

## 🌟 Fitur Utama

1. **Mesin Kasir (POS):**
   - Katalog produk berbasis grid yang bersih dengan pencarian instan (nama atau kode SKU).
   - Filter kategori cepat (*Sembako, Sayur & Buah, Minuman, Makanan, Kebutuhan Rumah*).
   - Indikator stok menipis dan penonaktifan produk jika stok habis.
   - Keranjang belanja interaktif (tambah/kurang kuantitas, hapus item, kosongkan keranjang).
   - Perhitungan otomatis subtotal, diskon (persen atau nominal rupiah), dan grand total.
   - Shortcut keyboard: `F4` untuk langsung membuka modal pembayaran, `Escape` untuk menutup modal.

2. **Proses Pembayaran:**
   - Metode pembayaran: **Tunai**, **QRIS**, dan **Kartu Debit**.
   - Tombol nominal uang cepat (*Uang Pas, 10.000, 20.000, 50.000, 100.000*).
   - Perhitungan uang kembalian secara otomatis dengan validasi anti-kurang bayar.
   - Perlindungan anti-klik ganda (*race condition protection*).

3. **Struk Pembayaran Thermal:**
   - Desain struk kasir profesional dengan identitas toko, rincian barang, total, dan kembalian.
   - Dukungan cetak fisik langsung via `@media print` (hanya struk yang dicetak, elemen website otomatis disembunyikan).

4. **Manajemen Produk & Stok (CRUD):**
   - Tambah produk baru dengan generator ID otomatis (`PRD-xxx`).
   - Edit informasi produk, harga jual, dan stok barang.
   - Hapus produk dengan konfirmasi aman (tidak merusak data riwayat transaksi lama).
   - Filter berdasarkan kategori dan status ketersediaan stok (*Tersedia, Menipis, Habis*).

5. **Dashboard Analitik:**
   - Kartu ringkasan harian: Total Omzet Penjualan, Jumlah Transaksi, Total Barang Terjual, dan Jumlah Produk Menipis.
   - Grafik tren penjualan 7 hari terakhir berbasis HTML5 Canvas murni (tanpa library pihak ketiga).
   - Daftar barang yang perlu segera di-restok (stok ≤ 5).
   - Tabel transaksi kasir terbaru.

6. **Riwayat Transaksi:**
   - Pencarian berdasarkan nomor transaksi (`TX-YYYYMMDD-XXXX`).
   - Filter transaksi berdasarkan status (*Berhasil / Dibatalkan*) dan tanggal.
   - Rincian detail transaksi lengkap.
   - Cetak ulang struk pembayaran kapan saja.
   - Fitur **Batalkan Transaksi**: otomatis mengembalikan kuantitas stok barang ke inventaris toko secara aman (hanya 1x).
   - Ekspor riwayat transaksi ke format **CSV** yang kompatibel dengan Microsoft Excel (dengan UTF-8 BOM).

7. **Laporan Penjualan:**
   - Filter rentang waktu: *Hari Ini, 7 Hari Terakhir, Bulan Ini, dan Semua Waktu*.
   - Metrik total omzet kotor, jumlah transaksi sah, total unit terjual, dan rata-rata nilai transaksi (AOV).
   - Peringkat 10 Produk Terlaris (*Top Selling Products*).
   - Unduh laporan lengkap dalam format CSV.

8. **Pengaturan Toko & Keamanan Data:**
   - Ubah nama toko, alamat, nomor telepon/WhatsApp, dan nama kasir bertugas.
   - Fitur *Pulihkan Katalog Demo* jika ingin kembali ke data sembako bawaan.
   - Fitur *Reset Seluruh Data* dengan dialog konfirmasi aman.
   - Seluruh data tersimpan secara lokal dan persisten di browser menggunakan `localStorage`.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5:** Struktur semantik, aksesibel, dan ramah SEO.
- **Vanilla CSS3:** Desain kustom elegan dengan palet warna *Forest Green*, responsif (Desktop, Tablet, Mobile), dan print stylesheet.
- **Vanilla JavaScript (ES6+):** Logika aplikasi modular, *state management*, event handling, dan manipulasi DOM tanpa framework.
- **Web Storage API (`localStorage`):** Penyimpanan data lokal tanpa perlu server/database backend eksternal.
- **Lucide Icons:** Ikon modern yang konsisten dan ringan.
- **Google Fonts (Inter):** Tipografi retail modern dan mudah dibaca.

---

## 🚀 Cara Menjalankan

Aplikasi ini dapat langsung dibuka di peramban web modern tanpa perlu instalasi rumit:

1. Clone repositori ini:
   ```bash
   git clone https://github.com/Yass2251/Kasir-sembako.git
   ```
2. Buka folder proyek:
   ```bash
   cd Kasir-sembako
   ```
3. Buka file `index.html` langsung di browser favorit Anda (Google Chrome, Microsoft Edge, Firefox, dll), atau gunakan ekstensi seperti Live Server di VS Code.

---

## 📂 Struktur File

```text
├── index.html       # Struktur antarmuka Single Page Application (SPA) & Modal
├── style.css        # Tata letak, tema warna Forest Green, responsivitas & cetak struk
├── script.js        # Logika sistem kasir, manajemen inventaris, perhitungan & storage
└── README.md        # Dokumentasi lengkap proyek
```

---

Dibuat dengan ❤️ untuk pembelajaran kejuruan SMK PPLG & pelaku usaha retail sembako/minimarket.

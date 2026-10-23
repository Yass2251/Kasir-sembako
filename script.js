/**
 * ============================================================================
 * FRESHMART POS - LOGIKA APLIKASI UTAMA
 * Sistem Kasir & Manajemen Stok Minimarket
 * 
 * Modul ini dirancang dengan Vanilla JavaScript murni, mudah dipelajari
 * oleh siswa SMK PPLG, terstruktur dengan pola:
 * 1. State & Model Data
 * 2. Layanan Penyimpanan (Storage Service / localStorage)
 * 3. Format & Utility Helpers
 * 4. Logika Bisnis & Perhitungan
 * 5. Komponen UI (Toast, Modal, Render Halaman)
 * 6. Event Listeners & Inisialisasi
 * ============================================================================
 */

// ============================================================================
// 1. DATA DEMO AWAL (SEEDED DATA)
// ============================================================================
const DEMO_SETTINGS = {
  storeName: 'FreshMart Sembako & Minimarket',
  storeAddress: 'Jl. Melati Raya No. 18, Kebon Jeruk, Jakarta Barat',
  storePhone: '0812-9876-5432',
  cashierName: 'Budi Santoso'
};

const DEMO_PRODUCTS = [
  { id: 'PRD-001', name: 'Beras Ramos Super 5kg', category: 'Sembako', price: 69000, stock: 24, unit: 'pcs', emoji: '🌾' },
  { id: 'PRD-002', name: 'Minyak Goreng Sawit 2L', category: 'Sembako', price: 34500, stock: 30, unit: 'pouch', emoji: '🛢️' },
  { id: 'PRD-003', name: 'Gula Pasir Kristal Putih 1kg', category: 'Sembako', price: 17500, stock: 45, unit: 'kg', emoji: '🍚' },
  { id: 'PRD-004', name: 'Telur Ayam Negeri Segar 1kg', category: 'Sembako', price: 28000, stock: 18, unit: 'kg', emoji: '🥚' },
  { id: 'PRD-005', name: 'Susu UHT Full Cream 1 Liter', category: 'Minuman', price: 19500, stock: 15, unit: 'botol', emoji: '🥛' },
  { id: 'PRD-006', name: 'Air Mineral Pegunungan 600ml', category: 'Minuman', price: 3500, stock: 65, unit: 'botol', emoji: '💧' },
  { id: 'PRD-007', name: 'Mi Instan Goreng Spesial', category: 'Makanan', price: 3200, stock: 90, unit: 'bungkus', emoji: '🍜' },
  { id: 'PRD-008', name: 'Roti Tawar Gandum Premium', category: 'Makanan', price: 15000, stock: 10, unit: 'pack', emoji: '🍞' },
  { id: 'PRD-009', name: 'Apel Fuji Segar Impor', category: 'Sayur & Buah', price: 38000, stock: 16, unit: 'kg', emoji: '🍎' },
  { id: 'PRD-010', name: 'Pisang Cavendish Sunpride', category: 'Sayur & Buah', price: 22000, stock: 12, unit: 'kg', emoji: '🍌' },
  { id: 'PRD-011', name: 'Sabun Cuci Piring Jeruk Nipis 750ml', category: 'Kebutuhan Rumah', price: 13500, stock: 20, unit: 'pouch', emoji: '🧴' },
  { id: 'PRD-012', name: 'Tisu Wajah Halus 250 Sheets', category: 'Kebutuhan Rumah', price: 11000, stock: 28, unit: 'pack', emoji: '🧻' },
  { id: 'PRD-013', name: 'Kopi Susu Instan Renceng (10x)', category: 'Minuman', price: 16000, stock: 35, unit: 'renceng', emoji: '☕' },
  { id: 'PRD-014', name: 'Garam Dapur Beryodium 250g', category: 'Sembako', price: 4000, stock: 50, unit: 'pcs', emoji: '🧂' },
  { id: 'PRD-015', name: 'Bawang Merah Brebes 500g', category: 'Sayur & Buah', price: 18000, stock: 4, unit: 'pack', emoji: '🧅' }, // Menipis
  { id: 'PRD-016', name: 'Bawang Putih Kating 500g', category: 'Sayur & Buah', price: 21000, stock: 0, unit: 'pack', emoji: '🧄' }  // Habis
];

/**
 * Buat data contoh transaksi beberapa hari ke belakang untuk demo laporan yang realistis
 */
function createDemoTransactions() {
  const now = new Date();
  const txList = [];

  // Helper untuk membuat tanggal beberapa hari lalu
  const pastDate = (daysAgo, hours = 10, mins = 30) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, mins, 0, 0);
    return d.toISOString();
  };

  txList.push({
    id: 'TX-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-0001',
    timestamp: pastDate(0, 9, 15),
    cashier: 'Budi Santoso',
    items: [
      { id: 'PRD-001', name: 'Beras Ramos Super 5kg', price: 69000, qty: 1, unit: 'pcs', subtotal: 69000 },
      { id: 'PRD-002', name: 'Minyak Goreng Sawit 2L', price: 34500, qty: 1, unit: 'pouch', subtotal: 34500 }
    ],
    subtotal: 103500,
    discount: 3500,
    total: 100000,
    method: 'Tunai',
    cashReceived: 100000,
    change: 0,
    status: 'Berhasil'
  });

  txList.push({
    id: 'TX-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-0002',
    timestamp: pastDate(0, 10, 40),
    cashier: 'Budi Santoso',
    items: [
      { id: 'PRD-006', name: 'Air Mineral Pegunungan 600ml', price: 3500, qty: 3, unit: 'botol', subtotal: 10500 },
      { id: 'PRD-007', name: 'Mi Instan Goreng Spesial', price: 3200, qty: 5, unit: 'bungkus', subtotal: 16000 }
    ],
    subtotal: 26500,
    discount: 0,
    total: 26500,
    method: 'QRIS',
    cashReceived: 26500,
    change: 0,
    status: 'Berhasil'
  });

  txList.push({
    id: 'TX-20261022-0003',
    timestamp: pastDate(1, 14, 20),
    cashier: 'Budi Santoso',
    items: [
      { id: 'PRD-004', name: 'Telur Ayam Negeri Segar 1kg', price: 28000, qty: 2, unit: 'kg', subtotal: 56000 },
      { id: 'PRD-003', name: 'Gula Pasir Kristal Putih 1kg', price: 17500, qty: 1, unit: 'kg', subtotal: 17500 }
    ],
    subtotal: 73500,
    discount: 0,
    total: 73500,
    method: 'Debit',
    cashReceived: 73500,
    change: 0,
    status: 'Berhasil'
  });

  txList.push({
    id: 'TX-20261021-0004',
    timestamp: pastDate(2, 11, 10),
    cashier: 'Budi Santoso',
    items: [
      { id: 'PRD-009', name: 'Apel Fuji Segar Impor', price: 38000, qty: 1, unit: 'kg', subtotal: 38000 },
      { id: 'PRD-010', name: 'Pisang Cavendish Sunpride', price: 22000, qty: 1, unit: 'kg', subtotal: 22000 }
    ],
    subtotal: 60000,
    discount: 5000,
    total: 55000,
    method: 'Tunai',
    cashReceived: 60000,
    change: 5000,
    status: 'Berhasil'
  });

  txList.push({
    id: 'TX-20261020-0005',
    timestamp: pastDate(3, 16, 50),
    cashier: 'Budi Santoso',
    items: [
      { id: 'PRD-011', name: 'Sabun Cuci Piring Jeruk Nipis 750ml', price: 13500, qty: 2, unit: 'pouch', subtotal: 27000 },
      { id: 'PRD-012', name: 'Tisu Wajah Halus 250 Sheets', price: 11000, qty: 1, unit: 'pack', subtotal: 11000 }
    ],
    subtotal: 38000,
    discount: 0,
    total: 38000,
    method: 'Tunai',
    cashReceived: 50000,
    change: 12000,
    status: 'Berhasil'
  });

  return txList;
}

// ============================================================================
// 2. STORAGE SERVICE (Penyimpanan LocalStorage)
// ============================================================================
const STORAGE_KEYS = {
  PRODUCTS: 'freshmart_products_v1',
  TRANSACTIONS: 'freshmart_transactions_v1',
  SETTINGS: 'freshmart_settings_v1'
};

const StorageService = {
  /** Membaca pengaturan toko */
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEMO_SETTINGS));
        return { ...DEMO_SETTINGS };
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca settings:', e);
      return { ...DEMO_SETTINGS };
    }
  },

  /** Menyimpan pengaturan toko */
  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Gagal menyimpan settings:', e);
    }
  },

  /** Membaca daftar produk */
  getProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
        return [...DEMO_PRODUCTS];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca produk:', e);
      return [...DEMO_PRODUCTS];
    }
  },

  /** Menyimpan daftar produk */
  saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Gagal menyimpan produk:', e);
    }
  },

  /** Membaca riwayat transaksi */
  getTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!data) {
        const demoTx = createDemoTransactions();
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(demoTx));
        return demoTx;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca transaksi:', e);
      return [];
    }
  },

  /** Menyimpan riwayat transaksi */
  saveTransactions(transactions) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Gagal menyimpan transaksi:', e);
    }
  },

  /** Mengembalikan produk ke default demo */
  restoreDemoProducts() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
    return [...DEMO_PRODUCTS];
  },

  /** Reset seluruh data ke kondisi awal */
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};

// ============================================================================
// 3. STATE APLIKASI
// ============================================================================
const AppState = {
  currentPage: 'kasir',
  settings: StorageService.getSettings(),
  products: StorageService.getProducts(),
  transactions: StorageService.getTransactions(),
  
  // Keranjang belanja kasir
  cart: [],
  discountType: 'percent', // 'percent' | 'nominal'
  discountValue: 0,
  
  // Filter Kasir
  kasirSearch: '',
  kasirCategory: 'Semua',

  // Filter Produk CRUD
  prodSearch: '',
  prodCategory: 'Semua',
  prodStockFilter: 'Semua',

  // Filter Riwayat Transaksi
  txSearch: '',
  txStatusFilter: 'Semua',
  txDateFilter: '',

  // Filter Laporan
  reportPeriod: 'today', // 'today' | 'week' | 'month' | 'all'

  // Flag keamanan pembayaran agar tidak submit ganda
  isProcessingPayment: false,

  // Transaksi aktif yang sedang dilihat struknya
  currentReceiptTx: null
};

// ============================================================================
// 4. FORMATTERS & HELPER FUNCTIONS
// ============================================================================

/**
 * Format angka ke format mata uang Rupiah Indonesia
 * Contoh: 69000 -> "Rp 69.000"
 */
function formatRupiah(amount) {
  const num = Number(amount) || 0;
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

/**
 * Format tanggal dan waktu ke bahasa Indonesia
 * Contoh: "23 Okt 2026, 10:15 WIB"
 */
function formatDateTime(isoString) {
  if (!isoString) return '-';
  const d = new Date(isoString);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return d.toLocaleDateString('id-ID', options);
}

/**
 * Format tanggal saja (DD/MM/YYYY)
 */
function formatDateOnly(isoString) {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID');
}

/**
 * Generate ID unik transaksi format: TX-YYYYMMDD-XXXX
 */
function generateTxId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Hitung jumlah transaksi di hari yang sama untuk urutan nomor
  const sameDayCount = AppState.transactions.filter(t => t.id && t.id.includes(`TX-${dateStr}`)).length + 1;
  const seq = String(sameDayCount).padStart(4, '0');
  return `TX-${dateStr}-${seq}`;
}

/**
 * Generate ID baru produk format: PRD-XXX
 */
function generateProductId() {
  const numbers = AppState.products
    .map(p => {
      const match = p.id.match(/PRD-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !isNaN(n));
  
  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `PRD-${String(max + 1).padStart(3, '0')}`;
}

/**
 * Sanitize teks untuk CSV agar aman dibuka di Excel
 */
function escapeCsv(str) {
  if (str === null || str === undefined) return '""';
  const s = String(str).replace(/"/g, '""');
  return `"${s}"`;
}

// ============================================================================
// 5. TOAST & MODAL NOTIFICATION HELPERS
// ============================================================================

/**
 * Menampilkan notifikasi Toast modern
 * @param {string} message Pesan yang ingin disampaikan
 * @param {'success'|'warning'|'error'} type Tipe notifikasi
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-circle';
  if (type === 'warning') iconName = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons({ root: toast });

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.25s forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 260);
  }, 3200);
}

/**
 * Modal konfirmasi kustom pengganti window.confirm / prompt
 */
let confirmCallback = null;

function showConfirmModal({ title = 'Konfirmasi Tindakan', message, onConfirm, isDanger = false }) {
  const modal = document.getElementById('modal-confirm');
  const titleEl = document.getElementById('confirm-title');
  const messageEl = document.getElementById('confirm-message');
  const proceedBtn = document.getElementById('btn-confirm-proceed');
  const iconWrap = document.getElementById('confirm-icon-wrap');

  titleEl.textContent = title;
  messageEl.textContent = message;

  if (isDanger) {
    proceedBtn.className = 'btn-danger';
    iconWrap.style.backgroundColor = 'var(--c-danger-bg)';
    iconWrap.style.color = 'var(--c-danger)';
  } else {
    proceedBtn.className = 'btn-primary';
    iconWrap.style.backgroundColor = 'var(--c-soft-green)';
    iconWrap.style.color = 'var(--c-forest-green)';
  }

  confirmCallback = onConfirm;
  modal.style.display = 'flex';
}

function hideConfirmModal() {
  const modal = document.getElementById('modal-confirm');
  modal.style.display = 'none';
  confirmCallback = null;
}

// ============================================================================
// 6. LOGIKA KASIR & KERANJANG (POS)
// ============================================================================

/**
 * Tambah item ke keranjang belanja
 */
function addToCart(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) {
    showToast('Produk tidak ditemukan!', 'error');
    return;
  }

  if (product.stock <= 0) {
    showToast(`Stok ${product.name} telah habis!`, 'warning');
    return;
  }

  const existingItem = AppState.cart.find(item => item.id === productId);

  if (existingItem) {
    if (existingItem.qty >= product.stock) {
      showToast(`Stok maksimal ${product.name} hanya tersisa ${product.stock} ${product.unit}`, 'warning');
      return;
    }
    existingItem.qty += 1;
    existingItem.subtotal = existingItem.qty * existingItem.price;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      qty: 1,
      subtotal: product.price
    });
  }

  renderCart();
  renderKasirCatalog(); // perbarui status tombol/indikator stok bila perlu
}

/**
 * Ubah kuantitas produk di keranjang
 */
function updateCartQty(productId, delta) {
  const cartItem = AppState.cart.find(item => item.id === productId);
  if (!cartItem) return;

  const product = AppState.products.find(p => p.id === productId);
  const maxStock = product ? product.stock : 9999;

  const newQty = cartItem.qty + delta;

  if (newQty <= 0) {
    // Hapus dari keranjang
    AppState.cart = AppState.cart.filter(item => item.id !== productId);
  } else if (newQty > maxStock) {
    showToast(`Jumlah melebihi stok yang tersedia (${maxStock} ${cartItem.unit})`, 'warning');
    return;
  } else {
    cartItem.qty = newQty;
    cartItem.subtotal = cartItem.qty * cartItem.price;
  }

  renderCart();
}

/**
 * Hapus produk tertentu dari keranjang
 */
function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(item => item.id !== productId);
  renderCart();
}

/**
 * Kosongkan seluruh isi keranjang
 */
function clearCart(silent = false) {
  if (AppState.cart.length === 0) return;

  if (silent) {
    AppState.cart = [];
    AppState.discountValue = 0;
    renderCart();
    return;
  }

  showConfirmModal({
    title: 'Kosongkan Keranjang?',
    message: 'Semua barang di keranjang belanja akan dihapus.',
    isDanger: true,
    onConfirm: () => {
      AppState.cart = [];
      AppState.discountValue = 0;
      renderCart();
      showToast('Keranjang telah dikosongkan', 'success');
    }
  });
}

/**
 * Menghitung rincian kalkulasi belanja (Subtotal, Diskon, Total)
 */
function calculateCartTotals() {
  const subtotal = AppState.cart.reduce((sum, item) => sum + item.subtotal, 0);
  let discountAmount = 0;

  if (AppState.discountValue > 0 && subtotal > 0) {
    if (AppState.discountType === 'percent') {
      discountAmount = (subtotal * AppState.discountValue) / 100;
    } else {
      discountAmount = AppState.discountValue;
    }
  }

  // Diskon tidak boleh melebihi subtotal
  discountAmount = Math.min(discountAmount, subtotal);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  return { subtotal, discountAmount, grandTotal };
}

/**
 * Render visual daftar produk di halaman Kasir
 */
function renderKasirCatalog() {
  const grid = document.getElementById('kasir-product-grid');
  const emptyState = document.getElementById('kasir-empty-state');
  if (!grid) return;

  const searchKeyword = AppState.kasirSearch.trim().toLowerCase();
  const selectedCat = AppState.kasirCategory;

  const filtered = AppState.products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchKeyword) || prod.id.toLowerCase().includes(searchKeyword);
    const matchesCat = (selectedCat === 'Semua') || (prod.category === selectedCat);
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'flex';
    lucide.createIcons({ root: emptyState });
    return;
  }

  emptyState.style.display = 'none';

  grid.innerHTML = filtered.map(prod => {
    const isOutOfStock = prod.stock <= 0;
    const isLowStock = prod.stock > 0 && prod.stock <= 5;
    
    // Status label
    let stockTagHtml = `<span class="card-prod-stock">${prod.stock} ${prod.unit}</span>`;
    if (isOutOfStock) {
      stockTagHtml = `<span class="card-prod-stock stock-tag-out">Habis</span>`;
    } else if (isLowStock) {
      stockTagHtml = `<span class="card-prod-stock stock-tag-low">Sisa ${prod.stock} ${prod.unit}</span>`;
    }

    const emojiDisplay = prod.emoji || '📦';

    return `
      <div class="pos-product-card ${isOutOfStock ? 'out-of-stock' : ''}" 
           data-id="${prod.id}" 
           title="${isOutOfStock ? 'Stok habis' : 'Klik untuk tambah ke keranjang'}">
        <div class="card-prod-top">
          <div class="card-prod-avatar">${emojiDisplay}</div>
          <span class="card-prod-cat">${prod.category}</span>
        </div>
        <div class="card-prod-sku">${prod.id}</div>
        <h4 class="card-prod-name">${prod.name}</h4>
        <div class="card-prod-bottom">
          <div>
            <div class="card-prod-price">${formatRupiah(prod.price)}</div>
            <div class="card-prod-unit">per ${prod.unit}</div>
          </div>
          ${stockTagHtml}
        </div>
      </div>
    `;
  }).join('');

  // Pasang event listener klik pada masing-masing kartu
  grid.querySelectorAll('.pos-product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      addToCart(id);
    });
  });
}

/**
 * Render panel keranjang belanja
 */
function renderCart() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountTextEl = document.getElementById('cart-discount-text');
  const grandTotalEl = document.getElementById('cart-grand-total');
  const checkoutBtn = document.getElementById('btn-open-payment');
  const clearBtn = document.getElementById('cart-clear-btn');

  if (!container) return;

  const { subtotal, discountAmount, grandTotal } = calculateCartTotals();

  subtotalEl.textContent = formatRupiah(subtotal);
  discountTextEl.textContent = discountAmount > 0 ? `- ${formatRupiah(discountAmount)}` : 'Rp 0';
  grandTotalEl.textContent = formatRupiah(grandTotal);

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <i data-lucide="shopping-bag" class="cart-empty-icon"></i>
        <p>Keranjang belanja masih kosong.<br>Pilih produk di katalog untuk bertransaksi.</p>
      </div>
    `;
    checkoutBtn.disabled = true;
    clearBtn.style.visibility = 'hidden';
    lucide.createIcons({ root: container });
    return;
  }

  checkoutBtn.disabled = false;
  clearBtn.style.visibility = 'visible';

  container.innerHTML = AppState.cart.map(item => {
    const product = AppState.products.find(p => p.id === item.id);
    const maxStock = product ? product.stock : 999;
    const isMax = item.qty >= maxStock;

    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-title" title="${item.name}">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)} / ${item.unit}</div>
        </div>

        <div class="cart-item-controls">
          <button class="qty-btn btn-decrease" data-id="${item.id}" title="Kurangi">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn btn-increase" data-id="${item.id}" ${isMax ? 'disabled' : ''} title="Tambah">+</button>
        </div>

        <div class="cart-item-subtotal">${formatRupiah(item.subtotal)}</div>

        <button class="btn-icon cart-item-del" data-id="${item.id}" title="Hapus dari keranjang">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
  }).join('');

  lucide.createIcons({ root: container });

  // Event listener untuk tombol kuantitas & hapus
  container.querySelectorAll('.btn-decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCartQty(btn.getAttribute('data-id'), -1);
    });
  });

  container.querySelectorAll('.btn-increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCartQty(btn.getAttribute('data-id'), 1);
    });
  });

  container.querySelectorAll('.cart-item-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromCart(btn.getAttribute('data-id'));
    });
  });
}

// ============================================================================
// 7. PROSES PEMBAYARAN & STRUK
// ============================================================================

let selectedPaymentMethod = 'Tunai';

/**
 * Membuka Modal Pembayaran
 */
function openPaymentModal() {
  if (AppState.cart.length === 0) {
    showToast('Keranjang masih kosong', 'warning');
    return;
  }

  const { grandTotal } = calculateCartTotals();
  const modal = document.getElementById('modal-payment');
  const payTotalEl = document.getElementById('pay-modal-total');
  const cashInput = document.getElementById('pay-cash-input');

  payTotalEl.textContent = formatRupiah(grandTotal);

  // Set default Tunai
  selectedPaymentMethod = 'Tunai';
  document.querySelectorAll('.pay-method-card').forEach(card => {
    if (card.getAttribute('data-method') === 'Tunai') {
      card.classList.add('active');
      card.querySelector('input').checked = true;
    } else {
      card.classList.remove('active');
    }
  });

  // Tampilkan form tunai
  document.getElementById('cash-input-section').style.display = 'block';
  document.getElementById('non-cash-info-section').style.display = 'none';

  // Kosongkan input & hitung awal
  cashInput.value = '';
  updateChangeDisplay();

  modal.style.display = 'flex';
  setTimeout(() => cashInput.focus(), 150);
}

/**
 * Menutup Modal Pembayaran
 */
function closePaymentModal() {
  const modal = document.getElementById('modal-payment');
  modal.style.display = 'none';
  AppState.isProcessingPayment = false;
}

/**
 * Update perhitungan kembalian di modal pembayaran
 */
function updateChangeDisplay() {
  const { grandTotal } = calculateCartTotals();
  const cashInput = document.getElementById('pay-cash-input');
  const changeValEl = document.getElementById('pay-modal-change');
  const warningEl = document.getElementById('pay-modal-warning');
  const confirmBtn = document.getElementById('btn-confirm-payment');

  if (selectedPaymentMethod === 'Tunai') {
    const rawVal = parseFloat(cashInput.value) || 0;
    const change = rawVal - grandTotal;

    if (rawVal < grandTotal) {
      changeValEl.textContent = formatRupiah(0);
      changeValEl.style.color = 'var(--c-danger)';
      warningEl.style.display = rawVal > 0 ? 'block' : 'none';
      confirmBtn.disabled = true;
    } else {
      changeValEl.textContent = formatRupiah(change);
      changeValEl.style.color = 'var(--c-forest-green)';
      warningEl.style.display = 'none';
      confirmBtn.disabled = false;
    }
  } else {
    // Non-tunai (QRIS / Debit) selalu uang pas
    changeValEl.textContent = formatRupiah(0);
    changeValEl.style.color = 'var(--c-forest-green)';
    warningEl.style.display = 'none';
    confirmBtn.disabled = false;
  }
}

/**
 * Eksekusi Pembayaran dan Penyimpanan Transaksi
 */
function processPayment() {
  if (AppState.isProcessingPayment) return; // Mencegah double submit
  if (AppState.cart.length === 0) return;

  const { subtotal, discountAmount, grandTotal } = calculateCartTotals();
  const cashInput = document.getElementById('pay-cash-input');

  let cashReceived = grandTotal;
  let change = 0;

  if (selectedPaymentMethod === 'Tunai') {
    cashReceived = parseFloat(cashInput.value) || 0;
    if (cashReceived < grandTotal) {
      showToast('Uang yang dimasukkan kurang dari total tagihan!', 'error');
      return;
    }
    change = cashReceived - grandTotal;
  }

  // Kunci flag agar tidak diproses ganda
  AppState.isProcessingPayment = true;

  // 1. Kurangi stok produk di database
  const updatedProducts = AppState.products.map(prod => {
    const cartItem = AppState.cart.find(c => c.id === prod.id);
    if (cartItem) {
      const newStock = Math.max(0, prod.stock - cartItem.qty);
      return { ...prod, stock: newStock };
    }
    return prod;
  });

  AppState.products = updatedProducts;
  StorageService.saveProducts(AppState.products);

  // 2. Buat snapshot transaksi immutable
  const newTx = {
    id: generateTxId(),
    timestamp: new Date().toISOString(),
    cashier: AppState.settings.cashierName || 'Kasir',
    items: AppState.cart.map(c => ({
      id: c.id,
      name: c.name,
      price: c.price,
      qty: c.qty,
      unit: c.unit,
      subtotal: c.subtotal
    })),
    subtotal: subtotal,
    discount: discountAmount,
    total: grandTotal,
    method: selectedPaymentMethod,
    cashReceived: cashReceived,
    change: change,
    status: 'Berhasil'
  };

  AppState.transactions.unshift(newTx);
  StorageService.saveTransactions(AppState.transactions);

  // 3. Reset keranjang
  clearCart(true);

  // 4. Tutup modal bayar & Tampilkan notifikasi
  closePaymentModal();
  showToast(`Transaksi ${newTx.id} berhasil disimpan!`, 'success');

  // 5. Buka struk belanja
  openReceiptModal(newTx);

  // 6. Refresh tampilan data
  renderKasirCatalog();
  renderDashboard();
  renderProductsTable();
  renderTransactionsTable();
  renderReport();
}

/**
 * Membuka Modal Struk Belanja
 */
function openReceiptModal(tx) {
  AppState.currentReceiptTx = tx;

  const modal = document.getElementById('modal-receipt');
  document.getElementById('rcpt-store-name').textContent = AppState.settings.storeName;
  document.getElementById('rcpt-store-address').textContent = AppState.settings.storeAddress;
  document.getElementById('rcpt-store-phone').textContent = AppState.settings.storePhone ? `Telp: ${AppState.settings.storePhone}` : '';

  document.getElementById('rcpt-tx-id').textContent = tx.id;
  document.getElementById('rcpt-datetime').textContent = formatDateTime(tx.timestamp);
  document.getElementById('rcpt-cashier').textContent = tx.cashier;

  // Daftar item
  const itemsContainer = document.getElementById('rcpt-items-list');
  itemsContainer.innerHTML = tx.items.map(item => `
    <div class="receipt-item-row">
      <div class="r-item-top">
        <span>${item.name}</span>
        <span>${formatRupiah(item.subtotal)}</span>
      </div>
      <div class="r-item-sub">
        <span>${item.qty} ${item.unit || 'pcs'} x ${formatRupiah(item.price)}</span>
      </div>
    </div>
  `).join('');

  // Totalan
  document.getElementById('rcpt-subtotal').textContent = formatRupiah(tx.subtotal);

  const discountRow = document.getElementById('rcpt-discount-row');
  if (tx.discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('rcpt-discount').textContent = `- ${formatRupiah(tx.discount)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('rcpt-grand-total').textContent = formatRupiah(tx.total);
  document.getElementById('rcpt-method').textContent = tx.method;
  document.getElementById('rcpt-paid').textContent = formatRupiah(tx.cashReceived);
  document.getElementById('rcpt-change').textContent = formatRupiah(tx.change);

  modal.style.display = 'flex';
}

function closeReceiptModal() {
  document.getElementById('modal-receipt').style.display = 'none';
  AppState.currentReceiptTx = null;
}

/**
 * Cetak Struk ke printer thermal fisik / dialog browser
 */
function printReceipt() {
  if (!AppState.currentReceiptTx) return;

  const printArea = document.getElementById('print-area');
  const receiptPaper = document.getElementById('receipt-paper');
  
  if (printArea && receiptPaper) {
    printArea.innerHTML = receiptPaper.outerHTML;
    window.print();
  }
}

// ============================================================================
// 8. CRUD PRODUK (MANAJEMEN STOK)
// ============================================================================

/**
 * Render tabel produk di halaman Produk
 */
function renderProductsTable() {
  const tbody = document.getElementById('produk-table-tbody');
  const countInfo = document.getElementById('produk-count-info');
  if (!tbody) return;

  const searchKeyword = AppState.prodSearch.trim().toLowerCase();
  const selectedCat = AppState.prodCategory;
  const stockFilter = AppState.prodStockFilter;

  const filtered = AppState.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchKeyword) || p.id.toLowerCase().includes(searchKeyword);
    const matchesCat = (selectedCat === 'Semua') || (p.category === selectedCat);

    let matchesStock = true;
    if (stockFilter === 'Tersedia') matchesStock = p.stock > 5;
    else if (stockFilter === 'Menipis') matchesStock = p.stock > 0 && p.stock <= 5;
    else if (stockFilter === 'Habis') matchesStock = p.stock === 0;

    return matchesSearch && matchesCat && matchesStock;
  });

  countInfo.textContent = `Menampilkan ${filtered.length} dari total ${AppState.products.length} produk`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center" style="padding: 36px 14px; color: var(--c-text-muted);">
          Tidak ada produk yang memenuhi kriteria pencarian.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    let stockBadge = `<span class="badge badge-success">Tersedia</span>`;
    if (p.stock === 0) {
      stockBadge = `<span class="badge badge-danger">Habis</span>`;
    } else if (p.stock <= 5) {
      stockBadge = `<span class="badge badge-warning">Menipis (${p.stock})</span>`;
    }

    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">${p.emoji || '📦'}</span>
            <strong>${p.name}</strong>
          </div>
        </td>
        <td><span class="badge badge-muted">${p.category}</span></td>
        <td>${p.unit}</td>
        <td><strong>${formatRupiah(p.price)}</strong></td>
        <td><strong>${p.stock}</strong> ${p.unit}</td>
        <td>${stockBadge}</td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-icon btn-edit-prod" data-id="${p.id}" title="Edit Produk">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="btn-icon btn-del-prod" data-id="${p.id}" title="Hapus Produk" style="color: var(--c-danger);">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons({ root: tbody });

  // Event listener Edit & Hapus
  tbody.querySelectorAll('.btn-edit-prod').forEach(btn => {
    btn.addEventListener('click', () => {
      openProductModal(btn.getAttribute('data-id'));
    });
  });

  tbody.querySelectorAll('.btn-del-prod').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteProduct(btn.getAttribute('data-id'));
    });
  });
}

/**
 * Buka modal tambah / edit produk
 */
function openProductModal(productId = null) {
  const modal = document.getElementById('modal-product');
  const titleEl = document.getElementById('product-modal-title');
  const form = document.getElementById('product-form');

  form.reset();

  if (productId) {
    const prod = AppState.products.find(p => p.id === productId);
    if (!prod) return;

    titleEl.textContent = 'Edit Data Produk';
    document.getElementById('prod-id').value = prod.id;
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-cat').value = prod.category;
    document.getElementById('prod-unit').value = prod.unit;
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-stock').value = prod.stock;
    document.getElementById('prod-emoji').value = prod.emoji || '';
  } else {
    titleEl.textContent = 'Tambah Produk Baru';
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-stock').value = 10;
  }

  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('prod-name').focus(), 150);
}

function closeProductModal() {
  document.getElementById('modal-product').style.display = 'none';
}

/**
 * Simpan data produk (Tambah Baru atau Update)
 */
function saveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('prod-id').value;
  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-cat').value;
  const unit = document.getElementById('prod-unit').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const stock = parseInt(document.getElementById('prod-stock').value, 10);
  const emoji = document.getElementById('prod-emoji').value.trim() || '📦';

  // Validasi input
  if (!name) {
    showToast('Nama produk wajib diisi!', 'warning');
    return;
  }
  if (isNaN(price) || price <= 0) {
    showToast('Harga jual harus lebih besar dari Rp 0!', 'warning');
    return;
  }
  if (isNaN(stock) || stock < 0) {
    showToast('Stok tidak boleh bernilai negatif!', 'warning');
    return;
  }

  if (id) {
    // Mode Update
    const index = AppState.products.findIndex(p => p.id === id);
    if (index !== -1) {
      AppState.products[index] = { ...AppState.products[index], name, category, unit, price, stock, emoji };
      showToast(`Produk ${name} berhasil diperbarui!`, 'success');
    }
  } else {
    // Mode Tambah Baru
    const newId = generateProductId();
    AppState.products.push({ id: newId, name, category, unit, price, stock, emoji });
    showToast(`Produk baru ${name} (${newId}) berhasil ditambahkan!`, 'success');
  }

  StorageService.saveProducts(AppState.products);
  closeProductModal();

  renderProductsTable();
  renderKasirCatalog();
  renderDashboard();
}

/**
 * Hapus produk dengan konfirmasi
 */
function deleteProduct(productId) {
  const prod = AppState.products.find(p => p.id === productId);
  if (!prod) return;

  showConfirmModal({
    title: `Hapus Produk?`,
    message: `Apakah Anda yakin ingin menghapus "${prod.name}" (${prod.id})? Produk ini tetap tersimpan dalam riwayat transaksi yang pernah dibuat sebelumnya.`,
    isDanger: true,
    onConfirm: () => {
      AppState.products = AppState.products.filter(p => p.id !== productId);
      StorageService.saveProducts(AppState.products);
      
      // Hapus juga dari keranjang jika ada
      AppState.cart = AppState.cart.filter(item => item.id !== productId);

      showToast(`Produk ${prod.name} berhasil dihapus!`, 'success');
      renderProductsTable();
      renderKasirCatalog();
      renderCart();
      renderDashboard();
    }
  });
}

// ============================================================================
// 9. RIWAYAT TRANSAKSI & PEMBATALAN (CANCEL TRANSACTION)
// ============================================================================

/**
 * Render tabel riwayat transaksi
 */
function renderTransactionsTable() {
  const tbody = document.getElementById('tx-table-tbody');
  const countInfo = document.getElementById('tx-count-info');
  if (!tbody) return;

  const searchKeyword = AppState.txSearch.trim().toLowerCase();
  const statusFilter = AppState.txStatusFilter;
  const dateFilter = AppState.txDateFilter; // YYYY-MM-DD

  const filtered = AppState.transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchKeyword);
    const matchesStatus = (statusFilter === 'Semua') || (t.status === statusFilter);
    
    let matchesDate = true;
    if (dateFilter) {
      const txDate = t.timestamp ? t.timestamp.slice(0, 10) : '';
      matchesDate = txDate === dateFilter;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  countInfo.textContent = `Menampilkan ${filtered.length} dari total ${AppState.transactions.length} transaksi`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center" style="padding: 36px 14px; color: var(--c-text-muted);">
          Tidak ditemukan riwayat transaksi yang cocok.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    const isCancelled = t.status === 'Dibatalkan';
    const totalItems = t.items.reduce((sum, item) => sum + item.qty, 0);

    const badgeStatus = isCancelled 
      ? `<span class="badge badge-danger">Dibatalkan</span>` 
      : `<span class="badge badge-success">Berhasil</span>`;

    return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${formatDateTime(t.timestamp)}</td>
        <td>${t.cashier || '-'}</td>
        <td>${totalItems} unit (${t.items.length} jenis)</td>
        <td><span class="badge badge-muted">${t.method}</span></td>
        <td><strong>${formatRupiah(t.total)}</strong></td>
        <td>${badgeStatus}</td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-icon btn-view-tx" data-id="${t.id}" title="Lihat Rincian">
              <i data-lucide="eye"></i>
            </button>
            <button class="btn-icon btn-print-tx" data-id="${t.id}" title="Cetak Ulang Struk">
              <i data-lucide="printer"></i>
            </button>
            ${!isCancelled ? `
              <button class="btn-icon btn-cancel-tx" data-id="${t.id}" title="Batalkan Transaksi" style="color: var(--c-danger);">
                <i data-lucide="x-circle"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons({ root: tbody });

  // Pasang action listener
  tbody.querySelectorAll('.btn-view-tx').forEach(btn => {
    btn.addEventListener('click', () => {
      openTxDetailModal(btn.getAttribute('data-id'));
    });
  });

  tbody.querySelectorAll('.btn-print-tx').forEach(btn => {
    btn.addEventListener('click', () => {
      const tx = AppState.transactions.find(t => t.id === btn.getAttribute('data-id'));
      if (tx) openReceiptModal(tx);
    });
  });

  tbody.querySelectorAll('.btn-cancel-tx').forEach(btn => {
    btn.addEventListener('click', () => {
      cancelTransaction(btn.getAttribute('data-id'));
    });
  });
}

/**
 * Buka modal rincian transaksi
 */
function openTxDetailModal(txId) {
  const tx = AppState.transactions.find(t => t.id === txId);
  if (!tx) return;

  const modal = document.getElementById('modal-tx-detail');
  const body = document.getElementById('tx-detail-body');
  const footer = document.getElementById('tx-detail-footer');

  const isCancelled = tx.status === 'Dibatalkan';

  body.innerHTML = `
    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 16px; font-weight: 700;">${tx.id}</span>
        <span class="badge ${isCancelled ? 'badge-danger' : 'badge-success'}">${tx.status}</span>
      </div>
      <div style="font-size: 12px; color: var(--c-text-muted);">
        <div>Waktu Transaksi: <strong>${formatDateTime(tx.timestamp)}</strong></div>
        <div>Kasir yang bertugas: <strong>${tx.cashier}</strong></div>
        <div>Metode Pembayaran: <strong>${tx.method}</strong></div>
      </div>
    </div>

    <div style="border-top: 1px solid var(--c-border); padding-top: 14px; margin-bottom: 14px;">
      <strong style="font-size: 13px;">Daftar Barang Belanja:</strong>
      <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
        ${tx.items.map(item => `
          <div style="display: flex; justify-content: space-between; background-color: var(--c-bg); padding: 8px 12px; border-radius: var(--radius-sm);">
            <div>
              <div style="font-weight: 600;">${item.name}</div>
              <small style="color: var(--c-text-muted);">${item.qty} ${item.unit || 'pcs'} x ${formatRupiah(item.price)}</small>
            </div>
            <strong>${formatRupiah(item.subtotal)}</strong>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="background-color: #FAFBF9; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--c-border);">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
        <span>Subtotal:</span>
        <span>${formatRupiah(tx.subtotal)}</span>
      </div>
      ${tx.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px; color: var(--c-green);">
          <span>Diskon:</span>
          <span>- ${formatRupiah(tx.discount)}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 16px; color: var(--c-forest-green); border-top: 1px solid var(--c-border); padding-top: 6px; margin-top: 6px;">
        <span>Total Bayar:</span>
        <span>${formatRupiah(tx.total)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--c-text-muted); margin-top: 6px;">
        <span>Nominal Diterima: ${formatRupiah(tx.cashReceived)}</span>
        <span>Kembalian: ${formatRupiah(tx.change)}</span>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <button type="button" class="btn-secondary" id="btn-tx-modal-close">Tutup</button>
    <button type="button" class="btn-primary" id="btn-tx-modal-print">
      <i data-lucide="printer"></i>
      <span>Cetak Struk</span>
    </button>
  `;

  document.getElementById('btn-tx-modal-close').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('btn-tx-modal-print').addEventListener('click', () => {
    modal.style.display = 'none';
    openReceiptModal(tx);
  });

  lucide.createIcons({ root: modal });
  modal.style.display = 'flex';
}

/**
 * Batalkan transaksi dan kembalikan stok barang satu kali
 */
function cancelTransaction(txId) {
  const tx = AppState.transactions.find(t => t.id === txId);
  if (!tx) return;

  if (tx.status === 'Dibatalkan') {
    showToast('Transaksi ini sudah berstatus dibatalkan sebelumnya!', 'warning');
    return;
  }

  showConfirmModal({
    title: 'Batalkan Transaksi?',
    message: `Yakin ingin membatalkan transaksi ${tx.id}? Seluruh stok barang (${tx.items.length} produk) akan dikembalikan ke inventaris toko dan transaksi tidak dihitung dalam omzet penjualan.`,
    isDanger: true,
    onConfirm: () => {
      // 1. Ubah status transaksi
      tx.status = 'Dibatalkan';
      tx.cancelledAt = new Date().toISOString();

      // 2. Kembalikan stok produk (Hanya 1x saat pembatalan)
      tx.items.forEach(item => {
        const product = AppState.products.find(p => p.id === item.id);
        if (product) {
          product.stock += item.qty;
        }
      });

      // 3. Simpan perubahan ke storage
      StorageService.saveTransactions(AppState.transactions);
      StorageService.saveProducts(AppState.products);

      showToast(`Transaksi ${tx.id} berhasil dibatalkan. Stok telah dikembalikan!`, 'success');

      // 4. Update seluruh tampilan
      renderTransactionsTable();
      renderKasirCatalog();
      renderProductsTable();
      renderDashboard();
      renderReport();
    }
  });
}

/**
 * Ekspor Riwayat Transaksi ke file CSV Excel-friendly
 */
function exportTransactionsCSV() {
  if (AppState.transactions.length === 0) {
    showToast('Belum ada transaksi untuk diekspor!', 'warning');
    return;
  }

  const headers = ['No Transaksi', 'Tanggal', 'Jam', 'Kasir', 'Jumlah Item', 'Subtotal', 'Diskon', 'Total Bayar', 'Metode', 'Status'];
  const rows = AppState.transactions.map(t => {
    const d = new Date(t.timestamp);
    const dateStr = d.toLocaleDateString('id-ID');
    const timeStr = d.toLocaleTimeString('id-ID', { hour12: false });
    const totalItems = t.items.reduce((sum, item) => sum + item.qty, 0);

    return [
      escapeCsv(t.id),
      escapeCsv(dateStr),
      escapeCsv(timeStr),
      escapeCsv(t.cashier || ''),
      totalItems,
      t.subtotal,
      t.discount,
      t.total,
      escapeCsv(t.method),
      escapeCsv(t.status)
    ].join(',');
  });

  // Tambahkan UTF-8 BOM agar Excel menampilkan aksara dengan benar
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `transaksi_freshmart_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('File CSV riwayat transaksi berhasil diunduh!', 'success');
}

// ============================================================================
// 10. DASHBOARD & GRAFIK RINGKAS
// ============================================================================

/**
 * Render halaman Dashboard
 */
function renderDashboard() {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter transaksi HARI INI yang BERHASIL
  const todayTx = AppState.transactions.filter(t => {
    const isToday = t.timestamp && t.timestamp.slice(0, 10) === todayStr;
    const isSuccess = t.status === 'Berhasil';
    return isToday && isSuccess;
  });

  // 1. Total Penjualan / Omzet Hari Ini
  const omzetToday = todayTx.reduce((sum, t) => sum + t.total, 0);
  document.getElementById('dash-omzet-today').textContent = formatRupiah(omzetToday);

  // 2. Jumlah Transaksi Hari Ini
  document.getElementById('dash-tx-count').textContent = todayTx.length;

  // 3. Total Barang Terjual Hari Ini
  const itemsSoldToday = todayTx.reduce((sum, t) => {
    return sum + t.items.reduce((subSum, item) => subSum + item.qty, 0);
  }, 0);
  document.getElementById('dash-items-sold').textContent = `${itemsSoldToday} unit`;

  // 4. Stok Menipis (Stok <= 5)
  const lowStockProducts = AppState.products.filter(p => p.stock <= 5);
  document.getElementById('dash-low-stock').textContent = `${lowStockProducts.length} item`;

  // 5. Render Grafik Penjualan 7 Hari Terakhir
  renderDashboardSalesChart();

  // 6. Render Tabel Perlu Diisi Ulang Segera
  renderDashboardRestockTable(lowStockProducts);

  // 7. Render 5 Transaksi Terbaru
  renderDashboardRecentTx();
}

/**
 * Menggambar grafik canvas penjualan 7 hari terakhir (Vanilla Canvas murni, zero dependencies)
 */
function renderDashboardSalesChart() {
  const canvas = document.getElementById('dashboard-sales-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Resize canvas untuk retina display
  canvas.width = rect.width * dpr;
  canvas.height = 240 * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = 240;

  ctx.clearRect(0, 0, width, height);

  // Dapatkan 7 hari terakhir
  const days = [];
  const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const label = `${dayLabels[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`;

    // Hitung total omzet berhasil di tanggal ini
    const totalDay = AppState.transactions
      .filter(t => t.timestamp && t.timestamp.slice(0, 10) === dateKey && t.status === 'Berhasil')
      .reduce((sum, t) => sum + t.total, 0);

    days.push({ dateKey, label, total: totalDay });
  }

  const maxVal = Math.max(...days.map(d => d.total), 50000);

  // Gambar Grid Horizontal
  const paddingBottom = 40;
  const paddingTop = 25;
  const paddingLeft = 10;
  const chartHeight = height - paddingBottom - paddingTop;
  const barWidth = Math.min(38, (width - 40) / days.length - 12);
  const colStep = (width - 20) / days.length;

  ctx.strokeStyle = '#E2E8E4';
  ctx.lineWidth = 1;

  for (let step = 0; step <= 3; step++) {
    const y = paddingTop + (chartHeight / 3) * step;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingLeft, y);
    ctx.stroke();
  }

  // Gambar Batang Bar Chart
  days.forEach((day, idx) => {
    const x = paddingLeft + idx * colStep + (colStep - barWidth) / 2;
    const barHeight = (day.total / maxVal) * chartHeight;
    const y = height - paddingBottom - barHeight;

    // Gradasi lembut warna hijau FreshMart
    const gradient = ctx.createLinearGradient(0, y, 0, height - paddingBottom);
    gradient.addColorStop(0, '#1F4938');
    gradient.addColorStop(1, '#397B58');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    // Round top bar
    ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barHeight);
    ctx.fill();

    // Nilai rupiah di atas bar
    if (day.total > 0) {
      ctx.fillStyle = '#202B24';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      const shortVal = day.total >= 1000000 ? `${(day.total / 1000000).toFixed(1)}jt` : `${Math.round(day.total / 1000)}k`;
      ctx.fillText(shortVal, x + barWidth / 2, y - 6);
    }

    // Label hari di bawah bar
    ctx.fillStyle = '#7A867D';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(day.label, x + barWidth / 2, height - 14);
  });
}

/**
 * Render tabel restok di dashboard
 */
function renderDashboardRestockTable(lowStockList) {
  const tbody = document.getElementById('dash-restock-tbody');
  if (!tbody) return;

  if (lowStockList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center" style="padding: 24px 10px; color: var(--c-text-muted);">
          Semua stok aman! Tidak ada produk yang menipis.
        </td>
      </tr>
    `;
    return;
  }

  // Tampilkan max 5 produk
  tbody.innerHTML = lowStockList.slice(0, 5).map(p => `
    <tr>
      <td>
        <strong style="font-size: 13px;">${p.name}</strong>
        <div style="font-size: 11px; color: var(--c-text-muted);">${p.id}</div>
      </td>
      <td><span class="badge badge-muted">${p.category}</span></td>
      <td>
        <span class="badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}">
          ${p.stock === 0 ? 'Habis' : `${p.stock} ${p.unit}`}
        </span>
      </td>
      <td>
        <button class="btn-secondary btn-sm" onclick="navigateTo('produk'); openProductModal('${p.id}');">
          Restok
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Render 5 transaksi terbaru di dashboard
 */
function renderDashboardRecentTx() {
  const tbody = document.getElementById('dash-recent-tx-tbody');
  if (!tbody) return;

  const recent = AppState.transactions.slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center" style="padding: 24px 10px; color: var(--c-text-muted);">
          Belum ada riwayat transaksi yang tercatat.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = recent.map(t => {
    const isCancelled = t.status === 'Dibatalkan';
    const totalItems = t.items.reduce((sum, item) => sum + item.qty, 0);

    return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${formatDateTime(t.timestamp)}</td>
        <td>${totalItems} unit</td>
        <td><span class="badge badge-muted">${t.method}</span></td>
        <td><strong>${formatRupiah(t.total)}</strong></td>
        <td>
          <span class="badge ${isCancelled ? 'badge-danger' : 'badge-success'}">
            ${t.status}
          </span>
        </td>
        <td>
          <button class="btn-icon" onclick="openTxDetailModal('${t.id}')" title="Rincian">
            <i data-lucide="eye"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons({ root: tbody });
}

// ============================================================================
// 11. LAPORAN PENJUALAN & ANALITIK
// ============================================================================

/**
 * Filter transaksi berdasarkan periode yang dipilih
 */
function getTransactionsByPeriod(period) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  return AppState.transactions.filter(t => {
    if (t.status !== 'Berhasil') return false; // Hanya transaksi yang berhasil

    const txTime = new Date(t.timestamp).getTime();

    if (period === 'today') {
      return txTime >= startOfDay;
    } else if (period === 'week') {
      const sevenDaysAgo = startOfDay - (6 * 24 * 60 * 60 * 1000);
      return txTime >= sevenDaysAgo;
    } else if (period === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return txTime >= startOfMonth;
    } else {
      // 'all'
      return true;
    }
  });
}

/**
 * Render seluruh bagian halaman Laporan
 */
function renderReport() {
  const filteredTx = getTransactionsByPeriod(AppState.reportPeriod);

  // 1. Total Omzet
  const totalRevenue = filteredTx.reduce((sum, t) => sum + t.total, 0);
  document.getElementById('report-total-revenue').textContent = formatRupiah(totalRevenue);

  // 2. Transaksi Berhasil
  document.getElementById('report-tx-success').textContent = filteredTx.length;

  // 3. Total Barang Terjual
  const totalItemsSold = filteredTx.reduce((sum, t) => {
    return sum + t.items.reduce((itemSum, item) => itemSum + item.qty, 0);
  }, 0);
  document.getElementById('report-items-sold').textContent = `${totalItemsSold} unit`;

  // 4. Rata-rata Nilai Transaksi (AOV)
  const avgTx = filteredTx.length > 0 ? totalRevenue / filteredTx.length : 0;
  document.getElementById('report-avg-tx').textContent = formatRupiah(avgTx);

  // 5. Render Top 10 Produk Terlaris
  renderReportTopProducts(filteredTx);

  // 6. Render Rincian Transaksi
  renderReportTxDetail(filteredTx);

  // 7. Render Grafik Omzet Periode
  renderReportSalesChart(filteredTx);
}

/**
 * Menghitung dan menampilkan 10 produk terlaris
 */
function renderReportTopProducts(txList) {
  const tbody = document.getElementById('report-top-products-tbody');
  if (!tbody) return;

  // Agregasi penjualan per produk
  const productMap = {};

  txList.forEach(t => {
    t.items.forEach(item => {
      if (!productMap[item.id]) {
        productMap[item.id] = {
          name: item.name,
          unit: item.unit || 'pcs',
          qty: 0,
          revenue: 0
        };
      }
      productMap[item.id].qty += item.qty;
      productMap[item.id].revenue += item.subtotal;
    });
  });

  const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 10);

  if (topProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center" style="padding: 24px 10px; color: var(--c-text-muted);">
          Belum ada penjualan pada periode ini.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = topProducts.map((p, index) => `
    <tr>
      <td style="font-weight: 700; color: var(--c-forest-green); width: 30px;">#${index + 1}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.qty} ${p.unit}</td>
      <td><strong>${formatRupiah(p.revenue)}</strong></td>
    </tr>
  `).join('');
}

/**
 * Render tabel rincian transaksi laporan
 */
function renderReportTxDetail(txList) {
  const tbody = document.getElementById('report-tx-detail-tbody');
  if (!tbody) return;

  if (txList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center" style="padding: 24px 10px; color: var(--c-text-muted);">
          Tidak ada data transaksi berhasil pada rentang waktu ini.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = txList.map(t => {
    const totalItems = t.items.reduce((sum, item) => sum + item.qty, 0);

    return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${formatDateTime(t.timestamp)}</td>
        <td>${t.cashier || '-'}</td>
        <td><span class="badge badge-muted">${t.method}</span></td>
        <td>${totalItems} unit</td>
        <td><strong>${formatRupiah(t.total)}</strong></td>
      </tr>
    `;
  }).join('');
}

/**
 * Menggambar grafik tren omzet laporan
 */
function renderReportSalesChart(txList) {
  const canvas = document.getElementById('report-sales-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = 240 * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = 240;

  ctx.clearRect(0, 0, width, height);

  if (txList.length === 0) {
    ctx.fillStyle = '#7A867D';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tidak ada data omzet untuk digambarkan pada periode ini.', width / 2, height / 2);
    return;
  }

  // Agregasi omzet per tanggal
  const dateMap = {};
  txList.forEach(t => {
    const dStr = t.timestamp ? t.timestamp.slice(0, 10) : 'Lainnya';
    dateMap[dStr] = (dateMap[dStr] || 0) + t.total;
  });

  const sortedDates = Object.keys(dateMap).sort();
  const maxVal = Math.max(...Object.values(dateMap), 50000);

  const paddingBottom = 40;
  const paddingTop = 25;
  const paddingLeft = 20;
  const chartHeight = height - paddingBottom - paddingTop;
  const colStep = (width - paddingLeft * 2) / Math.max(1, sortedDates.length);
  const barWidth = Math.min(42, Math.max(16, colStep - 14));

  // Garis horizontal
  ctx.strokeStyle = '#E2E8E4';
  ctx.lineWidth = 1;
  for (let step = 0; step <= 3; step++) {
    const y = paddingTop + (chartHeight / 3) * step;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingLeft, y);
    ctx.stroke();
  }

  // Bar chart
  sortedDates.forEach((dateStr, idx) => {
    const total = dateMap[dateStr];
    const x = paddingLeft + idx * colStep + (colStep - barWidth) / 2;
    const barHeight = (total / maxVal) * chartHeight;
    const y = height - paddingBottom - barHeight;

    const gradient = ctx.createLinearGradient(0, y, 0, height - paddingBottom);
    gradient.addColorStop(0, '#1F4938');
    gradient.addColorStop(1, '#397B58');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barHeight);
    ctx.fill();

    // Nilai
    ctx.fillStyle = '#202B24';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    const shortVal = total >= 1000000 ? `${(total / 1000000).toFixed(1)}jt` : `${Math.round(total / 1000)}k`;
    ctx.fillText(shortVal, x + barWidth / 2, y - 6);

    // Tanggal
    ctx.fillStyle = '#7A867D';
    ctx.font = '500 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    const parts = dateStr.split('-');
    const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateStr;
    ctx.fillText(label, x + barWidth / 2, height - 14);
  });
}

/**
 * Ekspor Laporan Penjualan ke file CSV Excel-friendly
 */
function exportReportCSV() {
  const filteredTx = getTransactionsByPeriod(AppState.reportPeriod);

  if (filteredTx.length === 0) {
    showToast('Tidak ada data penjualan pada periode ini untuk diekspor!', 'warning');
    return;
  }

  const headers = ['No Transaksi', 'Tanggal', 'Jam', 'Kasir', 'Metode', 'Item Belanja', 'Total Belanja (Omzet)'];
  const rows = filteredTx.map(t => {
    const d = new Date(t.timestamp);
    const dateStr = d.toLocaleDateString('id-ID');
    const timeStr = d.toLocaleTimeString('id-ID', { hour12: false });
    const itemsSummary = t.items.map(i => `${i.name} (${i.qty} ${i.unit || 'pcs'})`).join('; ');

    return [
      escapeCsv(t.id),
      escapeCsv(dateStr),
      escapeCsv(timeStr),
      escapeCsv(t.cashier || ''),
      escapeCsv(t.method),
      escapeCsv(itemsSummary),
      t.total
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `laporan_penjualan_freshmart_${AppState.reportPeriod}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Laporan penjualan CSV berhasil diunduh!', 'success');
}

// ============================================================================
// 12. PENGATURAN TOKO & MANAJEMEN DATA
// ============================================================================

/**
 * Muat data pengaturan ke formulir
 */
function loadSettingsToForm() {
  document.getElementById('set-store-name').value = AppState.settings.storeName || '';
  document.getElementById('set-store-address').value = AppState.settings.storeAddress || '';
  document.getElementById('set-store-phone').value = AppState.settings.storePhone || '';
  document.getElementById('set-cashier-name').value = AppState.settings.cashierName || '';

  // Update badge di header & sidebar
  updateSettingsUI();
}

/**
 * Simpan pengaturan toko
 */
function saveSettingsForm(e) {
  e.preventDefault();

  const storeName = document.getElementById('set-store-name').value.trim();
  const storeAddress = document.getElementById('set-store-address').value.trim();
  const storePhone = document.getElementById('set-store-phone').value.trim();
  const cashierName = document.getElementById('set-cashier-name').value.trim();

  if (!storeName || !storeAddress || !cashierName) {
    showToast('Nama toko, alamat, dan nama kasir wajib diisi!', 'warning');
    return;
  }

  AppState.settings = { storeName, storeAddress, storePhone, cashierName };
  StorageService.saveSettings(AppState.settings);

  updateSettingsUI();
  showToast('Pengaturan toko berhasil disimpan!', 'success');
}

/**
 * Perbarui teks nama toko & kasir di UI utama
 */
function updateSettingsUI() {
  const storeName = AppState.settings.storeName || 'FreshMart Sembako';
  const cashierName = AppState.settings.cashierName || 'Kasir';

  document.getElementById('sidebar-store-name').textContent = storeName;
  document.getElementById('sidebar-cashier-name').textContent = `Kasir: ${cashierName}`;
  document.getElementById('top-cashier-name').textContent = cashierName;
}

/**
 * Pulihkan katalog produk demo
 */
function handleRestoreDemo() {
  showConfirmModal({
    title: 'Pulihkan Katalog Demo?',
    message: 'Daftar produk standar FreshMart akan dipulihkan. Riwayat transaksi yang sudah Anda buat sebelumnya tetap aman dan tidak terhapus.',
    onConfirm: () => {
      AppState.products = StorageService.restoreDemoProducts();
      showToast('Katalog demo berhasil dipulihkan!', 'success');
      renderProductsTable();
      renderKasirCatalog();
      renderDashboard();
    }
  });
}

/**
 * Reset seluruh data (Hapus semua dari localStorage)
 */
function handleResetAllData() {
  showConfirmModal({
    title: 'Hapus Seluruh Data Lokal?',
    message: 'PERINGATAN: Tindakan ini akan menghapus seluruh data produk, riwayat transaksi, dan pengaturan toko dari browser perangkat ini. Tindakan ini tidak dapat dibatalkan.',
    isDanger: true,
    onConfirm: () => {
      StorageService.resetAll();
      AppState.products = StorageService.getProducts();
      AppState.transactions = StorageService.getTransactions();
      AppState.settings = StorageService.getSettings();
      AppState.cart = [];

      updateSettingsUI();
      loadSettingsToForm();
      renderKasirCatalog();
      renderCart();
      renderProductsTable();
      renderTransactionsTable();
      renderDashboard();
      renderReport();

      showToast('Seluruh data lokal telah direset ke setelan awal!', 'success');
      navigateTo('kasir');
    }
  });
}

// ============================================================================
// 13. NAVIGASI SPA & JAM WAKTU REAL-TIME
// ============================================================================

const PAGE_TITLES = {
  kasir: { title: 'Mesin Kasir', caption: 'Kelola transaksi penjualan langsung secara cepat' },
  dashboard: { title: 'Dashboard Utama', caption: 'Ringkasan performa penjualan dan stok barang' },
  produk: { title: 'Manajemen Produk & Stok', caption: 'Kelola katalog sembako, harga jual, dan inventaris' },
  transaksi: { title: 'Riwayat Transaksi', caption: 'Daftar seluruh transaksi kasir, pembatalan, dan struk' },
  laporan: { title: 'Laporan Penjualan', caption: 'Analisis pendapatan, produk terlaris, dan ekspor data' },
  pengaturan: { title: 'Pengaturan Toko', caption: 'Konfigurasi identitas toko, kasir, dan kelola database' }
};

/**
 * Pindah halaman Single Page Application tanpa reload
 */
function navigateTo(pageId) {
  if (!PAGE_TITLES[pageId]) pageId = 'kasir';
  AppState.currentPage = pageId;

  // 1. Update status active menu sidebar
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Switch tampilan page view
  document.querySelectorAll('.page-view').forEach(view => {
    if (view.id === `view-${pageId}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // 3. Update Title Header
  const meta = PAGE_TITLES[pageId];
  document.getElementById('page-title').textContent = meta.title;
  document.getElementById('page-caption').textContent = meta.caption;

  // 4. Tutup sidebar di perangkat mobile jika terbuka
  closeMobileSidebar();

  // 5. Refresh render halaman yang aktif
  if (pageId === 'kasir') {
    renderKasirCatalog();
    renderCart();
  } else if (pageId === 'dashboard') {
    renderDashboard();
  } else if (pageId === 'produk') {
    renderProductsTable();
  } else if (pageId === 'transaksi') {
    renderTransactionsTable();
  } else if (pageId === 'laporan') {
    renderReport();
  } else if (pageId === 'pengaturan') {
    loadSettingsToForm();
  }

  // Gulir ke atas
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Mobile Sidebar Drawer Toggles
 */
function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('active');
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('active');
}

/**
 * Jam dan Tanggal Realtime di Header
 */
function startRealtimeClock() {
  const clockEl = document.getElementById('current-datetime');
  if (!clockEl) return;

  const updateClock = () => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');

    clockEl.textContent = `${dayName}, ${dateNum} ${monthName} ${year} • ${hours}:${mins} WIB`;
  };

  updateClock();
  setInterval(updateClock, 10000);
}

// ============================================================================
// 14. EVENT LISTENERS INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Ikon Lucide
  lucide.createIcons();

  // 2. Tampilkan Nama Toko & Kasir
  updateSettingsUI();

  // 3. Mulai Jam Realtime
  startRealtimeClock();

  // 4. Navigasi Sidebar Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const page = link.getAttribute('data-page');
      navigateTo(page);
    });
  });

  // Mobile menu buttons
  document.getElementById('sidebar-toggle-btn').addEventListener('click', openMobileSidebar);
  document.getElementById('sidebar-close-btn').addEventListener('click', closeMobileSidebar);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileSidebar);

  // ==================== KASIR EVENT LISTENERS ====================
  // Pencarian produk kasir
  const kasirSearchInput = document.getElementById('kasir-search');
  const kasirSearchClear = document.getElementById('kasir-search-clear');

  kasirSearchInput.addEventListener('input', (e) => {
    AppState.kasirSearch = e.target.value;
    kasirSearchClear.style.display = AppState.kasirSearch ? 'block' : 'none';
    renderKasirCatalog();
  });

  kasirSearchClear.addEventListener('click', () => {
    kasirSearchInput.value = '';
    AppState.kasirSearch = '';
    kasirSearchClear.style.display = 'none';
    renderKasirCatalog();
    kasirSearchInput.focus();
  });

  // Filter kategori kasir
  document.getElementById('kasir-category-filters').querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#kasir-category-filters .cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.kasirCategory = pill.getAttribute('data-cat');
      renderKasirCatalog();
    });
  });

  // Kosongkan keranjang kasir
  document.getElementById('cart-clear-btn').addEventListener('click', () => clearCart());

  // Toggle dropdown diskon
  const discountBox = document.getElementById('discount-input-box');
  const btnToggleDiscount = document.getElementById('btn-toggle-discount');
  btnToggleDiscount.addEventListener('click', () => {
    const isHidden = discountBox.style.display === 'none';
    discountBox.style.display = isHidden ? 'flex' : 'none';
    btnToggleDiscount.textContent = isHidden ? 'Tutup' : 'Ubah';
  });

  // Terapkan diskon
  document.getElementById('btn-apply-discount').addEventListener('click', () => {
    const valInput = document.getElementById('discount-input-val');
    const selectedType = document.querySelector('input[name="discount-type"]:checked').value;
    const numVal = parseFloat(valInput.value) || 0;

    AppState.discountType = selectedType;
    AppState.discountValue = Math.max(0, numVal);

    renderCart();
    discountBox.style.display = 'none';
    btnToggleDiscount.textContent = 'Ubah';
    showToast('Diskon berhasil diperbarui', 'success');
  });

  // Buka Pembayaran
  document.getElementById('btn-open-payment').addEventListener('click', openPaymentModal);

  // ==================== MODAL PEMBAYARAN EVENT LISTENERS ====================
  document.getElementById('modal-payment-close').addEventListener('click', closePaymentModal);
  document.getElementById('modal-payment-cancel').addEventListener('click', closePaymentModal);

  // Pilihan metode pembayaran
  document.querySelectorAll('.pay-method-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.pay-method-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      card.querySelector('input').checked = true;

      selectedPaymentMethod = card.getAttribute('data-method');

      const cashSection = document.getElementById('cash-input-section');
      const nonCashSection = document.getElementById('non-cash-info-section');

      if (selectedPaymentMethod === 'Tunai') {
        cashSection.style.display = 'block';
        nonCashSection.style.display = 'none';
        document.getElementById('pay-cash-input').focus();
      } else {
        cashSection.style.display = 'none';
        nonCashSection.style.display = 'block';
      }

      updateChangeDisplay();
    });
  });

  // Input uang diterima realtime
  const payCashInput = document.getElementById('pay-cash-input');
  payCashInput.addEventListener('input', updateChangeDisplay);

  // Tombol uang cepat
  document.querySelectorAll('.btn-quick-cash').forEach(btn => {
    btn.addEventListener('click', () => {
      const cashType = btn.getAttribute('data-cash');
      const { grandTotal } = calculateCartTotals();

      if (cashType === 'exact') {
        payCashInput.value = grandTotal;
      } else {
        payCashInput.value = parseFloat(cashType) || 0;
      }

      updateChangeDisplay();
    });
  });

  // Selesaikan pembayaran
  document.getElementById('btn-confirm-payment').addEventListener('click', processPayment);

  // ==================== MODAL STRUK EVENT LISTENERS ====================
  document.getElementById('modal-receipt-close').addEventListener('click', closeReceiptModal);
  document.getElementById('btn-close-receipt').addEventListener('click', closeReceiptModal);
  document.getElementById('btn-print-receipt').addEventListener('click', printReceipt);

  // ==================== PRODUK CRUD EVENT LISTENERS ====================
  document.getElementById('btn-add-product').addEventListener('click', () => openProductModal());
  document.getElementById('modal-product-close').addEventListener('click', closeProductModal);
  document.getElementById('modal-product-cancel').addEventListener('click', closeProductModal);
  document.getElementById('product-form').addEventListener('submit', saveProduct);

  // Filter & Cari Produk
  document.getElementById('produk-search').addEventListener('input', (e) => {
    AppState.prodSearch = e.target.value;
    renderProductsTable();
  });

  document.getElementById('produk-filter-cat').addEventListener('change', (e) => {
    AppState.prodCategory = e.target.value;
    renderProductsTable();
  });

  document.getElementById('produk-filter-stock').addEventListener('change', (e) => {
    AppState.prodStockFilter = e.target.value;
    renderProductsTable();
  });

  // ==================== TRANSAKSI EVENT LISTENERS ====================
  document.getElementById('tx-search').addEventListener('input', (e) => {
    AppState.txSearch = e.target.value;
    renderTransactionsTable();
  });

  document.getElementById('tx-filter-status').addEventListener('change', (e) => {
    AppState.txStatusFilter = e.target.value;
    renderTransactionsTable();
  });

  document.getElementById('tx-filter-date').addEventListener('change', (e) => {
    AppState.txDateFilter = e.target.value;
    renderTransactionsTable();
  });

  document.getElementById('btn-export-tx-csv').addEventListener('click', exportTransactionsCSV);

  // Tombol di dashboard untuk lihat semua transaksi
  document.getElementById('dash-btn-view-all-tx').addEventListener('click', () => navigateTo('transaksi'));

  // Detail Transaksi Modal Close
  document.getElementById('modal-tx-detail-close').addEventListener('click', () => {
    document.getElementById('modal-tx-detail').style.display = 'none';
  });

  // ==================== LAPORAN EVENT LISTENERS ====================
  document.querySelectorAll('#report-period-group .btn-period').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#report-period-group .btn-period').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.reportPeriod = btn.getAttribute('data-period');
      renderReport();
    });
  });

  document.getElementById('btn-export-report-csv').addEventListener('click', exportReportCSV);

  // ==================== PENGATURAN EVENT LISTENERS ====================
  document.getElementById('settings-form').addEventListener('submit', saveSettingsForm);
  document.getElementById('btn-restore-demo').addEventListener('click', handleRestoreDemo);
  document.getElementById('btn-reset-all-data').addEventListener('click', handleResetAllData);

  // ==================== MODAL KONFIRMASI EVENT LISTENERS ====================
  document.getElementById('btn-confirm-cancel').addEventListener('click', hideConfirmModal);
  document.getElementById('btn-confirm-proceed').addEventListener('click', () => {
    if (typeof confirmCallback === 'function') {
      confirmCallback();
    }
    hideConfirmModal();
  });

  // ==================== KEYBOARD SHORTCUTS ====================
  window.addEventListener('keydown', (e) => {
    // Tombol F4: Shortcut buka modal pembayaran saat di kasir
    if (e.key === 'F4') {
      e.preventDefault();
      if (AppState.currentPage === 'kasir' && AppState.cart.length > 0) {
        openPaymentModal();
      }
    }

    // Tombol Escape: Tutup semua modal yang sedang terbuka
    if (e.key === 'Escape') {
      closePaymentModal();
      closeReceiptModal();
      closeProductModal();
      hideConfirmModal();
      document.getElementById('modal-tx-detail').style.display = 'none';
    }

    // Tombol Enter di dalam modal pembayaran: Selesaikan pembayaran jika valid
    const modalPayment = document.getElementById('modal-payment');
    if (modalPayment && modalPayment.style.display !== 'none' && e.key === 'Enter') {
      const confirmBtn = document.getElementById('btn-confirm-payment');
      if (confirmBtn && !confirmBtn.disabled) {
        processPayment();
      }
    }
  });

  // Redraw grafik saat layar di-resize
  window.addEventListener('resize', () => {
    if (AppState.currentPage === 'dashboard') {
      renderDashboardSalesChart();
    } else if (AppState.currentPage === 'laporan') {
      renderReportSalesChart(getTransactionsByPeriod(AppState.reportPeriod));
    }
  });

  // 5. Render Halaman Kasir sebagai Tampilan Awal
  navigateTo('kasir');
});

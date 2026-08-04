// ==========================================
// 1. LOGIKA NAVIGASI 6 MENU
// ==========================================

// Fungsi untuk berpindah menu
function bukaMenu(idMenu) {
    // Daftar ID menu sesuai urutan instruksi
    const daftarMenu = [
        'menu-disclaimer', 
        'menu-level', 
        'menu-guide', 
        'menu-utama', 
        'menu-referensi', 
        'menu-tentang'
    ];

    // Sembunyikan semua menu terlebih dahulu
    daftarMenu.forEach(menu => {
        const elemen = document.getElementById(menu);
        if (elemen) {
            elemen.style.display = 'none';
        }
    });

    // Tampilkan hanya menu yang dipanggil
    const menuAktif = document.getElementById(idMenu);
    if (menuAktif) {
        menuAktif.style.display = 'block';
    }
}


// ==========================================
// 2. LOGIKA TEMA (GELAP / TERANG / SISTEM)
// ==========================================

function ubahTema(pilihan) {
    const html = document.documentElement; // Menargetkan tag <html>

    if (pilihan === 'gelap') {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('aac_tema', 'gelap');
    } else if (pilihan === 'terang') {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('aac_tema', 'terang');
    } else {
        // Mode Sistem
        html.removeAttribute('data-theme');
        localStorage.setItem('aac_tema', 'sistem');
    }
}

function inisialisasiTema() {
    // Ambil preferensi tema sebelumnya, default ke 'sistem' jika belum ada
    const temaTersimpan = localStorage.getItem('aac_tema') || 'sistem';
    ubahTema(temaTersimpan);

    // Deteksi otomatis jika sistem HP user berubah tema (dari terang ke gelap atau sebaliknya)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('aac_tema') === 'sistem') {
            ubahTema('sistem');
        }
    });
}


// ==========================================
// 3. INISIALISASI SAAT APLIKASI DIBUKA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Tampilkan menu pertama saat web dibuka
    bukaMenu('menu-disclaimer');
    
    // Terapkan tema
    inisialisasiTema();
});

// ==========================================
// 4. TEXT-TO-SPEECH (TTS)
// ==========================================

function bicara(teks) {
    // Mengecek apakah browser mendukung fitur suara
    if ('speechSynthesis' in window) {
        const ucapan = new SpeechSynthesisUtterance(teks);
        ucapan.lang = 'id-ID'; // Menggunakan suara Bahasa Indonesia
        
        // Membatalkan suara yang sedang berjalan agar tidak bertumpuk jika anak memencet berulang kali
        window.speechSynthesis.cancel(); 
        
        window.speechSynthesis.speak(ucapan);
        
        // Setelah diucapkan, simpan ke riwayat
        tambahKeRiwayat(teks);
    } else {
        alert("Maaf, browser/perangkat Anda tidak mendukung fitur suara.");
    }
}


// ==========================================
// 5. LOGIKA RIWAYAT 24 JAM & RESET OTOMATIS
// ==========================================

function tambahKeRiwayat(kalimat) {
    cekResetRiwayat(); // Selalu cek apakah sudah jam 12 malam sebelum menambah riwayat

    let riwayat = JSON.parse(localStorage.getItem('aac_riwayat')) || [];
    let waktuSekarang = new Date().getTime();
    
    riwayat.push({ kalimat: kalimat, waktu: waktuSekarang });
    localStorage.setItem('aac_riwayat', JSON.stringify(riwayat));
}

function cekResetRiwayat() {
    let tanggalResetTerakhir = localStorage.getItem('aac_terakhir_reset');
    
    // Mengambil tanggal hari ini (berubah otomatis saat lewat jam 00:00)
    let tanggalHariIni = new Date().toLocaleDateString();

    if (tanggalResetTerakhir !== tanggalHariIni) {
        // Jika tanggal berbeda (sudah ganti hari), hapus riwayat
        localStorage.removeItem('aac_riwayat');
        localStorage.setItem('aac_terakhir_reset', tanggalHariIni);
    }
}

// Menjalankan pengecekan reset saat aplikasi pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
    cekResetRiwayat();
});

// ==========================================
// 6. LOGIKA TAMBAH KATA MANUAL (TOMBOL +)
// ==========================================

// Fungsi membuka jendela mini (modal)
function bukaModalTambah(kategori) {
    const modal = document.getElementById('modal-tambah-kata');
    if (modal) {
        // Simpan info kategori mana yang sedang ditambahkan
        document.getElementById('input-kategori-target').value = kategori;
        modal.style.display = 'block';
    }
}

// Fungsi menutup jendela mini
function tutupModalTambah() {
    const modal = document.getElementById('modal-tambah-kata');
    if (modal) {
        modal.style.display = 'none';
        // Bersihkan input setelah ditutup
        document.getElementById('input-kata-baru').value = '';
        document.getElementById('input-gambar-baru').value = '';
        document.getElementById('preview-gambar').src = '';
    }
}

// Fungsi memproses gambar yang diunggah agar bisa disimpan offline
function prosesPreviewGambar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Tampilkan gambar di elemen preview (sekaligus menyimpan kode gambarnya)
            document.getElementById('preview-gambar').src = e.target.result;
        }
        reader.readAsDataURL(file); // Ubah gambar ke teks Base64
    }
}

// Fungsi menyimpan kata ke dalam custom data
function simpanKataBaru() {
    const kategori = document.getElementById('input-kategori-target').value;
    const kataBaru = document.getElementById('input-kata-baru').value.trim();
    const gambarBase64 = document.getElementById('preview-gambar').src;

    // Validasi data kosong
    if (!kataBaru || !gambarBase64 || gambarBase64.endsWith('')) {
        alert("Mohon isi kata dan masukkan gambar terlebih dahulu.");
        return;
    }

    // Konfirmasi ulang sesuai instruksi
    const yakin = confirm(`Konfirmasi: Tambahkan kata "${kataBaru}" beserta gambarnya?`);
    
    if (yakin) {
        let dataCustom = JSON.parse(localStorage.getItem('aac_custom_data')) || {};
        
        if (!dataCustom[kategori]) {
            dataCustom[kategori] = [];
        }

        dataCustom[kategori].push({
            kata: kataBaru,
            gambar: gambarBase64,
            isSembunyi: false // Default terlihat (tidak disembunyikan)
        });

        localStorage.setItem('aac_custom_data', JSON.stringify(dataCustom));
        
        alert("Kosakata baru berhasil ditambahkan! Suara sudah otomatis berfungsi.");
        tutupModalTambah();
        
        // Panggil fungsi render ulang papan agar kata baru langsung muncul (akan kita buat nanti)
        // renderKategori(kategori);
    }
}

// ==========================================
// 7. LOGIKA TAMPILKAN/SEMBUNYIKAN (TOMBOL MATA)
// ==========================================

let modeEditAktif = false;

// Fungsi untuk masuk ke mode "Atur Kata"
function toggleModeEdit() {
    modeEditAktif = !modeEditAktif;
    
    // Munculkan atau sembunyikan semua tombol mata pada setiap kartu kata
    const semuaTombolMata = document.querySelectorAll('.btn-mata');
    semuaTombolMata.forEach(tombol => {
        tombol.style.display = modeEditAktif ? 'block' : 'none';
    });

    // Ubah teks tombol utama
    const btnToggleEdit = document.getElementById('btn-toggle-edit');
    if (btnToggleEdit) {
        btnToggleEdit.innerText = modeEditAktif ? 'Selesai Mengatur' : 'Tampilkan / Sembunyikan Kata';
    }
}

// Fungsi saat tombol mata di klik pada suatu kata
function toggleSembunyiKata(kata, idElemenIkon, idKartu) {
    let kataTersembunyi = JSON.parse(localStorage.getItem('aac_kata_tersembunyi')) || [];
    const index = kataTersembunyi.indexOf(kata);
    
    const ikonMata = document.getElementById(idElemenIkon);
    const kartuKata = document.getElementById(idKartu);

    if (index > -1) {
        // Kata sudah disembunyikan -> Tampilkan kembali
        kataTersembunyi.splice(index, 1);
        if (ikonMata) ikonMata.innerText = '👁️'; // Ganti dengan gambar mata terbuka nanti di HTML/CSS
        if (kartuKata) kartuKata.style.opacity = '1'; // Visual kembali normal saat mode edit
    } else {
        // Kata belum disembunyikan -> Sembunyikan
        kataTersembunyi.push(kata);
        if (ikonMata) ikonMata.innerText = '👁️‍🗨️'; // Ganti dengan gambar mata dicoret
        if (kartuKata) kartuKata.style.opacity = '0.5'; // Visual meredup saat mode edit sebagai penanda
    }

    // Simpan perubahan ke memori HP/Laptop
    localStorage.setItem('aac_kata_tersembunyi', JSON.stringify(kataTersembunyi));
}

// Fungsi ini akan dipakai saat memuat daftar kata dari database.js
function cekKataTersembunyi(kata) {
    let kataTersembunyi = JSON.parse(localStorage.getItem('aac_kata_tersembunyi')) || [];
    return kataTersembunyi.includes(kata);
}

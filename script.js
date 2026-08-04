// ==========================================
// 1. LOGIKA NAVIGASI MENU & TEMA
// ==========================================
function bukaMenu(idMenu) {
    const daftarMenu = ['menu-disclaimer', 'menu-level', 'menu-guide', 'menu-utama', 'menu-referensi', 'menu-tentang'];
    
    // Sembunyikan semua
    daftarMenu.forEach(menu => {
        const elemen = document.getElementById(menu);
        if (elemen) elemen.style.display = 'none';
    });

    // Tampilkan yang dipilih
    const menuAktif = document.getElementById(idMenu);
    if (menuAktif) {
        menuAktif.style.display = 'block';
        // Jika membuka menu utama, render (tampilkan) kosakata
        if(idMenu === 'menu-utama') {
            renderSemuaKategori();
        }
    }
}

function ubahTema(pilihan) {
    const html = document.documentElement;
    if (pilihan === 'gelap') {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('aac_tema', 'gelap');
    } else if (pilihan === 'terang') {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('aac_tema', 'terang');
    } else {
        html.removeAttribute('data-theme');
        localStorage.setItem('aac_tema', 'sistem');
    }
}

function inisialisasiTema() {
    const temaTersimpan = localStorage.getItem('aac_tema') || 'sistem';
    ubahTema(temaTersimpan);
}

// ==========================================
// 2. TEXT TO SPEECH & RIWAYAT
// ==========================================
function bicara(teks) {
    if ('speechSynthesis' in window) {
        const ucapan = new SpeechSynthesisUtterance(teks);
        ucapan.lang = 'id-ID';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(ucapan);
        tambahKeRiwayat(teks);
    } else {
        alert("Browser tidak mendukung fitur suara.");
    }
}

function tambahKeRiwayat(kalimat) {
    cekResetRiwayat();
    let riwayat = JSON.parse(localStorage.getItem('aac_riwayat')) || [];
    riwayat.push({ kalimat: kalimat, waktu: new Date().getTime() });
    localStorage.setItem('aac_riwayat', JSON.stringify(riwayat));
    renderRiwayat();
}

function cekResetRiwayat() {
    let tanggalResetTerakhir = localStorage.getItem('aac_terakhir_reset');
    let tanggalHariIni = new Date().toLocaleDateString();

    if (tanggalResetTerakhir !== tanggalHariIni) {
        localStorage.removeItem('aac_riwayat');
        localStorage.setItem('aac_terakhir_reset', tanggalHariIni);
    }
}

function renderRiwayat() {
    const ulRiwayat = document.getElementById('daftar-riwayat');
    if (!ulRiwayat) return;
    
    let riwayat = JSON.parse(localStorage.getItem('aac_riwayat')) || [];
    ulRiwayat.innerHTML = '';
    
    // Tampilkan 10 riwayat terakhir
    riwayat.slice(-10).forEach(item => {
        let li = document.createElement('li');
        li.innerText = item.kalimat;
        ulRiwayat.appendChild(li);
    });
}

// ==========================================
// 3. TAMBAH KATA MANUAL
// ==========================================
function bukaModalTambah(kategori) {
    const modal = document.getElementById('modal-tambah-kata');
    if (modal) {
        document.getElementById('input-kategori-target').value = kategori;
        modal.style.display = 'block';
    }
}

function tutupModalTambah() {
    const modal = document.getElementById('modal-tambah-kata');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('input-kata-baru').value = '';
        document.getElementById('input-gambar-baru').value = '';
        document.getElementById('preview-gambar').src = '';
    }
}

function prosesPreviewGambar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-gambar').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function simpanKataBaru() {
    const kategori = document.getElementById('input-kategori-target').value;
    const kataBaru = document.getElementById('input-kata-baru').value.trim();
    const gambarBase64 = document.getElementById('preview-gambar').src;

    if (!kataBaru) {
        alert("Mohon isi kata terlebih dahulu.");
        return;
    }

    const yakin = confirm(`Tambahkan kata "${kataBaru}"?`);
    if (yakin) {
        // Asumsi fungsi ini ada di custom-data.js
        if(typeof simpanKataCustom === 'function') {
            simpanKataCustom(kategori, kataBaru, gambarBase64);
        }
        alert("Berhasil!");
        tutupModalTambah();
        renderSemuaKategori(); // Refresh tampilan papan
    }
}

// ==========================================
// 4. MODE TAMPIL/SEMBUNYI (MATA)
// ==========================================
let modeEditAktif = false;

function toggleModeEdit() {
    modeEditAktif = !modeEditAktif;
    const btnToggleEdit = document.getElementById('btn-toggle-edit');
    if (btnToggleEdit) {
        btnToggleEdit.innerText = modeEditAktif ? '✅ Selesai Mengatur' : '👁️‍🗨️ Tampilkan / Sembunyikan Kata';
    }
    renderSemuaKategori(); // Refresh papan untuk memunculkan tombol mata
}

function toggleSembunyiKata(kata) {
    let kataTersembunyi = JSON.parse(localStorage.getItem('aac_kata_tersembunyi')) || [];
    const index = kataTersembunyi.indexOf(kata);
    
    if (index > -1) {
        kataTersembunyi.splice(index, 1); // Munculkan
    } else {
        kataTersembunyi.push(kata); // Sembunyikan
    }
    localStorage.setItem('aac_kata_tersembunyi', JSON.stringify(kataTersembunyi));
    renderSemuaKategori(); // Refresh tampilan
}

function cekKataTersembunyi(kata) {
    let kataTersembunyi = JSON.parse(localStorage.getItem('aac_kata_tersembunyi')) || [];
    return kataTersembunyi.includes(kata);
}


// ==========================================
// 5. RENDER (MEMUNCULKAN TOMBOL KE LAYAR)
// ==========================================
function renderSemuaKategori() {
    // Pastikan databaseKosakata dari database.js terbaca
    if (typeof databaseKosakata === 'undefined') {
        console.error("database.js belum dimuat atau ada error di dalamnya.");
        return;
    }

    const levelDipilih = document.getElementById('pilihan-level') ? document.getElementById('pilihan-level').value : 'semua';
    
    const pemetaanGrid = {
        "Kata Kerja": "grid-kata-kerja",
        "Kata Benda": "grid-kata-benda",
        "Makanan": "grid-makanan",
        "Tempat": "grid-tempat",
        "Waktu": "grid-waktu"
    };

    for (const kategori in pemetaanGrid) {
        const divGrid = document.getElementById(pemetaanGrid[kategori]);
        if (!divGrid) continue;
        
        divGrid.innerHTML = ''; // Bersihkan isi lama

        // 1. Render data bawaan dari database.js
        let daftarKata = databaseKosakata[kategori] || [];
        daftarKata.forEach(item => {
            // Filter level
            if (levelDipilih !== 'semua' && item.level > parseInt(levelDipilih)) return;
            buatTombolKata(item.kata, divGrid);
        });

        // 2. Render data custom (bila fungsi ambilKataCustom tersedia)
        if(typeof ambilKataCustom === 'function') {
            let dataCustomSemua = ambilKataCustom();
            // Struktur dataCustom misalnya: [ {kategori: "Makanan", kata: "Pisang"}, ... ]
            if(dataCustomSemua && dataCustomSemua.length > 0) {
                dataCustomSemua.forEach(customItem => {
                    if(customItem.kategori === kategori) {
                        buatTombolKata(customItem.kata, divGrid, true); // true = custom
                    }
                });
            }
        }
    }
}

function buatTombolKata(kata, containerElement, isCustom = false) {
    const disembunyikan = cekKataTersembunyi(kata);
    
    // Jika kata disembunyikan DAN sedang tidak dalam mode edit, jangan tampilkan sama sekali
    if (disembunyikan && !modeEditAktif) return;

    // Buat bungkus kartu
    const divKartu = document.createElement('div');
    divKartu.className = 'kartu-kata';
    // Meredupkan tombol jika statusnya disembunyikan
    divKartu.style.opacity = disembunyikan ? '0.3' : '1'; 
    divKartu.style.display = 'inline-block';
    divKartu.style.margin = '5px';
    divKartu.style.position = 'relative';

    // Buat tombol kata utama
    const btnKata = document.createElement('button');
    btnKata.innerText = kata;
    btnKata.style.padding = '10px 15px';
    if(isCustom) btnKata.style.border = '2px solid green'; // Penanda kata custom
    
    btnKata.onclick = () => {
        // Jika sedang mode edit, klik tombol = menyembunyikan/menampilkan
        if (modeEditAktif) {
            toggleSembunyiKata(kata);
        } else {
            // Jika normal, klik = masuk ke kalimat
            if(typeof tambahKataKeKalimat === 'function') tambahKataKeKalimat(kata);
        }
    };

    divKartu.appendChild(btnKata);
    containerElement.appendChild(divKartu);
}

// ==========================================
// 6. INISIALISASI AWAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cekResetRiwayat();
    inisialisasiTema();
    bukaMenu('menu-disclaimer'); // Ini yang menghilangkan layar putih
});

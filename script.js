import { Storage } from './modules/storage.js';
import { Speech } from './modules/speech.js';
import { Render } from './modules/render.js';

import { kataKerjaDb } from './database/kata-kerja.js';
import { kataBendaDb } from './database/kata-benda.js';
import { tempatDb } from './database/tempat.js';
import { waktuDb } from './database/waktu.js';

// Gabungkan semua database bawaan
const ALL_DB = [...kataKerjaDb, ...kataBendaDb, ...tempatDb, ...waktuDb]; 
const CATEGORIES = ['kata-kerja', 'kata-benda', 'makanan', 'tempat', 'waktu'];

let currentCategory = 'kata-kerja'; // Kategori awal saat web dibuka
let sentence = []; // Menyimpan kartu yang dipilih untuk disusun

// Inisialisasi Aplikasi
const init = () => {
    // 1. Navigasi Sidebar / Menu
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Hapus warna aktif dari semua menu, lalu aktifkan yang diklik
            document.querySelectorAll('#nav-menu a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            // Sembunyikan semua halaman, lalu tampilkan yang dituju
            document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
            document.getElementById(link.dataset.target).classList.remove('hidden');
        });
    });

    // 2. Pengaturan Tema
    const savedTheme = Storage.get('pecs_theme', 'system');
    document.getElementById('theme-selector').value = savedTheme;
    applyTheme(savedTheme);
    document.getElementById('theme-selector').addEventListener('change', (e) => {
        Storage.set('pecs_theme', e.target.value);
        applyTheme(e.target.value);
    });

    // 3. Pengaturan Level
    const savedLevel = Storage.get('pecs_level', 1);
    document.getElementById('level-selector').value = savedLevel;
    document.getElementById('level-selector').addEventListener('change', (e) => {
        Storage.set('pecs_level', parseInt(e.target.value));
        renderBoard(); // Update tampilan kartu sesuai level baru
    });

    // 4. Tombol Mulai di Halaman Welcome
    document.getElementById('btn-start').addEventListener('click', () => {
        document.querySelector('[data-target="page-board"]').click();
    });

    // 5. Tombol Hapus (Kalimat)
    document.getElementById('btn-clear').addEventListener('click', () => {
        sentence = [];
        updateSentenceStrip();
    });

    // 6. Tombol Bicara
    document.getElementById('btn-speak').addEventListener('click', () => {
        if(sentence.length === 0) return; // Kalau kosong, jangan ngomong
        
        // Gabungkan teks dari kartu-kartu yang disusun
        const textToSpeak = sentence.map(item => item.text).join(' ');
        Speech.speak(textToSpeak);
        
        // Simpan ke Riwayat
        const history = Storage.saveHistory(textToSpeak);
        renderHistory(history);
    });

    // 7. Modal Tambah Kata (Custom Word)
    document.getElementById('btn-add-word').addEventListener('click', () => {
        document.getElementById('modal-add').classList.remove('hidden');
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('modal-add').classList.add('hidden');
    });
    document.getElementById('btn-save-word').addEventListener('click', saveCustomWordHandler);

    // 8. Pencarian (Search)
    document.getElementById('search-input').addEventListener('input', (e) => {
        renderCards(currentCategory, e.target.value);
    });

    // 9. Render Tampilan Awal
    renderTabs();
    renderBoard();
    renderHistory(Storage.get('pecs_history', []));
};

// Fungsi Mengganti Tema
const applyTheme = (theme) => {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
};

// Fungsi Memunculkan Tab Kategori
const renderTabs = () => {
    const tabsContainer = document.getElementById('category-tabs');
    tabsContainer.innerHTML = ''; // Bersihkan dulu
    
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.replace('-', ' ').toUpperCase();
        
        if(cat === currentCategory) btn.classList.add('active');
        
        btn.addEventListener('click', () => {
            currentCategory = cat; // Ubah kategori aktif
            document.querySelectorAll('#category-tabs button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Kosongkan kolom pencarian saat pindah tab agar tidak bingung
            document.getElementById('search-input').value = '';
            
            renderBoard(); // Tampilkan kartu kategori tersebut
        });
        tabsContainer.appendChild(btn);
    });
};

// Fungsi Utama Render Board
const renderBoard = () => {
    const searchVal = document.getElementById('search-input').value;
    renderCards(currentCategory, searchVal);
};

// Fungsi Render Kartu
const renderCards = (category, searchQuery = "") => {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // Bersihkan kontainer

    const currentLevel = Storage.get('pecs_level', 1);
    const customWords = Storage.get('pecs_custom_words', []);
    const hiddenWords = Storage.get('pecs_hidden_words', []);

    // Filter: Gabungkan DB dan Custom, lalu saring berdasarkan Level
    let dataToRender = Render.filterData(ALL_DB, customWords, currentLevel);
    
    // Filter berdasarkan kategori yang dipilih
    dataToRender = dataToRender.filter(item => item.category === category);
    
    // Filter berdasarkan kolom pencarian (jika ada isinya)
    if(searchQuery) {
        dataToRender = dataToRender.filter(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Tampilkan Pesan Jika Kosong
    if (dataToRender.length === 0) {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #888; padding: 20px;">Belum ada kata di kategori ini atau level pengaturan terlalu rendah.</p>`;
        return;
    }

    // Buat kartu satu per satu
    dataToRender.forEach(item => {
        const isHidden = hiddenWords.includes(item.id);
        const card = Render.createCard(item, isHidden);
        
        // Klik kartu
        card.addEventListener('click', (e) => {
            // Jika yang diklik adalah tombol mata (sembunyikan)
            if(e.target.classList.contains('btn-toggle-visibility') || e.target.closest('.btn-toggle-visibility')) {
                Storage.toggleWordVisibility(item.id);
                renderBoard(); // refresh board
                return;
            }
            
            // Jika kartu tidak disembunyikan, tambahkan ke kalimat
            if(!isHidden) {
                sentence.push(item);
                updateSentenceStrip();
                Speech.speak(item.text); // Langsung bunyi saat ditekan
            }
        });

        container.appendChild(card);
    });
};

// Fungsi Update Susunan Kalimat di Atas
const updateSentenceStrip = () => {
    const strip = document.getElementById('sentence-strip');
    strip.innerHTML = '';
    sentence.forEach((item, index) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'card';
        wordDiv.style.width = '70px';
        wordDiv.style.padding = '5px';
        wordDiv.style.cursor = 'pointer';
        wordDiv.title = "Klik untuk membatalkan";
        
        wordDiv.innerHTML = `
            <img src="${item.image || 'images/default.png'}" style="height:40px; margin-bottom:5px;">
            <p style="font-size:10px; margin:0;">${item.text}</p>
        `;
        
        // Fitur Tambahan: Klik kartu di strip kalimat untuk menghapusnya
        wordDiv.addEventListener('click', () => {
            sentence.splice(index, 1); // Hapus dari array
            updateSentenceStrip(); // Refresh tampilan kalimat
        });

        strip.appendChild(wordDiv);
    });
};

// Fungsi Tampilkan Riwayat
const renderHistory = (historyArr) => {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    historyArr.forEach(h => {
        const li = document.createElement('li');
        li.textContent = `${h.time} - ${h.text}`;
        li.addEventListener('click', () => Speech.speak(h.text)); // Bunyi ulang kalau diklik
        list.appendChild(li);
    });
};

// Fungsi Simpan Kata Baru
const saveCustomWordHandler = () => {
    const text = document.getElementById('custom-word-text').value;
    const category = document.getElementById('custom-word-category').value;
    const level = parseInt(document.getElementById('custom-word-level').value);
    const fileInput = document.getElementById('custom-word-image');
    
    if(!text) {
        alert("Nama kata harus diisi!");
        return;
    }

    const processSave = (imgData) => {
        const newWord = {
            id: 'custom_' + Date.now(),
            text: text, 
            category: category, 
            level: level,
            image: imgData,
            custom: true,
            hidden: false
        };
        Storage.saveCustomWord(newWord);
        
        // Tutup modal dan bersihkan form
        document.getElementById('modal-add').classList.add('hidden');
        document.getElementById('custom-word-text').value = '';
        if(fileInput) fileInput.value = '';
        
        renderBoard(); // Langsung muncul di board
    };

    if(fileInput && fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => processSave(e.target.result); 
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processSave(""); // Tanpa gambar
    }
};

// Jalankan aplikasi saat file diload
init();

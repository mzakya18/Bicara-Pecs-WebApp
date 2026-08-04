// Bicara PECS WebApp v2
// Script utama
import { Storage } from './modules/storage.js';
import { Speech } from './modules/speech.js';
import { Render } from './modules/render.js';
import { kataKerjaDb } from './database/kata-kerja.js';
// import file DB lainnya (kata-benda.js, makanan.js, dll)

// MOCK: Gabungan seluruh DB untuk contoh (implementasikan import semua db di production)
const ALL_DB = [...kataKerjaDb]; 
const CATEGORIES = ['kata-kerja', 'kata-benda', 'makanan', 'tempat'];
let currentCategory = 'kata-kerja';
let sentence = [];

// Inisialisasi UI & Tema
const init = () => {
    // Navigasi Halaman
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('#nav-menu a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
            document.getElementById(link.dataset.target).classList.remove('hidden');
        });
    });

    // Tema
    const savedTheme = Storage.get('pecs_theme', 'system');
    document.getElementById('theme-selector').value = savedTheme;
    applyTheme(savedTheme);
    document.getElementById('theme-selector').addEventListener('change', (e) => {
        Storage.set('pecs_theme', e.target.value);
        applyTheme(e.target.value);
    });

    // Level
    const savedLevel = Storage.get('pecs_level', 1);
    document.getElementById('level-selector').value = savedLevel;
    document.getElementById('level-selector').addEventListener('change', (e) => {
        Storage.set('pecs_level', parseInt(e.target.value));
        renderBoard(); // Render ulang jika level berubah
    });

    // Tombol Mulai
    document.getElementById('btn-start').addEventListener('click', () => {
        document.querySelector('[data-target="page-board"]').click();
    });

    // Papan Komunikasi Actions
    document.getElementById('btn-clear').addEventListener('click', () => {
        sentence = [];
        updateSentenceStrip();
    });

    document.getElementById('btn-speak').addEventListener('click', () => {
        if(sentence.length === 0) return;
        const textToSpeak = sentence.map(item => item.text).join(' ');
        Speech.speak(textToSpeak);
        
        // Simpan ke Riwayat
        const history = Storage.saveHistory(textToSpeak);
        renderHistory(history);
    });

    // Modal Custom Word
    document.getElementById('btn-add-word').addEventListener('click', () => {
        document.getElementById('modal-add').classList.remove('hidden');
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('modal-add').classList.add('hidden');
    });
    document.getElementById('btn-save-word').addEventListener('click', saveCustomWordHandler);

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        renderCards(currentCategory, e.target.value);
    });

    // Render Awal
    renderTabs();
    renderBoard();
    renderHistory(Storage.get('pecs_history', []));
};

const applyTheme = (theme) => {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
};

const renderTabs = () => {
    const tabsContainer = document.getElementById('category-tabs');
    tabsContainer.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.replace('-', ' ').toUpperCase();
        if(cat === currentCategory) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentCategory = cat;
            document.querySelectorAll('#category-tabs button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderBoard();
        });
        tabsContainer.appendChild(btn);
    });
};

const renderBoard = () => {
    const searchVal = document.getElementById('search-input').value;
    renderCards(currentCategory, searchVal);
};

const renderCards = (category, searchQuery = "") => {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    const currentLevel = Storage.get('pecs_level', 1);
    const customWords = Storage.get('pecs_custom_words', []);
    const hiddenWords = Storage.get('pecs_hidden_words', []);

    // Filter Data (Level & Kategori & Search)
    let dataToRender = Render.filterData(ALL_DB, customWords, currentLevel);
    dataToRender = dataToRender.filter(item => item.category === category);
    
    if(searchQuery) {
        dataToRender = dataToRender.filter(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    dataToRender.forEach(item => {
        const isHidden = hiddenWords.includes(item.id);
        const card = Render.createCard(item, isHidden);
        
        // Event Listener untuk tambah ke kalimat
        card.addEventListener('click', (e) => {
            // Jangan tambah ke kalimat jika yang diklik adalah tombol hide/show
            if(e.target.classList.contains('btn-toggle-visibility')) {
                Storage.toggleWordVisibility(item.id);
                renderBoard(); // refresh
                return;
            }
            if(!isHidden) {
                sentence.push(item);
                updateSentenceStrip();
                Speech.speak(item.text); // Feedback instan saat kartu ditekan
            }
        });

        container.appendChild(card);
    });
};

const updateSentenceStrip = () => {
    const strip = document.getElementById('sentence-strip');
    strip.innerHTML = '';
    sentence.forEach(item => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'card';
        wordDiv.style.width = '80px'; // Ukuran lebih kecil untuk strip
        wordDiv.innerHTML = `<img src="${item.image || 'images/default.png'}" style="height:50px"><p style="font-size:12px">${item.text}</p>`;
        strip.appendChild(wordDiv);
    });
};

const renderHistory = (historyArr) => {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    historyArr.forEach(h => {
        const li = document.createElement('li');
        li.textContent = `${h.time} - ${h.text}`;
        li.addEventListener('click', () => Speech.speak(h.text));
        list.appendChild(li);
    });
};

const saveCustomWordHandler = () => {
    const text = document.getElementById('custom-word-text').value;
    const category = document.getElementById('custom-word-category').value;
    const level = parseInt(document.getElementById('custom-word-level').value);
    const fileInput = document.getElementById('custom-word-image');
    
    if(!text) return alert("Nama kata harus diisi!");

    const processSave = (imgData) => {
        const newWord = {
            id: 'custom_' + Date.now(),
            text, category, level,
            image: imgData,
            custom: true,
            hidden: false
        };
        Storage.saveCustomWord(newWord);
        document.getElementById('modal-add').classList.add('hidden');
        renderBoard(); // Langsung muncul
    };

    if(fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => processSave(e.target.result); // Simpan Base64 ke LocalStorage
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processSave(""); // Tanpa gambar
    }
};

// Start Apps
init();

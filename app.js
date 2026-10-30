/**
 * Bicara PECS WebApp - Core Controller
 */

// Database Kosakata Terstruktur Berdasarkan Kategori & Aturan
const VOCABULARY_DATA = {
  orang: [
    { id: 'saya', label: 'Saya', emojiBoy: '🧒🏻', emojiGirl: '👧🏻', arasaacId: 7089 },
    { id: 'ayah', label: 'Ayah', emoji: '🧔🏻', arasaacId: 7085 },
    { id: 'ibu', label: 'Ibu', emoji: '👩🏻', arasaacId: 7086 },
    { id: 'kakak', label: 'Kakak', emoji: '👦🏻', arasaacId: 7087 },
    { id: 'adik', label: 'Adik', emoji: '👶🏻', arasaacId: 7088 },
    { id: 'kakek', label: 'Kakek', emoji: '👴🏻', arasaacId: 7091 },
    { id: 'nenek', label: 'Nenek', emoji: '👵🏻', arasaacId: 7092 }
  ],
  aksi: [
    { id: 'lihat', label: 'Lihat', emoji: '👀', arasaacId: 6110 },
    { id: 'makan', label: 'Makan', emoji: '🍽️', arasaacId: 6013 },
    { id: 'minum', label: 'Minum', emoji: '🥤', arasaacId: 6014 },
    { id: 'main', label: 'Main', emoji: '🧸', arasaacId: 6040 },
    { id: 'duduk', label: 'Duduk', emoji: '🪑', arasaacId: 6025 },
    { id: 'tolong', label: 'Tolong', emoji: '🤲🏻', arasaacId: 6080 },
    { id: 'buka', label: 'Buka', emoji: '🔓', arasaacId: 6030 },
    { id: 'tutup', label: 'Tutup', emoji: '🔒', arasaacId: 6031 },
    { id: 'stop', label: 'Stop', emoji: '✋🏻', arasaacId: 6090 },
    { id: 'tidur', label: 'Tidur', emoji: '🛌🏻', arasaacId: 6015 },
    { id: 'pipis', label: 'Pipis', emoji: '🚽', arasaacId: 6050 },
    { id: 'bab', label: 'BAB', emoji: '💩', arasaacId: 6051 },
    { id: 'buangsampah', label: 'Buang Sampah', emoji: '🚮', arasaacId: 6070 }
  ],
  makanan: [
    { id: 'anggur', label: 'Anggur', emoji: '🍇' },
    { id: 'melon', label: 'Melon', emoji: '🍈' },
    { id: 'semangka', label: 'Semangka', emoji: '🍉' },
    { id: 'jeruk', label: 'Jeruk', emoji: '🍊' },
    { id: 'lemon', label: 'Lemon', emoji: '🍋' },
    { id: 'pisang', label: 'Pisang', emoji: '🍌' },
    { id: 'nanas', label: 'Nanas', emoji: '🍍' },
    { id: 'apel', label: 'Apel', emoji: '🍎' },
    { id: 'strawberry', label: 'Strawberry', emoji: '🍓' },
    { id: 'mie', label: 'Mie', emoji: '🍝' },
    { id: 'kentang', label: 'Kentang', emoji: '🍟' },
    { id: 'pizza', label: 'Pizza', emoji: '🍕' },
    { id: 'daging', label: 'Daging', emoji: '🍖' },
    { id: 'coklat', label: 'Coklat', emoji: '🍫' },
    { id: 'wortel', label: 'Wortel', emoji: '🥕' },
    { id: 'sayuran', label: 'Sayuran', emoji: '🥗' },
    { id: 'ikan', label: 'Ikan', emoji: '🐟' },
    { id: 'telur', label: 'Telur', emoji: '🥚' },
    { id: 'timun', label: 'Timun', emoji: '🥒' },
    { id: 'kacang', label: 'Kacang', emoji: '🥜' },
    { id: 'kiwi', label: 'Kiwi', emoji: '🥝' },
    { id: 'udang', label: 'Udang', emoji: '🦐' },
    { id: 'mangga', label: 'Mangga', emoji: '🥭' },
    { id: 'jamur', label: 'Jamur', emoji: '🍄' }
  ],
  mainan: [
    { id: 'robot', label: 'Robot', emoji: '🤖' },
    { id: 'perosotan', label: 'Perosotan', emoji: '🛝' },
    { id: 'balok', label: 'Balok', emoji: '🧱', arasaacId: 8010 }
  ],
  peralatan: [
    { id: 'garpu', label: 'Garpu', emoji: '🍴', arasaacId: 8020 },
    { id: 'piring', label: 'Piring', emoji: '🍽️', arasaacId: 8021 },
    { id: 'gelas', label: 'Gelas', emoji: '🥛', arasaacId: 8022 }
  ],
  media: [
    { id: 'hp', label: 'HP', emoji: '📱' },
    { id: 'tv', label: 'TV', emoji: '📺' },
    { id: 'video', label: 'Video', emoji: '🎥' },
    { id: 'foto', label: 'Foto', emoji: '🤳🏻' },
    { id: 'kamera', label: 'Kamera', emoji: '📸' }
  ],
  tempat: [
    { id: 'meja', label: 'Meja', emoji: '🪑', arasaacId: 9010 },
    { id: 'diluar', label: 'Di luar', emoji: '🌳', arasaacId: 9011 },
    { id: 'didalam', label: 'Di dalam', emoji: '🏠', arasaacId: 9012 },
    { id: 'pombensin', label: 'Di Pom Bensin', emoji: '⛽' },
    { id: 'bank', label: 'Di Bank', emoji: '🏦' },
    { id: 'masjid', label: 'Di Masjid', emoji: '🕌' },
    { id: 'tempatsampah', label: 'Di Tempat Sampah', emoji: '🗑️' }
  ],
  perasaan: [
    { id: 'lapar', label: 'Lapar', emoji: '😋', arasaacId: 5010 },
    { id: 'haus', label: 'Haus', emoji: '🥤', arasaacId: 5011 },
    { id: 'panas', label: 'Panas', emoji: '🥵', arasaacId: 5012 },
    { id: 'dingin', label: 'Dingin', emoji: '🥶', arasaacId: 5013 },
    { id: 'berisik', label: 'Berisik', emoji: '🔊', arasaacId: 5014 },
    { id: 'takut', label: 'Takut', emoji: '😣' },
    { id: 'marah', label: 'Marah', emoji: '😡' },
    { id: 'sayang', label: 'Sayang', emoji: '🥰' },
    { id: 'menangis', label: 'Menangis', emoji: '😭' },
    { id: 'diam', label: 'Diam', emoji: '🫢' },
    { id: 'sedih', label: 'Sedih', emoji: '😔' },
    { id: 'suka', label: 'Suka', emoji: '🤩' }
  ],
  ukuran: [
    { id: 'besar', label: 'Besar', emoji: '🐘', arasaacId: 4010 },
    { id: 'kecil', label: 'Kecil', emoji: '🐭', arasaacId: 4011 },
    { id: 'banyak', label: 'Banyak', emoji: '🔢', arasaacId: 4012 },
    { id: 'sedikit', label: 'Sedikit', emoji: '👤', arasaacId: 4013 }
  ],
  waktu: [
    { id: 'jam1', label: 'Jam 1', emoji: '🕐' },
    { id: 'jam2', label: 'Jam 2', emoji: '🕑' },
    { id: 'jam3', label: 'Jam 3', emoji: '🕒' },
    { id: 'jam4', label: 'Jam 4', emoji: '🕓' },
    { id: 'jam5', label: 'Jam 5', emoji: '🕔' },
    { id: 'jam6', label: 'Jam 6', emoji: '🕕' },
    { id: 'jam7', label: 'Jam 7', emoji: '🕖' },
    { id: 'jam8', label: 'Jam 8', emoji: '🕗' },
    { id: 'jam9', label: 'Jam 9', emoji: '🕘' },
    { id: 'jam10', label: 'Jam 10', emoji: '🕙' },
    { id: 'jam11', label: 'Jam 11', emoji: '🕚' },
    { id: 'jam12', label: 'Jam 12', emoji: '🕛' },
    { id: 'hariini', label: 'Hari ini', emoji: '📅', arasaacId: 3010 },
    { id: 'besok', label: 'Besok', emoji: '📆➡️', arasaacId: 3011 },
    { id: 'kemarin', label: 'Kemarin', emoji: '⬅️📆', arasaacId: 3012 },
    { id: 'lagi', label: 'Lagi', emoji: '🔄', arasaacId: 3013 },
    { id: 'sudah', label: 'Sudah', emoji: '✅', arasaacId: 3014 }
  ]
};

// State Aplikasi
let appState = {
  gender: localStorage.getItem('pecs_gender') || 'boy', // 'boy' atau 'girl'
  glassTheme: localStorage.getItem('pecs_glass_theme') === 'true',
  currentCategory: 'orang',
  sentence: []
};

// Elemen DOM
const categoryBar = document.getElementById('category-bar');
const cardsGrid = document.getElementById('cards-grid');
const sentenceStrip = document.getElementById('sentence-strip');
const placeholderText = document.getElementById('placeholder-text');

// Inisialisasi Saat Dokumen Siap
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCategories();
  renderCards(appState.currentCategory);
  setupEventListeners();
  checkFirstTime();
  checkMonthlyBackup();
});

// Penanganan Tema Kaca iOS
function initTheme() {
  const toggleTheme = document.getElementById('toggle-glass-theme');
  if (appState.glassTheme) {
    document.body.classList.add('theme-glass');
    if (toggleTheme) toggleTheme.checked = true;
  }
}

function setTheme(isGlass) {
  appState.glassTheme = isGlass;
  localStorage.setItem('pecs_glass_theme', isGlass);
  if (isGlass) {
    document.body.classList.add('theme-glass');
  } else {
    document.body.classList.remove('theme-glass');
  }
}

// Inisialisasi Kategori
function initCategories() {
  categoryBar.innerHTML = '';
  const categories = Object.keys(VOCABULARY_DATA);
  
  categories.forEach((catKey, index) => {
    const btn = document.createElement('button');
    btn.className = `cat-btn ${index === 0 ? 'active' : ''}`;
    btn.textContent = catKey.charAt(0).toUpperCase() + catKey.slice(1);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.currentCategory = catKey;
      renderCards(catKey);
    });
    categoryBar.appendChild(btn);
  });
}

// Rendering Kartu PECS
function renderCards(categoryKey) {
  cardsGrid.innerHTML = '';
  const items = VOCABULARY_DATA[categoryKey] || [];

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'pecs-card';

    // Tentukan emoji berdasarkan gender untuk kata 'saya'
    let displayEmoji = item.emoji;
    if (item.id === 'saya') {
      displayEmoji = appState.gender === 'girl' ? item.emojiGirl : item.emojiBoy;
    }

    // Gunakan ARASAAC image jika ada ID-nya, jika tidak gunakan emoji
    if (item.arasaacId) {
      card.innerHTML = `
        <img src="https://api.arasaac.org/api/pictograms/${item.arasaacId}" alt="${item.label}" onerror="this.onerror=null; this.outerHTML='<span class=\'card-emoji\'>${displayEmoji}</span>';">
        <span class="card-label">${item.label}</span>
      `;
    } else {
      card.innerHTML = `
        <span class="card-emoji">${displayEmoji}</span>
        <span class="card-label">${item.label}</span>
      `;
    }

    card.addEventListener('click', () => addToSentence(item, displayEmoji));
    cardsGrid.appendChild(card);
  });
}

// Tambah Kata ke Papan Kalimat
function addToSentence(item, emoji) {
  if (placeholderText) placeholderText.style.display = 'none';

  appState.sentence.push(item);
  
  const card = document.createElement('div');
  card.className = 'pecs-card';
  card.style.width = '80px';
  card.style.flexShrink = '0';

  if (item.arasaacId) {
    card.innerHTML = `
      <img src="https://api.arasaac.org/api/pictograms/${item.arasaacId}" style="width:36px;height:36px;">
      <span class="card-label" style="font-size:0.75rem">${item.label}</span>
    `;
  } else {
    card.innerHTML = `
      <span class="card-emoji" style="font-size:1.8rem">${emoji}</span>
      <span class="card-label" style="font-size:0.75rem">${item.label}</span>
    `;
  }

  // Tap untuk menghapus kata dari kalimat
  card.addEventListener('click', () => {
    const index = appState.sentence.indexOf(item);
    if (index > -1) {
      appState.sentence.splice(index, 1);
      card.remove();
      if (appState.sentence.length === 0 && placeholderText) {
        placeholderText.style.display = 'block';
      }
    }
  });

  sentenceStrip.appendChild(card);
}

// Fungsi Suara (Text-To-Speech Bahasa Indonesia Baku)
function speakSentence() {
  if (appState.sentence.length === 0) return;

  const textToSpeak = appState.sentence.map(i => i.label).join(' ');
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Sistem suara tidak didukung di perangkat ini.');
  }
}

// Hapus Kalimat
function clearSentence() {
  appState.sentence = [];
  sentenceStrip.innerHTML = '';
  if (placeholderText) {
    sentenceStrip.appendChild(placeholderText);
    placeholderText.style.display = 'block';
  }
}

// Pengaturan Gender
function setGender(gender) {
  appState.gender = gender;
  localStorage.setItem('pecs_gender', gender);
  
  document.querySelectorAll('#gender-boy, #welcome-boy').forEach(el => el.classList.toggle('active', gender === 'boy'));
  document.querySelectorAll('#gender-girl, #welcome-girl').forEach(el => el.classList.toggle('active', gender === 'girl'));

  renderCards(appState.currentCategory);
}

// Cadangkan Data (Backup)
function backupData() {
  const data = {
    gender: appState.gender,
    glassTheme: appState.glassTheme,
    backupDate: new Date().toISOString()
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const fileName = `BicaraPECS_Backup_${new Date().toISOString().slice(0, 10)}.json`;

  // Coba bagikan via navigator.share jika didukung
  if (navigator.share && navigator.canShare) {
    const file = new File([JSON.stringify(data, null, 2)], fileName, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'Cadangan Data Bicara PECS',
        text: 'File cadangan data aplikasi Bicara PECS.'
      }).catch(() => downloadFallback(jsonString, fileName));
      return;
    }
  }

  downloadFallback(jsonString, fileName);
}

function downloadFallback(url, fileName) {
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Pulihkan Data (Restore)
function restoreData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.gender) setGender(data.gender);
      if (typeof data.glassTheme === 'boolean') setTheme(data.glassTheme);
      
      alert('Data berhasil dipulihkan!');
      document.getElementById('modal-settings').classList.add('hidden');
      document.getElementById('modal-welcome').classList.add('hidden');
    } catch (err) {
      alert('Format file backup tidak valid.');
    }
  };
  reader.readAsText(file);
}

// Pengingat Bulanan Tanggal 1
function checkMonthlyBackup() {
  const today = new Date();
  const isFirstDay = today.getDate() === 1;
  const lastPrompt = localStorage.getItem('pecs_last_backup_prompt');
  const currentMonthYear = `${today.getMonth()}-${today.getFullYear()}`;

  if (isFirstDay && lastPrompt !== currentMonthYear) {
    document.getElementById('modal-backup-reminder').classList.remove('hidden');
  }
}

// Cek Pengguna Pertama Kali
function checkFirstTime() {
  if (!localStorage.getItem('pecs_gender')) {
    document.getElementById('modal-welcome').classList.remove('hidden');
  }
}

// Event Listeners Total
function setupEventListeners() {
  document.getElementById('btn-speak').addEventListener('click', speakSentence);
  document.getElementById('btn-clear').addEventListener('click', clearSentence);

  // Modal Settings
  document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('modal-settings').classList.remove('hidden');
  });
  document.getElementById('btn-close-settings').addEventListener('click', () => {
    document.getElementById('modal-settings').classList.add('hidden');
  });

  // Gender Buttons
  document.getElementById('gender-boy').addEventListener('click', () => setGender('boy'));
  document.getElementById('gender-girl').addEventListener('click', () => setGender('girl'));
  document.getElementById('welcome-boy').addEventListener('click', () => {
    setGender('boy');
    document.getElementById('modal-welcome').classList.add('hidden');
  });
  document.getElementById('welcome-girl').addEventListener('click', () => {
    setGender('girl');
    document.getElementById('modal-welcome').classList.add('hidden');
  });

  // Toggle Theme
  document.getElementById('toggle-glass-theme').addEventListener('change', (e) => {
    setTheme(e.target.checked);
  });

  // Backup & Restore
  document.getElementById('btn-backup').addEventListener('click', backupData);
  document.getElementById('btn-restore-trigger').addEventListener('click', () => {
    document.getElementById('file-restore').click();
  });
  document.getElementById('welcome-restore').addEventListener('click', () => {
    document.getElementById('file-restore').click();
  });
  document.getElementById('file-restore').addEventListener('change', (e) => {
    if (e.target.files.length > 0) restoreData(e.target.files[0]);
  });

  // Monthly Backup Modal
  document.getElementById('btn-do-monthly-backup').addEventListener('click', () => {
    backupData();
    localStorage.setItem('pecs_last_backup_prompt', `${new Date().getMonth()}-${new Date().getFullYear()}`);
    document.getElementById('modal-backup-reminder').classList.add('hidden');
  });
  document.getElementById('btn-skip-monthly-backup').addEventListener('click', () => {
    localStorage.setItem('pecs_last_backup_prompt', `${new Date().getMonth()}-${new Date().getFullYear()}`);
    document.getElementById('modal-backup-reminder').classList.add('hidden');
  });
}

// Register Service Worker untuk PWA Offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Registration failed: ', err));
  });
}

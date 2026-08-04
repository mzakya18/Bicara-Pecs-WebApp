// custom-data.js
// Menyimpan dan mengambil kosakata tambahan user
function simpanKataCustom(kategori, kata, gambar) {
    let dataCustom = JSON.parse(localStorage.getItem('aac_custom_data')) || [];
    dataCustom.push({ kategori: kategori, kata: kata, gambar: gambar });
    localStorage.setItem('aac_custom_data', JSON.stringify(dataCustom));
}

function ambilKataCustom() {
    return JSON.parse(localStorage.getItem('aac_custom_data')) || [];
}

// Menyimpan dan mengambil riwayat kalimat 24 jam
function simpanRiwayat(kalimat) {
    let riwayat = JSON.parse(localStorage.getItem('aac_riwayat')) || [];
    let waktuSekarang = new Date().getTime();
    riwayat.push({ kalimat: kalimat, waktu: waktuSekarang });
    localStorage.setItem('aac_riwayat', JSON.stringify(riwayat));
}

function bersihkanRiwayatHarian() {
    // Logika untuk mereset riwayat setiap jam 12 malam akan dieksekusi di script.js
    localStorage.removeItem('aac_riwayat');
}

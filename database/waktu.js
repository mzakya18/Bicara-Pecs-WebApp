const waktu = [];
// File: database/waktu.js
// Catatan: Konsep waktu bersifat abstrak, umumnya mulai diajarkan di tahapan menengah-lanjut (Level 3/4) dalam intervensi perilaku.

const daftarWaktu = [
    "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu",
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    "Kemarin", "Sore hari"
];

export const waktuDb = daftarWaktu.map((waktu, index) => ({
    id: `wkt_${index + 1}`,
    text: waktu,
    category: "waktu",
    level: 3, 
    image: "",
    voice: "",
    hidden: false,
    custom: false
}));

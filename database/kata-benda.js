const kataBenda = [];
// File: database/kata-benda.js

// 1. Data Benda Dasar
const bendaDasar = [
    { id: "kb_1", text: "pintu", level: 1 },
    { id: "kb_2", text: "jendela", level: 1 },
    { id: "kb_3", text: "botol", level: 1 },
    { id: "kb_4", text: "buku", level: 1 },
    { id: "kb_5", text: "sepatu", level: 2 },
    { id: "kb_6", text: "baju", level: 2 },
    { id: "kb_7", text: "celana", level: 2 },
    { id: "kb_8", text: "tas", level: 2 },
    { id: "kb_9", text: "mainan", level: 1 },
    { id: "kb_10", text: "lampu", level: 2 }
];

// 2. Kata Kerja Aksi yang akan digabungkan
const kataKerjaAksi = ["buka", "tutup", "ambil", "simpan"];

// 3. Logika Generator (Perbanyak data otomatis)
let kataBendaOtomatis = [];
let counterId = 1;

bendaDasar.forEach(benda => {
    // A. Masukkan kata benda tunggal (stand-alone)
    kataBendaOtomatis.push({
        id: `kbo_stand_${benda.id}`,
        text: benda.text,
        category: "kata-benda",
        level: benda.level,
        image: "", voice: "", hidden: false, custom: false
    });

    // B. Buat kombinasi 2 kata (Aksi + Benda)
    kataKerjaAksi.forEach(aksi => {
        kataBendaOtomatis.push({
            id: `kbo_komb_${counterId}`,
            text: `${aksi} ${benda.text}`,
            category: "kata-benda",
            // Kompleksitas naik 1 tingkat karena menggabungkan 2 kata (prinsip fading/shaping)
            level: benda.level + 1, 
            image: "", voice: "", hidden: false, custom: false
        });
        counterId++;
    });
});

// 4. Data Makanan (Sesuai SRS)
// Makanan sebagai primary reinforcer sangat krusial di tahap awal PECS (Level 1)
const daftarMakanan = [
    "nasi", "nasi goreng", "mie goreng", "mie kuah", "soto", "bakso", 
    "ayam goreng", "ayam bakar", "telur rebus", "telur goreng", 
    "kentang goreng", "sayur sop", "sayur bayam", "capcay", "tempe", "tahu", 
    "ikan goreng", "ikan bakar", "roti", "bubur", "biskuit", "keju", "susu", 
    "jus", "teh", "kopi"
];

const makananDb = daftarMakanan.map((makanan, index) => ({
    id: `mkn_${index + 1}`,
    text: makanan,
    category: "makanan",
    level: 1, 
    image: "", voice: "", hidden: false, custom: false
}));

// 5. Export seluruh data yang sudah digabung
export const kataBendaDb = [...kataBendaOtomatis, ...makananDb];

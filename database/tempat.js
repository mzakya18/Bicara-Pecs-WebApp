const tempat = [];
// File: database/tempat.js

const daftarTempat = [
    { text: "pergi ke taman", level: 2 },
    { text: "pergi ke playground", level: 2 },
    { text: "pergi ke pantai", level: 2 }
];

export const tempatDb = daftarTempat.map((item, index) => ({
    id: `tmp_${index + 1}`,
    text: item.text,
    category: "tempat",
    level: item.level,
    image: "",
    voice: "",
    hidden: false,
    custom: false
}));

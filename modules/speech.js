// Text To Speech
// Native Speech Synthesis
export const Speech = {
    speak: (text) => {
        if (!('speechSynthesis' in window)) {
            alert("Browser tidak mendukung Text to Speech.");
            return;
        }
        window.speechSynthesis.cancel(); // Hentikan antrean sebelumnya
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9; // Sedikit diperlambat agar jelas untuk anak ASD
        window.speechSynthesis.speak(utterance);
    }
};

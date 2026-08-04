// Render kartu PECS
import { Storage } from './storage.js';

export const Render = {
    createCard: (item, isHidden) => {
        const card = document.createElement('div');
        card.className = `card ${isHidden ? 'is-hidden' : ''}`;
        card.dataset.id = item.id;
        card.dataset.text = item.text;
        
        // Icon mata (hide/show)
        const eyeIcon = isHidden ? '🙈' : '👁';
        
        card.innerHTML = `
            <div class="card-actions">
                <button class="btn-toggle-visibility">${eyeIcon}</button>
            </div>
            <img src="${item.image || 'images/default.png'}" alt="${item.text}">
            <p>${item.text}</p>
        `;
        return card;
    },

    filterData: (dbData, customData, level) => {
        // Gabungkan dan hapus duplikat berdasarkan teks
        const combined = [...dbData, ...customData];
        const unique = Array.from(new Map(combined.map(item => [item.text.toLowerCase(), item])).values());
        
        // Filter berdasarkan level pengaturan
        return unique.filter(item => item.level <= level);
    }
};

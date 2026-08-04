// Local Storage
// Manajemen LocalStorage
export const Storage = {
    get: (key, defaultValue) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    saveHistory: (sentenceText) => {
        let history = Storage.get('pecs_history', []);
        // Reset jika beda hari
        const lastDate = Storage.get('pecs_history_date', new Date().toDateString());
        if(lastDate !== new Date().toDateString()) history = [];
        
        history.unshift({ text: sentenceText, time: new Date().toLocaleTimeString() });
        if(history.length > 50) history.pop();
        
        Storage.set('pecs_history', history);
        Storage.set('pecs_history_date', new Date().toDateString());
        return history;
    },
    saveCustomWord: (wordObj) => {
        let customWords = Storage.get('pecs_custom_words', []);
        customWords.push(wordObj);
        Storage.set('pecs_custom_words', customWords);
    },
    toggleWordVisibility: (id) => {
        let hidden = Storage.get('pecs_hidden_words', []);
        if (hidden.includes(id)) {
            hidden = hidden.filter(wId => wId !== id);
        } else {
            hidden.push(id);
        }
        Storage.set('pecs_hidden_words', hidden);
    }
};

，// script.js
window.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
        document.getElementById('fireworksCanvas').classList.add('hidden');
        document.getElementById('codeWave').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('codeWave').classList.add('hidden');
            document.getElementById('birthdayMessage').classList.remove('hidden');
        }, 4000);
    }, 5000);
});
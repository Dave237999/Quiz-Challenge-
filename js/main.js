const toggleBtn = document.getElementById('theme-toggle'); // Ton bouton de switch
const htmlElement = document.documentElement;

toggleBtn.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        htmlElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // --- Gestion du Mode Sombre / Clair ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Vérifier les préférences enregistrées ou du système
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            let theme = 'light';
            if (document.documentElement.classList.contains('dark')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // --- Gestion du Menu Hamburger (Mobile) ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // 1. Charger le thème enregistré au démarrage
    const savedTheme = localStorage.getItem('quizTheme') || 'dark';
    if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        htmlElement.classList.add('dark');
        if (themeIcon) themeIcon.textContent = '🌙';
    }

    // 2. Gérer le clic sur le bouton de bascule
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = htmlElement.classList.toggle('dark');
            const newTheme = isDark ? 'dark' : 'light';
            
            // Sauvegarder la préférence
            localStorage.setItem('quizTheme', newTheme);
            if (themeIcon) themeIcon.textContent = isDark ? '🌙' : '☀️';

            // Rediriger vers la version correspondante de la page (ex: index.html <-> index-clair.html)
            updatePageLinks(newTheme);
        });
    }
});

// Fonction pour basculer intelligemment entre les suffixes "-clair.html" et les pages de base
function updatePageLinks(theme) {
    const currentPath = window.location.pathname;
    let baseName = currentPath.split('/').pop(); // ex: index.html ou index-clair.html

    if (!baseName) baseName = 'index.html';

    let targetPage = '';

    if (theme === 'light') {
        // Passage en mode clair : si la page n'a pas "-clair", on l'ajoute
        if (!baseName.includes('-clair')) {
            if (baseName === 'index.html' || baseName === '') targetPage = 'index-clair.html';
            else if (baseName === 'game.html') targetPage = 'quiz-clair.html';
            else targetPage = baseName.replace('.html', '-clair.html');
            
            window.location.href = targetPage;
        }
    } else {
        // Passage en mode sombre : on retire "-clair"
        if (baseName.includes('-clair')) {
            targetPage = baseName.replace('-clair.html', '.html');
            window.location.href = targetPage;
        }
    }
}
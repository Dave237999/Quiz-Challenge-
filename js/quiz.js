let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let currentStreak = 0;
let maxStreak = 0;
let timeLeft = 30;        // 30 secondes par question
let timer = null;
let quizTimer = null;     // Chronomètre global de la partie
let totalSeconds = 0;     // Temps total passé
let activeQuestions = [];

document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});

function initQuiz() {
    // Synchroniser le thème selon le fichier utilisé (quiz-sombre.html vs quiz.html)
    const isDarkPage = window.location.pathname.includes('sombre');
    if (isDarkPage) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('quizTheme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('quizTheme', 'light');
    }

    // 1. Récupérer la catégorie et la difficulté choisies par l'utilisateur
    const category = localStorage.getItem('selectedCategory') || 'informatique';
    const difficulty = localStorage.getItem('selectedDifficulty') || 'facile';

    // Mettre à jour le nom de la catégorie affiché dans le HTML si l'élément existe
    const categoryNameEl = document.getElementById('category-name');
    if (categoryNameEl) {
        categoryNameEl.textContent = category.toUpperCase();
    }

    // 2. Vérification stricte et sécurisée des données
    if (typeof quizData !== 'undefined' && quizData[category] && quizData[category][difficulty]) {
        let pool = quizData[category][difficulty];
        
        if (pool && pool.length > 0) {
            activeQuestions = shuffleArray([...pool]).slice(0, 10);
        } else {
            activeQuestions = [
                {
                    question: `Oups ! Les questions pour ${category} (${difficulty}) arrivent bientôt.`,
                    options: ["Retour", "Accueil", "Patienter", "Fermer"],
                    correct: 0
                }
            ];
        }
    } else {
        activeQuestions = [
            {
                question: `Attention : Le niveau ${difficulty} pour ${category} n'est pas encore configuré.`,
                options: ["A", "B", "C", "D"],
                correct: 0
            }
        ];
    }

    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    currentStreak = 0;
    maxStreak = 0;
    totalSeconds = 0;

    // Lancer le chronomètre global de la partie
    clearInterval(quizTimer);
    quizTimer = setInterval(() => {
        totalSeconds++;
    }, 1000);

    loadQuestion();

    // Gestion des jokers
    const btnTime = document.getElementById('joker-time');
    if (btnTime) {
        btnTime.onclick = () => {
            timeLeft += 10;
            updateTimerDisplay();
        };
    }

    const btnSkip = document.getElementById('joker-skip');
    if (btnSkip) {
        btnSkip.onclick = () => {
            clearInterval(timer);
            currentStreak = 0; // Réinitialiser la série si on passe la question
            currentQuestionIndex++;
            loadQuestion();
        };
    }

    const btn50 = document.getElementById('joker-50');
    if (btn50) {
        btn50.onclick = () => apply5050();
    }
}

// Fonction utilitaire pour mélanger un tableau de manière aléatoire (Algorithme de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    timeLeft = 30; // Fixé à 30 secondes par question
    updateTimerDisplay();
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleAnswer(-1);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('time-left');
    if (timerElement) {
        timerElement.textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
    }
}

function loadQuestion() {
    clearInterval(timer);
    
    if (currentQuestionIndex >= activeQuestions.length) {
        endQuiz();
        return;
    }

    startTimer();
    const q = activeQuestions[currentQuestionIndex];
    
    const qText = document.getElementById('question-text');
    if (qText) qText.textContent = q.question;
    
    const counterElement = document.getElementById('question-counter');
    if (counterElement) {
        counterElement.textContent = `Question ${currentQuestionIndex + 1} / ${activeQuestions.length}`;
    }
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const progressPercent = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';

        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-all font-medium flex items-center justify-between cursor-pointer";
            
            const letter = String.fromCharCode(65 + index);
            btn.innerHTML = `<span><strong class="text-indigo-500 mr-2">${letter}</strong> ${option}</span>`;
            
            btn.onclick = () => selectAnswer(index, btn);
            optionsContainer.appendChild(btn);
        });
    }
}

function selectAnswer(selectedIndex, selectedBtn) {
    clearInterval(timer);
    const q = activeQuestions[currentQuestionIndex];
    const allButtons = document.querySelectorAll('#options-container button');
    
    allButtons.forEach(btn => btn.disabled = true);

    // Déterminer les points selon la difficulté choisie
    const difficulty = localStorage.getItem('selectedDifficulty') || 'facile';
    let pointsPerQuestion = 10; // Facile
    if (difficulty === 'moyen') pointsPerQuestion = 20;
    if (difficulty === 'difficile') pointsPerQuestion = 30;

    if (selectedIndex === q.correct) {
        correctCount++;
        score += pointsPerQuestion;
        currentStreak++;
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }

        if (selectedBtn) {
            selectedBtn.className = "w-full text-left p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium flex items-center justify-between shadow-sm cursor-pointer";
            selectedBtn.innerHTML += `<span>✅</span>`;
        }
    } else {
        currentStreak = 0; // Réinitialiser la série en cas d'erreur
        if (selectedBtn) {
            selectedBtn.className = "w-full text-left p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500 text-rose-700 dark:text-rose-300 font-medium flex items-center justify-between shadow-sm cursor-pointer";
            selectedBtn.innerHTML += `<span>❌</span>`;
        }
        if (allButtons[q.correct]) {
            allButtons[q.correct].className = "w-full text-left p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium flex items-center justify-between shadow-sm cursor-pointer";
            allButtons[q.correct].innerHTML += `<span>✅</span>`;
        }
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

function handleAnswer(selectedIndex) {
    selectAnswer(selectedIndex, null);
}

function apply5050() {
    const q = activeQuestions[currentQuestionIndex];
    const allButtons = document.querySelectorAll('#options-container button');
    let hiddenCount = 0;
    
    allButtons.forEach((btn, index) => {
        if (index !== q.correct && hiddenCount < 2) {
            btn.style.opacity = '0.3';
            btn.style.pointerEvents = 'none';
            hiddenCount++;
        }
    });
}

function endQuiz() {
    clearInterval(quizTimer); // Arrêter le chrono global

    // La page active détermine la destination (deux fichiers distincts)
    const isDarkPage = window.location.pathname.includes('sombre');
    localStorage.setItem('quizTheme', isDarkPage ? 'dark' : 'light');

    // Sauvegarde de toutes les statistiques dans le localStorage
    localStorage.setItem('quizScore', score);
    localStorage.setItem('quizCorrect', correctCount);
    localStorage.setItem('quizTotal', activeQuestions.length);
    localStorage.setItem('quizTime', totalSeconds);
    localStorage.setItem('quizStreak', maxStreak);

    window.location.href = isDarkPage ? 'results-sombre.html' : 'results.html';
}
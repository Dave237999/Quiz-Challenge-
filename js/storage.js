// Clés pour le LocalStorage
const STORAGE_KEYS = {
    USER: 'quizUser',
    LAST_RESULT: 'lastQuizResult'
};

// Récupérer le profil utilisateur (avec valeurs par défaut)
function getUserProfile() {
    const defaultUser = {
        username: "Utilisateur",
        level: 1,
        quizzesPlayed: 0,
        totalScore: 0,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        joinDate: "2026"
    };
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || defaultUser;
}

// Sauvegarder ou mettre à jour le profil
function saveUserProfile(userData) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
}

// Enregistrer le score d'une partie et mettre à jour les stats globales
function saveQuizResult(score, totalQuestions) {
    const correctCount = score / 10;
    const finalData = {
        score: score,
        total: totalQuestions * 10,
        correctAnswers: correctCount,
        date: new Date().toLocaleDateString()
    };
    localStorage.setItem(STORAGE_KEYS.LAST_RESULT, JSON.stringify(finalData));

    // Mettre à jour les stats globales du profil
    let user = getUserProfile();
    user.quizzesPlayed += 1;
    user.totalScore += score;
    
    // Calcul basique du niveau : 1 niveau tous les 50 points
    user.level = Math.floor(user.totalScore / 50) + 1;
    
    saveUserProfile(user);
}

// Récupérer le dernier résultat de quiz
function getLastQuizResult() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_RESULT)) || {
        score: 0,
        total: 0,
        correctAnswers: 0,
        date: "-"
    };
}


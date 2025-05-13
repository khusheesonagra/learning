// DOM Elements
const app = document.getElementById('app');
const mainContent = document.getElementById('main-content');

// Navigation
const homeLink = document.getElementById('home-link');
const dashboardLink = document.getElementById('dashboard-link');
const classroomLink = document.getElementById('classroom-link');
const gamesLink = document.getElementById('games-link');
const profileLink = document.getElementById('profile-link');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const userMenu = document.getElementById('user-menu');
const usernameDisplay = document.getElementById('username-display');
const logoutButton = document.getElementById('logout-button');
const getStartedButton = document.getElementById('get-started-button');

// Pages
const landingPage = document.getElementById('landing-page');
const dashboardPage = document.getElementById('dashboard-page');
const classroomPage = document.getElementById('classroom-page');
const gamesPage = document.getElementById('games-page');
const profilePage = document.getElementById('profile-page');

// Login Modal
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const googleLoginBtn = document.getElementById('google-login-btn');
const switchToSignup = document.getElementById('switch-to-signup');

// Signup Modal
const signupModal = document.getElementById('signup-modal');
const signupForm = document.getElementById('signup-form');
const signupFullname = document.getElementById('signup-fullname');
const signupUsername = document.getElementById('signup-username');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupAge = document.getElementById('signup-age');
const googleSignupBtn = document.getElementById('google-signup-btn');
const switchToLogin = document.getElementById('switch-to-login');

// Toast Container
const toastContainer = document.getElementById('toast-container');

// Dashboard Elements
const mathProgress = document.getElementById('math-progress');
const mathProgressText = document.getElementById('math-progress-text');
const readingProgress = document.getElementById('reading-progress');
const readingProgressText = document.getElementById('reading-progress-text');
const memoryProgress = document.getElementById('memory-progress');
const memoryProgressText = document.getElementById('memory-progress-text');
const activityList = document.getElementById('activity-list');
const achievementsGrid = document.getElementById('achievements-grid');

// Classroom Elements
const topicsGrid = document.querySelector('.topics-grid');
const topicCards = document.querySelectorAll('.topic-card');
const lessonContent = document.getElementById('lesson-content');
const lessonContainer = document.getElementById('lesson-container');
const backToTopicsBtn = document.getElementById('back-to-topics');

// Games Elements
const gamesGrid = document.querySelector('.games-grid');
const gameCards = document.querySelectorAll('.game-card');
const playGameBtns = document.querySelectorAll('.play-game-btn');
const gameContainer = document.getElementById('game-container');
const gameBoard = document.getElementById('game-board');
const backToGamesBtn = document.getElementById('back-to-games');
const currentGameTitle = document.getElementById('current-game-title');
const currentGameScore = document.getElementById('current-game-score');
const currentGameLevel = document.getElementById('current-game-level');
const currentGameTimer = document.getElementById('current-game-timer');

// Memory Match Game Stats
const memoryMatchHighScore = document.getElementById('memory-match-high-score');
const memoryMatchLevel = document.getElementById('memory-match-level');

// Pattern Master Game Stats
const patternMasterHighScore = document.getElementById('pattern-master-high-score');
const patternMasterLevel = document.getElementById('pattern-master-level');

// Word Builder Game Stats
const wordBuilderHighScore = document.getElementById('word-builder-high-score');
const wordBuilderLevel = document.getElementById('word-builder-level');

// Profile Elements
const avatarInitials = document.getElementById('avatar-initials');
const gamesPlayedStat = document.getElementById('games-played-stat');
const totalPointsStat = document.getElementById('total-points-stat');
const highestLevelStat = document.getElementById('highest-level-stat');
const profileFullname = document.getElementById('profile-fullname');
const profileUsername = document.getElementById('profile-username');
const profileEmail = document.getElementById('profile-email');
const profileAge = document.getElementById('profile-age');
const saveProfileButton = document.getElementById('save-profile-button');

// Close Modal Buttons
const closeModalBtns = document.querySelectorAll('.close-modal-btn');

// State Management
let currentUser = null;
let isAuthenticated = false;
let userProgress = {
  mathProgress: 0,
  readingProgress: 0,
  memoryProgress: 0,
  problemSolvingProgress: 0,
  gamesPlayed: 0,
  totalPoints: 0,
  highestLevel: 1
};
let currentGame = null;
let gameScore = 0;
let gameLevel = 1;
let gameTimer = 0;
let timerInterval;

// API Endpoint
const API_URL = 'http://localhost:5001/api';

// Add verification modal elements
const verificationModal = document.getElementById('verification-modal');
const verificationForm = document.getElementById('verification-form');
const verificationCode = document.getElementById('verification-code');
const codeDisplay = document.getElementById('code-display');
const countdownDisplay = document.getElementById('countdown');
const resendCodeBtn = document.getElementById('resend-code-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');

let verificationData = null;
let countdownInterval = null;

// Generate a random 6-digit code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Start countdown timer
function startCountdown() {
    let timeLeft = 60;
    countdownDisplay.textContent = timeLeft;
    
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            showToast('Verification code expired. Please request a new code.', 'error');
            verificationData = null;
        }
    }, 1000);
}

// Show verification modal with new code
function showVerificationModal() {
    const code = generateVerificationCode();
    verificationData = {
        code,
        timestamp: Date.now()
    };
    codeDisplay.textContent = code;
    verificationModal.classList.remove('hidden');
    startCountdown();
}

// Handle verification form submission
verificationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!verificationData) {
        showToast('Please request a verification code first.', 'error');
        return;
    }
    
    const enteredCode = verificationCode.value;
    
    if (enteredCode === verificationData.code) {
        clearInterval(countdownInterval);
        showToast('Verification successful! Your account has been created.', 'success');
        verificationModal.classList.add('hidden');
        
        // Create user account
        const user = {
            fullName: signupFullname.value,
            username: signupUsername.value,
            email: signupEmail.value,
            password: signupPassword.value,
            age: parseInt(signupAge.value),
            createdAt: new Date().toISOString()
        };
        
        // Store user in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set current user and update authentication state
        currentUser = user;
        isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Initialize user progress
        initializeUserProgress();
        
        // Update UI
        updateAuthUI();
        
        // Close signup modal
        closeModal(signupModal);
        
        // Navigate to dashboard
        navigateTo('dashboard');
        
    } else {
        showToast('Invalid code. Please try again.', 'error');
    }
});

// Handle resend code button
resendCodeBtn.addEventListener('click', () => {
    showVerificationModal();
});

// Handle close modal button
closeModalBtn.addEventListener('click', () => {
    verificationModal.classList.add('hidden');
    clearInterval(countdownInterval);
});

// Update signup form submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userData = {
      fullName: signupFullname.value,
      username: signupUsername.value,
      email: signupEmail.value,
      password: signupPassword.value,
      age: parseInt(signupAge.value)
  };

  try {
      const res = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (res.ok) {
          localStorage.setItem('token', data.token);
          currentUser = data.user;
          isAuthenticated = true;
          updateAuthUI();
          navigateTo('dashboard');
      } else {
          showToast(data.error || 'Signup failed', 'error');
      }
  } catch (error) {
      showToast('Something went wrong during signup.', 'error');
  }
});

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check for existing login
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        
        // Load user progress
        const progress = localStorage.getItem(`progress_${currentUser.username}`);
        if (progress) {
            userProgress = JSON.parse(progress);
        }
        
        updateAuthUI();
        updateGameStats();
    }
    
    // Navigation Links
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
    });
    
    dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('dashboard');
    });
    
    classroomLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('classroom');
    });
    
    gamesLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('games');
    });
    
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('profile');
    });
    
    // Auth Buttons
    loginButton.addEventListener('click', () => openModal(loginModal));
    signupButton.addEventListener('click', () => openModal(signupModal));
    logoutButton.addEventListener('click', handleLogout);
    
    // Get Started Button
    if (getStartedButton) {
        getStartedButton.addEventListener('click', () => {
            if (isAuthenticated) {
                navigateTo('dashboard');
            } else {
                openModal(signupModal);
            }
        });
    }
    
    // Close Modal Buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Switch between login and signup
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
    
    // Auth Forms
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Topics
    topicCards.forEach(card => {
        card.addEventListener('click', () => {
            const topic = card.getAttribute('data-topic');
            showLesson(topic);
        });
    });
    
    // Back to topics
    backToTopicsBtn.addEventListener('click', () => {
        lessonContent.classList.add('hidden');
        topicsGrid.classList.remove('hidden');
    });
    
    // Games
    playGameBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameType = btn.getAttribute('data-game');
            startGame(gameType);
        });
    });
    
    // Back to games
    backToGamesBtn.addEventListener('click', () => {
        endGame();
        gameContainer.classList.add('hidden');
        gamesGrid.classList.remove('hidden');
    });
    
    // Profile
    saveProfileButton.addEventListener('click', saveProfile);
    
    // Initialize navigation
    navigateTo('home');
});

// Navigation
function navigateTo(page) {
    // Hide all pages
    landingPage.classList.add('hidden');
    dashboardPage.classList.add('hidden');
    classroomPage.classList.add('hidden');
    gamesPage.classList.add('hidden');
    profilePage.classList.add('hidden');
    
    // Reset active links
    homeLink.classList.remove('active');
    dashboardLink.classList.remove('active');
    classroomLink.classList.remove('active');
    gamesLink.classList.remove('active');
    profileLink.classList.remove('active');
    
    // Show selected page and set active link
    switch (page) {
        case 'home':
            landingPage.classList.remove('hidden');
            homeLink.classList.add('active');
            break;
        case 'dashboard':
            if (!isAuthenticated) {
                openModal(loginModal);
                return;
            }
            dashboardPage.classList.remove('hidden');
            dashboardLink.classList.add('active');
            updateDashboard();
            break;
        case 'classroom':
            if (!isAuthenticated) {
                openModal(loginModal);
                return;
            }
            classroomPage.classList.remove('hidden');
            classroomLink.classList.add('active');
            break;
        case 'games':
            if (!isAuthenticated) {
                openModal(loginModal);
                return;
            }
            gamesPage.classList.remove('hidden');
            gamesLink.classList.add('active');
            break;
        case 'profile':
            if (!isAuthenticated) {
                openModal(loginModal);
                return;
            }
            profilePage.classList.remove('hidden');
            profileLink.classList.add('active');
            updateProfilePage();
            break;
        default:
            landingPage.classList.remove('hidden');
            homeLink.classList.add('active');
    }
}

// Modal Functions
function openModal(modal) {
    modal.classList.remove('hidden');
}

function closeModal(modal) {
    modal.classList.add('hidden');
    
    // Reset form fields
    if (modal === loginModal) {
        loginForm.reset();
    } else if (modal === signupModal) {
        signupForm.reset();
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    try {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // For demo purposes, check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Set authentication state
            currentUser = user;
            isAuthenticated = true;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Initialize user progress if not exists
            if (!localStorage.getItem(`progress_${user.username}`)) {
                const initialProgress = {
                    mathProgress: 0,
                    readingProgress: 0,
                    memoryProgress: 0,
                    problemSolvingProgress: 0,
                    gamesPlayed: 0,
                    totalPoints: 0,
                    highestLevel: 1
                };
                localStorage.setItem(`progress_${user.username}`, JSON.stringify(initialProgress));
                userProgress = initialProgress;
            } else {
                userProgress = JSON.parse(localStorage.getItem(`progress_${user.username}`));
            }
            
            // Update UI
            updateAuthUI();
            closeModal(loginModal);
            navigateTo('dashboard');
            showToast('Success', 'Login successful!', 'success');
        } else {
            showToast('Error', 'Invalid username or password', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showToast('Error', 'Failed to login. Please try again.', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    try {
        const fullName = document.getElementById('signup-fullname').value;
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const age = document.getElementById('signup-age').value;
        
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName,
                username,
                email,
                password,
                age: parseInt(age)
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }
        
        // Save token and user data
        localStorage.setItem('token', data.token);
        currentUser = data.user;
        isAuthenticated = true;
        
        // Update UI
        updateAuthUI();
        closeModal(signupModal);
        navigateTo('dashboard');
        showToast('Success', 'Account created successfully!', 'success');
        
    } catch (error) {
        console.error('Signup error:', error);
        showToast('Error', error.message || 'Failed to create account', 'error');
    }
}

function handleLogout() {
    // Clear user data
    localStorage.removeItem('token');
    currentUser = null;
    isAuthenticated = false;
    
    // Update UI
    updateAuthUI();
    navigateTo('home');
    showToast('Success', 'You have been logged out', 'success');
}

// Update UI based on authentication state
function updateAuthUI() {
    if (isAuthenticated) {
        loginButton.classList.add('hidden');
        signupButton.classList.add('hidden');
        userMenu.classList.remove('hidden');
        usernameDisplay.textContent = currentUser.username;
        
        // Enable restricted navigation links
        dashboardLink.classList.remove('disabled');
        classroomLink.classList.remove('disabled');
        gamesLink.classList.remove('disabled');
        profileLink.classList.remove('disabled');
    } else {
        loginButton.classList.remove('hidden');
        signupButton.classList.remove('hidden');
        userMenu.classList.add('hidden');
        
        // Disable restricted navigation links
        dashboardLink.classList.add('disabled');
        classroomLink.classList.add('disabled');
        gamesLink.classList.add('disabled');
        profileLink.classList.add('disabled');
    }
}

// User Progress Functions
async function fetchUserProgress() {
    try {
        const response = await fetch(`${API_URL}/progress`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch progress');
        }
        
        const data = await response.json();
        userProgress = data;
        
        // Update dashboard if visible
        if (!dashboardPage.classList.contains('hidden')) {
            updateDashboard();
        }
        
        // Update profile if visible
        if (!profilePage.classList.contains('hidden')) {
            updateProfilePage();
        }
        
    } catch (error) {
        showToast('Error', error.message || 'Failed to fetch progress', 'error');
    }
}

async function initializeUserProgress() {
    try {
        const response = await fetch(`${API_URL}/progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                mathProgress: 0,
                readingProgress: 0,
                memoryProgress: 0,
                problemSolvingProgress: 0,
                gamesPlayed: 0,
                totalPoints: 0,
                highestLevel: 1
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to initialize progress');
        }
        
        const data = await response.json();
        userProgress = data;
        
    } catch (error) {
        showToast('Error', error.message || 'Failed to initialize progress', 'error');
    }
}

async function updateUserProgress(updates) {
    try {
        const response = await fetch(`${API_URL}/progress`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update progress');
        }
        
        const data = await response.json();
        userProgress = data;
        
        // Update dashboard if visible
        if (!dashboardPage.classList.contains('hidden')) {
            updateDashboard();
        }
        
        // Update profile if visible
        if (!profilePage.classList.contains('hidden')) {
            updateProfilePage();
        }
        
    } catch (error) {
        showToast('Error', error.message || 'Failed to update progress', 'error');
    }
}

// Update Dashboard
function updateDashboard() {
    // Update progress bars
    mathProgress.style.width = `${userProgress.mathProgress}%`;
    mathProgressText.textContent = userProgress.mathProgress;
    
    readingProgress.style.width = `${userProgress.readingProgress}%`;
    readingProgressText.textContent = userProgress.readingProgress;
    
    memoryProgress.style.width = `${userProgress.memoryProgress}%`;
    memoryProgressText.textContent = userProgress.memoryProgress;
    
    // Update activity list
    if (userProgress.gamesPlayed > 0) {
        // Clear empty state
        activityList.innerHTML = '';
        
        // Add some mock activities
        const activities = [
            { 
                type: 'game', 
                title: 'Completed Memory Match Game', 
                time: 'Today', 
                icon: '🎮' 
            },
            { 
                type: 'lesson', 
                title: 'Completed Math Lesson', 
                time: 'Yesterday', 
                icon: '📚' 
            }
        ];
        
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-details">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }
    
    // Update achievements
    if (userProgress.gamesPlayed >= 5) {
        const achievement = achievementsGrid.children[0];
        achievement.classList.remove('locked');
    }
    
    if (userProgress.highestLevel >= 5) {
        const achievement = achievementsGrid.children[1];
        achievement.classList.remove('locked');
    }
}

// Classroom Functions
function showLesson(topic) {
    // Hide topics grid and show lesson content
    topicsGrid.classList.add('hidden');
    lessonContent.classList.remove('hidden');
    
    // Set lesson content based on topic
    let lessonTitle = '';
    let lessonContent = '';
    
    switch (topic) {
        case 'math':
            lessonTitle = 'Math Skills';
            lessonContent = `
                <h2>Introduction to Basic Math</h2>
                <p>In this lesson, we'll learn about numbers, counting, and simple addition.</p>
                <div class="video-container">
                    <div class="video-placeholder">
                        <p>Math lesson video would appear here</p>
                    </div>
                </div>
                <div class="lesson-exercise">
                    <h3>Practice Exercise</h3>
                    <p>Complete these addition problems:</p>
                    <div class="exercise-item">
                        <p>1 + 2 = ?</p>
                        <input type="number" class="form-input" placeholder="Your answer">
                    </div>
                    <div class="exercise-item">
                        <p>3 + 5 = ?</p>
                        <input type="number" class="form-input" placeholder="Your answer">
                    </div>
                    <button class="btn btn-primary">Check Answers</button>
                </div>
            `;
            break;
        case 'reading':
            lessonTitle = 'Reading Comprehension';
            lessonContent = `
                <h2>Basic Reading Skills</h2>
                <p>Let's practice reading and understanding simple stories.</p>
                <div class="story-container">
                    <h3>The Red Ball</h3>
                    <p>Tom has a red ball. He likes to play with his red ball in the park. One day, Tom lost his ball. He was sad. His friend Sam found the ball under a tree. Tom was happy again!</p>
                </div>
                <div class="lesson-exercise">
                    <h3>Questions</h3>
                    <div class="exercise-item">
                        <p>What color was Tom's ball?</p>
                        <input type="text" class="form-input" placeholder="Your answer">
                    </div>
                    <div class="exercise-item">
                        <p>Where did Sam find the ball?</p>
                        <input type="text" class="form-input" placeholder="Your answer">
                    </div>
                    <button class="btn btn-primary">Check Answers</button>
                </div>
            `;
            break;
        case 'problem-solving':
            lessonTitle = 'Problem Solving';
            lessonContent = `
                <h2>Introduction to Puzzles</h2>
                <p>Let's learn how to solve simple puzzles and problems.</p>
                <div class="puzzle-container">
                    <h3>Pattern Recognition</h3>
                    <p>What comes next in this pattern?</p>
                    <div class="pattern-display">
                        <div class="pattern-item">🔴</div>
                        <div class="pattern-item">🔵</div>
                        <div class="pattern-item">🔴</div>
                        <div class="pattern-item">🔵</div>
                        <div class="pattern-item">?</div>
                    </div>
                    <div class="pattern-options">
                        <div class="pattern-option">🔴</div>
                        <div class="pattern-option">🔵</div>
                        <div class="pattern-option">🟢</div>
                    </div>
                </div>
            `;
            break;
        case 'memory':
            lessonTitle = 'Memory Skills';
            lessonContent = `
                <h2>Memory Enhancement</h2>
                <p>Let's practice techniques to improve memory and concentration.</p>
                <div class="video-container">
                    <div class="video-placeholder">
                        <p>Memory training video would appear here</p>
                    </div>
                </div>
                <div class="memory-exercise">
                    <h3>Memory Challenge</h3>
                    <p>Look at these shapes for 10 seconds, then try to recall them in order.</p>
                    <div class="memory-shapes">
                        <div class="memory-shape">🔺</div>
                        <div class="memory-shape">🟦</div>
                        <div class="memory-shape">⭐</div>
                        <div class="memory-shape">🔶</div>
                        <div class="memory-shape">⚫</div>
                    </div>
                    <button class="btn btn-primary memory-start-btn">Start Challenge</button>
                    <div class="memory-answer-area hidden">
                        <p>Select the shapes in the correct order:</p>
                        <div class="memory-answer-options">
                            <div class="memory-option">🔺</div>
                            <div class="memory-option">🟦</div>
                            <div class="memory-option">⭐</div>
                            <div class="memory-option">🔶</div>
                            <div class="memory-option">⚫</div>
                        </div>
                        <div class="memory-answers"></div>
                        <button class="btn btn-primary memory-check-btn">Check Answer</button>
                    </div>
                </div>
            `;
            break;
        default:
            lessonTitle = 'Lesson';
            lessonContent = '<p>Lesson content not available.</p>';
    }
    
    // Update lesson container
    lessonContainer.innerHTML = `
        <h2>${lessonTitle}</h2>
        <div class="lesson-content-inner">
            ${lessonContent}
        </div>
    `;
    
    // Update progress (for demo only)
    let progressUpdates = {};
    switch (topic) {
        case 'math':
            progressUpdates = { mathProgress: Math.min(userProgress.mathProgress + 10, 100) };
            break;
        case 'reading':
            progressUpdates = { readingProgress: Math.min(userProgress.readingProgress + 10, 100) };
            break;
        case 'memory':
            progressUpdates = { memoryProgress: Math.min(userProgress.memoryProgress + 10, 100) };
            break;
        case 'problem-solving':
            progressUpdates = { problemSolvingProgress: Math.min(userProgress.problemSolvingProgress + 10, 100) };
            break;
    }
    
    updateUserProgress(progressUpdates);
}

// Games Functions
function updateGameStats() {
    if (!isAuthenticated || !currentUser) return;
    
    const progress = JSON.parse(localStorage.getItem(`progress_${currentUser.username}`)) || {
        memoryMatchHighScore: 0,
        memoryMatchLevel: 1,
        patternMasterHighScore: 0,
        patternMasterLevel: 1,
        wordBuilderHighScore: 0,
        wordBuilderLevel: 1
    };
    
    // Update game stats display
    memoryMatchHighScore.textContent = progress.memoryMatchHighScore || '0';
    memoryMatchLevel.textContent = progress.memoryMatchLevel || '1';
    
    patternMasterHighScore.textContent = progress.patternMasterHighScore || '0';
    patternMasterLevel.textContent = progress.patternMasterLevel || '1';
    
    wordBuilderHighScore.textContent = progress.wordBuilderHighScore || '0';
    wordBuilderLevel.textContent = progress.wordBuilderLevel || '1';
}

function startGame(gameType) {
    if (!isAuthenticated) {
        showToast('Error', 'Please login to play games', 'error');
        openModal(loginModal);
        return;
    }
    
    // Hide games grid and show game container
    gamesGrid.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    // Reset game state
    currentGame = gameType;
    gameScore = 0;
    gameLevel = 1;
    gameTimer = 0;
    
    // Update game info
    updateGameInfo();
    
    // Setup game board based on game type
    setupGameBoard(gameType);
    
    // Start timer
    startGameTimer();
}

function endGame() {
    // Clear timer
    clearInterval(timerInterval);
    
    // Save game score
    saveGameScore(currentGame, gameScore, gameLevel);
    
    // Reset game state
    currentGame = null;
    gameBoard.innerHTML = '';
}

function updateGameInfo() {
    switch (currentGame) {
        case 'memory-match':
            currentGameTitle.textContent = 'Memory Match';
            break;
        case 'pattern-master':
            currentGameTitle.textContent = 'Pattern Master';
            break;
        case 'word-builder':
            currentGameTitle.textContent = 'Word Builder';
            break;
        default:
            currentGameTitle.textContent = 'Game';
    }
    
    currentGameScore.textContent = gameScore;
    currentGameLevel.textContent = gameLevel;
    currentGameTimer.textContent = gameTimer;
}

function startGameTimer() {
    // Reset timer
    gameTimer = 0;
    currentGameTimer.textContent = gameTimer;
    
    // Start interval
    timerInterval = setInterval(() => {
        gameTimer++;
        currentGameTimer.textContent = gameTimer;
    }, 1000);
}

function setupGameBoard(gameType) {
    gameBoard.innerHTML = '';
    
    switch (gameType) {
        case 'memory-match':
            setupMemoryMatchGame();
            break;
        case 'pattern-master':
            setupPatternMasterGame();
            break;
        case 'word-builder':
            setupWordBuilderGame();
            break;
    }
}

// Memory Match Game
function setupMemoryMatchGame() {
    gameBoard.innerHTML = '<div class="memory-game-board"></div>';
    const memoryGameBoard = gameBoard.querySelector('.memory-game-board');
    
    // Create cards based on level
    const numPairs = 4 + (gameLevel - 1) * 2; // 4 pairs at level 1, 6 at level 2, etc.
    const cardValues = [];
    
    // Generate pairs of values
    for (let i = 1; i <= numPairs; i++) {
        cardValues.push(i, i);
    }
    
    // Shuffle card values
    shuffleArray(cardValues);
    
    // Create card elements
    cardValues.forEach((value, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.value = value;
        card.innerHTML = `
            <div class="memory-card-front">${value}</div>
            <div class="memory-card-back"></div>
        `;
        
        // Add click event
        card.addEventListener('click', () => flipCard(card));
        
        memoryGameBoard.appendChild(card);
    });
    
    // Set grid columns based on number of cards
    const totalCards = numPairs * 2;
    const columns = totalCards <= 12 ? 4 : totalCards <= 20 ? 5 : 6;
    memoryGameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

function flipCard(card) {
    // Check if card can be flipped
    if (!canFlip || card.classList.contains('flipped') || flippedCards.length >= 2) {
        return;
    }
    
    // Flip card
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Check for match if two cards are flipped
    if (flippedCards.length === 2) {
        canFlip = false;
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const value1 = card1.dataset.value;
    const value2 = card2.dataset.value;
    
    if (value1 === value2) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        gameScore += 10;
        currentGameScore.textContent = gameScore;
        
        // Check if all pairs are found
        const numPairs = 4 + (gameLevel - 1) * 2;
        if (matchedPairs === numPairs) {
            // Level completed
            setTimeout(() => {
                showToast('Success', 'Level completed!', 'success');
                gameLevel++;
                currentGameLevel.textContent = gameLevel;
                matchedPairs = 0;
                flippedCards = [];
                setupMemoryMatchGame();
            }, 1000);
        } else {
            // Reset for next pair
            flippedCards = [];
            canFlip = true;
        }
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

// Pattern Master Game
function setupPatternMasterGame() {
    gameBoard.innerHTML = '<div class="pattern-game-board"></div>';
    const patternGameBoard = gameBoard.querySelector('.pattern-game-board');
    
    // Create pattern based on level
    const difficulty = Math.min(gameLevel, 5);
    const patterns = [
        { sequence: ['🟥', '🟦', '🟥', '🟦'], answer: '🟥' },
        { sequence: ['🔴', '🔵', '🟢', '🔴', '🔵'], answer: '🟢' },
        { sequence: ['1', '3', '5', '7'], answer: '9' },
        { sequence: ['A', 'C', 'E', 'G'], answer: 'I' },
        { sequence: ['🔺', '🔻', '🔺', '🔻'], answer: '🔺' }
    ];
    
    const pattern = patterns[difficulty - 1] || patterns[0];
    const options = [...new Set([...pattern.sequence, pattern.answer])];
    shuffleArray(options);
    
    // Create pattern display
    const patternSequence = document.createElement('div');
    patternSequence.className = 'pattern-sequence';
    
    pattern.sequence.forEach(item => {
        const patternItem = document.createElement('div');
        patternItem.className = 'pattern-item';
        patternItem.textContent = item;
        patternSequence.appendChild(patternItem);
    });
    
    const questionMark = document.createElement('div');
    questionMark.className = 'pattern-item question-mark';
    questionMark.textContent = '?';
    patternSequence.appendChild(questionMark);
    
    // Create options
    const patternOptions = document.createElement('div');
    patternOptions.className = 'pattern-options';
    
    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'pattern-option';
        optionElement.textContent = option;
        optionElement.dataset.value = option;
        
        // Add click event
        optionElement.addEventListener('click', () => selectPatternOption(optionElement, pattern.answer));
        
        patternOptions.appendChild(optionElement);
    });
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.className = 'pattern-instructions';
    instructions.innerHTML = '<p>Select the next item in the pattern:</p>';
    
    // Add pattern elements to game board
    patternGameBoard.appendChild(instructions);
    patternGameBoard.appendChild(patternSequence);
    patternGameBoard.appendChild(patternOptions);
}

function selectPatternOption(option, correctAnswer) {
    // Remove selection from all options
    const options = document.querySelectorAll('.pattern-option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Select this option
    option.classList.add('selected');
    
    // Check if answer is correct
    setTimeout(() => {
        if (option.dataset.value === correctAnswer) {
            // Correct answer
            showToast('Success', 'Correct!', 'success');
            gameScore += 20;
            currentGameScore.textContent = gameScore;
            
            // Move to next level
            gameLevel++;
            currentGameLevel.textContent = gameLevel;
            setupPatternMasterGame();
        } else {
            // Wrong answer
            showToast('Error', 'Try again!', 'error');
            option.classList.remove('selected');
        }
    }, 500);
}

// Word Builder Game
function setupWordBuilderGame() {
    gameBoard.innerHTML = '<div class="word-game-board"></div>';
    const wordGameBoard = gameBoard.querySelector('.word-game-board');
    
    // Create word puzzle based on level
    const words = ['CAT', 'FROG', 'HOUSE', 'PLANET', 'RAINBOW'];
    const wordIndex = Math.min(gameLevel - 1, words.length - 1);
    const word = words[wordIndex];
    
    // Create instructions
    const instructions = document.createElement('div');
    instructions.className = 'word-instructions';
    instructions.innerHTML = '<p>Build the word using the letter tiles:</p>';
    
    // Create word container
    const wordContainer = document.createElement('div');
    wordContainer.className = 'word-container';
    
    for (let i = 0; i < word.length; i++) {
        const wordSlot = document.createElement('div');
        wordSlot.className = 'word-slot';
        wordSlot.dataset.index = i;
        wordContainer.appendChild(wordSlot);
    }
    
    // Create letter tiles
    const lettersContainer = document.createElement('div');
    lettersContainer.className = 'letters-container';
    
    // Create letter tiles with scrambled word + some extra letters
    let letters = word.split('');
    if (word.length < 6) {
        // Add some extra letters
        const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < 6 - word.length; i++) {
            const randomLetter = extraLetters.charAt(Math.floor(Math.random() * extraLetters.length));
            letters.push(randomLetter);
        }
    }
    
    // Shuffle letters
    shuffleArray(letters);
    
    letters.forEach((letter, index) => {
        const letterTile = document.createElement('div');
        letterTile.className = 'letter-tile';
        letterTile.textContent = letter;
        letterTile.dataset.letter = letter;
        letterTile.dataset.index = index;
        
        // Add click event
        letterTile.addEventListener('click', () => selectLetterTile(letterTile, word));
        
        lettersContainer.appendChild(letterTile);
    });
    
    // Add check button
    const checkButton = document.createElement('button');
    checkButton.className = 'btn btn-primary check-word-btn';
    checkButton.textContent = 'Check Word';
    checkButton.addEventListener('click', () => checkWordAnswer(word));
    
    // Add elements to game board
    wordGameBoard.appendChild(instructions);
    wordGameBoard.appendChild(wordContainer);
    wordGameBoard.appendChild(lettersContainer);
    wordGameBoard.appendChild(checkButton);
}

let selectedLetters = [];

function selectLetterTile(tile, word) {
    // Skip if already used
    if (tile.classList.contains('used')) {
        return;
    }
    
    // Find the next empty slot
    const slots = document.querySelectorAll('.word-slot:not(.filled)');
    if (slots.length === 0) {
        return;
    }
    
    const slot = slots[0];
    
    // Fill the slot
    slot.textContent = tile.dataset.letter;
    slot.dataset.tileIndex = tile.dataset.index;
    slot.classList.add('filled');
    
    // Mark tile as used
    tile.classList.add('used');
    
    // Add to selected letters
    selectedLetters.push({
        letter: tile.dataset.letter,
        tileIndex: tile.dataset.index,
        slotIndex: slot.dataset.index
    });
    
    // Check if all slots are filled
    if (document.querySelectorAll('.word-slot:not(.filled)').length === 0) {
        // Enable check button
        document.querySelector('.check-word-btn').disabled = false;
    }
}

function checkWordAnswer(correctWord) {
    // Get the entered word
    const filledSlots = document.querySelectorAll('.word-slot.filled');
    let enteredWord = '';
    
    filledSlots.forEach(slot => {
        enteredWord += slot.textContent;
    });
    
    if (enteredWord === correctWord) {
        // Correct answer
        showToast('Success', 'Correct!', 'success');
        gameScore += 15;
        currentGameScore.textContent = gameScore;
        
        // Move to next level
        gameLevel++;
        currentGameLevel.textContent = gameLevel;
        selectedLetters = [];
        setupWordBuilderGame();
    } else {
        // Wrong answer
        showToast('Error', 'Try again!', 'error');
        
        // Reset slots
        filledSlots.forEach(slot => {
            slot.textContent = '';
            slot.classList.remove('filled');
            delete slot.dataset.tileIndex;
        });
        
        // Reset tiles
        document.querySelectorAll('.letter-tile.used').forEach(tile => {
            tile.classList.remove('used');
        });
        
        // Reset selected letters
        selectedLetters = [];
    }
}

// Profile Functions
async function updateProfilePage() {
    if (!isAuthenticated) return;
    
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        
        const user = await response.json();
        currentUser = user;
        
        // Set profile data
        profileFullname.value = user.fullName || '';
        profileUsername.value = user.username || '';
        profileEmail.value = user.email || '';
        profileAge.value = user.age || '';
        
        // Set avatar initials
        if (user.fullName) {
            const nameParts = user.fullName.split(' ');
            if (nameParts.length > 1) {
                avatarInitials.textContent = `${nameParts[0][0]}${nameParts[1][0]}`;
            } else {
                avatarInitials.textContent = nameParts[0][0];
            }
        } else {
            avatarInitials.textContent = user.username ? user.username[0] : '';
        }
        
        // Set stats
        gamesPlayedStat.textContent = userProgress.gamesPlayed || 0;
        totalPointsStat.textContent = userProgress.totalPoints || 0;
        highestLevelStat.textContent = userProgress.highestLevel || 1;
        
    } catch (error) {
        showToast('Error', error.message || 'Failed to fetch profile', 'error');
    }
}

async function saveProfile() {
    if (!isAuthenticated) return;
    
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                fullName: profileFullname.value,
                username: profileUsername.value,
                email: profileEmail.value,
                age: parseInt(profileAge.value)
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        
        const user = await response.json();
        currentUser = user;
        
        // Update UI
        updateProfilePage();
        updateAuthUI();
        
        showToast('Success', 'Profile updated successfully!', 'success');
        
    } catch (error) {
        showToast('Error', error.message || 'Failed to update profile', 'error');
    }
}

// Game Score Functions
async function saveGameScore(gameType, score, level) {
    if (!isAuthenticated || !currentUser) {
        showToast('Error', 'Please login to save your score', 'error');
        return;
    }
    
    try {
        // Get existing progress
        const progress = JSON.parse(localStorage.getItem(`progress_${currentUser.username}`)) || {};
        
        // Update game-specific scores
        switch (gameType) {
            case 'memory-match':
                progress.memoryMatchHighScore = Math.max(progress.memoryMatchHighScore || 0, score);
                progress.memoryMatchLevel = Math.max(progress.memoryMatchLevel || 1, level);
                break;
            case 'pattern-master':
                progress.patternMasterHighScore = Math.max(progress.patternMasterHighScore || 0, score);
                progress.patternMasterLevel = Math.max(progress.patternMasterLevel || 1, level);
                break;
            case 'word-builder':
                progress.wordBuilderHighScore = Math.max(progress.wordBuilderHighScore || 0, score);
                progress.wordBuilderLevel = Math.max(progress.wordBuilderLevel || 1, level);
                break;
        }
        
        // Update general progress
        progress.gamesPlayed = (progress.gamesPlayed || 0) + 1;
        progress.totalPoints = (progress.totalPoints || 0) + score;
        progress.highestLevel = Math.max(progress.highestLevel || 1, level);
        
        // Save updated progress
        localStorage.setItem(`progress_${currentUser.username}`, JSON.stringify(progress));
        userProgress = progress;
        
        // Update UI
        updateGameStats();
        updateDashboard();
        
        // Show toast with score
        showToast('Game Complete', `Score: ${score} • Level: ${level}`, 'success');
        
    } catch (error) {
        console.error('Save score error:', error);
        showToast('Error', 'Failed to save game score', 'error');
    }
}

// Utility Functions
function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize App
document.addEventListener('DOMContentLoaded', initApp);

// For demo purposes, navigate to home page initially
navigateTo('home');
const words = ["PENDU", "JAVASCRIPT", "DEVELOPPEUR", "INFORMATIQUE", "PROGRAMME"];
let selectedWord = words[Math.floor(Math.random() * words.length)];
console.log(selectedWord);

let wordDisplay = document.getElementById("word");
let buttons = document.querySelectorAll(".boutton button");

let guessedLetters = [];
let wrongGuesses = 0;
let maxTries = 6;

const canvas = document.getElementById("hangman-canvas");
const ctx = canvas.getContext("2d");

// Création de la modal
const modal = document.createElement('div');
modal.className = 'game-modal';
modal.innerHTML = `
    <div class="modal-content">
        <h2></h2>
        <p></p>
        <div class="word-reveal"></div>
        <button class="play-again-btn">Rejouer</button>
    </div>
`;
document.body.appendChild(modal);

// Fonction pour créer les confettis
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 1) + 's';
        confetti.style.backgroundColor = ['#f9d342', '#4CAF50', '#ffffff'][Math.floor(Math.random() * 3)];
        modal.appendChild(confetti);
        
        // Supprime le confetti après l'animation
        setTimeout(() => confetti.remove(), 2000);
    }
}

// Fonction pour afficher la modal
function showModal(won) {
    const modalContent = modal.querySelector('.modal-content');
    const title = modal.querySelector('h2');
    const message = modal.querySelector('p');
    const wordReveal = modal.querySelector('.word-reveal');
    
    modalContent.className = 'modal-content ' + (won ? 'victory' : 'defeat');
    
    if (won) {
        title.textContent = '🎉 VICTOIRE ! 🎉';
        message.textContent = 'Félicitations ! Tu as trouvé le mot :';
        createConfetti();
    } else {
        title.textContent = '😔 PERDU ! 😔';
        message.textContent = 'Dommage ! Le mot était :';
    }
    
    wordReveal.textContent = selectedWord;
    modal.style.display = 'flex';
}

// Gestionnaire pour le bouton "Rejouer"
modal.querySelector('.play-again-btn').addEventListener('click', () => {
    location.reload();
});

// Dessine la base
function drawBase() {
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000";

    // Sol
    ctx.beginPath();
    ctx.moveTo(10, 240);
    ctx.lineTo(190, 240);
    ctx.stroke();

    // Poteau vertical
    ctx.beginPath();
    ctx.moveTo(50, 240);
    ctx.lineTo(50, 20);
    ctx.stroke();

    // Poteau horizontal
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(140, 20);
    ctx.stroke();

    // Petite corde
    ctx.beginPath();
    ctx.moveTo(140, 20);
    ctx.lineTo(140, 50);
    ctx.stroke();
}

// Étapes du pendu avec animations
function drawHangman(step) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000";
    
    switch (step) {
        case 1: // Tête
            ctx.beginPath();
            let startAngle = 0;
            let endAngle = Math.PI * 2;
            const animate = (currentAngle) => {
                ctx.clearRect(120, 50, 40, 40);
                ctx.beginPath();
                ctx.arc(140, 70, 20, 0, currentAngle);
                ctx.stroke();
                if (currentAngle < endAngle) {
                    requestAnimationFrame(() => animate(currentAngle + 0.2));
                }
            };
            animate(startAngle);
            break;
        case 2: // Corps
            animateLine(140, 90, 140, 150);
            break;
        case 3: // Bras gauche
            animateLine(140, 100, 110, 130);
            break;
        case 4: // Bras droit
            animateLine(140, 100, 170, 130);
            break;
        case 5: // Jambe gauche
            animateLine(140, 150, 110, 200);
            break;
        case 6: // Jambe droite
            animateLine(140, 150, 170, 200);
            break;
    }
}

// Fonction pour animer le dessin d'une ligne
function animateLine(startX, startY, endX, endY) {
    const steps = 20;
    let currentStep = 0;
    
    const animate = () => {
        const progress = currentStep / steps;
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        currentStep++;
        if (currentStep <= steps) {
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

function updateWordDisplay() {
    let display = "";
    for (let letter of selectedWord) {
        if (guessedLetters.includes(letter)) {
            display += `<span class="revealed">${letter}</span> `;
        } else {
            display += "_ ";
        }
    }
    wordDisplay.innerHTML = display.trim();
}

function handleGuess(event) {
    let letter = event.target.textContent;
    let button = event.target;
    
    // Ajoute la classe clicked pour l'animation de clic
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 300);
    
    button.disabled = true;

    if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
        button.classList.add('correct');
    } else {
        wrongGuesses++;
        button.classList.add('incorrect');
        drawHangman(wrongGuesses);
    }

    updateWordDisplay();
    checkGameStatus();
}

function checkGameStatus() {
    let wordGuessed = selectedWord.split("").every(letter => guessedLetters.includes(letter));

    if (wordGuessed) {
        wordDisplay.classList.add("victory");
        setTimeout(() => {
            showModal(true);
        }, 500);
    } else if (wrongGuesses >= maxTries) {
        wordDisplay.classList.add("defeat");
        setTimeout(() => {
            showModal(false);
        }, 500);
    }
}

// Ajoute l'effet de survol sur les boutons
buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
        if (!button.disabled) {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        }
    });

    button.addEventListener('mouseout', () => {
        if (!button.disabled) {
            button.style.transform = 'translateY(0) scale(1)';
        }
    });

    button.addEventListener('click', handleGuess);
});

// Initialisation
drawBase();
updateWordDisplay();
// --- Selección de Elementos del DOM ---
const introSequence = document.querySelector("#intro-sequence");
const introVideo = document.querySelector("#intro-video");
const videoOverlay = document.querySelector("#video-overlay");
const disclaimerEnvelope = document.querySelector("#disclaimer-envelope");
const acceptBtn = document.querySelector("#accept-btn");
const bookScene = document.querySelector("#book-scene");

const book = document.querySelector("#book");
const papers = document.querySelectorAll(".paper");

// --- Estado Global ---
let currentLocation = 1;
let numOfPapers = papers.length;
let maxLocation = numOfPapers + 1;
let isEnvelopeOpen = false;

// --- LÓGICA DE LA SECUENCIA DE INTRODUCCIÓN ---

window.addEventListener("load", () => {
    // Inicia la animación del sobre casi de inmediato
    setTimeout(() => {
        disclaimerEnvelope.classList.add("visible");
    }, 500);
});

disclaimerEnvelope.addEventListener("click", () => {
    if (!isEnvelopeOpen) {
        disclaimerEnvelope.classList.add("is-open");
        isEnvelopeOpen = true;
    }
});

acceptBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita que el clic en el botón se propague al sobre
    
    // Oculta la carta y la capa de oscurecimiento
    disclaimerEnvelope.classList.remove("visible");
    videoOverlay.style.opacity = "0";
    
    // Espera un momento para la animación de salida y luego reproduce el video
    setTimeout(() => {
        introVideo.play();
    }, 1000); 
});

// Detecta cuando el video termina para pasar a la siguiente escena
introVideo.addEventListener("ended", () => {
    introSequence.style.opacity = '0';
    
    setTimeout(() => {
        introSequence.classList.add("hidden");
        bookScene.classList.remove("hidden");
    }, 1000);
});

// --- LÓGICA DEL LIBRO ---

book.addEventListener("click", handleBookClick);

function handleBookClick(e) {
    // El libro solo funciona si su escena es visible
    if (bookScene.classList.contains('hidden')) return;
    
    if (currentLocation === 1) {
        goNextPage();
        return;
    }
    if (currentLocation > numOfPapers) {
        goPrevPage();
        return;
    }

    const rect = book.getBoundingClientRect();
    const bookMidX = rect.left + rect.width / 2;
    if (e.clientX > bookMidX) goNextPage();
    else goPrevPage();
}

function goNextPage() {
    if (currentLocation <= numOfPapers) {
        papers[currentLocation - 1].classList.add("flipped");
        papers[currentLocation - 1].style.zIndex = currentLocation;
        currentLocation++;
        updateBookState();
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        currentLocation--;
        papers[currentLocation - 1].classList.remove("flipped");
        papers[currentLocation - 1].style.zIndex = numOfPapers - (currentLocation - 1);
        updateBookState();
    }
}

function updateBookState() {
    book.classList.remove("closed-front", "open-reading", "closed-back");
    if (currentLocation === 1) book.classList.add("closed-front");
    else if (currentLocation > numOfPapers) book.classList.add("closed-back");
    else book.classList.add("open-reading");
}

function initializeBook() {
    papers.forEach((paper, index) => {
        paper.style.zIndex = numOfPapers - index;
    });
    updateBookState();
}
initializeBook();


"use strict";
// Script do Carrossel de Animais
const carouselInner = document.getElementById("carousel-inner");
const totalSlides = 3; // Número total de slides no carrossel
let currentIndex = 0;

if (document.getElementById("prevBtn") && document.getElementById("nextBtn") && carouselInner) {
    document.getElementById("prevBtn").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    });
}

function updateCarousel() {
    if (carouselInner) {
        // Corrigido o cálculo da porcentagem para o transform
        const percentage = (100 / totalSlides) * currentIndex;
        carouselInner.style.transform = `translateX(-${percentage}%)`;
    }
}

// Script do Menu Hamburguer/Mobile
// ATENÇÃO: Certifique-se de que você tem um botão com id="menu-btn"
// e o container do menu com id="mobile-menu" no seu HTML para este script funcionar.
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden"); // 'hidden' é uma classe do Tailwind CSS
    });
} else {
    console.warn("Elementos para o menu mobile (menu-btn ou mobile-menu) não encontrados.");
}
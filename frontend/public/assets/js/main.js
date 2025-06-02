"use strict";

// Script do Carrossel de Animais
const carouselInner = document.getElementById("carousel-inner");
const totalSlides = 3;
let currentIndex = 0;

if (carouselInner) {
    carouselInner.style.width = `${totalSlides * 100}%`;

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });

        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });
    }
}

function updateCarousel() {
    if (carouselInner) {
        const percentage = (100 / totalSlides) * currentIndex;
        carouselInner.style.transform = `translateX(-${percentage}%)`;
    }
}

// Script do Menu Hamburguer/Mobile
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
} else {
    if (!menuBtn && document.getElementById('mobile-menu')) {
        // console.warn("Botão do menu mobile (id='menu-btn') não encontrado no index.html. O menu mobile não será interativo.");
    }
}
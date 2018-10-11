"use strict";
const burgerNav = document.querySelector(".js-nav");
const mainNav = document.querySelector(".js-nav-hidden");
burgerNav.classList.remove("visually-hidden");
burgerNav.firstElementChild.classList.remove("toggle-menu__item--active");
mainNav.classList.add("visually-hidden");

function toggleBurger(evt) {
  evt.currentTarget.firstElementChild.classList.toggle("toggle-menu__item--active");
  mainNav.classList.toggle("visually-hidden");
}

burgerNav.addEventListener("click", toggleBurger);

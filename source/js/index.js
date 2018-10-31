"use strict";
// polyFill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// burgerNav
const burgerNav = document.querySelector(".js-nav");
const burgerNavChild = burgerNav.firstElementChild;
const mainNav = document.querySelectorAll(".js-nav-hidden");
const indicator = 768;
const hiddenClass = "visually-hidden";
const toggleItemActiveClass = "toggle-menu__item--active";

getMenuInterface();

function getMenuInterface() {
  window.innerWidth < indicator ? hiddenMenu() : showMenu();
}

function hiddenMenu() {
  burgerNav.classList.remove(hiddenClass);
  burgerNavChild.classList.remove(toggleItemActiveClass);
  mainNav.forEach(function (item) {
    item.classList.add(hiddenClass)
  });
}

function showMenu() {
  burgerNav.classList.add(hiddenClass);
  burgerNavChild.classList.add(toggleItemActiveClass);
  mainNav.forEach(function (item) {
    item.classList.remove(hiddenClass)
  });
}

function handleResizeChangeMenu() {
  if (window.innerWidth < indicator && !(burgerNav.classList.contains(hiddenClass))) return;
  getMenuInterface();
}

window.addEventListener('resize', handleResizeChangeMenu);

function handleClickToggleBurger() {
  burgerNavChild.classList.toggle(toggleItemActiveClass);
  mainNav.forEach(function (item) {
    item.classList.toggle(hiddenClass)
  });
}

burgerNav.addEventListener("click", handleClickToggleBurger);

// popup
const popup = document.querySelector(".js-popup");
const action = document.querySelectorAll(".js-action-modal");
const overlay = document.querySelector('.overlay');
const popupClose = document.querySelector('.js-popup-close');
const overlayClass = "overlay-visible";
const popupAnimationClass = "popup__animationModal";

function showModal(evt) {
  evt.preventDefault();
  popup.classList.remove(hiddenClass);
  popup.classList.add(popupAnimationClass);
  overlay.classList.add(overlayClass);
}

action.forEach(function (btn) {
  btn.addEventListener("click", showModal)
});

function hiddenModal() {
  popup.classList.add(hiddenClass);
  overlay.classList.remove(overlayClass);
}

function handleKeyUpEscape(evt) {
  if (evt.code !== "Escape") return;
  if (!popup.classList.contains(hiddenClass)) {
    evt.preventDefault();
    hiddenModal();
  }
}

function handleClickOverlay(evt) {
  if (evt.target === overlay) {
    hiddenModal();
  }
}

window.addEventListener("keyup", handleKeyUpEscape);
if (overlay) {
  overlay.addEventListener("click", handleClickOverlay);
}
if (popupClose) {
  popupClose.addEventListener('click', hiddenModal);
}

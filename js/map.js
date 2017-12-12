﻿'use strict';

(function () {
  // "Закрытие" или "открытие" полей добавлением свойства "disabled" (закрыто) или "" (открыто)
  function toggleFields(disabledProperty) {
    for (var i = 0; i < window.data.fields.length; i++) {
      window.data.fields[i].disabled = disabledProperty;
    }
  }

  toggleFields('disabled');

  function openElements() {
    showBlock('.map');
    window.data.noticeForm.classList.remove('notice__form--disabled');
    toggleFields('');
    window.pin.renderMapPins(window.data.listHouses);
    window.data.mapOpen.disabled = 'disabled';

    // Предыдущая карточка. Значение равно -1, если не существует (была закрыта ранее или не открывалась)
    var previousCard = -1;

    var cards = window.data.map.querySelectorAll('.map__card');
    var buttonsPopup = window.data.housesMap.querySelectorAll('.map__pin:nth-child(n+3)');

    function openPopup(index) {
      var currentCard = index;
      buttonsPopup[index].classList.add('map__pin--active');
      cards[index].classList.remove('hidden');
      if (previousCard !== -1 && previousCard !== currentCard) {
        closePopup(previousCard);
      }
      previousCard = currentCard;
    }

    function closePopup(index) {
      cards[index].classList.add('hidden');
      buttonsPopup[index].classList.remove('map__pin--active');
      previousCard = -1;
    }

    for (var i = 0; i < window.data.listHouses.length; i++) {
      (function (j) {
        var buttonClosePopup = cards[j].querySelector('.popup__close');

        buttonsPopup[j].addEventListener('click', function () {
          openPopup(j);
        });

        buttonsPopup[j].addEventListener('keydown', function (evt) {
          if (evt.keyCode === window.data.enterKeycode) {
            openPopup(j);
          }
        });

        buttonClosePopup.addEventListener('click', function () {
          closePopup(j);
        });

        buttonClosePopup.addEventListener('keydown', function (evt) {
          if (evt.keyCode === window.data.enterKeycode) {
            closePopup(j);
          }
        });

        function onPopupEscPress(evt) {
          if (evt.keyCode === window.data.escKeycode) {
            closePopup(j);
          }
        }

        document.addEventListener('keydown', onPopupEscPress);
      })(i);
    }
  }


  window.data.mapOpen.addEventListener('mouseup', function () {
    openElements();
  });

  window.data.mapOpen.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.data.enterKeycode) {
      openElements();
    }
  });

  // Функция показа элементов
  function showBlock() {
    window.data.map.classList.remove('map--faded');
  }

  var startCoords = 0;
  var addressPin = window.data.mapOpen.querySelector('img');

  addressPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var MIN_Y = 100; // миимальная ордината, выше которой флажок адреса поднять нельзя
  var MAX_Y = 500; // максимальая ордината, ниже которой флажок адреса опустить нельзя
  var ADDRESS_PIN_HEIGTH = 65;
  var minCurrentY = MIN_Y - ADDRESS_PIN_HEIGTH;
  var maxCurrentY = MAX_Y - ADDRESS_PIN_HEIGTH; // учет высоты флажка

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    var drag = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY,
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var currentX = (window.data.mapOpen.offsetLeft - drag.x);
    var currentY = (window.data.mapOpen.offsetTop - drag.y);

    // Ограничение движения флажка адреса по вертикали. флажок упирается в "невидимые барьеры"
    currentY = Math.min(Math.max(currentY, minCurrentY), maxCurrentY);

    window.data.mapOpen.style.top = currentY + 'px';
    window.data.mapOpen.style.left = currentX + 'px';
    window.data.noticeForm.querySelector('#address').value = 'x: ' + currentX + ', y: ' + (currentY + ADDRESS_PIN_HEIGTH);
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
})();

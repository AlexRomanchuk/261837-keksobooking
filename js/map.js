'use strict';
(function () {
  // "Закрытие" или "открытие" полей добавлением свойства "disabled" (закрыто) или "" (открыто)
  function toggleFields(disabledProperty) {
    for (var i = 0; i < window.data.fields.length; i++) {
      window.data.fields[i].disabled = disabledProperty;
    }
  }

  toggleFields('disabled');

  function clearMap() {
    var pins = window.data.housesMap.querySelectorAll('.map__pin:nth-child(n+3)');
    for (var i = 0; i < pins.length; i++) {
      if (pins) {
        window.data.housesMap.removeChild(pins[i]);
      }
    }
    var cards = window.data.map.querySelectorAll('.map__card');
    for (var j = 0; j < cards.length; j++) {
      if (cards) {
        window.data.map.removeChild(cards[j]);
      }
    }
  }

  function createMapElements(listHouses) {
    showBlock('.map');
    window.data.noticeForm.classList.remove('notice__form--disabled');
    toggleFields('');
    window.pin.renderMapPins(listHouses);
    window.data.mapOpen.disabled = 'disabled';
    window.renderCard(listHouses);
    window.buttonsPopup = window.data.housesMap.querySelectorAll('.map__pin:nth-child(n+3)');

    function renderFilteredPins() {
      clearMap();
      var filtered = window.filters.applyFilters(listHouses);
      window.pin.renderMapPins(filtered);
      var newPins = window.data.housesMap.querySelectorAll('.map__pin:nth-child(n+3)');
      window.renderCard(filtered);
      var newCards = window.data.map.querySelectorAll('.map__card');
      addEventClick(newPins, newCards, filtered);
    }

    window.filters.onFilterChange(renderFilteredPins);

    // Предыдущая карточка. Значение равно -1, если не существует (была закрыта ранее или не открывалась)
    window.previousCard = -1;
    window.cards = window.data.map.querySelectorAll('.map__card');

    function closePopup(cards, buttons, index) {
      cards[index].classList.add('hidden');
      buttons[index].classList.remove('map__pin--active');
      window.previousCard = -1;
    }

    function addEventClick(buttons, cards, array) {
      for (var i = 0; i < Math.min(array.length, window.data.maximumPins); i++) {
        (function (j) {
          var buttonClosePopup = cards[j].querySelector('.popup__close');
          buttons[j].addEventListener('click', function () {
            window.showCard(buttons, cards, j, closePopup);
          });

          buttons[j].addEventListener('keydown', function (evt) {
            if (evt.keyCode === window.data.enterKeycode) {
              window.showCard(buttons, cards, j, closePopup);
            }
          });

          buttonClosePopup.addEventListener('click', function () {
            closePopup(cards, buttons, j);
          });

          buttonClosePopup.addEventListener('keydown', function (evt) {
            if (evt.keyCode === window.data.enterKeycode) {
              closePopup(cards, buttons, j);
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

    addEventClick(window.buttonsPopup, window.cards, listHouses);
  }

  function openElements() {
    window.backend.load(createMapElements, window.messageError);
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

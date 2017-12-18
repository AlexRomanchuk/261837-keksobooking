'use strict';

(function () {
  // "Закрытие" или "открытие" полей добавлением свойства "disabled" (закрыто) или "" (открыто)
  function toggleFields(disabledProperty) {
    for (var i = 0; i < window.data.fields.length; i++) {
      window.data.fields[i].disabled = disabledProperty;
    }
  }

  toggleFields('disabled');

  window.updatePins = function (origin, filtered, buttons) {
    for (var t = 0; t < buttons.length; t++) {
      buttons[t].classList.add('hidden');
    }
    for (var i = 0; i < filtered.length; i++) {
      var j = origin.indexOf(filtered[i]);
      buttons[j].classList.remove('hidden');
    }
  };

  function createMapElements(data) {
    var listHouses = data;
    window.filters.getArrayData(listHouses);
    showBlock('.map');
    window.data.noticeForm.classList.remove('notice__form--disabled');
    toggleFields('');
    window.pin.renderMapPins(listHouses);
    window.data.mapOpen.disabled = 'disabled';
    window.renderCard(listHouses);
    window.buttonsPopup = window.data.housesMap.querySelectorAll('.map__pin:nth-child(n+3)');
    window.updatePins(listHouses, window.filters.filtered, window.buttonsPopup);

    // Предыдущая карточка. Значение равно -1, если не существует (была закрыта ранее или не открывалась)
    window.previousCard = -1;

    window.cards = window.data.map.querySelectorAll('.map__card');

    function closePopup(index) {
      window.cards[index].classList.add('hidden');
      window.buttonsPopup[index].classList.remove('map__pin--active');
      window.previousCard = -1;
    }

    for (var i = 0; i < listHouses.length; i++) {
      (function (j) {
        var buttonClosePopup = window.cards[j].querySelector('.popup__close');
        window.buttonsPopup[j].addEventListener('click', function () {
          window.showCard(j, closePopup);
        });

        window.buttonsPopup[j].addEventListener('keydown', function (evt) {
          if (evt.keyCode === window.data.enterKeycode) {
            window.showCard(j, closePopup);
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

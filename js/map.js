'use strict';

(function () {
  var MIN_X = 0;
  var MAX_X = 1200;
  var MIN_Y = 100; // миимальная ордината, выше которой флажок адреса поднять нельзя
  var MAX_Y = 500; // максимальая ордината, ниже которой флажок адреса опустить нельзя
  var ADDRESS_PIN_HEIGTH = 65;
  var PIN_CENTER = 20; // середина кнопки .map__pin
  var PIN_HEIGTH = 44;
  var AVATAR_SIZE = 40; // ширина и высота аватарки равны

  // "Закрытие" или "открытие" полей добавлением свойства "disabled" (закрыто) или "" (открыто)
  function toggleFields(disabledProperty) {
    for (var i = 0; i < window.data.fields.length; i++) {
      window.data.fields[i].disabled = disabledProperty;
    }
  }

  toggleFields('disabled');

  window.pin = {
    addPins: function (data) {
      var mapList = document.querySelector('.map__pins');
      var fragment = document.createDocumentFragment();
      var maximunPins = Math.min(data.length, window.data.maximumPins);
      for (var i = 0; i < maximunPins; i++) {
        var mapPin = window.pin.createPin(data[i]);
        mapPin.dataset.offerIndex = i;
        mapPin.addEventListener('click', (function (pin) {
          return function () {
            window.card.showCard(pin, data);
          };
        })(mapPin));
        mapPin.addEventListener('keydown', (function (evt, pin) {
          return function () {
            if (evt.keyCode === window.data.enterKeycode) {
              window.card.showCard(pin, data);
            }
          };
        })(mapPin));
        fragment.appendChild(mapPin);
      }
      mapList.appendChild(fragment);
    },

    createPin: function (avatars) {
      var newMapPin = document.createElement('button');
      newMapPin.className = 'map__pin';
      newMapPin.style.left = (avatars.location.x + PIN_CENTER) + 'px';
      newMapPin.style.top = (avatars.location.y + PIN_HEIGTH) + 'px';
      var newAvatar = document.createElement('img');
      newAvatar.width = AVATAR_SIZE;
      newAvatar.heigth = AVATAR_SIZE;
      newAvatar.src = avatars.author.avatar;
      newAvatar.draggable = false;
      newMapPin.appendChild(newAvatar);
      return newMapPin;
    },

    activatePin: function (noticePin) {
      var activePins = document.querySelectorAll('.map__pin--active');
      activePins.forEach(function (pin) {
        pin.classList.remove('map__pin--active');
      });
      noticePin.classList.add('map__pin--active');
    },

    generatePinElement: function (data) {
      window.pin.addPins(data, window.pin.createPin);
    }
  };

  function clearMap() {
    var pins = window.data.housesMap.querySelectorAll('.map__pin:nth-child(n+3)');
    if (pins) {
      pins.forEach(function (pin) {
        window.data.housesMap.removeChild(pin);
      });
    }
    var cards = window.data.map.querySelectorAll('.map__card');
    if (cards) {
      cards.forEach(function (card) {
        window.data.map.removeChild(card);
      });
    }
  }

  function createMapElements(listHouses) {
    showBlock('.map');
    window.data.noticeForm.classList.remove('notice__form--disabled');
    toggleFields('');
    window.pin.generatePinElement(listHouses);

    function renderFilteredPins() {
      clearMap();
      var filteredNotice = window.filters.applyFilters(listHouses);
      window.pin.generatePinElement(filteredNotice);
    }

    window.filters.onFilterChange(renderFilteredPins);
  }

  // Функция показа элементов
  function showBlock() {
    window.data.map.classList.remove('map--faded');
  }

  var startCoords = 0;

  function onMouseUp(upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('moveEvt', onMouseMove);
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(moveEvt) {
    var minCurrentY = MIN_Y - ADDRESS_PIN_HEIGTH;
    var maxCurrentY = MAX_Y - ADDRESS_PIN_HEIGTH; // учет высоты флажка
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

    // Ограничение движения флажка. флажок упирается в "невидимые барьеры"
    currentX = Math.min(Math.max(currentX, MIN_X), MAX_X);
    currentY = Math.min(Math.max(currentY, minCurrentY), maxCurrentY);

    window.data.mapOpen.style.top = currentY + 'px';
    window.data.mapOpen.style.left = currentX + 'px';
    window.data.noticeForm.querySelector('#address').value = 'x: ' + currentX + ', y: ' + (currentY + ADDRESS_PIN_HEIGTH);
  }

  function onMouseDown(evt) {
    evt.preventDefault();
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('moveEvt', onMouseMove);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function openElements() {
    window.backend.load(createMapElements, window.showStatus);
    window.data.mapOpen.addEventListener('mousedown', onMouseDown);
    window.data.mapOpen.removeEventListener('mouseup', openElements);
  }

  window.data.mapOpen.addEventListener('mouseup', openElements);

  window.data.mapOpen.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.data.enterKeycode) {
      openElements();
    }
  });
})();

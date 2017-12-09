'use strict';

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
})();
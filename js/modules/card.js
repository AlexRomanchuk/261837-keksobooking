'use strict';
(function () {
  var nextElement = document.querySelector('.map__filters-container');

  function getHomeType(homeVal) {
    switch (homeVal) {
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      default:
        return 'Дом';
    }
  }

  // Функция удаления всех элементов
  function removeChildren(elem) {
    while (elem.lastChild) {
      elem.removeChild(elem.lastChild);
    }
  }

  // Функция предварительного удаления элементов списка ul, взятых из шаблона и вставка элементов из массива
  function getListFeatures(newElement, arrayFeatures, nameSelector) {
    var deletedElement = newElement.querySelector(nameSelector);
    removeChildren(deletedElement);
    for (var i = 0; i < arrayFeatures.length; i++) {
      var newListElement = document.createElement('li');
      newListElement.className = 'feature feature--' + arrayFeatures[i];
      newElement.querySelector(nameSelector).appendChild(newListElement);
    }
  }

  function getElementP(elem, contents) {
    var paragraphs = elem.getElementsByTagName('p');
    for (var i = 1; i < paragraphs.length; i++) {
      paragraphs[i].textContent = contents[i];
    }
  }

  window.card = {
    createNotice: function (offerData, pin) {
      var contentItems = ['Координаты: ' + offerData.offer.address, offerData.offer.price + ' \u20bd/ночь',
        offerData.offer.rooms + ' комнат для ' + offerData.offer.guests + ' гостей',
        'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout,
        offerData.offer.description];
      var newNotice = window.data.template.cloneNode(true);
      newNotice.querySelector('small').textContent = contentItems[0];
      newNotice.querySelector('.popup__avatar').src = offerData.author.avatar;
      newNotice.querySelector('h3').textContent = offerData.offer.title;
      newNotice.querySelector('h4').textContent = getHomeType(offerData.offer.type);
      getElementP(newNotice, contentItems);
      getListFeatures(newNotice, offerData.offer.features, 'ul.popup__features');
      var buttonPopup = newNotice.querySelector('.popup__close');
      buttonPopup.addEventListener('click', function () {
        window.card.closePopup(pin);
      });
      buttonPopup.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.data.enterKeycode) {
          window.card.closePopup(pin);
        }
      });
      document.addEventListener('keydown', function onPopupEscPress(evt) {
        if (evt.keyCode === window.data.escKeycode) {
          window.card.closePopup(pin);
          document.removeEventListener('keydown', onPopupEscPress);
        }
      });
      return newNotice;
    },

    closePopup: function (pin) {
      var article = window.data.map.querySelector('.map__card');
      if (article) {
        window.data.map.removeChild(article);
        pin.classList.remove('map__pin--active');
      }
    },

    showCard: function (pin, data) {
      if (pin) {
        window.card.closePopup(pin);
        var offer = data[pin.dataset.offerIndex];
        var newCard = window.card.createNotice(offer, pin);
        window.pin.activatePin(pin);
        window.data.map.insertBefore(newCard, nextElement);
      }
    }
  };
})();

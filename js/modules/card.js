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
    createNotice: function (offerData) {
      var contentItems = ['Координаты: ' + offerData.offer.address, offerData.offer.price + ' \u20bd/ночь',
        offerData.offer.rooms + ' комнат для ' + offerData.offer.guests + ' гостей',
        'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout,
        offerData.offer.description];
      var newNotice = window.data.template.cloneNode(true);
      newNotice.querySelector('.popup__avatar').src = offerData.author.avatar;
      newNotice.querySelector('h3').textContent = offerData.offer.title;
      newNotice.querySelector('h4').textContent = getHomeType(offerData.offer.type);
      newNotice.querySelector('small').textContent = contentItems[0];
      getElementP(newNotice, contentItems);
      getListFeatures(newNotice, offerData.offer.features, 'ul.popup__features');
      newNotice.querySelector('.popup__close').addEventListener('click', function () {
        window.card.closePopup();
      });
      return newNotice;
    },

    closePopup: function () {
      var article = window.data.map.querySelector('.map__card');
      if (article !== null) {
        window.data.map.removeChild(article);
      }
    },

    showCard: function (pin, data, index) {
      window.card.closePopup();
      if (pin) {
        var offer = data[pin.dataset.offerIndex];
        var newCard = window.card.createNotice(offer);
        window.pin.activatePin(pin);
        window.data.map.insertBefore(newCard, nextElement);
      }
    }
  };
})();

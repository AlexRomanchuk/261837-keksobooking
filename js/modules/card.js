'use strict';

window.renderCard = function (data) {
  var arrayData = data;
  function getHomeType(homeVal) {
    var str = '';
    switch (homeVal) {
      case 'flat':
        str = 'Квартира';
        break;
      case 'bungalo':
        str = 'Бунгало';
        break;
      default:
        str = 'Дом';
        break;
    }
    return str;
  }
  // Функция удаления всех элементов
  function removeChildren(elem) {
    while (elem.lastChild) {
      elem.removeChild(elem.lastChild);
    }
  }

  // Функция предварительного удаления элементов списка ul, взятых из шаблона и вставка элементов из массива
  function getListFeatures(newElement, arrayFeatures, nameSelector) {
    var deleteElem = newElement.querySelector(nameSelector);
    removeChildren(deleteElem);
    for (var i = 0; i < arrayFeatures.length; i++) {
      var newListElem = document.createElement('li');
      newListElem.className = 'feature feature--' + arrayFeatures[i];
      newElement.querySelector(nameSelector).appendChild(newListElem);
    }
  }

  function getElementP(elem, innHTML) {
    var paragraphs = elem.getElementsByTagName('p');
    for (var i = 1; i < paragraphs.length; i++) {
      paragraphs[i].textContent = innHTML[i];
    }
  }
  function createNotice(arr) {
    var innHTMLArr = ['Координаты: ' + arr.offer.address, arr.offer.price + ' \u20bd/ночь',
      arr.offer.rooms + ' комнат для ' + arr.offer.guests + ' гостей',
      'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout,
      arr.offer.description];
    var newNotice = window.data.template.cloneNode(true);
    newNotice.querySelector('.popup__avatar').src = arr.author.avatar;
    newNotice.querySelector('h3').textContent = arr.offer.title;
    newNotice.querySelector('h4').textContent = getHomeType(arr.offer.type);
    newNotice.querySelector('small').textContent = innHTMLArr[0];
    getElementP(newNotice, innHTMLArr);
    getListFeatures(newNotice, arr.offer.features, 'ul.popup__features');
    newNotice.classList.add('hidden');
    return newNotice;
  }

  function renderElement(arrayName, creatingFunctionName, mapList, nextElement) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayName.length; i++) {
      fragment.appendChild(creatingFunctionName(arrayName[i], i));
      mapList.insertBefore(fragment, nextElement);
    }
  }

  function renderNotice(arrayName, creatingFunction) {
    var mapList = window.data.map;
    var nextElement = document.querySelector('.map__filters-container');
    renderElement(arrayName, creatingFunction, mapList, nextElement);
  }

  renderNotice(arrayData, createNotice);
};

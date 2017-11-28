'use strict';

// Контстанты: массивы данных о недвижимости
var imgNumbers = ['01', '02', '03', '04', '05', '06', '07', '08'];
var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var allFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPE_HOME = ['flat', 'bungalo', 'house'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];

var housesMap = document.querySelector('.map__pins');
// Шаблон
var noticeTemplate = document.querySelector('template').content.querySelector('article.map__card');

// Функция случайного порядка в массиве
function compareRandom() {
  var randSort = Math.random() - 0.5;
  return randSort;
}

imgNumbers.sort(compareRandom);
titles.sort(compareRandom);
allFeatures.sort(compareRandom);

// Функция показа элементов
function showBlock(nameSelector) {
  housesMap = document.querySelector(nameSelector);
  housesMap.classList.remove('map--faded');
}

function getRandom(num1, num2, fixNum) {
  return (Math.floor(Math.random() * (num2 - num1 + 1)) + num1).toFixed(fixNum);
}
// Функция выбора случайного элемента массива
function getRandData(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFeatures(arrayFeatures) {
  var m = getRandom(0, arrayFeatures.length, 0);
  var newArr = [];
  for (var i = 0; i < m; i++) {
    newArr.push(arrayFeatures[i]);
  }
  return newArr;
}

function getCoordX() {
  var x = getRandom(300, 900, 0);
  return x;
}

function getCoordY() {
  var y = getRandom(100, 500, 0);
  return y;
}

var houses = function (n) {
  var arr = [];
  for (var i = 0; i < n; i++) {
    arr.push(
        {
          author: {
            avatar: 'img/avatars/user' + imgNumbers[i] + '.png'
          },
          // Адреса изображений не должны повторяться.
          // Массив значений предварительно перемешан в случайном порядке, а затем функция их берет по порядку.

          location: {
            x: +getCoordX(),
            y: +getCoordY()
          },

          offer: {
            title: titles[i], // Значения не должны повторяться.
            address: getCoordX() + ', ' + getCoordY(),
            price: getRandom(1000, 1000000, 0), // число, случайная цена от 1000 до 1 000 000
            type: getRandData(TYPE_HOME), // строка с одним из трех фиксированных значений: flat, house или bungalo
            rooms: getRandom(1, 5, 0), // число, случайное количество комнат от 1 до 5
            guests: getRandom(1, 15, 0), // число, случайное количество гостей, которое можно разместить
            checkin: getRandData(CHECKIN), // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00,
            checkout: getRandData(CHECKOUT), // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00
            features: getFeatures(allFeatures),
            description: '',
            photos: []
          }
        });
  }
  return arr;
};

var house = houses(8);

showBlock('.map');

function createMapPin(arr) {
  var newMapPin = document.createElement('button');
  newMapPin.className = 'map__pin';
  newMapPin.style = 'left: ' + (arr.location.x + 20) + 'px; top: ' + (arr.location.y + 44) + 'px';
  newMapPin.innerHTML = '<img src="' + arr.author.avatar + '" width="40" height="40" draggable="false">';
  return newMapPin;
}

function renderMapPins(arrayName, functionName) {
  var mapList = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayName.length; i++) {
    fragment.appendChild(functionName(arrayName[i]));
  }
  mapList.appendChild(fragment);
}

renderMapPins(house, createMapPin);

// Функция вывода строки типа жилья в зависимости от типа, указанного в массиве.
function homeType(homeVal) {
  var str = '';
  if (homeVal === 'flat') {
    str = 'Квартира';
  } else if (homeVal === 'bungalo') {
    str = 'Бунгало';
  } else {
    str = 'Дом';
  }
  return str;
}

// фуекция удаления всех элементов
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
  var paragraphs = elem.querySelectorAll('p');
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].innerHTML = innHTML[i];
  }
}

function createNotice(arr) {
  var newNotice = noticeTemplate.cloneNode(true);
  newNotice.querySelector('.popup__avatar').src = arr.author.avatar;
  newNotice.querySelector('h3').innerHTML = arr.offer.title;
  newNotice.querySelector('h4').innerHTML = homeType(arr.offer.type);
  var innHTMLArr = ['Координаты: ' + arr.offer.address,
    '<strong>' + arr.offer.price + ' &#x20bd;</strong>/ночь',
    arr.offer.rooms + ' комнат для ' + arr.offer.guests + ' гостей',
    'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout,
    arr.offer.description];
  getElementP(newNotice, innHTMLArr);
  getListFeatures(newNotice, arr.offer.features, 'ul.popup__features');
  return newNotice;
}

function renderNotice(arrayName, functionName) {
  var mapList = document.querySelector('.map');
  var nextElement = document.querySelector('.map__filters-container');
  var fragment = document.createDocumentFragment();
  fragment.appendChild(functionName(arrayName[0]));
  mapList.insertBefore(fragment, nextElement);
}

renderNotice(house, createNotice);

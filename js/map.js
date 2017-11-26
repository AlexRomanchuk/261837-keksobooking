'use strict';

// Контстанты: массивы данных о недвижимости
var IMG_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPE_HOUSE = ['flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];

var housesWindow = document.querySelector('.map');

/* var similarTemplate = document.querySelector('template article.map__card').content.querySelector(housesWindow);
 */
// Функция показа элементов
function showBlock(nameSelector) {
  housesWindow = document.querySelector(nameSelector);
  housesWindow.classList.remove('.map--faded');
}

function getRandom(num1, num2, fixNum) {
  return (Math.floor(Math.random() * (num2 - num1 + 1)) + num1).toFixed(fixNum);
}

// Функция выбора случайного элемента массива
function getRandData(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFeatures(FEATURES) {
  var m = getRandom(1, FEATURES.length, 0);
  var features = [];
  for (var i = 0; i < m; i++)
    features.push(getRandData(FEATURES));
    return features;
}

var houses = function (n) {
  var arr = [];
  for (var i = 0; i < n; i++) {
    arr.push ({
	  'author': {
	    'noRepeat': true,
      'avatar': 'img/avatars/user{{' + getRandData(IMG_NUMBERS) + '}}.png' // Адреса изображений не повторяются
      },

    'location': {
      'x': getRandom(300, 900, 0),
      'y': getRandom(100, 500, 0)
	    },

    'offer': {
	    'noRepeat': true,
      'title': getRandData(TITLES), // Значения не должны повторяться.
      'address': '{{location.x}}, {{location.y}}',
      'price': getRandom(1000, 1000000, 0), //число, случайная цена от 1000 до 1 000 000
      'type': getRandData(TYPE_HOUSE), // строка с одним из трех фиксированных значений: flat, house или bungalo
      'rooms': getRandom(1, 5, 0), //число, случайное количество комнат от 1 до 5
      'guests': (Math.random()).toFixed(0), //число, случайное количество гостей, которое можно разместить
      'checkin': getRandData(CHECKIN), //строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00,
      'checkout': getRandData(CHECKOUT), //строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00
      'features': getFeatures(FEATURES),
      'description': '',
      'photos': []
      }
    });
  }
  return arr;
};

var house = houses(8);

showBlock('.map');



/* // Функция создания элемента для вывода на страницу
function createElement(arrayName) {
  var newElement = similarTemplate.cloneNode(true);
  newElement.querySelector('.setup-similar-label').textContent = arrayName.offer.title;
  newElement.querySelector('.wizard-coat').style.fill = arrayName.coatColor;
  newElement.querySelector('.wizard-eyes').style.fill = arrayName.eyesColor;
  return newElement;
}

// Функция отрисовки элемента
function renderElements(arrayName, functionName) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayName.length; i++) {
    fragment.appendChild(functionName(arrayName[i]));
  }
  similarListElement.appendChild(fragment);
}

renderWizardsElements(houses(8), createElement); */
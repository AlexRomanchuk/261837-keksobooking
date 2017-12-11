'use strict';
window.data = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var TYPE_HOME = ['flat', 'bungalo', 'house'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];

  var HOUSES_MAP = document.querySelector('.map__pins');
  var NOTICE_FORM = document.querySelector('.notice__form');
  var MAP = document.querySelector('.map');
  var NOTICE_TEMPLATE = document.querySelector('template').content.querySelector('article.map__card');

  var listTitles = shuffleArray(TITLES, TITLES.length);

  // Генерация случайного целого числа
  function getRandomNumber(num1, num2) {
    return (Math.floor(Math.random() * (num2 - num1 + 1)) + num1);
  }

  // Функция выбора случайного элемента массива
  function getRandomElement(arr) {
    return arr[getRandomNumber(0, arr.length - 1)];
  }

  // Функция случайной сборки массива из элементов копии основного массива
  function shuffleArray(arr, n) {
    var collection = arr.slice(0);
    var newArr = [];
    for (var i = 0; i < n; i++) {
      var rand = getRandomNumber(0, collection.length - 1);
      var randomElement = collection[rand];
      newArr.push(randomElement);
      collection.splice(rand, 1);
    }
    return newArr;
  }

  function renderListHouses(n) {
    var arr = [];
    for (var i = 1; i <= n; i++) {
      var coordX = getRandomNumber(300, 900);
      var coordY = getRandomNumber(100, 500);
      arr.push(
          {
            author: {
              avatar: 'img/avatars/user0' + i + '.png'
            },

            location: {
              x: coordX,
              y: coordY
            },

            offer: {
              title: listTitles[i - 1], // Значения не должны повторяться.
              address: coordX + ', ' + coordY,
              price: getRandomNumber(1000, 1000000), // число, случайная цена от 1000 до 1 000 000
              type: getRandomElement(TYPE_HOME), // строка с одним из трех фиксированных значений: flat, house или bungalo
              rooms: getRandomNumber(1, 5), // число, случайное количество комнат от 1 до 5
              guests: getRandomNumber(1, 15), // число, случайное количество гостей, которое можно разместить
              checkin: getRandomElement(CHECKIN), // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00,
              checkout: getRandomElement(CHECKOUT), // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00
              features: shuffleArray(FEATURES, getRandomNumber(0, FEATURES.length)),
              description: '',
              photos: []
            }
          });
    }
    return arr;
  }

  return {
    escKeycode: ESC_KEYCODE,
    enterKeycode: ENTER_KEYCODE,
    titles: TITLES,
    features: FEATURES,
    typeHome: TYPE_HOME,
    checkin: CHECKIN,
    checkout: CHECKOUT,
    housesMap: HOUSES_MAP,
    mapOpen: HOUSES_MAP.querySelector('.map__pin--main'),
    noticeForm: NOTICE_FORM,
    fields: NOTICE_FORM.getElementsByTagName('fieldset'),
    map: MAP,
    template: NOTICE_TEMPLATE,
    listHouses: renderListHouses(8)
  };
})();

'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// Контстанты: массивы данных о недвижимости
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPE_HOME = ['flat', 'bungalo', 'house'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];

var housesMap = document.querySelector('.map__pins');
var mapOpen = housesMap.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var map = document.querySelector('.map');
var fields = noticeForm.getElementsByTagName('fieldset');

// "Закрытие" или "открытие" полей добавлением свойства "disabled" (закрыто) или "" (открыто)
function toggleFields(disabledProperty) {
  for (var i = 0; i < fields.length; i++) {
    fields[i].disabled = disabledProperty;
  }
}

toggleFields('disabled');

// Шаблон
var noticeTemplate = document.querySelector('template').content.querySelector('article.map__card');

function openElements() {
  showBlock('.map');
  noticeForm.classList.remove('notice__form--disabled');
  toggleFields('');
  renderMapPins(listHouses, createMapPin);
  renderNotice(listHouses, createNotice);
  mapOpen.disabled = 'disabled';

  // Предыдущая карточка. Значение равно -1, если не существует (была закрыта ранее или не открывалась)
  var previousCard = -1;

  var cards = map.querySelectorAll('.map__card');
  var buttonsPopup = housesMap.querySelectorAll('.map__pin:nth-child(n+3)');

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

  for (var i = 0; i < listHouses.length; i++) {
    (function (j) {
      var buttonClosePopup = cards[j].querySelector('.popup__close');

      buttonsPopup[j].addEventListener('click', function () {
        openPopup(j);
      });

      buttonsPopup[j].addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          openPopup(j);
        }
      });

      buttonClosePopup.addEventListener('click', function () {
        closePopup(j);
      });

      buttonClosePopup.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          closePopup(j);
        }
      });

      function onPopupEscPress(evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          closePopup(j);
        }
      }

      document.addEventListener('keydown', onPopupEscPress);
    })(i);
  }
}

// Форма

var inputTitle = noticeForm.querySelector('#title');
var inputAddress = noticeForm.querySelector('#address');
var inputPrice = noticeForm.querySelector('#price');
var inputType = noticeForm.querySelector('#type');
var inputTimein = noticeForm.querySelector('#timein');
var inputTimeout = noticeForm.querySelector('#timeout');
var inputRooms = noticeForm.querySelector('#room_number');
var inputCapacity = noticeForm.querySelector('#capacity');
var submitButton = noticeForm.querySelector('.form__submit');

function markInvalidField(input) {
  input.style = 'background: #ffb8c2';
}

(function () {
  submitButton.addEventListener('click', function () {

    markInvalidField(inputTitle);
    markInvalidField(inputAddress);
    markInvalidField(inputPrice);

    if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity('Заголовок должен содержать минимум 30 символов.');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок не должен превышать 100-ти символов.');
    } else if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Заголовок должен быть указан.');
    } else {
      inputTitle.setCustomValidity('');
      inputTitle.style = '';
    }

    if (inputAddress.validity.valueMissing) {
      inputAddress.setCustomValidity('Адрес должен быть указан.');
    } else {
      inputAddress.setCustomValidity('');
      inputAddress.style = '';
    }

    if (inputPrice.validity.valueMissing) {
      inputPrice.setCustomValidity('Цена должна быть указана.');
    } else if (inputPrice.validity.rangeUnderflow) {
      inputPrice.setCustomValidity('Цена слишком мала. Необходимо указать минимум ' + inputPrice.min + ' руб.');
    } else if (inputPrice.validity.rangeOverflow) {
      inputPrice.setCustomValidity('Цена слишком велика. Нужно указать не более ' + inputPrice.max + ' руб.');
    } else {
      inputPrice.setCustomValidity('');
      inputPrice.style = '';
    }
  });
})();

function createArrayValues(list) {
  var arr = [];
  for (var i = 0; i < list.length; i++) {
    arr.push(list[i].value);
  }
  return arr;
}

function sinchronizeFields(inputIn, inputOut, arrayValuesIn, arrayValuesOut, callback) {
  inputIn.addEventListener('input', function () {
    var currentValue = inputIn.value;
    var i = arrayValuesIn.indexOf(currentValue);
    var valueOut = arrayValuesOut[i];
    callback(valueOut, inputOut);
  });
}

var timeinList = createArrayValues(inputTimein.querySelectorAll('option'));
var timeoutList = createArrayValues(inputTimeout.querySelectorAll('option'));

sinchronizeFields(inputTimein, inputTimeout, timeinList, timeoutList, function (valueOut, inputOut) {
  inputOut.value = valueOut;
  inputOut.addEventListener('input', function () {
    inputTimein.value = inputOut.value;
  });
});

var typeList = createArrayValues(inputType.querySelectorAll('option'));
var minList = [1000, 0, 5000, 10000];

sinchronizeFields(inputType, inputPrice, typeList, minList, function (valueOut, inputOut) {
  inputOut.min = valueOut;
});

var roomsList = createArrayValues(inputRooms.querySelectorAll('option'));
var capacityList = createArrayValues(inputCapacity.querySelectorAll('option'));

sinchronizeFields(inputRooms, inputCapacity, roomsList, capacityList, function (valueOut, inputOut) {
  var listOfGuests = inputCapacity.querySelectorAll('option');
  inputOut.value = inputRooms.value;
  for (var i = 0; i < listOfGuests.length; i++) {
    listOfGuests[i].classList.add('hidden');
  }
  var currentIndex = capacityList.indexOf(inputOut.value);
  var lastIndex = capacityList.indexOf('0');
  if (inputRooms.value !== '100') {
    for (var j = (lastIndex - 1); j >= currentIndex; j--) {
      listOfGuests[j].classList.remove('hidden');
    }
  } else {
    inputOut.value = '0';
  }
});

mapOpen.addEventListener('mouseup', function () {
  openElements();
});

mapOpen.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openElements();
  }
});

// Функция показа элементов
function showBlock(nameSelector) {
  housesMap = document.querySelector(nameSelector);
  housesMap.classList.remove('map--faded');
}

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

// Элементы не должны повторяться в окне объявления.
var listTitles = shuffleArray(TITLES, TITLES.length);

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

var listHouses = renderListHouses(8);

function createMapPin(arr) {
  var newMapPin = document.createElement('button');
  newMapPin.className = 'map__pin';
  newMapPin.style.left = (arr.location.x + 20) + 'px';
  newMapPin.style.top = (arr.location.y + 44) + 'px';
  var newAvatar = document.createElement('img');
  newAvatar.width = 40;
  newAvatar.heigth = 40;
  newAvatar.src = arr.author.avatar;
  newAvatar.draggable = false;
  newMapPin.appendChild(newAvatar);
  return newMapPin;
}

function renderMapPins(arrayAvatars, creatingFunctionName) {
  var mapList = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayAvatars.length; i++) {
    fragment.appendChild(creatingFunctionName(arrayAvatars[i], i));
  }
  mapList.appendChild(fragment);
}

// Функция вывода строки типа жилья в зависимости от типа, указанного в массиве
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
  var newNotice = noticeTemplate.cloneNode(true);
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

function renderNotice(arrayName, creatingFunctionName) {
  var mapList = document.querySelector('.map');
  var nextElement = document.querySelector('.map__filters-container');
  renderElement(arrayName, creatingFunctionName, mapList, nextElement);
}

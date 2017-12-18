'use strict';

window.filters = (function () {
  var MAXIMUM_PINS = 5;
  var copyOfData = [];
  var objectValues = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any'
  };
  var checkedFeatures = [];
  var filterForm = document.querySelector('.map__filters');
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelector('#housing-features');

  var functionsFilter = [
    // тип жилья
    function (arr) {
      if (objectValues['housing-type'] !== 'any') {
        arr = arr.filter(function (array) {
          return array.offer.type === objectValues['housing-type'];
        });
      }
      return arr;
    },
    // цена
    function (arr) {
      switch (objectValues['housing-price']) {
        case 'low':
          arr = arr.filter(function (array) {
            return array.offer.price <= 10000;
          });
          break;
        case 'middle':
          arr = arr.filter(function (array) {
            return (array.offer.price > 10000) && (array.offer.price < 50000);
          });
          break;
        case 'high':
          arr = arr.filter(function (array) {
            return array.offer.price >= 50000;
          });
          break;
        default:
          break;
      }
      return arr;
    },
    // количество комнат
    function (arr) {
      if (objectValues['housing-rooms'] !== 'any') {
        arr = arr.filter(function (array) {
          return array.offer.rooms === +objectValues['housing-rooms'];
        });
      }
      return arr;
    },
    // количество гостей
    function (arr) {
      if (objectValues['housing-guests'] !== 'any') {
        arr = arr.filter(function (array) {
          return array.offer.guests === +objectValues['housing-guests'];
        });
      }
      return arr;
    },
    // удобства
    function (arr) {
      return arr.filter(function (array) {
        return checkedFeatures.every(function (currentFeature) {
          return array.offer.features.includes(currentFeature);
        });
      });
    }
  ];

  // обработка событий изменения фильтров
  function filterChangeHandler(evt) {
    objectValues[evt.target.name] = evt.target.value;
    window.filters.filtered = copyOfData.slice();
    var checkedElements = filterFeatures.querySelectorAll('input[type="checkbox"]:checked');
    checkedFeatures = [].map.call(checkedElements, function (array) {
      return array.value;
    });
    functionsFilter.forEach(function (array) {
      window.filters.filtered = array(window.filters.filtered);
    });
    // обрезка полученного массива до необходимой длины
    if (window.filters.filtered.length > MAXIMUM_PINS) {
      window.filters.filtered = window.filters.filtered.slice(0, MAXIMUM_PINS);
    }
    console.log(window.filters.filtered);
    window.updatePins(copyOfData, window.filters.filtered, window.buttonsPopup);
  }

  filterType.addEventListener('change', filterChangeHandler);
  filterPrice.addEventListener('change', filterChangeHandler);
  filterRooms.addEventListener('change', filterChangeHandler);
  filterGuests.addEventListener('change', filterChangeHandler);
  filterFeatures.addEventListener('change', filterChangeHandler);

  return {
    filtered: [],
    getArrayData: function (arr) {
      copyOfData = arr.slice();
      this.filtered = arr.slice(0, MAXIMUM_PINS);
    }
  };
})();

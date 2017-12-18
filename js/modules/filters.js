'use strict';

window.filters = (function () {
  var MAX_PINS = 5;
  var arrTempData = [];
  var objectValues = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any'
  }
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
        arr = array.filter(function(array) {
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
        arr = array.filter(function(array) {
          return array.offer.rooms === objectValues['housing-rooms'];
        });
      }
      return arr;
    },
    // количество гостей
    function (arr) {
      if (objectValues['housing-guests'] !== 'any') {
        arr = array.filter(function(array) {
          return array.offer.guests === objectValues['housing-guests'];
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
    objectValues[evt.target.nae] = evt.target.value;
    window.filters.filtered = arrTempData.slice();
    var checkedElements = filterFeatures.querySelectorAll('input[type="checkbox"]:checked');
    checkedFeatures = [].map.call(checkedElements, function (array) {
      return array.value;
    });
    rrFunctionFilters.forEach(function (array) {
      window.mapFilters.filtered = array(window.mapFilters.filtered);
    });
    // обрезка полученного массива до необходимой длинны
    if (window.mapFilters.filtered.length > MAX_PINS) {
      window.mapFilters.filtered = window.mapFilters.filtered.slice(0, MAX_PINS);
    }
  }

  filterType.addEventListener('change', filterChangeHandler);
  filterPrice.addEventListener('change', filterChangeHandler);
  filterRooms.addEventListener('change', filterChangeHandler);
  filterGuests.addEventListener('change', filterChangeHandler);
  filterFeatures.addEventListener('change', filterChangeHandler);

  return {
    filtered: [],
    summary: function (arr) {
      arrTempData = arr.slice();
      this.filtered = arr.slice();
      return arrTempData.slice(0, MAX_PINS);
    }
  };
})();
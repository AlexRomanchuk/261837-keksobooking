'use strict';
(function () {
  var TIMER = 500;
  var LOW_PRICE_LIMIT = 10000;
  var UPPER_PRICE_LIMIT = 50000;
  var VALUE_ANY = 'any';
  var TYPES = ['housing-type', 'housing-price', 'housing-rooms', 'housing-guests'];
  var FEATURES = ['filter-wifi', 'filter-dishwasher', 'filter-parking', 'filter-washer', 'filter-elevator', 'filter-conditioner'];
  var filterForm = document.querySelector('.map__filters');
  var housingValues = [];
  var featuresValues = [];

  var externalCallback = 0;
  var doWithDebounce = window.debounce(function () {
    if (externalCallback) {
      externalCallback();
    }
  }, TIMER);

  function getSelectedValues() {
    TYPES.forEach(function (item) {
      var selectNode = filterForm.querySelector('#' + item);
      if (selectNode) {
        housingValues.push(selectNode.value);
      }
    });
    FEATURES.forEach(function (item) {
      var featureCheckbox = filterForm.querySelector('#' + item);
      if (featureCheckbox && featureCheckbox.checked) {
        featuresValues.push(featureCheckbox.value);
      }
    });
  }

  function isCorrectPrice(filterPrice) {
    switch (housingValues[1]) {
      case 'low':
        return filterPrice < LOW_PRICE_LIMIT;
      case 'middle':
        return filterPrice >= LOW_PRICE_LIMIT && filterPrice <= UPPER_PRICE_LIMIT;
      case 'high':
        return filterPrice > UPPER_PRICE_LIMIT;
      default:
        return true;
    }
  }

  function isCorrectField(filterField, selectIdIndex) {
    return housingValues[selectIdIndex] === VALUE_ANY || housingValues[selectIdIndex] === filterField;
  }

  function isCorrectFeature(filterFeatures) {
    function isFeatureInHouse(feature) {
      return filterFeatures.indexOf(feature) !== -1;
    }
    return featuresValues.every(isFeatureInHouse);
  }

  function isCorrect(housingData) {
    return isCorrectPrice(housingData.offer.price) &&
      isCorrectField(housingData.offer.type, 0) &&
      isCorrectField(housingData.offer.rooms.toString(), 2) &&
      isCorrectField(housingData.offer.guests.toString(), 3) &&
      isCorrectFeature(housingData.offer.features);
  }

  window.filters = {
    applyFilters: function (data) {
      housingValues = [];
      featuresValues = [];
      getSelectedValues();
      return data.filter(isCorrect);
    },
    onFilterChange: function (callback) {
      externalCallback = callback;
      filterForm.addEventListener('change', doWithDebounce);
    }
  };
})();

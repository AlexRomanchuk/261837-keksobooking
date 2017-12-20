'use strict';
window.filters = (function () {
  var TIMER = 500;
  var LOW_PRICE_LIMIT = 10000;
  var UPPER_PRICE_LIMIT = 50000;
  var VALUE_ANY = 'any';
  var FILTER_SELECT_ID = ['housing-type', 'housing-price', 'housing-rooms', 'housing-guests'];
  var FILTER_FEATURES_ID = ['filter-wifi', 'filter-dishwasher', 'filter-parking', 'filter-washer', 'filter-elevator', 'filter-conditioner'];
  var filterForm = document.querySelector('.map__filters');
  var housingValues = [];
  var featuresValues = [];

  function getSelectedValues() {
    FILTER_SELECT_ID.forEach(function (item) {
      var selectNode = filterForm.querySelector('#' + item);
      if (selectNode) {
        housingValues.push(selectNode.value);
      }
    });
    FILTER_FEATURES_ID.forEach(function (item) {
      var featureCheckbox = filterForm.querySelector('#' + item);
      if (featureCheckbox && featureCheckbox.checked) {
        featuresValues.push(featureCheckbox.value);
      }
    });
  }

  function isCorrectPrice(filterPrice) {
    var priceCheck = false;
    switch (housingValues[1]) {
      case 'low':
        priceCheck = filterPrice < LOW_PRICE_LIMIT;
        break;
      case 'middle':
        priceCheck = filterPrice >= LOW_PRICE_LIMIT && filterPrice <= UPPER_PRICE_LIMIT;
        break;
      case 'high':
        priceCheck = filterPrice > UPPER_PRICE_LIMIT;
        break;
      default:
        priceCheck = true;
    }
    return priceCheck;
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

  return {
    applyFilters: function (data) {
      housingValues = [];
      featuresValues = [];
      getSelectedValues();
      return data.filter(isCorrect);
    },
    onFilterChange: function (callback) {
      var doWithDebounce = window.debounce(callback, TIMER);
      filterForm.addEventListener('change', doWithDebounce);
    }
  };
})();

'use strict';

window.filters = (function () {
  var TIMER = 500;
  var LOW_PRICE_LIMIT = 10000;
  var UPPER_PRICE_LIMIT = 50000;
  var VALUE_ANY = 'any';
  var filterForm = document.querySelector('.map__filters');
  var filtersSelectId = ['housing-type', 'housing-price', 'housing-rooms', 'housing-guests'];
  var filtersFeatureId = ['filter-wifi', 'filter-dishwasher', 'filter-parking', 'filter-washer', 'filter-elevator', 'filter-conditioner'];
  var housingValues = [];
  var featuresValues = [];

  function getSelectedValues() {
    filtersSelectId.forEach(function (item) {
      var selectNode = filterForm.querySelector('#' + item);
      if (selectNode) {
        housingValues.push(selectNode.value);
      }
    });
    filtersFeatureId.forEach(function (item) {
      var featureCheckbox = filterForm.querySelector('#' + item);
      if (featureCheckbox && featureCheckbox.checked) {
        featuresValues.push(featureCheckbox.value);
      }
    });
  }

  function isCorrectPrice(itemPrice) {
    var priceCheck = false;
    switch (housingValues[1]) {
      case 'low':
        priceCheck = itemPrice < LOW_PRICE_LIMIT;
        break;
      case 'middle':
        priceCheck = itemPrice >= LOW_PRICE_LIMIT && itemPrice <= UPPER_PRICE_LIMIT;
        break;
      case 'high':
        priceCheck = itemPrice > UPPER_PRICE_LIMIT;
        break;
      default:
        priceCheck = true;
    }
    return priceCheck;
  }

  function isCorrectField(itemField, selectIdIndex) {
    return housingValues[selectIdIndex] === VALUE_ANY || housingValues[selectIdIndex] === itemField;
  }

  function isCorrectFeature(itemFeatures) {
    function isFeatureInApartment(feature) {
      return itemFeatures.indexOf(feature) !== -1;
    }
    return featuresValues.every(isFeatureInApartment);
  }

  function isCorrect(apartmentData) {
    return isCorrectPrice(apartmentData.offer.price) &&
      isCorrectField(apartmentData.offer.type, 0) &&
      isCorrectField(apartmentData.offer.rooms.toString(), 2) &&
      isCorrectField(apartmentData.offer.guests.toString(), 3) &&
      isCorrectFeature(apartmentData.offer.features);
  }

  return {
    applyFilters: function (data) {
      housingValues = [];
      featuresValues = [];
      getSelectedValues();
      this.newHouses = data.filter(isCorrect);
      return this.newHouses;
    },
    onFilterChange: function (data) {
      filterForm.addEventListener('change', function () {
        var filteredApartments = window.filters.applyFilters(data);
        var doWithDebounce = window.debounce(data, filteredApartments, window.buttonsPopup, window.updatePins, TIMER);
        doWithDebounce();
      });
    }
  };
})();

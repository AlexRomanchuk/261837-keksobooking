'use strict';

(function () {
  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;
  var MIN_GUESTS_VALUE = '0';
  var MAX_ROOMS_VALUE = '100';
  var MIN_SIMBOLS = 30;
  var noticeForm = window.data.noticeForm;
  var successStyle = 'background: #bcf5bc; border: 1px dashed white; text-align: center; font-size: 20px; width: 100%;';

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

  function onFormSubmit() {
    markInvalidField(inputTitle);
    markInvalidField(inputAddress);
    markInvalidField(inputPrice);

    if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity('Заголовок должен содержать минимум ' + inputTitle.minLength + ' символов.');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок не должен превышать ' + inputTitle.maxLength + ' символов.');
    } else if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Заголовок должен быть указан.');
    } else {
      inputTitle.setCustomValidity('');
      inputTitle.style = '';
    }

    inputTitle.addEventListener('input', function (evt) {
      var target = evt.target;
      var minSimbols = target.value.length;
      var errMessage = '';
      errMessage = minSimbols < MIN_SIMBOLS ? 'Заголовок должен содержать минимум ' + MIN_SIMBOLS + ' символов.' : '';
      target.setCustomValidity(errMessage);
    });

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
  }

  submitButton.addEventListener('click', onFormSubmit);

  noticeForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(noticeForm), function () {
      window.showStatus('Объявление отправлено успешно! Вы можете написать следующее.', successStyle, '.notice__form', '.notice__header');
      noticeForm.reset();
    });
    evt.preventDefault();
  }, window.showStatus);

  function createArrayValues(selectItems) {
    var values = [];
    selectItems.forEach(function (selectOption) {
      values.push(selectOption.value);
    });
    return values;
  }

  function syncValues(value, selectField) {
    selectField.value = value;
    selectField.addEventListener('change', function () {
      inputTimein.value = selectField.value;
    });
  }

  function syncValuesWithMin(minValue, fieldWithMin) {
    fieldWithMin.min = minValue;
  }

  function syncCapacity(value, selectField) {
    selectField.value = (inputRooms.value !== MAX_ROOMS_VALUE) ? inputRooms.value : MIN_GUESTS_VALUE;
  }

  var timeinValues = createArrayValues(inputTimein.querySelectorAll('option'));
  var timeoutValues = createArrayValues(inputTimeout.querySelectorAll('option'));

  inputTimein.addEventListener('change', function () {
    window.synchronizeFields(inputTimein, inputTimeout, timeinValues, timeoutValues, syncValues);
  });

  var typeValues = createArrayValues(inputType.querySelectorAll('option'));
  var minValues = [MIN_PRICE_FLAT, MIN_PRICE_BUNGALO, MIN_PRICE_HOUSE, MIN_PRICE_PALACE];

  inputType.addEventListener('change', function () {
    window.synchronizeFields(inputType, inputPrice, typeValues, minValues, syncValuesWithMin);
  });

  var roomsValues = createArrayValues(inputRooms.querySelectorAll('option'));
  var capacityValues = createArrayValues(inputCapacity.querySelectorAll('option'));

  inputRooms.addEventListener('change', function () {
    window.synchronizeFields(inputRooms, inputCapacity, roomsValues, capacityValues, syncCapacity);
  });
})();

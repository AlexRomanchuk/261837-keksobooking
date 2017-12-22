'use strict';

(function () {
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
      inputTitle.setCustomValidity('Заголовок должен содержать минимум 30 символов.');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок не должен превышать 100-ти символов.');
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
      errMessage = minSimbols < MIN_SIMBOLS ? 'Заголовок должен содержать минимум 30 символов.' : '';
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

  function createArrayValues(list) {
    var values = [];
    for (var i = 0; i < list.length; i++) {
      values.push(list[i].value);
    }
    return values;
  }

  function syncValues(value, elem) {
    elem.value = value;
    elem.addEventListener('change', function () {
      inputTimein.value = elem.value;
    });
  }

  function syncValuesWithMin(value, elem) {
    elem.min = value;
  }

  function syncCapacity(value, elem) {
    elem.value = (inputRooms.value !== '100') ? inputRooms.value : '0';
  }

  var timeinValues = createArrayValues(inputTimein.querySelectorAll('option'));
  var timeoutValues = createArrayValues(inputTimeout.querySelectorAll('option'));

  inputTimein.addEventListener('change', function () {
    window.synchronizeFields(inputTimein, inputTimeout, timeinValues, timeoutValues, syncValues);
  });

  var typeValues = createArrayValues(inputType.querySelectorAll('option'));
  var minValues = [1000, 0, 5000, 10000];

  inputType.addEventListener('change', function () {
    window.synchronizeFields(inputType, inputPrice, typeValues, minValues, syncValuesWithMin);
  });

  var roomsValues = createArrayValues(inputRooms.querySelectorAll('option'));
  var capacityValues = createArrayValues(inputCapacity.querySelectorAll('option'));

  inputRooms.addEventListener('change', function () {
    window.synchronizeFields(inputRooms, inputCapacity, roomsValues, capacityValues, syncCapacity);
  });
})();

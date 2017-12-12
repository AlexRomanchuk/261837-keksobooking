'use strict';

(function () {
  var noticeForm = window.data.noticeForm;

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

  function validityForm() {
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
  }

  submitButton.addEventListener('click', function () {
    validityForm();
  });

  function createArrayValues(list) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      arr.push(list[i].value);
    }
    return arr;
  }

  function syncValues(value, elem) {
    elem.value = value;
    elem.addEventListener('input', function () {
      inputTimein.value = elem.value;
    });
  }

  function syncValuesWithMin(value, elem) {
    elem.min = value;
  }

  function syncCapacity(value, elem) {
    elem.value = (inputRooms.value !== '100') ? inputRooms.value : '0';
  }

  var timeinList = createArrayValues(inputTimein.querySelectorAll('option'));
  var timeoutList = createArrayValues(inputTimeout.querySelectorAll('option'));

  window.synchronizeFields(inputTimein, inputTimeout, timeinList, timeoutList, syncValues);

  var typeList = createArrayValues(inputType.querySelectorAll('option'));
  var minList = [1000, 0, 5000, 10000];

  window.synchronizeFields(inputType, inputPrice, typeList, minList, syncValuesWithMin);

  var roomsList = createArrayValues(inputRooms.querySelectorAll('option'));
  var capacityList = createArrayValues(inputCapacity.querySelectorAll('option'));

  window.synchronizeFields(inputRooms, inputCapacity, roomsList, capacityList, syncCapacity);
})();

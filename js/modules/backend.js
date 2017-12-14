'use strict';

window.backend = (function () {
  var url = 'https://1510.dump.academy/keksobooking';
  var errorStyle = 'background: #ffb8c2; border: 1px dashed white; text-align: center; font-size: 25px;';
  var emergencyStyle = 'background: #e5be01; border: 1px dashed black; text-align: center; font-size: 25px;';

  window.messageError = function (message, alertStyle) {
    var nextElem = document.querySelector('h2');
    var errorField = document.querySelector('.map__pinsoverlay');
    var errorAlert = document.createElement('div');
    errorAlert.style = alertStyle;
    errorAlert.textContent = message;
    errorField.insertBefore(errorAlert, nextElem);
  };

  function actionXhr(onLoad, onError, method, link, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 404:
          onError('URL ' + url + ' не найден. Ошибка ' + xhr.status + ' ' + xhr.statusText, errorStyle);
          break;
        default:
          onError('Неизвестная ошибка: ' + xhr.status + ' ' + xhr.statusText, errorStyle);
          break;
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения', emergencyStyle);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс', emergencyStyle);
    });

    xhr.open(method, url + link);

    xhr.send(data);
  }

  return {
    load: function (onLoad, onError) {
      actionXhr(onLoad, onError, 'GET', '/data');
    },

    save: function (formdata, onLoad, onError) {
      actionXhr(onLoad, onError, 'POST', '', formdata);
    }
  };

})();

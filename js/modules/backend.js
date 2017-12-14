'use strict';

window.backend = (function () {
  var url = 'https://1510.dump.academy/keksobooking';
  var errorStyle = 'background: #ffb8c2; border: 2px dashed white; border-radius: 10px; text-align: center;';
  var emergencyStyle = 'background: #e5be01; border: 2px dashed black; border-radius: 10px; text-align: center;';

  window.messageError = function (message, alertStyle) {
    var errorField = window.data.map.querySelector('.map__filters-container');
    var errorAlert = document.createElement('div');
    errorAlert.style = alertStyle;
    errorAlert.textContent = message;
    errorField.appendChild(errorAlert);
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

'use strict';

window.backend = (function () {
  var url = 'https://1510.dump.academy/keksobooking';
  var errorStyle = 'background: #ffb8c2; border: 1px dashed white; text-align: center; font-size: 25px;';
  var emergencyStyle = 'background: #e5be01; border: 1px dashed black; text-align: center; font-size: 25px;';
  window.successStyle = 'background: #bcf5bc; border: 1px dashed white; text-align: center; font-size: 20px; width: 100%;';

  window.showStatus = function (message, alertStyle, selector, nextSelector) {
    var nextElem = document.querySelector(nextSelector);
    var statusField = document.querySelector(selector);
    var statusAlert = document.createElement('div');
    statusAlert.style = alertStyle;
    statusAlert.textContent = message;
    statusField.insertBefore(statusAlert, nextElem);
  };

  function createRequest(onLoad, onError, method, link, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 404:
          onError('URL ' + url + ' не найден. Ошибка ' + xhr.status + ' ' + xhr.statusText, errorStyle, '.map__pinsoverlay', 'h2');
          break;
        default:
          onError('Неизвестная ошибка: ' + xhr.status + ' ' + xhr.statusText, errorStyle, '.map__pinsoverlay', 'h2');
          break;
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения', emergencyStyle, '.map__pinsoverlay', 'h2');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс', emergencyStyle, '.map__pinsoverlay', 'h2');
    });

    xhr.open(method, url + link);

    xhr.send(data);
  }

  return {
    load: function (onLoad, onError) {
      createRequest(onLoad, onError, 'GET', '/data');
    },

    save: function (formdata, onLoad, onError) {
      createRequest(onLoad, onError, 'POST', '', formdata);
    }
  };

})();

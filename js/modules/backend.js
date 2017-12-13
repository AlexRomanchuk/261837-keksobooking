'use strict';

window.backend = (function () {
  var url = 'https://1510.dump.academy/keksobooking';
  var errorStyle = 'background: red; border: 5px dashed white';
  var emergencyStyle = 'color: black; background: "#e5be01"; border: 5px dashed black';
  return {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = 15000;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          case 404:
            onError('URL ' + url +  ' не найден. Ошибка ' + xhr.status + ' ' + xhr.statusText, errorStyle);
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

      xhr.open('GET', url + '/data');

      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
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
        onError('Не удалось отправить форму за ' + xhr.timeout + 'мс', emergencyStyle);
      });

      xhr.open('POST', url);
      xhr.send(data);
    }
  };
})();

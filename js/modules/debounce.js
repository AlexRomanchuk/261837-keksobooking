'use strict';
(function () {
  window.debounce = function (parameter1, parameter2, parameter3, callback, timer) {
    var timeout = 0;
    var i = 0;
    // создано замыкание
    return function () {
      i++; // счет вызовов увеличиваем на единицу
      // при первом вызове вызываем коллбэк сразу
      if (i === 1) {
        callback(parameter1, parameter2, parameter3);
      }
      // очищаем предыдущий таймаут
      window.clearTimeout(timeout);
      timeout = window.setTimeout(function () {
        i = 0;
        callback(parameter1, parameter2, parameter3);
      }, timer);
    };
  };
})();

'use strict';
(function () {
  window.debounce = function (callback, timer) {
    var timeout = 0;
    // создано замыкание
    return function () {
      // очищаем предыдущий таймаут
      window.clearTimeout(timeout);
      timeout = window.setTimeout(function () {
        callback();
      }, timer);
    };
  };
})();

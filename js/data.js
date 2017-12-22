'use strict';
window.data = (function () {
  var MAXIMIM_PINS = 5;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var housesMap = document.querySelector('.map__pins');
  var noticeForm = document.querySelector('.notice__form');
  var map = document.querySelector('.map');
  var noticeTemplate = document.querySelector('template').content.querySelector('article.map__card');

  return {
    maximumPins: MAXIMIM_PINS,
    escKeycode: ESC_KEYCODE,
    enterKeycode: ENTER_KEYCODE,
    housesMap: housesMap,
    mapOpen: housesMap.querySelector('.map__pin--main'),
    noticeForm: noticeForm,
    fields: noticeForm.getElementsByTagName('fieldset'),
    map: map,
    template: noticeTemplate,
  };
})();

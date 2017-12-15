'use strict';
window.data = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var HOUSES_MAP = document.querySelector('.map__pins');
  var NOTICE_FORM = document.querySelector('.notice__form');
  var MAP = document.querySelector('.map');
  var NOTICE_TEMPLATE = document.querySelector('template').content.querySelector('article.map__card');

  return {
    escKeycode: ESC_KEYCODE,
    enterKeycode: ENTER_KEYCODE,
    housesMap: HOUSES_MAP,
    mapOpen: HOUSES_MAP.querySelector('.map__pin--main'),
    noticeForm: NOTICE_FORM,
    fields: NOTICE_FORM.getElementsByTagName('fieldset'),
    map: MAP,
    template: NOTICE_TEMPLATE,
  };
})();

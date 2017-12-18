'use strict';

window.pin = (function () {
  var PIN_CENTER = 20; // середина кнопки .map__pin
  var PIN_HEIGTH = 44;
  var AVATAR_SIZE = 40; // ширина и высота аватарки равны
  var filters = window.data.map.querySelector('.map__filters');

  function render(arrayAvatars, creatingFunctionName) {
    var mapList = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayAvatars.length; i++) {
      fragment.appendChild(creatingFunctionName(arrayAvatars[i], i));
    }
    mapList.appendChild(fragment);
  }

  return {
    renderMapPins: function (array, selectValue) {
      function createElement(arrAvatars) {
        var newMapPin = document.createElement('button');
        newMapPin.className = 'map__pin';
        newMapPin.style.left = (arrAvatars.location.x + PIN_CENTER) + 'px';
        newMapPin.style.top = (arrAvatars.location.y + PIN_HEIGTH) + 'px';
        var newAvatar = document.createElement('img');
        newAvatar.width = AVATAR_SIZE;
        newAvatar.heigth = AVATAR_SIZE;
        newAvatar.src = arrAvatars.author.avatar;
        newAvatar.draggable = false;
        newMapPin.appendChild(newAvatar);
        newMapPin.classList.add('hidden');
        return newMapPin;
      }
      render(array, createElement);
    }
  };
})();

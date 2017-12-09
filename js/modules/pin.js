'use strict';

window.pin = (function () {
  return {
    renderMapPins: function (arr) {
      function createMapPin(arr) {
        var newMapPin = document.createElement('button');
        newMapPin.className = 'map__pin';
        newMapPin.style.left = (arr.location.x + 20) + 'px';
        newMapPin.style.top = (arr.location.y + 44) + 'px';
        var newAvatar = document.createElement('img');
        newAvatar.width = 40;
        newAvatar.heigth = 40;
        newAvatar.src = arr.author.avatar;
        newAvatar.draggable = false;
        newMapPin.appendChild(newAvatar);
        return newMapPin;
      }

      function renderMapPins(arrayAvatars, creatingFunctionName) {
        var mapList = document.querySelector('.map__pins');
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < arrayAvatars.length; i++) {
          fragment.appendChild(creatingFunctionName(arrayAvatars[i], i));
        }
        mapList.appendChild(fragment);
      }
      renderMapPins(arr, createMapPin)
    }
  };
})();
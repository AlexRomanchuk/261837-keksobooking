'use strict';

window.showCard = function (index, callback) {
  var currentCard = index;
  window.buttonsPopup[index].classList.add('map__pin--active');
  window.cards[index].classList.remove('hidden');
  if (window.previousCard !== -1 && window.previousCard !== currentCard) {
    callback(window.previousCard);
  }
  window.previousCard = currentCard;
};

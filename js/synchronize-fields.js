'use strict';

window.synchronizeFields = function (inputIn, inputOut, valuesIn, valuesOut, callback, evt) {
  var currentValue = inputIn.value;
  var i = valuesIn.indexOf(currentValue);
  var valueOut = valuesOut[i];
  callback(valueOut, inputOut);
};

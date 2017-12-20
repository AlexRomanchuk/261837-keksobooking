'use strict';

window.synchronizeFields = function (inputIn, inputOut, arrayValuesIn, arrayValuesOut, callback) {
  inputIn.addEventListener('input', function () {
    var currentValue = inputIn.value;
    var i = arrayValuesIn.indexOf(currentValue);
    var valueOut = arrayValuesOut[i];
    callback(valueOut, inputOut);
  });
};

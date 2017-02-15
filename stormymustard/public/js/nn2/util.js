var Util = {};

Util.randomInteger =  function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
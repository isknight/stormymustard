var Util = {};

Util.randomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

Util.randomWeight = function(max, min) {
    return (Math.random() * (max * 2 - min) + min) - max;
}

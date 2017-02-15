function Voice(id) {
    this.id = id;
    this._init();
};

Voice.prototype = (function () {
    return {
        _init: function () {

            this.nn = Network.createRandomBaseNetwork(1, 2);
            var k = Util.randomInteger(0, StormyMustardConfig.MAX_MUTATIONS);
            var m = new Mutator();
            while (k--) {
                m.mutateNetwork(this.nn);
            }

            this.duration = Util.randomInteger(StormyMustardConfig.MIN_VOICE_DURATION, StormyMustardConfig.MAX_VOICE_DURATION);

        },

        start: function () {
            this.osc = new Tone.Oscillator({
                "frequency" : 440,
                "volume" : -10
            }).toMaster();

            this.osc.start();
        },

        stop: function () {
            if(this.osc) {
                this.osc.stop();
                this.osc = null;
            }
        },

        run: function(k) {
            var i = k % this.duration;
            var input = [];
            input.push((2*(i / this.duration) - 1));
            var output = Network.fire(this.nn, input);
            var frequency = ((output[0] / 2 * StormyMustardConfig.MAX_FREQUENCY));
            var volume = ((output[1] / 2 * StormyMustardConfig.MAX_VOLUME));

            //TODO fix lazy NaN problem
            if(frequency && volume && !isNaN(frequency) && !isNaN(volume)) {
                this.osc.frequency.value = frequency;
                this.osc.volume.value = volume;
            }
        }

    }
})();
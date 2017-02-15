function StormyMustardEntity() {

    this.voices = [];
    this._init();


};


StormyMustardEntity.prototype = (function() {

    return {
        _init: function () {

            var voiceCount = Util.randomInteger(1, StormyMustardConfig.MAX_VOICES);

            while (voiceCount--) {
                var v = new Voice(voiceCount);
                this.voices.push(v);
            }

            //TODO setup voices

        },

        start: function() {
            var i = this.voices.length;
            while(i--) {
                var voice = this.voices[i];
                voice.start();
            };

        },

        stop: function() {
            //console.log('stop');
            var i = this.voices.length;
            while(i--) {
                var voice = this.voices[i];
                voice.stop();
            };
        },


        run: function (i) {
            var k = this.voices.length;
            while(k--) {
              var voice = this.voices[k];
                voice.run(i);
            };
        }
    };

})();
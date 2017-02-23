class StormyMustardEntity {

    constructor() {
        this.voices = [];
        let voiceCount = Util.randomInteger(1, StormyMustardConfig.MAX_VOICES);

        while (voiceCount--) {
            let v = Voice.build(voiceCount);
            this.voices.push(v);
        }
        //TODO setup voices
    }

    start() {
        let i = this.voices.length;
        while (i--) {
            let voice = this.voices[i];
            voice.start();
        }
    }

    stop() {
        let i = this.voices.length;
        while (i--) {
            let voice = this.voices[i];
            voice.stop();
        }
    }

    run(i) {
        let k = this.voices.length;
        while (k--) {
            let voice = this.voices[k];
            voice.run(i);
        }
    }
}

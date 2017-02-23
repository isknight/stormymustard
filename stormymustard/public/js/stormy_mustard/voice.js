
class Voice {

  constructor(id){
    this.id = id;
    //TODO: Migrate to a builder
    this.nn = Network.createRandomBaseNetwork(1, 2);
    var k = Util.randomInteger(0, StormyMustardConfig.MAX_MUTATIONS);
    var m = new Mutator();
    while (k--) {
        m.mutateNetwork(this.nn);
    }
    this.duration = Util.randomInteger(StormyMustardConfig.MIN_VOICE_DURATION, StormyMustardConfig.MAX_VOICE_DURATION);
  }

  start() {
      this.osc = new Tone.Oscillator({
          "frequency" : 440,
          "volume" : -10
      }).toMaster();
      this.osc.start();
  }

  stop() {
      if(this.osc) {
          this.osc.stop();
          this.osc = null;
      }
  }

  run(k) {
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

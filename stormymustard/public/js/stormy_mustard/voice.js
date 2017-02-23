
class Voice {

  constructor(id, nn, duration){
    this.id = id;
    this.nn = nn;
    this.duration = duration;
  }

  static build(id){
    let baseNetwork = Network.createRandomBaseNetwork(1, 2);
    let mutationCt = Util.randomInteger(0, StormyMustardConfig.MAX_MUTATIONS);
    while (mutationCt--) {
        mutateNetwork(baseNetwork);
    }
    let duration = Util.randomInteger(StormyMustardConfig.MIN_VOICE_DURATION, StormyMustardConfig.MAX_VOICE_DURATION);
    return new Voice(id, baseNetwork, duration);
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

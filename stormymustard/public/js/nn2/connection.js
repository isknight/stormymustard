class Connection {
    constructor(weight, neuron) {
        this.id = UUID.generate();
        this.weight = weight;
        this.neuronId = neuron.id;
    }
}

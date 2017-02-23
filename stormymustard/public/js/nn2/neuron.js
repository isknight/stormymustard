class Neuron {
    constructor(type, generation) {
        this.type = type;
        this.generation = generation || 0;
        this.auto = 0;
        this.connections = [];
        this.output = 0;
        this.visited = false;
    }

    connect(otherNeuron, weight) {
        let connection = new Connection(weight, otherNeuron);
        this.connections.push(connection);
    }
}

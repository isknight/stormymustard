function Neuron(type, generation) {


    if (!generation) {
        generation = 0;
    }

    this.generation = generation;

    this.type = type;
    this.auto = 0;
    this.connections = [];
    this.output = 0;
    this.visited = false;
}

Neuron.prototype = {

};

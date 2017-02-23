class Network {

    constructor(id) {
        this.id = id;
        this.inputNeurons = [];
        this.hiddenNeurons = [];
        this.outputNeurons = [];
        this.neurons = [];
        this.generation = 0;
        //TODO add bias neuron back in
    }

    addNeuron(neuron) {
        switch (neuron.type) {
            case 'i':
                this.inputNeurons.push(neuron);
                break;
            case 'h':
                this.hiddenNeurons.push(neuron);
                break;
            case 'o':
                this.outputNeurons.push(neuron);
                break;
        }
        this.neurons.push(neuron);
        neuron.id = this.neurons.length - 1;
    }

    fire(inputArray) {
        //set output for all input neurons all input neurons
        for (var i in this.inputNeurons) {
            var n = this.inputNeurons[i];
            //  console.log('input id=' + n.id);
            n.output = inputArray[i];
            n.visited = true;
        }

        //calculate output all of the remaining neurons
        var outputs = [];
        for (var i in this.outputNeurons) {
            var n = this.outputNeurons[i];
            outputs.push(this._processOutputNeuron(n));
        }

        // console.log('network=' + network);
        Network.reset(this);
        return outputs;
    }

    _processOutputNeuron(neuron) {

        var output = 0;
        //If we haven't visted this, we will caluclate its output
        if (!neuron.visited) {
            neuron.visited = true;
            //we need to add the output of all neurons that connect to this one
            var calculatingOutput = 0;
            for (var i in neuron.connections) {
                var connection = neuron.connections[i];
                if (!connection.fireCount) {
                    connection.fireCount = 0;
                }
                connection.fireCount = this.fireCount;
                //upgrade
                var n = this.neurons[connection.neuronId];
                if (n.visited) {
                    calculatingOutput += n.output * connection.weight;
                } else {
                    calculatingOutput += this._processOutputNeuron(n) * connection.weight;
                }
            }
            neuron.output = calculatingOutput;
            //console.log('output=' + neuron.output);
            output = calculatingOutput;

        } else {
            output = neuron.output;
        }
        output = Network.tanh(output);
        if (Math.abs(output) > neuron.maxOutput) {
            neuron.maxOutput = Math.abs(output);
        }
        //if (Math.abs(output) > 1) {
        this.fireCount++;
        //}
        return output;
    }

    static tanh(x) {
        return Math.tanh(x);
    }

    static reset(network) {
        var neurons = network.neurons;
        for (var i in neurons) {
            neurons[i].visited = false;
        }
    }

    static createRandomBaseNetwork(inputCount, outputCount) {
        var network = new Network(UUID.generate());

        var inputNeurons = [];

        for (var i = 0; i < inputCount; i++) {
            var neuron = new Neuron('i', network.generation);
            inputNeurons.push(neuron);
            network.addNeuron(neuron);
        }

        var outputNeurons = [];

        for (var i = 0; i < outputCount; i++) {
            var neuron = new Neuron('o', network.generation);
            outputNeurons.push(neuron);
            network.addNeuron(neuron);
        }

        for (var i in inputNeurons) {
            var neuron = inputNeurons[i];
            for (var i in outputNeurons) {
                var outputNeuron = outputNeurons[i];
                var v = Network._randomWeight(100, 0);
                v = v / 100.0;
                outputNeuron.connect(neuron, Network._randomWeight(1, 0));
            }
        }
        return network;

    }

    static _randomWeight(max, min) {
        return (Math.random() * (max * 2 - min) + min) - max;
    }

    static resetMaxOutputs(network) {
        for (var i in network.hiddenNeurons) {
            network.hiddenNeurons[i].maxOutput = 0;
        }
    }

    static removeUselessNeurons(network) {
        //TODO check the max score for all hidden neurons. If it is under a threshold, kill the neuron
        for (var i in network.hiddenNeurons) {
            //console.log('max=' + Math.abs(network.hiddenNeurons[i].maxOutput));
            if (Math.abs(network.hiddenNeurons[i].maxOutput) < .003) {
                //console.log('death=' + Math.abs(network.hiddenNeurons[i].maxOutput));
                Network.removeNeuron(i, network.hiddenNeurons[i], network);
            }
        }
    }

    static removeNeuron(index, neuron, network) {
        var neurons = [];

        neuron.type = 'd';
        neuron.connections = [];

        neurons.push.apply(neurons, network.hiddenNeurons);
        neurons.push.apply(neurons, network.outputNeurons);

        for (var i in neurons) {
            var n = neurons[i];
            for (var k in n.connections) {
                var c = n.connections[k];

                if (c.neuronId == neuron.id) {
                    n.connections.splice(k, 1);
                }
            }
        }
        //neurons
    }
}

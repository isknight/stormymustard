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
        for (let i in this.inputNeurons) {
            let n = this.inputNeurons[i];
            //  console.log('input id=' + n.id);
            n.output = inputArray[i];
            n.visited = true;
        }

        //calculate output all of the remaining neurons
        let outputs = [];
        for (let i in this.outputNeurons) {
            let n = this.outputNeurons[i];
            outputs.push(this._processOutputNeuron(n));
        }

        // console.log('network=' + network);
        this.reset();
        return outputs;
    }

    _processOutputNeuron(neuron) {

        let output = 0;
        //If we haven't visted this, we will caluclate its output
        if (!neuron.visited) {
            neuron.visited = true;
            //we need to add the output of all neurons that connect to this one
            let calculatingOutput = 0;
            for (let i in neuron.connections) {
                let connection = neuron.connections[i];
                if (!connection.fireCount) {
                    connection.fireCount = 0;
                }
                connection.fireCount = this.fireCount;
                //upgrade
                let n = this.neurons[connection.neuronId];
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
        output = Math.tanh(output);
        if (Math.abs(output) > neuron.maxOutput) {
            neuron.maxOutput = Math.abs(output);
        }
        //if (Math.abs(output) > 1) {
        this.fireCount++;
        //}
        return output;
    }

    reset() {
        this.neurons.forEach(n => n.visited = false);
    }

    resetMaxOutputs() {
        for (let i in this.hiddenNeurons) {
            this.hiddenNeurons[i].maxOutput = 0;
        }
    }

    removeUselessNeurons() {
        //TODO check the max score for all hidden neurons. If it is under a threshold, kill the neuron
        for (let i in this.hiddenNeurons) {
            //console.log('max=' + Math.abs(network.hiddenNeurons[i].maxOutput));
            if (Math.abs(this.hiddenNeurons[i].maxOutput) < .003) {
                //console.log('death=' + Math.abs(network.hiddenNeurons[i].maxOutput));
                this._removeNeuron(this.hiddenNeurons[i]);
            }
        }
    }

    _removeNeuron(neuron) {
        let neurons = [];

        neuron.type = 'd';
        neuron.connections = [];

        neurons.push.apply(neurons, this.hiddenNeurons);
        neurons.push.apply(neurons, this.outputNeurons);

        for (let i in neurons) {
            let n = neurons[i];
            for (let k in n.connections) {
                let c = n.connections[k];

                if (c.neuronId == neuron.id) {
                    n.connections.splice(k, 1);
                }
            }
        }
        //neurons
    }
}

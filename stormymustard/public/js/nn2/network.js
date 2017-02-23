function Network(id) {
    this.id = id;
    this.inputNeurons = [];
    this.hiddenNeurons = [];
    this.outputNeurons = [];
    this.neurons = [];
    this.generation = 0;
    //TODO add bias neuron back in

}

Network.prototype = {
};

Network.addNeuron = function (network, neuron) {
    switch(neuron.type) {
        case 'i':
            network.inputNeurons.push(neuron);
            break;
        case 'h':
            network.hiddenNeurons.push(neuron);
            break;
        case 'o':
            network.outputNeurons.push(neuron);
            break;
    }


    network.neurons.push(neuron);
    neuron.id = network.neurons.length - 1;
};

Network.fire = function (network, inputArray) {
    //set output for all input neurons all input neurons
    for(var i in network.inputNeurons) {
        var n = network.inputNeurons[i];
        //  console.log('input id=' + n.id);
        n.output = inputArray[i];
        n.visited = true;
    }

    //calculate output all of the remaining neurons
    var outputs = [];
    for(var i in network.outputNeurons) {
        var n = network.outputNeurons[i];
        outputs.push(Network.processOutputNeuron(n, network));
    }

   // console.log('network=' + network);
    Network.reset(network);
    return outputs;

};


Network.connect = function(weight, outputNeuron, neuron) {
    var connection = new Connection(weight, neuron);
    outputNeuron.connections.push(connection);

};

Network.processOutputNeuron = function(neuron, network) {

    var output = 0;
    //If we haven't visted this, we will caluclate its output
    if(!neuron.visited) {
        neuron.visited = true;
        //we need to add the output of all neurons that connect to this one
        var calculatingOutput = 0;
        for(var i in neuron.connections) {
            var connection = neuron.connections[i];
            if (!connection.fireCount) {
                connection.fireCount = 0;
            }
            connection.fireCount = network.fireCount;
            //var n = NNUtil.getNeuronById(connection.neuronId, network);
            //upgrade
            var n = network.neurons[connection.neuronId];//]connection.getNeuron(network);
            if(n.visited) {
                calculatingOutput += n.output * connection.weight;
            } else {
                calculatingOutput += Network.processOutputNeuron(n, network) * connection.weight;
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
    network.fireCount++;
    //}

    return output;
};

Network.tanh = function(x) {
    return Math.tanh(x);
};

Network.reset = function(network) {

    var neurons = network.neurons;
    for (var i in neurons) {
        neurons[i].visited = false;
    }

};

Network.createRandomBaseNetwork = function(inputCount, outputCount) {
    var network = new Network(UUID.generate());

    var inputNeurons = [];

    for (var i = 0; i < inputCount; i++) {
        var neuron = new Neuron('i', network.generation);
        inputNeurons.push(neuron);
        Network.addNeuron(network, neuron);
    }

    var outputNeurons = [];

    for (var i = 0; i < outputCount; i++) {
        var neuron = new Neuron('o', network.generation);
        outputNeurons.push(neuron);
        Network.addNeuron(network, neuron);
    }

    for (var i in inputNeurons) {
        var neuron = inputNeurons[i];
        for (var i in outputNeurons) {
            var outputNeuron = outputNeurons[i];
            var v = Network._randomWeight(100,0);
            v = v / 100.0;
            Network.connect(Network._randomWeight(1,0), outputNeuron, neuron);
        }
    }
    return network;

};

Network._randomWeight = function(max, min) {
    return (Math.random() * (max*2 - min) + min) - max;
};


Network.resetMaxOutputs = function(network) {
    for (var i in network.hiddenNeurons) {
        network.hiddenNeurons[i].maxOutput = 0;
    }
};

Network.removeUselessNeurons = function(network) {
    //TODO check the max score for all hidden neurons. If it is under a threshold, kill the neuron
    for (var i in network.hiddenNeurons) {
        //console.log('max=' + Math.abs(network.hiddenNeurons[i].maxOutput));
        if (Math.abs(network.hiddenNeurons[i].maxOutput) < .003) {
            //console.log('death=' + Math.abs(network.hiddenNeurons[i].maxOutput));
            Network.removeNeuron(i, network.hiddenNeurons[i], network);
        }
    }
};

Network.removeNeuron = function(index, neuron, network) {
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

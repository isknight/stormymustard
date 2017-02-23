
function mutateNetwork(network) {

        var mutationCount = 2; //this._randomInteger(NNUtil.getAllNeurons(network).length,0);

        for (var i=0; i < mutationCount; i++) {

            var whichMutation = this._randomInteger(100, 0);

            if (whichMutation > 5) {
                //TODO pruning algo, might not be useful for this project
                //Network.removeUselessNeurons(network);
            }

            if (whichMutation > 0 && whichMutation < 5) {
                this._randomlyAddNeuron(network);
            }

            if (whichMutation > 5 && whichMutation < 40) {
                this._randomlyAddSynapseWithRandomWeight(network);
            }

            if (whichMutation > 40 && whichMutation < 100) {
                this._randomlyMutateSynapseWeight(network);
            }

        }
        //console.log('neuron count=' + network.neurons.length);
        Network.resetMaxOutputs(network);
}

/**
 * We start with randomly picked A<-B neurons and end with A<-C<-B where C is the newly injected neuron
 */
function _randomlyAddNeuron(network) {

    network.generation += 1;

    var neuron = new Neuron('h', network.generation);

    var neuronsA = [];
    var neuronsB = [];

    // assuming neurons A->B
    //first get a list of potential Bs
    neuronsB.push.apply(neuronsB, network.hiddenNeurons);
    neuronsB.push.apply(neuronsB, network.outputNeurons);


    //pick a random B
    var index = this._randomInteger(neuronsB.length, 0);
    var neuronB = neuronsB[index];

    //now find a list of potential As through all of B's connections
    for (var i in neuronB.connections) {
        //var n = NNUtil.getNeuronById(neuronB.connections[i].neuronId, network);
        var n = network.neurons[neuronB.connections[i].neuronId];
        neuronsA.push(n);
    }

    index = this._randomInteger(neuronsA.length, 0);

    var neuronA = neuronsA[index];
    var connectionA = null;

    //Find the connection to hijack
    for (var i in neuronB.connections) {
        var connection = neuronB.connections[i];
        if(connection.neuronId == neuronA.id) {
            connectionA = connection;
        }
    }

    if(connectionA) {
        Network.addNeuron(network, neuron);

        //reattach the current connection to A to the new neuron
        connectionA.neuronId = neuron.id;

        //create a new connection between the new neuron and B
        Network.connect(this._randomWeight(1, 0), neuron, neuronA);
    } else {
        console.log('failed to find connection');
    }

}

function _randomlyAddSynapseWithRandomWeight(network) {
    var neurons = [];
    var connections = [];

    //First get all of the hidden and output neurons, to randomly select
    //a neuron eligible for a new input. Input neurons cannot take part.
    neurons.push.apply(neurons, network.hiddenNeurons);
    neurons.push.apply(neurons, network.outputNeurons);

    var randomNeuronIndex = this._randomInteger(neurons.length, 0);
    var randomNeuron = neurons[randomNeuronIndex];

    //a list of neurons this random neuron is already connected to. We don't want a double connection.
    var alreadyConnections = [];
    for (var i in randomNeuron.connections) {
        var connection = randomNeuron.connections[i];
        //var n = NNUtil.getNeuronById(connection.neuronId, network);
        var n = network.neurons[connection.neuronId];
        alreadyConnections.push(n);
    }

    //now we'll find a valid neuron as the source of the input, we need to add the input ones in for this
    neurons = [];
    neurons.push.apply(neurons, network.inputNeurons);
    neurons.push.apply(neurons, network.hiddenNeurons);

    var newPotentialConnections = neurons.filter(function(x) { return alreadyConnections.indexOf(x) < 0 })

    if (newPotentialConnections.length > 0) {
        randomNeuronIndex = this._randomInteger(newPotentialConnections.length, 0);
        var randomConnectingNeuron = newPotentialConnections[randomNeuronIndex];
        Network.connect(this._randomWeight(1, 0), randomNeuron, randomConnectingNeuron);
    }
}

/**
 * Randomly adjusts the weight of a synapse
 */
function _randomlyMutateSynapseWeight(network) {

    var neurons = [];
    var connections = [];

    neurons.push.apply(neurons, network.inputNeurons);
    neurons.push.apply(neurons, network.hiddenNeurons);
    neurons.push.apply(neurons, network.outputNeurons);

    //TODO add bias neuron back in
   // neurons.push(network.bias);

    for (var i in neurons) {
        var neuron = neurons[i];
        connections.push.apply(connections, neuron.connections);
    }

    var r = this._randomInteger(connections.length, 0);

    var randomConnection = connections[r];

    randomConnection.weight += this._randomWeight(.4,0) - .2;
}

function _randomInteger(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function _randomWeight(max, min) {
    return (Math.random() * (max*2 - min) + min) - max;
}

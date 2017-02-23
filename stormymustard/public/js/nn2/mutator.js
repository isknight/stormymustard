
function mutateNetwork(network) {

        let mutationCount = 2; //this._randomInteger(NNUtil.getAllNeurons(network).length,0);

        for (let i=0; i < mutationCount; i++) {

            let whichMutation = this._randomInteger(100, 0);

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

    let neuron = new Neuron('h', network.generation);

    let neuronsA = [];
    let neuronsB = [];

    // assuming neurons A->B
    //first get a list of potential Bs
    neuronsB.push.apply(neuronsB, network.hiddenNeurons);
    neuronsB.push.apply(neuronsB, network.outputNeurons);


    //pick a random B
    let index = this._randomInteger(neuronsB.length, 0);
    let neuronB = neuronsB[index];

    //now find a list of potential As through all of B's connections
    for (let i in neuronB.connections) {
        //let n = NNUtil.getNeuronById(neuronB.connections[i].neuronId, network);
        let n = network.neurons[neuronB.connections[i].neuronId];
        neuronsA.push(n);
    }

    index = this._randomInteger(neuronsA.length, 0);

    let neuronA = neuronsA[index];
    let connectionA = null;

    //Find the connection to hijack
    for (let i in neuronB.connections) {
        let connection = neuronB.connections[i];
        if(connection.neuronId == neuronA.id) {
            connectionA = connection;
        }
    }

    if(connectionA) {
        network.addNeuron(neuron);

        //reattach the current connection to A to the new neuron
        connectionA.neuronId = neuron.id;

        //create a new connection between the new neuron and B
        Network.connect(this._randomWeight(1, 0), neuron, neuronA);
    } else {
        console.log('failed to find connection');
    }

}

function _randomlyAddSynapseWithRandomWeight(network) {
    let neurons = [];
    let connections = [];

    //First get all of the hidden and output neurons, to randomly select
    //a neuron eligible for a new input. Input neurons cannot take part.
    neurons.push.apply(neurons, network.hiddenNeurons);
    neurons.push.apply(neurons, network.outputNeurons);

    let randomNeuronIndex = this._randomInteger(neurons.length, 0);
    let randomNeuron = neurons[randomNeuronIndex];

    //a list of neurons this random neuron is already connected to. We don't want a double connection.
    let alreadyConnections = [];
    for (let i in randomNeuron.connections) {
        let connection = randomNeuron.connections[i];
        //let n = NNUtil.getNeuronById(connection.neuronId, network);
        let n = network.neurons[connection.neuronId];
        alreadyConnections.push(n);
    }

    //now we'll find a valid neuron as the source of the input, we need to add the input ones in for this
    neurons = [];
    neurons.push.apply(neurons, network.inputNeurons);
    neurons.push.apply(neurons, network.hiddenNeurons);

    let newPotentialConnections = neurons.filter(function(x) { return alreadyConnections.indexOf(x) < 0 })

    if (newPotentialConnections.length > 0) {
        randomNeuronIndex = this._randomInteger(newPotentialConnections.length, 0);
        let randomConnectingNeuron = newPotentialConnections[randomNeuronIndex];
        Network.connect(this._randomWeight(1, 0), randomNeuron, randomConnectingNeuron);
    }
}

/**
 * Randomly adjusts the weight of a synapse
 */
function _randomlyMutateSynapseWeight(network) {

    let neurons = [];
    let connections = [];

    neurons.push.apply(neurons, network.inputNeurons);
    neurons.push.apply(neurons, network.hiddenNeurons);
    neurons.push.apply(neurons, network.outputNeurons);

    //TODO add bias neuron back in
   // neurons.push(network.bias);

    for (let i in neurons) {
        let neuron = neurons[i];
        connections.push.apply(connections, neuron.connections);
    }

    let r = this._randomInteger(connections.length, 0);

    let randomConnection = connections[r];

    randomConnection.weight += this._randomWeight(.4,0) - .2;
}

function _randomInteger(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function _randomWeight(max, min) {
    return (Math.random() * (max*2 - min) + min) - max;
}

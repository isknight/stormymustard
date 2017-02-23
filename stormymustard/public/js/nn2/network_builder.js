function createRandomBaseNetwork(inputCount, outputCount) {
    let network = new Network(UUID.generate());

    let inputNeurons = [];

    for (let i = 0; i < inputCount; i++) {
        let neuron = new Neuron('i', network.generation);
        inputNeurons.push(neuron);
        network.addNeuron(neuron);
    }

    let outputNeurons = [];

    for (let i = 0; i < outputCount; i++) {
        let neuron = new Neuron('o', network.generation);
        outputNeurons.push(neuron);
        network.addNeuron(neuron);
    }

    for (let i in inputNeurons) {
        let neuron = inputNeurons[i];
        for (let i in outputNeurons) {
            let outputNeuron = outputNeurons[i];
            let v = Util.randomWeight(100, 0);
            v = v / 100.0;
            outputNeuron.connect(neuron, Util.randomWeight(1, 0));
        }
    }
    return network;
}

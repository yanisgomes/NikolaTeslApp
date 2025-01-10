import * as joint from 'jointjs';
import React, { useEffect, useRef, createContext } from 'react';
import imRes from '../../assets/Resistance.png';
import imBob from '../../assets/Bobine.png';
import imCond from '../../assets/Condensateur.png';

//Création du contexte graph. Fournisseur : CircuitWorkspace/JointWorkspace, Utilisation dans handleSubmit pour envoyer dans le back
export const Sharedgraph = createContext();

export const Gate = joint.dia.Element.define('logic.Gate', {
    size: { width: 80, height: 40 },
    attrs: {
        '.': { magnet: false },
        '.body': { width: 100, height: 50 },
        circle: { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 }
    }
}, {
    useCSSSelectors: true,
    operation: function() {
        return true;
    }
});

export const IO = Gate.define('logic.IO', {
    size: { width: 60, height: 30 },
    attrs: {
        '.body': { fill: 'white', stroke: 'black', 'stroke-width': 2 },
        '.wire': { ref: '.body', 'ref-y': .5, stroke: 'black' },
        text: {
            fill: 'black',
            ref: '.body', 'ref-x': .5, 'ref-y': .5, 'y-alignment': 'middle',
            'text-anchor': 'middle',
            'font-weight': 'bold',
            'font-variant': 'small-caps',
            'text-transform': 'capitalize',
            'font-size': '14px'
        }
    }
}, {
    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><path class="wire"/><circle/><text/></g>',
});

export const Input = IO.define('logic.Input', {
    attrs: {
        '.wire': { 'ref-dx': 0, d: 'M 0 0 L 23 0' },
        circle: { ref: '.body', 'ref-dx': 30, 'ref-y': 0.5, magnet: true, 'class': 'output', port: 'out' },
        text: { text: 'input' }
    }
});

export const Output = IO.define('logic.Output', {
    attrs: {
        '.wire': { 'ref-x': 0, d: 'M 0 0 L -23 0' },
        circle: { ref: '.body', 'ref-x': -30, 'ref-y': 0.5, magnet: 'passive', 'class': 'input', port: 'in' },
        text: { text: 'output' }
    }
});

export const Gate11 = Gate.define('logic.Gate11', {
    attrs: {
        '.input': { ref: '.body', 'ref-x': -2, 'ref-y': 0.5, magnet: 'passive', port: 'in' },
        '.output': { ref: '.body', 'ref-dx': 2, 'ref-y': 0.5, magnet: true, port: 'out' }
    }
}, {
    markup: '<g class="rotatable"><g class="scalable"><image class="body"/></g><circle class="input"/><circle class="output"/></g>',
});

export const Gate21 = Gate.define('logic.Gate21', {
    attrs: {
        '.input1': { ref: '.body', 'ref-x': -2, 'ref-y': 0.3, magnet: 'passive', port: 'in1' },
        '.input2': { ref: '.body', 'ref-x': -2, 'ref-y': 0.7, magnet: 'passive', port: 'in2' },
        '.output': { ref: '.body', 'ref-dx': 2, 'ref-y': 0.5, magnet: true, port: 'out' }
    }
}, {
    markup: '<g class="rotatable"><g class="scalable"><image class="body"/></g><circle class="input input1"/><circle  class="input input2"/><circle class="output"/></g>',
});

export const Resistance = Gate11.define('logic.Resistance', {
    attrs: { image: { 'xlink:href': imRes}}
}, {
    operation: function(input) {
        return !input;
    }
});

export const Wire = joint.dia.Link.define('logic.Wire', {
    attrs: {
        '.connection': { 'stroke-width': 2 },
        '.marker-vertex': { r: 7 }
    },

    router: { name: 'orthogonal' },
    connector: { name: 'rounded', args: { radius: 10 }}
}, {
    useCSSSelectors: true,
    arrowheadMarkup: [
        '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
        '<circle class="marker-arrowhead" end="<%= end %>" r="7"/>',
        '</g>'
    ].join(''),

    vertexMarkup: [
        '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
        '<circle class="marker-vertex" idx="<%= idx %>" r="10" />',
        '<g class="marker-vertex-remove-group">',
        '<path class="marker-vertex-remove-area" idx="<%= idx %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>',
        '<path class="marker-vertex-remove" idx="<%= idx %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
        '<title>Remove vertex.</title>',
        '</path>',
        '</g>',
        '</g>'
    ].join('')
});

export const shapes = {
    ...joint.shapes,
    logic: {
        Input,
        Output,
        Gate,
        Wire
    }
};


const JointWorkspace = () => {
    const graphContainerRef = useRef(null);
    const graph = new joint.dia.Graph();

    useEffect(() => {
        // Initialisation du graphe et du papier
        
        const paper = new joint.dia.Paper({
            el: graphContainerRef.current,
            model: graph,
            width: 2000,
            height: 1000,
            gridSize: 20,
            drawGrid: true,
        });

        // Ajout d'éléments
        const input1 = new Input().position(50, 150).addTo(graph);
        const andGate = new Resistance().position(300, 200).addTo(graph);
        const output = new Output().position(550, 200).addTo(graph);

        // Connexions
        new joint.dia.Link({
            source: { id: input1.id, port: 'out' },
            target: { id: andGate.id, port: 'in1' },
        }).addTo(graph);

        new joint.dia.Link({
            source: { id: andGate.id, port: 'out' },
            target: { id: output.id, port: 'in' },
        }).addTo(graph);

        var allEdges = graph.getLinks();
        console.log("Test");
        console.log(allEdges);

    }, []);

    return (
    <>
        <div ref={graphContainerRef} style={{ border: '1px solid black' }} />
        <Sharedgraph.Provider value={graph} />
    </>

    );
};

export default JointWorkspace;
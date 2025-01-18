import React, { useEffect, useRef, useContext } from 'react';
import * as joint from 'jointjs';

// Images
import symbol_resistor from '../../assets/symbol_resistor.png';
import symbol_inductor from '../../assets/symbol_inductor.png';
import symbol_capacitor from '../../assets/symbol_capacitor.png';
import symbol_aop from '../../assets/symbol_aop.png';

import { CircuitGraphContext, PaperContext } from '../../utils/context';

// 1) Composant abstrait
export const AbstractComponent = joint.dia.Element.define(
    'electronics.Component',
    {
        size: { width: 60, height: 40 },
        attrs: {
            '.body': { width: 80, height: 40 },
            image: {
                'xlink:href': '',
                width: 60,
                height: 40,
            },
            '.label': {
                ref: '.body',
                'ref-x': 0.5,
                'ref-y': 0.5,
                'text-anchor': 'middle',
                'y-alignment': 'middle',
                'font-size': 10,
                fill: 'red',
                text: '',
            },
            '.pole1': {
                ref: '.body',
                magnet: true,
                r: 5,
                fill: 'transparent',
                stroke: 'black',
                'stroke-width': 1,
            },
            '.pole2': {
                ref: '.body',
                magnet: true,
                r: 5,
                fill: 'transparent',
                stroke: 'black',
                'stroke-width': 1,
            },
            '.pole3': {
                ref: '.body',
                magnet: true,
                r: 5,
                fill: 'transparent',
                stroke: 'black',
                'stroke-width': 1,
            },
        },
    },
    {
        markup: `
      <g class="rotatable">
        <g class="scalable">
          <rect class="body"/>
          <image class="body"/>
        </g>
        <circle class="pole1"/>
        <circle class="pole2"/>
        <circle class="pole3"/>
        <text class="label"/>
      </g>
    `,
    }
);

// 2) Déclinaisons concrètes
export const Resistor = AbstractComponent.define(
    'electronics.Resistor',
    {
        attrs: {
            image: {
                'xlink:href': symbol_resistor,
            },
            '.label': {
                text: 'R = 100 Ω',
            },
            '.pole1': {
                'ref-x': -10,
                'ref-y': 0.5,
            },
            '.pole2': {
                'ref-dx': 10,
                'ref-y': 0.5,
            },
            '.pole3': {
                display: 'none',
            },
        },
        valeur: 100,
    },
    {
        setValeur: function (v) {
            this.valeur = v;
            this.attr('.label/text', `R = ${v} Ω`);
        },
        getValeur: function () {
            return this.valeur;
        },
    }
);

export const Inductor = AbstractComponent.define(
    'electronics.Inductor',
    {
        attrs: {
            image: {
                'xlink:href': symbol_inductor,
            },
            '.label': {
                text: 'L = 10 mH',
            },
            '.pole1': {
                'ref-x': -10,
                'ref-y': 0.5,
            },
            '.pole2': {
                'ref-dx': 10,
                'ref-y': 0.5,
            },
            '.pole3': {
                display: 'none',
            },
        },
        valeur: 10,
    },
    {
        setValeur: function (v) {
            this.valeur = v;
            this.attr('.label/text', `L = ${v} mH`);
        },
        getValeur: function () {
            return this.valeur;
        },
    }
);

export const Capacitor = AbstractComponent.define(
    'electronics.Capacitor',
    {
        attrs: {
            image: {
                'xlink:href': symbol_capacitor,
            },
            '.label': {
                text: 'C = 1 µF',
            },
            '.pole1': {
                'ref-x': 0.5,
                'ref-y': -5,
            },
            '.pole2': {
                'ref-x': 0.5,
                'ref-dy': 5,
            },
            '.pole3': {
                display: 'none',
            },
        },
        valeur: 1,
    },
    {
        setValeur: function (v) {
            this.valeur = v;
            this.attr('.label/text', `C = ${v} µF`);
        },
        getValeur: function () {
            return this.valeur;
        },
    }
);

export const AOP = AbstractComponent.define(
    'electronics.AOP',
    {
        attrs: {
            image: {
                'xlink:href': symbol_aop,
            },
            '.label': {
                text: 'AOP',
            },
            '.pole1': {
                'ref-x': -10,
                'ref-y': 0.3,
            },
            '.pole2': {
                'ref-x': -10,
                'ref-y': 0.7,
            },
            '.pole3': {
                'ref-dx': 10,
                'ref-y': 0.5,
            },
        },
    },
    {
        // Méthodes, ex: setGain, getGain ...
    }
);

// 3) Wire
export const Wire = joint.dia.Link.define(
    'electronics.Wire',
    {
        attrs: {
            '.connection': { 'stroke-width': 2, stroke: 'black' },
            '.marker-vertex': { r: 7 },
        },
        router: { name: 'orthogonal' },
        connector: { name: 'rounded', args: { radius: 10 } },
    },
    {
        // Idem si besoin d’un arrowheadMarkup, vertexMarkup, etc.
    }
);

//export const Wire = joint.dia.Link.define(
//    'logic.Wire',
//    {
//        attrs: {
//            '.connection': { 'stroke-width': 2 },
//            '.marker-vertex': { r: 7 },
//        },
//
//        router: { name: 'orthogonal' },
//        connector: { name: 'rounded', args: { radius: 10 } },
//    },
//    {
//        useCSSSelectors: true,
//        arrowheadMarkup: [
//            '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
//            '<circle class="marker-arrowhead" end="<%= end %>" r="7"/>',
//            '</g>',
//        ].join(''),
//
//        vertexMarkup: [
//            '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
//            '<circle class="marker-vertex" idx="<%= idx %>" r="10" />',
//            '<g class="marker-vertex-remove-group">',
//            '<path class="marker-vertex-remove-area" idx="<%= idx %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>',
//            '<path class="marker-vertex-remove" idx="<%= idx %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
//            '<title>Remove vertex.</title>',
//            '</path>',
//            '</g>',
//            '</g>',
//        ].join(''),
//    }
//);

export const shapes = {
    ...joint.shapes,
    electronics: {
        Resistor,
        Inductor,
        Capacitor,
        AOP,
        Wire,
    },
};

// Fonction pour créer un noeud
function createNode(graph, position) {
    const hub = new joint.shapes.standard.Circle();
    hub.position(position.x, position.y);
    hub.resize(20, 20); // Taille du nœud
    hub.attr({
        body: { fill: 'blue' },
        label: { text: '', fill: 'white' },
    });
    hub.addTo(graph);
    return hub;
}

function getIntersection(p1, p2, p3, p4) {
    const det = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);

    if (det === 0) return null; // Les segments sont parallèles ou colinéaires

    const lambda =
        ((p4.y - p3.y) * (p4.x - p1.x) - (p4.x - p3.x) * (p4.y - p1.y)) / det;
    const gamma =
        ((p1.y - p2.y) * (p4.x - p1.x) - (p1.x - p2.x) * (p4.y - p1.y)) / det;

    // Vérifie si l'intersection est dans les limites des deux segments
    if (lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1) {
        return {
            x: p1.x + lambda * (p2.x - p1.x),
            y: p1.y + lambda * (p2.y - p1.y),
        };
    }

    return null; // Pas d'intersection
}

// 4) Logique de zoom/pan
const enablePanning = (paper) => {
    let isDragging = false;
    let lastPosition = { x: 0, y: 0 };

    paper.on('blank:pointerdown', (evt, x, y) => {
        isDragging = true;
        lastPosition = { x: evt.clientX, y: evt.clientY };
    });

    // Si on clique sur un élément, on arrête la propagation pour ne pas bouger la vue
    paper.on('element:pointerdown link:pointerdown', (elementView, evt) => {
        evt.stopPropagation();
    });

    document.addEventListener('mousemove', (evt) => {
        if (!isDragging) return;
        const dx = evt.clientX - lastPosition.x;
        const dy = evt.clientY - lastPosition.y;
        lastPosition = { x: evt.clientX, y: evt.clientY };

        const currentTranslate = paper.translate();
        paper.translate(currentTranslate.tx + dx, currentTranslate.ty + dy);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
};

const enableZoom = (paper) => {
    const minZoom = 0.5;
    const maxZoom = 2;
    const zoomStep = 0.1;

    paper.on('blank:mousewheel', (evt, x, y, delta) => {
        evt.preventDefault();
        evt.stopPropagation();

        const currentScale = paper.scale().sx;
        let newScale = currentScale + delta * zoomStep;
        newScale = Math.max(minZoom, Math.min(maxZoom, newScale));
        paper.scale(newScale, newScale, x, y);
    });
};

// 5) Le composant JointWorkspace
const JointWorkspace = ({ onDrop, onDragOver }) => {
    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
    const { paper, setPaper } = useContext(PaperContext);
    const graphContainerRef = useRef(null);
    const graph = new joint.dia.Graph();

    //useEffect(() => {
    //    // Initialisation du graphe et du papier
    //
    //    const paper = new joint.dia.Paper({
    //        el: graphContainerRef.current,
    //        model: graph,
    //        width: '100vh',
    //        height: '45vh',
    //        gridSize: 20,
    //        drawGrid: true,
    //    });
    //
    //    paper.on('cell:pointerdblclick', function (cellView) {
    //        const cell = cellView.model;
    //
    //        // Vérifie si l'élément cliqué est une résistance
    //        if (cell.isElement() && cell instanceof Resistor) {
    //            // Demande la nouvelle valeur
    //            const nouvelleValeur = prompt(
    //                'Entrez la nouvelle valeur de la résistance (Ω) :',
    //                cell.getValeur() // Pré-remplit avec la valeur actuelle
    //            );
    //
    //            // Si une nouvelle valeur est saisie et qu'elle est valide, on la met à jour
    //            if (nouvelleValeur !== null && !isNaN(nouvelleValeur)) {
    //                cell.setValeur(parseFloat(nouvelleValeur));
    //            } else {
    //                alert('Veuillez entrer une valeur numérique valide.');
    //            }
    //        }
    //        /*
    //        // Vérifie si l'élément cliqué est un condensateur
    //        if (cell.isElement() && cell instanceof Condensateur) {
    //            // Demande la nouvelle valeur
    //            const nouvelleValeur = prompt(
    //                'Entrez la nouvelle valeur du condensateur (F) :',
    //                cell.getValeur() // Pré-remplit avec la valeur actuelle
    //            );
    //
    //            // Si une nouvelle valeur est saisie et qu'elle est valide, on la met à jour
    //            if (nouvelleValeur !== null && !isNaN(nouvelleValeur)) {
    //                cell.setValeur(parseFloat(nouvelleValeur));
    //            } else {
    //                alert("Veuillez entrer une valeur numérique valide.");
    //            }
    //        }
    //
    //        // Vérifie si l'élément cliqué est une Bobine
    //        if (cell.isElement() && cell instanceof Bobine) {
    //            // Demande la nouvelle valeur
    //            const nouvelleValeur = prompt(
    //                'Entrez la nouvelle valeur de la bobine (H) :',
    //                cell.getValeur() // Pré-remplit avec la valeur actuelle
    //            );
    //
    //            // Si une nouvelle valeur est saisie et qu'elle est valide, on la met à jour
    //            if (nouvelleValeur !== null && !isNaN(nouvelleValeur)) {
    //                cell.setValeur(parseFloat(nouvelleValeur));
    //            } else {
    //                alert("Veuillez entrer une valeur numérique valide.");
    //            }
    //        }*/
    //    });
    //
    //    // NOEUDS
    //    // Surveiller les liens pour créer des hubs dynamiquement
    //    graph.on('change:target', function (link) {
    //        const target = link.get('target'); // Récupère la cible actuelle du lien déplacé
    //        if (!target || target.id) return; // Assurez-vous que la cible est une position libre (pas un élément)
    //
    //        const sourcePosition = link.source().id
    //            ? graph.getCell(link.source().id).position()
    //            : link.source(); // Position de la source du lien déplacé
    //        const targetPosition = target; // Position actuelle de l'extrémité déplacée
    //
    //        // Vérifier les intersections avec d'autres liens
    //        graph.getLinks().forEach((otherLink) => {
    //            if (otherLink === link) return; // Ignore le lien lui-même
    //
    //            const otherSourcePosition = otherLink.source().id
    //                ? graph.getCell(otherLink.source().id).position()
    //                : otherLink.source();
    //            const otherTargetPosition = otherLink.target().id
    //                ? graph.getCell(otherLink.target().id).position()
    //                : otherLink.target();
    //
    //            // Vérifie si les deux segments de liens se croisent
    //            const intersection = getIntersection(
    //                sourcePosition,
    //                targetPosition,
    //                otherSourcePosition,
    //                otherTargetPosition
    //            );
    //
    //            if (intersection) {
    //                // Vérifie s'il existe déjà un nœud proche de l'intersection
    //                const radius = 70; // Rayon de proximité (en pixels)
    //                const existingNode = graph.getElements().find((element) => {
    //                    const position = element.position();
    //                    return (
    //                        Math.abs(position.x - intersection.x) < radius &&
    //                        Math.abs(position.y - intersection.y) < radius
    //                    );
    //                });
    //
    //                if (!existingNode) {
    //                    // Crée un nœud à la position de l'intersection
    //                    const hub = createNode(graph, intersection);
    //
    //                    // Connecte immédiatement le lien déplacé au nœud
    //                    link.set('target', { id: hub.id, port: 'in' });
    //
    //                    // Coupe le lien existant en deux et connecte les segments au nœud
    //                    const newLink = new joint.dia.Link({
    //                        source: { id: hub.id, port: 'out' },
    //                        target: otherLink.target(),
    //                    }).addTo(graph);
    //                    otherLink.set('target', { id: hub.id, port: 'in' });
    //
    //                    console.log(
    //                        'Intersection détectée, nœud créé et lien connecté !'
    //                    );
    //                } else {
    //                    // Connecte directement le lien au nœud existant
    //                    link.set('target', { id: existingNode.id, port: 'in' });
    //                    console.log(
    //                        'Un nœud existant a été utilisé pour connecter le lien.'
    //                    );
    //                }
    //            }
    //        });
    //    });
    //
    //    var allEdges = graph.getLinks();
    //    console.log('Test');
    //    console.log(allEdges);
    //
    //    setCircuitGraph(graph);
    //    // Activer le zoom et le déplacement
    //    enableZoom(paper);
    //    enablePanning(paper);
    //    setPaper(paper);
    //
    //    // Update zoom level in state on scale change
    //    paper.on('scale', setPaper(paper)); // Assuming uniform scaling
    //}, []);
    //
    useEffect(() => {
        // Initialisation du graph + paper
        const localPaper = new joint.dia.Paper({
            el: graphContainerRef.current,
            model: graph,
            width: '100vh',
            height: '45vh',
            gridSize: 20,
            drawGrid: true,
            async: true,
            interactive: { linkMove: true },
            cellViewNamespace: shapes,
        });

        // Exemple : double-clic pour changer la valeur d’un composant
        localPaper.on('cell:pointerdblclick', (cellView) => {
            const cell = cellView.model;

            // Exemple : si c’est un resistor
            if (cell.isElement() && cell instanceof Resistor) {
                const nouvelleValeur = prompt(
                    'Entrez la nouvelle valeur de la résistance (Ω) :',
                    cell.getValeur()
                );
                if (nouvelleValeur !== null && !isNaN(nouvelleValeur)) {
                    cell.setValeur(parseFloat(nouvelleValeur));
                } else {
                    alert('Veuillez entrer une valeur numérique valide.');
                }
            }

            // Idem pour le condensateur, la bobine, etc.
            // if (cell instanceof Capacitor) {...}
            // if (cell instanceof Inductor) {...}
        });

        // Active le zoom & panning
        //enableZoom(localPaper);
        //enablePanning(localPaper);

        // Stocke dans le state (pour usage ailleurs)
        setCircuitGraph(graph);
        setPaper(localPaper);
    }, []);

    return (
        <div onDrop={onDrop} onDragOver={onDragOver} ref={graphContainerRef} />
    );
};

export default JointWorkspace;

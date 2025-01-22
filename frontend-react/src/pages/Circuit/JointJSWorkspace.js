import * as joint from 'jointjs';
import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';

import colors from '../../utils/style/colors';

import symbol_resistor from '../../assets/symbol_resistor.png';

import {
    CircuitGraphContext,
    PaperContext,
    CircuitInteractionContext,
} from '../../utils/context';

import { symbol } from 'prop-types';

import { CircuitNode, Resistor, Wire } from './JointJSElements';
import { AnalyticalInput, AnalyticalOutput } from './JointJSElements';

// =====================================
// 7) FONCTIONS UTILES (intersection, panning, zoom, etc.)
// =====================================
function getIntersection(p1, p2, p3, p4) {
    const det = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);

    if (det === 0) return null; // segments parallèles ou colinéaires

    const lambda =
        ((p4.y - p3.y) * (p4.x - p1.x) - (p4.x - p3.x) * (p4.y - p1.y)) / det;
    const gamma =
        ((p1.y - p2.y) * (p4.x - p1.x) - (p1.x - p2.x) * (p4.y - p1.y)) / det;

    // On vérifie que l'intersection se fait entre 0 et 1 sur les deux segments
    if (lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1) {
        return {
            x: p1.x + lambda * (p2.x - p1.x),
            y: p1.y + lambda * (p2.y - p1.y),
        };
    }
    return null;
}

const enablePanning = (paper) => {
    let isPanning = false;
    let startX, startY;

    paper.on('blank:pointerdown', (evt, x, y) => {
        isPanning = true;
        startX = evt.clientX;
        startY = evt.clientY;
    });

    document.addEventListener('mousemove', (evt) => {
        if (!isPanning) return;

        const dx = evt.clientX - startX;
        const dy = evt.clientY - startY;
        startX = evt.clientX;
        startY = evt.clientY;

        const translate = paper.translate();
        paper.translate(translate.tx + dx, translate.ty + dy);
    });

    document.addEventListener('mouseup', () => {
        isPanning = false;
    });
};

const enableZoom = (paper) => {
    const zoomStep = 0.01;
    const minZoom = 0.5;
    const maxZoom = 2;

    paper.on('blank:mousewheel', (evt, x, y, delta) => {
        const currentScale = paper.scale();
        const newScale = Math.min(
            Math.max(currentScale.sx + delta * zoomStep, minZoom),
            maxZoom
        );
        // Zoom autour du pointeur
        paper.scale(newScale, newScale, x, y);
    });
};

// =====================================
// 8) CRÉATION DU NŒUD (via CircuitNode)
// =====================================
function createNode(graph, position) {
    // Au lieu d’utiliser standard.Circle(), on utilise CircuitNode
    const node = new CircuitNode();
    node.position(position.x, position.y);
    node.resize(20, 20);

    // Optionnel: donner un nom (ex. un identifiant unique ou "N1", "N2", etc.)
    // node.setName('Nœud');

    // On peut afficher ce name sur le label si on veut
    // node.attr('label/text', node.getName());

    // On ajoute l’élément au graph
    node.addTo(graph);

    return node;
}

const WorkspaceContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-height: auto;
    overflow-y: auto;
`;

// =====================================
// 9) COMPOSANT REACT
// =====================================
function JointJSWorkspace(props) {
    const { onDrop, onDragOver } = props;
    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
    const { paper, setPaper } = useContext(PaperContext);
    const graphContainerRef = useRef(null);

    const {
        hoveredElementId,
        setHoveredElementId,
        selectedElementId,
        setSelectedElementId,
    } = useContext(CircuitInteractionContext);

    useEffect(() => {
        // Initialisation du graphe et du paper
        const graph = new joint.dia.Graph();
        const paper = new joint.dia.Paper({
            el: graphContainerRef.current,
            model: graph,
            width: '100vh',
            height: '45vh',
            gridSize: 20,
            drawGrid: true,
            snapLinks: false,
            defaultLink: () => new Wire(),
        });

        // Create initial AnalyticalInput
        const input = new AnalyticalInput();
        input.position(100, 200);
        input.addTo(graph);

        // Create initial AnalyticalOutput
        const output = new AnalyticalOutput();
        output.position(500, 200);
        output.addTo(graph);

        // ========== Définition du rotateTool ==========
        const rotateTool = new joint.elementTools.Button({
            markup: [
                {
                    tagName: 'circle',
                    selector: 'button',
                    attributes: {
                        r: 10,
                        fill: '#FFFFFF',
                        stroke: '#000000',
                        'stroke-width': 2,
                        cursor: 'pointer',
                    },
                },
                {
                    tagName: 'text',
                    textContent: '↻',
                    selector: 'icon',
                    attributes: {
                        fill: '#000000',
                        'font-size': 14,
                        'text-anchor': 'middle',
                        'pointer-events': 'none',
                        y: '0.3em',
                    },
                },
            ],
            x: '100%',
            y: '100%',
            offset: { x: 0, y: -0 },
            action: function (evt, elementView, toolView) {
                elementView.model.rotate(90, false);
            },
        });

        // ========== Définition du removeTool ==========
        const removeTool = new joint.elementTools.Button({
            markup: [
                {
                    tagName: 'circle',
                    selector: 'button',
                    attributes: {
                        r: 10,
                        fill: colors.tertiary,
                        stroke: '#000000',
                        'stroke-width': 2,
                        cursor: 'pointer',
                    },
                },
                {
                    tagName: 'text',
                    textContent: '×', // Vous pouvez mettre n’importe quel caractère
                    selector: 'icon',
                    attributes: {
                        fill: '#ffffff',
                        'font-size': 14,
                        'text-anchor': 'middle',
                        'pointer-events': 'none',
                        y: '0.3em',
                    },
                },
            ],

            // Position du bouton (en bas à droite ici, par exemple)
            x: '100%',
            y: '0%',
            offset: { x: 0, y: 0 },

            // Action déclenchée au clic : on supprime l’élément.
            action: function (evt, elementView, toolView) {
                const element = elementView.model;
                element.remove();
            },
        });

        paper.on('cell:mouseover', (cellView) => {
            const hoveredId = cellView.model.id;
            setHoveredElementId(hoveredId);
        });
        paper.on('cell:mouseout', (cellView) => {
            setHoveredElementId(null);
        });
        paper.on('cell:pointerclick', (cellView) => {
            const selectedId = cellView.model.id;
            setSelectedElementId(selectedId);

            if (cellView.model.isElement()) {
                // ===============================
                // Cas : c'est un élément
                // ===============================
                const element = cellView.model;
                if (
                    element instanceof AnalyticalInput ||
                    element instanceof AnalyticalOutput
                ) {
                    const toolsView = new joint.dia.ToolsView({
                        tools: [
                            new joint.elementTools.Boundary({ padding: 4 }),
                            rotateTool,
                        ],
                    });
                    cellView.addTools(toolsView);
                } else {
                    const toolsView = new joint.dia.ToolsView({
                        tools: [
                            new joint.elementTools.Boundary({ padding: 4 }),
                            rotateTool,
                            removeTool,
                        ],
                    });
                    cellView.addTools(toolsView);
                }
            } else if (cellView.model.isLink()) {
                // ===============================
                // Cas : c'est un lien
                // ===============================

                // On définit les différents tools pour le lien :
                const segmentsTool = new joint.linkTools.Segments();
                const sourceArrowheadTool =
                    new joint.linkTools.SourceArrowhead();
                const targetArrowheadTool =
                    new joint.linkTools.TargetArrowhead();
                const sourceAnchorTool = new joint.linkTools.SourceAnchor();
                const targetAnchorTool = new joint.linkTools.TargetAnchor();
                const boundaryTool = new joint.linkTools.Boundary();
                const removeToolLink = new joint.linkTools.Remove({
                    distance: '50%', // optionnel, on peut changer la position du bouton
                });

                const linkToolsView = new joint.dia.ToolsView({
                    tools: [
                        segmentsTool,
                        sourceArrowheadTool,
                        targetArrowheadTool,
                        sourceAnchorTool,
                        targetAnchorTool,
                        boundaryTool,
                        removeToolLink,
                    ],
                });

                // On attache ces tools au link cliqué
                cellView.addTools(linkToolsView);
            }
        });

        // Exemple : double-clic sur une résistance pour changer la valeur
        paper.on('cell:pointerdblclick', function (cellView) {
            const cell = cellView.model;

            // Vérifier si c'est bien une Resistance
            if (cell.isElement() && cell instanceof Resistor) {
                const nouvelleValeur = prompt(
                    'Entrez la nouvelle valeur de la résistance (Ω) :',
                    cell.getValue() // la valeur courante
                );

                if (nouvelleValeur !== null && !isNaN(nouvelleValeur)) {
                    cell.setValue(parseFloat(nouvelleValeur));
                } else {
                    alert('Veuillez entrer une valeur numérique valide.');
                }
            }
        });

        paper.on('blank:pointerclick', () => {
            setSelectedElementId(null);

            paper.hideTools();
        });

        // =====================================
        // LOGIQUE DE CRÉATION AUTOMATIQUE DES NŒUDS
        // =====================================
        // Quand la cible d'un lien change, on vérifie les intersections
        graph.on('change:target', function (link) {
            const target = link.get('target');
            // On ne fait quelque chose que si la cible est un "point libre" (pas un id déjà existant)
            if (!target || target.id) return;

            const sourcePosition = link.source().id
                ? graph.getCell(link.source().id).position()
                : link.source();
            const targetPosition = target; // position x,y

            // On compare avec tous les autres fils pour voir s'il y a intersection
            graph.getLinks().forEach((otherLink) => {
                if (otherLink === link) return; // pas avec soi-même

                const otherSourcePosition = otherLink.source().id
                    ? graph.getCell(otherLink.source().id).position()
                    : otherLink.source();
                const otherTargetPosition = otherLink.target().id
                    ? graph.getCell(otherLink.target().id).position()
                    : otherLink.target();

                const intersection = getIntersection(
                    sourcePosition,
                    targetPosition,
                    otherSourcePosition,
                    otherTargetPosition
                );

                if (intersection) {
                    // On regarde si un nœud existe déjà près de l'intersection
                    const radius = 30; // tolérance en pixels
                    const existingNode = graph.getElements().find((element) => {
                        const position = element.position();
                        return (
                            Math.abs(position.x - intersection.x) < radius &&
                            Math.abs(position.y - intersection.y) < radius
                        );
                    });

                    if (!existingNode) {
                        // On crée un nouveau CircuitNode à l'intersection
                        const newNode = createNode(graph, intersection);

                        // Rebranche le lien en cours vers ce nouveau noeud
                        link.set('target', { id: newNode.id });

                        // Couper "otherLink" pour y insérer le nœud
                        // => on crée un nouveau lien depuis ce nœud vers la "vraie" target de otherLink
                        const newLink = new Wire({
                            source: { id: newNode.id },
                            target: otherLink.target(),
                        });
                        newLink.addTo(graph);

                        // On recâble le "otherLink" original jusqu'au nouveau nœud
                        otherLink.set('target', { id: newNode.id });

                        console.log('Intersection détectée, nœud créé !');
                    } else {
                        // Sinon on réutilise ce nœud existant
                        link.set('target', { id: existingNode.id });
                        console.log(
                            'Intersection détectée sur un nœud existant !'
                        );
                    }
                }
            });
        });

        // =================================================
        // GESTION DU MARKER QUI APPARAÎT SUR LE SURVOL D'UN LIEN
        // =================================================

        setCircuitGraph(graph);

        // Active le zoom et le panning
        enableZoom(paper);
        enablePanning(paper);

        setPaper(paper);
        // Sur tout changement d'échelle, on pourrait mettre à jour un état React:
        // paper.on('scale', () => { ... });
    }, []);

    useEffect(() => {
        if (!paper) return;

        // Unhighlight all cells
        paper.model.getCells().forEach((cell) => {
            const view = paper.findViewByModel(cell);
            if (view) view.unhighlight();
        });

        // Highlight hovered
        if (hoveredElementId) {
            const hoveredCell = paper.model.getCell(hoveredElementId);
            if (hoveredCell) {
                const view = paper.findViewByModel(hoveredCell);
                if (view) view.highlight();
            }
        }

        // Highlight selected
        if (selectedElementId) {
            const selectedCell = paper.model.getCell(selectedElementId);
            if (selectedCell) {
                const view = paper.findViewByModel(selectedCell);
                if (view) view.highlight();
            }
        }
    }, [paper, hoveredElementId, selectedElementId]);

    return (
        <WorkspaceContainer
            onDrop={onDrop}
            onDragOver={onDragOver}
            ref={graphContainerRef}
        />
    );
}

export default JointJSWorkspace;

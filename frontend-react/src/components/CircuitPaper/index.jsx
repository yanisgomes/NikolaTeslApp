import * as joint from 'jointjs';
import { dia, shapes, V, elementTools } from 'jointjs';
import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { CircuitGraphContext, PaperContext } from '../../utils/context';

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

// =====================================
// 9) COMPOSANT REACT
// =====================================
function CircuitPaper(props) {
    const {
        width = 900,
        height = 450,
        onDrop,
        onDragOver,
        onSelect,
        onUnselect,
        onHover,
        onUnhover,
    } = props;

    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
    const { paper, setPaper } = useContext(PaperContext);
    const [scale, setScale] = useState(1);
    const [matrix, setMatrix] = useState(V.createSVGMatrix());
    const graphContainerRef = useRef(null);

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

        paper.on('cell:mouseover', (cellView) => {
            const hoveredId = cellView.model.id;
            onHover(hoveredId);
        });
        paper.on('cell:mouseout', (cellView) => {
            const unhoveredId = cellView.model.id;
            onUnhover(unhoveredId);
        });
        paper.on('cell:pointerclick', (cellView) => {
            const selectedId = cellView.model.id;
            onSelect(selectedId);
        });
        paper.on('blank:pointerclick', () => {
            onUnselect();
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

        setCircuitGraph(graph);

        enablePanning(paper);

        setPaper(paper);
        // Sur tout changement d'échelle, on pourrait mettre à jour un état React:
        // paper.on('scale', () => { ... });
    }, []);

    useEffect(() => {
        const size = paper.current.getComputedSize();
        paper.current.translate(0, 0);
        paper.current.scale(scale, scale, size.width / 2, size.height / 2);
        setMatrix(paper.current.matrix());
    }, [scale]);

    const renderElements = () => {
        return elements.map((cellData) => {
            const { elementType, x = 0, y = 0, ...element } = cellData;

            switch (elementType) {
                case 'task':
                    return (
                        <JointElement
                            key={element.id}
                            ref={(el) => (nodeRefs.current[element.id] = el)}
                            x={x}
                            y={y}
                            updateElements={updateElements}
                            {...element}
                        />
                    );
                default:
                    // TODO Implement new element types here
                    throw new Error(`Unknown element type: ${elementType}`);
            }
        });
    };

    return (
        <div
            className="paper"
            style={{ width: `${width}px`, height: `${height}px` }}
        >
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                ref={graphContainerRef}
                style={{
                    display: 'inline-block',
                }}
            />
            <div
                style={{
                    transformOrigin: '0 0',
                    transform: V.matrixToTransformString(matrix),
                }}
            >
                {renderElements()}
            </div>
        </div>
    );
}

export default CircuitPaper;

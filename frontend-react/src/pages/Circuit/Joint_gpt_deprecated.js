import React, { useEffect, useRef, useContext } from 'react';
import * as joint from 'jointjs';

// Import CSS depuis un fichier externe
import './JointWorkspace.css';

// Contexts
import { CircuitGraphContext, PaperContext } from '../../utils/context';

/* --------------------------------------------------------------------------------
   1) CLASSE ABSTRAITE : Composant
   --------------------------------------------------------------------------------
   Base commune à tous les composants du circuit (rectangle + label).
   On ne l'instancie pas directement, mais on en hérite.
*/
export const Composant = joint.dia.Element.define(
    'app.Composant', // Nom du type dans le namespace "app"
    {
        // Propriétés par défaut
        size: { width: 60, height: 40 },
        attrs: {
            '.label': {
                text: 'Composant (abstract)',
                fill: '#000',
                'text-anchor': 'middle',
                'ref-x': 0.5,
                'ref-y': 0.5,
                'y-alignment': 'middle',
                'font-size': 12,
            },
            '.body': {
                fill: '#FFFFFF',
                stroke: '#000000',
                'stroke-width': 2,
                width: 80,
                height: 40,
            },
            useCSSSelectors: true,
            operation: function () {
                return true;
            },
        },
        // Pas de ports par défaut, on les définira dans les sous-classes
        ports: {
            items: [],
        },
    },
    {
        markup: `
      <g class="rotatable">
        <g class="scalable">
          <rect class="body"/>
        </g>
        <text class="label"/>
      </g>
    `,
    }
);

/* --------------------------------------------------------------------------------
   2) DIPÔLE
   --------------------------------------------------------------------------------
   Hérite de Composant, possède 2 ports (gauche, droite).
*/
export const Dipole = Composant.define('app.Dipole', {
    size: { width: 80, height: 40 },
    ports: {
        items: [
            { id: 'port1', group: 'g1' },
            { id: 'port2', group: 'g2' },
        ],
        groups: {
            g1: {
                position: { name: 'left' },
                attrs: {
                    circle: {
                        r: 4,
                        fill: 'red',
                    },
                },
            },
            g2: {
                position: { name: 'right' },
                attrs: {
                    circle: {
                        r: 4,
                        fill: 'green',
                    },
                },
            },
        },
    },
    attrs: {
        '.label': { text: 'Dipole' },
    },
});

/* --------------------------------------------------------------------------------
   3) TRIPÔLE
   --------------------------------------------------------------------------------
   Hérite de Composant, possède 3 ports (top, left, right).
*/
export const Tripole = Composant.define('app.Tripole', {
    size: { width: 80, height: 60 },
    ports: {
        items: [
            { id: 'p-top', group: 'top' },
            { id: 'p-left', group: 'left' },
            { id: 'p-right', group: 'right' },
        ],
        groups: {
            top: {
                position: { name: 'top' },
                attrs: { circle: { r: 4, fill: 'blue' } },
            },
            left: {
                position: { name: 'left' },
                attrs: { circle: { r: 4, fill: 'blue' } },
            },
            right: {
                position: { name: 'right' },
                attrs: { circle: { r: 4, fill: 'blue' } },
            },
        },
    },
    attrs: {
        '.label': { text: 'Tripole' },
    },
});

/* --------------------------------------------------------------------------------
   4) NOEUD
   --------------------------------------------------------------------------------
   Composant minimaliste (un petit point noir).
   Peut avoir un port unique (et donc on pourra y connecter plusieurs liens).
*/
export const Noeud = joint.dia.Element.define(
    'app.Noeud',
    {
        size: { width: 10, height: 10 },
        attrs: {
            '.body': {
                fill: 'black',
                stroke: 'black',
                'stroke-width': 1,
                width: 10,
                height: 10,
            },
        },
        ports: {
            // Un seul port "any" (mais on peut y connecter un nombre illimité de wires)
            items: [{ id: 'p-any', group: 'any' }],
            groups: {
                any: {
                    position: { name: 'center' },
                    attrs: {
                        circle: {
                            r: 0, // pas de cercle visible ; on se base sur l'élément .body
                        },
                    },
                },
            },
        },
    },
    {
        markup: `
      <g class="rotatable">
        <g class="scalable">
          <rect class="body"/>
        </g>
      </g>
    `,
    }
);

/* --------------------------------------------------------------------------------
   5) WIRE (lien)
   --------------------------------------------------------------------------------
   Lien minimaliste qui peut relier n'importe quel port d'un composant à un autre.
   On utilise un router orthogonal, un style basique pour la ligne, etc.
*/
export const Wire = joint.dia.Link.define(
    'app.Wire',
    {
        attrs: {
            '.connection': {
                stroke: '#000000',
                'stroke-width': 2,
            },
            '.marker-vertex': {
                stroke: '#000000',
                fill: '#FFFFFF',
                r: 6,
            },
        },
        router: { name: 'orthogonal' },
        connector: { name: 'normal', args: { radius: 10 } },
    },
    {
        useCSSSelectors: true,

        vertexMarkup: [
            '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
            '<circle class="marker-vertex" idx="<%= idx %>" r="6" />',
            '</g>',
        ].join(''),
    }
);

export const Resistor = Dipole.define('app.Resistor', {
    attrs: {
        '.label': { text: 'Resistor' },
        '.body': {
            'xlink:href':
                'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIENyZWF0ZWQgd2l0aCBJbmtzY2FwZSAoaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvKSAtLT4NCg0KPHN2Zw0KICAgd2lkdGg9IjY2LjUiDQogICBoZWlnaHQ9IjE1LjU2NTI0NyINCiAgIHZpZXdCb3g9IjAgMCAxNy41OTQ3ODkgNC4xMTgzMDUxIg0KICAgdmVyc2lvbj0iMS4xIg0KICAgaWQ9InN2ZzEiDQogICBpbmtzY2FwZTpleHBvcnQtZmlsZW5hbWU9InN5bWJvbF9jYXBhY2l0b3Iuc3ZnIg0KICAgaW5rc2NhcGU6ZXhwb3J0LXhkcGk9Ijk2Ig0KICAgaW5rc2NhcGU6ZXhwb3J0LXlkcGk9Ijk2Ig0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiDQogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPHNvZGlwb2RpOm5hbWVkdmlldw0KICAgICBpZD0ibmFtZWR2aWV3MSINCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIg0KICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCINCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCINCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIg0KICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iIC8+DQogIDxkZWZzDQogICAgIGlkPSJkZWZzMSIgLz4NCiAgPGcNCiAgICAgaW5rc2NhcGU6bGFiZWw9IkNhbHF1ZSAxIg0KICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIg0KICAgICBpZD0ibGF5ZXIxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC4wOTAxNTAyNSwtMC4wNzA5NjM2OCkiPg0KICAgIDxwYXRoDQogICAgICAgaWQ9InBhdGgzOTcwIg0KICAgICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuOTI2MDQyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpiZXZlbDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICAgIGQ9Ik0gMTcuMjIxOTIxLDIuMTMwMTE2MyBIIDE0LjQ0Mzc5NiBMIDEzLjUxNzc1NSwwLjI3ODAzMzA0IDExLjY2NTY3MSwzLjk4MjE5OTQgOS44MTM1ODc4LDAuMjc4MDMzMDQgNy45NjE1MDQ1LDMuOTgyMTk5NCA2LjEwOTQyMTIsMC4yNzgwMzMwNCA0LjI1NzMzNzksMy45ODIxOTk0IDMuMzMxMjk2MiwyLjEzMDExNjMgSCAwLjU1MzE3MTI2Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2NjIiAvPg0KICA8L2c+DQo8L3N2Zz4NCg==',
        },
    },
});

export const shapes = {
    ...joint.shapes,
    app: {
        Resistor,
    },
};

/* --------------------------------------------------------------------------------
   6) JOINTWORKSPACE
   --------------------------------------------------------------------------------
   Composant React qui crée le paper JointJS et gère le container <div>.
   - onDrop / onDragOver : pour la gestion Drag & Drop
   - circuitGraph, setCircuitGraph : stocker le graph dans un contexte
   - paper, setPaper : stocker le paper dans un contexte
   - graphContainerRef : référence DOM pour y monter le paper JointJS
*/
const JointWorkspace = ({ onDrop, onDragOver }) => {
    const { setCircuitGraph } = useContext(CircuitGraphContext);
    const { setPaper } = useContext(PaperContext);
    const graphContainerRef = useRef(null);
    const graph = new joint.dia.Graph();

    // Dans un useEffect, on crée le paper JointJS une fois le composant monté
    useEffect(() => {
        // Création du paper
        const paperInstance = new joint.dia.Paper({
            el: graphContainerRef.current,
            model: graph,
            width: '100vh',
            height: '45vh',
            gridSize: 20,
            drawGrid: true,
            // Pour activer certains boutons/outils par défaut
            interactive: { linkMove: true },
            defaultLink: () => new Wire(), // pour que le drag-link crée un Wire
            // Autoriser la liaison de tout port à tout autre port :
            validateConnection: function (
                _unusedVs,
                ms,
                _unusedVt,
                mt,
                _unusedEnd,
                _unusedLinkView
            ) {
                // vs = source view ; ms = source magnet (SVG)
                // vt = target view ; mt = target magnet
                // end = 'source' ou 'target'
                // On autorise la connexion si on a au moins un magnet source et un magnet target
                if (ms && mt) return true;
                return false;
            },
        });
        // On stocke le paper et le graph dans le contexte
        setCircuitGraph(graph);
        setPaper(paperInstance);

        // Exemple : on peut ajouter du code ici pour intercepter "change:target"
        // si on veut créer un Noeud automatique à l'intersection d'un link, etc.
    }, []);
    return (
        <>
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                ref={graphContainerRef}
                className="joint-workspace-container"
            />
        </>
    );
};

export default JointWorkspace;

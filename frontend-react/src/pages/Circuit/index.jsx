import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';

import colors from '../../utils/style/colors';
import fonts from './../../utils/style/fonts';

import './logic.css';

import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';

import JointWorkspace from './Joint_alex__deprecated';

import { Resistor } from './Joint_alex__deprecated';

import {
    ThemeContext,
    CircuitGraphContext,
    PaperContext,
} from '../../utils/context';

import symbol_resistor from '../../assets/symbol_resistor.png';
import symbol_inductor from '../../assets/symbol_inductor.png';
import symbol_capacitor from '../../assets/symbol_capacitor.png';
import symbol_aop from '../../assets/symbol_aop.png';
import symbol_bip_npn from '../../assets/symbol_bip_npn.png';
import symbol_bip_pnp from '../../assets/symbol_bip_pnp.png';
import symbol_current_src from '../../assets/symbol_current_src.png';
import symbol_voltage_src from '../../assets/symbol_voltage_src.png';
import symbol_ground from '../../assets/symbol_ground.png';
import symbol_switch from '../../assets/symbol_switch_open.png';
import symbol_voltmeter from '../../assets/symbol_voltmeter.png';
import symbol_amperometer from '../../assets/symbol_amperometer.png';

import Header from '../../components/Header';
import TabbedMenu from '../../components/TabbedMenu/';
import CircuitToolbar from '../../components/CircuitToolbar';
import ChatInterface from '../../components/ChatInterface';
import ComponentToolbox from '../../components/ComponentToolbox';
import TemporalToolbox from '../../components/TemporalToolbox';
import FrequentialToolbox from '../../components/FrequentialToolbox';

import AnalyticResolutionPage from '../../components/AnalyticResolutionPage'; // <-- Page analytique

/********************************************
 *           STYLED COMPONENTS
 ********************************************/
const MainHorizontalContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    gap: 24px;
    margin: 20px 0;
`;

const LeftMenu = styled.div`
    flex: 0 0 40%;
    max-width: 500px;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: width 0.3s ease-in-out;
`;

const MainVerticalContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const Workspace = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 60%;
    background: ${(props) =>
        props.theme === 'dark'
            ? colors.backgroundLight
            : colors.backgroundLight};
    border: 1px solid
        ${(props) =>
            props.theme === 'dark' ? colors.darkGrey : colors.lightGrey2};
    border-radius: 16px;
    padding: 8px;
`;

const CircuitContainer = styled.div`
    position: relative;
    overflow: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${colors.backgroundLight};
`;

const CircuitContent = styled.div`
    border: 2px dashed ${colors.darkGrey};
    transform: ${(props) =>
        `translate(${props.offsetX}px, ${props.offsetY}px) scale(${props.zoom})`};
    transform-origin: ${(props) => `${props.originX}% ${props.originY}%`};
    transition: transform 0.1s ease-out;
    width: 100%;
    height: 100%;
    background-color: ${colors.backgroundLight};
`;

const CircuitToolbarButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const PlacedItemContainer = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;

    /* Exemple de surlignage dynamique */
    ${({ isSelected, isHovered }) => {
        if (isSelected) {
            return `
                border: 2px solid #ff5555; /* Rouge, par exemple */
                border-radius: 10px;
            `;
        } else if (isHovered) {
            return `
                border: 2px dashed #ffaa00; /* Orange en pointillés */
                border-radius: 10px;
            `;
        }
        return '';
    }}
`;

const PoleButton = styled.button`
    background-color: ${colors.primary};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: ${colors.primary};

    &:hover {
        background-color: ${colors.secondary};
        color: white;
    }
`;

const Toolbox = styled.div`
    display: flex;
    justify-content: center;
    border: 2px solid ${colors.primary};
    border-radius: 10px;
    padding: 15px;
    gap: 5px;

    &:hover {
        border-color: ${colors.secondary};
    }
`;

const ImageItem = styled.img`
    width: 100px;
    height: 50px;
    cursor: grab;
    user-select: none;
    background-color: ${colors.backgroundLight};
    border-radius: 10px;
    padding 20px;

    &:hover {
        border-radius: 20px;
    }
`;

const PlacedImage = styled.img`
    width: 100px;
    height: 80px;
    cursor: grab;
`;

const Line = ({ x1, y1, x2, y2, color = 'black', strokeWidth = 2 }) => {
    return (
        <svg
            style={{
                position: 'absolute',
                pointerEvents: 'none',
                overflow: 'visible',
            }}
        >
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

const JointWorkspaceContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${colors.backgroundLight};
    border-radius: 16px;
    padding: 8px;
    border: 1px solid ${colors.lightGrey2};
`;

function useNetlist() {
    const [netlist, setNetlist] = useState([]);

    const addComponent = (component) => {
        setNetlist((prevNetlist) => [...prevNetlist, component]);
    };

    const removeComponentById = (id) => {
        setNetlist((prevNetlist) =>
            prevNetlist.filter((comp) => comp.id !== id)
        );
    };

    return { netlist, addComponent, removeComponentById, setNetlist };
}

function CircuitInterface() {
    const { theme } = useContext(ThemeContext);
    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
    const { paper, setPaper } = useContext(PaperContext);

    // ÉTATS ZOOM + PAN ...
    const [zoom, setZoom] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

    // GESTION NETLIST
    const { netlist, addComponent, removeComponentById, setNetlist } =
        useNetlist();

    // NEW / UPDATED - Compteurs pour générer les noms
    const [componentCount, setComponentCount] = useState({
        resistance: 0,
        bobine: 0,
        condensateur: 0,
    });

    // NEW / UPDATED - Map type -> symbole (pour le "nom" lisible)
    const typeToShortSymbol = {
        resistance: 'R',
        bobine: 'L',
        condensateur: 'C',
    };

    // Valeurs par défaut
    const defaultValues = {
        resistance: 1000, // 1kΩ
        bobine: 0.001, // 1mH
        condensateur: 1e-6, // 1µF
    };

    // ITEMS DISPONIBLES (TOOLBOX)
    const [items] = useState([
        {
            id: 1,
            src: symbol_resistor,
            name: 'Résistance',
            jointJSComponent: Resistor,
            symbole: 'R',
            tag: 'linear',
        },
        {
            id: 2,
            src: symbol_inductor,
            name: 'Inductance',
            jointJSComponent: Resistor,
            symbole: 'L',
            tag: 'linear',
        },
        {
            id: 3,
            src: symbol_capacitor,
            name: 'Condensateur',
            jointJSComponent: Resistor,
            symbole: 'C',
            tag: 'linear',
        },
        {
            id: 4,
            src: symbol_aop,
            name: 'AOP',
            jointJSComponent: Resistor,
            symbole: 'AOP',
            tag: 'linear',
        },
        {
            id: 5,
            src: symbol_bip_npn,
            name: 'Transistor NPN',
            jointJSComponent: Resistor,
            symbole: 'Q',
            tag: 'transistors',
        },
        {
            id: 6,
            src: symbol_bip_pnp,
            name: 'Transistor PNP',
            jointJSComponent: Resistor,
            symbole: 'Q',
            tag: 'transistors',
        },
        {
            id: 7,
            src: symbol_current_src,
            name: 'Source de courant',
            jointJSComponent: Resistor,
            symbole: 'I',
            tag: 'sources',
        },
        {
            id: 8,
            src: symbol_voltage_src,
            name: 'Source de tension',
            jointJSComponent: Resistor,
            symbole: 'V',
            tag: 'sources',
        },
        {
            id: 10,
            src: symbol_ground,
            name: 'Ground',
            jointJSComponent: Resistor,
            symbole: 'GND',
            tag: 'others',
        },
        {
            id: 11,
            src: symbol_switch,
            name: 'Interrupteur',
            jointJSComponent: Resistor,
            symbole: 'S',
            tag: 'others',
        },
        {
            id: 13,
            src: symbol_voltmeter,
            name: 'Voltmètre',
            jointJSComponent: Resistor,
            symbole: 'V',
            tag: 'others',
        },
        {
            id: 14,
            src: symbol_amperometer,
            name: 'Ampèremètre',
            jointJSComponent: Resistor,
            symbole: 'A',
            tag: 'others',
        },
    ]);

    // PLACED ITEMS (Workspace)
    const [placedItems, setPlacedItems] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [history, setHistory] = useState([]);
    const [lastPole, setLastPole] = useState(null);
    const [connections, setConnections] = useState([]);

    // Sélection / Survol
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);

    // GESTION DU DRAG & DROP
    const handleDrop = (e) => {
        e.preventDefault();

        const currentScale = paper.scale();
        const currentTranslate = paper.translate();
        const workspaceBounds = e.target.getBoundingClientRect();

        const x =
            (e.clientX - workspaceBounds.left - currentTranslate.tx) /
            currentScale.sx;
        const y =
            (e.clientY - workspaceBounds.top - currentTranslate.ty) /
            currentScale.sy;

        if (draggingItem) {
            saveHistory();
            setDraggingItem(null);
        } else {
            const draggedItem = JSON.parse(
                e.dataTransfer.getData('text/plain')
            );

            saveHistory();

            // Déclarez une variable pour l'élément à ajouter au graphique
            let element;

            // Ajoutez la logique en fonction du type d'élément
            switch (draggedItem.name) {
                case 'Résistance':
                    element = new Resistor();
                    element.attr('label/text', `Valeur: 100 Ω`); // Afficher la valeur par défaut de la résistance
                    break;

                case 'Inductance':
                    element = new Resistor();
                    element.attr('label/text', `Valeur: 1 H`); // Afficher la valeur par défaut de l'inductance
                    break;

                case 'Condensateur':
                    element = new Resistor();
                    element.attr('label/text', `Valeur: 1 F`); // Afficher la valeur par défaut du condensateur
                    break;

                case 'AOP':
                    element = new Resistor();
                    break;

                default:
                    console.log(
                        "Type d'élément non reconnu:",
                        draggedItem.type
                    );
                    return; // Si le type n'est pas reconnu, on arrête la fonction
            }

            // Positionner l'élément au bon endroit
            element.position(x, y);

            // Ajouter l'élément au graphique
            element.addTo(circuitGraph);

            // Mettre à jour le comptage des composants
            setComponentCount((prev) => {
                const oldCount = prev[draggedItem.type] || 0;
                return {
                    ...prev,
                    [draggedItem.type]: oldCount + 1,
                };
            });
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    // Toolbox => dragStart
    const handleDragStartFromToolbox = (e, item) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(item));
    };

    // Workspace => dragStart
    const handleDragStartPlacedItem = (item) => {
        setDraggingItem(item);
    };

    // Historique
    const saveHistory = () => {
        setHistory((prev) => [
            ...prev,
            {
                connections: [...connections],
                placedItems: [...placedItems],
                netlist: [...netlist],
            },
        ]);
    };

    // Pôles
    const handlePoleClick = (pole, item) => {
        if (lastPole) {
            const newConnection = {
                from: { id: lastPole.item.id, pole: lastPole.pole },
                to: { id: item.id, pole },
            };

            // Vérifiez si la connexion existe déjà
            const connectionIndex = connections.findIndex(
                (conn) =>
                    (conn.from.id === newConnection.from.id &&
                        conn.from.pole === newConnection.from.pole &&
                        conn.to.id === newConnection.to.id &&
                        conn.to.pole === newConnection.to.pole) ||
                    (conn.from.id === newConnection.to.id &&
                        conn.from.pole === newConnection.to.pole &&
                        conn.to.id === newConnection.from.id &&
                        conn.to.pole === newConnection.from.pole)
            );

            saveHistory(); // Sauvegarde avant de modifier

            if (connectionIndex !== -1) {
                // Supprimez la connexion existante
                setConnections((prev) =>
                    prev.filter((_, index) => index !== connectionIndex)
                );
            } else {
                // Ajoutez une nouvelle connexion
                setConnections((prev) => [...prev, newConnection]);
            }
            setLastPole(null); // Réinitialisez après le lien
        } else {
            // Enregistrez ce pôle pour le prochain clic
            setLastPole({ pole, item });
        }
    };

    // Sélection / Survol
    const handleSelectItem = (id) => {
        setSelectedItemId(id);
    };
    const handleHoverItem = (id) => {
        setHoveredItemId(id);
    };
    const handleUnhoverItem = () => {
        setHoveredItemId(null);
    };

    // CALLBACKS ANALYTIQUE
    const handleChangeValue = (id, newValue) => {
        setNetlist((prev) =>
            prev.map((comp) =>
                comp.id === id ? { ...comp, value: Number(newValue) } : comp
            )
        );
    };
    const handleRequestAI = (id) => {
        const comp = netlist.find((item) => item.id === id);
        if (!comp) return;
        alert(`Requête IA pour le composant : ${comp.name}`);
    };
    const handleRemoveComponent = (id) => {
        removeComponentById(id);
        setPlacedItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedItemId === id) setSelectedItemId(null);
        if (hoveredItemId === id) setHoveredItemId(null);
    };

    // Sélection / survol depuis la netlist
    const handleSelectFromNetlist = (id) => setSelectedItemId(id);
    const handleHoverFromNetlist = (id) => setHoveredItemId(id);
    const handleUnhoverFromNetlist = () => setHoveredItemId(null);

    const handleUndo = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setPlacedItems(lastState.placedItems); // Restaure l'état des éléments placés
            setConnections(lastState.connections); // Restaure l'état des connexions
            setNetlist(lastState.netlist); // Restaure l'état de la netlist
            setHistory((prev) => prev.slice(0, -1)); // Supprime le dernier élément de l'historique
        }
    };

    // ZOOM + PAN logic …
    const handleMouseDown = (e) => {
        // 1) Si l'utilisateur a cliqué sur le Workspace lui-même, on désélectionne
        if (e.target === e.currentTarget) {
            setSelectedItemId(null);
        }
        // 2) Ensuite, on enclenche la logique de pan
        setIsPanning(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDownWorkspace = (e) => {
        if (e.target === e.currentTarget) {
            setSelectedItemId(null);
        }
        // 2) Ensuite, on enclenche la logique de pan
        setIsPanning(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDownCircuitContent = (e) => {
        if (e.target === e.currentTarget) {
            setSelectedItemId(null);
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            const dx = e.clientX - lastMousePosition.x;
            const dy = e.clientY - lastMousePosition.y;
            setOffsetX((prevOffsetX) => prevOffsetX + dx);
            setOffsetY((prevOffsetY) => prevOffsetY + dy);
            setLastMousePosition({ x: e.clientX, y: e.clientY });
        }
    };
    const handleMouseUp = () => {
        setIsPanning(false);
    };
    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        if (e.deltaY < 0) {
            setZoom((prevZoom) => Math.min(prevZoom + zoomFactor, 3));
        } else {
            setZoom((prevZoom) => Math.max(prevZoom - zoomFactor, 0.5));
        }
    };
    const resetZoomAndPan = () => {
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        try {
            const response = await fetch('http://localhost:5000/api/circuits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(circuitGraph.getCells()), // Conversion des données en JSON
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l’envoi des données');
            }

            const result = await response.json();
            console.log(result); // Réponse du backend
            alert('Données envoyées avec succès');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l’envoi des données');
        }
    };

    // Menu haut
    const topMenuPages = [
        {
            name: 'Composants',
            content: (
                <ComponentToolbox
                    items={items}
                    handleDragStartFromToolbox={handleDragStartFromToolbox}
                />
            ),
        },
        {
            name: 'Réponse temporelle',
            content: <TemporalToolbox />,
        },
        {
            name: 'Réponse fréquentielle',
            content: <FrequentialToolbox />,
        },
    ];

    // Menu gauche
    const leftMenuPages = [
        {
            name: 'Résolution analytique',
            content: (
                <AnalyticResolutionPage
                    netlist={netlist}
                    onChangeValue={handleChangeValue}
                    onResolutionSubmit={handleSubmit}
                    onRequestAI={handleRequestAI}
                    onRemoveComponent={handleRemoveComponent}
                    // Sélection / Survol
                    selectedItemId={selectedItemId}
                    hoveredItemId={hoveredItemId}
                    onSelect={handleSelectFromNetlist}
                    onHover={handleHoverFromNetlist}
                    onUnhover={handleUnhoverFromNetlist}
                />
            ),
        },
        {
            name: 'Nikola',
            content: <ChatInterface />,
        },
    ];

    return (
        <>
            <Header />
            <MainHorizontalContainer>
                {/* Menu de gauche */}
                <LeftMenu>
                    <TabbedMenu pages={leftMenuPages} theme={theme} />
                </LeftMenu>

                {/* Contenu principal (top tab + workspace) */}
                <MainVerticalContainer>
                    <TabbedMenu pages={topMenuPages} theme={theme} />

                    <JointWorkspaceContainer>
                        {/* Placement du circuit drawer JointJS */}
                        <JointWorkspace
                            onDrop={handleDrop}
                            onDragOver={handleDragOver} // Empêche le comportement par défaut pour permettre le drop
                        />
                    </JointWorkspaceContainer>
                </MainVerticalContainer>
            </MainHorizontalContainer>
        </>
    );
}

export default CircuitInterface;

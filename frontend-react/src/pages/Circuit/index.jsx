import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';

import colors from '../../utils/style/colors';
import fonts from './../../utils/style/fonts';

import './logic.css';

import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';

import JointJSWorkspace from './JointJSWorkspace';

import {
    Repeater,
    Or,
    Not,
    Resistor,
    Inductor,
    Capacitor,
} from './JointJSWorkspace';

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

    // GESTION NETLIST
    const { netlist, addComponent, removeComponentById, setNetlist } =
        useNetlist();

    // NEW / UPDATED - Compteurs pour générer les noms
    const [componentCount, setComponentCount] = useState({
        resistance: 0,
        bobine: 0,
        condensateur: 0,
    });

    // ITEMS DISPONIBLES (TOOLBOX)
    const [componentToolboxItems] = useState([
        {
            id: 1,
            src: symbol_resistor,
            name: 'Résistance',
            symbole: 'R',
            tag: 'linear',
        },
        {
            id: 2,
            src: symbol_inductor,
            name: 'Inductance',
            symbole: 'L',
            tag: 'linear',
        },
        {
            id: 3,
            src: symbol_capacitor,
            name: 'Condensateur',
            symbole: 'C',
            tag: 'linear',
        },
        {
            id: 4,
            src: symbol_aop,
            name: 'AOP',
            symbole: 'AOP',
            tag: 'linear',
        },
        {
            id: 5,
            src: symbol_bip_npn,
            name: 'Transistor NPN',
            symbole: 'Q',
            tag: 'transistors',
        },
        {
            id: 6,
            src: symbol_bip_pnp,
            name: 'Transistor PNP',
            symbole: 'Q',
            tag: 'transistors',
        },
        {
            id: 7,
            src: symbol_current_src,
            name: 'Source de courant',
            symbole: 'I',
            tag: 'sources',
        },
        {
            id: 8,
            src: symbol_voltage_src,
            name: 'Source de tension',
            symbole: 'V',
            tag: 'sources',
        },
        {
            id: 10,
            src: symbol_ground,
            name: 'Ground',
            symbole: 'GND',
            tag: 'others',
        },
        {
            id: 11,
            src: symbol_switch,
            name: 'Interrupteur',
            symbole: 'S',
            tag: 'others',
        },
        {
            id: 13,
            src: symbol_voltmeter,
            name: 'Voltmètre',
            symbole: 'V',
            tag: 'others',
        },
        {
            id: 14,
            src: symbol_amperometer,
            name: 'Ampèremètre',
            symbole: 'A',
            tag: 'others',
        },
    ]);

    // PLACED ITEMS (Workspace)
    const [placedItems, setPlacedItems] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [history, setHistory] = useState([]);
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
                    element.attr('label/text', `Valeur: 100 Ω`);
                    break;

                case 'Inductance':
                    element = new Inductor();
                    element.attr('label/text', `Valeur: 1 H`);
                    break;

                case 'Condensateur':
                    element = new Capacitor();
                    element.attr('label/text', `Valeur: 1 F`); // Afficher la valeur par défaut du condensateur
                    break;

                case 'AOP':
                    element = new Not();
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
    // Pour AnalyticResolutionPage
    const handleSelectFromNetlist = (id) => setSelectedItemId(id);
    const handleHoverFromNetlist = (id) => setHoveredItemId(id);
    const handleUnhoverFromNetlist = () => setHoveredItemId(null);

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
                    items={componentToolboxItems}
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
                        <JointJSWorkspace
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        />
                        {/*<JointJSWorkspace /> Exemple with Paper Component*/}
                    </JointWorkspaceContainer>
                </MainVerticalContainer>
            </MainHorizontalContainer>
        </>
    );
}

export default CircuitInterface;

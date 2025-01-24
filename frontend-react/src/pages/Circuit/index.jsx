import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';

import colors from '../../utils/style/colors';
import fonts from './../../utils/style/fonts';
import { getSmallestUnusedNameIndex } from '../../utils/hooks';

import './logic.css';

import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';

import JointJSWorkspace from './JointJSWorkspace';

import { Resistor, Inductor, Capacitor, AOP, Ground } from './JointJSElements';

import { CircuitInteractionProvider } from '../../utils/context';

import {
    ThemeContext,
    CircuitGraphContext,
    PaperContext,
    CircuitInteractionContext,
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
import ACIButton from '../../components/AnalyticComponentItemButton';
import TabbedMenu from '../../components/TabbedMenu/';
import CircuitToolbar from '../../components/CircuitToolbar';
import ChatInterface from '../../components/ChatInterface';
import ComponentToolbox from '../../components/ComponentToolbox';
import TemporalToolbox from '../../components/TemporalToolbox';
import FrequentialToolbox from '../../components/FrequentialToolbox';
import PhaseToolbox from '../../components/PhaseToolbox';

import TutorialModal from '../../components/TutorialModal';

import AnalyticResolutionPage from '../../components/AnalyticResolutionPage'; // <-- Page analytique

import { getIconAsUrl } from '../../utils/utils';
import {
    VscZoomIn,
    VscZoomOut,
    VscQuestion,
    VscDiscard,
} from 'react-icons/vsc';

/*
let ResolutionResponse = {
    auteur: 'Basile',
    bode_data: {
        freq: [0.0, 0.0, 0.0],
        mag: [0.0, 0.0, 0.0],
        phase: [0.0, 0.0, 0.0],
    },
    date: '2025-01-22',
    description:
        'Circuit test disponible ici https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA6.html',
    equations: [
        'i_{VIN} + \\frac{v_{2} - v_{3}}{R_{2}} = 0',
        'C_{2} p \\left(- v_{1} + v_{3}\\right) + \\frac{- v_{2} + v_{3}}{R_{2}} = 0',
        'C_{1} p v_{1} + C_{2} p \\left(v_{1} - v_{3}\\right) + \\frac{v_{1}}{R_{1}} + \\frac{v_{1}}{L_{1} p} = 0',
        'v_{2} = VIN',
    ],
    explanations: [
        'Loi des noeuds pour le noeud 2',
        'Loi des noeuds pour le noeud 3',
        'Loi des noeuds pour le noeud 1',
        'valeur de la source de tension VIN',
    ],
    id: 1,
    image: 'Capacitor',
    message: 'Circuit updated (basic).',
    netlist:
        'Vin 2 0 Symbolic\nR2 2 3 1000\nR1 1 0 1000\nC1 1 0 1e-06\nC2 3 1 1e-05\nL1 1 0 0.001\n',
    nom: 'circuit',
    solutions: {
        'i_{VIN}':
            '\\frac{- C_{1} C_{2} L_{1} R_{1} VIN p^{3} - C_{2} L_{1} VIN p^{2} - C_{2} R_{1} VIN p}{C_{1} C_{2} L_{1} R_{1} R_{2} p^{3} + C_{1} L_{1} R_{1} p^{2} + C_{2} L_{1} R_{1} p^{2} + C_{2} L_{1} R_{2} p^{2} + C_{2} R_{1} R_{2} p + L_{1} p + R_{1}}',
        'v_{1}':
            '\\frac{C_{2} L_{1} R_{1} VIN p^{2}}{C_{1} C_{2} L_{1} R_{1} R_{2} p^{3} + C_{1} L_{1} R_{1} p^{2} + C_{2} L_{1} R_{1} p^{2} + C_{2} L_{1} R_{2} p^{2} + C_{2} R_{1} R_{2} p + L_{1} p + R_{1}}',
        'v_{2}': 'VIN',
        'v_{3}':
            '\\frac{C_{1} L_{1} R_{1} VIN p^{2} + C_{2} L_{1} R_{1} VIN p^{2} + L_{1} VIN p + R_{1} VIN}{C_{1} C_{2} L_{1} R_{1} R_{2} p^{3} + C_{1} L_{1} R_{1} p^{2} + C_{2} L_{1} R_{1} p^{2} + C_{2} L_{1} R_{2} p^{2} + C_{2} R_{1} R_{2} p + L_{1} p + R_{1}}',
    },
    step_data: {
        input: [0.0, 0.0, 0.0],
        output: [0.0, 0.0, 0.0],
        time: [0.0, 0.0, 0.0],
    },
    transfer_function:
        '\\frac{C_{2} L_{1} R_{1} p^{2}}{C_{1} L_{1} R_{1} p^{2} + C_{2} L_{1} R_{1} p^{2} + L_{1} p + R_{1}}',
};
*/
/********************************************
 *           STYLED COMPONENTS
 ********************************************/

const MainContainer = styled.div`
    padding: 0px 24px;
`;

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

const CircuitToolbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 8px;
`;

const CircuitToolbarButtonContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const StyledInput = styled.input`
    font-size: 2em;
    font-weight: bold;
    color: ${colors.lightText};
    border: 1px solid ${colors.lightBackground};

    border-radius: 8px;
    transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    outline: none;

    &:hover {
        border-color: ${colors.lightGrey2};
    }

    &:focus {
        border-color: ${colors.primary};
        box-shadow: 0 0 5px ${colors.primary};
    }
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
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);

    // Au montage du composant, on ouvre la fenêtre
    useEffect(() => {
        setIsTutorialOpen(true);
    }, []);

    // Fonction pour fermer la fenêtre
    const handleCloseTutorial = () => {
        setIsTutorialOpen(false);
    };

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
    ]);

    // PLACED ITEMS (Workspace)
    const [placedItems, setPlacedItems] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [history, setHistory] = useState([]);
    const [connections, setConnections] = useState([]);

    // Sélection / Survol
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);

    const changeScale = (delta) => {
        const zoomStep = 0.02;
        const minZoom = 0.5;
        const maxZoom = 2;
        const currentScale = paper.scale();
        const newScale = Math.min(
            Math.max(currentScale.sx + delta * zoomStep, minZoom),
            maxZoom
        );

        // Calculate the barycenter of the elements on the paper
        const elements = paper.model.getElements();
        if (elements.length === 0) return;

        const bbox = elements.reduce(
            (acc, el) => acc.union(el.getBBox()),
            elements[0].getBBox()
        );

        const bary_x = bbox.x;
        const bary_y = bbox.y;

        paper.scale(newScale, newScale, bary_x, bary_y);
    };

    const handleZoomIn = () => {
        changeScale(5);
    };

    const handleZoomOut = () => {
        changeScale(-5);
    };

    const handleHelp = () => {
        setIsTutorialOpen(true);
    };

    const handleDiscard = () => {};

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
            let newElement;

            // Assuming `graph` is your JointJS graph instance

            // Replace 'my-type' with the type of element you're looking for
            const typeToCount = draggedItem.symbole;
            const number = getSmallestUnusedNameIndex(
                circuitGraph,
                typeToCount
            );
            const newElementname = draggedItem.symbole + number;
            // Ajoutez la logique en fonction du type d'élément
            switch (draggedItem.name) {
                case 'Résistance':
                    newElement = new Resistor();
                    newElement.attr('label/text', `Valeur: 100 Ω`);
                    break;

                case 'Inductance':
                    newElement = new Inductor();
                    newElement.attr('label/text', `Valeur: 1 H`);
                    break;

                case 'Condensateur':
                    newElement = new Capacitor();
                    newElement.attr('label/text', `Valeur: 1 F`); // Afficher la valeur par défaut du condensateur
                    break;

                case 'AOP':
                    newElement = new AOP();
                    break;

                case 'Ground':
                    newElement = new Ground();
                    break;

                default:
                    console.log(
                        "Type d'élément non reconnu:",
                        draggedItem.name
                    );
                    return; // Si le type n'est pas reconnu, on arrête la fonction
            }
            //ajout du nom du composant
            newElement.setName(newElementname);
            newElement.setSymbol(draggedItem.symbole);
            newElement.setNumber(number);

            // Positionner l'élément au bon endroit
            newElement.position(x, y);

            // Ajouter l'élément au graphique
            newElement.addTo(circuitGraph);

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

    const [bodeResponse, setBodeResponse] = useState(null);
    const [temporalResponse, setTemporalResponse] = useState(null);
    const [ResolutionResponse, setResolutionResponse] = useState(null);

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const handleSubmit = async (e) => {
        setIsSubmitLoading(true);
        e.preventDefault(); // Empêche le rechargement de la page

        try {
            //const response = await fetch(`http://127.0.0.1:5000/solver/equation/1?data=${encodeURIComponent(JSON.stringify(circuitGraph.getCells()))}`, {
            console.log(circuitGraph.getCells());
            /*
            const response = await fetch(
                `http://127.0.0.1:5000/solver/bode/1?i=2&o=1&data=${encodeURIComponent(
                    JSON.stringify(circuitGraph.getCells())
                )}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', // Utile si le serveur attend du JSON
                    },
                }
            );*/

            const response = await fetch(
                `http://127.0.0.1:5000/config/io-numeric/1`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: circuitGraph.getCells(),
                    }),
                }
            );

            /*
            const response = await fetch('http://127.0.0.1:5000/solver/equation/1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(circuitGraph.getCells()), // Conversion des données en JSON
            });*/

            if (!response.ok) {
                setIsSubmitLoading(false);
                throw new Error('Erreur lors de l’envoi des données');
            }

            const result = await response.json();
            console.log(result); // Réponse du backend
            setIsSubmitLoading(false);
            alert('Données envoyées avec succès');
            setBodeResponse(result['bode_data']);
            setTemporalResponse(result['step_data']);
            setResolutionResponse(result);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l’envoi des données');
            setIsSubmitLoading(false);
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
            content: <TemporalToolbox timeData={temporalResponse} />,
        },
        {
            name: 'Réponse fréquentielle',
            content: <FrequentialToolbox timeData={bodeResponse} />,
        },
        {
            name: 'Réponse en phase',
            content: <PhaseToolbox timeData={bodeResponse} />,
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
                    isSubmitLoading={isSubmitLoading}
                    onResolutionSubmit={handleSubmit}
                    onRequestAI={handleRequestAI}
                    onRemoveComponent={handleRemoveComponent}
                    // Sélection / Survol
                    selectedItemId={selectedItemId}
                    hoveredItemId={hoveredItemId}
                    ResolutionResponse={ResolutionResponse}
                />
            ),
        },
        {
            name: 'Nikola',
            content: <ChatInterface />,
        },
    ];

    return (
        <MainContainer>
            <Header />
            <CircuitInteractionProvider>
                <TutorialModal
                    isOpen={isTutorialOpen}
                    onClose={handleCloseTutorial}
                />

                <MainHorizontalContainer>
                    {/* Menu de gauche */}
                    <LeftMenu>
                        <TabbedMenu pages={leftMenuPages} theme={theme} />
                    </LeftMenu>

                    {/* Contenu principal (top tab + workspace) */}
                    <MainVerticalContainer>
                        <TabbedMenu pages={topMenuPages} theme={theme} />

                        <JointWorkspaceContainer>
                            <CircuitToolbarContainer>
                                <StyledInput
                                    type="text"
                                    placeholder="Nom du circuit"
                                />
                                <CircuitToolbarButtonContainer>
                                    <ACIButton
                                        onClick={handleDiscard}
                                        logoUrl={getIconAsUrl(<VscDiscard />)}
                                        size="40px"
                                    />
                                    <ACIButton
                                        onClick={handleZoomIn}
                                        logoUrl={getIconAsUrl(<VscZoomIn />)}
                                        size="40px"
                                    />
                                    <ACIButton
                                        onClick={handleZoomOut}
                                        logoUrl={getIconAsUrl(<VscZoomOut />)}
                                        size="40px"
                                    />
                                    <ACIButton
                                        onClick={handleHelp}
                                        logoUrl={getIconAsUrl(<VscQuestion />)}
                                        size="40px"
                                    />
                                </CircuitToolbarButtonContainer>
                            </CircuitToolbarContainer>
                            <JointJSWorkspace
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            />
                        </JointWorkspaceContainer>
                    </MainVerticalContainer>
                </MainHorizontalContainer>
            </CircuitInteractionProvider>
        </MainContainer>
    );
}

export default CircuitInterface;

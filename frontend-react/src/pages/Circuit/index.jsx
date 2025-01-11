import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';

import colors from '../../utils/style/colors';
import fonts from './../../utils/style/fonts';

import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';

import JointWorkspace from './JointWorkspace';

import item1 from '../../assets/Resistance.png';
import item2 from '../../assets/Bobine.png';
import item3 from '../../assets/Condensateur.png';
import {
    ThemeContext,
    CircuitGraphContext,
    PaperContext,
} from '../../utils/context';

import Header from '../../components/Header';
import TabbedMenu from '../../components/TabbedMenu/';
import CircuitToolbar from '../../components/CircuitToolbar';
import ChatInterface from '../../components/ChatInterface';
import ComponentToolbox from '../../components/ComponentToolbox';

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
        { id: 1, src: item1, type: 'resistance', symbole: 'R' },
        { id: 2, src: item2, type: 'bobine', symbole: 'L' },
        { id: 3, src: item3, type: 'condensateur', symbole: 'C' },
    ]);

    // PLACED ITEMS (Workspace)
    const [placedItems, setPlacedItems] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [history, setHistory] = useState([]);

    // Sélection / Survol
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);

    // GESTION DU DRAG & DROP
    const handleDrop = (e) => {
        e.preventDefault();

        const currentScale = paper.scale(); // Current zoom scale
        const currentTranslate = paper.translate(); // Current translation (panning offsets)
        const workspaceBounds = e.target.getBoundingClientRect(); // Workspace bounding box

        // Calculate logical coordinates considering scaling and translation
        const x =
            (e.clientX - workspaceBounds.left - currentTranslate.tx) /
            currentScale.sx;
        const y =
            (e.clientY - workspaceBounds.top - currentTranslate.ty) /
            currentScale.sy;

        if (draggingItem) {
            // On déplace un item déjà existant
            saveHistory();
            setDraggingItem(null);
        } else {
            // On drop depuis la toolbox => nouvelle instance
            const draggedItem = JSON.parse(
                e.dataTransfer.getData('text/plain')
            );
            saveHistory();

            // Increment component count for this type
            setComponentCount((prev) => {
                const oldCount = prev[draggedItem.type] || 0;
                return {
                    ...prev,
                    [draggedItem.type]: oldCount + 1,
                };
            });

            // Add a new JointJS element at the calculated position
            const ioElement = new joint.shapes.logic.IO({
                position: { x, y },
                attrs: {
                    text: {
                        text: `${draggedItem.symbole} ${
                            componentCount[draggedItem.type] + 1
                        }`,
                    },
                },
            });

            // Update the graph using setCircuitGraph
            circuitGraph.addCell(ioElement);
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
        setHistory((prev) => [...prev, [...placedItems]]);
    };

    // Pôles
    const handlePoleClick = (pole, item) => {
        alert(`Pôle ${pole} cliqué pour l'item #${item.id}`);
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
            content: <h2>Résolution temporelle</h2>,
        },
        {
            name: 'Réponse fréquentielle',
            content: <h2>Résolution fréquentielle</h2>,
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

                body: JSON.stringify(circuitGraph.getLinks()), // Conversion des données en JSON
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
                    <button onClick={handleSubmit}>Résoudre</button>
                    {/* Placement du circuit drawer JointJS */}
                    <JointWorkspace
                        onDrop={handleDrop}
                        onDragOver={handleDragOver} // Empêche le comportement par défaut pour permettre le drop
                    />
                </MainVerticalContainer>
            </MainHorizontalContainer>
        </>
    );
}

export default CircuitInterface;

/* <Workspace
                        theme={theme}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <CircuitToolbar
                            zoom={zoom}
                            setZoom={setZoom}
                            resetZoomAndPan={resetZoomAndPan}
                            handleUndo={() =>
                                console.log('Undo not implemented')
                            }
                            handleDropInTrash={(e) =>
                                console.log('Dropped in trash')
                            }
                            handleDragOver={(e) => e.preventDefault()}
                        />
                        <CircuitContainer
                            theme={theme}
                            onWheel={handleWheel}
                            onMouseDown={handleMouseDownWorkspace}
                        >
                            <CircuitContent
                                zoom={zoom}
                                offsetX={offsetX}
                                offsetY={offsetY}
                                onMouseDown={handleMouseDownCircuitContent}
                            >
                                {placedItems.map((item) => {
                                    const isSelected =
                                        selectedItemId === item.id;
                                    const isHovered = hoveredItemId === item.id;
                                    return (
                                        <PlacedItemContainer
                                            key={item.id}
                                            style={{
                                                top: item.y,
                                                left: item.x,
                                            }}
                                            isSelected={isSelected}
                                            isHovered={isHovered}
                                            onMouseEnter={() =>
                                                handleHoverItem(item.id)
                                            }
                                            onMouseLeave={() =>
                                                handleUnhoverItem()
                                            }
                                            onClick={() =>
                                                handleSelectItem(item.id)
                                            }
                                        >
                                            <PoleButton
                                                onClick={() =>
                                                    handlePoleClick(
                                                        'positif',
                                                        item
                                                    )
                                                }
                                            >
                                                +
                                            </PoleButton>

                                            <PlacedImage
                                                src={item.src}
                                                draggable
                                                onDragStart={() =>
                                                    handleDragStartPlacedItem(
                                                        item
                                                    )
                                                }
                                            />

                                            <PoleButton
                                                onClick={() =>
                                                    handlePoleClick(
                                                        'negatif',
                                                        item
                                                    )
                                                }
                                            >
                                                -
                                            </PoleButton>
                                        </PlacedItemContainer>
                                    );
                                })}
                            </CircuitContent>
                        </CircuitContainer>
                    </Workspace>*/

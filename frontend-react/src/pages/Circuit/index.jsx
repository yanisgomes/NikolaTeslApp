import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';

import colors from '../../utils/style/colors';
import fonts from './../../utils/style/fonts';

import item1 from '../../assets/Resistance.png';
import item2 from '../../assets/Bobine.png';
import item3 from '../../assets/Condensateur.png';
import { ThemeContext } from '../../utils/context/';

import Header from '../../components/Header';
import TabbedMenu from '../../components/TabbedMenu/';
import CircuitToolbar from '../../components/CircuitToolbar';
import ChatInterface from '../../components/ChatInterface';

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

/********************************************
 *                 HOOKS
 ********************************************/
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

/********************************************
 *          COMPOSANT PRINCIPAL
 ********************************************/
function CircuitInterface() {
    const { theme } = useContext(ThemeContext);

    /********************************************
     *        ÉTATS DU ZOOM + PAN
     ********************************************/
    const [zoom, setZoom] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        if (e.deltaY < 0) {
            setZoom((prevZoom) => Math.min(prevZoom + zoomFactor, 3));
        } else {
            setZoom((prevZoom) => Math.max(prevZoom - zoomFactor, 0.5));
        }
    };

    const handleMouseDown = (e) => {
        setIsPanning(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
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

    const resetZoomAndPan = () => {
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
    };

    /********************************************
     *        ÉTAT DE NOTRE NETLIST
     ********************************************/
    const { netlist, addComponent, removeComponentById, setNetlist } =
        useNetlist();

    // Valeurs par défaut (au choix) pour R, L, C :
    const defaultValues = {
        resistance: 1000, // 1 kΩ
        bobine: 0.001, // 1 mH
        condensateur: 0.000001, // 1 µF
    };

    /********************************************
     *  ITEMS DISPONIBLES DANS LA TOOLBOX
     ********************************************/
    const [items] = useState([
        { id: 1, src: item1, type: 'resistance', symbole: 'R' },
        { id: 2, src: item2, type: 'bobine', symbole: 'L' },
        { id: 3, src: item3, type: 'condensateur', symbole: 'C' },
    ]);

    /********************************************
     *  GESTION DES COMPOSANTS PLACÉS (Workspace)
     ********************************************/
    const [placedItems, setPlacedItems] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [history, setHistory] = useState([]);

    // Sauvegarde de l’historique
    const saveHistory = () => {
        setHistory((prev) => [...prev, [...placedItems]]);
    };

    /********************************************
     *   SÉLECTION / SURVOL GLOBAUX (2-WAY)
     ********************************************/
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);

    // Quand on veut sélectionner un composant, on met à jour le state parent :
    const handleSelectItem = (id) => {
        setSelectedItemId(id);
    };

    // Quand on survole un composant :
    const handleHoverItem = (id) => {
        setHoveredItemId(id);
    };
    // Quand on arrête de le survoler :
    const handleUnhoverItem = () => {
        setHoveredItemId(null);
    };

    /********************************************
     *   GESTION DU DRAG & DROP
     ********************************************/
    const handleDrop = (e) => {
        e.preventDefault();
        const workspaceBounds = e.target.getBoundingClientRect();
        const x = (e.clientX - workspaceBounds.left) / zoom;
        const y = (e.clientY - workspaceBounds.top) / zoom;

        if (draggingItem) {
            // On déplace un item déjà placé
            saveHistory();
            setPlacedItems((prev) =>
                prev.map((item) =>
                    item.id === draggingItem.id ? { ...item, x, y } : item
                )
            );
            setDraggingItem(null);
        } else {
            // On dépose un nouvel item depuis la toolbox
            const draggedItem = JSON.parse(
                e.dataTransfer.getData('text/plain')
            );
            saveHistory();

            // Créer l'élément pour le workspace
            const newItem = {
                id: Date.now(),
                src: draggedItem.src,
                x,
                y,
                type: draggedItem.type,
                symbole: draggedItem.symbole,
            };

            // On ajoute au placedItems
            setPlacedItems((prev) => [...prev, newItem]);

            // On ajoute aussi au netlist (Analyse) avec une valeur par défaut
            addComponent({
                id: newItem.id,
                name: draggedItem.type.toUpperCase() + '_' + newItem.id,
                symbole: draggedItem.symbole,
                type: draggedItem.type,
                value: defaultValues[draggedItem.type] || 1, // fallback 1
            });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Départ du drag depuis la toolbox
    const handleDragStartFromToolbox = (e, item) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(item));
    };

    // Départ du drag depuis un item déjà placé
    const handleDragStartPlacedItem = (item) => {
        setDraggingItem(item);
    };

    // Exemple : callback "pôles"
    const handlePoleClick = (pole, item) => {
        alert(`Pôle ${pole} cliqué pour l'item #${item.id}`);
    };

    /********************************************
     *   CALLBACKS POUR LA NETLIST / ANALYTIQUE
     ********************************************/
    // Changer la valeur d'un composant depuis la liste
    const handleChangeValue = (id, newValue) => {
        setNetlist((prev) =>
            prev.map((comp) =>
                comp.id === id ? { ...comp, value: Number(newValue) } : comp
            )
        );
    };

    // Requête IA
    const handleRequestAI = (id) => {
        const comp = netlist.find((item) => item.id === id);
        if (!comp) return;
        alert(
            `Requête IA pour le composant : ${comp.name} (symbole : ${comp.symbole})`
        );
    };

    // Supprimer un composant (depuis la liste analytique)
    const handleRemoveComponent = (id) => {
        // 1) Supprime dans la netlist
        removeComponentById(id);
        // 2) Supprime dans la workspace
        setPlacedItems((prev) => prev.filter((item) => item.id !== id));
        // 3) Si c'était le composant sélectionné, on désélectionne
        if (selectedItemId === id) {
            setSelectedItemId(null);
        }
        // Idem pour le hover
        if (hoveredItemId === id) {
            setHoveredItemId(null);
        }
    };

    // Quand un composant de la liste analytique est sélectionné
    const handleSelectFromNetlist = (id) => {
        setSelectedItemId(id);
    };

    // Quand on survole un composant de la liste analytique
    const handleHoverFromNetlist = (id) => {
        setHoveredItemId(id);
    };
    const handleUnhoverFromNetlist = () => {
        setHoveredItemId(null);
    };

    /********************************************
     *   CONFIGURATION DES DEUX MENUS
     ********************************************/
    const topMenuPages = [
        {
            name: 'Composants',
            content: (
                <>
                    <h2>Crée ton circuit</h2>
                    <Toolbox>
                        {items.map((item) => (
                            <ImageItem
                                key={item.id}
                                src={item.src}
                                draggable
                                onDragStart={(e) =>
                                    handleDragStartFromToolbox(e, item)
                                }
                            />
                        ))}
                    </Toolbox>
                </>
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

    const leftMenuPages = [
        {
            name: 'Résolution analytique',
            content: (
                <AnalyticResolutionPage
                    netlist={netlist}
                    // callbacks
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

    /********************************************
     *   RENDER PRINCIPAL
     ********************************************/
    return (
        <>
            <Header />
            <MainHorizontalContainer>
                {/* Menu de gauche */}
                <LeftMenu>
                    <TabbedMenu pages={leftMenuPages} theme={theme} />
                </LeftMenu>

                {/* Contenu principal (Top tab + Workspace) */}
                <MainVerticalContainer>
                    <TabbedMenu pages={topMenuPages} theme={theme} />

                    <Workspace
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        theme={theme}
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
                            onWheel={handleWheel}
                            onMouseDown={handleMouseDown}
                            theme={theme}
                        >
                            <CircuitContent
                                zoom={zoom}
                                offsetX={offsetX}
                                offsetY={offsetY}
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
                                            {/* Pôle + */}
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

                                            {/* L’image du composant */}
                                            <PlacedImage
                                                src={item.src}
                                                draggable
                                                onDragStart={() =>
                                                    handleDragStartPlacedItem(
                                                        item
                                                    )
                                                }
                                            />

                                            {/* Pôle - */}
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
                    </Workspace>
                </MainVerticalContainer>
            </MainHorizontalContainer>
        </>
    );
}

export default CircuitInterface;

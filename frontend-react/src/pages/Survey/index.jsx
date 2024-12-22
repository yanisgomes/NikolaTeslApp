import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import item1 from '../../assets/Resistance.png';
import item2 from '../../assets/Bobine.png';
import item3 from '../../assets/Condensateur.png';
import { ThemeContext } from '../../utils/context/';
import { symbol } from 'prop-types';

const PlacedItemContainer = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
`;

const SidebarContent = styled.div`
    width: 100%;
    margin-top: 60px;
    text-align: center;
`;

const SidebarRight = styled.div`
    position: absolute;
    top: 120px;
    right: 0;
    height: 100%;
    width: ${(props) => (props.isOpen ? '300px' : '0')};
    backgroundColor: theme === "light" ? "#ffffff" : "#333333",
    color: theme === "light" ? "#000000" : "#ffffff",
    box-shadow: ${(props) =>
        props.isOpen ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none'};
    transition: width 0.3s ease-in-out;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${(props) => (props.isOpen ? '20px' : '0')};
`;

const SidebarLeft = styled.div`
    position: absolute;
    top: 120px;
    left: 0;
    height: 100%;
    width: ${(props) => (props.isOpen ? '300px' : '0')};
    background-color: ${colors.backgroundNight};
    color: ${colors.primary};
    box-shadow: ${(props) =>
        props.isOpen ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none'};
    transition: width 0.3s ease-in-out;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${(props) => (props.isOpen ? '20px' : '0')};
`;

const SidebarTop = styled.div`
    position: relative;
    width: ${(props) =>
        props.isSidebarRightOpen
            ? props.isSidebarLeftOpen
                ? '60%'
                : '70%'
            : props.isSidebarLeftOpen
            ? '70%'
            : '80%'};
    height: ${(props) => (props.isOpen ? '200px' : '0')};
    background-color: ${colors.backgroundLight};
    box-shadow: ${(props) =>
        props.isOpen ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none'};
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${(props) => (props.isOpen ? '20px' : '0')};
    margin: 20px 0;
    margin-right: ${(props) =>
        props.isSidebarRightOpen ? '10%' : '0'}; /* Ajoute un espace à droite */
    margin-left: ${(props) =>
        props.isSidebarLeftOpen ? '10%' : '0'}; /* Ajoute un espace à gauche */
    transition: margin 0.3s ease-in-out; /* Transition uniquement sur la marge */
    transition: height 0.3s ease-in-out;
`;

const ToggleButtonRight = styled.button`
    position: absolute;
    top: 50%;
    right: ${(props) => (props.isOpen ? '300px' : '0')};
    transform: translateY(-50%);
    background-color: ${colors.primary};
    color: white;
    border: none;
    border-radius: 5px 5px 5px 5px;
    cursor: pointer;
    padding: 10px;
    font-size: 18px;
    transition: right 0.3s ease-in-out;
    z-index: 1000;

    &:hover {
        background-color: ${colors.secondary};
    }
`;

const ToggleButtonLeft = styled.button`
    position: absolute;
    top: 50%;
    left: ${(props) => (props.isOpen ? '300px' : '0')};
    transform: translateY(-50%);
    background-color: ${colors.primary};
    color: white;
    border: none;
    border-radius: 5px 5px 5px 5px;
    cursor: pointer;
    padding: 10px;
    font-size: 18px;
    transition: left 0.3s ease-in-out;
    z-index: 1000;

    &:hover {
        background-color: ${colors.secondary};
    }
`;

const ToggleButtonTop = styled.button`
    position: absolute;
    top: ${(props) => (props.isOpen ? '353px' : '90px')};
    transform: translateY(-50%);
    background-color: ${colors.primary};
    color: white;
    border: none;
    border-radius: 5px 5px 5px 5px;
    cursor: pointer;
    padding: 10px;
    font-size: 18px;
    transition: top 0.3s ease-in-out;
    z-index: 1000;

    &:hover {
        background-color: ${colors.secondary};
    }
`;

const PoleButton = styled.button`
    background-color: ${colors.backgroundLight};
    border: 1px solid ${colors.primary};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin: 0 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: ${colors.primary};
    &:hover {
        background-color: ${colors.primary};
        color: white;
    }
`;

const DragAndDropContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;

const Header = styled.h2`
    text-decoration: underline;
    text-decoration-color: ${colors.primary};
`;

const Toolbox = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding: 10px;
    background-color: ${colors.backgroundLight};
    border-radius: 10px;
    box-shadow: 0 0 5px ${colors.primary};
`;

const ImageItem = styled.img`
    width: 120px;
    height: 60px;
    margin: 10px;
    cursor: grab;
    user-select: none;
    &:hover {
        box-shadow: 0 0 5px ${colors.primary};
        transform: scale(1.1);
    }
`;

const WorkspaceContainer = styled.div`
    position: relative;
    overflow: auto;
    width: 100%;
    height: ${(props) => props.height || '600px'};
    background-color: ${colors.backgroundLight};
    transition: width 0.3s ease-in-out;
`;

const WorkspaceContent = styled.div`
    position: absolute;
    transform: ${(props) =>
        `translate(${props.offsetX}px, ${props.offsetY}px) scale(${props.zoom})`};
    transform-origin: ${(props) => `${props.originX}% ${props.originY}%`};
    transition: transform 0.1s ease-out;
    width: 200%;
    height: 200%;
`;

const Workspace = styled.div`
    position: relative;
    border: 2px dashed ${colors.primary};
    border-radius: 5px;
    width: ${(props) =>
        props.isSidebarRightOpen
            ? props.isSidebarLeftOpen
                ? '64%'
                : '72%'
            : props.isSidebarLeftOpen
            ? '72%'
            : '80%'}; /* Fixe la largeur à 80% de l'espace restant */
    height: 600px;
    margin: 20px 0;
    margin-right: ${(props) =>
        props.isSidebarRightOpen ? '10%' : '0'}; /* Ajoute un espace à droite */
    margin-left: ${(props) =>
        props.isSidebarLeftOpen ? '10%' : '0'}; /* Ajoute un espace à gauche */
    background-color: ${colors.backgroundLight};
    transition: margin 0.3s ease-in-out width 0.3s ease-in-out;
    transition: width 0.3s ease-in-out;
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
`;

const PlacedImage = styled.img`
    width: 120px;
    height: 60px;
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: grab;
`;

const TrashBin = styled.div`
    width: 300px;
    height: 200px;
    border: 2px dashed ${colors.primary};
    border-radius: 10px;
    margin-top: 20px;
    background-color: ${colors.backgroundLight};
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${colors.primary};
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    opacity: 0.5;
    &:hover {
        opacity: 1;
    }
`;

const UndoButton = styled.button`
    background-color: ${colors.primary};
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px;
    &:hover {
        background-color: ${colors.secondary};
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

function DragAndDrop() {
    const { theme } = useContext(ThemeContext);
    const [zoom, setZoom] = useState(1); // État pour le niveau de zoom
    const [offsetX, setOffsetX] = useState(0); // État pour le déplacement horizontal
    const [offsetY, setOffsetY] = useState(0); // État pour le déplacement vertical
    const [isPanning, setIsPanning] = useState(false); // État pour savoir si on déplace
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 }); // Position précédente de la souris
    const [isSidebarRightOpen, setSidebarRightOpen] = useState(false);
    const [isSidebarLeftOpen, setSidebarLeftOpen] = useState(false);
    const [isSidebarTopOpen, setSidebarTopOpen] = useState(false);

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        if (e.deltaY < 0) {
            setZoom((prevZoom) => Math.min(prevZoom + zoomFactor, 3)); // Zoom maximum à 3x
        } else {
            setZoom((prevZoom) => Math.max(prevZoom - zoomFactor, 0.5)); // Zoom minimum à 0.5x
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

    const { netlist, addComponent, removeComponentById, setNetlist } =
        useNetlist();
    const [items] = useState([
        { id: 1, src: item1, type: 'resistance', symbole: 'R' },
        { id: 2, src: item2, type: 'bobine', symbole: 'L' },
        { id: 3, src: item3, type: 'condensateur', symbole: 'C' },
    ]);

    const [placedItems, setPlacedItems] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [history, setHistory] = useState([]); // Stocke les états précédents

    const saveHistory = () => {
        setHistory((prev) => [...prev, [...placedItems]]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const workspaceBounds = e.target.getBoundingClientRect();
        const x = (e.clientX - workspaceBounds.left) / zoom;
        const y = (e.clientY - workspaceBounds.top) / zoom;
        const idplus = null;
        const idmoins = null;
        if (draggingItem) {
            saveHistory(); // Sauvegarde avant de modifier placedItems
            // Si on déplace un élément existant
            setPlacedItems((prev) =>
                prev.map((item) =>
                    item.id === draggingItem.id ? { ...item, x, y } : item
                )
            );
            setDraggingItem(null);
        } else {
            // Si on déplace un élément depuis la toolbox
            const draggedItem = JSON.parse(
                e.dataTransfer.getData('text/plain')
            );
            saveHistory(); // Sauvegarde avant de modifier placedItems
            const newItem = {
                id: Date.now(),
                src: draggedItem.src,
                x,
                y,
                type: draggedItem.type,
                symbole: draggedItem.symbole,
            };

            // Ajouter l'élément à la netlist
            addComponent({
                id: newItem.id,
                src: newItem.src,
                x: newItem.x,
                y: newItem.y,
                type: newItem.type,
                idplus,
                idmoins,
                symbole: newItem.symbole,
            });

            setPlacedItems((prev) => [...prev, newItem]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragStartFromToolbox = (e, item) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(item));
    };

    const handleDragStartPlacedItem = (item) => {
        setDraggingItem(item);
    };

    const handleRemoveComponent = (id) => {
        saveHistory(); // Sauvegarde avant de modifier placedItems
        removeComponentById(id);

        // Supprimer aussi de placedItems
        setPlacedItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleDropInTrash = (e) => {
        e.preventDefault();

        // Si un élément est en cours de glisser
        if (draggingItem) {
            // Supprimer l'élément de la netlist et de placedItems
            handleRemoveComponent(draggingItem.id);
            setDraggingItem(null);
        }
    };

    const handlePoleClick = (pole, item) => {
        alert(`Pôle ${pole} cliqué pour ${item.name}`);
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setPlacedItems(lastState); // Restaure l'état précédent
            setNetlist(lastState); // Restaure l'état précédent
            setHistory((prev) => prev.slice(0, -1)); // Supprime le dernier élément de l'historique
        }
    };

    const toggleSidebarRight = () => {
        setSidebarRightOpen((prev) => !prev);
    };

    const toggleSidebarLeft = () => {
        setSidebarLeftOpen((prev) => !prev);
    };

    const toggleSidebarTop = () => {
        setSidebarTopOpen((prev) => !prev);
    };

    return (
        <DragAndDropContainer>
            <SidebarTop
                isOpen={isSidebarTopOpen}
                isSidebarRightOpen={isSidebarRightOpen}
                isSidebarLeftOpen={isSidebarLeftOpen}
            >
                <SidebarContent>yoTop</SidebarContent>
            </SidebarTop>

            <ToggleButtonTop
                isOpen={isSidebarTopOpen}
                onClick={toggleSidebarTop}
                aria-label={
                    isSidebarTopOpen ? 'Fermer le panneau' : 'Ouvrir le panneau'
                }
            >
                {isSidebarTopOpen ? '↑' : '↓'}
            </ToggleButtonTop>

            <Workspace
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                isSidebarRightOpen={isSidebarRightOpen}
                isSidebarLeftOpen={isSidebarLeftOpen}
                isSidebarTopOpen={isSidebarTopOpen}
            >
                <WorkspaceContainer
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    width="600px"
                    height="600px"
                >
                    <WorkspaceContent
                        zoom={zoom}
                        offsetX={offsetX}
                        offsetY={offsetY}
                    >
                        {placedItems.map((item) => (
                            <PlacedItemContainer
                                key={item.id}
                                style={{
                                    top: item.y,
                                    left: item.x,
                                }}
                            >
                                <PoleButton
                                    onClick={() =>
                                        handlePoleClick('positif', item)
                                    }
                                >
                                    +
                                </PoleButton>
                                <PlacedImage
                                    src={item.src}
                                    draggable
                                    onDragStart={() =>
                                        handleDragStartPlacedItem(item)
                                    }
                                />
                                <PoleButton
                                    onClick={() =>
                                        handlePoleClick('negatif', item)
                                    }
                                >
                                    -
                                </PoleButton>
                            </PlacedItemContainer>
                        ))}
                    </WorkspaceContent>
                </WorkspaceContainer>
                <div style={{ marginTop: '10px' }}>
                    <button
                        onClick={() =>
                            setZoom((prev) => Math.min(prev + 0.1, 3))
                        }
                    >
                        Zoom In
                    </button>
                    <button
                        onClick={() =>
                            setZoom((prev) => Math.max(prev - 0.1, 0.5))
                        }
                    >
                        Zoom Out
                    </button>
                    <button onClick={resetZoomAndPan}>Reset</button>
                </div>
            </Workspace>
            {/* Sidebar and Toggle Button */}
            <SidebarRight isOpen={isSidebarRightOpen}>
                <SidebarContent>
                    <h3>Informations</h3>
                    <p>Ajoutez ici des éléments ou des options.</p>
                </SidebarContent>
            </SidebarRight>

            <ToggleButtonRight
                isOpen={isSidebarRightOpen}
                onClick={toggleSidebarRight}
                aria-label={
                    isSidebarRightOpen
                        ? 'Fermer le panneau'
                        : 'Ouvrir le panneau'
                }
            >
                {isSidebarRightOpen ? '→' : '←'}
            </ToggleButtonRight>

            <SidebarLeft isOpen={isSidebarLeftOpen}>
                <SidebarContent>
                    <Header>Créé ton circuit</Header>
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
                    <TrashBin
                        onDrop={handleDropInTrash}
                        onDragOver={handleDragOver}
                    >
                        Déposez ici pour supprimer
                    </TrashBin>
                </SidebarContent>
                yoLeft
            </SidebarLeft>

            <ToggleButtonLeft
                isOpen={isSidebarLeftOpen}
                onClick={toggleSidebarLeft}
                aria-label={
                    isSidebarLeftOpen
                        ? 'Fermer le panneau'
                        : 'Ouvrir le panneau'
                }
            >
                {isSidebarLeftOpen ? '←' : '→'}
            </ToggleButtonLeft>

            <div>
                <h1>Gestionnaire de Netlist</h1>
                <ul>
                    {netlist.map((item) => (
                        <li key={item.id}>
                            {item.name}{' '}
                            <button
                                onClick={() => handleRemoveComponent(item.id)}
                            >
                                Supprimer {item.symbole}
                                {item.id}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <UndoButton onClick={handleUndo}>Annuler (Ctrl+Z)</UndoButton>
            </div>
        </DragAndDropContainer>
    );
}

export default DragAndDrop;

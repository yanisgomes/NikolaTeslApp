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

const MainHorizontalContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;

    gap: 24px;
    margin: 20px 0;
`;

const LeftMenu = styled.div`
    flex: 0 0 40%; /* Ensures the LeftMenu occupies 30% of the container */

    max-width: 500px; /* Optional: Limit maximum width */
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
    &:hover {
        border: 2px dashed ${colors.secondary};
        border-radius: 10px;
        color: white;
    }
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

    const { netlist, addComponent, removeComponentById, setNetlist } =
        useNetlist();
    const [items] = useState([
        { id: 1, src: item1, type: 'resistance', symbole: 'R' },
        { id: 2, src: item2, type: 'bobine', symbole: 'L' },
        { id: 3, src: item3, type: 'condensateur', symbole: 'C' },
    ]);

    const [placedItems, setPlacedItems] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [history, setHistory] = useState([]);

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
            saveHistory();
            setPlacedItems((prev) =>
                prev.map((item) =>
                    item.id === draggingItem.id ? { ...item, x, y } : item
                )
            );
            setDraggingItem(null);
        } else {
            const draggedItem = JSON.parse(
                e.dataTransfer.getData('text/plain')
            );
            saveHistory();
            const newItem = {
                id: Date.now(),
                src: draggedItem.src,
                x,
                y,
                type: draggedItem.type,
                symbole: draggedItem.symbole,
            };

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
        saveHistory();
        removeComponentById(id);
        setPlacedItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleDropInTrash = (e) => {
        e.preventDefault();

        if (draggingItem) {
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
            setPlacedItems(lastState);
            setNetlist(lastState);
            setHistory((prev) => prev.slice(0, -1));
        }
    };

    const topMenuPages = [
        {
            name: 'Composants',
            content: (
                <>
                    <h2>Créé ton circuit</h2>
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
                <>
                    <div>
                        <h2>Résolution détaillée</h2>
                        <ul>
                            {netlist.map((item) => (
                                <li key={item.id}>
                                    {item.name}{' '}
                                    <button
                                        onClick={() =>
                                            handleRemoveComponent(item.id)
                                        }
                                    >
                                        Supprimer {item.symbole}
                                        {item.id}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
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
                <LeftMenu>
                    <TabbedMenu pages={leftMenuPages} theme={theme} />
                </LeftMenu>

                <MainVerticalContainer>
                    <TabbedMenu pages={topMenuPages} theme={theme} />

                    <Workspace
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
                            } // Placeholder
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
                            </CircuitContent>
                        </CircuitContainer>
                    </Workspace>
                </MainVerticalContainer>
            </MainHorizontalContainer>
        </>
    );
}

export default CircuitInterface;

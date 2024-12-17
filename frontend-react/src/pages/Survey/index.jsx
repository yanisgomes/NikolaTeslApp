import { useState } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import item1 from '../../assets/Resistance.png';
import item2 from '../../assets/Bobine.png';
import item3 from '../../assets/Condensateur.png';
import { symbol } from 'prop-types';

const PlacedItemContainer = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
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

const Workspace = styled.div`
    position: relative;
    border: 2px dashed ${colors.primary};
    border-radius: 10px;
    width: 80%;
    height: 400px;
    margin: 20px 0;
    background-color: ${colors.backgroundLight};
`;

const PlacedImage = styled.img`
    width: 120px;
    height: 60px;
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: grab;
`;

const TrashBin = styled.div`
    width: 200px;
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
        const x = e.clientX - workspaceBounds.left;
        const y = e.clientY - workspaceBounds.top;
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

    return (
        <DragAndDropContainer>
            <Header>Créé ton circuit</Header>
            <Toolbox>
                {items.map((item) => (
                    <ImageItem
                        key={item.id}
                        src={item.src}
                        draggable
                        onDragStart={(e) => handleDragStartFromToolbox(e, item)}
                    />
                ))}
            </Toolbox>
            <Workspace onDrop={handleDrop} onDragOver={handleDragOver}>
                {placedItems.map((item) => (
                    <PlacedItemContainer
                        key={item.id}
                        style={{
                            top: item.y,
                            left: item.x,
                        }}
                    >
                        <PoleButton
                            onClick={() => handlePoleClick('positif', item)}
                        >
                            +
                        </PoleButton>
                        <PlacedImage
                            src={item.src}
                            draggable
                            onDragStart={() => handleDragStartPlacedItem(item)}
                        />
                        <PoleButton
                            onClick={() => handlePoleClick('negatif', item)}
                        >
                            -
                        </PoleButton>
                    </PlacedItemContainer>
                ))}
            </Workspace>
            <TrashBin onDrop={handleDropInTrash} onDragOver={handleDragOver}>
                Déposez ici pour supprimer
            </TrashBin>
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

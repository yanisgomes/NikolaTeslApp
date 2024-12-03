import { useState } from "react";
import styled from "styled-components";
import colors from "../../utils/style/colors";

import item1 from "../../assets/Resistance.png";
import item2 from "../../assets/Bobine.png";
import item3 from "../../assets/Condensateur.png";

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

function DragAndDrop() {
    const [items] = useState([
        { id: 1, src: item1 },
        { id: 2, src: item2 },
        { id: 3, src: item3 },
    ]);

    const [placedItems, setPlacedItems] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const workspaceBounds = e.target.getBoundingClientRect();
        const x = e.clientX - workspaceBounds.left;
        const y = e.clientY - workspaceBounds.top;

        if (draggingItem) {
            // Si on déplace un élément existant
            setPlacedItems((prev) =>
                prev.map((item) =>
                    item.id === draggingItem.id ? { ...item, x, y } : item
                )
            );
            setDraggingItem(null);
        } else {
            // Si on déplace un élément depuis la toolbox
            const draggedItem = JSON.parse(e.dataTransfer.getData("text/plain"));
            setPlacedItems((prev) => [
                ...prev,
                { id: Date.now(), src: draggedItem.src, x, y },
            ]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragStartFromToolbox = (e, item) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(item));
    };

    const handleDragStartPlacedItem = (item) => {
        setDraggingItem(item);
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
                    <PlacedImage
                        key={item.id}
                        src={item.src}
                        style={{
                            top: item.y,
                            left: item.x,
                        }}
                        draggable
                        onDragStart={() => handleDragStartPlacedItem(item)}
                    />
                ))}
            </Workspace>
        </DragAndDropContainer>
    );
}

export default DragAndDrop;

// src/components/ComponentToolboxCard/index.jsx

import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

const CardContainer = styled.div`
    min-width: 180px;
    min-height: 160px;
    width: 180px;
    margin: 0 8px;
    background-color: ${colors.backgroundLight};
    border: 1px solid ${colors.lightGrey2};
    color: ${colors.primary};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;

    /* Pour éviter que la carte soit trop plate ou bouge
     On peut ajouter un léger hover si on veut : */
    &:hover {
        border-color: ${colors.primary};
    }
`;

const TopImageWrapper = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.backgroundLight};

    /* On peut ajouter un style à l'image, par exemple un max-height */
    img {
        max-width: 100%;
        max-height: 60px;
        cursor: grab;
    }
`;

const BottomInfoWrapper = styled.div`
    padding: 8px;
    text-align: center;

    h3 {
        margin: 4px 0;
        font-size: 16px;
    }

    p {
        margin: 0;
        font-size: 12px;
        color: ${colors.darkGrey};
    }
`;

/**
 * @param {object} props
 * @param {object} props.item - L'objet représentant le composant (src, name, tag, etc.)
 * @param {function} props.onDragStart - Callback au moment du drag start (depuis l'image)
 */
const ComponentToolboxCard = ({ item, onDragStart }) => {
    return (
        <CardContainer>
            {/* Zone haute : image */}
            <TopImageWrapper>
                <img
                    src={item.src}
                    alt={item.name}
                    draggable
                    onDragStart={(e) => onDragStart(e, item)}
                />
            </TopImageWrapper>

            {/* Zone basse : nom + tag */}
            <BottomInfoWrapper>
                <h3>{item.name}</h3>
                <p>{item.tag}</p>
            </BottomInfoWrapper>
        </CardContainer>
    );
};

export default ComponentToolboxCard;

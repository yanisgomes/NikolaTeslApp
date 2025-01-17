// src/components/ComponentToolboxCard/index.jsx

import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

import ACIButton from './../AnalyticComponentItemButton';

import { getIconAsUrl } from '../../utils/utils';

import { VscSparkle } from 'react-icons/vsc';

const VscSparkleUrl = getIconAsUrl(<VscSparkle />);

const tagColors = {
    linear: '#A8D5BA',
    transistors: '#F7A9A8',
    sources: '#A8D2F7',
    others: '#C6C6C6',
};

const CardContainer = styled.div`
    position: relative;
    min-width: 180px;
    min-height: 140px;
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
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        cursor: grab;
    }

    &.dragging {
        opacity: 0.8;
        transform: scale(1.02);
        cursor: grabbing;
    }
`;

const TopImageWrapper = styled.div`
    width: 100%;
    height: 9vh;
    background-color: ${colors.backgroundLight};
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 80%;
        max-height: 80px;
    }
`;

const BottomInfoWrapper = styled.div`
    width: 100%;
    padding: 8px;
    text-align: left;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3 {
        font-size: 16px;
        margin: 0 0 4px 0; /* On peut ajuster la marge */
    }
`;

/**
 * Ligne contenant à la fois le TagBadge et le bouton (ACIButton).
 * On les place côte à côte horizontalement.
 */
const InfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between; /* espace maximal entre les éléments */
`;

/**
 * TagBadge (couleur selon item.tag).
 */
const TagBadge = styled.span`
    display: inline-block;
    padding: 4px 4px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    background-color: ${(props) => tagColors[props.tag] || '#9E9E9E'};
    text-transform: capitalize;
    min-width: fit-content;
`;

/**
 * Conteneur du bouton AI : opacité nulle par défaut.
 * Au survol de la carte (CardContainer:hover), on le rend visible.
 * -> On utilise un sélecteur "parent:hover child" via le styled-components.
 */
const ActionButtonContainer = styled.div`
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none; /* Pour éviter les clics quand invisible */

    /* Quand on survole le conteneur global, on rend ce bouton visible. */
    ${CardContainer}:hover & {
        opacity: 1;
        pointer-events: auto; /* Permet de cliquer sur le bouton */
    }
`;

// ------------------------------------------------------
// Composant principal : ComponentToolboxCard
// ------------------------------------------------------

const ComponentToolboxCard = ({ item, onDragStart }) => {
    const imageRef = React.useRef(null);

    // Handler du dragStart
    const handleDragStart = (e) => {
        // On prévient le callback parent
        onDragStart(e, item);

        // On utilise l'image principale comme "ghost image"
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const offsetX = rect.width / 2;
            const offsetY = rect.height / 2;

            e.dataTransfer.setDragImage(imageRef.current, offsetX, offsetY);
        }
    };

    // Par exemple, l'action AI
    const onRequestAI = () => {
        alert(`AI request on ${item.name}`);
    };

    return (
        <CardContainer draggable onDragStart={handleDragStart}>
            <TopImageWrapper>
                <img ref={imageRef} src={item.src} alt={item.name} />
            </TopImageWrapper>

            <BottomInfoWrapper>
                <h3>{item.name}</h3>
                <InfoRow>
                    <TagBadge tag={item.tag}>{item.tag}</TagBadge>

                    {/* Bouton caché par défaut, visible au hover de la carte */}
                    <ActionButtonContainer>
                        <ACIButton
                            onClick={onRequestAI}
                            logoUrl={VscSparkleUrl} // Ou VscSparkleUrl si c'est un import spécial
                            size="30px"
                        />
                    </ActionButtonContainer>
                </InfoRow>
            </BottomInfoWrapper>
        </CardContainer>
    );
};

export default ComponentToolboxCard;
